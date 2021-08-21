/* eslint-disable */
import { useEffect, useRef } from "react";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header"
import { getVideo } from "../../functions/visionMethods";
import "./AddPatient.css"

const AddPatient = () => {
    const patientVideo = useRef();
    const imageCapture = useRef();

    useEffect(() => {
        getVideo(patientVideo, imageCapture);
    }, []);

    return(
        <>
            <Header name="환자등록" outline="응급환자의 정보를 등록합니다." />
            <div className="add-patient">
                <ContentsBox className="image-contents" title="환자사진"> 
                    <video ref={patientVideo} playsInline autoPlay />
                    <Button>사진촬영</Button>
                </ContentsBox>
            </div>
        </>
    );
}

export default AddPatient;