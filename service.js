var fs = require('fs'),
    resourceful = require('resourceful'),
    sys = require('sys'),
    exec = require('child_process').exec;

function createService (options) {

	var name = options.name;
	var cmd = options.cmd;


	var service = resourceful.define(name, function () {
		this.use('memory');
	});

	service.create = function (data, callback) {
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
	};

	return service;
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

module.exports.listConfigurations = listConfigurations;
module.exports.loadServices = loadServices;