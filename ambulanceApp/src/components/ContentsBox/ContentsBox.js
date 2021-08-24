import Scroll from "../Scroll/Scroll";
import "./ContentsBox.css";

const ContentsBox = ({className, title, children}) => {
    return (
        <div className={`contents-box ${className}`}>
            <div className="title">{title}</div>
            <Scroll className="contents">
                {children}
            </Scroll>
        </div>
    );
}

export default ContentsBox;