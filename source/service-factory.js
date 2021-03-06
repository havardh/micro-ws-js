var Service = require('./service.js');

function validateSpecification(spec) {
	if (!spec) {
		throw new Error('Expected a specification');
	}

	if (!spec.name) {
		throw new Error('Expected specification to contain a name property');
	}

	if (!spec.program) {
		throw new Error('Expected specification to contain a program property');
	}

}

function create(spec) {

	validateSpecification(spec);

	var service = new Service();

	service.name = spec.name;
	service.program = spec.program;
	service.methods = spec.methods;

	return service;

}

module.exports = {
	create: create
};
