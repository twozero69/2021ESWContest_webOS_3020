/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { thinqRequestVisionLabs } from "../../axiosMethods";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Logo from "../../components/Logo/Logo";
import "./SignIn.css"


const SignIn = ({setLoginFlag, setUser}) => {
    const history = useHistory();
    const webcamVideo = useRef();
    const imageCapture = useRef(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visionProcessMessage, setVisionProcessMessage] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);

    useEffect(() => {
        getVideo();
    }, []);

    const onPlay = () => {
        setRetryFlag(true)
        setVisionProcessMessage("얼굴인식을 통해 로그인하시려면 버튼을 눌러주세요.");
    }

    const onEmailChange = (event) => {
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {
        const {target : {value}} = event;
        setPassword(value);
    };

    const onSignIn = () => {
        //여기서 firebase에서 id password체크
        setLoginFlag(true);
    };

    const onSignUp = () => {
        history.push('/sign-up');
    };

    const onRetry = async() => {
        setRetryFlag(false);
        await visionSignIn();
        setRetryFlag(true);
    };

    const getVideo = () => {
        window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {
            webcamVideo.current.srcObject = stream;
            const track = stream.getVideoTracks()[0];
            imageCapture.current = new ImageCapture(track);
        }).catch(error => {
            console.log(error);
        });
    }

    const getVisionProcessResult = async () => {
        const blob = await imageCapture.current.takePhoto();
        const buffer = await blob.arrayBuffer();
        const byteArray = new Uint8Array(buffer);
        const {data: {
            result: {
                faceCount,
                estimationResult
                }
            }
        } = await thinqRequestVisionLabs(byteArray);
        
        return {faceCount, estimationResult};
    }

    const visionSignIn = async () => {
        setVisionProcessMessage("얼굴인식 중 입니다.")
        const {faceCount, estimationResult} = await getVisionProcessResult();

        if(faceCount != 1){
            if(faceCount == 0)
                setVisionProcessMessage("얼굴인식에 실패했습니다.");
            else{
                setVisionProcessMessage("너무 많은 얼굴이 인식되었습니다.");
            }

            return;
        }
        
        const {headpose, landmark, quality: {quality}} = estimationResult[0];

        if(quality < 0.9){
            setVisionProcessMessage("영상의 화질이 좋지않습니다.")
            return;
        }

        for(let key in headpose){
            if(Math.abs(headpose[key])>15){
                setVisionProcessMessage("화면을 똑바로 봐주십시오.")
                return;
            }
        }

        //여기 ML서버에 요청
        console.log(landmark);
    
        //인증되었다면 다음 진행

        //user정보 읽어오기

        setVisionProcessMessage("얼굴인식에 성공했습니다.");
        setTimeout(() => {
            setLoginFlag("true");
        }, 2000);
    }

    return(
        <div className="sign-in">
            
            <div className="sign-in-form">
                <div className="video-form">
                    <div className="video-contents">
                        <video ref={webcamVideo} playsInline autoPlay onPlay={onPlay} />
                        <div>{visionProcessMessage}</div>
                        {retryFlag && <Button value="face 로그인" onClick={onRetry} />}
                    </div>
                </div>
                <div className="email-form">
                    <div className="email-contents">
                        <Logo />
                        <label>Email</label>
                        <Input type="email" value={email} onChange={onEmailChange} placeholder="이메일을 입력하세요." />
                        <label>Password</label>
                        <Input type="password" value={password} onChange={onPasswordChange} placeholder="비밀번호를 입력하세요." />
                        <Button value="로그인" onClick={onSignIn} />
                        <Button value="회원가입" onClick={onSignUp} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;