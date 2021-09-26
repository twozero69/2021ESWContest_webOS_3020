import { LS2createToast, LS2speakTts } from "../../../functions/ls2Methods";
import { socket } from "../../../socket";

const EquipmentRoom = ({textX, textY, points, roomKind, state, idx}) => {
    const onClick = () => {
        const roomNumberConverter = ["22", "19", "20"];
        const dataConverter = {
            "0": "1",
            "1": "0"
        };

        const data = dataConverter[state];
        socket.emit("hospitalLed", {
            roomNumber: roomNumberConverter[idx],
            data: dataConverter[state]
        });

        if(data == "1"){
            LS2createToast("시설이 예약되었습니다.");
            LS2speakTts("시설이 예약되었습니다.")
        }
        else{
            LS2createToast("시설 예약이 취소되었습니다.");
            LS2speakTts("시설 예약이 취소되었습니다.");
        }
    };

    return (
        <>
            <polygon points={points} fill={state =="0" ? "#5cdb5c" : "#ff0021"} onClick={onClick} />
            <text x={textX} y={textY} dominantBaseline="middle" textAnchor="middle" fill="#F4F3EA" fontWeight="600" onClick={onClick}>{roomKind}</text>
        </>
    );
}

export default EquipmentRoom;