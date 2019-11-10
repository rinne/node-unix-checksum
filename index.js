'use strict';

const BsdSum = require('./bsdsum.js');
const SysvSum = require('./sysvsum.js');
const CkSum = require('./cksum.js');
const CRC32 = require('./crc32.js');
const CRC32C = require('./crc32c.js');

module.exports = {
	BsdSum: BsdSum,
	bsdSum: function(b, enc) { return new BsdSum().update(b).final(enc); },
	SysvSum: require('./sysvsum.js'),
	sysvSum: function(b, enc) { return new SysvSum().update(b).final(enc); },
	CkSum: require('./cksum.js'),
	ckSum: function(b, enc) { return new CkSum().update(b).final(enc); },
	CRC32: require('./crc32.js'),
	crc32: function(b, enc) { return new CRC32().update(b).final(enc); },
	CRC32C: require('./crc32c.js'),
	crc32c: function(b, enc) { return new CRC32C().update(b).final(enc); }
};
