/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import AddPatient from "../views/AddPatient/AddPatient";
import SelectHospital from "../views/SelectHospital/SelectHospital";
import ControlHospital from "../views/ControlHospital/ControlHospital"
import Telemedicine from "../views/Telemedicine/Telemedicine"
import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";
import { thinqGetToken } from "../functions/axiosMethods";
import { socket } from "../socket";
import "./App.css"


const App = () => {
	console.log("앱 재렌더링");
	const appContents = useRef();
	const intervalID = useRef();
	const [loginFlag, setLoginFlag] = useState(false);
	const [user, setUser] = useState(null);
	const [patient, setPatient] = useState(null);
	const [hospitalData, setHospitalData] = useState({
		wards: [],
		equipmentRooms: [],
		operatingRooms: []
	});
	const hospitalSocket = useRef();
	const [ambulanceDistance, setAmbulanceDistance] = useState();

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
			socket.emit("deviceType", "ambulance");
		});

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

			data.wards.forEach((operaingRoom, idx) => {
				const newHospitalData = {
					...hospitalData
				};

				newHospitalData["operatingRooms"][idx] = operaingRoom;
			});

			hospitalSocket.current = data.hospitalSocket;
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
								<AddPatient patient={patient} setPatient={setPatient} />
							</Route>
							<Route path="/select-hospital">
								<SelectHospital patient={patient} />
							</Route>
							<Route path="/control-hospital">
								<ControlHospital hospitalData={hospitalData} />
							</Route>
							<Route path="/telemedicine">
								<Telemedicine hospitalSocket={hospitalSocket.current} />
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
