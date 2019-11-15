"use strict";

const BsdSum = require('./bsdsum.js');
const SysvSum =	require('./sysvsum.js');
const CkSum = require('./cksum.js');
const CRC32 = require('./crc32.js');
const CRC32C = require('./crc32c.js');

class BsdSum_Compat extends BsdSum {
	constructor(...args) { super(...args); }
	digest(enc) { return super.digest(enc ? enc : 'number'); }
	final(enc) { return super.digest(enc ? enc : 'number'); }
}
class SysvSum_Compat extends SysvSum {
	constructor(...args) { super(...args); }
	digest(enc) { return super.digest(enc ? enc : 'number'); }
	final(enc) { return super.digest(enc ? enc : 'number'); }
}
class CkSum_Compat extends CkSum {
	constructor(...args) { super(...args); }
	digest(enc) { return super.digest(enc ? enc : 'number'); }
	final(enc) { return super.digest(enc ? enc : 'number'); }
}
class CRC32_Compat extends CRC32 {
	constructor(...args) { super(...args); }
	digest(enc) { return super.digest(enc ? enc : 'number'); }
	final(enc) { return super.digest(enc ? enc : 'number'); }
}
class CRC32C_Compat extends CRC32C {
	constructor(...args) { super(...args); }
	digest(enc) { return super.digest(enc ? enc : 'number'); }
	final(enc) { return super.digest(enc ? enc : 'number'); }
}

module.exports = {
	BsdSum: BsdSum_Compat,
	SysvSum: SysvSum_Compat,
	CkSum: CkSum_Compat,
	CRC32: CRC32_Compat,
	CRC32C: CRC32C_Compat,
	// One shot interfaces to legacy hashes.
	bsdSum: function(b, enc) { return new BsdSum_Compat('bsdsum').update(b).digest(enc); },
	sysvSum: function(b, enc) { return new SysvSum_Compat('sysvsum').update(b).digest(enc); },
	ckSum: function(b, enc) { return new CkSum_Compat('cksum').update(b).digest(enc); },
	crc32: function(b, enc) { return new CRC32_Compat('crc32').update(b).digest(enc); },
	crc32c: function(b, enc) { return new CRC32C_Compat('crc32c').update(b).digest(enc); }
};
