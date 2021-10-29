const Service = require('webos-service')
const pkgInfo = require('./package.json');
const http = require('http');
const { Server } = require("socket.io");
const initData = require('./initData.json');

//서비스 생성
const service = new Service(pkgInfo.name)
const kindId = 'com.goldentime.hospitalapp.service:1';

let keepAliveActivity;
let hospitalData;
let ambulanceSocket;
let httpServer;
let dataId = null;
let dataRev = null;

//메소드 설정
service.register('startServer', (message) => {
    //서비스를 active상태로 유지하기 위한 activity생성
    service.activityManager.create('keepAlive', (activity) => {
        keepAliveActivity = activity;
        console.log('created activity');
    })

    //서버 실행
    const httpPort = 4000;
    httpServer = http.createServer();
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on("connection", (socket) => {
        console.log("connect!!!");
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
                "01": {
                    roomType: "wards",
                    roomIdx: 0,
                },
                "02": {
                    roomType: "wards",
                    roomIdx: 1,
                },
                "03": {
                    roomType: "wards",
                    roomIdx: 2,
                },
                "04": {
                    roomType: "wards",
                    roomIdx: 3,
                },
                "05": {
                    roomType: "wards",
                    roomIdx: 4,
                },
                "06": {
                    roomType: "wards",
                    roomIdx: 5,
                },
                "07": {
                    roomType: "wards",
                    roomIdx: 6,
                },
                "08": {
                    roomType: "wards",
                    roomIdx: 7,
                },
                "09": {
                    roomType: "wards",
                    roomIdx: 8,
                },
                10: {
                    roomType: "wards",
                    roomIdx: 9,
                },
                11: {
                    roomType: "wards",
                    roomIdx: 10,
                },
                12: {
                    roomType: "wards",
                    roomIdx: 11,
                },
                13: {
                    roomType: "wards",
                    roomIdx: 12,
                },
                14: {
                    roomType: "wards",
                    roomIdx: 13,
                },
                15: {
                    roomType: "wards",
                    roomIdx: 14,
                },
                16: {
                    roomType: "wards",
                    roomIdx: 15,
                },
                17: {
                    roomType: "operatingRooms",
                    roomIdx: 0,
                },
                21: {
                    roomType: "operatingRooms",
                    roomIdx: 1,
                },
                22: {
                    roomType: "equipmentRooms",
                    roomIdx: 0,
                },
                19: {
                    roomType: "equipmentRooms",
                    roomIdx: 1,
                },
                20: {
                    roomType: "equipmentRooms",
                    roomIdx: 2,
                },
            };
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

    message.respond({
        message: "start websocket server"
    });
});

service.register("stopServer", (message) => {
    httpServer.close();
    httpServer = null;

    //keek alive activity를 비활성화
    service.activityManager.complete(keepAliveActivity, (activity) => {
        keepAliveActivity = null;
        console.log('completed activity');
    });

    message.respond({
        message: 'stoped websocket server'
    });
});

service.register('putKind', (message) => {
    service.call('luna://com.webos.service.db/putKind', {
        id: kindId,
        owner: 'com.goldentime.hospitalapp.service'
    }, (response) => {
        message.respond(response.payload);
    });
});

service.register('initData', (message) => {
    service.call('luna://com.webos.service.db/find', {
        query: {
            from: kindId
        }
    }, (response) => {
        const dataList = response.payload.results;
        if(dataList.length != 0){
            dataId = dataList[0]._id;
            dataRev = dataList[0]._rev;
            hospitalData = dataList[0].data;
        }
        else{
            hospitalData = initData;
        }

        message.respond(response.payload);
    });
});

service.register('put', (message) => {
    if(dataId == null){
        service.call('luna://com.webos.service.db/put', {
            objects: [
                {
                    _kind: kindId,
                    data: hospitalData
                }
            ]
        }, (response) => {
            const dataList = response.payload.results;
            dataId = dataList[0].id;
            dataRev = dataList[0].rev;
            message.respond({
                returnValue: true
            });
        });
    }
    else{
        service.call('luna://com.webos.service.db/put', {
            objects: [
                {
                    _kind: kindId,
                    _id: dataId,
                    _rev: dataRev,
                    data: hospitalData
                }
            ]
        }, (response) => {
            const dataList = response.payload.results;
            dataRev = dataList[0].rev;
            message.respond({
                returnValue: true
            });
        });
    }
})