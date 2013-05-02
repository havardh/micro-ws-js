var port = 8124,
    url = 'localhost',

    fs = require('fs'),
    http = require('http'),
    restful = require('restful'),
    resourceful = require('resourceful'),
    sys = require('sys'),
    exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout); }

/*
 * Echo module
 * */

var Echo = resourceful.define('echo', function () {
	this.use('memory');
});

Echo.create = function (data, callback) {

	if (!data || !data.msg) {
		callback({ msg: 'Must provide { msg: <msg> } as argument'});
		return;
	}

	exec('./echo/echo ' + data.msg, puts);

	callback(null, { msg: 'Echo ' + data.msg});
};

/*
 * Spotify module
 * */
var Spotify = resourceful.define('spotify', function () {
	this.use('memory');
});

Array.prototype.contains = function (el) {
	for (var i in this) {
		if (this[i] === el) {
			return true;
		}
	}
	return false;
 };

Spotify.create = function (data, callback) {
	var method,
	    arr = ['play', 'pause', 'prev', 'next', 'status'];

	if (!data || !data.method) {
		callback({ msg: 'Must provide { method: <method> } as argument' });
		return;
	}

	method = data.method;

	if ( ! (arr.contains(method)) ) {
		callback({ msg: 'Method is not supported: ' + method });
		return;
	}

	exec('spotify ' + data.method, function (err, stdout, stderr) {

		if (err) {
			callback(err);
			return;
		}

		callback(null, {
			msg: 'Method ' + data.method + ' performed',
			stdout: stdout,
			stderr: stderr
		});
	});
};


var router = restful.createRouter([Echo, Spotify]);

var server = http.createServer(function (req, res) {
	req.chunks = [];
	req.on('data', function (chunk) {
		req.chunks.push(chunk.toString());
	});

	router.dispatch(req, res, function (err) {

		var file, url = req.url;

		try {
			file = fs.readFileSync('./' + url);
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(file);
		} catch(e) {
			res.writeHead(404);
			res.end();
		}

		console.log('Served', req.url);
	});
});

server.listen(port, url);

console.log('Server running at http://' + url + ":" + port);