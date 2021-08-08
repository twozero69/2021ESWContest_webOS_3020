/* eslint-disable */
import { BiPlusMedical, BiMenu, BiUserPlus, BiMap, BiWrench, BiVideo, BiLogOut } from "react-icons/bi"
import "./NavigationBar.css"

const NavigationBar = ({user}) => {
    return(
        <div className="navigation-bar">
            <div className="navigation-head">
                <BiPlusMedical className="logo-img"/>
                <div className="logo-name">A2H</div>
                <BiMenu className="btn"/>
            </div> 

            <ul>
                <li>
                    <BiUserPlus/>
                    <span>환자등록</span>
                </li>
                <li>
                    <BiMap/>
                    <span>병원선정</span>
                </li>
                <li>
                    <BiWrench/>
                    <span>병원제어</span>
                </li>
                <li>
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
                <div className="logout">
                    <BiLogOut/>
                </div>
            </div>
        </div>
    );
}

export default NavigationBar; 