/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Button from "../../components/Button/Button";
import { getVideoWithAudio } from "../../functions/visionMethods";
import Header from "../../components/Header/Header";
import { socket } from "../../socket";
import "./Telemedicine.css";


const Telemedicine = () => {
    const patientVideo = useRef();
    const hospitalVideo = useRef();
    const [receiveFlag, setReceiveFlag] = useState(false);
    const [callFlag, setCallFlag] = useState(false);

    let redButtonText = "원격진료 종료";
    if(receiveFlag){
        redButtonText = "원격진료 거절";
    }

    useEffect(() => {
        //patient video setting
        getVideoWithAudio(patientVideo);
        
        //web socket setting
        socket.on("makeCall", data => {

        });

        socket.on("answerCall", data => {
            
        });

        socket.on("endCall", data => {
            setCallFlag(false);
        });

        return () => {
            socket.off("makeCall");
            socket.off("answerCall");
            socket.off("endCall");
        }
    }, []);

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
                    <Button className="green-button" onClick={onCall} disabled={!callFlag || !receiveFlag}>원격진료 연결</Button>
                    <Button className="red-button" onClick={onHangUp} disabled={callFlag || !receiveFlag}>{redButtonText}</Button>
                </ContentsBox>
            </div>
        </>
    );
};

export default Telemedicine;