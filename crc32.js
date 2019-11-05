'use strict';

const CRC32Generator = require('./crc32generator.js');

var CRC32 = function() {
	this.crc = new CRC32Generator(-306674912);
}

CRC32.prototype.update = function(b) {
	this.crc.update(b);
	return this;
}

CRC32.prototype.final = function(b) {
	return this.crc.final();
}

module.exports = CRC32;
