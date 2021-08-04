/* eslint-disable */
import { useRef, useState } from "react";

const App = () => {
	const [stream, setStream] = useState(null);
	const myStream = useRef();

	const getVideo = () => {
		window.navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false
		}).then(stream => {
			setStream(stream);
			myStream.current.srcObject = stream;
		}).catch(error => {
			console.log(error);
		});
	};

	const getAudio = () => {
		window.navigator.mediaDevices.getUserMedia({
			video: false,
			audio: true
		}).then(stream => {
			setStream(stream);
			myStream.current.srcObject = stream;
		}).catch(error => {
			console.log(error);
		});
	};

	const getBoth = () => {
		window.navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then(stream => {
			setStream(stream);
			myStream.current.srcObject = stream;
		}).catch(error => {
			console.log(error);
		});
	}

	return(
		<div>
			<h1 style={{color: "white"}}>webRTC video test</h1>
			<button onClick={getVideo}>Get Video</button>
			<button onClick={getAudio}>Get Audio</button>
			<button onClick={getBoth}>Get Video and Audio</button>
			<br/>
			{stream && <video ref={myStream} playsInline autoPlay style={{width: "300px"}}/>}
		</div>
	)
}

export default App;
