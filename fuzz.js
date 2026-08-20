/* Random playthroughs: no crashes, no dead ends, and a distribution
   report that catches endings which are reachable in theory but never
   in practice. */
'use strict';
const { load, play } = require('./lib.js');
const LC = load();

const RUNS = parseInt(process.argv[2] || '3000', 10);
let seed = 20260819;
const rnd = () => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; };

const dist = {}, errors = {};
let ok = 0;
const stats = { verified: 0, equity: 0, integrity: 0 };

for (let i = 0; i < RUNS; i++) {
  const r = play(LC, (opts) => opts[Math.floor(rnd() * opts.length)], 1200);
  if (r.error) { errors[r.error] = (errors[r.error] || 0) + 1; continue; }
  ok++;
  const id = r.ending.id + (r.ending.variant ? '/' + r.ending.variant : '');
  dist[id] = (dist[id] || 0) + 1;
  stats.verified += LC.verifiedCount(r.s);
  stats.equity += LC.equity(r.s);
  stats.integrity += r.s.integrity;
}

console.log(RUNS + ' random runs · ' + ok + ' completed · ' + (RUNS - ok) + ' failed\n');
Object.entries(dist).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => {
  const pct = (n / ok * 100);
  console.log('  ' + k.padEnd(20) + String(n).padStart(5) + '  ' + pct.toFixed(1).padStart(5) + '%  ' +
              '█'.repeat(Math.round(pct / 2)));
});
console.log('\n  mean verified ' + (stats.verified / ok).toFixed(2) +
            ' · mean equity $' + Math.round(stats.equity / ok).toLocaleString() +
            ' · mean integrity ' + Math.round(stats.integrity / ok));

const errKeys = Object.keys(errors);
if (errKeys.length) {
  console.log('\nfailures:');
  errKeys.forEach((e) => console.log('  ' + errors[e] + '×  ' + e));
  process.exit(1);
}
console.log('\nfuzz: no crashes, no dead ends');
