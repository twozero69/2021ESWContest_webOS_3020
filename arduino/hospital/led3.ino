#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

SocketIOclient socketIO;
int pin[13]={25,26,27,19,23,13,5,2};
int room_num=0;
int num_ten=0;
int num_one=0;

void hexdump(const void *mem, uint32_t len, uint8_t cols = 16)
{
  const uint8_t *src = (const uint8_t *)mem;
  Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
  for (uint32_t i = 0; i < len; i++)
  {
    if (i % cols == 0)
    {
      Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
    }
    Serial.printf("%02X ", *src);
    src++;
  }
  Serial.printf("\n");
}

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case sIOtype_DISCONNECT:
    Serial.printf("[IOc] Disconnected!\n");
    break;
  case sIOtype_CONNECT:
    Serial.printf("[IOc] Connected to url: %s\n", payload);

    // join default namespace (no auto join in Socket.IO V3)
    socketIO.send(sIOtype_CONNECT, "/");
    break;
  case sIOtype_EVENT:
    Serial.printf("[IOc] get event: %s\n", payload);
    num_ten=payload[30]-'0';
    num_one=payload[31]-'0';
    room_num=num_ten*10+num_one-1;
    Serial.printf("[OUTPUT] room : %02d\n", room_num);
    if(payload[42]=='0'&&room_num>=16&&room_num<25)
       digitalWrite(pin[room_num-16],HIGH);
    if(payload[42]=='1'&&room_num>=16&&room_num<25)
        digitalWrite(pin[room_num-16],LOW);
    break;
  case sIOtype_ACK:
    Serial.printf("[IOc] get ack: %u\n", length);
    hexdump(payload, length);
    break;
  case sIOtype_ERROR:
    Serial.printf("[IOc] get error: %u\n", length);
    hexdump(payload, length);
    break;
  case sIOtype_BINARY_EVENT:
    Serial.printf("[IOc] get binary: %u\n", length);
    hexdump(payload, length);
    break;
  case sIOtype_BINARY_ACK:
    Serial.printf("[IOc] get binary ack: %u\n", length);
    hexdump(payload, length);
    break;
  }
}

void setup()
{
  // put your setup code here, to run once:
  pinMode(pin[0],OUTPUT);
  pinMode(pin[1],OUTPUT);
  pinMode(pin[2],OUTPUT);
  pinMode(pin[3],OUTPUT);
  pinMode(pin[4],OUTPUT);
  pinMode(pin[5],OUTPUT);
  pinMode(pin[6],OUTPUT);
  pinMode(pin[7],OUTPUT);
  digitalWrite(pin[0],HIGH);
  digitalWrite(pin[1],HIGH);
  digitalWrite(pin[2],HIGH);
  digitalWrite(pin[3],HIGH);
  digitalWrite(pin[4],HIGH);
  digitalWrite(pin[5],HIGH);
  digitalWrite(pin[6],HIGH);
  digitalWrite(pin[7],HIGH);
  Serial.begin(115200);
  /*Serial.setDebugOutput(true);
  digitalWrite(pin[0],LOW);
  digitalWrite(pin[1],LOW);
  digitalWrite(pin[2],LOW);
  digitalWrite(pin[3],LOW);
  digitalWrite(pin[4],LOW);
  digitalWrite(pin[5],LOW);
  digitalWrite(pin[6],LOW);
  digitalWrite(pin[7],LOW);*/

  // Connect to wifi
  WiFi.begin("E10-418_2.4G", "");

  // Wait some time to connect to wifi
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print(".");
    delay(1000);
  }

  // Check if connected to wifi
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("No Wifi!");
    return;
  }
  Serial.println("");
  Serial.printf("[ESP32] Connected to TP-LInk, Connecting to server.\n");

  // server address, port and URL
  socketIO.begin("192.168.0.2", 4000,"/socket.io/?EIO=4");

  // event handler
  socketIO.onEvent(socketIOEvent);
}

void loop()
{
  // put your main code here, to run repeatedly:
  socketIO.loop();

}
