'use strict';

const crypto = require('crypto');

var CryptoHash = function(algorithm) {
	if (! algorithm) {
		throw new Error('Explicit algorithm required for CryptoHash');
	}
	if (CryptoHash.algorithms.indexOf(algorithm) < 0) {
		throw new Error('Unsupported algorithm');
	}
	this.algorithm = algorithm;
	this.length = 0;
	this.result = null;
	this.state = 0;
	this.finalized = false;
	this.hash = crypto.createHash(algorithm);
};

CryptoHash.algorithms = crypto.getHashes();

CryptoHash.prototype.update = function(b) {
	if (this.finalized) {
		throw new Error('Hash context in finalized state');
	}
	this.hash.update(b);
	this.length += b.length;
	return this;
};

CryptoHash.prototype.digest = function(encoding) {
	if (! this.finalized) {
		this.finalized = true;
		this.result = this.hash.digest();
	}
	this.state = 0;
	for (let i = 0; i < this.result.length; i++) {
		// This will be a BIG number and with potential hash
		// algorithms this can actually be Inifinity. In any case, the
		// precision of number type loses information if the hash is
		// more than 53 bits long, so NEVER compare hash values as
		// numbers. This is mainly usable for checksum algorithms such
		// as CRC32 or BsdSum.
		this.state = (this.state * 256) + this.result[i];
	}
	if (! encoding) {
		encoding = 'buffer';
	}
	switch (encoding) {
	case 'buffer':
		return Buffer.from(this.result);
	case 'number':
	case 'integer':
		return this.state;
	case 'bigint':
		if (typeof(BigInt) === 'function') {
			// Using variable n256 for 256 spares us tens of
			// conversions in calculation, while we don't want to use
			// BigInt literal notation #####n to avoid syntax errors
			// in older runtimes that don't support BigInt.
			var r = BigInt(0), n256 = BigInt(256);
			for (let i = 0; i < this.result.length; i++) {
				r = (r * n256) + BigInt(this.result[i]);
			}
			return r;
		}
		throw new Error('BigInt is not supported by this Javascript runtime');
	case 'uuid':
	case 'UUID':
		if (this.result.length < 16) {
			throw new Error('Digest of 128 bits or more is required for UUID');
		} else {
			let r = this.result.slice(0, 16);
			// In order to encode as much into UUID while preserving
			// valid version 4 UUID formatting, we use the bits that
			// are going to be masked under the version and variant
			// bits as a selector between variants 1 and 2. Because
			// variant 2 actually has shorted payload (121 bits
			// instead of 122 in variant 1) the selection is done so
			// that variant 1 is roughly double as probable output
			// than variant 2. Because exact division to 3 is really
			// tricky to derive from fixed bit length numbers and we
			// really don't want to require more than 128 bits of
			// input, we use 6 input bits (i.e. number 0..63) as
			// follows.  If the number is 0..41, variant is set to
			// 1. If number is 42..63, variant is set to 2.
			let variant = (((r[6] >>> 4) | ((r[8] >>> 6) << 4)) >= 42) ? 2 : 1;
			r[6] = (r[6] & 0b00001111) | 0b01000000;
			if (variant === 1) {
				r[8] = (r[8] & 0b00111111) | 0b10000000;
			} else {
				r[8] = (r[8] & 0b00011111) | 0b11000000;
			}
			r = r.toString('hex');
			if (encoding === 'UUID') {
				r = r.toUpperCase();
			}
			r = (r.slice(0, 8) + '-' +
				 r.slice(8, 12) + '-' +
				 r.slice(12, 16) + '-' +
				 r.slice(16, 20) + '-' +
				 r.slice(20, 32));
			return r;
		}
	default:
		return this.result.toString(encoding);
	};
	/*NOTREACHED*/
};

module.exports = CryptoHash;
