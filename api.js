var di = require('di');

var ApiBuilder = require('./source/api-builder');
var FileService = require('./source/file-service.js');
var ServiceFactory = require('./source/service-factory.js');
var ServiceLoader = require('./source/service-loader.js');
var Service = require('./source/service.js').constructor;
var ApiFactory = require('./source/api-factory.js');
var fs = require('fs');
var process = require('child_process');

var module = {
	'apiBuilder': ['type', ApiBuilder],
	'fileService' : ['type', FileService],
	'serviceLoader' : ['type', ServiceLoader],
	'service': ['type', Service],
	'apiFactory' : ['value', ApiFactory],
	'serviceFactory' : ['value', ServiceFactory],
	'fileSystem' : ['value', fs],
	'process': ['value', process]
};

var injector = new di.Injector([module]);

injector.invoke(function (apiBuilder) {

	var api = apiBuilder.build('services');

	console.log(api);

	api['/spotify/play'].get('test', function (err, stdout, stderr) {
		console.log('err: ' + err);
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
	});



});
