import { socket } from "../../../socket";

const EquipmentRoom = ({textX, textY, points, roomKind, state, idx}) => {
    const onClick = () => {
        const roomNumberConverter = ["22", "19", "20"];
        const dataConverter = {
            "0": "1",
            "1": "0"
        };

        socket.emit("hospitalLed", {
            roomNumber: roomNumberConverter[idx],
            data: dataConverter[state]
        });
    };

    return (
        <>
            <polygon points={points} fill={state =="0" ? "#5cdb5c" : "#ff0021"} onClick={onClick} />
            <text x={textX} y={textY} dominantBaseline="middle" textAnchor="middle" fill="#F4F3EA" fontWeight="600" onClick={onClick}>{roomKind}</text>
        </>
    );
}

export default EquipmentRoom;