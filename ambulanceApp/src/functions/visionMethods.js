/* eslint-disable */
import { thinqRequestVisionLabs, djangoRequestToServer, djangoGetVector } from "./axiosMethods";

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

const getVideoWithAudio = (webcamVideoRef) => {
    window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        webcamVideoRef.current.srcObject = stream;
    }).catch(error => {
        console.log(error);
    });
};


const getVisionProcessResult = async (blob) => {
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
    
    const blob = await imageCaptureRef.current.takePhoto();
    const {faceCount, estimationResult} = await getVisionProcessResult(blob);
  
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
        if(Math.abs(headpose[key])>20){
            message = "화면을 똑바로 봐주십시오.";
            return {result, message};
        }
    }

    const {data: {returnValue, userdata}} = await djangoRequestToServer(blob, landmark);
    if(!returnValue){
        message = "데이터베이스에 해당하는 얼굴이 없습니다.";
        return {result, message};
    }

    result = true;
    message = "얼굴인식에 성공했습니다.";
    return {result, message, userdata};
}

const drawBlobToCanvas = (faceContextRef, blob, faceInfo) => {
    const image = new Image();
    const {x, y, width, height} = faceInfo;
    image.onload = () => {
        //canvas에 Image객체 그리기
        faceContextRef.current.drawImage(image, 0, 0);
        //얼굴위치에 사격형 그리기
        faceContextRef.current.strokeStyle = "#F4F3EA";
        faceContextRef.current.setLineDash([20 , 10]);
        faceContextRef.current.lineWidth = 10;
        faceContextRef.current.strokeRect(x, y, width, height);
    }
    image.src = URL.createObjectURL(blob);
}

const visionSignUp = async (imageCaptureRef, faceContextRef, faceImageRef, faceInfoRef, faceLandmarkRef, faceVectorRef) => {
    let result = false;
    let message = "";

    const blob = await imageCaptureRef.current.takePhoto();
    const {faceCount, estimationResult} = await getVisionProcessResult(blob);
    
    if(faceCount != 1){
        if(faceCount == 0){
            message = "얼굴인식에 실패했습니다.";
        }
        else{
            message = "너무 많은 얼굴이 인식되었습니다.";
        }

        return {result, message};
    }

    const {headpose, landmark, quality: {quality}, faceInfo} = estimationResult[0];

    if(quality < 0.9){
        message = "영상의 화질이 좋지않습니다."
        return {result, message};
    }

    for(let key in headpose){
        if(Math.abs(headpose[key])>20){
            message = "화면을 똑바로 봐주십시오.";
            return {result, message};
        }
    }

    const faceX = faceInfo.x;
    const faceY = faceInfo.y;
    const processedLandmark = landmark.map(({id, x, y}) =>{
        return {
            id,
            x: x + faceX,
            y: y + faceY
        };
    });

    visionGetVector(blob, processedLandmark, faceVectorRef);
    
    drawBlobToCanvas(faceContextRef, blob, faceInfo);
    faceImageRef.current = blob;
    faceInfoRef.current = faceInfo;
    faceLandmarkRef.current = processedLandmark;

    result = true;
    message = "다시 촬영하시려면 재시도 버튼을 눌러주세요.";
    return {result, message};
}

const visionGetAttributes = async (imageCaptureRef, faceContextRef, faceImageRef) => {
    let result = false;
    let message = ""; 
    
    const blob = await imageCaptureRef.current.takePhoto();
    const {faceCount, estimationResult} = await getVisionProcessResult(blob);
  
    if(faceCount != 1){
        if(faceCount == 0){
            message = "얼굴인식에 실패했습니다.";
        }
        else{
            message = "너무 많은 얼굴이 인식되었습니다.";
        }

        return {result, message};
    }

    const {attributes, faceInfo} = estimationResult[0];

    drawBlobToCanvas(faceContextRef, blob, faceInfo);
    faceImageRef.current = blob;

    result = true;
    message = "다시 촬영하시려면 재시도 버튼을 눌러주세요.";
    return {result, message, attributes};
}

const visionGetVector = (blob, landmark, faceVectorRef) => {
    const reader = new FileReader();
    let base64 = null;
    reader.onload = async () => {
        base64 = reader.result;
        const {data: {vector}} = await djangoGetVector(base64, landmark);
        faceVectorRef.current = vector;
    }
    reader.readAsDataURL(blob);
}

export {getVideo, getVideoWithAudio, getVisionProcessResult, visionSignIn, drawBlobToCanvas, visionSignUp, visionGetAttributes, visionGetVector};