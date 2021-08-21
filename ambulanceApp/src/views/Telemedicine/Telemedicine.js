/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Button from "../../components/Button/Button";
import { getVideoWithAudio } from "../../functions/visionMethods";

import "./Telemedicine.css";
import Header from "../../components/Header/Header";

const Telemedicine = () => {
    const patientVideo = useRef();
    const hospitalVideo = useRef();
    const [greenButtonText, setGreenButtonText] = useState("병원과 연결");
    const [redButtonText, setRedButtonText] = useState("연결종료");
    const [callFlag, setCallFlag] = useState(false);

    useEffect(() => {
        getVideoWithAudio(patientVideo);
    });

    const onCall = () => {
        getVideoWithAudio(hospitalVideo);
        setCallFlag(true);
    }

    const onHangUp = () => {
        setCallFlag(false);
    }

    return(
        <>
            <Header name="원격진료" outline="병원에 영상을 연결하여 의사의 지도를 받습니다." />
            <div className="telemedicine">
                <ContentsBox className="hospital-contents" title="병원영상" >
                    {callFlag && <video ref={hospitalVideo} playsInline autoPlay />}
                </ContentsBox>
                <ContentsBox className="patient-contents" title="구급차영상" >
                    <video ref={patientVideo} playsInline autoPlay />
                </ContentsBox>
                <ContentsBox className="controll-contents" title="컨트롤바">
                    <Button className="green-button" onClick={onCall} disabled={callFlag}>{greenButtonText}</Button>
                    <Button className="red-button" onClick={onHangUp} disabled={!callFlag}>{redButtonText}</Button>
                </ContentsBox>
            </div>
        </>
    );
};

export default Telemedicine;