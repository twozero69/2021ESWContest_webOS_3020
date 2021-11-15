/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Scroll from "../../components/Scroll/Scroll";
import Select from "../../components/Select/Select";
import { createUserdataInFirestore } from "../../functions/firebaseMethods";
import { LS2createToast } from "../../functions/ls2Methods";
import { getVideo, visionSignUp } from "../../functions/visionMethods";

import "./SignUp.css"

const SignUp = () => {
    const history = useHistory();
    const videoContents = useRef();
    const webcamVideo = useRef();
    const imageCapture = useRef();
    const faceCanvas = useRef();
    const faceContext = useRef();
    const faceImage = useRef();
    const faceInfo = useRef();
    const faceLandmark = useRef();
    const faceVector = useRef();
    const [name, setName] = useState("");
    const [job, setJob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visionMessage, setvisionMessage] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);

    useEffect(() => {
        getVideo(webcamVideo, imageCapture);
        faceContext.current = faceCanvas.current.getContext("2d");
    }, []);

    useEffect(() => {
        if(faceImage.current){
            videoContents.current.classList.add("take-photo");
        }
        else{
            videoContents.current.classList.remove("take-photo");
        }
    }, [faceImage.current]);

    const onPlay = () => {
        setRetryFlag(true)
        setvisionMessage("face ID에 사용할 사진을 촬영하세요.");
        faceCanvas.current.width = webcamVideo.current.videoWidth;
        faceCanvas.current.height = webcamVideo.current.videoHeight;
    }

    const onCapture = async () => {
        setRetryFlag(false);
        setvisionMessage("사진을 촬영하는 중 입니다.")

        const {result, message} = await visionSignUp(imageCapture, faceContext, faceImage, faceInfo, faceLandmark, faceVector);
        setvisionMessage(message);

        if(result){
            return;
        }

        setRetryFlag(true);
    }

    const onSignUp = () => {
        if(name.length == 0){
            LS2createToast("이름을 입력하세요.");
            return;
        }

        if(job == ""){
            LS2createToast("직업을 선택하세요.");
            return;
        }

        if(email.length < 5){
            LS2createToast("이메일을 5글자 이상 입력하세요.");
            return;
        }

        if(password.length <5){
            LS2createToast("비밀번호를 5글자 이상 입력하세요.");
            return;
        }

        if(password != confirmPassword){
            LS2createToast("비밀번호가 일치하지 않습니다.");
            return;
        }

        if(!faceImage.current || !faceInfo.current || !faceLandmark.current || !faceVector.current){
            LS2createToast("사진을 촬영해주세요.");
            return;
        }

        const userdata = {
            uid: uuidv4(),
            faceInfo: faceInfo.current,
            landmark: faceLandmark.current,
            vector: faceVector.current,
            name: name,
            email: email,
            password: password,
            job: job,
            imageURL: "",
            createdAt: Date.now()
        };

        createUserdataInFirestore(faceImage, userdata);
        history.push("/");
    }

    const onRetry = () => {
        faceImage.current = null;
        faceInfo.current = null;
        faceLandmark.current = null;
        faceVector.current = null;
        setRetryFlag(true)
        setvisionMessage("face ID에 사용할 사진을 촬영하세요.");
    }

    const onReturn = () => {
        history.push("/");
    }

    return(
        <div className="sign-up">
            <div className="sign-up-form">
                <div className="video-form">
                    <div ref={videoContents} className="video-contents">
                        <video ref={webcamVideo} playsInline autoPlay muted onPlay={onPlay} />
                        <canvas ref={faceCanvas} />
                        <div>{visionMessage}</div>
                        {retryFlag && <Button onClick={onCapture}>사진촬영</Button>}
                        {faceImage.current && <Button onClick={onRetry}>재시도</Button>}
                    </div>
                </div>
                <div className="email-form">
                    <Scroll className="email-contents">
                        <h2>회원가입</h2>
                        <label htmlFor="name">Name</label>
                        <Input type="text" id="name" value={name} setValue={setName} placeholder="이름을 입력하세요." />
                        <label htmlFor="job">Job</label>
                        <Select id="job" value={job} setValue={setJob} options={["구급대원", "간호사", "의사"]} placeholder="직업을 선택하세요." />
                        <label htmlFor="email">Email</label>
                        <Input type="text" id="email" value={email} setValue={setEmail} placeholder="이메일을 입력하세요." />
                        <label htmlFor="password">Password</label>
                        <Input type="password" id="password" value={password} setValue={setPassword} placeholder="비밀번호를 입력하세요." />
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <Input type="password" id="confirm-password" value={confirmPassword} setValue={setConfirmPassword} placeholder="비밀번호를 다시 입력하세요." />
                        <Button onClick={onSignUp}>회원가입</Button>
                        <Button onClick={onReturn}>뒤로가기</Button>
                    </Scroll>
                </div>
            </div>
        </div>
    );
}

export default SignUp;