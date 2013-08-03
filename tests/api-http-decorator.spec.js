describe('ApiHttpDecorator', function () {

	var ApiHttpDecorator = require('../source/api-http-decorator.js');

	beforeEach(function () {
		this.api = { '/file': jasmine.createSpy() };
		this.decoratedApi = new ApiHttpDecorator(this.api);

		this.resMock = {
			writeHead: jasmine.createSpy(),
			end: jasmine.createSpy()
		};
	});


	it('should wrap methods', function() {

		expect(this.decoratedApi['/file']).toBeDefined();
		expect(this.decoratedApi['/file']).not.toBe(this.api['/file']);

	});

	it('should delegate to api', function() {

		this.decoratedApi['/file'].call({ res: this.resMock});

		expect(this.api['/file']).toHaveBeenCalled();

	});

	describe('results', function () {

		beforeEach(function () {

			this.api = { '/file': function (data, fn) {
				this.callback = fn;
			}.bind(this)};
			this.decoratedApi = new ApiHttpDecorator(this.api);

			this.decoratedApi['/file'].call({ res: this.resMock});
		});


		it('should report success when api succeded', function() {

			expect(this.callback).toBeDefined();
			this.callback(null);

			expect(this.resMock.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json'});
			expect(this.resMock.end).toHaveBeenCalled();
		});

		it('should return 400 if api fails', function() {

			this.callback({});

			expect(this.resMock.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json'});
			expect(this.resMock.end).toHaveBeenCalled();
		});


	});




});
