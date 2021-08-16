import "./Input.css";

const Input = ({type, value, setValue, placeholder}) => {
    const onChange = (event) => {
        const {target : {value}} = event;
        setValue(value);
    }

    return(
        <input type={type} value={value} placeholder={placeholder} onChange={onChange}/>
    );
};

export default Input;