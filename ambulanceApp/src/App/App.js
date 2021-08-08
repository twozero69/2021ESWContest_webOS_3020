/* eslint-disable */
import { useState } from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import AddPatient from "../views/AddPatient";
import SelectHospital from "../views/SelectHospital";
import ControlHospital from "../views/ControlHospital"
import Telemedicine from "../views/Telemedicine"

import "./App.css"

import img from "../../webos-meta/icon.png"

const App = () => {
	const [loginFlag, setLoginFlag] = useState(true);
	const [user, setUser] = useState({
		image: img,
		name: '홍길동',
		job: '구급대원',
	});

	return(
		<Router>
			{loginFlag ? (<>
				<NavigationBar user={user}/>
				<Switch>
					<Route path="/add-patient">
						<AddPatient/>
					</Route>
					<Route path="/select-hospital">
						<SelectHospital/>
					</Route>
					<Route path="/control-hospital">
						<ControlHospital/>
					</Route>
					<Route path="/telemedicine">
						<Telemedicine/>
					</Route>
				</Switch>
			</>) : (<>

			</>)}
		</Router>
	);
}

export default App;
