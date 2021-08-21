import "./Header.css";

const Header = ({name, outline}) => {
    return (
        <div className="header">
            <h3 className="view-name">{name}</h3>
            <div className="view-outline">{outline}</div>
        </div>
    );
};

export default Header;