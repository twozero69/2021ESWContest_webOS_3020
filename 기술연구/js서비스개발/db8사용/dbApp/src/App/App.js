/* eslint-disable */
import LS2Request from '@enact/webos/LS2Request';
import { useState } from 'react';
import icon from '../../webos-meta/icon.png';
import './App.css';

const App = () => {
	const [text, setText] = useState('hello');
	const [serviceMsg, setServiceMsg] = useState('');
	const LS2 = new LS2Request();

	const onClickStart = (event) => {
		LS2.send({
			service : 'luna://com.app.dbexample.service',
			method : 'startActivity',
			parameters : {
				appID : 'com.app.dbexample'
			},
			onComplete : (res) => {
				setText('start activity');
				if(res.returnValue){
					setServiceMsg(res.message);
				}
				else{
					setServiceMsg(res.errorText);
				}
				console.log(res);
			}
		});
		console.log('request activity start');
	}

	const onClickStop = (event) => {
		LS2.send({
			service : 'luna://com.app.dbexample.service',
			method : 'stopActivity',
			parameters : {
				appID : 'com.app.dbexample'
			},
			onComplete : (res) => {
				setText('stop activity');
				if(res.returnValue){
					setServiceMsg(res.message);
				}
				else{
					setServiceMsg(res.errorText);
				}
				console.log(res);
			}
		});
		console.log('request activity stop');
	}

	const onClickToast = (event) => {
		LS2.send({
			service : 'luna://com.webos.notification',
			method : 'createToast',
			parameters : {
				sourceId : 'com.app.dbexample',
				message : 'hihihi',
				iconUrl : icon	//80x80만 가능.
			},
			onComplete : (res) => {
				setText('create toast')
				if(res.returnValue){
					setServiceMsg(res.toastId);
				}
				else{
					setServiceMsg(res.errorText);
				}
				console.log(res);
			}
		})
	}

	const onClickDB = (string) => {
		LS2.send({
			service : 'luna://com.app.dbexample.service',
			method : string,
			onComplete : (res) => {
				setText(string)
				if(res.payload.returnValue){
					setServiceMsg(res.message);
				}
				else{
					setServiceMsg(res.payload.errorText);
				}
				console.log(res);
			}
		});

		console.log(`request ${string}`);
	};

	return(
		<div>
			<h1>{text}</h1>
			<h1>server msg : {serviceMsg}</h1>
			<button onClick={onClickStart}>start activity</button>
			<button onClick={onClickStop}>stop activity</button>
			<button onClick={onClickToast}>create toast</button>
			<button onClick={() => onClickDB("putKind")}>putKind</button>
			<button onClick={() => onClickDB("delKind")}>delKind</button>
			<button onClick={() => onClickDB("put")}>put</button>
			<button onClick={() => onClickDB("get")}>get</button>
			<button onClick={() => onClickDB("find")}>find</button>
			<button onClick={() => onClickDB("search")}>search</button>
			<button onClick={() => onClickDB("del")}>del</button>
		</div>
	);
}

export default App;
