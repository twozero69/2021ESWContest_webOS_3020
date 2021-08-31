/* eslint-disable */
/* global kakao */
import { useEffect } from "react";
import "./KakaoMap.css"

const KakaoMap = ({map, location: {latitude, longitude}}) => {
    useEffect(() => {
        kakao.maps.load(() => {
            console.log(latitude, longitude);
            const container = window.document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 5,
                draggable: true,
                scrollwheel: true
            };
            map.current = new kakao.maps.Map(container, options);
        });
    }, []);

    return(
        <div id="map"></div>
    );
}

export default KakaoMap;