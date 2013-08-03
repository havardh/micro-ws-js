module.exports.create = function (service, process) {

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
	}

	return api;
};
