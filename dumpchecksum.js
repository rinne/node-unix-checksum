'use strict';

const fs = require('fs');
const uc = require('./index.js');

function cs(file) {
	return new Promise(function(resolve, reject) {
		var c1 = new uc.BsdSum();
		var c2 = new uc.SysvSum();
		var c3 = new uc.CkSum();
		var c4 = new uc.CRC32();
		var c5 = new uc.CRC32C();
		function final() {
			var r = {};
			if (file) {
				r.file = file;
			}
			c1.final();
			c2.final();
			c3.final();
			c4.final();
			c5.final();
			r.len = c1.length;
			r.bsd = c1;
			r.sysv = c2;
			r.cksum = c3;
			r.crc32 = c4;
			r.crc32c = c5;
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
					c5.update(s);
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
				c5.update(d);
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
				 console.log('file:   ' + r.file);
			 }
			 console.log('error:  ' + r.error);
		 } else {
			 if (r.file) {
				 console.log('file:   ' + r.file);
			 }
			 console.log('length: ' + r.len + ' bytes');
			 console.log('bsd:    ' + r.bsd.digest() + ' (blocks: ' + r.bsd.block + ')');
			 console.log('sysv:   ' + r.sysv.digest() + ' (blocks: ' + r.sysv.block + ')');
			 console.log('cksum:  ' + r.cksum.digest());
			 console.log('crc32:  ' + r.crc32.digest() + ' (' + r.crc32.digest('hex') + ')');
			 console.log('crc32c: ' + r.crc32c.digest() + ' (' + r.crc32c.digest('hex') + ')');
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
