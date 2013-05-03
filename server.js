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

function listServices() {
	return fs.readdirSync('services');
}

function readServiceConfig(service) {

	var file = fs.readFileSync('services/' + service + '/config.json', 'utf8');
	var json = JSON.parse(file);
	return json;
}

function loadServices() {
	return listServices().map(readServiceConfig).map(service);
}

var Services = loadServices();

var router = restful.createRouter(Services);

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