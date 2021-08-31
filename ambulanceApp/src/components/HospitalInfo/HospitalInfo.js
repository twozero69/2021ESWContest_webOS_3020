/* eslint-disable */
import { useEffect } from "react";
import "./HospitalInfo.css";

const HospitalInfo = ({hospitalInfo, idx, selectedIdx, setSelectedIdx}) => {
    useEffect(() => {
        if(selectedIdx == -1){
            return;
        }

        if(selectedIdx == idx){
            
        }
        else{

        }

    }, [selectedIdx]);

    const {dutyName, dutyAddr, distance} = hospitalInfo;

    const onClick = () => {
        setSelectedIdx(idx);
    };

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