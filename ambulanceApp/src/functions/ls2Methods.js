import LS2Request from "@enact/webos/LS2Request";

const LS2 = new LS2Request();

const LS2LocationEnable = () => {
    LS2.send({
        service: "luna://com.webos.service.location",
        method: "setState",
        parameters: {
            Handler: "network",
            state: true
        },
        onComplete: (res) => {
            if(res.returnValue){
                console.log("locations enable");
            }
            else{
                console.log(res);
            }
        }
    })
}

export default LS2;
export {LS2LocationEnable};