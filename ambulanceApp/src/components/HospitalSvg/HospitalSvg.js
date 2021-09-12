/* eslint-disable */
import EquipmentRoom from "./EquipmentRoom/EquipmentRoom";
import OperaingRoom from "./OperatingRoom/OperatingRoom";
import Ward from "./Ward/Ward"

const HospitalSvg = ({hospitalData: {hospitalImage, wards, equipmentRooms, operatingRooms}, setHospitalData}) => {
    return(
        <svg width="100%" height="100%" viewBox="0 0 600 500">
            <image width="100%" height="100%" href={hospitalImage} />
            {wards.map(wardInfo => <Ward {...wardInfo} />)}
            {equipmentRooms.map(equipmentRoomInfo => <EquipmentRoom {...equipmentRoomInfo} />)}
            {operatingRooms.map(operatingRoomInfo => <OperaingRoom {...operatingRoomInfo} />)}
        </svg>
    );
};

export default HospitalSvg;