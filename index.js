const express = require('express');
const path = require('path');
const mime = require('mime');
const app = express();
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload');
	},
	filename: function (req, file, cb) {
		cb(null, 'seshcraft.zip');
	}
});
const upload = multer({ storage: storage }).single('file');

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const port = 8080;

app.get('/download', (req, res) => {
	const file = __dirname + '/upload/seshcraft.zip';
	res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
	res.setHeader('Content-type', mime.lookup(file));
	fs.createReadStream(file).pipe(res);
});

app.post('/upload', function (req, res) {
	console.log(req.query.pwd);
	if (req.query.pwd === '3tVXSRUkKxpyV3X9')
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				console.log(err);
				res.send({ success: false, reason: 'file was not a zip' });
			} else if (err) {
				console.log(err);
				// An unknown error occurred when uploading.
				res.send({ success: false, reason: 'internal server error, please contact the administrator' });
				return;
			}
			res.send({ success: true, reason: 'upload complete!' });
			// Everything went fine.
		});
	else res.send({ success: false, reason: 'password was incorrect' });
});

app.listen(port, (req, res) => console.log(`server is up: http://localhost:${port}`));
