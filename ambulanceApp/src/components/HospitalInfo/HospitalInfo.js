/* eslint-disable */
import "./HospitalInfo.css";

const HospitalInfo = ({hospitalInfo}) => {
    const {dutyName, dutyAddr, distance} = hospitalInfo;

    const onClick = () => {

    }

    return(
        <div className="hospital-information" onClick={onClick}>
            <div className="hospital-head">
                <div></div>
                <div className="hospital-name">{dutyName}</div>
            </div>
            <div className="hospital-location">
                <div className="hospital-distance">{`${distance}km`}</div>
                <div className="hospital-address">{dutyAddr}</div>
            </div>
        </div>
    );
};

export default HospitalInfo;