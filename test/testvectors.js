'use strict';

module.exports = [
	{ input: 'f',
	  bsdsum: 102,
	  sysvsum: 102,
	  cksum: 2131560324,
	  crc32: 0x76d32be0,
	  crc32c: 0x151a27db },
	{ input: 'foo',
	  bsdsum: 192,
	  sysvsum: 324,
	  cksum: 2470157969,
	  crc32: 0x8c736521,
	  crc32c: 0xcfc4ae1d },
	{ input: 'foobar',
	  bsdsum: 211,
	  sysvsum: 633,
	  cksum: 2606601686,
	  crc32: 0x9ef61f95,
	  crc32c: 0x0d5f5c7f },
	{ input: 'abcdefghijklmnopqrstuvwxuz',
	  bsdsum: 53551,
	  sysvsum: 2843,
	  cksum: 2820596108,
	  crc32: 0xe0921fb1,
	  crc32c: 0x4d784d41 },
	{ input: 'abcdefghijklmnopqrstuvwxuzABCDEFGHIJKLMNOPQRSTUVWXUZ0123456789',
	  bsdsum: 12923,
	  sysvsum: 5379,
	  cksum: 1538184635,
	  crc32: 0xc41324ad,
	  crc32c: 0xbd0b2c9e },
	{ input: 'Fp9Uyuh6GY5Ho6ktr3d4uE5YZgztLm8aBsZ56y2W2P2AJwFEsdNMBQHtsFqzleXd',
	  bsdsum: 56754,
	  sysvsum: 5542,
	  cksum: 1755751968,
	  crc32: 0x84c163c4,
	  crc32c: 0xae030bb9 },
	{ input: Buffer.from(Array.from(Array(200000)).map((e, i) => (i % 256))),
	  // repeating sequence 0, 1, 2 ... 255, 0, 1 ... truncated to 200000 bytes.
	  bsdsum: 6784,
	  sysvsum: 741,
	  cksum: 1205004431,
	  crc32: 0x2032eaa1,
	  crc32c: 0x59f3b652 }
];
