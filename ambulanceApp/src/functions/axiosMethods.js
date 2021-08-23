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

const thinqRequestVisionLabs = (file) => {
    return axios.post("/vision/face/v1/estimation", file, thinqServiceConfig);
};

const djangoServerConfig = {
    baseURL: process.env.REACT_APP_VISION_SERVER_URL
};

const djangoRequestToServer = (blob, landmark) => {
    return axios.post("/vision/face/v1/recognition", {image: blob, landmark}, djangoServerConfig);
};

const djangoGetVector = (base64, landmark) => {
    return axios.post("vision/face/v1/vector", {base64, landmark}, djangoServerConfig);
};

export {thinqGetToken, thinqRequestVisionLabs, djangoRequestToServer, djangoGetVector};