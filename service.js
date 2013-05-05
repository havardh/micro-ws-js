var fs = require('fs'),
    sys = require('sys'),
    exec = require('child_process').exec,
    director = require('director');



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

function createRouter(services) {

	function merge(obj, service) {

		obj['/'+service.name] = {
			post: makePost(service)
		};

		return obj;
	}

	var table = services.reduce(merge, {});

	return new director.http.Router(table);
}

function createService (options) {

	var name = options.name;
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