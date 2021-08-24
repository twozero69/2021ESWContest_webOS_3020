/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button/Button";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header"
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { getGeolocation } from "../../functions/geolocationMethods";
import { getVideo, getAttributes } from "../../functions/visionMethods";
import "./AddPatient.css";

const AddPatient = ({setPatient}) => {
    const history = useHistory();
    const patientVideo = useRef();
    const imageCapture = useRef();
    const faceCanvas = useRef();
    const faceContext = useRef();
    const faceImage = useRef();
    const [visionMessage, setvisionMessage] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [severity, setSeverity] = useState("");
    const [breath, setBreath] = useState("");
    const [bleeding, setBleeding] = useState("");
    const [burn, setBurn] = useState("");
    const [organDamage, setOrganDamage] = useState("");
    const [headInjury, setHeadInjury] = useState("");
    const [fracture, setFracture] = useState("");
    const [severeDisease1, setSevereDisease1] = useState("");
    const [severeDisease2, setSevereDisease2] = useState("");
    const [hospitalization, setHospitalization] = useState("");
    const [operation, setOperation] = useState("");

    const mkioskty = ["뇌출혈", "뇌경색", "심근경색", "복부손상", "사지접합", "응급내시경", "응급투석", "조산산모", "정신질환", "신생아", "중증화상"];

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

        const {result, message, attributes} = await getAttributes(imageCapture, faceContext, faceImage);
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

    const onSeverity = () => {
        if(breath=="비정상" || bleeding=="지혈 불가능" || burn=="기도화상" || organDamage=="있음" || headInjury=="함몰"){
            setSeverity("긴급");
            return;
        }
        
        if(burn=="3도 이상" || headInjury=="골절" || fracture=="다발성 골절" || fracture=="척추 골절"){
            setSeverity("응급");
            return;
        }

        setSeverity("비응급");
    }

    const onRegister = async () => {
        const patientData = {
            pid: uuidv4(),
            imageBlob: faceImage.current,
            location: await getGeolocation(),
            attributes:{
                gender: gender,
                age: age
            },
            severity: severity,
            diagnosis:{
                breath: breath,
                bleeding: bleeding,
                burn: burn,
                organDamage: organDamage,
                headInjury: headInjury,
                fracture: fracture
            },
            mkioskty: [severeDisease1, severeDisease2],
            facility:{
                hospitalization: hospitalization,
                operation: operation
            },
            createdAt: Date.now()
        };

        setPatient(patientData);
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
                    <div className="guide">사진을 촬영하면 자동으로 작성됩니다.</div>
                    <label htmlFor="gender">Gender</label>
                    <Select id="gender" value={gender} setValue={setGender} options={["남자", "여자"]} placeholder="성별을 선택하세요" />
                    <label htmlFor="age">Age</label>
                    <Input type="number" value={age} setValue={setAge} placeholder="나이를 입력하세요" />
                </ContentsBox>
                <ContentsBox className="severity-contents" title="중증도 판단">
                    <div className="guide">중증도를 선택하시거나 아래의 진단을 통해 중증도를 판단해주세요.</div>
                    <label htmlFor="severity">Severity</label>
                    <Select id="severity" value={severity} setValue={setSeverity} options={["긴급", "응급", "비응급"]} placeholder="중증도" />
                </ContentsBox>
                <ContentsBox className="diagnosis-contents" title="중증도 진단">
                    <div className="guide">진단을 통해 중증도를 판단합니다.</div>
                    <label htmlFor="breath">기도 호흡 심장</label>
                    <Select id="breath" value={breath} setValue={setBreath} options={["정상", "비정상"]} placeholder="호흡상태를 선택하세요." />
                    <label htmlFor="bleeding">출혈</label>
                    <Select id="bleeding" value={bleeding} setValue={setBleeding} options={["없음", "지혈 가능", "지혈 불가능"]} placeholder="출혈 상태를 선택하세요." />
                    <label htmlFor="burn">화상</label>
                    <Select id="burn" value={burn} setValue={setBurn} options={["없음", "단순화상", "3도 이상", "기도화상"]} placeholder="화상 여부를 선택하세요." />
                    <label htmlFor="organDamage">장기 손상</label>
                    <Select id="organDamage" value={organDamage} setValue={setOrganDamage} options={["없음", "손상"]} placeholder="장기 손상 여부를 선택하세요." />
                    <label htmlFor="headInjury">두부 손상</label>
                    <Select id="headInjury" value={headInjury} setValue={setHeadInjury} options={["없음", "골절", "함몰"]} placeholder="두부 손상 여부를 선택하세요." />
                    <label htmlFor="fracture">골절</label>
                    <Select id="fracture" value={fracture} setValue={setFracture} options={["없음", "경상", "다발성 골절", "척추 골절"]} placeholder="골절 여부를 선택하세요." />
                    <Button onClick={onSeverity}>중증도 평가</Button>
                </ContentsBox>
                <ContentsBox className="severeDisease-contents" title="중증질환">
                    <div className="guide">이 옵션을 선택하면 해당 검사와 수술이 가능한 병원을 찾습니다.</div>
                    <label htmlFor="severeDisease1">중증질환 1</label>
                    <Select id="severeDisease1" value={severeDisease1} setValue={setSevereDisease1} options={mkioskty} placeholder="중증질환1을 선택하세요." />
                    <label htmlFor="severeDisease2">중증질환 2</label>
                    <Select id="severeDisease2" value={severeDisease2} setValue={setSevereDisease2} options={mkioskty} placeholder="중증질환2를 선택하세요." />
                </ContentsBox>
                <ContentsBox className="facility-contents" title="시설 이용 여부">
                <div className="guide">지금 당장 해당 시설을 이용할 수 있는 병원을 찾습니다.</div>
                    <label htmlFor="hospitalization">입원실</label>
                    <Select id="hospitalization" value={hospitalization} setValue={setHospitalization} options={["O", "X"]} placeholder="입원 여부를 선택하세요." />
                    <label htmlFor="operation">수술실</label>
                    <Select id="operation" value={operation} setValue={setOperation} options={["O", "X"]} placeholder="수술 여부를 선택하세요." />
                    <Button onClick={onRegister}>환자등록</Button>
                </ContentsBox>
            </div>
        </>
    );
}

export default AddPatient;