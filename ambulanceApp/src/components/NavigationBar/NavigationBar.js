/* eslint-disable */
import { BiMenu, BiUserPlus, BiMap, BiWrench, BiVideo, BiLogOut, BiX } from "react-icons/bi"
import { useHistory } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./NavigationBar.css"

const NavigationBar = ({user, setUser, setLoginFlag, navigationBar, appContents}) => {
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

    const onClickMenuBtn = () => {
        navigationBar.current.classList.add("active");
        appContents.current.classList.add("active");
    }

    const onClickXBtn = () => {
        navigationBar.current.classList.remove("active");
        appContents.current.classList.remove("active");
    }

    return (
      <>
        <div className="navigation-head">
          <Logo />
          <div className="btn">
            <BiMenu className="menu-btn" onClick={onClickMenuBtn} />
            <BiX className="x-btn" onClick={onClickXBtn} />
          </div>
        </div>

        <ul>
          <li onClick={onClickAddPatient}>
            <BiUserPlus />
            <div>환자등록</div>
          </li>
          <li onClick={onClickSelectHospital}>
            <BiMap />
            <div>병원선정</div>
          </li>
          <li onClick={onClickControlHospital}>
            <BiWrench />
            <div>병원제어</div>
          </li>
          <li onClick={onClickTelemedicine}>
            <BiVideo />
            <div>원격진료</div>
          </li>
        </ul>

        <div className="profile">
          <img src={user.image} alt="user img" />
          <div className="name-job">
            <div className="name">{user.name}</div>
            <div className="job">{user.job}</div>
          </div>
          <div className="logout" onClick={onClickLogout}>
            <BiLogOut />
          </div>
        </div>
      </>
    );
}

export default NavigationBar; 