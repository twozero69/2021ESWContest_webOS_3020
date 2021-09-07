/* eslint-disable */
import { useEffect, useRef } from 'react';
import patientMarkImg from "../../../resources/images/36/user-pin-regular-36.png";
import hospitalMarkImg from "../../../resources/images/36/location-plus-regular-36.png";
import { tmapGetRoutes } from '../../functions/axiosMethods';
import "./Map.css";


const Map = ({hospitalList, location: {latitude, longitude}, selectedIdx, setSelectedIdx, setselectedHospitalInfo}) => {
    const map = useRef();
    const hospitalLatLngsRef = useRef();
    const hospitalMarkersRef = useRef();
    const hospitalInfoWindowsRef = useRef();
    const polylineRef = useRef();

    useEffect(() => {
        //LatLng 생성
        const navermaps = window.naver.maps;
        const patientLatLng = new navermaps.LatLng(latitude, longitude);
        const hospitalLatLngs = hospitalList.map(({wgs84Lat, wgs84Lon}) => new navermaps.LatLng(wgs84Lat, wgs84Lon));

        //LatLngBounds생성
        const bounds = new navermaps.LatLngBounds();
        bounds.extend(patientLatLng);
        hospitalLatLngs.forEach(hospitalLatLng => {bounds.extend(hospitalLatLng);});

        //map 적용
        const mapOptions = {
            center: patientLatLng,
            zoom: 13    //15: 300m, 14: 500m, 13: 1000m, 12: 3km
        };
        map.current = new navermaps.Map("map", mapOptions);

        //bounds 설정
        if(hospitalLatLngs.length > 0){
            map.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50});
        }

        //marker 설정
        const htmlIcon = {
            size: new navermaps.Size(45, 45),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(23, 45)
        };

        //환자위치에 marker 생성
        const patientMarker = new navermaps.Marker({
            map: map.current,
            position: patientLatLng,
            icon:{
                url: patientMarkImg,
                ...htmlIcon
            }
        });

        //병원위치에 marker 생성
        const hospitalMarkers = hospitalLatLngs.map((hospitalLatLng) => new navermaps.Marker({
            map: map.current,
            position: hospitalLatLng,
            icon:{
                url: hospitalMarkImg,
                ...htmlIcon
            }
        }));

        //infowindow 생성
        const hospitalInfoWindows = hospitalList.map(({dutyName}) => {
            const contentString = `<h5>${dutyName}</h5>`;

            return new navermaps.InfoWindow({
                content: contentString,
                disableAutoPan: true,
                borderWidth: 0,
                borderColor: "transparent",
                backgroundColor: "transparent",
                anchorColor: "#333D51",
                anchorSize: {
                    width: 10,
                    height: 10
                }
            });
        });

        //event 설정
        navermaps.Event.addListener(patientMarker, "click", () => {
            map.current.setCenter(patientLatLng);
        });

        hospitalMarkers.forEach((hospitalMarker, idx) => {
            navermaps.Event.addListener(hospitalMarker, "click", () => {
                setSelectedIdx(idx);
            });
        });

        //ref에 대입
        hospitalLatLngsRef.current = hospitalLatLngs;
        hospitalMarkersRef.current = hospitalMarkers;
        hospitalInfoWindowsRef.current = hospitalInfoWindows;

    }, []);

    useEffect(async () => {
        if(selectedIdx == -1){
            return;
        }

        //변수생성
        const selectedInfoWindow = hospitalInfoWindowsRef.current[selectedIdx];
        const selectedHospitalLatLng = hospitalLatLngsRef.current[selectedIdx];
        const selectedHospitalInfo = hospitalList[selectedIdx];

        //지도에 선택된 병원과 환자의 위치가 나오도록 지도를 이동.
        const bounds = new window.naver.maps.LatLngBounds();
        bounds.extend({lat: latitude, lng: longitude});
        bounds.extend(selectedHospitalLatLng);
        map.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50});

        //선택된 병원의 infowindow를 지도에 출력. (infowindow는 지도에서 1개만 출력된다. 즉, 다른 infowindow를 출력하면 기존의 infowindow는 알아서 닫힘)
        //디버깅 필요! 자동으로 닫힌다면 메모리 누수는 혹시 있는가?
        selectedInfoWindow.open(map.current, hospitalMarkersRef.current[selectedIdx]);

        //주행관련 정보가 있는지 체크하고 없으면 길찾기 api를 호출하여 
        if(!selectedHospitalInfo.drivingPath){
            const {data: {features}} = await tmapGetRoutes({_lng: longitude, _lat: latitude}, selectedHospitalLatLng);
            const {properties: {totalDistance, totalTime}} = features[0];
            selectedHospitalInfo.drivingDistance = totalDistance;
            selectedHospitalInfo.drivingTime = totalTime;
            selectedHospitalInfo.drivingPath = [];
            features.forEach(({geometry: {type, coordinates}}) => {
                if(type == "Point"){
                    selectedHospitalInfo.drivingPath.push(coordinates);
                }
                else if(type == "LineString") {
                    selectedHospitalInfo.drivingPath.push(...coordinates);
                }
                else{
                    console.log("err", type, coordinates);
                }
            });
        }

        //이전에 그려진 polyline을 지우기.
        if(polylineRef.current){
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        //선택된 병원까지의 경로를 polyline으로 지도에 출력.
        polylineRef.current = new window.naver.maps.Polyline({
            map: map.current,
            path: selectedHospitalInfo.drivingPath,
            strokeColor: "#354649",
            strokeOpacity: 0.7,
            strokeLineCap: "round",
            strokeWeight: 5
        });

        //선택된 병원정보 상태관리
        setselectedHospitalInfo(selectedHospitalInfo);
        
    }, [selectedIdx]);

    return(
        <div id="map"></div>
    );
}

export default Map