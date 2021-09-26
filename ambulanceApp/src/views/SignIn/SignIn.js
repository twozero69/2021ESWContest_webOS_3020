/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Logo from "../../components/Logo/Logo";
import Scroll from "../../components/Scroll/Scroll";
import { readUserdataFromEmail } from "../../functions/firebaseMethods";
import { LS2createToast } from "../../functions/ls2Methods";
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

    const onSignIn = async () => {
        if(email == ""){
            LS2createToast("이메일을 입력하세요.");
            return;
        }

        if(password == ""){
            LS2createToast("비밀번호를 입력하세요.");
            return;
        }

        const {docs} = await readUserdataFromEmail(email);
        if(docs.length != 1){
            if(docs.length == 0){
                LS2createToast("가입하지 않은 이메일입니다.");
            }
            else{
                LS2createToast("치명적오류 : 이메일중복");
            }
            return;
        }

        const userdata = docs[0].data();
        if(password != userdata.password){
            LS2createToast("비밀번호가 일치하지 않습니다.");
            return;
        }

        setUser(userdata);
        setLoginFlag(true);
    };

    const goSignUp = () => {
        history.push('/sign-up');
    };

    const onVision = async() => {
        setRetryFlag(false);
        setvisionMessage("얼굴인식 중 입니다.")
        
        const {result, message, userdata} = await visionSignIn(imageCapture);
        setvisionMessage(message);

        if(result){
            setUser(userdata);
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
                        {retryFlag && <Button onClick={onVision}>face 로그인</Button>}
                    </div>
                </div>
                <div className="email-form">
                    <Scroll className="email-contents">
                        <Logo />
                        <label htmlFor="email">Email</label>
                        <Input type="text" id="email" value={email} setValue={setEmail} placeholder="이메일을 입력하세요." />
                        <label htmlFor="password">Password</label>
                        <Input type="password" id="password" value={password} setValue={setPassword} placeholder="비밀번호를 입력하세요." />
                        <Button onClick={onSignIn}>로그인</Button>
                        <Button onClick={goSignUp}>회원가입</Button>
                    </Scroll>
                </div>
            </div>
        </div>
    );
}

export default SignIn;