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
import "./App.css"


const App = () => {
	const appContents = useRef();
	const intervalID = useRef();
	const [loginFlag, setLoginFlag] = useState(false);
	const [user, setUser] = useState(null);
	const [patient, setPatient] = useState(null);
	const [hospital, setHospital] = useState(null);

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
							<AddPatient setPatient={setPatient} />
						</Route>
						<Route path="/select-hospital">
							<SelectHospital patient={patient} />
						</Route>
						<Route path="/control-hospital">
							<ControlHospital />
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
