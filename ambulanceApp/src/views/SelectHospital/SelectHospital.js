/* eslint-disable */
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import ContentsBox from "../../components/ContentsBox/ContentsBox";
import Header from "../../components/Header/Header";
import HospitalBriefInfo from "../../components/HospitalBriefInfo/HospitalBriefInfo";
import HospitalDetailInfo from "../../components/HospitalDetailInfo/HospitalDetailInfo";
import Map from "../../components/Map/Map";
import { getHospitalList } from "../../functions/mapMethods";
import "./SelectHospital.css"
import { LS2speakTts } from "../../functions/ls2Methods";

const SelectHospital = ({patient, setPatient, ambulanceDistance}) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [hospitalList, setHospitalList] = useState(null);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [selectedHospitalInfo, setselectedHospitalInfo] = useState(null);

    useEffect(async () => {
        //환자가 설정되지 않은 경우 환자등록 페이지로 이동
        if(patient == null){
            LS2createToast("환자를 먼저 등록해주세요.");
            LS2speakTts("환자를 먼저 등록해주세요.");
            history.push("add-patient");
            return;
        }

        const {
            location,
            severity,
            mkioskty,
            facility: {
                hospitalizaion,
                operation
            }
        } = patient;

        let list = await getHospitalList(mkioskty, location);

        //1. 응급실, 입원실, 수술실 이용불가인 경우
        list = list.filter(({dutyEryn, hvec, dutyHayn, hvgc, hvoc}) => {
            //응급실
            if(dutyEryn == "2" || hvec <= 0)
                return false;

            //수술실
            if(hospitalizaion == "O" && (dutyHayn == "2" || hvgc <= 0))
                return false;

            //입원실
            if(operation == "O" && hvoc <= 0)
                return false;

            return true;
        });

        //2. 거리가 가까울 수록 우선순위를 높임
        list.sort((a, b) => {
            return a.geodistance - b.geodistance;
        })

        //3. 긴급환자의 경우 외상센터 우선순위를 높임
        if(severity == "긴급"){
            list.sort((a, b) => {
                if(a.trauma == true && b.trauma == false){
                    return -1;
                }
                else if(a.trauma == false && b.trauma == true){
                    return 1;
                }

                return 0;
            })
        }
        
        if(list.length > 10){
            list = list.slice(0, 10);
        }
        else if(list.length == 0){
            LS2createToast("조건을 만족하는 병원이 근처에 없습니다.");
            LS2speakTts("조건을 만족하는 병원이 근처에 없습니다.");
            history.push("add-patient");
        }

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