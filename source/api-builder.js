module.exports = function (serviceLoader, apiFactory, process) {

	if (!serviceLoader || !serviceLoader.load) {
		throw new Error('Expected a ServiceLoader');
	}

	if (!apiFactory || !apiFactory.create) {
		throw new Error('Expected a ApiFactory');
	}

	if (!process || !process.exec) {
		throw new Error('Expected a Process');
	}

	this.build = function (path) {
		var services = serviceLoader.load(path);

		var apis = [];
		if (services) {

			for (var i in services) {

				apis.push(apiFactory.create(services[i], process));

			}
		}

		return apis;
	};

};
