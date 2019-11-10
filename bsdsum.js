'use strict';

const bufferify = require('./bufferify.js');
const finalize = require('./finalize.js');

var BsdSum = function() {
	this.length = 0;
	this.block = null;
	this.state = 0;
	this.dead = false;
}

BsdSum.prototype.update = function(b) {
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
		this.state = ((this.state >> 1) + ((this.state & 1) << 15) + b[i]) & 0xffff;
	}
	this.length += b.length;
	return this;
};

BsdSum.prototype.final = function(encoding) {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	this.dead = true;
	this.block = Math.ceil(this.length / 1024);
	return finalize(this.state, 16, encoding);
}

module.exports = BsdSum;
