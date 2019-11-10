'use strict';

const CRC32Generator = require('./crc32generator.js');

var CRC32 = function() {
	this.length = 0;
	this.crc = new CRC32Generator(-306674912);
}

CRC32.prototype.update = function(b) {
	this.crc.update(b);
	this.length = this.crc.length;
	return this;
}

CRC32.prototype.final = function(encoding) {
	var r = this.crc.final(encoding);
	this.state = this.crc.state;
	return r;
}

module.exports = CRC32;
