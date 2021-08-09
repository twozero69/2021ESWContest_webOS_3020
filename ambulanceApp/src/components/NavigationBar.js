/* eslint-disable */
import { BiPlusMedical, BiMenu, BiUserPlus, BiMap, BiWrench, BiVideo, BiLogOut } from "react-icons/bi"
import { useHistory } from "react-router-dom";
import "./NavigationBar.css"

const NavigationBar = ({user, setUser, setLoginFlag}) => {
    const history = useHistory();

    const onClickAddPatient = () => {
        history.push("/");
    };

    const onClickSelectHospital = () => {
        history.push("/select-hospital");
    };

    const onClickControlHospital = () => {
        history.push("/control-hospital");
    };

    const onClickTelemedicine = () => {
        history.push("/telemedicine");
    };

    const onClickLogout = () => {
        setUser(null);
        setLoginFlag(false);
    };

    return(
        <>
            <div className="navigation-head">
                <BiPlusMedical className="logo-img"/>
                <div className="logo-name">A2H</div>
                <BiMenu className="btn"/>
            </div> 

            <ul>
                <li onClick={onClickAddPatient}>
                    <BiUserPlus/>
                    <span>환자등록</span>
                </li>

                <li onClick={onClickSelectHospital}>
                    <BiMap/>
                    <span>병원선정</span>
                </li>
                <li onClick={onClickControlHospital}>
                    <BiWrench/>
                    <span>병원제어</span>
                </li>
                <li onClick={onClickTelemedicine}>
                    <BiVideo/>
                    <span>원격진료</span>
                </li>
            </ul>

            <div className="profile">
                <img src={user.image}/>
                <div className="name-job">
                    <div className="name">{user.name}</div>
                    <div className="job">{user.job}</div>
                </div>
                <div className="logout" onClick={onClickLogout}>
                    <BiLogOut/>
                </div>
            </div>
        </>
    );
}

export default NavigationBar; 