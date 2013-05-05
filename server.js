var port, host,

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

var router = service.createRouter(Services);

var server = http.createServer(function (req, res) {
	req.chunks = [];
	req.on('data', function (chunk) {
		req.chunks.push(chunk.toString());
	});

	router.dispatch(req, res, function (err) {

		var file, url = req.url;

		if (req.url == '/list') {

			function renderList() {
				var template = "{{name}}";
				var html = Configurations.map(function (view) { return mustache.to_html(template, view); }).join('<br>');
				return html;
			}

			console.log('..');
			res.writeHead(200);
			res.end(renderList());
		}

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

server.listen(port, host);

console.log('Server running at http://' + host + ":" + port);