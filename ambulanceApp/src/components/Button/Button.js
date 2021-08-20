import "./Button.css";

const Button = ({children, ...other}) => {
    return(
        <button {...other}>{children}</button>
    );
};

export default Button;