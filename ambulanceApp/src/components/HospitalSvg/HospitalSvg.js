/* eslint-disable */
import EquipmentRoom from "./EquipmentRoom/EquipmentRoom";
import OperatingRoom from "./OperatingRoom/OperatingRoom";
import Ward from "./Ward/Ward"
import hospitalImage from "../../../resources/images/hospital.png"

const HospitalSvg = ({hospitalData}) => {
    console.log("svg 재렌더링");
    return(
        <svg width="100%" height="100%" viewBox="0 0 600 500">
            <image width="100%" height="100%" href={hospitalImage} />
            {hospitalData.wards.map((wardInfo, idx) => <Ward key={idx} {...wardInfo} idx={idx} />)}
            {hospitalData.equipmentRooms.map((equipmentRoomInfo, idx) => <EquipmentRoom key={idx} {...equipmentRoomInfo} idx={idx} />)}
            {hospitalData.operatingRooms.map((operatingRoomInfo, idx) => <OperatingRoom key={idx} {...operatingRoomInfo} idx={idx} />)}
        </svg>
    );
};

export default HospitalSvg;