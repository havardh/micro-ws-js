var port, host,

    express = require('express'),
    mustache = require('mustache'),
    service = require('./service.js'),
    fs = require('fs'),
    http = require('http'),
    sys = require('sys'),
    exec = require('child_process').exec;

(function () {
	var file = fs.readFileSync('config.json');
	var config = JSON.parse(file);
	port = config.port;
	host = config.host;
}());

function puts(error, stdout, stderr) { sys.puts(stdout); }

var Configurations = service.listConfigurations();
var Services = service.loadServices(Configurations);


var app = express();
var router = service.createRouter(Services);

var middleware = function (req, res, next) {
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
};

app.configure(function () {
	app.use(express.bodyParser({
		uploadDir: './tmp',
		keepExtensions: true
	}));
	app.use(middleware);
});

http.createServer(app).listen(port, host, function () {
	console.log('Server running at http://' + host + ":" + port);
});
