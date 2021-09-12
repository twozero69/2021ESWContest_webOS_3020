import { useState } from "react";

const Ward = ({x, y, wardNo}) => {
    const [enableFlag, setEnableFlag] = useState(true);
    const onClick = () => {
        //소켓과 통신하는 부분 추가
        setEnableFlag(!enableFlag);
    };

    return (
        <>
            <rect x={x} y={y} width="55" height="31" fill={enableFlag ? "#5cdb5c" : "#ff0021"} onClick={onClick} />
            <text x={x + 28} y={y + 17} dominant-baseline="middle" text-anchor="middle" fill="#F4F3EA" fontWeight="600" onClick={onClick}>{wardNo}호</text>
        </>
    );
}

export default Ward;