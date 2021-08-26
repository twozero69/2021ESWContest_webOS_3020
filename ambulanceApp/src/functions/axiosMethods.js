/* eslint-disable */
import axios from "axios";

const credentials = window.btoa(`${process.env.REACT_APP_THINQ_CLIENT_ID}:${process.env.REACT_APP_THINQ_CLIENT_PASSWORD}`);

const thinqTokenConfig = {
    baseURL: process.env.REACT_APP_THINQ_TOKEN_ISSUE_URL,
    headers: {
        "Authorization" : `Basic ${credentials}`,
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

const openapiGetEmergencyCenter = ({latitude, longitude}) => {
    return axios.get("/getEgytListInfoInqire", {
        baseURL: process.env.REACT_APP_OPENAPI_SERVICE_URL,
        params: {
            ServiceKey: process.env.REACT_APP_OPENAPI_API_KEY,
            WGS84_LON: longitude,
            WGS84_LAT: latitude
        }
    });
};

const openapiGetTraumaCenter = ({latitude, longitude}) => {
    return axios.get("/getStrmBassInfoInqire", {
        baseURL: process.env.REACT_APP_OPENAPI_SERVICE_URL,
        params: {
            ServiceKey: process.env.REACT_APP_OPENAPI_API_KEY,
            WGS84_LON: longitude,
            WGS84_LAT: latitude
        }
    });
};

export {thinqGetToken, thinqRequestVisionLabs, djangoFaceRecognition, djangoGetVector, openapiGetEmergencyCenter};