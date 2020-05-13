const express = require('express');
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
const upload = multer({ storage: storage });

function getNewestFile(files, path) {
	var out = [];
	files.forEach(function (file) {
		var stats = fs.statSync(path + '/' + file);
		if (stats.isFile()) {
			out.push({ file: file, mtime: stats.mtime.getTime() });
		}
	});
	out.sort(function (a, b) {
		return b.mtime - a.mtime;
	});
	return out.length > 0 ? out[0].file : '';
}
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const port = 8000;

app.get('/download', (req, res) => {
	const file = __dirname + '/upload/seshcraft.zip';
	res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
	res.setHeader('Content-type', mime.lookup(file));
	fs.createReadStream(file).pipe(res);
});

app.post('/upload', upload.single('file'), function (req, res) {
	res.statusCode = 302;
	res.setHeader('Location', 'http://localhost:3000?success');
	res.end();
});

app.listen(port, (req, res) => console.log(`server is up: http://localhost:${port}`));
