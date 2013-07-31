var userdb;


function UserDB(db) {

	this.get = function (username) {
		if (db) {
			return db.filter(function (user) {
				return user.username == username;
			})[0];
		}
	};

	this.put = function (user) {
		if (!db) {
			db = [];
		}

		db.push(user);
	};
}

module.exports = UserDB;
