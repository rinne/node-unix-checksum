'use strict';

const BsdSum = require('./bsdsum.js');
const SysvSum = require('./sysvsum.js');
const CkSum = require('./cksum.js');

module.exports = {
	BsdSum: BsdSum,
	bsdSum: function(b) { return new BsdSum().update(b).final(); },
	SysvSum: require('./sysvsum.js'),
	sysvSum: function(b) { return new SysvSum().update(b).final(); },
	CkSum: require('./cksum.js'),
	ckSum: function(b) { return new CkSum().update(b).final(); }
};
