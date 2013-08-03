describe('api-factory', function () {

	var ApiFactory = require('../source/api-factory');

	beforeEach(function () {
		this.serviceMock = {
			name: 'file',
			program: 'file',
			methods: ['get']
		};

		this.processMock = {
			exec: function () {}
		};
		spyOn(this.processMock, 'exec');
	});


	it('should provide a create function', function() {
		expect(ApiFactory.create).toBeDefined();
	});


	it('should expect a service', function() {
		expect(ApiFactory.create).toThrow(new Error('Expected a Service'));
	});

	it('should expect a process', function() {
		var serviceMock = this.serviceMock;
		expect(function () { ApiFactory.create(serviceMock); }).toThrow(new Error('Expected a Process'));
	});

	it('should construct a api', function () {
		var api = ApiFactory.create(this.serviceMock, this.processMock);
		expect(api['/file/get']).toBeDefined();
	});

	describe('api', function () {



		it('should contain get method', function () {
			var api = ApiFactory.create(this.serviceMock, this.processMock);

			expect(api['/file/get'].get).toBeDefined();
		});

		describe('get', function () {

			it('should be on root when no methods', function() {
				this.serviceMock.methods = undefined;
				var api = ApiFactory.create(this.serviceMock, this.processMock);

				expect(api['/file'].get).toBeDefined();
			});

			it('should call underlying program', function() {
				var api = ApiFactory.create(this.serviceMock, this.processMock);

				api['/file/get'].get();

				expect(this.processMock.exec).toHaveBeenCalledWith('file get');
			});

		});

	});

});
