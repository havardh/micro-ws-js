var port = 8080,
    url = '78.91.39.220', //'192.168.0.196',

    mustache = require('mustache'),
    service = require('./service.js'),
    fs = require('fs'),
    http = require('http'),
    sys = require('sys'),
    exec = require('child_process').exec;

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

server.listen(port, url);

console.log('Server running at http://' + url + ":" + port);