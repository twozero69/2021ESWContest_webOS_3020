/* eslint-disable */
import { useEffect } from "react";
import "./SelectHospital.css"

const SelectHospital = ({patient}) => {
    useEffect(() => {
        console.log(patient);
    }, [])

    return(
        <>
            SelectHospital
        </>
    );
};

export default SelectHospital;