'use strict';

const CRC32Generator = require('./crc32generator.js');

var CRC32C = function() {
	this.dead = false;
	this.length = 0;
	this.crc = new CRC32Generator(-2097792136);
}

CRC32C.prototype.update = function(b) {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	this.crc.update(b);
	this.length = this.crc.length;
	return this;
}

CRC32C.prototype.final = function(encoding) {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	var r = this.crc.final(encoding);
	this.state = this.crc.state;
	delete this.crc;
	this.dead = true;
	return r;
}

module.exports = CRC32C;
