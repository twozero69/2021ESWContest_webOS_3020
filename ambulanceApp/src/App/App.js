/* eslint-disable */
import NavigationBar from "../components/NavigationBar";
import "./App.css"

import img from "../../webos-meta/icon.png"

const App = () => {
	const user = {
		image: img,
		name: '홍길동',
		job: '구급대원',
	}

	return (
		<NavigationBar user={user}/>
	);
}

export default App;
