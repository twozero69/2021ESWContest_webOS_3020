const http = require('http');
const { Server } = require("socket.io");

const httpPort = 4000;
const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let ambulanceSocket;
const hospitalData = {
    hospitalSocket: 123123,
    wards: [
        {
            x: 72,
            y: 60,
            wardNo: 101,
            state: "0"
        },
        {
            x: 72,
            y: 97,
            wardNo: 102,
            state: "0"
        },
        {
            x: 72,
            y: 134,
            wardNo: 103,
            state: "0"
        },
        {
            x: 72,
            y: 171,
            wardNo: 104,
            state: "0"
        },
        
        {
            x: 151,
            y: 60,
            wardNo: 105,
            state: "0"
        },
        {
            x: 151,
            y: 97,
            wardNo: 106,
            state: "0"
        },
        {
            x: 151,
            y: 134,
            wardNo: 107,
            state: "0"
        },
        {
            x: 151,
            y: 171,
            wardNo: 108,
            state: "0"
        },

        {
            x: 212,
            y: 60,
            wardNo: 109,
            state: "0"
        },
        {
            x: 212,
            y: 97,
            wardNo: 110,
            state: "0"
        },
        {
            x: 212,
            y: 134,
            wardNo: 111,
            state: "0"
        },
        {
            x: 212,
            y: 171,
            wardNo: 112,
            state: "0"
        },

        {
            x: 291,
            y: 60,
            wardNo: 113,
            state: "0"
        },
        {
            x: 291,
            y: 97,
            wardNo: 114,
            state: "0"
        },
        {
            x: 291,
            y: 134,
            wardNo: 115,
            state: "0"
        },
        {
            x: 291,
            y: 171,
            wardNo: 116,
            state: "0"
        }
    ],
    equipmentRooms: [
        {
            textX: 218,
            textY: 315,
            points: "184 293, 253 293, 253 309, 285 309, 285 377, 220 377, 220 330, 196 330, 196 377, 184 377",
            roomKind: "CT검사실",
            state: "0"
        },
        {
            textX: 102,
            textY: 295,
            points: "146 238, 146 316, 56 316, 56 271, 115 271, 115 238",
            roomKind: "MRI검사실",
            state: "0"
        },
        {
            textX: 234,
            textY: 260,
            points: "184 226, 285 226, 285 304, 258 304, 258 288, 184 288",
            roomKind: "내시경검사실",
            state: "0"
        }
    ],
    operatingRooms: [
        {
            textX: 403,
            textY: 165,
            points: "351 122, 540 122, 540 153, 449 153, 449 201, 351 201",
            roomNo: 1,
            state: "0"
        },
        {
            textX: 364,
            textY: 264,
            points: "310 226, 417 226, 417 297, 310, 297",
            roomNo: 2,
            state: "0"
        },
    ]
}

io.on("connection", (socket) => {
    //connection init event
    socket.on("deviceType", type => {
        if(type == "hospital"){
            hospitalData.hospitalSocket = socket.id;
            socket.emit("hospitalData", hospitalData);
            console.log(`hospital ${hospitalData.hospitalSocket}`);
        }
        else if(type == "ambulance"){
            ambulanceSocket = socket.id;
            socket.emit("hospitalData", hospitalData);
            console.log(`ambulance: ${ambulanceSocket}`);
        }
    });

    socket.on("patientData", data => {
        console.log(data);
        io.to(hospitalData.hospitalSocket).emit("patientData", data);
    })

    //control hospital event
    socket.on("hospitalLed", data => {
        const converter = {
            "01":{
                roomType: "wards",
                roomIdx: 0 
            },
            "02":{
                roomType: "wards",
                roomIdx: 1
            },
            "03":{
                roomType: "wards",
                roomIdx: 2 
            },
            "04":{
                roomType: "wards",
                roomIdx: 3 
            },
            "05":{
                roomType: "wards",
                roomIdx: 4 
            },
            "06":{
                roomType: "wards",
                roomIdx: 5 
            },
            "07":{
                roomType: "wards",
                roomIdx: 6 
            },
            "08":{
                roomType: "wards",
                roomIdx: 7 
            },
            "09":{
                roomType: "wards",
                roomIdx: 8 
            },
            "10":{
                roomType: "wards",
                roomIdx: 9 
            },
            "11":{
                roomType: "wards",
                roomIdx: 10 
            },
            "12":{
                roomType: "wards",
                roomIdx: 11
            },
            "13":{
                roomType: "wards",
                roomIdx: 12
            },
            "14":{
                roomType: "wards",
                roomIdx: 13
            },
            "15":{
                roomType: "wards",
                roomIdx: 14
            },
            "16":{
                roomType: "wards",
                roomIdx: 15
            },
            "17":{
                roomType: "operatingRooms",
                roomIdx: 0
            },
            "21":{
                roomType: "operatingRooms",
                roomIdx: 1
            },
            "22":{
                roomType: "equipmentRooms",
                roomIdx: 0
            },
            "19":{
                roomType: "equipmentRooms",
                roomIdx: 1
            },
            "20":{
                roomType: "equipmentRooms",
                roomIdx: 2
            }
        }
        const {roomType, roomIdx} = converter[data.roomNumber];
        hospitalData[roomType][roomIdx].state = data.data;
        io.emit("hospitalLed", data);
    });
    socket.on("ambulanceDistance", data => {
        socket.broadcast.emit("ambulanceDistance", data);
    });
    socket.on("disconnect", (reason) => {
        console.log(`socket was disconnect: ${reason}`);
    });

    //video chan event
    socket.on("makeCall", data => {
        console.log(`make call from ${data.from} to ${data.to}`);
        io.to(data.to).emit("makeCall", data);
    });

    socket.on("answerCall", data => {
        console.log(`answer response is ${data.response}`);
        io.to(data.to).emit("answerCall", data);
    });

    socket.on("endCall", data => {
        console.log(`end call from ${data.from}`);
        io.to(data.to).emit("endCall", data);
    });
});

httpServer.listen(httpPort, () => {
    console.log(`http server is running on port ${httpPort}`);
});
