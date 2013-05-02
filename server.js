var port = 8124,
    url = 'localhost',

    http = require('http'),
    restful = require('restful'),
    resourceful = require('resourceful'),
    sys = require('sys'),
    exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout); }

var Control = resourceful.define('control', function () {
	this.use('memory');
});

Control.create = function (data, callback) {

	data = data || {};
	data.method = data.method || 'play';

	exec('./controls ' + data.method, puts);

	callback(null, { error: false });
};

var router = restful.createRouter([Control]);

var server = http.createServer(function (req, res) {
	req.chunks = [];
	req.on('data', function (chunk) {
		req.chunks.push(chunk.toString());
	});

	router.dispatch(req, res, function (err) {
		if(err) {
			res.writeHead(404);
			res.end();
		}
		console.log('Served', req.url);
	});
});

server.listen(port, url);

console.log('Server running at http://' + url + ":" + port);