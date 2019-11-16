'use strict';

const CRC32Generator = require('./crc32generator.js');

var CRC32 = function(algorithm) {
	if (! algorithm) {
		algorithm = CRC32.algorithms[0];
	}
	if (CRC32.algorithms.indexOf(algorithm) < 0) {
		throw new Error('Unsupported algorithm');
	}
	this.algorithm = algorithm;
	this.defaultEncoding = 'hex-with-prefix';
	this.finalized = false;
	this.length = 0;
	this.crc = new CRC32Generator(-306674912);
}

CRC32.algorithms = [ 'crc32' ];

CRC32.prototype.update = function(b) {
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	this.crc.update(b);
	this.length = this.crc.length;
	return this;
}

CRC32.prototype.digest = function(encoding) {
	var r;
	r = this.crc.digest(encoding);
	if (! this.finalized) {
		this.state = this.crc.state;
		this.finalized = true;
	}
	if (encoding === 'default') {
		encoding = this.defaultEncoding;
	}
	return r;
}

CRC32.prototype.final = function(encoding) {
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	return this.digest(encoding);
}

module.exports = CRC32;
