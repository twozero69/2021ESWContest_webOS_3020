/* eslint-disable */
import { openapiGetCenterInfo, openapiSearchCenterDisease, openapiSearchCenterDivision } from "./axiosMethods";


const getWPSGeolocation = () => {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

const getMockGeolocation = () => {
    const latitude = Number(process.env.REACT_APP_WGS84_LATITUDE) + (0.05 * Math.random());
    const longitude = Number(process.env.REACT_APP_WGS84_LONGITUDE) + (0.05 * Math.random());
    return {latitude, longitude};
};

const getHospitalList = async (mkioskty, location) => {
    let hospitalListPromise;
    if(mkioskty.length == 0){
        hospitalListPromise = openapiSearchCenterDivision();
    }
    else{
        hospitalListPromise = openapiSearchCenterDisease(mkioskty);
    }

    const traumaCenterMap = new Map(
        [
            ["A1200002"],
            ["A1700004"],
            ["A1100052"],
            ["A2600011"],
            ["A1300002"],
            ["A2700014"],
            ["A2500001"],
            ["A2800001"],
            ["A1600002"],
            ["A2400002"],
            ["A2300001"],
            ["A1400001"],
            ["A1500002"],
            ["A2100002"],
            ["A2100040"],
            ["A2200001"],
            ["A1100014"],
            ["A2900001"]
        ]
    );

    const hospitalList = await hospitalListPromise;
    console.log('list', hospitalList);

    return await Promise.all(
        hospitalList.map(async ({hpid}) => {
            const hospitalInfo = await openapiGetCenterInfo(hpid);
            hospitalInfo.geodistance = getGeodistnace(location, {latitude: hospitalInfo.wgs84Lat, longitude: hospitalInfo.wgs84Lon});
            hospitalInfo.trauma = traumaCenterMap.has(hpid);
            return hospitalInfo;
        })
    );
};

const degreeToRadian = (degree) => {
    return degree * Math.PI / 180;
}

const getGeodistnace = (start, end) => {
    const earthRadius = 6371;
    const startLatRad = degreeToRadian(start.latitude);
    const startLonRad = degreeToRadian(start.longitude);
    const endLatRad = degreeToRadian(end.latitude);
    const endLonRad = degreeToRadian(end.longitude);
    return Math.acos(Math.sin(startLatRad) * Math.sin(endLatRad) + Math.cos(startLatRad) * Math.cos(endLatRad) * Math.cos(startLonRad - endLonRad)) * earthRadius;
}

const getDistanceString = (distance, unit) => {
    //????????? m??? ??????
    if(unit == "km"){
        distance *= 1000;
    }

    /*
        ?????? ??????
        30?????? -> 5m ??????
        100?????? -> 10m ??????
        300?????? -> 50m ??????
        1000?????? -> 100m ??????, m??????
        ????????? -> 100m??????, km??????
    */
    if(distance <= 30){
        return `${distance - distance % 5}m`;
    }
    else if(distance <= 100){
        return `${distance - distance % 10}m`;
    }
    else if(distance <= 1000){
        return `${distance - distance % 100}m`;
    }
    else{
        return `${(distance - distance % 100) / 1000}km`;
    }
}

const getTimeString = (time, unit) => {
    //????????? minute?????? ??????
    if(unit == "hour"){
        time *= 60;
    }
    else if(unit == "sec"){
        time /= 60;
    }

    /*
        ????????????
        ????????? ?????? 1???
        1????????? -> 1????????? ??????
        60????????? -> ?????????
        ????????? -> ????????????
    */

    if(time <= 1){
        return "1???";
    }
    else if(time < 60){
        return `${time - time % 1}???`;
    }
    else{
        const div = time / 60;
        const mod = time % 60;
        return `${div - mod}?????? ${mod - mod % 1}???`;
    }
}

export {getWPSGeolocation, getMockGeolocation, getHospitalList, getDistanceString, getTimeString};