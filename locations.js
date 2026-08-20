/* ============================================================
   Six places. Travel is free; acting is not.
   ============================================================ */
(function (LC) {
  'use strict';

  LC.LOCATIONS = {
    desk: {
      id: 'desk', name: 'The Desk', sub: 'your apartment · three monitors',
      tint: '#6fd3ff', open: true,
      line: 'Rain on the glass in the same three channels. The chair has a shape now, and the shape is yours.'
    },
    room: {
      id: 'room', name: 'The Candle Room', sub: 'private · members only',
      tint: '#f0a24a', open: true,
      line: 'Nine thousand people who all learned the same vocabulary from the same man.'
    },
    tier3: {
      id: 'tier3', name: 'Tier 3', sub: 'the room behind the room',
      tint: '#ff5a6a', req: { flag: ['tier3'] },
      lockHint: 'Dorian decides who sees this.',
      line: 'Forty names. One pinned rule: what is said here is said nowhere else.'
    },
    diner: {
      id: 'diner', name: "Kettleman's", sub: 'all night · corner booth',
      tint: '#3ddc97', req: { flag: ['dinerOpen'] },
      lockHint: 'Nadia has not asked you out yet.',
      line: 'Vinyl, bad coffee, and the only person in this story who will tell you no.'
    },
    studio: {
      id: 'studio', name: "Sable's studio", sub: 'rented · half packed',
      tint: '#a98bff', req: { flag: ['studioOpen'] },
      lockHint: 'She has to let you in first.',
      line: 'A ring light, two boxes taped shut, and a letter on the counter she has not opened.'
    },
    newsroom: {
      id: 'newsroom', name: 'The Ledger Review', sub: 'ninth floor · after six',
      tint: '#c9d6e8', req: { flag: ['newsroomOpen'] },
      lockHint: 'Nobody has called you yet.',
      line: 'Four desks still lit and a whiteboard that says WHAT DO WE ACTUALLY HAVE.'
    }
  };

  LC.LOC_ORDER = ['desk', 'room', 'tier3', 'diner', 'studio', 'newsroom'];

  LC.locOpen = function (id, s) {
    const L = LC.LOCATIONS[id];
    if (!L) return false;
    if (L.open) return true;
    return LC.meets(L.req, s).ok;
  };
})(window.LC);
