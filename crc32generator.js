'use strict';

const bufferify = require('./bufferify.js');

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

var CRC32 = function(poly) {
	this.poly = poly | 0;
	this.crcTbl = crcInit(this.poly);
	this.length = 0;
	this.state = 0;
	this.dead = false;
}

CRC32.prototype.update = function(b) {
	var err;
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	try {
		b = bufferify(b);
	} catch(e) {
		b = undefined;
		err = e;
	}
	if (err) {
		this.dead = true;
		throw err;
	}
	for (let i = 0; i < b.length; i++) {
		this.state = this.crcTbl[(this.state & 255) ^ b[i]] ^ (this.state >>> 8);
	}
	this.length += b.length;
	return this;
};

CRC32.prototype.final = function() {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	if (this.state < 0) {
		this.state += 4294967296;
	}
	this.dead = true;
	return this.state;
}

module.exports = CRC32;
