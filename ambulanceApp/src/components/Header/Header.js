import { useHistory } from "react-router";
import { LS2createToast, LS2speakTts } from "../../functions/ls2Methods";
import "./Header.css";

const Header = ({patient, setPatient, name, outline, ambulanceDistance}) => {
    const history = useHistory();
    const max = 100;

    if(ambulanceDistance <= 10 && patient){
        setPatient(null);
        LS2speakTts("병원에 도착하였습니다.");
        LS2createToast("병원에 도착하였습니다. 10초 뒤에 연결이 종료됩니다.");
        setTimeout(() => {
            history.push("/");
        }, 1000 * 10);
    }

    return (
        <div className="header">
            <h3 className="view-name">{name}</h3>
            <div className="view-outline">{outline}</div>
            {patient && <progress value={max + 10 - ambulanceDistance} max={max}></progress>}
        </div>
    );
};

export default Header;