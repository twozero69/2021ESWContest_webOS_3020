import LS2Request from "@enact/webos/LS2Request";
const LS2 = new LS2Request();

const LS2createAlert = (message) => {
    LS2.send({
        service: "luna://com.webos.notification",
        method: "createAlert",
        parameters: {
            message,
            buttons: [
                {
                    label: "확인",
                    focus: true
                }
            ]
        }
    });
};

const LS2createToast = (message) => {
    LS2.send({
        service: "luna://com.webos.notification",
        method: "createToast",
        parameters: {
            message
        }
    });
};

const LS2speakTts = (text) => {
    LS2.send({
        service: "luna://com.webos.service.tts",
        method: "speak",
        parameters: {
            text,
            language: "ko-KR"
        }
    });
};

const LS2startServer = () => {
    LS2.send({
        service: "luna://com.goldentime.hospitalapp.service",
        method: "startServer",
        onComplete: (response) => {
            console.log(response);
        }
    });
};

const LS2stopServer = () => {
    LS2.send({
        service: "luna://com.goldentime.hospitalapp.service",
        method: "stopServer",
        onComplete: (response) => {
            console.log(response);
        }
    });
};

const LS2putKind = () => {
    LS2.send({
        service: "luna://com.goldentime.hospitalapp.service",
        method: "putKind",
        onComplete: (response) => {
            console.log(response);
        }
    });
};

const LS2initData = () => {
    LS2.send({
        service: "luna://com.goldentime.hospitalapp.service",
        method: "initData",
        onComplete: (response) => {
            console.log(response);
        }
    });
}

const LS2putData = () => {
    LS2.send({
        service: "luna://com.goldentime.hospitalapp.service",
        method: "put",
        onComplete: (response) => {
            console.log(response);
        }
    });
};

export {LS2createAlert, LS2createToast, LS2speakTts, LS2startServer, LS2stopServer, LS2putKind, LS2initData, LS2putData};