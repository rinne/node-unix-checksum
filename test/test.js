'use strict';

const assert = require('assert');

const tv = require('./testvectors.js');
const uc = require('../index.js');

(function() {
	tv.forEach(function(v) {
		assert.equal(v.bsdsum, uc.bsdSum(v.input), 'bsdSum failure');
		assert.equal(v.sysvsum, uc.sysvSum(v.input), 'sysvSum failure');
		assert.equal(v.cksum, uc.ckSum(v.input), 'ckSum failure');
	});
	tv.forEach(function(v) {
		var c1 = new uc.BsdSum();
		var c2 = new uc.SysvSum();
		var c3 = new uc.CkSum();
		for (let i = 0; i < v.input.length; /*NOTHING*/) {
			let l = Math.ceil((v.input.length - i) / 2);
			let s = v.input.slice(i, i + l);
			c1.update(s);
			c2.update(s);
			c3.update(s);
			i += l;
		}
		assert.equal(v.bsdsum, c1.final(), 'bsdSum chunked failure');
		assert.equal(v.sysvsum, c2.final(), 'sysvSum chunked failure');
		assert.equal(v.cksum, c3.final(), 'ckSum chunked failure');
	});
})();
