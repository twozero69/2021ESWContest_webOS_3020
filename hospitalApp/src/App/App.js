/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import ControlHospital from "../views/ControlHospital/ControlHospital"
import Telemedicine from "../views/Telemedicine/Telemedicine"
import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";
import { thinqGetToken } from "../functions/axiosMethods";
import { socket } from "../socket";
import "./App.css"
import { LS2createToast, LS2speakTts } from "../functions/ls2Methods";

const App = () => {
	console.log("앱 재렌더링");
	const appContents = useRef();
	const intervalID = useRef();
	const [loginFlag, setLoginFlag] = useState(false);
	const [user, setUser] = useState(null);
	const [hospitalData, setHospitalData] = useState({
		wards: [],
		equipmentRooms: [],
		operatingRooms: []
	});
	const patientData = useRef();
	const [ambulanceDistance, setAmbulanceDistance] = useState(30);

	useEffect(() => {
		//thinq AI Token 획득
		thinqGetToken();
		//발근된 Token은 60분동안 유효하므로 59분 주기로 재발급받는다.
		intervalID.current = setInterval(() => {
			thinqGetToken();
		}, 1000 * 60 * 59);

		//소켓 섷정
		socket.on("connect", () => {
			console.log(socket.id);
			socket.emit("deviceType", "hospital");
		});

		socket.on("patientData", data => {
			patientData.current = data;
			console.log(patientData.current);
			LS2createToast("새로운 환자가 연결되었습니다.");
			LS2speakTts("새로운 환자가 연결되었습니다.");
		})

		socket.on("hospitalData", data => {
			data.wards.forEach((ward, idx) => {
				const newHospitalData = {
					...hospitalData
				};

				newHospitalData["wards"][idx] = ward;
			});

			data.equipmentRooms.forEach((equipmentRoom, idx) => {
				const newHospitalData = {
					...hospitalData
				};

				newHospitalData["equipmentRooms"][idx] = equipmentRoom;
			});

			data.operatingRooms.forEach((operatingRoom, idx) => {
				const newHospitalData = {
					...hospitalData
				};

				newHospitalData["operatingRooms"][idx] = operatingRoom;
			});
		});

		socket.on("ambulanceDistance", ({dist}) => {
			setAmbulanceDistance(dist);
		});

		socket.on("hospitalLed", ({roomNumber, data}) => {
			const converter = {
				"01":{
					roomType: "wards",
					roomIdx: 0 
				},
				"02":{
					roomType: "wards",
					roomIdx: 1
				},
				"03":{
					roomType: "wards",
					roomIdx: 2 
				},
				"04":{
					roomType: "wards",
					roomIdx: 3 
				},
				"05":{
					roomType: "wards",
					roomIdx: 4 
				},
				"06":{
					roomType: "wards",
					roomIdx: 5 
				},
				"07":{
					roomType: "wards",
					roomIdx: 6 
				},
				"08":{
					roomType: "wards",
					roomIdx: 7 
				},
				"09":{
					roomType: "wards",
					roomIdx: 8 
				},
				"10":{
					roomType: "wards",
					roomIdx: 9 
				},
				"11":{
					roomType: "wards",
					roomIdx: 10 
				},
				"12":{
					roomType: "wards",
					roomIdx: 11
				},
				"13":{
					roomType: "wards",
					roomIdx: 12
				},
				"14":{
					roomType: "wards",
					roomIdx: 13
				},
				"15":{
					roomType: "wards",
					roomIdx: 14
				},
				"16":{
					roomType: "wards",
					roomIdx: 15
				},
				"17":{
					roomType: "operatingRooms",
					roomIdx: 0
				},
				"21":{
					roomType: "operatingRooms",
					roomIdx: 1
				},
				"22":{
					roomType: "equipmentRooms",
					roomIdx: 0
				},
				"19":{
					roomType: "equipmentRooms",
					roomIdx: 1
				},
				"20":{
					roomType: "equipmentRooms",
					roomIdx: 2
				}
			}

			const {roomType, roomIdx} = converter[roomNumber];
			const newHospitalData = {
				...hospitalData
			};

			newHospitalData[roomType][roomIdx].state = data;
			setHospitalData(newHospitalData);

			const roomStringConverter = {
				wards: "병실",
				equipmentRooms: "시설",
				operatingRooms: "수술실"
			}

			const dataStringConverter = {
				"0": "예약이 취소", 
				"1": "예약"
			}

			const roomString = roomStringConverter[roomType];
			const dataString = dataStringConverter[data];
			const message = `${roomString} ${dataString}되었습니다.`;
			LS2createToast(message);
			LS2speakTts(message);
		});
		
		return () => {
			clearInterval(intervalID.current);
		};
	}, []);


	return(
		<Router>
			{loginFlag ? (
				<>
					<NavigationBar user={user} setUser={setUser} setLoginFlag={setLoginFlag} appContents={appContents} />
					<div ref={appContents} className="app-contents">
						<Switch>
							{/* <Route path="/add-patient"> */}
							<Route exact path="/">
								<ControlHospital patientData={patientData} hospitalData={hospitalData} ambulanceDistance={ambulanceDistance} />
							</Route>
							<Route path="/telemedicine">
								<Telemedicine patientData={patientData} ambulanceDistance={ambulanceDistance} />
							</Route>
							<Redirect to="/" />
						</Switch>
					</div>
				</>
			) : (
				<>
					<Switch>
						<Route exact path="/">
							<SignIn setLoginFlag={setLoginFlag} setUser={setUser} />
						</Route>
						<Route path="/sign-up">
							<SignUp />
						</Route>
						<Redirect to="/" />
					</Switch>
				</>
			)}
		</Router>
	);
}

export default App;
