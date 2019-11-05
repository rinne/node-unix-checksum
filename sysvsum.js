'use strict';

const bufferify = require('./bufferify.js');

var SysvSum = function() {
	this.length = 0;
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

SysvSum.prototype.final = function() {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	this.state = (this.state & 0xffff) + ((this.state & 0xffffffff) >>> 16);
	this.state = (this.state & 0xffff) + (this.state >>> 16);
	this.dead = true;
	return this.state;
}

module.exports = SysvSum;
