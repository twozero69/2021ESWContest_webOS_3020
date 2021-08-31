/* eslint-disable */
import { useEffect, useRef } from 'react';
import "./Map.css";

const Map = ({hospitalList, location: {latitude, longitude}, selectedIdx, setSelectedIdx}) => {
    const map = useRef();
    const hospitalLatLngsRef = useRef();

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
            map.current.fitBounds(bounds, { top: 10, right: 10, bottom: 10, left: 10});
        }

        //marker 생성
        const patientMarker = new navermaps.Marker({
            map: map.current,
            position: patientLatLng
        });

        const hospitalMarkers = hospitalLatLngs.map((hospitalLatLng, idx) => new navermaps.Marker({
            map: map.current,
            position: hospitalLatLng
        }));

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
    }, []);

    useEffect(() => {
        if(selectedIdx == -1){
            return;
        }

        map.current.setCenter(hospitalLatLngsRef.current[selectedIdx]);

    }, [selectedIdx]);

    return(
        <div id="map"></div>
    );
}

export default Map