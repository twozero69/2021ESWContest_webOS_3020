import LS2Request from "@enact/webos/LS2Request";

const LS2 = new LS2Request();

const LS2SetConfig = () => {
    const configObject = {
        "com.webos.service.ai.cvlf.serverUrl" : process.env.REACT_APP_THINQ_SERVICE_URL,
        "com.webos.service.ai.cvlf.authServerUrl" : process.env.REACT_APP_THINQ_TOKEN_ISSUE_URL,
        "com.webos.service.ai.cvlf.resource" : "/vision/face/v1/estimation",
        "com.webos.service.ai.cvlf.authResource" : "/v1/cognito",
        "com.webos.service.ai.cvlf.id" : process.env.REACT_APP_THINQ_CLIENT_ID,
        "com.webos.service.ai.cvlf.password" : process.env.REACT_APP_THINQ_CLIENT_PASSWORD,
        "com.webos.service.ai.cvlf.apiKey" : process.env.REACT_APP_THINQ_API_KEY
    };

    LS2.send({
        service: "luna://com.webos.service.config" ,
        method: "setConfig",
        parameters: {
            "configs": configObject
        },
        onComplete: (res) => {
            if(res.returnValue){
                console.log("config success!");
            }
            else{
                console.log(`config fail ${res.errorCode}:${res.errorText}`);
            }
        }
    });
};

const LS2RequestThinqAPI = (file) => {
    LS2.send({
        service: "luna://com.webos.service.ai.cloudface" ,
        method: "request",
        parameters: {
            "file": file
        },
        onComplete: (res) => {
            if(res.returnValue){
                console.log("ai vision success");
                return res.response.result;
            }
            else{
                console.log(res);
            }
        }
    })
}

export default LS2;
export {LS2SetConfig, LS2RequestThinqAPI};