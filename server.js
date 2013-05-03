var port = 8080,
    url = '192.168.0.196',

    service = require('./service.js'),
    fs = require('fs'),
    http = require('http'),
    restful = require('restful'),
    resourceful = require('resourceful'),
    sys = require('sys'),
    exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout); }

Array.prototype.contains = function (el) {
	for (var i in this) {
		if (this[i] === el) {
			return true;
		}
	}
	return false;
};

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

var Spotify = service({
	name: 'spotify',
	cmd: 'spotify',
	methods: ['play', 'pause', 'next', 'prev', 'status']
});

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