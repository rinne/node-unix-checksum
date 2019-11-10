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
		console.log('crc32:  ' + c4.digest() + ' ' + c4.digest('hex'));
		console.log('crc32c: ' + c5.digest() + ' ' + c5.digest('hex'));
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
console.log(uc.crc32c('Fagerholm, Fagerholm, Fagerholm', 'hex'));
```

Encoding can be provided as an optional parameter to final() method of
the class interface or optional second parameter to the one shot
interface. The default is 'number'. Constant length (per checksum
algorithm) Buffer object is returned, if encoding 'buffer' is
used. Values 'hex' and 'base64' return the checksum value encoded as
hexadecimal or BASE64 encoded string respectively. While also other
encodings supported by Buffer.toString() can be passed as encofing,
the results are arbitrary and really should not be used.

The current amount of bytes processed by the algorighm can be read
from the context property `length`. After final() method is called,
the `length` property is the total number of bytes processed while
calculating the checksum.

For BsdSum and SysvSum, after final() method is called, the block
count can be read from the context property `block`. This is needed to
duplicate the full information returned by the historical command line
tools.

Calling final() method multiple times, or after digest(), triggers an
error. An error is also triggered, if update() method is called after
final() or digest() has already been called.

Instead of final(), the result can also be retrieved using digest()
method. The first call to digest() method is identical to final() but
unlike final() it can be called multiple times in order to retrieve
the same checksum with multiple encodings.

Command line interface is provided only for demonstration purposes.

```
$ sum GPL-2.0.TXT
42571    18

$ sum --sysv GPL-2.0.TXT
34111 36 GPL-2.0.TXT

$ cksum GPL-2.0.TXT
2811767965 18092 GPL-2.0.TXT

$ node dumpchecksum.js GPL-2.0.TXT
file:         GPL-2.0.TXT
input length: 18092
bsd:          42571 (blocks: 18)
sysv:         34111 (blocks: 36)
cksum:        2811767965
crc32:        1313272993 (4e46f4a1)
crc32c:       1750386445 (6854c70d)
```


Disclaimer
==========

As a developer you should be aware of the fact that the algorithms in
this package MUST NOT in any circumstances to be considered
cryptographically strong. In fact they are extremely weak. The
intended use for this library is to help backwards compatible
implementations of some outdated standards, such as RFC 3230.
Maintaining historical legacy is also among the motivations behind
making this library public.


Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

GPL-2.0
