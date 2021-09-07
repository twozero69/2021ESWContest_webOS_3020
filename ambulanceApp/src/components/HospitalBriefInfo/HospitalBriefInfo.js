/* eslint-disable */
import { useEffect } from "react";
import { getDistanceString } from "../../functions/mapMethods";
import "./HospitalBriefInfo.css";

const HospitalInfo = ({hospitalInfo, idx, selectedIdx, setSelectedIdx}) => {
    useEffect(() => {
        if(selectedIdx == -1){
            return;
        }

        if(selectedIdx == idx){
            //버튼이 눌린 효과를 추가할 것.
        }
        else{
            //효과 제거를 추가할 것.
        }

    }, [selectedIdx]);

    const {dutyName, dutyAddr, geodistance} = hospitalInfo;

    const onClick = () => {
        setSelectedIdx(idx);
    };

    return(
        <div className="hospital-information" onClick={onClick}>
            <div className="hospital-head">
                <h3>{dutyName}</h3>
            </div>
            <div className="hospital-location">
                <div className="hospital-distance">{getDistanceString(geodistance, "km")}</div>
                <div className="hospital-address">{dutyAddr}</div>
            </div>
        </div>
    );
};

export default HospitalInfo;