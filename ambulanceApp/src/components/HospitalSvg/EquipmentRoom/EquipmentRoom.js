import { useState } from "react";

const EquipmentRoom = ({textX, textY, points, roomKind}) => {
    const [enableFlag, setEnableFlag] = useState(true);
    const onClick = () => {
        //소켓과 통신하는 부분 추가
        setEnableFlag(!enableFlag);
    };

    return (
        <>
            <polygon points={points} fill={enableFlag ? "#5cdb5c" : "#ff0021"} onClick={onClick} />
            <text x={textX} y={textY} dominant-baseline="middle" text-anchor="middle" fill="#F4F3EA" fontWeight="600" onClick={onClick}>{roomKind}</text>
        </>
    );
}

export default EquipmentRoom;