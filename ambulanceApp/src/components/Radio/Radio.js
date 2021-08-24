/* eslint-disable */
import "./Radio.css"

const Radio = ({value, setValue,  radios}) => {
    const onSelect = (event) => {
        const {target: value} = event;
        setValue(value);
    }

    return(
        <div className="radio-container">
            {radios.map((radioValue, idx) => (
                <div className="radio">
                    <input type="radio" id={idx} value={radioValue} checked={value == radioValue} onChange={onSelect} />
                    <label htmlFor={idx}>{radioValue}</label>
                </div>
            ))}
        </div>
    );
};

export default Radio;