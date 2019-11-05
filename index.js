'use strict';

const BsdSum = require('./bsdsum.js');
const SysvSum = require('./sysvsum.js');
const CkSum = require('./cksum.js');
const CRC32 = require('./crc32.js');
const CRC32C = require('./crc32c.js');

module.exports = {
	BsdSum: BsdSum,
	bsdSum: function(b) { return new BsdSum().update(b).final(); },
	SysvSum: require('./sysvsum.js'),
	sysvSum: function(b) { return new SysvSum().update(b).final(); },
	CkSum: require('./cksum.js'),
	ckSum: function(b) { return new CkSum().update(b).final(); },
	CRC32: require('./crc32.js'),
	crc32: function(b) { return new CRC32().update(b).final(); },
	CRC32C: require('./crc32c.js'),
	crc32c: function(b) { return new CRC32C().update(b).final(); }
};
