/* ============================================================
   The evidence board, as an action you can take at the desk.
   Generated rather than hand-written: the same menu appears in
   five sessions, and opening it is free — only checking costs.
   ============================================================ */
(function (LC) {
  'use strict';
  LC.nodes = LC.nodes || {};

  const WINDOWS = {
    d1_midday:    'Work the board while it is quiet',
    d2_midday:    'Work the board',
    d2_after:     'Work the board before you sleep',
    d3_premarket: 'Work the board while there is still time',
    d3_midday:    'Last chance to prove anything'
  };

  Object.keys(WINDOWS).forEach((phase) => {
    LC.nodes[phase + '_verify'] = {
      kind: 'action', phase: phase, at: 'desk', cost: 0, once: false, tone: 'evidence',
      label: WINDOWS[phase],
      req: { anyHeld: true, focus: 1 },
      detail: 'Opening the board is free. Trying to break a claim is not.',
      text: [{ beat: 'Verification is not believing harder. It is trying to destroy your own case and failing.' }],
      choicesHead: 'What are you checking?',
      choices: LC.EVIDENCE_ORDER.filter((id) => !LC.hasTag(id, 'counter')).map((id) => ({
        label: LC.EVIDENCE[id].code + ' · ' + LC.EVIDENCE[id].name,
        detail: LC.EVIDENCE[id].verify.label,
        cost: LC.EVIDENCE[id].verify.cost,
        to: 'VERIFY:' + id,
        tone: 'evidence',
        req: { held: [id] }
      })).concat([{ label: 'Close the board', to: 'BACK:desk', tone: 'safe', group: 'advance' }])
    };
  });
})(window.LC);
