/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { thinqRequestVisionLabs } from "../../axiosMethods";
import "./SignIn.css"

const SignIn = ({setLoginFlag, setUser}) => {
    const history = useHistory();
    const webcamVideo = useRef();
    const intervalID = useRef();
    const [imageCapture, setImageCapture] = useState(null); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        getVideo();

        return () => {
            clearInterval(intervalID.current);
        }
    }, []);

    const getVideo = () => {
        window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {
            webcamVideo.current.srcObject = stream;
            const track = stream.getVideoTracks()[0];
            const newImageCapture = new ImageCapture(track);
            setImageCapture(newImageCapture);
        }).catch(error => {
            console.log(error);
        });
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setLoginFlag(true);
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
        intervalID.current = setInterval(async () => {
            const blob = await imageCapture.takePhoto();
            const buffer = await blob.arrayBuffer();
            const byteArray = new Uint8Array(buffer);
            const result = await thinqRequestVisionLabs(byteArray);
            console.log(result);
        }, 3000);
    }

    return(
        <div className="sign-in">
            <video ref={webcamVideo} playsInline autoPlay onPlay={onPlay} />
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