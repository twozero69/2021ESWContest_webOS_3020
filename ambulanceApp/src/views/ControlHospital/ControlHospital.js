import { useState } from "react";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header";
import "./ControlHospital.css"
import hospitalImage from "../../../resources/images/hospital.png"

const ControlHospital = ({hospital, setHospital}) => {
    const onClick = () => {
        
    }

    return(
        <>
            <Header name="병원제어" outline="병원의 시설을 조작 또는 예약합니다." />
            <div className="control-hospital">
                <ContentsBox className="hospital-model-contents" title="병원도면">
                    <svg width="100%" height="100%" viewBox="0 0 600 500">
                        <image width="100%" height="100%" href={hospitalImage} />

                        <rect x="72" y="60" width="55" height="31" fill={hospital.wards["101"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="72" y="97" width="55" height="31" fill={hospital.wards["102"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="72" y="134" width="55" height="31" fill={hospital.wards["103"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="72" y="171" width="55" height="31" fill={hospital.wards["104"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />

                        <rect x="151" y="60" width="55" height="31" fill={hospital.wards["105"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="151" y="97" width="55" height="31" fill={hospital.wards["106"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="151" y="134" width="55" height="31" fill={hospital.wards["107"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="151" y="171" width="55" height="31" fill={hospital.wards["108"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />

                        <rect x="212" y="60" width="55" height="31" fill={hospital.wards["109"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="212" y="97" width="55" height="31" fill={hospital.wards["110"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="212" y="134" width="55" height="31" fill={hospital.wards["111"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="212" y="171" width="55" height="31" fill={hospital.wards["112"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />

                        <rect x="291" y="60" width="55" height="31" fill={hospital.wards["113"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="291" y="97" width="55" height="31" fill={hospital.wards["114"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="291" y="134" width="55" height="31" fill={hospital.wards["115"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />
                        <rect x="291" y="171" width="55" height="31" fill={hospital.wards["116"].availability ? "#ff0021" : "#5cdb5c"} onClick={onClick} />

                    </svg>
                </ContentsBox>
            </div>
        </>
    );
}

export default ControlHospital;