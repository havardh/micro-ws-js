describe('user', function () {
	var User = require('../source/user.js');

	it('should authenticate user with correct password', function () {
		var user = new User('pass');

		expect(user.authenticate('pass')).toBe(true);
	});

	it('should not authenticate user with wrong password', function () {
		var user = new User();
		expect(user.authenticate('pass')).toBe(false);
	});

	it('should check for groups', function () {
		var user = new User('', ['dev']);

		expect(user.hasGroup('dev')).toBe(true);
		expect(user.hasGroup('devs')).toBe(false);
	});
});
