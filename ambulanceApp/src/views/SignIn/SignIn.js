/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./SignIn.css"

const SignIn = () => {
    const history = useHistory();
    const webcamVideo = useRef();
    const [imageCapture, setImageCapture] = useState(null); 
    const [intervalID, setIntervalID] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        getVideo();
    }, []);

    const getVideo = () => {
        window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }, ).then(stream => {
            webcamVideo.current.srcObject = stream;
            const track = stream.getVideoTracks()[0];
            setImageCapture(new imageCapture(track));
        }).catch(error => {
            console.log(error);
        })
    }

    const getImage = () => {
        // imageCapture.grabFrame().then(imageBitmap => {
        //     console.log(imageBitmap);
        // }).catch(error => {
        //     console.log(error);
        // })
    }

    const onSubmit = (event) => {
        event.preventDefault();
    };

    const onEmailChange = (event) => {
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {
        const {target : {value}} = event;
        setPassword(value);
    };

    const onClick = () => {
        history.push('/sign-up');
    };

    const onPlay = () => {
        const newIntervalID = setInterval(getImage, 1000);
        setIntervalID(newIntervalID);
    }

    return(
        <div className="sign-in">
            <video ref={webcamVideo} playsInline autoPlay onPlay={onPlay} />
            <canvas />
            <form onSubmit={onSubmit}>
                <input type="email" value={email} onChange={onEmailChange} required />
                <input type="password" value={password} onChange={onPasswordChange} required />
                <button type="submit">로그인</button>
            </form>
            <button onClick={onClick}>회원가입</button>
        </div>
    );
}

export default SignIn;