/* ============================================================
   Cast — four people who can save you or sink you
   ============================================================ */
(function (LC) {
  'use strict';

  LC.CAST = {
    nadia: {
      id: 'nadia',
      name: 'Nadia Sarkis',
      short: 'Nadia',
      handle: '@sarkis_sized',
      role: 'Risk-first trader',
      color: '#3ddc97',
      blurb: 'Ex-risk desk. Trades small, journals everything, has never once told you a stock was going to the moon.',
      start: 62,
      relLabels: [[0,'Cut off'],[20,'Guarded'],[40,'Straight with you'],[65,'In your corner'],[85,'Would vouch for you']]
    },
    dorian: {
      id: 'dorian',
      name: 'Dorian Vale',
      short: 'Dorian',
      handle: '@valecandles',
      role: 'Mentor · The Candle Room',
      color: '#f0a24a',
      blurb: 'Built the room you learned in. Charismatic, generous with his time, allergic to specifics.',
      start: 54,
      relLabels: [[0,'Enemy'],[20,'Cooling'],[40,'Student'],[65,'Favourite'],[85,'Inner circle']]
    },
    sable: {
      id: 'sable',
      name: 'Sable Reyes',
      short: 'Sable',
      handle: '@sablecharts',
      role: 'Creator · 91k on Loft',
      color: '#a98bff',
      blurb: 'Good on camera, honest by instinct, four months behind on rent. The gap between those things is where people get bought.',
      start: 48,
      relLabels: [[0,'Blocked you'],[20,'Wary'],[40,'Friendly'],[65,'Trusts you'],[85,'Will testify']]
    },
    candlewick: {
      id: 'candlewick',
      name: 'CANDLEWICK',
      short: 'CANDLEWICK',
      handle: 'burner · unverified',
      role: 'Anonymous source',
      color: '#6f7fb0',
      blurb: 'Knows things no outsider should. Wants something you have not identified yet.',
      start: 30,
      relLabels: [[0,'Gone dark'],[20,'Testing you'],[40,'Feeding you'],[65,'Candid'],[85,'Unmasked']]
    }
  };

  LC.CAST_ORDER = ['nadia', 'dorian', 'sable', 'candlewick'];

  /* minor voices — used in prose and the room feed */
  LC.VOICES = {
    you:     { name: 'You', color: '#e7ecf5' },
    marisol: { name: 'Marisol Trang', color: '#6fd3ff', role: 'Reporter · The Ledger Review' },
    room:    { name: 'The Candle Room', color: '#f0a24a' },
    system:  { name: 'Tessera Markets', color: '#6fd3ff' }
  };

  LC.relLabel = function (id, value) {
    const table = (LC.CAST[id] && LC.CAST[id].relLabels) || [];
    let label = '—';
    for (let i = 0; i < table.length; i++) if (value >= table[i][0]) label = table[i][1];
    return label;
  };
})(window.LC);
