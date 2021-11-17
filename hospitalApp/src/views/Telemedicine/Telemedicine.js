/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import { socket } from "../../socket";
import "./Telemedicine.css";


const Telemedicine = ({patientData, ambulanceDistance}) => {
    const patientVideo = useRef();
    const hospitalVideo = useRef();
    const connection = useRef();
    const endCallListener = useRef(null);
    const answerCallListener = useRef(null);
    const [stream, setStream] = useState(null);
    const [callerData, setCallerData] = useState({
        from: null,
        signal:null,
        name: ""
    });
    const [receiveFlag, setReceiveFlag] = useState(false);  //true이면 병원에서 걸려온 전화가 있는 상태
    const [callFlag, setCallFlag] = useState(false);    //true이면 병원과 통화중인 상태
    /*
        receiveFlag     callFlag        녹색버튼(callback)          적색버튼(callback)
        false           false           enable(makeCall)            disable
        true            false           enable(answerCall(true))    enable(answerCall(false))
        false           true            disable                     enable(endCall)
        true            true            X                           X
    */

    useEffect(() => {
        //patient video setting
        window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            setStream(stream);
            patientVideo.current.srcObject = stream;
        });

        //web socket setting
        socket.on("makeCall", data => {
            setCallerData(data);
            setReceiveFlag(true);
        });
    }, []);

    const cleanConnection = () => {
        if(answerCallListener.current != null){
            socket.off("answerCall", answerCallListener.current);
            answerCallListener.current = null;
        };

        if(endCallListener.current != null){
            socket.off("endCall", endCallListener.current);
            endCallListener.current = null;
        }

        connection.current.destroy();
        connection.current = null;
    };

    const makeCall = () => {
        console.log("call!!!");

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on("signal", signal => {
            socket.emit("makeCall", {
                signal,
                from: socket.id,
                to: patientData.current.patientSocket
            });
        });

        peer.on("stream", stream => {
            hospitalVideo.current.srcObject = stream;
        });

        answerCallListener.current = data => {
            if(data.response){
                peer.signal(data.signal);
            }
            else{
                setCallFlag(false);
            }
        };

        socket.on("answerCall", answerCallListener.current);

        endCallListener.current = data => {
            if(connection.current){
                cleanConnection();
            }
            setCallerData({
                from: null,
                signal:null,
                name: ""
            });
            setCallFlag(false);
        };

        socket.on("endCall", endCallListener.current);

        connection.current = peer;
        setCallFlag(true);
    };

    const answerCall = response => {
        setReceiveFlag(false);
        if(!response){
            socket.emit("answerCall", {
                response,
                from: socket.id,
                to: patientData.current.patientSocket
            });

            return;
        }

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on("signal", signal => {
            socket.emit("answerCall", {
                response,
                signal,
                from: socket.id,
                to: patientData.current.patientSocket
            });
        });

        peer.on("stream", stream => {
            hospitalVideo.current.srcObject = stream;
        });

        endCallListener.current = data => {
            if(connection.current){
                cleanConnection();
            }
            setCallerData({
                from: null,
                signal:null,
                name: ""
            });
            setCallFlag(false);
        };

        socket.on("endCall", endCallListener.current);

        peer.signal(callerData.signal);
        connection.current = peer;
        setCallFlag(true);
    };

    const endCall = () => {
        socket.emit("endCall", {
            from: socket.id,
            to: patientData.current.patientSocket
        });

        if(connection.current){
            cleanConnection();
        }
        setCallerData({
            from: null,
            signal:null,
            name: ""
        });
        setCallFlag(false);
    }

    let redButtonText = "원격진료 종료";
    if(receiveFlag){
        redButtonText = "원격진료 거절";
    }

    const onGreenClick = () => {
        if(receiveFlag){
            answerCall(true);
        }
        else{
            makeCall();
        }
    };

    const onRedClick = () => {
        if(callFlag){
            endCall();
        }
        else{
            answerCall(false);
        } 
    };

    return(
        <>
            <Header patientData={patientData} name="원격진료" outline="구급차와 영상을 연결하여 환자를 원격진료합니다." ambulanceDistance={ambulanceDistance} />
            <div className="telemedicine">
                <ContentsBox className="hospital-contents" title="구급차영상" >
                    {callFlag && <video ref={hospitalVideo} playsInline autoPlay />}
                </ContentsBox>
                <ContentsBox className="patient-contents" title="병원영상" >
                    <video ref={patientVideo} playsInline autoPlay muted />
                </ContentsBox>
                <ContentsBox className="controll-contents" title="컨트롤바">
                    <Button className="green-button" onClick={onGreenClick} disabled={callFlag}>원격진료 연결</Button>
                    <Button className="red-button" onClick={onRedClick} disabled={!callFlag && !receiveFlag}>{redButtonText}</Button>
                </ContentsBox>
            </div>
        </>
    );
};

export default Telemedicine;