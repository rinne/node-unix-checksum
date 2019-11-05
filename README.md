In a Nutshell
=============

Small library implememting Unix sum(1) and cksum(1) algorithms. Both,
BSD and SysV variants of sum(1) are supported.


Reference
=========

The most powerful way is to use the class interface:

```
'use strict';

const uc = require('unix-checksum');

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
```

There are also one-shot interfaces for all algorithms:

```
'use strict';

const uc = require('unix-checksum');

console.log(uc.bsdSum('foo'));
console.log(uc.sysvSum(Buffer.from( [ 1,2,3,4,5 ])));
console.log(uc.ckSum('Kekkonen, Kekkonen, Kekkonen'));
```

Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

GPL-2.0
