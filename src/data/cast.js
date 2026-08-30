/* ============================================================
   Cast — four people who can save you or sink you, one reporter
   who can print you, and one stranger you will not stop thinking
   about. All fictional.
   ============================================================ */
(function (LC) {
  'use strict';

  LC.CAST = {
    nadia: {
      id: 'nadia', name: 'Nadia Sarkis', short: 'Nadia', handle: '@sarkis_sized',
      role: 'Risk-first trader', color: '#3ddc97', start: 62,
      blurb: 'Ex-risk desk. Trades small, journals everything, has never once told you a stock was going to the moon.',
      labels: [[0,'Cut off'],[20,'Guarded'],[40,'Straight with you'],[65,'In your corner'],[85,'Would vouch for you']]
    },
    dorian: {
      id: 'dorian', name: 'Dorian Vale', short: 'Dorian', handle: '@valecandles',
      role: 'Mentor · The Candle Room', color: '#f0a24a', start: 54,
      blurb: 'Built the room you learned in. Charismatic, generous with his time, allergic to specifics.',
      labels: [[0,'Enemy'],[20,'Cooling'],[40,'Student'],[65,'Favourite'],[85,'Inner circle']]
    },
    sable: {
      id: 'sable', name: 'Sable Reyes', short: 'Sable', handle: '@sablecharts',
      role: 'Creator · 91k on Loft', color: '#a98bff', start: 48,
      blurb: 'Good on camera, honest by instinct, four months behind on rent. The gap between those is where people get bought.',
      labels: [[0,'Gone'],[20,'Wary'],[40,'Friendly'],[65,'Trusts you'],[85,'Will testify']]
    },
    candlewick: {
      id: 'candlewick', name: 'CANDLEWICK', short: 'CANDLEWICK', handle: 'burner · unverified',
      role: 'Anonymous source', color: '#6f7fb0', start: 30,
      blurb: 'Knows things no outsider should. Wants something you have not identified yet.',
      labels: [[0,'Gone dark'],[20,'Testing you'],[40,'Feeding you'],[65,'Candid'],[85,'Unmasked']]
    },
    marisol: {
      id: 'marisol', name: 'Marisol Trang', short: 'Marisol', handle: 'The Ledger Review',
      role: 'Reporter', color: '#6fd3ff', start: 0, minor: true,
      blurb: 'Will not print a word of it without two sources and a document with a header on it.',
      labels: [[0,'Has not called'],[20,'Circling'],[40,'Listening'],[65,'Working it'],[85,'Ready to run it']]
    }
  };

  LC.CAST_ORDER = ['nadia', 'dorian', 'sable', 'candlewick'];
  LC.CAST_ALL = ['nadia', 'dorian', 'sable', 'candlewick', 'marisol'];

  LC.VOICES = {
    you:    { name: 'You',  color: '#e7ecf5' },
    room:   { name: 'The Candle Room', color: '#f0a24a' },
    system: { name: 'Tessera Markets', color: '#6fd3ff' },
    ori:    { name: 'Ori',  color: '#8fa3bd' }
  };

  LC.relLabel = function (id, value) {
    const t = (LC.CAST[id] && LC.CAST[id].labels) || [];
    let out = '—';
    for (let i = 0; i < t.length; i++) if (value >= t[i][0]) out = t[i][1];
    return out;
  };

  LC.speaker = function (id) {
    return LC.CAST[id] || LC.VOICES[id] || { name: id, color: '#8b96ab' };
  };
})(window.LC);
