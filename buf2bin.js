"use strict";

function buf2bin(b) {
	if (typeof(b) === 'string') {
		b = Buffer.from(b, 'utf8');
	} else if (! Buffer.isBuffer(b)) {
		throw new Error('Bad input');
	}
	return Array.from(b).map((x)=>('0000000' + x.toString(2)).slice(-8)).join('');
}

module.exports = buf2bin;
