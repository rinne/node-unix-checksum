'use strict';

const assert = require('assert');

const tv = require('./testvectors.js');
const uc = require('../index.js');
const finalize = require('../finalize.js');

(function() {
	var n = 0;

	uc.getHashes().forEach(function(a) {
		var l = uc.hash(a, '', 'buffer').length * 8;
		uc.getDigestEncodings().forEach(function(e) {
			if ((l >= 128) || (! e.match(/uuid/i))) {
				uc.hash(a, 'quick brown fox jumps over the lazy dog', e);
				n++;
			}
		});
	});
											
	tv.forEach(function(v) {
		{
			let c = uc.bsdSum(v.input);
			[ 'number', 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 16, f);
				if (typeof(v.bsdsum) === 'number') {
					assert.equal(finalize(v.bsdsum, 16, f), s, 'bsdSum encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.sysvSum(v.input);
			[ 'number', 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 16, f);
				if (typeof(v.sysvsum) === 'number') {
					assert.equal(finalize(v.sysvsum, 16, f), s, 'sysvSum encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.ckSum(v.input);
			[ 'number', 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 32, f);
				if (typeof(v.cksum) === 'number') {
					assert.equal(finalize(v.cksum, 32, f), s, 'ckSum encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.crc32(v.input);
			[ 'number', 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 32, f);
				if (typeof(v.crc32) === 'number') {
					assert.equal(finalize(v.crc32, 32, f), s, 'crc32 encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.crc32c(v.input);
			[ 'number', 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 32, f);
				if (typeof(v.crc32c) === 'number') {
					assert.equal(finalize(v.crc32c, 32, f), s, 'crc32c encoding failure');
					n++;
				}
			});
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
		[ 'number', 'hex', 'base64' ].forEach(function(f) {
			if (typeof(v.bsdsum) === 'number') {
				assert.equal(finalize(v.bsdsum, 16, f), c1.digest(f), 'bsdSum chunked failure');
				n++;
			}
			if (typeof(v.sysvsum) === 'number') {
				assert.equal(finalize(v.sysvsum, 16, f), c2.digest(f), 'sysvSum chunked failure');
				n++;
			}
			if (typeof(v.cksum) === 'number') {
				assert.equal(finalize(v.cksum, 32, f), c3.digest(f), 'ckSum chunked failure');
				n++;
			}
			if (typeof(v.crc32) === 'number') {
				assert.equal(finalize(v.crc32, 32, f), c4.digest(f), 'CRC32 chunked failure');
				n++;
			}
			if (typeof(v.crc32c) === 'number') {
				assert.equal(finalize(v.crc32c, 32, f), c5.digest(f), 'CRC32C chunked failure');
				n++;
			}
		});
	});
	console.log(n.toString() + ' tests successfully done.');
})();
