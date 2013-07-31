function  hasAllPermission(user, permission) {
	var flag = parseInt(permission.privileges[2]);

	return flag > 0;
}

function hasGroupPermission(user, permission) {
	var group = permission.group,
	    flag = parseInt(permission.privileges[1]);

	return user.hasGroup(group) && flag > 0;
}

function hasUserPermission(user, permission) {
	var owner = permission.owner,
	    flag = parseInt(permission.privileges[0]);

	return user.username = owner && flag > 0;
}

function hasPermission(user, permission) {

	if (hasAllPermission(user, permission)) {
		return true;
	}

	if (hasGroupPermission(user, permission)) {
		return true;
	}

	if (hasUserPermission(user, permission)) {
		return true;
	}

	return false;
}

module.exports = {
	hasPermission: hasPermission
};
