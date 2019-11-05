'use strict';

function bufferify(b) {
	if (typeof(b) === 'number') {
		b = b.toString();
	}
	if (typeof(b) === 'string') {
		return Buffer.from(b, 'utf8');
	}
	if (Buffer.isBuffer(b)) {
		return b;
	}
	throw new Error('Bad input');
};

module.exports = bufferify;
