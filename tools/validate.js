/* Static checks over the whole story graph. No DOM, no browser. */
'use strict';
const { load } = require('./lib.js');
const LC = load();
const N = LC.nodes;
const ids = new Set(Object.keys(N));
const fail = [];
const warn = [];
const SPECIAL = (t) => !t || t === 'ENDING' || t.indexOf('BACK') === 0 || t.indexOf('VERIFY:') === 0 || t.indexOf('__hub_') === 0;

/* ---- 1. every target resolves ---- */
for (const [id, n] of Object.entries(N)) {
  const targets = (n.choices || []).map((c) => c.to).filter(Boolean);
  if (n.to) targets.push(n.to);
  targets.forEach((t) => { if (!SPECIAL(t) && !ids.has(t)) fail.push('dangling: ' + id + ' -> ' + t); });
}

/* ---- 2. reachability, expanding generated hubs ---- */
const seen = new Set();
(function walk(id) {
  if (!id || seen.has(id)) return;
  if (id.indexOf('__hub_') === 0) {
    const rest = id.slice(6), cut = rest.lastIndexOf('_');
    const phase = rest.slice(0, cut), at = rest.slice(cut + 1);
    seen.add(id);
    Object.keys(N).forEach((k) => {
      const n = N[k];
      if (n.kind === 'action' && n.phase === phase && n.at === at) walk(k);
    });
    if (N[phase + '_beat']) walk(phase + '_beat');
    LC.LOC_ORDER.forEach((l) => { if (l !== at) walk('__hub_' + phase + '_' + l); });
    return;
  }
  if (!N[id]) return;
  seen.add(id);
  const n = N[id];
  (n.choices || []).forEach((c) => { if (c.to && !SPECIAL(c.to)) walk(c.to); else if (c.to && c.to.indexOf('__hub_') === 0) walk(c.to); });
  if (n.to) walk(n.to);
  if (n.back && typeof n.back === 'string') walk('__hub_' + n.phase + '_' + n.back);
  if (n.back === true) LC.LOC_ORDER.forEach((l) => walk('__hub_' + n.phase + '_' + l));
})('d1_premarket_open');
[...ids].filter((i) => !seen.has(i)).forEach((i) => fail.push('unreachable: ' + i));

/* ---- 3. ids referenced actually exist ---- */
const EV = new Set(LC.EVIDENCE_ORDER), CAST = new Set(LC.CAST_ALL), ITEM = new Set(LC.ITEM_ORDER);
const chk = (o, where) => {
  if (!o) return;
  (o.gain || []).concat(o.has || [], o.verified || [], o.notHas || [], o.held || []).forEach((e) => { if (!EV.has(e)) fail.push('bad evidence id ' + e + ' @ ' + where); });
  ['verify', 'debunk'].forEach((k) => { if (o[k] && !EV.has(o[k])) fail.push('bad evidence id ' + o[k] + ' @ ' + where); });
  Object.keys(o.rel || {}).forEach((r) => { if (!CAST.has(r)) fail.push('bad character ' + r + ' @ ' + where); });
  (o.item || []).forEach((i) => { if (!ITEM.has(i)) fail.push('bad item ' + i + ' @ ' + where); });
  if (o.travel && !LC.LOCATIONS[o.travel]) fail.push('bad location ' + o.travel + ' @ ' + where);
};
for (const [id, n] of Object.entries(N)) {
  chk(n.onEnter, id + '.onEnter');
  chk(n.req, id + '.req');
  (n.choices || []).forEach((c, i) => { chk(c.fx, id + '.choice' + i + '.fx'); chk(c.req, id + '.choice' + i + '.req'); });
  if (n.at && !LC.LOCATIONS[n.at]) fail.push('bad location ' + n.at + ' @ ' + id);
  if (n.phase && !LC.phaseById(n.phase)) fail.push('bad phase ' + n.phase + ' @ ' + id);
}

/* ---- 4. flags: everything read is written somewhere ---- */
const written = new Set(), read = new Set();
const scanW = (o) => o && Object.keys(o.flag || {}).forEach((f) => written.add(f));
const scanR = (o) => { if (!o) return; (o.flag || []).forEach((f) => read.add(f)); (o.notFlag || []).forEach((f) => read.add(f)); (o.item || []).forEach((f) => read.add(f)); };
for (const n of Object.values(N)) {
  scanW(n.onEnter); scanR(n.req);
  (n.choices || []).forEach((c) => { scanW(c.fx); scanR(c.req); });
}
Object.values(LC.EVIDENCE).forEach((e) => (e.verify.rules || []).forEach((r) => scanR(r.when)));
Object.values(LC.LOCATIONS).forEach((l) => scanR(l.req));
LC.ITEM_ORDER.forEach((i) => read.add(i));
[...read].filter((f) => !written.has(f)).forEach((f) => fail.push('flag read but never written: ' + f));

/* ---- 5. every evidence item has a satisfiable route to verified ---- */
LC.EVIDENCE_ORDER.forEach((id) => {
  const rules = LC.EVIDENCE[id].verify.rules || [];
  const ok = rules.some((r) => {
    if (r.result !== 'verified') return false;
    if (r.otherwise) return true;
    const flags = (r.when && r.when.flag) || [];
    return flags.every((f) => written.has(f));
  });
  if (!ok) fail.push('evidence ' + id + ' has no satisfiable path to verified');
});

/* ---- 6. every ending is referenced by the resolver ---- */
const src = require('fs').readFileSync(__dirname + '/../src/data/endings.js', 'utf8');
LC.ENDING_ORDER.forEach((id) => {
  if (!new RegExp("id: '" + id + "'").test(src)) fail.push('ending ' + id + ' unreachable in resolver');
});

/* ---- report ---- */
console.log('nodes: ' + ids.size + '  reachable: ' + [...ids].filter((i) => seen.has(i)).length +
            '  evidence: ' + LC.EVIDENCE_ORDER.length + '  locations: ' + LC.LOC_ORDER.length);
warn.forEach((w) => console.log('  warn  ' + w));
if (fail.length) { fail.forEach((f) => console.log('  FAIL  ' + f)); console.log('\n' + fail.length + ' problem(s)'); process.exit(1); }
console.log('validate: clean');
