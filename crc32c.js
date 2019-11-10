'use strict';

const CRC32Generator = require('./crc32generator.js');

var CRC32C = function() {
	this.finalized = false;
	this.length = 0;
	this.crc = new CRC32Generator(-2097792136);
};

CRC32C.prototype.update = function(b) {
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	this.crc.update(b);
	this.length = this.crc.length;
	return this;
};

CRC32C.prototype.digest = function(encoding) {
	var r;
	r = this.crc.digest(encoding);
	if (! this.finalized) {
		this.state = this.crc.state;
		this.finalized = true;
	}
	return r;
};

CRC32C.prototype.final = function(encoding) {
	if (this.finalized) {
		throw new Error('Checksum context already finalized');
	}
	return this.digest(encoding);
};

module.exports = CRC32C;
