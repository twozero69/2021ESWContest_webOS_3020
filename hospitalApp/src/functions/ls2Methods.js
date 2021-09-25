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

export {LS2createAlert, LS2createToast};