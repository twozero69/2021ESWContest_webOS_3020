import { useEffect, useRef } from "react";
import { getVideoWithAudio } from "../../functions/visionMethods";
import "./Telemedicine.css"

const Telemedicine = () => {
    const webcamVideo = useRef();

    useEffect(() => {
        getVideoWithAudio(webcamVideo);
    })

    return(
        <>
            <video ref={webcamVideo} playsInline autoPlay />
        </>
    );
}

export default Telemedicine;