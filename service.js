var fs = require('fs'),
    sys = require('sys'),
    exec = require('child_process').exec,
    director = require('director');


function makeGet(service) {
	return function () {
		var filename = './services/' + service.name + "/" + (service.index || "index.html");
		fs.readFile(filename, function (err, data) {
			if (err) {
				this.res.writeHead(404, { 'Content-Type': 'text/plain' });
				this.res.end('Not Found ' + filename);
			} else {
				this.res.writeHead(200, { 'Content-Type': 'text/html' });
				this.res.end(data);
			}
		}.bind(this));
	};
}

function makePost(service) {
	return function () {
		service.post(this.req.body, function (err, res) {
			if (err) {
				this.res.writeHead(400, { 'Content-Type': 'application/json' });
				this.res.end(err);
			} else {
				this.res.writeHead(200, { 'Content-Type': 'application/json' });
				this.res.end(JSON.stringify(res));
			}
		}.bind(this));
	};
}

function renderService(service) {
	return '<a href="'+service.name+'">'+service.name+'</a>';
}

function renderServices(services) {
	return '<ul class="nav nav-tabs nav-stacked"><li>' + services.map(renderService).join('</li><li>') + '</li></ul>';
}

function renderIndex(services) {
	var head = '<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">';
	head += '<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>';
	var body = renderServices(services);

	return "<html><head>"+head+"<head><body>"+body+"</body></html>";
}

function createRouter(services) {

	function merge(obj, service) {

		obj['/'+service.name] = {
			get: makeGet(service),
			post: makePost(service)
		};

		return obj;
	}

	var table = services.reduce(merge, {});

	table['/'] = {
		get: function () {
			this.res.writeHead(200, { 'Content-Type': 'text/html' });
			this.res.end(renderIndex(services));
		}
	};

	console.log(table);

	return new director.http.Router(table);
}

function createService (options) {

	var name = options.name;
	var index = options.index;
	var cmd = options.cmd;

	function post (data, callback) {
		var method, methods = options.methods;

		if (!data || !data.method) {
			callback({ msg: 'Must provide { method: <method> } as argument' });
			return;
		}

		/*if ( ! (methods.indexOf(data.method) !== -1) ) {
		 callback({ msg: 'Method is not supported: ' + data.method });
		 return;
		 }*/

		exec(cmd + ' ' + data.method, function (err, stdout, stderr) {

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
	}

	return {
		index: index,
		name: name,
		post: post
	};
}

function listServices() {
	return fs.readdirSync('services');
}

function readServiceConfig(service) {

	var file = fs.readFileSync('services/' + service + '/config.json', 'utf8');
	var json = JSON.parse(file);
	return json;
}

function listConfigurations() {
	return listServices().map(readServiceConfig);
}

function loadServices(config) {
	config = config || listConfigurations();
	return config.map(createService);
}

module.exports.createRouter = createRouter;
module.exports.listConfigurations = listConfigurations;
module.exports.loadServices = loadServices;