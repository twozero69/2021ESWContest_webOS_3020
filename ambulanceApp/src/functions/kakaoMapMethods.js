/* eslint-disable */
import { openapiSearchCenterDisease, openapiSearchCenterDivision } from "./axiosMethods";


const getWPSGeolocation = () => {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

const getMockGeolocation = () => {
    const latitude = Number(process.env.REACT_APP_WGS84_LATITUDE) + (0.0005 * Math.random());
    const longitude = Number(process.env.REACT_APP_WGS84_LONGITUDE) + (0.0005 * Math.random());
    return {latitude, longitude};
}

const getHospitalList = async ({severity, mkioskty}) => {
    const hospitalList = [""];
    if(mkioskty){
        const hospitalObject = await openapiSearchCenterDisease(mkioskty);
    }
    else{
        const hospitalObject = await openapiSearchCenterDivision();
    }

    return hospitalList;
}

export {getWPSGeolocation, getMockGeolocation, getHospitalList};