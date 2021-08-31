/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header";
import HospitalInfo from "../../components/HospitalInfo/HospitalInfo";
import KakaoMap from "../../components/KakaoMap/KakaoMap";
import { getHospitalList } from "../../functions/kakaoMapMethods";
import "./SelectHospital.css"

const SelectHospital = ({patient}) => {
    const map = useRef();
    const [loading, setLoading] = useState(true);
    const [hospitalList, setHospitalList] = useState(null);

    useEffect(async () => {
        const {
            location,
            severity,
            mkioskty,
            facility: {
                hospitalizaion,
                operation
            }
        } = patient;

        const list = await getHospitalList(mkioskty, location);
        /*
            병상수              dutyHano / hpbdn
            입원실              hvgc / hpgryn 
            입원실 가용여부      dutyHayn("1"-가능, "2"-불가능)
            수술실              hvoc / hpopyn
            응급실              hvec / hperyn
            응급실 운영여부     dutyEryn("1"-가능, "2"-불가능)
            주소                dutyAddr
            응급실전화          dutyTel3
            위도                wgs84Lat
            경도                wgs84Lon
            진료과목            dgidIdName
            외상센터 여부       trauma
            거리                distance
        */
       
       list.sort((a, b) => {
            //javascript sort에서는 return값이 1이상인 경우 a,b의 인덱스를 변경
            
            //외상환자
            if(severity == "심각" && a.trauma == false){
                if(b.trauma == true){
                    return 1;
                }
            }

            //응급실
            if(a.dutyEryn == "2"){
                if(b.dutyEryn == "1"){
                    return 1;
                }
            }

            //입원실
            if(hospitalizaion == "O" && a.dutyHayn == "2"){
                if(b.dutyHayn == "1"){
                    return 1;
                }
            }

            //수술실
            if(operation == "O" && a.hvoc < 1){
                if(b.hvoc >= 1){
                    return 1;
                }
            }

            //거리
            return a.distance - b.distance;
        });
        
        setHospitalList(list);
        setLoading(false);
    }, []);

    if(loading){
        return(
            <>
                loading...
            </>
        );
    }

    return(
        <>
            <Header name="병원선정" outline="환자를 수송할 병원을 선택합니다." />
            <div className="select-hospital">
                <ContentsBox className="map-contents" title="지도">
                    <KakaoMap map={map} location={patient.location}/>
                </ContentsBox>
                <ContentsBox className="list-contents" title="병원 목록">
                    {hospitalList.map((hospitalInfo, idx) => <HospitalInfo hospitalInfo={hospitalInfo} key={idx}/>)}
                </ContentsBox>
            </div>
        </>
    );
};

export default SelectHospital;