/* eslint-disable */
import EquipmentRoom from "./EquipmentRoom/EquipmentRoom";
import OperaingRoom from "./OperatingRoom/OperatingRoom";
import Ward from "./Ward/Ward"

const HospitalSvg = ({hospitalData}) => {
    console.log("svg 재렌더링");
    return(
        <svg width="100%" height="100%" viewBox="0 0 600 500">
            <image width="100%" height="100%" href={hospitalData.hospitalImage} />
            {hospitalData.wards.map((wardInfo, idx) => <Ward key={idx} {...wardInfo} idx={idx} />)}
            {hospitalData.equipmentRooms.map((equipmentRoomInfo, idx) => <EquipmentRoom key={idx} {...equipmentRoomInfo} idx={idx} />)}
            {hospitalData.operatingRooms.map((operatingRoomInfo, idx) => <OperaingRoom key={idx} {...operatingRoomInfo} idx={idx} />)}
        </svg>
    );
};

export default HospitalSvg;