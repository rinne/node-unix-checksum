'use strict';

const uc = require('./index.js');

(function() {
	var c1 = new uc.BsdSum();
	var c2 = new uc.SysvSum();
	var c3 = new uc.CkSum();
	var len = 0;
	process.stdin.on('data', function(d) {
		c1.update(d);
		c2.update(d);
		c3.update(d);
		len += d.length;
	}).on('end', function() {
		console.log('len:   ' + len);
		console.log('bsd:   ' + c1.final());
		console.log('sysv:  ' + c2.final());
		console.log('cksum: ' + c3.final());
		process.exit(0);
	});
})();
