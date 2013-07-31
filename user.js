var UserDB = require('./userdb.js');

function User(password, groups) {

	this.authenticate = function (pass) {
		return password === pass;
	};

	this.groups = function () {
		return groups;
	};

	this.hasGroup = function (group) {
		return groups && groups.indexOf(group) !== -1;
	};
}

module.exports = User;
