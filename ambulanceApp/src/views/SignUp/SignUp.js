/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { getVideo, visionSignUp } from "../../functions/visionMethods";
import "./SignUp.css"

const SignUp = () => {
    const history = useHistory();
    const webcamVideo = useRef();
    const imageCapture = useRef();
    const faceImage = useRef(); //useState를 써야할지도?
    const faceLandmark = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visionMessage, setvisionMessage] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);

    useEffect(() => {
        console.log(faceImage.current);
        getVideo(webcamVideo, imageCapture);
    }, []);

    const onPlay = () => {
        setRetryFlag(true)
        setvisionMessage("face ID에 사용할 사진을 촬영하세요.");
    }

    const onCapture = async () => {
        setRetryFlag(false);
        setvisionMessage("사진을 촬영하는 중 입니다.")

        const {result, message} = await visionSignUp(imageCapture, faceImage, faceLandmark);
        setvisionMessage(message);

        if(result){
            return;
        }

        setRetryFlag(true);
    }

    const onSignUp = () => {
        if(email.length < 5){
            alert("이메일을 5글자 이상 입력하세요.");
            return;
        }

        if(password.length <5){
            alert("비밀번호를 5글자 이상 입력하세요.");
            return;
        }

        if(password != confirmPassword){
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

         if(faceImage.current == null){
             alert("사진을 촬영해주세요.");
             return;
         }

         
    }

    const onRetry = () => {
        faceImage.current = null;
        faceLandmark.current = null;
        setRetryFlag(true)
    }

    const onReturn = () => {
        history.push("/");
    }

    return(
        <div className="sign-up">
            <div className="sign-up-form">
                <div className="video-form">
                    <div className="video-contents">
                        <video ref={webcamVideo} playsInline autoPlay onPlay={onPlay} />
                        <div>{visionMessage}</div>
                        {retryFlag && <Button value="사진촬영" onClick={onCapture} />}
                        {faceImage.current && <Button value="재시도" onClick={onRetry} />}
                    </div>
                </div>
                <div className="email-form">
                    <div className="email-contents">
                        <h3>회원가입</h3>
                        <label>Email</label>
                        <Input type="text" value={email} setValue={setEmail} placeholder="이메일을 입력하세요." />
                        <label>Password</label>
                        <Input type="password" value={password} setValue={setPassword} placeholder="비밀번호를 입력하세요." />
                        <label>Confirm Password</label>
                        <Input type="password" value={confirmPassword} setValue={setConfirmPassword} placeholder="비밀번호를 다시 입력하세요." />
                        <Button value="회원가입" onClick={onSignUp} />
                        <Button value="뒤로가기" onClick={onReturn} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;