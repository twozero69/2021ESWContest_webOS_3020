/* eslint-disable */
import { openapiGetCenterInfo, openapiSearchCenterDisease } from "./axiosMethods";


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
    const hospitalListPromise = openapiSearchCenterDisease(mkioskty);
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
            hospitalInfo.distance = getGeodistnace(location, {latitude: hospitalInfo.wgs84Lat, longitude: hospitalInfo.wgs84Lon});
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

export {getWPSGeolocation, getMockGeolocation, getHospitalList};