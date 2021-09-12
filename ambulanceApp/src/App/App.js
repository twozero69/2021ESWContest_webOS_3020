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
import hospitalImage from "../../resources/images/hospital.png";
import "./App.css"


const App = () => {
	const appContents = useRef();
	const intervalID = useRef();
	const [loginFlag, setLoginFlag] = useState(false);
	const [user, setUser] = useState(null);
	const [patient, setPatient] = useState(null);
	const [hospitalData, setHospitalData] = useState({
		hospitalImage: hospitalImage,
		wards: [
			{
				x: 72,
				y: 60,
				wardNo: 101
			},
			{
				x: 72,
				y: 97,
				wardNo: 102
			},
			{
				x: 72,
				y: 134,
				wardNo: 103
			},
			{
				x: 72,
				y: 171,
				wardNo: 104
			},
			
			{
				x: 151,
				y: 60,
				wardNo: 105
			},
			{
				x: 151,
				y: 97,
				wardNo: 106
			},
			{
				x: 151,
				y: 134,
				wardNo: 107
			},
			{
				x: 151,
				y: 171,
				wardNo: 108
			},

			{
				x: 212,
				y: 60,
				wardNo: 109
			},
			{
				x: 212,
				y: 97,
				wardNo: 110
			},
			{
				x: 212,
				y: 134,
				wardNo: 111
			},
			{
				x: 212,
				y: 171,
				wardNo: 112
			},

			{
				x: 291,
				y: 60,
				wardNo: 113
			},
			{
				x: 291,
				y: 97,
				wardNo: 114
			},
			{
				x: 291,
				y: 134,
				wardNo: 115
			},
			{
				x: 291,
				y: 171,
				wardNo: 116
			}
		],
		equipmentRooms: [
			{
				textX: 218,
				textY: 315,
				points: "184 293, 253 293, 253 309, 285 309, 285 377, 220 377, 220 330, 196 330, 196 377, 184 377",
				roomKind: "CT검사실"
			},
			{
				textX: 102,
				textY: 295,
				points: "146 238, 146 316, 56 316, 56 271, 115 271, 115 238",
				roomKind: "MRI검사실"
			},
			{
				textX: 234,
				textY: 260,
				points: "184 226, 285 226, 285 304, 258 304, 258 288, 184 288",
				roomKind: "내시경검사실"
			}
		],
		operatingRooms: [
			{
				textX: 403,
				textY: 165,
				points: "351 122, 540 122, 540 153, 449 153, 449 201, 351 201",
				roomNo: 1
			},
			{
				textX: 364,
				textY: 264,
				points: "310 226, 417 226, 417 297, 310, 297",
				roomNo: 2
			},
		]
	});

	useEffect(() => {
		//thinq AI Token 획득
		thinqGetToken();
		//발근된 Token은 60분동안 유효하므로 59분 주기로 재발급받는다.
		intervalID.current = setInterval(() => {
			thinqGetToken();
		}, 1000 * 60 * 59);
		
		return () => {
			clearInterval(intervalID.current);
		};
	}, []);


	return(
		<Router>
			{loginFlag ? (<>
				<NavigationBar user={user} setUser={setUser} setLoginFlag={setLoginFlag} appContents={appContents} />
				<div ref={appContents} className="app-contents">
					<Switch>
						{/* <Route path="/add-patient"> */}
						<Route exact path="/">
							<AddPatient patient={patient} setPatient={setPatient} />
						</Route>
						<Route path="/select-hospital">
							<SelectHospital patient={patient} setHospitalData={setHospitalData} />
						</Route>
						<Route path="/control-hospital">
							<ControlHospital hospitalData={hospitalData} setHospitalData={setHospitalData} />
						</Route>
						<Route path="/telemedicine">
							<Telemedicine />
						</Route>
						<Redirect to="/" />
					</Switch>
				</div>
			</>) : (<>
				<Switch>
					<Route exact path="/">
						<SignIn setLoginFlag={setLoginFlag} setUser={setUser} />
					</Route>
					<Route path="/sign-up">
						<SignUp />
					</Route>
					<Redirect to="/" />
				</Switch>
			</>)}
		</Router>
	);
}

export default App;
