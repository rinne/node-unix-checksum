'use strict';

const bufferify = require('./bufferify.js');
const finalize = require('./finalize.js');

var SysvSum = function(algorithm) {
	if (! algorithm) {
		algorithm = SysvSum.algorithms[0];
	}
	if (SysvSum.algorithms.indexOf(algorithm) < 0) {
		throw new Error('Unsupported algorithm');
	}
	this.algorithm = algorithm;
	this.defaultEncoding = 'number';
	this.length = 0;
	this.block = null;
	this.state = 0;
	this.finalized = false;
};

SysvSum.algorithms = [ 'sysvsum', 'sum-sysv' ];

SysvSum.prototype.update = function(b) {
	var err;
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	try {
		b = bufferify(b);
	} catch(e) {
		b = undefined;
		err = e;
	}
	if (err) {
		this.finalized = true;
		throw err;
	}
	for (let i = 0; i < b.length; i++) {
		this.state = (this.state + b[i]) | 0;
	}
	this.length += b.length;
	return this;
};

SysvSum.prototype.digest = function(encoding) {
	if (! this.finalized) {
		this.state = (this.state & 0xffff) + ((this.state | 0) >>> 16);
		this.state = (this.state & 0xffff) + (this.state >>> 16);
		this.block = Math.ceil(this.length / 512);
		this.finalized = true;
	}
	if (encoding === 'default') {
		encoding = this.defaultEncoding;
	}
	return finalize(this.state, 16, encoding);
};

SysvSum.prototype.final = function(encoding) {
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	return this.digest(encoding);
}

module.exports = SysvSum;
