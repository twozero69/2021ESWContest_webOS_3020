/* eslint-disable */
import "./Input.css";

const Input = ({type, id, value, setValue, placeholder}) => {
    const onChange = (event) => {
        const {target: {value}} = event;
        setValue(value);
    }

    return(
        <input type={type} id={id} value={value} placeholder={placeholder} onChange={onChange}/>
    );
};

export default Input;