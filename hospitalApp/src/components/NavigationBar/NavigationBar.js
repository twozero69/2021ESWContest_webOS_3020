/* eslint-disable */
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { BiMenu, BiWrench, BiVideo, BiLogOut, BiX } from "react-icons/bi"
import Logo from "../Logo/Logo";
import "./NavigationBar.css"

const NavigationBar = ({user, setUser, setLoginFlag, appContents}) => {
    const history = useHistory();
    const navigationBar = useRef();

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
      <div ref={navigationBar} className="navigation-bar">
        <div className="navigation-head">
          <Logo />
          <div className="btn">
            <BiMenu className="menu-btn" onClick={onClickMenuBtn} />
            <BiX className="x-btn" onClick={onClickXBtn} />
          </div>
        </div>

        <ul>
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
          <img src={user.imageURL} alt="userimage" />
          <div className="name-job">
            <div className="name">{user.name}</div>
            <div className="job">{user.job}</div>
          </div>
          <div className="logout" onClick={onClickLogout}>
            <BiLogOut />
          </div>
        </div>
      </div>
    );
}

export default NavigationBar; 