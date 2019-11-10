'use strict';

const assert = require('assert');

const tv = require('./testvectors.js');
const uc = require('../index.js');
const finalize = require('../finalize.js');

(function() {
	var n = 0;
	tv.forEach(function(v) {
		{
			let c = uc.bsdSum(v.input);
			if (typeof(v.bsdsum) === 'number') {
				assert.equal(v.bsdsum, c, 'bsdSum failure');
				n++;
			}
			[ 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 16, f);
				if (typeof(v.bsdsum) === 'number') {
					assert.equal(finalize(v.bsdsum, 16, f), s, 'bsdSum encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.sysvSum(v.input);
			if (typeof(v.sysvsum) === 'number') {
				assert.equal(v.sysvsum, c, 'sysvSum failure');
				n++;
			}
			[ 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 16, f);
				if (typeof(v.sysvsum) === 'number') {
					assert.equal(finalize(v.sysvsum, 16, f), s, 'sysvSum encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.ckSum(v.input);
			if (typeof(v.cksum) === 'number') {
				assert.equal(v.cksum, c, 'ckSum failure');
				n++;
			}
			[ 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 32, f);
				if (typeof(v.cksum) === 'number') {
					assert.equal(finalize(v.cksum, 32, f), s, 'ckSum encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.crc32(v.input);
			if (typeof(v.crc32) === 'number') {
				assert.equal(v.crc32, c, 'crc32 failure');
				n++;
			}
			[ 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 32, f);
				if (typeof(v.crc32) === 'number') {
					assert.equal(finalize(v.crc32, 32, f), s, 'crc32 encoding failure');
					n++;
				}
			});
		}
		{
			let c = uc.crc32c(v.input);
			if (typeof(v.crc32c) === 'number') {
				assert.equal(v.crc32c, c, 'crc32c failure');
				n++;
			}
			[ 'hex', 'base64' ].forEach(function(f) {
				var s = finalize(c, 32, f);
				if (typeof(v.crc32c) === 'number') {
					assert.equal(finalize(v.crc32c, 32, f), s, 'crc32c encoding failure');
					n++;
				}
			});
		}
	});
	tv.forEach(function(v) {
		[ undefined, 'number', 'hex', 'base64' ].forEach(function(f) {
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
			if (typeof(v.bsdsum) === 'number') {
				assert.equal(finalize(v.bsdsum, 16, f), c1.final(f), 'bsdSum chunked failure');
				n++;
			}
			if (typeof(v.sysvsum) === 'number') {
				assert.equal(finalize(v.sysvsum, 16, f), c2.final(f), 'sysvSum chunked failure');
				n++;
			}
			if (typeof(v.cksum) === 'number') {
				assert.equal(finalize(v.cksum, 32, f), c3.final(f), 'ckSum chunked failure');
				n++;
			}
			if (typeof(v.crc32) === 'number') {
				assert.equal(finalize(v.crc32, 32, f), c4.final(f), 'CRC32 chunked failure');
				n++;
			}
			if (typeof(v.crc32c) === 'number') {
				assert.equal(finalize(v.crc32c, 32, f), c5.final(f), 'CRC32C chunked failure');
				n++;
			}
		});
	});
	console.log(n.toString() + ' tests successfully done.');
})();
