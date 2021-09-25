import { BiPlusMedical } from "react-icons/bi";
import "./Logo.css";

const Logo = () => {
    return(
        <div className="logo">
            <BiPlusMedical className="logo-img"/>
            <div className="logo-name">A2H</div>
        </div>
    );
};

export default Logo;