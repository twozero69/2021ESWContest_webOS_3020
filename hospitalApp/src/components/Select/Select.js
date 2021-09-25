/* eslint-disable */
import "./Select.css";

const Select = ({id, value, setValue, placeholder, options}) => {
    const onChange = (event) => {
        const {target: {value}} = event
        setValue(value)
    }

    return(
        <select id={id} value={value} onChange={onChange}>
            <option value="default" hidden>{placeholder}</option>
            {options.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
        </select>
    );
};

export default Select;