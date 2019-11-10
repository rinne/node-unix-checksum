'use strict';

const bufferify = require('./bufferify.js');
const finalize = require('./finalize.js');

var SysvSum = function() {
	this.length = 0;
	this.block = null;
	this.state = 0;
	this.dead = false;
}

SysvSum.prototype.update = function(b) {
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
		this.state = (this.state + b[i]) | 0;
	}
	this.length += b.length;
	return this;
};

SysvSum.prototype.final = function(encoding) {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	this.state = (this.state & 0xffff) + ((this.state & 0xffffffff) >>> 16);
	this.state = (this.state & 0xffff) + (this.state >>> 16);
	this.dead = true;
	this.block = Math.ceil(this.length / 512);
	return finalize(this.state, 16, encoding);
}

module.exports = SysvSum;
