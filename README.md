In a Nutshell
=============

Small library implememting Unix sum(1) and cksum(1) algorithms. Both,
BSD and SysV variants of sum(1) are supported. Also CRC32 and CRC32C
algorithms are supported.


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
	var c4 = new uc.CRC32();
	var c5 = new uc.CRC32C();
	var len = 0;
	process.stdin.on('data', function(d) {
		c1.update(d);
		c2.update(d);
		c3.update(d);
		c4.update(d);
		c5.update(d);
		len += d.length;
	}).on('end', function() {
		console.log('len:    ' + len);
		console.log('bsd:    ' + c1.final());
		console.log('sysv:   ' + c2.final());
		console.log('cksum:  ' + c3.final());
		console.log('crc32:  ' + c4.final());
		console.log('crc32c: ' + c5.final());
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
console.log(uc.crc32('Paasikivi, Paasikivi, Paasikivi'));
console.log(uc.crc32c'Fagerholm, Fagerholm, Fagerholm'));
```

Command line interface is provided only for demonstration purposes.

```
$ sum GPL-2.0.TXT
42571    18
$ sum --sysv GPL-2.0.TXT
34111 36 GPL-2.0.TXT
$ cksum GPL-2.0.TXT
2811767965 18092 GPL-2.0.TXT
$ node dumpchecksum.js GPL-2.0.TXT
file:  GPL-2.0.TXT
len:   18092
bsd:   42571
sysv:  34111
cksum: 2811767965
```


Disclaimer
==========

As a developer you should be aware of the fact that the algorithms in
this package MUST NOT in any circumstances to be considered
cryptographically strong. In fact they are extremely weak. They are
implemted for partly historical reasons and partly for helping
backwards compatible implementations of some outdated standards, such
as RFC 3230.


Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

GPL-2.0
