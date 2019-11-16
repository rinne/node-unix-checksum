'use strict';

const bufferify = require('./bufferify.js');
const finalize = require('./finalize.js');

var BsdSum = function(algorithm) {
	if (! algorithm) {
		algorithm = BsdSum.algorithms[0];
	}
	if (BsdSum.algorithms.indexOf(algorithm) < 0) {
		throw new Error('Unsupported algorithm');
	}
	this.algorithm = algorithm;
	this.defaultEncoding = 'number';
	this.length = 0;
	this.block = null;
	this.state = 0;
	this.finalized = false;
};

BsdSum.algorithms = [ 'bsdsum', 'sum-bsd' ];

BsdSum.prototype.update = function(b) {
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
		this.state = ((this.state >> 1) + ((this.state & 1) << 15) + b[i]) & 0xffff;
	}
	this.length += b.length;
	return this;
};

BsdSum.prototype.digest = function(encoding) {
	if (! this.finalized) {
		this.block = Math.ceil(this.length / 1024);
		this.finalized = true;
		Object.freeze(this);
	}
	if (encoding === 'default') {
		encoding = this.defaultEncoding;
	}
	return finalize(this.state, 16, encoding);
};

BsdSum.prototype.final = function(encoding) {
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	return this.digest(encoding);
}

module.exports = BsdSum;
