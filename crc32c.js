'use strict';

const CRC32Generator = require('./crc32generator.js');

var CRC32C = function() {
	this.crc = new CRC32Generator(-2097792136);
}

CRC32C.prototype.update = function(b) {
	this.crc.update(b);
	return this;
}

CRC32C.prototype.final = function(b) {
	return this.crc.final();
}

module.exports = CRC32C;
