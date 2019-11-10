'use strict';

const bufferify = require('./bufferify.js');
const finalize = require('./finalize.js');

var ckSumTbl = undefined;

function ckSumInit() {
	if (ckSumTbl) {
		return;
	}
	var r = [ 79764919 ];
	for (let i = 1; i < 8; i++) {
		r.push((r[i - 1] << 1) ^ ((r[i - 1] >>> 31) ? r[0] : 0));
	}
	var c = [];
	for (let i = 0; i < 256; i++) {
		let cc = 0;
		for (let j = 0; j < 8; j++) {
			if ((1 << j) & i) {
				cc ^= r[j];
			}
		}
		c.push(cc);
	}
	ckSumTbl = c;
}

var CkSum = function() {
	ckSumInit();
	this.length = 0;
	this.state = 0;
	this.finalized = false;
};

CkSum.prototype.update = function(b) {
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
		this.state = (this.state << 8) ^ ckSumTbl[((this.state >>> 24) ^ b[i]) & 255];
	}
	this.length += b.length;
	return this;
};

CkSum.prototype.digest = function(encoding) {
	if (! this.finalized) {
		for (let i = this.length; i > 0; i >>= 8) {
			this.state = (this.state << 8) ^ ckSumTbl[((this.state >>> 24) ^ i) & 255];
		}
		this.state = ~this.state;
		if (this.state < 0) {
			this.state += 4294967296;
		}
		this.finalized = true;
	}
	return finalize(this.state, 32, encoding);
};

CkSum.prototype.final = function(encoding) {
	if (this.finalized) {
		throw new Error('Checksum context already finalized');
	}
	return this.digest(encoding);
};

module.exports = CkSum;
