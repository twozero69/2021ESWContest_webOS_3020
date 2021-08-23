/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header"
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { getVideo, visionGetAttributes } from "../../functions/visionMethods";
import "./AddPatient.css";

const AddPatient = () => {
    const history = useHistory();
    const patientVideo = useRef();
    const imageCapture = useRef();
    const faceCanvas = useRef();
    const faceContext = useRef();
    const faceImage = useRef();
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [consciousness, setConsciousness] = useState("");
    const [symptom1, setSymptom1] = useState("");
    const [symptom2, setSymptom2] = useState("");
    const [visionMessage, setvisionMessage] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);

    useEffect(() => {
        getVideo(patientVideo, imageCapture);
        faceContext.current = faceCanvas.current.getContext("2d");
    }, []);

    useEffect(() => {
        if(faceImage.current){
            patientVideo.current.style.display = "none";
            faceCanvas.current.style.display = "block";
        }
        else{
            patientVideo.current.style.display = "block";
            faceCanvas.current.style.display = "none";
        }
    }, [faceImage.current]);

    const onPlay = () => {
        setRetryFlag(true)
        setvisionMessage("버튼을 눌러 사진을 촬영하세요.");
        faceCanvas.current.width = patientVideo.current.videoWidth;
        faceCanvas.current.height = patientVideo.current.videoHeight;
    }

    const onCapture = async () => {
        setRetryFlag(false);
        setvisionMessage("사진을 촬영하는 중 입니다.");

        const {result, message, attributes} = await visionGetAttributes(imageCapture, faceContext, faceImage);
        setvisionMessage(message);

        if(result){
            const {age, gender} = attributes;
            setAge(age);
            if(gender == 0)
                setGender("여자");
            else
                setGender("남자");
            return;
        }

        setRetryFlag(true);
    }

    const onRetry = () => {
        faceImage.current = null;
        setRetryFlag(true);
        setvisionMessage("버튼을 눌러 사진을 촬영하세요.");
    }

    const onSearch = () => {
        history.push("select-hospital");
    }

    return(
        <>
            <Header name="환자등록" outline="응급환자의 정보를 등록합니다." />
            <div className="add-patient">
                <ContentsBox className="image-contents" title="환자사진"> 
                    <video ref={patientVideo} playsInline autoPlay onPlay={onPlay} />
                    <canvas ref={faceCanvas} />
                    <div className="vision-message">{visionMessage}</div>
                    {retryFlag && <Button onClick={onCapture}>사진촬영</Button>}
                    {faceImage.current && <Button onClick={onRetry}>재시도</Button>}
                </ContentsBox>
                <ContentsBox className="information-contents" title="환자정보">
                    <label htmlFor="sex">Gender</label>
                    <Select id="gender" value={gender} setValue={setGender} options={["남자", "여자"]} placeholder="성별을 선택하세요." />
                    <label htmlFor="age">Age</label>
                    <Input type="number" value={age} setValue={setAge} placeholder="나이를 선택하세요." />
                </ContentsBox>
                <ContentsBox className="symptom-contents" title="환자증상">
                    <label htmlFor="consciousness">Consciousness</label>
                    <Select id="consciousness" value={consciousness} setValue={setConsciousness} options={["명료", "기면", "혼미", "반혼수", "혼수"]} placeholder="의식여부를 선택하세요" />
                    <label htmlFor="symptom1">Symptom 1</label>
                    <Select id="symptom1" value={symptom1} setValue={setSymptom1} options={["1"]} placeholder="증상을 선택하세요" />
                    <label htmlFor="symptom2">Symptom 2</label>
                    <Select id="symptom2" value={symptom2} setValue={setSymptom2} options={["2"]} placeholder="증상을 선택하세요" />
                    <Button>작성완료</Button>
                </ContentsBox>
                <ContentsBox className="department-contents" title="추천 진료과">
                    <Button onClick={onSearch}>병원탐색</Button>
                </ContentsBox>
            </div>
        </>
    );
}

export default AddPatient;