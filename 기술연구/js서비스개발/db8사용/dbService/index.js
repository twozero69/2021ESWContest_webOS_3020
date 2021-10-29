const Service = require('webos-service');
const pkgInfo = require('./package.json');

//서비스생성
const service = new Service(pkgInfo.name);

//메소드설정
let keepAlive = null;
let cnt = 0;
let dataId = null;

service.register('startActivity', (message) =>{
    if(keepAlive != null){
        message.respond({
            message : 'activity already start'
        });

        return;
    }

    service.activityManager.create('keepAlive', (activity) => {
        keepAlive = activity;
        console.log('created activity');
    });

    message.respond({
        message : 'start activity'
    });
});

service.register('stopActivity', (message) => {
    if(keepAlive == null){
        message.respond({
            message : 'activity is null'
        })

        return;
    }

    //activity를 비활성화
    service.activityManager.complete(keepAlive, (activity) => {
        console.log('completed activity');
    });

    keepAlive = null;

    message.respond({
        message : 'stop activity'
    });
});

service.register('putKind', (message) => {
    service.call('luna://com.webos.service.db/putKind', {
        id: 'com.app.dbexample.service:1',
        owner: 'com.app.dbexample.service'
    }, (response) => {
        console.log(response);
        message.respond({
            message: 'request putKind',
            payload: response.payload
        });
    });
});

service.register('delKind', (message) => {
    service.call('luna://com.webos.service.db/delKind', {
        id: 'com.app.dbexample.service:1'
    }, (response) => {
        console.log(response);
        message.respond({
            message: 'request delKind',
            payload: response.payload
        });
    });
});

service.register('put', (message) => {
    if(dataId == null){
        service.call('luna://com.webos.service.db/put', {
            objects: [
                {
                    _kind: 'com.app.dbexample.service:1',
                    cnt: cnt
                }
            ]
        }, (response) => {
            cnt++;
            dataId = response.payload.results[0].id;
            console.log(response);
            message.respond({
                message: 'first put',
                payload: response.payload
            });
        });
    }
    else{
        service.call('luna://com.webos.service.db/put', {
            objects: [
                {
                    _kind: 'com.app.dbexample.service:1',
                    _id: dataId,
                    cnt: cnt
                }
            ]
        }, (response) => {
            cnt++;
            console.log(response);
            message.respond({
                message: 'replace put',
                payload: response.payload
            });
        });
    }
});

service.register('get', (message) => {
    service.call('luna://com.webos.service.db/get', {
        ids: [dataId]
    }, (response) => {
        console.log(response);
        message.respond({
            message: 'get',
            payload: response.payload
        });
    });
});

service.register('find', (message) => {
    service.call('luna://com.webos.service.db/find', {
        query: {
            from: 'com.app.dbexample.service:1'
        }
    }, (response) => {
        console.log(response);
        message.respond({
            message: 'find',
            payload: response.payload
        });
    });
});

service.register('search', (message) => {
    service.call('luna://com.webos.service.db/search', {
        query: {
            from: 'com.app.dbexample.service:1'
        }
    }, (response) => {
        console.log(response);
        message.respond({
            message: 'search',
            payload: response.payload
        });
    });
});

//오루가 있는데 못잡겠음
// service.resgister('del', (message) => {
//     service.call('luna://com.webos.service.db/del', {
//         query: {
//             from: 'com.app.dbexample.service:1'
//         }
//     }, (response) => {
//         console.log(response);
//         message.respond({
//             message: 'del',
//             payload: response.payload
//         });
//     });
// });