'use strict';

const bufferify = require('./bufferify.js');

var BsdSum = function() {
	this.length = 0;
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

BsdSum.prototype.final = function() {
	if (this.dead) {
		throw new Error('Checksum context in error state');
	}
	this.dead = true;
	return this.state;
}

function bsdSum(b) {
	b = bufferify(b);
	var r = 0;
	for (let i = 0; i < b.length; i++) {
		r = ((r >> 1) + ((r & 1) << 15) + b[i]) & 0xffff;
	}
	return r;
};

module.exports = BsdSum;
