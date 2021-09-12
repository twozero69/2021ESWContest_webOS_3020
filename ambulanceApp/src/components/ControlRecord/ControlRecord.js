import "./ControlRecord.css"

const ControlRecord = ({roomName, timestamp}) => {
    return(
        <div className="record-container">
            <h3>{roomName}</h3>
            <div className="record">

            </div>
        </div>
    );
};

export default ControlRecord;