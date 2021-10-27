const Service = require('webos-service');
const pkgInfo = require('./package.json');
const http = require('http');
const {Server} = require('socket.io')

//서비스생성
const service = new Service(pkgInfo.name);

//메소드설정
let server = null;
let io = null;
let keepAlive;

service.register('startServer', (message) =>{
    if(server != null){
        message.respond({
            message : 'server already start'
        });

        return;
    }

    //서비스를 active상태로 유지하기 위한 activity생성
    service.activityManager.create('keepAlive', (activity) => {
        keepAlive = activity;
        console.log('created activity');
    });

    //http서버 생성
    server = http.createServer();
    io = new Server(server, {
        cors:{
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on("connection", (socket) => {
        socket.emit("id", socket.id);
    });

    server.listen(4000, () => {//서버실행
        console.log("server is running ...");
    });

    message.respond({
        message : 'start http server'
    });
});

service.register('stopServer', (message) => {
    if(server == null){
        message.respond({
            message : 'server is null'
        })

        return;
    }

    server.close();
    server=null;
    io = null;

    message.respond({
        message : 'stopped http server'
    });

    //activity를 비활성화
    service.activityManager.complete(keepAlive, (activity) => {
        console.log('completed activity');
    })
});