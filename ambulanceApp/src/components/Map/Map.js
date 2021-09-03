/* eslint-disable */
import { useEffect, useRef } from 'react';
import patientMarkImg from "../../../resources/images/user-pin-regular-36.png";
import hospitalMarkImg from "../../../resources/images/location-plus-regular-36.png";
import hospitalSelectImg from "../../../resources/images/location-plus-regular-36-red.png";
import "./Map.css";

const Map = ({hospitalList, location: {latitude, longitude}, selectedIdx, setSelectedIdx}) => {
    const map = useRef();
    const hospitalLatLngsRef = useRef();
    const hospitalMarkersRef = useRef();
    const hospitalInfoWindowsRef = useRef();

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

        //marker 설정
        const htmlIcon = {
            size: new navermaps.Size(45, 45),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(23, 45)
        };

        //marker 생성
        const patientMarker = new navermaps.Marker({
            map: map.current,
            position: patientLatLng,
            icon:{
                url: patientMarkImg,
                ...htmlIcon
            }
        });

        const hospitalMarkers = hospitalLatLngs.map((hospitalLatLng, idx) => new navermaps.Marker({
            map: map.current,
            position: hospitalLatLng,
            icon:{
                url: hospitalMarkImg,
                ...htmlIcon
            }
        }));

        //infowindow 생성
        const hospitalInfoWindows = hospitalList.map(() => {
            const contentString = "<div>JSX는 불가능한 것으로 보임</div>";
            return new navermaps.InfoWindow({
                content: contentString
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

    useEffect(() => {
        if(selectedIdx == -1){
            return;
        }

        //선택된 병원을 맵 중앙으로 함.
        map.current.setCenter(hospitalLatLngsRef.current[selectedIdx]);

        //선택된 병원의 아이콘을 변경함.(검정색 -> 빨강색)
        hospitalMarkersRef.current[selectedIdx].setIcon({
            url: hospitalSelectImg
        });
        
        //이전에 선택된 병원의 아이콘을 변경함.(빨강색 -> 검정색)
        //추가예정

        //선택된 병원의 infowindow를 지도에 출력. (infowindow는 지도에서 1개만 출력된다. 즉, 다른 infowindow를 출력하면 기존의 infowindow는 알아서 닫힘)
        hospitalInfoWindowsRef.current[selectedIdx].open(map.current, hospitalMarkersRef.current[selectedIdx]);

    }, [selectedIdx]);

    return(
        <div id="map"></div>
    );
}

export default Map