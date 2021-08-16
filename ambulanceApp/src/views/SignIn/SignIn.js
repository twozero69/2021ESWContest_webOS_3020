/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Logo from "../../components/Logo/Logo";
import { getVideo, visionSignIn } from "../../functions/visionMethods";

import "./SignIn.css"


const SignIn = ({setLoginFlag, setUser}) => {
    const history = useHistory();
    const webcamVideo = useRef();
    const imageCapture = useRef(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visionMessage, setvisionMessage] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);

    useEffect(() => {
        getVideo(webcamVideo, imageCapture);
    }, []);

    const onPlay = () => {
        setRetryFlag(true)
        setvisionMessage("얼굴인식을 통해 로그인하시려면 버튼을 눌러주세요.");
    }

    const onSignIn = () => {
        //여기서 firebase에서 id password체크
        setLoginFlag(true);
    };

    const goSignUp = () => {
        history.push('/sign-up');
    };

    const onVision = async() => {
        setRetryFlag(false);
        setvisionMessage("얼굴인식 중 입니다.")
        
        const {result, message} = await visionSignIn(imageCapture);
        setvisionMessage(message);

        if(result){
            setTimeout(() => {
                setLoginFlag(true);
            }, 1000);
            return;
        }
        
        setRetryFlag(true);
    };

    return(
        <div className="sign-in">
            <div className="sign-in-form">
                <div className="video-form">
                    <div className="video-contents">
                        <video ref={webcamVideo} playsInline autoPlay onPlay={onPlay} />
                        <div>{visionMessage}</div>
                        {retryFlag && <Button value="face 로그인" onClick={onVision} />}
                    </div>
                </div>
                <div className="email-form">
                    <div className="email-contents">
                        <Logo />
                        <label>Email</label>
                        <Input type="text" value={email} setValue={setEmail} placeholder="이메일을 입력하세요." />
                        <label>Password</label>
                        <Input type="password" value={password} setValue={setPassword} placeholder="비밀번호를 입력하세요." />
                        <Button value="로그인" onClick={onSignIn} />
                        <Button value="회원가입" onClick={goSignUp} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;