/* eslint-disable */
import { useHistory } from "react-router";
import Button from "../Button/Button";
import "./HospitalDetailInfo.css"

const HospitalDetailInfo = ({selectedHospitalInfo}) => {
    if(!selectedHospitalInfo){
        return(
            <h3>병원을 선택하세요</h3>
        );
    }

    const history = useHistory();

    const onClick = () => {
        //여기서 병원과 소켓연결

        //성공시 아래처리
        history.push("control-Hospital");
    }

    return(<>
        <div>
            <h2>{selectedHospitalInfo.dutyName}</h2>
        </div>
        <div>
            <span>기관분류: {selectedHospitalInfo.trauma? "외상센터":"응급의료기관"}</span>
        </div>
        <div>
            <span>응급실번호: {selectedHospitalInfo.dutyTel3}</span>
        </div>
        <div>
            <span>주소: {selectedHospitalInfo.dutyAddr}</span>
        </div>
        <div>
            <span>직선거리: {getDistanceString(selectedHospitalInfo.geodistance, "km")}</span>
        </div>
        <div>
            <span>주행거리: {getDistanceString(selectedHospitalInfo.drivingDistance, "m")}</span>
        </div>
        <div>
            <span>주행시간: {getTimeString(selectedHospitalInfo.drivingTime, "sec")}</span>
        </div>
        <div>
            <span>응급실: {selectedHospitalInfo.hvec} / {selectedHospitalInfo.hperyn}</span>
        </div>
        <div>
            <span>수술실: {selectedHospitalInfo.hvoc} / {selectedHospitalInfo.hpopyn}</span>
        </div>
        <div>
            <span>입원실: {selectedHospitalInfo.hvgc} / {selectedHospitalInfo.hpgryn}</span>
        </div>
        <div>
            <span>병상수: {selectedHospitalInfo.dutyHano} / {selectedHospitalInfo.hpbdn}</span>
        </div>

        <Button onClick={onClick}>병원선정</Button>
    </>);
};

export default HospitalDetailInfo;