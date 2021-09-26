import { LS2createToast, LS2speakTts } from "../../../functions/ls2Methods";
import { socket } from "../../../socket";

const Ward = ({x, y, wardNo, state, idx}) => {
    const onClick = () => {
        const roomNumberConverter = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"];
        const dataConverter = {
            "0": "1",
            "1": "0"
        };

        const data = dataConverter[state];
        socket.emit("hospitalLed", {
            roomNumber: roomNumberConverter[idx],
            data
        });

        if(data == "1"){
            LS2createToast("병실이 예약되었습니다.");
            LS2speakTts("병실이 예약되었습니다.")
        }
        else{
            LS2createToast("병실 예약이 취소되었습니다.");
            LS2speakTts("병실 예약이 취소되었습니다.");
        }
    };

    return (
        <>
            <rect x={x} y={y} width="55" height="31" fill={state=="0"? "#5cdb5c" : "#ff0021"} onClick={onClick} />
            <text x={x + 28} y={y + 17} dominantBaseline="middle" textAnchor="middle" fill="#F4F3EA" fontWeight="600" onClick={onClick}>{wardNo}호</text>
        </>
    );
}

export default Ward;