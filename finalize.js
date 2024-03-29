'use strict';

const bubblebabbler = require('bubblebabbler');
const buf2bin = require('./buf2bin.js');

function finalize(v, bits, encoding) {
	if (! encoding) {
		encoding = 'buffer';
	}
	if (! (Number.isSafeInteger(bits) && (bits > 0) && (bits <= 48))) {
		throw new Error('Bad bit length');
	}
	if (! (Number.isSafeInteger(v) && (v >= 0) && (v < Math.pow(2, bits)))) {
		throw new Error('Bad value');
	}
	switch (encoding) {
	case 'number':
		return v;
	case 'integer':
		if (! Number.isSafeInteger(v)) {
			throw new Error('Value is not an integer');
		}
		return v;
	case 'bigint':
		if (! (typeof(BigInt) === 'function')) {
			throw new Error('BigInt is not supported by this Javascript runtime');
		}
		return BigInt(v);
	case 'uuid':
	case 'UUID':
		throw new Error('Digest of 128 bits or more is required for UUID');
	}
	var b;
	switch (Math.ceil(bits / 8)) {
	case 1:
		b = Buffer.alloc(1);
		b.writeUInt8(v);
		break;
	case 2:
		b = Buffer.alloc(2);
		b.writeUInt16BE(v);
		break;
	case 3:
		b = Buffer.alloc(4);
		b.writeUInt32BE(v);
		b = b.slice(1);
		break;
	case 4:
		b = Buffer.alloc(4);
		b.writeUInt32BE(v);
		break;
	case 5:
		{
			let l = v % 4294967296;
			let h = (v - l) / 4294967296;
			b = Buffer.alloc(5);
			b.writeUInt8(h);
			b.writeUInt32BE(l, 1);
		}
		break;
	case 6:
		{
			let l = v % 4294967296;
			let h = (v - l) / 4294967296;
			console.log(h);
			console.log(l);
			b = Buffer.alloc(6);
			b.writeUInt16BE(h);
			b.writeUInt32BE(l, 2);
		}
		break;
	}
	if (encoding === 'buffer') {
		return b;
	}
	switch (encoding) {
	case 'HEX':
		return b.toString('hex').toUpperCase();
	case 'bubblebabble':
		return bubblebabbler(b);
	case 'BUBBLEBABBLE':
		return bubblebabbler(b).toUpperCase();
	case 'hex-with-prefix':
		return '0x' + b.toString('hex');
	case 'HEX-WITH-PREFIX':
		return ('0x' + b.toString('hex')).toUpperCase();
	case 'binary':
		return buf2bin(b);
	case 'binary-with-prefix':
		return '0b' + buf2bin(b);
	case 'BINARY-WITH-PREFIX':
		return ('0b' + buf2bin(b)).toUpperCase();
	}
	return b.toString(encoding);
}

module.exports = finalize;
