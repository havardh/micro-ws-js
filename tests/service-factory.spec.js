describe('service-factory', function () {

	var Service = require('../source/service.js');
	var ServiceFactory = require("../source/service-factory.js");

	beforeEach(function() {
		this.addMatchers({
			toBeInstanceOf: function(expectedInstance) {
				var actual = this.actual;
				var notText = this.isNot ? " not" : "";
				this.message = function() {
					return "Expected " + actual.constructor.name + notText + " is instance of " + expectedInstance.name;
				};
				return actual instanceof expectedInstance;
			}
		});
	});

	it('should create service objects', function() {
		var service = ServiceFactory.create({ name: "name", program: "prog"});

		expect(service).toBeInstanceOf(Service);
	});

	it('should require a spec', function() {
		expect(ServiceFactory.create).toThrow(new Error('Expected a specification'));
	});

	describe('spec', function () {

		it('should contain name and program property', function() {

			expect(function () { ServiceFactory.create({}); }).toThrow(new Error('Expected specification to contain a name property'));
			expect(function () { ServiceFactory.create({ name: "name" }); }).toThrow(new Error('Expected specification to contain a program property'));
		});

	});

	it('should add default properties to the service', function() {
		var service = ServiceFactory.create({
			name: "name", program: "prog", methods: ['exec']
		});

		expect(service.name).toBe('name');
		expect(service.program).toBe('prog');
		expect(service.methods).toEqual(['exec']);
	});

});
