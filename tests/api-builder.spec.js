describe('api-builder', function () {

	var ApiBuilder = require('../source/api-builder.js');

	beforeEach(function () {
		this.serviceLoader = { load: function () { } };
		this.apiFactory = { create: function () {} };
		this.process = { exec: function () {} };
	});

	it('should expect a serviceLoader', function() {
		expect(function () {
			new ApiBuilder({});
		}).toThrow(new Error('Expected a ServiceLoader'));
	});


	it('should expect a apiFactory', function() {

		expect(function () {
			new ApiBuilder(this.serviceLoader, {});
		}.bind(this)).toThrow(new Error('Expected a ApiFactory'));
	});

	it('should expect a process', function () {

		expect(function () {
			new ApiBuilder(this.serviceLoader, this.apiFactory, {});
		}.bind(this)).toThrow(new Error('Expected a Process'));

	});

	describe('build', function () {

		beforeEach(function () {
			this.apiBuilder = new ApiBuilder(
				this.serviceLoader,
				this.apiFactory,
				this.process
			);
			this.service = {};
			spyOn(this.serviceLoader, 'load').andReturn([this.service]);
			spyOn(this.apiFactory, 'create').andReturn({});
		});


		it('should provide a build function', function() {
			expect(this.apiBuilder.build).toBeDefined();
		});

		it('should pass parameter to serviceLoader', function() {

			this.apiBuilder.build('services');

			expect(this.serviceLoader.load).toHaveBeenCalledWith('services');
		});


		it('should pass each service to the factory', function() {

			this.apiBuilder.build();

			expect(this.apiFactory.create.mostRecentCall.args[0]).toBe(this.service);
		});

		it('should return service api', function() {
			this.serviceLoader.load.andReturn([{}, {}]);

			var serviceApis = this.apiBuilder.build();

			expect(serviceApis.length).toBe(2);
		});


	});

});
