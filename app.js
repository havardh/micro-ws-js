var di = require('di');

var FileService = require('./file-service.js');
var ServiceFactory = require('./service-factory.js');
var ServiceLoader = require('./service-loader.js');
var Service = require('./service.js').constructor;
var ApiFactory = require('./api-factory.js');
var fs = require('fs');
var process = require('child_process');

var module = {
	'fileService' : ['type', FileService],
	'serviceLoader' : ['type', ServiceLoader],
	'service': ['type', Service],
	'apiFactory' : ['value', ApiFactory],
	'serviceFactory' : ['value', ServiceFactory],
	'fileSystem' : ['value', fs],
	'process': ['value', process]
};

var injector = new di.Injector([module]);

injector.invoke(function (serviceLoader) {
	var services = serviceLoader.load('services');

});
