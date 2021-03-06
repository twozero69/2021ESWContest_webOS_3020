/* eslint-disable */
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header";
import "./ControlHospital.css"
import HospitalSvg from "../../components/HospitalSvg/HospitalSvg";

const ControlHospital = ({patient, setPatient, hospitalData, ambulanceDistance}) => {
    return(
        <>
            <Header patient={patient} setPatient={setPatient} name="병원제어" outline="병원의 시설을 조작 또는 예약합니다." ambulanceDistance={ambulanceDistance} />
            <div className="control-hospital">
                <ContentsBox className="hospital-model-contents" title="병원도면">
                    <HospitalSvg hospitalData={hospitalData} />
                </ContentsBox>
                {/* <ContentsBox className="control-record-contents" title="제어내역">
                </ContentsBox> */}
            </div>
        </>
    );
}

export default ControlHospital;