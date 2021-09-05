/* eslint-disable */
import { useEffect, useRef } from 'react';
import patientMarkImg from "../../../resources/images/user-pin-regular-36.png";
import hospitalMarkImg from "../../../resources/images/location-plus-regular-36.png";
import "./Map.css";

const myFunction = () => {
    console.log("눌림");
}

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

        const hospitalMarkers = hospitalLatLngs.map((hospitalLatLng) => new navermaps.Marker({
            map: map.current,
            position: hospitalLatLng,
            icon:{
                url: hospitalMarkImg,
                ...htmlIcon
            }
        }));

        //infowindow 생성
        const hospitalInfoWindows = hospitalList.map(({dutyName, dutyTel3, dutyAddr, distance, trauma, dgidIdName}) => {
            const contentString = [
                '<div class="info-window">',
                    '<div class="info-title">',
                        `<h3>${dutyName} / ${trauma? "외상센터":"응급의료기관"}</h3>`,
                    '</div>',
                    '<div class="info-contents">',
                        '<div class="left-contents">',
                            '<div>',
                                `<img src="${process.env.REACT_APP_IMAGE_BASE_URL}/phone-regular-24.png" />`,
                                `<span>전화번호 ${dutyTel3}</span>`,
                            '</div>',
                            '<div>',
                                `<img src="${process.env.REACT_APP_IMAGE_BASE_URL}/location-plus-regular-24.png" />`,
                                `<span>주소 ${dutyAddr}</span>`,
                            '</div>',
                            '<div>',
                                `<img src="${process.env.REACT_APP_IMAGE_BASE_URL}/trip-regular-24.png" />`,
                                `<span>주행거리 ${distance}</span>`,
                            '</div>',
                            '<div>',
                                `<img src="${process.env.REACT_APP_IMAGE_BASE_URL}/time-regular-24.png" />`,
                                `<span>예상시간 ${distance}</span>`,
                            '</div>',
                        '</div>',
                        '<div class="right-contents">',
                            '<div>',
                                `<img src="${process.env.REACT_APP_IMAGE_BASE_URL}/list-plus-regular-24.png" />`,
                                '<span>진료과목</span>',
                            '</div>',
                            `<div>${dgidIdName}</div>`,
                            '<div>',
                                `<img src="${process.env.REACT_APP_IMAGE_BASE_URL}/list-plus-regular-24.png" />`,
                                '<span>가능수술</span>',
                            '</div>',
                            '<div>',
                                '<button id="connect-btn">병원선정</button>',
                                '<button id="cancel-btn">닫기</button>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');

            return new navermaps.InfoWindow({
                content: contentString,
                disableAutoPan: true,
                borderWidth: 0,
                backgroundColor: "transparent",
                anchorColor: "#333D51",
                maxWidth: 700
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

        //변수생성
        const selectedInfoWindow = hospitalInfoWindowsRef.current[selectedIdx];
        const selectedHospitalLatLng = hospitalLatLngsRef.current[selectedIdx]

        //선택된 병원을 맵 중앙으로 함.
        map.current.setCenter(selectedHospitalLatLng);

        //선택된 병원의 infowindow를 지도에 출력. (infowindow는 지도에서 1개만 출력된다. 즉, 다른 infowindow를 출력하면 기존의 infowindow는 알아서 닫힘)
        selectedInfoWindow.open(map.current, hospitalMarkersRef.current[selectedIdx]);
        
        //infowindow의 "병원선정"버튼에 대한 이벤트 설정.
        window.document.getElementById("connect-btn").onclick = () => {
            //병원과 웹소켓 연결. firebase에서 hpid로 웹소켓의 ip/port읽어와서 연결시도
            //병원에서 승인, 거절 시 상호작용 고려해야 함.
        };

        //infowindow의 "닫기"버튼에 대한 이벤트 설정.
        window.document.getElementById("cancel-btn").onclick = () => {
            selectedInfoWindow.close();
            setSelectedIdx(-1);
        };  

    }, [selectedIdx]);

    return(
        <div id="map"></div>
    );
}

export default Map