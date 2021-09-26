import { LS2createToast, LS2speakTts } from "../../../functions/ls2Methods";
import { socket } from "../../../socket";

const OperatingRoom = ({textX, textY, points, roomNo, state, idx}) => {
    console.log(idx);
    const onClick = () => {
        const roomNumberConverter = ["17", "21"];
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
            LS2createToast("수술실이 예약되었습니다.");
            LS2speakTts("수술실이 예약되었습니다.")
        }
        else{
            LS2createToast("수술실 예약이 취소되었습니다.");
            LS2speakTts("수술실 예약이 취소되었습니다.");
        }
    };

    return (
        <>
            <polygon points={points} fill={state=="0" ? "#5cdb5c" : "#ff0021"} onClick={onClick} />
            <text x={textX} y={textY} dominantBaseline="middle" textAnchor="middle" fill="#F4F3EA" fontWeight="600" onClick={onClick}>수술실{roomNo}</text>
        </>
    );
}

export default OperatingRoom;