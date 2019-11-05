'use strict';

const assert = require('assert');

const tv = require('./testvectors.js');
const uc = require('../index.js');

(function() {
	tv.forEach(function(v) {
		if (v.bsdsum) {
			assert.equal(v.bsdsum, uc.bsdSum(v.input), 'bsdSum failure');
		}
		if (v.sysvsum) {
			assert.equal(v.sysvsum, uc.sysvSum(v.input), 'sysvSum failure');
		}
		if (v.cksum) {
			assert.equal(v.cksum, uc.ckSum(v.input), 'ckSum failure');
		}
		if (v.crc32) {
			assert.equal(v.crc32, uc.crc32(v.input), 'CRC32 failure');
		}
		if (v.crc32c) {
			assert.equal(v.crc32c, uc.crc32c(v.input), 'CRC32C failure');
		}
	});
	tv.forEach(function(v) {
		var c1 = new uc.BsdSum();
		var c2 = new uc.SysvSum();
		var c3 = new uc.CkSum();
		var c4 = new uc.CRC32();
		var c5 = new uc.CRC32C();
		for (let i = 0; i < v.input.length; /*NOTHING*/) {
			let l = Math.ceil((v.input.length - i) / 2);
			let s = v.input.slice(i, i + l);
			c1.update(s);
			c2.update(s);
			c3.update(s);
			c4.update(s);
			c5.update(s);
			i += l;
		}
		if (v.bsdsum) {
			assert.equal(v.bsdsum, c1.final(), 'bsdSum chunked failure');
		}
		if (v.sysvsum) {
			assert.equal(v.sysvsum, c2.final(), 'sysvSum chunked failure');
		}
		if (v.cksum) {
			assert.equal(v.cksum, c3.final(), 'ckSum chunked failure');
		}
		if (v.crc32) {
			assert.equal(v.crc32, c4.final(), 'CRC32 chunked failure');
		}
		if (v.crc32c) {
			assert.equal(v.crc32c, c5.final(), 'CRC32C chunked failure');
		}
	});
})();
