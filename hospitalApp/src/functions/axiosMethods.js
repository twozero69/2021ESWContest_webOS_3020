/* eslint-disable */
import axios from "axios";
import axiosRetry from "axios-retry";

//axios-retry설정 - 실패시 3번 반복
axiosRetry(axios, {
    retries: 3,
    // retryDelay: axiosRetry.exponentialDelay
});

//thinq토큰을 얻기 위한 credentials
const thinqCredentials = window.btoa(`${process.env.REACT_APP_THINQ_CLIENT_ID}:${process.env.REACT_APP_THINQ_CLIENT_PASSWORD}`);

const thinqTokenConfig = {
    baseURL: process.env.REACT_APP_THINQ_TOKEN_ISSUE_URL,
    headers: {
        "Authorization" : `Basic ${thinqCredentials}`,
        "Content-Type" : "application/x-www-form-urlencoded"
    }
};

const thinqGetToken = async () => {
    const {data : {access_token}} = await axios.post("/v1/cognito", {}, thinqTokenConfig);
	thinqServiceConfig.headers.Authorization = access_token;
}


const thinqServiceConfig = {
    // baseURL: process.env.REACT_APP_THINQ_SERVICE_URL,
    headers: {
        "x-api-key" : process.env.REACT_APP_THINQ_API_KEY,
        "Authorization" : null,
        "Content-Type" : "application/octet-stream"
    }
};

const thinqRequestVisionLabs = (byteArray) => {
    return axios.post("/vision/face/v1/estimation", byteArray, thinqServiceConfig);
};

const djangoServerConfig = {
    baseURL: process.env.REACT_APP_VISION_SERVER_URL
};

const djangoGetVector = (base64, faceInfo, landmark) => {
    return axios.post("vision/face/v1/vector", {base64, faceInfo, landmark}, djangoServerConfig);
};

const djangoFaceRecognition = (base64, faceInfo, landmark) => {
    return axios.post("/vision/face/v1/recognition", {base64, faceInfo, landmark}, djangoServerConfig);
};

const openapiServiceConfig = {
    // baseURL: process.env.REACT_APP_OPENAPI_SERVICE_URL
};

const openapiSearchCenterDivision = async () => {
    const queryParams = `?ServiceKey=${process.env.REACT_APP_OPENAPI_API_KEY}&STAGE1=${process.env.REACT_APP_OPENAPI_STAGE1}&pageNo=1&numOfRows=100`;
    const requestURL = `/getEmrrmRltmUsefulSckbdInfoInqire${queryParams}`;
    const {data: {response: {body: {items: {item}}}}} = await axios.get(requestURL, openapiServiceConfig);
    return item;
};

const openapiSearchCenterDisease = async (mkioskty) => {
    const mkiosktyToString = {
        "뇌출혈": "1",
        "뇌경색": "2",
        "심근경색": "3",
        "복부손상": "4",
        "사지접합": "5",
        "응급내시경": "6",
        "응급투석": "7",
        "조산산모": "8",
        "정신질환": "9",
        "신생아": "10",
        "중증화상": "11"
    };

    const smType1 = mkiosktyToString[mkioskty[0]];
    const queryParams = `?ServiceKey=${process.env.REACT_APP_OPENAPI_API_KEY}&STAGE1=${process.env.REACT_APP_OPENAPI_STAGE1}&SM_TYPE=${smType1}&pageNo=1&numOfRows=100`;
    const requestURL = `/getSrsillDissAceptncPosblInfoInqire${queryParams}`;
    const {data: {response: {body: {items: {item}}}}} = await axios.get(requestURL, openapiServiceConfig);

    console.log('item', item);
    /*
        openapi를 사용한 결과 item이 비었을 경우에 예외처리 필요.
    */

    if(mkioskty.length == 1){
        return item;
    }
    else{
        const smType2 = mkiosktyToString[mkioskty[1]];
        const smTypeString = `MKioskTy${smType2}`;

        /*
            두 번째 질병까지 필터링한 결과 해당하는 것이 없을 경우에 대한 예외처리 필요.
            빈 배열이 리턴될 것이기 때문
        */
        return item.filter(element => {
            return element[smTypeString] == "Y";
        });
    }
};

const openapiGetCenterInfo = async (hpid) => {
    const queryParams = `?ServiceKey=${process.env.REACT_APP_OPENAPI_API_KEY}&HPID=${hpid}&pageNo=1&numOfRows=10`;
    const requestURL = `/getEgytBassInfoInqire${queryParams}`;
    const {data: {response: {body: {items: {item}}}}} = await axios.get(requestURL, openapiServiceConfig);
    return item;
};

const tmapGetRoutes = (start, end) => {
    return axios.get("/tmap/routes", {
        baseURL: process.env.REACT_APP_TMAP_SERVICE_URL,
        params: {
            version: 1,
            appKey: process.env.REACT_APP_TMAP_API_KEY,
            startX: start._lng,
            startY: start._lat,
            endX: end._lng,
            endY: end._lat,
            trafficInfo: "Y"
        }
    });
}

export {
    thinqGetToken,
    thinqRequestVisionLabs,
    djangoGetVector,
    djangoFaceRecognition,
    openapiSearchCenterDivision,
    openapiSearchCenterDisease,
    openapiGetCenterInfo,
    tmapGetRoutes
};