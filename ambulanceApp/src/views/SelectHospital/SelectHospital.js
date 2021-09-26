/* eslint-disable */
import { useEffect, useState } from "react";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header";
import HospitalBriefInfo from "../../components/HospitalBriefInfo/HospitalBriefInfo";
import HospitalDetailInfo from "../../components/HospitalDetailInfo/HospitalDetailInfo";
import Map from "../../components/Map/Map";
import { getHospitalList } from "../../functions/mapMethods";
import "./SelectHospital.css"

const SelectHospital = ({patient, setPatient, ambulanceDistance}) => {
    const [loading, setLoading] = useState(true);
    const [hospitalList, setHospitalList] = useState(null);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [selectedHospitalInfo, setselectedHospitalInfo] = useState(null);

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
            -병원정보-
            기관명              dutyName
            주소                dutyAddr
            기관ID              hpid
            응급실 전화번호     dutyTel3
            병상수              dutyHano / hpbdn
            입원실              hvgc / hpgryn 
            입원실 가용여부      dutyHayn("1"-가능, "2"-불가능)
            수술실              hvoc / hpopyn
            응급실              hvec / hperyn
            응급실 운영여부     dutyEryn("1"-가능, "2"-불가능)
            CT장비 소유여부     hvctayn
            MRI장비 소유여부    hvmriayn
            조영촬영기 소유여부 hvangioayn
            인공호흡기 소유여부 hvventiayn
            주소                dutyAddr
            응급실전화          dutyTel3
            위도                wgs84Lat
            경도                wgs84Lon
            진료과목            dgidIdName
            외상센터 여부       trauma
            직선거리            geodistance(km)
            주행거리            drivingDistance(m, 최초에는 undefined -> 병원정보 선택 시 api를 호출하여 추가함.)
            주행시간            drivingTime(sec, 최초에는 undefined -> 병원정보 선택 시 api를 호출하여 추가함.)
            주행경로            drivingPath([lng, lat]배열, 최초에는 undefined -> 병원정보 선택 시 api를 호출하여 추가함.)
        */
       
        list.sort((a, b) => {
            //javascript sort에서는 return값이 1이상인 경우 a,b의 인덱스를 변경
            //정렬이 잘 동작하지 않는 것 같음. 추후에 디버깅할 것.
            
            //외상환자
            if(severity == "긴급" && a.trauma == false && b.trauma == true){
                return 1;
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
            return a.geodistance - b.geodistance;
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
            <Header patient={patient} setPatient={setPatient} name="병원선정" outline="환자를 수송할 병원을 선택합니다." ambulanceDistance={ambulanceDistance} />
            <div className="select-hospital">
                <RenderAfterNavermapsLoaded ncpClientId={process.env.REACT_APP_NAVER_CLIENT_ID}>
                    <ContentsBox className="map-contents" title="지도">
                        <Map hospitalList={hospitalList} location={patient.location} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} setselectedHospitalInfo={setselectedHospitalInfo}/>
                    </ContentsBox>
                    <ContentsBox className="list-contents" title="병원 목록">
                        {hospitalList.map((hospitalInfo, idx) => <HospitalBriefInfo key={idx} hospitalInfo={hospitalInfo} idx={idx} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} />)}
                    </ContentsBox>
                    <ContentsBox className="detail-contents" title="상세 정보">
                        <HospitalDetailInfo selectedHospitalInfo={selectedHospitalInfo} patient={patient} />
                    </ContentsBox>
                </RenderAfterNavermapsLoaded>
            </div>
        </>
    );
};

export default SelectHospital;