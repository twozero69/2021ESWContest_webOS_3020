/* eslint-disable */
import LS2Request from '@enact/webos/LS2Request';
import { useState } from 'react';
import icon from '../../webos-meta/icon.png'

const App = () => {
	const [text, setText] = useState('hello');
	const [serverMsg, setServerMsg] = useState('');
	const LS2 = new LS2Request();

	const onClickStart = (event) => {
		LS2.send({
			service : 'luna://com.app.socketserver.service',
			method : 'startServer',
			parameters : {
				appID : 'com.app.socketserver'
			},
			onComplete : (res) => {
				setText('start server');
				if(res.returnValue){
					setServerMsg(res.message);
				}
				else{
					setServerMsg(res.errorText);
				}
				console.log(res);
			}
		});
		console.log('request server start');
	}

	const onClickStop = (event) => {
		LS2.send({
			service : 'luna://com.app.socketserver.service',
			method : 'stopServer',
			parameters : {
				appID : 'com.app.socketserver'
			},
			onComplete : (res) => {
				setText('stop server');
				if(res.returnValue){
					setServerMsg(res.message);
				}
				else{
					setServerMsg(res.errorText);
				}
				console.log(res);
			}
		});
		console.log('request server stop');
	}

	const onClickToast = (event) => {
		LS2.send({
			service : 'luna://com.webos.notification',
			method : 'createToast',
			parameters : {
				sourceId : 'com.app.socketserver',
				message : 'hihihi',
				iconUrl : icon	//80x80만 가능.
			},
			onComplete : (res) => {
				setText('create toast')
				if(res.returnValue){
					setServerMsg(res.toastId);
				}
				else{
					setServerMsg(res.errorText);
				}
				console.log(res);
			}
		})
	}


	return(
		<div>
			<h1 style={{color: "white"}}>{text}</h1>
			<h1 style={{color: "white"}}>server msg : {serverMsg}</h1>
			<button onClick={onClickStart}>start server</button>
			<button onClick={onClickStop}>stop server</button>
			<button onClick={onClickToast}>create toast</button>
		</div>
	);
}

export default App;
