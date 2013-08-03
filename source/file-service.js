module.exports = function (fileSystem) {

	if (!fileSystem || !fileSystem.readFileSync) {
		throw new Error('FileSystem object must be provided');
	}

	this.read = function (file) {
		return fileSystem.readFileSync(file);
	};

	this.ls = function (folder) {
		return fileSystem.readdirSync(folder);
	};

};
