describe('userdb', function () {

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
	});

	var UserDB = require('../userdb.js');
	var User = require('../user.js');

	it('should retreive users by username', function () {
		var user = new User();
		user.username = 'hwh';

		var db = new UserDB([user]);

		expect(db.get('hwh')).toBeInstanceOf(User);
	});

	it('should handle an empty db', function () {
		var db = new UserDB();

		expect(db.get('')).toBe(undefined);
	});

	it('should accept insertions', function () {
		var db = new UserDB();

		db.put({ username: 'hwh' });

		expect(db.get('hwh')).not.toBe(undefined);
	});

});
