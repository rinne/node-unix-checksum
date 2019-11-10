'use strict';

function finalize(v, bits, encoding) {
	if (! (Number.isSafeInteger(bits) && (bits > 0) && (bits <= 48))) {
		throw new Error('Bad bit length');
	}
	if (! (Number.isSafeInteger(v) && (v >= 0) && (v < Math.pow(2, bits)))) {
		throw new Error('Bad value');
	}
	if ((! encoding) || (encoding === 'number') || (encoding === 'integer')) {
		return v;
	}
	var b;
	switch (Math.ceil(bits / 8)) {
	case 1:
		b = Buffer.alloc(1);
		b.writeUInt8(v);
		break;
	case 2:
		b = Buffer.alloc(2);
		b.writeUInt16BE(v);
		break;
	case 3:
		b = Buffer.alloc(4);
		b.writeUInt32BE(v);
		b = b.slice(1);
		break;
	case 4:
		b = Buffer.alloc(4);
		b.writeUInt32BE(v);
		break;
	case 5:
		{
			let l = v % 4294967296;
			let h = (v - l) / 4294967296;
			b = Buffer.alloc(5);
			b.writeUInt8(h);
			b.writeUInt32BE(l, 1);
		}
		break;
	case 6:
		{
			let l = v % 4294967296;
			let h = (v - l) / 4294967296;
			console.log(h);
			console.log(l);
			b = Buffer.alloc(6);
			b.writeUInt16BE(h);
			b.writeUInt32BE(l, 2);
		}
		break;
	}
	if (encoding === 'buffer') {
		return b;
	}
	return b.toString(encoding);
}

module.exports = finalize;
