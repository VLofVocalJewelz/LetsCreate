/* ============================================================
   Rules — requirements, effects, verification, generated hubs.
   Everything here is declarative in, declarative out, so
   tools/validate.js can reason about the whole graph statically.
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  /* ---------------- requirements ----------------
     req = { rel:{nadia:50}, relBelow:{}, has:['E01'], verified:['E03'],
             notHas:[], flag:['tier3'], notFlag:['deal'], item:['tapeExport'],
             integrity:40, credibility:50, composure:35, capital:5000,
             position:true|false, focus:1, verifiedCount:3, day:2, phase:'d2_open' } */
  LC.meets = function (req, s) {
    s = s || LC.state;
    if (!req) return { ok: true };
    const no = (why) => ({ ok: false, why });

    if (req.rel) for (const k in req.rel)
      if (s.rel[k] < req.rel[k]) return no('Needs ' + LC.CAST[k].short + ' closer than this');
    if (req.relBelow) for (const k in req.relBelow)
      if (s.rel[k] >= req.relBelow[k]) return no('Not while ' + LC.CAST[k].short + ' still trusts you');
    if (req.has) for (const id of req.has) {
      const st = s.evidence[id];
      if (st !== 'held' && st !== 'verified') return no('Needs ' + LC.EVIDENCE[id].code);
    }
    if (req.held) for (const id of req.held)
      if (s.evidence[id] !== 'held') return no('Nothing left to check there');
    if (req.verified) for (const id of req.verified)
      if (s.evidence[id] !== 'verified') return no('Needs ' + LC.EVIDENCE[id].code + ' verified');
    if (req.notHas) for (const id of req.notHas) {
      const st = s.evidence[id];
      if (st === 'held' || st === 'verified') return no('Already in hand');
    }
    if (req.flag) for (const f of req.flag) if (!s.flags[f]) return no('Not yet');
    if (req.notFlag) for (const f of req.notFlag) if (s.flags[f]) return no('That door is shut');
    if (req.item) for (const f of req.item)
      if (!s.flags[f]) return no('Needs ' + (LC.ITEMS[f] ? LC.ITEMS[f].name : f));
    if (req.verifiedCount != null && LC.verifiedCount(s) < req.verifiedCount)
      return no('Needs ' + req.verifiedCount + ' verified — you have ' + LC.verifiedCount(s));
    if (req.integrity != null && s.integrity < req.integrity) return no('Your account cannot carry that');
    if (req.credibility != null && s.credibility < req.credibility) return no('Nobody would take your word today');
    if (req.composure != null && s.composure < req.composure) return no('You are too wrung out to do this well');
    if (req.capital != null && LC.equity(s) < req.capital) return no('Not enough equity');
    if (req.position === true && !s.position) return no('You are flat');
    if (req.position === false && s.position) return no('Not while you are in the name');
    if (req.focus != null && s.focus < req.focus) return no('No focus left this session');
    if (req.anyHeld && !LC.EVIDENCE_ORDER.some((e) => s.evidence[e] === 'held'))
      return no('Nothing on the board is waiting to be checked');
    if (req.day != null && LC.phase(s).day < req.day) return no('Not yet');
    return { ok: true };
  };

  /* ---------------- verification ---------------- */
  LC.resolveVerify = function (evId, s) {
    s = s || LC.state;
    const rules = ((LC.EVIDENCE[evId] || {}).verify || {}).rules || [];
    for (const r of rules) {
      if (r.otherwise || LC.meets(r.when, s).ok) return { result: r.result, msg: r.msg };
    }
    return { result: 'held', msg: 'Nothing here holds up yet.' };
  };

  /* ---------------- effects ----------------
     fx = { capital, integrity, credibility, composure, focus, setFocus,
            rel:{}, gain:['E01'], verify:'E01', debunk:'E04', flag:{},
            trade:{}, close:true, note:'', closes:['…'], travel:'diner' } */
  LC.applyFx = function (fx, s) {
    s = s || LC.state;
    const out = [];
    if (!fx) return out;

    if (fx.trade) out.push(...LC.doTrade(fx.trade, s));
    if (fx.close) out.push(...LC.closePosition(s, fx.close === 'stop'));
    if (fx.capital) {
      s.capital += fx.capital;
      out.push({ kind: fx.capital > 0 ? 'good' : 'bad', text: U.money(fx.capital, { sign: true }) + ' cash' });
    }

    [['integrity','Account integrity'],['credibility','Credibility'],['composure','Composure']].forEach(([k,label]) => {
      if (!fx[k]) return;
      const before = s[k];
      s[k] = U.clamp(s[k] + fx[k], 0, 100);
      const d = Math.round(s[k] - before);
      if (d) out.push({ kind: d > 0 ? 'good' : 'bad', text: label + ' ' + (d > 0 ? '+' : '') + d, meter: k });
    });

    if (fx.rel) for (const k in fx.rel) {
      const before = s.rel[k];
      s.rel[k] = U.clamp(s.rel[k] + fx.rel[k], 0, 100);
      const d = Math.round(s.rel[k] - before);
      if (d) out.push({ kind: d > 0 ? 'good' : 'bad', text: LC.CAST[k].short + ' ' + (d > 0 ? '+' : '') + d, person: k });
    }

    (fx.gain || []).forEach((id) => {
      if (s.evidence[id] === 'unknown') {
        s.evidence[id] = 'held';
        out.push({ kind: 'ember', text: 'Pinned — ' + LC.EVIDENCE[id].code + ' ' + LC.EVIDENCE[id].name, evidence: id });
      }
    });
    if (fx.verify) { s.evidence[fx.verify] = 'verified'; out.push({ kind: 'good', text: LC.EVIDENCE[fx.verify].code + ' verified', evidence: fx.verify }); }
    if (fx.debunk) { s.evidence[fx.debunk] = 'debunked'; out.push({ kind: 'bad', text: LC.EVIDENCE[fx.debunk].code + ' does not hold up', evidence: fx.debunk }); }

    if (fx.flag) for (const k in fx.flag) {
      const had = !!s.flags[k];
      s.flags[k] = fx.flag[k];
      if (!had && LC.ITEMS[k] && fx.flag[k]) out.push({ kind: 'ember', text: 'Acquired — ' + LC.ITEMS[k].name, item: k });
      if (!had && LC.LOCATIONS[k.replace(/Open$/, '')] && fx.flag[k]) {
        const loc = LC.LOCATIONS[k.replace(/Open$/, '')];
        if (loc) out.push({ kind: 'info', text: 'Unlocked — ' + loc.name, place: loc.id });
      }
    }

    if (fx.focus) s.focus = Math.max(0, s.focus + fx.focus);
    if (fx.setFocus != null) { s.focus = fx.setFocus; s.focusMax = Math.max(s.focusMax, fx.setFocus); }
    if (fx.travel) s.at = fx.travel;

    if (fx.note) s.journal.push({ phase: LC.phase(s).id, kind: fx.noteKind || 'did', text: fx.note });
    (fx.closes || []).forEach((t) => { if (s.foreclosed.indexOf(t) < 0) s.foreclosed.push(t); });

    return out;
  };

  /* ---------------- generated hubs ----------------
     Authoring 15 phases × 6 locations by hand would be 90 nodes of
     scaffolding. Instead the hub is assembled from whichever action
     nodes declare themselves for this phase and place.            */
  LC.actionsAt = function (phaseId, locId, s) {
    return Object.keys(LC.nodes).filter((id) => {
      const n = LC.nodes[id];
      return n.kind === 'action' && n.phase === phaseId && n.at === locId &&
             !(n.once && s.used[id]);
    });
  };

  LC.hubFor = function (phaseId, locId, s) {
    s = s || LC.state;
    const loc = LC.LOCATIONS[locId];
    const choices = [];

    LC.actionsAt(phaseId, locId, s).forEach((id) => {
      const n = LC.nodes[id];
      const gate = LC.meets(n.req, s);
      const affordable = (n.cost || 0) <= s.focus;
      choices.push({
        label: n.label, detail: gate.ok ? n.detail : gate.why,
        to: id, cost: n.cost || 0, tone: n.tone || 'evidence',
        locked: !gate.ok || !affordable,
        lockWhy: !gate.ok ? gate.why : 'No focus left this session'
      });
    });

    LC.LOC_ORDER.forEach((id) => {
      if (id === locId) return;
      const L = LC.LOCATIONS[id];
      const open = LC.locOpen(id, s);
      choices.push({
        label: 'Go to ' + L.name, detail: open ? L.sub : L.lockHint,
        travel: id, tone: 'social', locked: !open, lockWhy: L.lockHint, group: 'travel'
      });
    });

    choices.push({
      label: LC.phase(s).key === 'after' ? 'End the day' : 'Let the session run out',
      detail: s.focus > 0 ? 'You still have attention left. It does not carry over.' : 'Nothing left to spend.',
      to: phaseId + '_beat', tone: 'ember', advance: true, group: 'advance'
    });

    return {
      id: '__hub_' + phaseId + '_' + locId,
      kind: 'hub', phase: phaseId, at: locId,
      text: [{ beat: loc.line }],
      choicesHead: loc.name,
      choices
    };
  };

  LC.getNode = function (id, s) {
    if (id && id.indexOf('__hub_') === 0) {
      const rest = id.slice(6);
      const cut = rest.lastIndexOf('_');
      return LC.hubFor(rest.slice(0, cut), rest.slice(cut + 1), s);
    }
    return LC.nodes[id];
  };
  LC.hubId = (phaseId, locId) => '__hub_' + phaseId + '_' + locId;
})(window.LC);
