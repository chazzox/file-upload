import ReactDOM from 'react-dom';
import React from 'react';
import logo from './seshcraft.png';
import './index.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			callBackSuccess: document.location.href.split('?')[1] === 'success',
			callBackFail: document.location.href.split('?')[1] === 'error'
		};
	}

	render() {
		return (
			<div className="App">
				<img src={logo} className="App-logo" alt="logo" />
				<form action="http://localhost:8000/upload" encType="multipart/form-data" method="post">
					<input type="file" name="file" />
					<input type="submit" value="upload file" />
				</form>
				<a className="App-link" href="http://localhost:8000/download">
					click here to download current modpack
				</a>
			</div>
		);
	}
}

class Message extends React.Component {
	render() {
		return 'test';
	}
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
