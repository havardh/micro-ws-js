function create(service, process) {

	if (!service || !service.name || !service.program) {
		throw new Error('Expected a Service');
	}

	if (!process || !process.exec) {
		throw new Error('Expected a Process');
	}

	var api = [];

	if (service.methods) {
		service.methods.map(function (method) {
			api['/' + service.name + '/' + method] = {
				get: function () {
					process.exec(service.program + ' ' + method);
				}
			};
		});
	} else	{
		api['/' + service.name] = {
			get: function () {
				process.exec(service.program);
			}
		};
	}

	return api;
};


module.exports = {
	create: create
};
