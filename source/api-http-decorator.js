function ApiHttpDecorator(api) {

	for (var path in api) {
		this[path] = function () {
			api[path](null, function (err) {
				if (err) {
					this.res.writeHead(400, {'Content-Type': 'application/json'});
				} else {
					this.res.writeHead(200, {'Content-Type': 'application/json'});
				}
				this.res.end();
			}.bind(this));
		};
	}

}

module.exports = ApiHttpDecorator;
