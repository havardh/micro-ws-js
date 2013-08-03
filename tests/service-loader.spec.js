describe('service-loader', function () {

	var Service = require('../service.js').constructor;
	var ServiceLoader = require('../service-loader.js');

	beforeEach(function() {
		this.addMatchers({
			toBeInstanceOf: function(expectedInstance) {
				var actual = this.actual;
				var notText = this.isNot ? " not" : "";

				if (actual && actual.constructor) {
					this.message = function() {
						return "Expected " + actual.constructor.name + notText + " is instance of " + expectedInstance.name;
					};
					return actual instanceof expectedInstance;
				} else {

					this.message = function () {
						return "Expected " + actual + " to have a constructor property";
					};
					return false;

				}

			}
		});

		this.fileServiceMock = {
			read: function () {},
			ls: function () {}
		};
		spyOn(this.fileServiceMock, 'read');
		spyOn(this.fileServiceMock, 'ls');

		this.serviceFactoryMock = {
			create: function () {}
		};
	});


	it('should require a file service', function() {

		expect(ServiceLoader).toThrow(new Error('Expects a FileService'));

	});

	it('should require a service factory', function() {
		var fileServiceMock = this.fileServiceMock;

		expect(function () { new ServiceLoader(
			fileServiceMock
		); }).toThrow(new Error('Expects a ServiceFactory'));

	});

	describe('load', function () {

		beforeEach(function () {
			this.serviceLoader = new ServiceLoader(
				this.fileServiceMock,
				this.serviceFactoryMock
			);

			this.fileServiceMock.ls.andReturn(['file']);
			spyOn(this.serviceFactoryMock, 'create');
		});

		it('should provide a load function', function() {

			expect(this.serviceLoader.load).toBeInstanceOf(Function);
		});

		it('should use filesystem to get a list of services', function() {
			spyOn(JSON, 'parse').andReturn({});
			this.serviceLoader.load('services');
			expect(this.fileServiceMock.ls).toHaveBeenCalledWith('services');
		});

		it('should report on empty service folder', function() {
			this.fileServiceMock.ls.andReturn([]);
			var serviceLoader = this.serviceLoader;

			expect(function () {serviceLoader.load('services');}).toThrow(new Error("Folder 'services' does not contain any services"));
		});


		it('should use get configs from services', function() {
			spyOn(JSON, 'parse').andReturn({});
			this.serviceLoader.load('services');

			expect(this.fileServiceMock.read).toHaveBeenCalledWith('services/file/config.json');

		});

		it('should run configs through service factory ', function() {

			var config = {};
			spyOn(JSON, 'parse').andReturn(config);

			this.serviceLoader.load('services');

			expect(this.serviceFactoryMock.create.mostRecentCall.args[0]).toBe(config);

		});

		it('should return a list of services', function () {
			spyOn(JSON, 'parse').andReturn({});
			this.serviceFactoryMock.create.andReturn(new Service());

			var services = this.serviceLoader.load('services');

			expect(services[0]).toBeInstanceOf(Service);

		});

		it('should tolarate exploding service', function() {
			spyOn(JSON, 'parse').andReturn({});
			this.fileServiceMock.read.andReturn({});
			this.serviceFactoryMock.create = function () {
				throw Error();
			};

			var serviceLoader = this.serviceLoader;
			expect(function () { serviceLoader.load('services'); }).not.toThrow();

		});
	});
});
