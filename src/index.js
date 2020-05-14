import ReactDOM from 'react-dom';
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { post } from 'axios';

import logo from './seshcraft.png';
import './index.css';

// const ip = 'http://localhost';
const ip = 'http://ec2-52-91-0-119.compute-1.amazonaws.com';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			didStart: false,
			didComplete: false,
			uploadSuccess: false,
			file: null,
			password: '',
			message: '',
			progress: 0
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onPassChange = this.onPassChange.bind(this);
	}

	onFormSubmit(e) {
		e.preventDefault(); // Stop form submit
		this.uploadFile(this.state.file).then((response) => {
			this.setState({
				uploadSuccess: response.data.success,
				didComplete: true,
				didStart: false,
				message: response.data.reason
			});
		});
	}
	onChange(e) {
		this.setState({ file: e.target.files[0] });
	}
	onPassChange(e) {
		this.setState({ password: e.target.value });
	}

	uploadFile(file) {
		this.setState({ didStart: true });
		const url = ip + ':8080/upload?pwd=' + this.state.password;
		const formData = new FormData();
		formData.append('file', file);
		return post(url, formData, {
			headers: {
				'content-type': 'multipart/form-data'
			},
			body: 'test',
			onUploadProgress: (progressEvent) =>
				this.setState({ progress: Math.round((progressEvent.loaded * 100) / progressEvent.total) })
		});
	}

	render() {
		return (
			<div className="App">
				<Message
					key={`${this.state.didComplete}`}
					open={this.state.didComplete}
					type={this.state.uploadSuccess ? 'success' : 'error'}
					message={this.state.message}
					uploadOver={() => {
						this.setState({ didStart: false, didComplete: false, uploadSuccess: false, password: '' });
					}}
				/>

				<img src={logo} className="App-logo" alt="logo" />
				<h1>File upload</h1>
				<form onSubmit={this.onFormSubmit}>
					<input
						type="text"
						value={this.state.password}
						onChange={this.onPassChange}
						placeholder={'password here'}
					/>
					<input type="file" onChange={this.onChange} />
					<button type="submit">Upload</button>
				</form>
				{this.state.didStart ? (
					<div className="myProgress">
						<div className="myBar" style={{ width: this.state.progress + '%' }} />
					</div>
				) : null}
				<a className="App-link" href={`http://${ip}:8080/download`}>
					click here to download current modpack
				</a>
			</div>
		);
	}
}

class Message extends React.Component {
	constructor(props) {
		super(props);

		this.state = { open: this.props.open };
	}
	com;
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ open: false });
		this.props.uploadOver();
	};
	render() {
		return (
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={this.state.open}
				autoHideDuration={5000}
				onClose={() => this.handleClose()}
			>
				<MuiAlert onClose={() => this.handleClose()} severity={this.props.type} elevation={6} variant="filled">
					{this.props.message}
				</MuiAlert>
			</Snackbar>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
