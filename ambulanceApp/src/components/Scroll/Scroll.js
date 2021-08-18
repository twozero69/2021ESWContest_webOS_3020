import "./Scroll.css";

const Scroll = ({className, children}) => {
    return(
        <div className={`scroll ${className}`}>
            {children}
        </div>
    );
};

export default Scroll;