function createArgs(data) {
	var args = '';
	for (var parameter in data) {
		args += ' -' + parameter + ' ' + data[parameter];
	}
	return args;
}

function create(service, process) {

	if (!service || !service.name || !service.program) {
		throw new Error('Expected a Service');
	}

	if (!process || !process.exec) {
		throw new Error('Expected a Process');
	}

	function exec(program, data, callback) {
		var args = createArgs(data);

		process.exec(program + args, callback);
	}

	function makeGet(url) {
		return function (data, callback) {
			exec(url, data, callback);
		};
	}

	var api = [];
	if (service.methods) {
		service.methods.map(function (method) {
			api['/' + service.name + '/' + method] = {
				get: makeGet(service.program + ' ' + method)
			};
		});
	} else	{
		api['/' + service.name] = {
			get: makeGet(service.program)
		};
	}

	return api;
};

module.exports = {
	create: create
};
