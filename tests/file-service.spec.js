describe('file-service', function () {

	var FileService = require("../source/file-service.js");

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

		this.fileSystemMock = {
			readFileSync: function () {},
			readdirSync: function () {}
		};
		spyOn(this.fileSystemMock, 'readFileSync');
		spyOn(this.fileSystemMock, 'readdirSync');

	});



	it('should require a filesystem', function() {

		expect(function () { new FileService(); }).toThrow(new Error('FileSystem object must be provided'));

	});

	describe('read', function () {

		it('should provide read function', function() {
			var fileService = new FileService(this.fileSystemMock);

			expect(fileService.read).toBeInstanceOf(Function);
		});

		it('should use filesystem', function () {
			var fileService = new FileService(this.fileSystemMock);

			fileService.read('file');

			expect(this.fileSystemMock.readFileSync).toHaveBeenCalledWith('file');
		});

		it('should return result from filesystem', function () {

			this.fileSystemMock.readFileSync.andReturn('hellos');
			var fileService = new FileService(this.fileSystemMock);

			expect(fileService.read('file')).toBe('hellos');

		});
	});

	describe('ls', function () {

		beforeEach(function () {
			this.fileService = new FileService(this.fileSystemMock);
		});

		it('should provide ls function', function() {

			expect(this.fileService.read).toBeInstanceOf(Function);
		});

		it('should use filesystem ', function() {

			this.fileService.ls('services');

			expect(this.fileSystemMock.readdirSync).toHaveBeenCalledWith('services');
		});

		it('should return result from filesystem', function() {

			this.fileSystemMock.readdirSync.andReturn(['file1']);

			var files = this.fileService.ls('services');

			expect(files[0]).toBe('file1');
		});

	});

});
