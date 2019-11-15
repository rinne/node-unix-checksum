'use strict';

const bufferify = require('./bufferify.js');
const finalize = require('./finalize.js');

var crcTblCache = new Map();

function crcInit(poly) {
	if (! crcTblCache.has(poly)) {
		let r = [];
		for (let i = 0; i < 256; i++) {
			let c = i;
			for (let j = 0; j < 8; j++) {
				// 
				c = (c & 1 ? 0 : poly) ^ (c >>> 1)
			}
			r.push(c ^ -16777216);
		}
		crcTblCache.set(poly, r);
	}
	return crcTblCache.get(poly);
}

var CRC32gen = function(poly) {
	this.poly = poly | 0;
	this.crcTbl = crcInit(this.poly);
	this.length = 0;
	this.state = 0;
	this.finalized = false;
};

CRC32gen.prototype.update = function(b) {
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
		this.state = this.crcTbl[(this.state & 255) ^ b[i]] ^ (this.state >>> 8);
	}
	this.length += b.length;
	return this;
};

CRC32gen.prototype.digest = function(encoding) {
	if (! this.finalized) {
		this.finalized = true;
		if (this.state < 0) {
			this.state += 4294967296;
		}
	}
	return finalize(this.state, 32, encoding);
};

CRC32gen.prototype.final = function(encoding) {
	if (this.finalized) {
		throw new Error('Checksum context in finalized state');
	}
	return this.digest(encoding);
};

module.exports = CRC32gen;
