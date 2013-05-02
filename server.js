var port = 8124,
    url = 'localhost',

    http = require('http'),
    restful = require('restful'),
    resourceful = require('resourceful'),
    sys = require('sys'),
    exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout); }

var Echo = resourceful.define('echo', function () {
	this.use('memory');
});

Echo.create = function (data, callback) {

	if (!data || !data.msg) {
		callback({ msg: 'Must provide { msg: <msg> } as argument'});
		return;
	}

	exec('./echo/echo ' + data.msg, puts);

	callback(null, { msg: 'Echo ' + data.msg});
};

var router = restful.createRouter([Echo]);

var server = http.createServer(function (req, res) {
	req.chunks = [];
	req.on('data', function (chunk) {
		req.chunks.push(chunk.toString());
	});

	router.dispatch(req, res, function (err) {
		if(err) {
			res.writeHead(404);
			res.end();
		}
		console.log('Served', req.url);
	});
});

server.listen(port, url);

console.log('Server running at http://' + url + ":" + port);