const Service = require('webos-service');
const pkgInfo = require('./package.json');
const http = require('http');
const fs = require('fs');

//서비스생성
const service = new Service(pkgInfo.name);

//메소드설정
let server = null;
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
    })

    //http서버 생성
    server = http.createServer((req, res) => {
        //요청발생시 실행되는 callback
        
        //req.url이랑 생성된 URL객체의 pathname은 어차피 같다.
        const baseURL = "http://localhost:3000"
        const newURL = new URL(req.url, baseURL)
        let pathname = newURL.pathname;
        console.log("request for "+pathname+" received");
    
        if(pathname == "/"){
            pathname = "/index.html";
        }
    
        //파일 읽기
        fs.readFile(pathname.substr(1), (err, data) => {    
    
            if(err){
                console.log(err);
                //responsehead작성 response은 순수 텍스트
                res.writeHead(404, {'Content-Type' : 'text/plain'});
            }
            else {
                //responsehead작성 response는 html문서
                res.writeHead(200, {'Content-Type' : 'text/html'});
                //responsebody작성
                res.write(data.toString());
                // res.write(data); //둘 모두 가능
            }
            
            //responsebody전송
            res.end();
        });
    
    });
    
    server.listen(3000, () => {//서버실행
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

    message.respond({
        message : 'stopped http server'
    });

    //activity를 비활성화
    service.activityManager.complete(keepAlive, (activity) => {
        console.log('completed activity');
    })
});