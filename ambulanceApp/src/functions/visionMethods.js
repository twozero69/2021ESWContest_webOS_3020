/* eslint-disable */
import { thinqRequestVisionLabs } from "./axiosMethods";

const getVideo = (webcamVideoRef, imageCaptureRef) => {
    window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(stream => {
        webcamVideoRef.current.srcObject = stream;
        const track = stream.getVideoTracks()[0];
        imageCaptureRef.current = new window.ImageCapture(track);
    }).catch(error => {
        console.log(error);
    });
}


const getVisionProcessResult = async (imageCaptureRef) => {
    const blob = await imageCaptureRef.current.takePhoto();
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

const visionSignIn = async (imageCaptureRef) => {
    let result = false;
    let message = ""; 
    
    const {faceCount, estimationResult} = await getVisionProcessResult(imageCaptureRef);
  
    if(faceCount != 1){
        if(faceCount == 0){
            message = "얼굴인식에 실패했습니다.";
        }
        else{
            message = "너무 많은 얼굴이 인식되었습니다.";
        }

        return {result, message};
    }
    
    const {headpose, landmark, quality: {quality}} = estimationResult[0];

    if(quality < 0.9){
        message = "영상의 화질이 좋지않습니다."
        return {result, message};
    }

    for(let key in headpose){
        if(Math.abs(headpose[key])>15){
            message = "화면을 똑바로 봐주십시오.";
            return {result, message};
        }
    }

    //여기 ML서버에 요청
    console.log(landmark);

    //인증되었다면 다음 진행

    //user정보 읽어오기

    result = true;
    message = "얼굴인식에 성공했습니다.";
    return {result, message};
}

const visionSignUp = async (imageCaptureRef, faceImageRef) => {
    let result = false;
    let message = "";

    console.log(await imageCaptureRef.current.grabFrame());
    console.log(await imageCaptureRef.current.takePhoto());

    const {faceCount, estimationResult} = await getVisionProcessResult(imageCaptureRef);
    
    if(faceCount != 1){
        if(faceCount == 0){
            message = "얼굴인식에 실패했습니다.";
        }
        else{
            message = "너무 많은 얼굴이 인식되었습니다.";
        }

        return {result, message};
    }

    //조건처리

    result = true;
    message = "다시 촬영하시려면 재시도 버튼을 눌러주세요.";
    return {result, message};
}

export {getVideo, getVisionProcessResult, visionSignIn, visionSignUp};