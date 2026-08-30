/* Unit tests for the ending resolver: every ending and variant, from a
   constructed end-state. Path coverage is simulate.js's job; this proves
   the gates themselves are satisfiable and correctly ordered. */
'use strict';
const { load } = require('./lib.js');
const LC = load();

let pass = 0, failed = 0;
function check(name, mutate, expectId, expectVariant) {
  const s = LC.newState();
  LC.enterPhase(s, LC.PHASES.length - 1);
  mutate(s);
  const r = LC.resolveEnding(s);
  const ok = r.id === expectId && (expectVariant === undefined || r.variant === expectVariant);
  console.log((ok ? '  ok   ' : '  FAIL ') + name.padEnd(46) +
              '-> ' + r.id + (r.variant ? '/' + r.variant : '') +
              (ok ? '' : '   expected ' + expectId + (expectVariant ? '/' + expectVariant : '')));
  ok ? pass++ : failed++;
}
const verify = (s, ids) => ids.forEach((i) => { s.evidence[i] = 'verified'; });
const rel = (s, o) => Object.assign(s.rel, o);

check('blown account beats everything',
  (s) => { s.integrity = 0; s.flags.channel = 'regulator'; verify(s, ['E01','E02','E03','E04','E05']); },
  'fail', 'marginCall');

check('trading the unpublished draft',
  (s) => { s.flags.tradedOnDraft = true; s.flags.channel = 'regulator'; verify(s, ['E01','E02','E03','E04']); },
  'fail', 'becameIt');

check('publishing the ledger blind',
  (s) => { s.flags.pushedLedgerBlind = true; s.flags.channel = 'public'; verify(s, ['E01','E02']); },
  'fail', null);

check('regulator + 4 verified + named source + flat',
  (s) => { s.flags.channel = 'regulator'; s.flags.sableOnRecord = true; s.flags.finalFlat = true;
           verify(s, ['E01','E02','E03','E05']); },
  'clean', null);

check('press + thin evidence is not a story',
  (s) => { s.flags.channel = 'press'; verify(s, ['E01']); },
  'fail', null);

check('public thread, well sourced',
  (s) => { s.flags.channel = 'public'; verify(s, ['E01','E02','E03','E05']); },
  'viral', 'strong');

check('public thread, four screenshots and a prayer',
  (s) => { s.flags.channel = 'public'; verify(s, ['E01','E02']); },
  'viral', 'weak');

check('took the money',
  (s) => { s.flags.tookTheDeal = true; s.capital += 40000; },
  'profit', null);

check('deleted the file',
  (s) => { s.flags.channel = 'silence'; },
  'profit', null);

check('kept the file, told nobody',
  (s) => { s.flags.channel = 'hold'; verify(s, ['E01','E02']); },
  'survive', null);

check('never chose at all',
  (s) => {},
  'survive', null);

check('THE LONG WICK — everything proven, everyone kept',
  (s) => {
    s.flags.channel = 'regulator';
    s.flags.refusedDeal = true; s.flags.sableOnRecord = true; s.flags.finalFlat = true;
    verify(s, ['E01','E02','E03','E04','E05','E06','E07']);
    rel(s, { nadia: 88, sable: 78, candlewick: 72, dorian: 8 });
  },
  'secret', null);

check('the hidden ending still needs the people',
  (s) => {
    s.flags.channel = 'regulator';
    s.flags.refusedDeal = true; s.flags.sableOnRecord = true; s.flags.finalFlat = true;
    verify(s, ['E01','E02','E03','E04','E05','E06','E07']);
    rel(s, { nadia: 88, sable: 40, candlewick: 72 });
  },
  'clean', null);

console.log('\n' + pass + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
