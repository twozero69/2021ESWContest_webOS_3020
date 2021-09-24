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

let hospitalSocket;
let ambulanceSocket;

io.on("connection", (socket) => {
    //connection init event
    socket.emit("hospitalInfo", {});

    socket.on("deviceType", type => {
        if(type == "hospital"){
            hospitalSocket = socket.id
        }
        else if(type == "ambulance"){
            ambulanceSocket = socket.id;
        }

        console.log(`${type} was connected`);
    });

    socket.on("patientInfo", data => {
        io.to(hospitalSocket).emit(data);
    })

    //control hospital event
    socket.on("hospitalLed", data => {
        console.log(data);
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
        io.to(data.socketId).emit(data);
    });

    socket.on("answerCall", data => {
        io.to(data.socketId).emit(data);
    })

    socket.on("endCall", data => {
        io.to(data.socketId).emit(data);
    })
});

httpServer.listen(httpPort, () => {
    console.log(`http server is running on port ${httpPort}`);
});
