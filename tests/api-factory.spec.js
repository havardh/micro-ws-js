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

			beforeEach(function () {
				this.api = ApiFactory.create(this.serviceMock, this.processMock);
			});

			it('should be on root when no methods', function() {
				this.serviceMock.methods = undefined;
				var api = ApiFactory.create(this.serviceMock, this.processMock);

				expect(api['/file'].get).toBeDefined();
			});

			it('should call underlying program', function() {

				this.api['/file/get'].get();

				expect(this.processMock.exec.mostRecentCall.args[0]).toBe('file get');
			});

			it('should pass along parameters', function() {

				this.api['/file/get'].get({
					name: 'test'
				});

				expect(this.processMock.exec.mostRecentCall.args[0]).toContain("-name test");

			});

			describe('callback', function () {

				beforeEach(function () {
					this.callback = jasmine.createSpy();
					this.api['/file/get'].get(null, this.callback);

					this.processCallback = this.processMock.exec.mostRecentCall.args[1];

				});

				it('should be called with result', function() {

					var stdout = 'stdout';
					var stderr = 'stderr';
					this.processCallback(null, stdout, stderr);

					expect(this.callback).toHaveBeenCalled();
				});

				it('should be called with error', function() {
					var stdout = 'stdout';
					var stderr = 'stderr';
					this.processCallback({}, stdout, stderr);

					var err = this.callback.mostRecentCall.args[0];
					expect(err).toBeDefined();
				});

			});

		});

	});

});
