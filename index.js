'use strict';

const BsdSum = require('./bsdsum.js');
const SysvSum =	require('./sysvsum.js');
const CkSum = require('./cksum.js');
const CRC32 = require('./crc32.js');
const CRC32C = require('./crc32c.js');
const CryptoHash = require('./cryptohash.js');
const compat = require('./compat.js');

const m = (function() {
	var r = {};
	[
		BsdSum,
		SysvSum,
		CkSum,
		CRC32,
		CRC32C,
		CryptoHash
	].forEach(function(o) {
		o.algorithms.forEach(function(n) {
			if (! r[n]) {
				r[n] = o;
			}
		});
	});
	return r;
})();

function createHash(n) {
	if (! m[n]) {
		throw new Error('Unsupported algorithm');
	}
	return new m[n](n);
}

function getHashes() {
	return Object.keys(m);
}

function hash(a, d, e) {
	return createHash(a).update(d).digest(e);
}

function getDigestEncodings() {
	var r = [
		'hex',
		'HEX',
		'base64',
		'buffer',
		'integer',
		'number',
		'uuid',
		'UUID',
		'bubblebabble',
		'BUBBLEBABBLE'
	];
	if (typeof(BigInt) === 'function') {
		r.push('bigint');
	}
	return r;
}

module.exports = {
	// Generic interfaces
	createHash: createHash,
	getHashes: getHashes,
	getDigestEncodings: getDigestEncodings,
	hash: hash,
	// Legacy interfaces are exposed like before.
	// First class interfaces to individual algorithms ...
	BsdSum: compat.BsdSum,
	SysvSum: compat.SysvSum,
	CkSum: compat.CkSum,
	CRC32: compat.CRC32,
	CRC32C: compat.CRC32C,
	// ... and then one shot interfaces too.
	bsdSum: compat.bsdSum,
	sysvSum: compat.sysvSum,
	ckSum: compat.ckSum,
	crc32: compat.crc32,
	crc32c: compat.crc32c
};
