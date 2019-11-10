'use strict';

const fs = require('fs');
const uc = require('./index.js');

function cs(file) {
	return new Promise(function(resolve, reject) {
		var c1 = new uc.BsdSum();
		var c2 = new uc.SysvSum();
		var c3 = new uc.CkSum();
		var c4 = new uc.CRC32();
		var c4h = new uc.CRC32();
		var c5 = new uc.CRC32C();
		var c5h = new uc.CRC32C();
		var len = 0;
		function final() {
			var r = {};
			if (file) {
				r.file = file;
			}
			r.len = len;
			r.bsd = c1.final();
			r.bsdBlock = c1.block;
			r.sysv = c2.final();
			r.sysvBlock = c2.block;
			r.cksum = c3.final();
			r.crc32 = c4.final();
			r.crc32_h = c4h.final('hex');
			r.crc32c = c5.final();
			r.crc32c_h = c5h.final('hex');
			return r;
		}
		if (file) {
			let f;
			try {
				f = fs.openSync(file, 'r');
				let b = Buffer.alloc(16), l;
				while ((l = fs.readSync(f, b, 0, b.length)) > 0) {
					let s = b.slice(0, l);
					c1.update(s);
					c2.update(s);
					c3.update(s);
					c4.update(s);
					c4h.update(s);
					c5.update(s);
					c5h.update(s);
					len += l;
				}
				fs.closeSync(f);
				f = undefined;
				return resolve(final());
			} catch(e) {
				if (f) {
					fs.closeSync(f)
					f = undefined;
				}
				return reject(e);
			}
		} else {
			process.stdin.on('data', function(d) {
				c1.update(d);
				c2.update(d);
				c3.update(d);
				c4.update(d);
				c4h.update(d);
				c5.update(d);
				c5h.update(d);
				len += d.length;
			}).on('end', function() {
				return resolve(final());
			});
		}
	});
}

(Promise.resolve()
 .then(function() {
	 var p = [];
	 if (process.argv.length < 3) {
		 p.push(cs());
	 } else {
		 process.argv.slice(2).forEach(function(fn) {
			 p.push(cs(fn).catch(function(e) { return { file: fn, error: e } }));
		 });
	 }
	 return Promise.all(p);
 })
 .then(function(ret) {
	 var ec = 0, first = true;
	 ret.forEach(function(r) {
		 if (first) {
			 first = false;
		 } else {
			 console.log('--');
		 }
		 if (r.error) {
			 ec++;
			 if (r.file) {
				 console.log('file:         ' + r.file);
			 }
			 console.log('error:        ' + r.error);
		 } else {
			 if (r.file) {
				 console.log('file:         ' + r.file);
			 }
			 console.log('input length: ' + r.len);
			 console.log('bsd:          ' + r.bsd + ' (blocks: ' + r.bsdBlock + ')');
			 console.log('sysv:         ' + r.sysv + ' (blocks: ' + r.sysvBlock + ')');
			 console.log('cksum:        ' + r.cksum);
			 console.log('crc32:        ' + r.crc32 + ' (' + r.crc32_h + ')');
			 console.log('crc32c:       ' + r.crc32c + ' (' + r.crc32c_h + ')');
		 }
	 });
	 return ec == 0;
 })
 .then(function(ret) {
	 process.exit(ret ? 0 : 1);
 })
 .catch(function(e) {
	 console.log(e);
	 process.exit(1);
 }));
