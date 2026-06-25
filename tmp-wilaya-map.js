const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const optRegex = /<option value="(\d+)">\d+ - [^<]*?\(([^)]+)\)/g;
let m;
const opts = [];
while ((m = optRegex.exec(html)) !== null) {
  opts.push({ val: m[1], name: m[2].trim() });
}
const map = require('./baladiya-map.json');
const norm = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').trim().toLowerCase();
const entries = Object.entries(map).map(([k, v]) => [k, v.map(x=>norm(x))]);
opts.forEach(opt => {
  const clean = norm(opt.name.replace(/\(.*\)/,'').trim());
  const exact = entries.filter(([k,v]) => v.includes(clean));
  const includes = entries.filter(([k,v]) => v.some(x => x.includes(clean) || clean.includes(x)));
  console.log(opt.val, opt.name, '=> exact=' + exact.map(([k])=>k).join(',') + ' includes=' + includes.map(([k])=>k).join(','));
});
