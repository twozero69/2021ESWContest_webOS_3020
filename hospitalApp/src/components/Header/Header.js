import "./Header.css";

const Header = ({name, outline, ambulanceDistance}) => {
    return (
        <div className="header">
            <h3 className="view-name">{name}</h3>
            <div className="view-outline">{outline}</div>
            <progress value={40-ambulanceDistance} max="50"></progress>
        </div>
    );
};

export default Header;