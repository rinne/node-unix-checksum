In a Nutshell
=============

Small library implememting Unix sum(1) and cksum(1) algorithms. Both,
BSD and SysV variants of sum(1) are supported. Also CRC32 and CRC32C
algorithms are supported.

This library also offers the same interrface to all hash algorithms
provided by crypto module (e.g. MD5, SHA-1, SHA-256, SHA-512 and
others), which can therefore be used with legacy checksums using the
same API.


Reference
=========

UnixChecksum.createHash(algorithm)
----------------------------------

Creates a hash context of the given hash algorithm. This call is
compatible with createHash() interface of the crypto module.


UnixChecksum.getHashes()
------------------------

Returns an array of supported hash algorithm names. This call is
compatible with getHashes() interface of the crypto module.


UnixChecksum.getDigestEncodings()
---------------------------------

Returns an array of supported digest encodings.

The following formats are available:

| name | format |
| -- | -- |
| default | Algorithm specific default encoding (usually hex or number) |
| hex | hexadecimal string |
| HEX | upper case hexadecimal string |
| hex-with-prefix | hexadecimal string with 0x prefix |
| HEX-WITH-PREFIX | upper case hexadecimal string with 0X prefix |
| binary | binary string |
| binary-with-prefix | binary string with 0b prefix |
| BINARY-WITH-PREFIX | binary string with 0B prefix |
| base64 | BASE64 string |
| buffer | raw buffer |
| integer | integer (only if digest length <= 53 bits) |
| number | number (lossy for digest lengths > 53 bits) |
| uuid | version 4 variant 1 or 2 UUID in lower case |
| UUID | version 4 variant 1 or 2 UUID in upper case |
| bigint | BigInt presentation of the digest (if supported by runtime) |
| bubblebabble | Easily pronouncable encoding |
| BUBBLEBABBLE | Easily pronouncable encoding in upper case |
Some encodings can be used only in some hashes. It is e.g. impossible
to generate a UUID from a digest that is shorter than 128 bits and
attempting to do so triggers an error.


UnixChecksum.hash(algorithm, data, encoding)
--------------------------------------------

An one shot hashing interface returns a hash calculated over data in
given encoding. If the encoding is omitted, the digest is returned in
a buffer.


UnixChecksum.prototype.update(s)
--------------------------------

Update hash state by feeding it a string or buffer. After digest() or
final() has been called to the object, this method can no longer be
called.


UnixChecksum.prototype.digest(encoding)
---------------------------------------

Retrieve the digest in given encoding (see
UnixChecksum.getDigestEncodings()). Encoding defaults to buffer. This
interface can be called multiple times for a single hash object in
order to retrieve multiple digest encodings.


UnixChecksum.prototype.digest()
-------------------------------

Retrieve the digest in given encoding (see
UnixChecksum.getDigestEncodings()). Encoding defaults to buffer. This
interface can be called only once and can not be called after digest()
has been called. Calling digest() after final() is on allowed.


Legacy Interface
================

The library provides direct method for accessing legacy checksum
methods directly. The user should probably consider using the generic
API instead.

The most powerful way is to use the legacy API is the class interface:

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
		console.log('bsd:    ' + c1.digest());
		console.log('sysv:   ' + c2.digest());
		console.log('cksum:  ' + c3.digest());
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

Encoding can be provided as an optional parameter to digest() method of
the class interface or optional second parameter to the one shot
interface. The default is 'number'. Constant length (per checksum
algorithm) Buffer object is returned, if encoding 'buffer' is
used. Values 'hex' and 'base64' return the checksum value encoded as
hexadecimal or BASE64 encoded string respectively. While also other
encodings supported by Buffer.toString() can be passed as encoding,
the results are arbitrary and really should not be used.

The current amount of bytes processed by the algorighm can be read
from the context property `length`. After digest() method is called,
the `length` property is the total number of bytes processed while
calculating the checksum.

For BsdSum and SysvSum, after digest() method is called, the block
count can be read from the context property `block`. This is needed to
duplicate the full information returned by the historical command line
tools.

An error is also triggered, if update() method is called after
digest() has already been called.

Multiple calls to digest() method are allowed in order to retrieve the
same checksum with multiple encodings.

Instead of digest() method, it is possible to use final() method. The
only difference to using final() instead of digest() is that final()
call can be called only once. Calling final() after it or digest() has
been called already, triggers error.


Command line interface is provided only for demonstration purposes
and is not targeted for practical use.

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

See command line program `digest` in package unix-checksum-stream for
a command line tool that can be used in practical use cases.


Disclaimer
==========

As a developer you should be aware of the fact that the algorithms in
this package MUST NOT in any circumstances to be considered
cryptographically strong. In fact they are extremely weak. The
intended use for this library is to help backwards compatible
implementations of some outdated standards, such as RFC 3230.
Maintaining historical legacy is also among the motivations behind
making this library public.

However, algorithms provided by crypto module that are proxied through
this library, are as strong as they are when used directly using the
crypto module. Choose your algorithm wisely :).


Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

GPL-2.0
