/* Plays the graph headlessly under scripted policies and reports which
   ending each one reaches. This is the ending test matrix, executable. */
'use strict';
const { load, play } = require('./lib.js');
const LC = load();

const has = (o, ...w) => w.some((x) => (o.c.label + ' ' + (o.c.detail || '')).toLowerCase().includes(x));
const work = (opts) => opts.filter((o) => !o.c.travel && !o.c.advance);
const pref = (opts, ...tones) => {
  for (const t of tones) { const m = opts.filter((o) => o.c.tone === t && !o.c.travel); if (m.length) return m[0]; }
  return null;
};
const advance = (opts) => opts.find((o) => o.c.advance) || opts.find((o) => o.c.group === 'advance');
/* go to the place that still has something worth doing in it */
const seek = (opts, st, wanted) => {
  const phase = LC.phase(st).id;
  for (const t of opts.filter((o) => o.c.travel)) {
    const acts = LC.actionsAt(phase, t.c.travel, st)
      .filter((id) => LC.meets(LC.nodes[id].req, st).ok && (LC.nodes[id].cost || 0) <= st.focus);
    if (!acts.length) continue;
    if (!wanted) return t;
    if (acts.some((id) => wanted.some((w) => (LC.nodes[id].label || '').toLowerCase().includes(w)))) return t;
  }
  return null;
};

const POLICIES = {
  'always-safest': (o) => pref(o, 'safe', 'evidence') || (work(o).length ? work(o)[0] : (o.find((x) => x.c.travel) || advance(o) || o[0])),

  'always-riskiest': (o) => pref(o, 'risk') || pref(o, 'ember') || (work(o).length ? work(o)[0] : (advance(o) || o[0])),

  'max-evidence': (o) => {
    const v = o.find((x) => x.c.to && x.c.to.indexOf('VERIFY:') === 0);
    if (v) return v;
    const e = work(o).filter((x) => x.c.tone === 'evidence' || x.c.tone === 'social');
    if (e.length) return e[0];
    if (work(o).length) return work(o)[0];
    return o.find((x) => x.c.travel) || advance(o) || o[0];
  },

  'take-the-deal': (o) => {
    const m = o.find((x) => has(x, 'take it', 'take the money', 'everybody is taking'));
    if (m) return m;
    const q = o.find((x) => has(x, 'nothing. there is no story', 'delete it'));
    if (q) return q;
    return pref(o, 'risk', 'ember') || o[0];
  },

  'quiet-money': (o) => {
    const m = o.find((x) => has(x, 'take it.', 'take the money'));
    if (m) return m;
    const safe = o.find((x) => has(x, 'cross-check', 'refuse it. delete the file'));
    if (safe) return safe;
    const quiet = o.find((x) => has(x, 'nothing. there is no story'));
    if (quiet) return quiet;
    return pref(o, 'safe', 'evidence') || (work(o).length ? work(o)[0] : (o.find((x) => x.c.travel) || advance(o) || o[0]));
  },

  'perfectionist': (o, node, st) => {
    const v = o.find((x) => x.c.to && x.c.to.indexOf('VERIFY:') === 0);
    if (v) return v;
    const key = o.find((x) => has(x,
      'send me the contract', 'ask sable the hard thing', 'ask her again, like you promised',
      'refuse — and record it', 'refuse. say nothing else', 'cross-check',
      'file it with the regulator', 'flat. nothing in the account', 'close everything',
      'sit with nadia', 'close it. today', 'ask candlewick the direct question',
      'tell candlewick what you saw', 'install a call recorder',
      'i do not take anonymous tips', 'depends. did you disclose',
      'a reporter has emailed', '"tonight."', 'sit down with marisol', 'marisol wants a decision',
      'pull the archive', 'get the raw time-and-sales', 'read page 41',
      'actually read the press release', 'bring nadia the ledger', 'go and see sable',
      'work the board', 'last chance'));
    if (key) return key;
    const e = work(o).filter((x) => ['evidence', 'social', 'safe'].includes(x.c.tone));
    if (e.length) return e[0];
    if (work(o).length) return work(o)[0];
    return o.find((x) => x.c.travel) || advance(o) || o[0];
  },

  'the-long-wick': (o, node, st) => {
    const v = o.find((x) => x.c.to && x.c.to.indexOf('VERIFY:') === 0);
    if (v) return v;
    const hinge = o.find((x) => has(x,
      'send me the contract', 'no. i like being able', 'cross-check it against',
      'refuse — and record it', 'file it with the regulator',
      'flat. nothing in the account', 'close everything right now'));
    if (hinge) return hinge;
    const people = o.find((x) => has(x,
      'ask sable the hard thing', 'ask her again, like you promised', 'sit with nadia',
      'close it. today', 'ask candlewick the direct question', 'tell candlewick what you saw',
      'install a call recorder', 'go and see sable', 'check on sable',
      'depends. did you disclose', 'i do not take anonymous tips',
      'a reporter has emailed', '"tonight."', 'sit down with marisol', 'marisol wants a decision',
      'bring nadia the ledger', 'message nadia', 'nadia is not answering'));
    if (people) return people;
    return POLICIES._careful(o, node, st);
  },

  'trust-the-source-blindly': (o) => {
    const m = o.find((x) => has(x, 'post it tonight', 'send me everything', 'publish the thread'));
    if (m) return m;
    return pref(o, 'risk', 'ember') || (work(o).length ? work(o)[0] : (advance(o) || o[0]));
  },

  'publish-it-yourself': (o) => {
    const v = o.find((x) => x.c.to && x.c.to.indexOf('VERIFY:') === 0);
    if (v) return v;
    const m = o.find((x) => has(x, 'publish the thread', 'cross-check'));
    if (m) return m;
    return pref(o, 'evidence', 'safe') || (work(o).length ? work(o)[0] : (o.find((x) => x.c.travel) || advance(o) || o[0]));
  },

  'hold-the-file': (o) => {
    const m = o.find((x) => has(x, 'hold the file'));
    if (m) return m;
    const v = o.find((x) => x.c.to && x.c.to.indexOf('VERIFY:') === 0);
    if (v) return v;
    return pref(o, 'safe', 'evidence') || (work(o).length ? work(o)[0] : (o.find((x) => x.c.travel) || advance(o) || o[0]));
  },

  'careful-everything': (o, node, st) => {
    /* prerequisites first — the boring version, as Nadia put it */
    const prereq = o.find((x) => has(x, 'pull the archive', 'get the raw time-and-sales',
      'sit with nadia', 'a reporter has emailed', 'sit down with marisol',
      'go and see sable', 'ask sable the hard thing', 'ask her again, like you promised',
      'marisol wants a decision', 'ask candlewick the direct question',
      'tell candlewick what you saw', 'read page 41', 'actually read the press release',
      'check on sable', 'message nadia', 'bring nadia the ledger'));
    if (prereq) return prereq;
    return POLICIES._careful(o, node, st);
  },

  _careful: (o) => {
    /* the long route: verify, protect people, refuse money, stay flat */
    const v = o.find((x) => x.c.to && x.c.to.indexOf('VERIFY:') === 0);
    if (v) return v;
    const good = o.find((x) => has(x,
      'send me the contract', 'ask her again', 'cross-check', 'refuse. say nothing else',
      'file it with the regulator', 'flat. nothing in the account', 'close it. today',
      'depends. did you disclose', 'who are you and what do you want',
      'sit with nadia', 'go and see sable', 'ask sable the hard thing',
      'ask candlewick the direct question', 'sit down with marisol', 'bring nadia the ledger',
      'tell candlewick what you saw', 'get the raw time-and-sales', 'pull the archive',
      'read page 41', 'actually read the press release', 'here is why this move is fragile',
      'teach the float', 'warn the room', 'message ori directly', 'nobody can tell you that',
      'small starter', 'flat. watch the first', 'no position', 'marisol wants a decision',
      'a reporter has emailed', '"tonight."'));
    if (good) return good;
    const e = work(o).filter((x) => x.c.tone === 'evidence' || x.c.tone === 'social' || x.c.tone === 'safe');
    if (e.length) return e[0];
    if (work(o).length) return work(o)[0];
    return o.find((x) => x.c.travel) || advance(o) || o[0];
  }
};

const seen = {};
let bad = 0;
console.log('policy                       ending            steps  equity   verified  integrity');
console.log('-'.repeat(84));
Object.keys(POLICIES).forEach((name) => {
  const r = play(LC, POLICIES[name]);
  if (r.error) { console.log(name.padEnd(28) + 'ERROR: ' + r.error); bad++; return; }
  const s = r.s;
  seen[r.ending.id] = true;
  console.log(
    name.padEnd(28) +
    (r.ending.id + (r.ending.variant ? '/' + r.ending.variant : '')).padEnd(18) +
    String(r.trail.length).padEnd(7) +
    ('$' + Math.round(LC.equity(s)).toLocaleString()).padEnd(9) +
    String(LC.verifiedCount(s)).padEnd(10) +
    Math.round(s.integrity)
  );
});

console.log('');
const missing = LC.ENDING_ORDER.filter((id) => !seen[id]);
console.log('endings hit by policy: ' + Object.keys(seen).length + '/' + LC.ENDING_ORDER.length +
            (missing.length ? '   not hit: ' + missing.join(', ') : ''));
if (bad) { console.log('\n' + bad + ' policy run(s) failed'); process.exit(1); }
