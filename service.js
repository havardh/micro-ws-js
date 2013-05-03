var resourceful = require('resourceful'),
    sys = require('sys'),
    exec = require('child_process').exec;

module.exports = function (options) {

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

		method = data.method;

		if ( ! (methods.contains(method)) ) {
			callback({ msg: 'Method is not supported: ' + method });
			return;
		}

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
