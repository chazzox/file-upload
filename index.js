const express = require('express');
const app = express();
const multer = require('multer');

const port = 8080;

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

app.use('/download', express.static(__dirname + '/upload'));

app.post('/upload', function (req, res) {
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
