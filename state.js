/* ============================================================
   State — the account, the meters, the day clock, the save file
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  const SAVE_KEY = 'lastcandle.save.v1';
  const LEDGER_KEY = 'lastcandle.ledger.v1';

  /* ---------------- the market day ---------------- */
  LC.PHASES = [
    { id:'d1_premarket', day:1, key:'premarket', name:'Pre-market',         clock:'07:12', focus:3 },
    { id:'d1_open',      day:1, key:'open',      name:'Opening volatility', clock:'09:30', focus:2 },
    { id:'d1_midday',    day:1, key:'midday',    name:'Midday',             clock:'12:05', focus:4 },
    { id:'d1_power',     day:1, key:'power',     name:'Power hour',         clock:'15:04', focus:2 },
    { id:'d1_after',     day:1, key:'after',     name:'After-hours',        clock:'16:22', focus:3 },

    { id:'d2_premarket', day:2, key:'premarket', name:'Pre-market',         clock:'06:58', focus:3 },
    { id:'d2_open',      day:2, key:'open',      name:'Opening volatility', clock:'09:30', focus:2 },
    { id:'d2_midday',    day:2, key:'midday',    name:'Midday',             clock:'11:48', focus:4 },
    { id:'d2_power',     day:2, key:'power',     name:'Power hour',         clock:'15:11', focus:2 },
    { id:'d2_after',     day:2, key:'after',     name:'After-hours',        clock:'16:40', focus:3 },

    { id:'d3_premarket', day:3, key:'premarket', name:'Pre-market',         clock:'07:05', focus:3 },
    { id:'d3_open',      day:3, key:'open',      name:'Opening volatility', clock:'09:30', focus:2 },
    { id:'d3_midday',    day:3, key:'midday',    name:'Midday',             clock:'12:31', focus:4 },
    { id:'d3_power',     day:3, key:'power',     name:'Power hour',         clock:'15:22', focus:2 },
    { id:'d3_after',     day:3, key:'after',     name:'After-hours',        clock:'16:15', focus:3 }
  ];
  LC.phaseIndexById = function (id) { return LC.PHASES.findIndex((p) => p.id === id); };

  const START_CAPITAL = 28400;

  /* ---------------- construction ---------------- */
  LC.newState = function () {
    const rel = {};
    LC.CAST_ORDER.forEach((id) => { rel[id] = LC.CAST[id].start; });
    const evidence = {};
    LC.EVIDENCE_ORDER.forEach((id) => { evidence[id] = 'unknown'; });

    return {
      v: 1,
      node: 'd1_premarket_open',
      phase: 0,
      capital: START_CAPITAL,
      startCapital: START_CAPITAL,
      realized: 0,
      position: null,          /* {shares, avg, dir, opened, leveraged} */
      integrity: 78,
      credibility: 61,
      stress: 24,
      focus: 3,
      focusMax: 3,
      rel: rel,
      evidence: evidence,
      flags: {},
      used: {},                /* one-shot choice keys */
      seen: {},
      history: [],             /* short log of decisions, shown at the end */
      startedAt: Date.now()
    };
  };

  LC.state = null;

  /* ---------------- derived ---------------- */
  LC.phase = function (s) { return LC.PHASES[(s || LC.state).phase]; };
  LC.dayOf = function (s) { return LC.phase(s).day; };

  LC.equity = function (s) {
    s = s || LC.state;
    if (!s.position) return s.capital;
    const px = LC.price(s);
    const mark = s.position.dir === 'short'
      ? (s.position.avg - px) * s.position.shares
      : (px - s.position.avg) * s.position.shares;
    return s.capital + mark;
  };
  LC.openPnl = function (s) {
    s = s || LC.state;
    if (!s.position) return 0;
    return LC.equity(s) - s.capital;
  };
  LC.exposure = function (s) {
    s = s || LC.state;
    if (!s.position) return 0;
    return (s.position.shares * LC.price(s)) / Math.max(1, LC.equity(s));
  };

  LC.price = function (s) {
    s = s || LC.state;
    return LC.priceAt(LC.phase(s).id);
  };

  /* ---------------- requirements ---------------- */
  /* req = { rel:{nadia:50}, has:['E01'], verified:['E03'], flag:['vip'],
             notFlag:['deal'], integrity:40, credibility:50, stressBelow:70,
             capital:5000, focus:1, verifiedCount:3, phaseKey:'open' }        */
  LC.meets = function (req, s) {
    s = s || LC.state;
    if (!req) return { ok: true };
    const fail = (why) => ({ ok: false, why: why });

    if (req.rel) for (const k in req.rel) {
      if (s.rel[k] < req.rel[k]) return fail('Needs ' + LC.CAST[k].short + ' — ' + LC.relLabel(k, req.rel[k]).toLowerCase());
    }
    if (req.relBelow) for (const k in req.relBelow) {
      if (s.rel[k] >= req.relBelow[k]) return fail('Not while ' + LC.CAST[k].short + ' still trusts you');
    }
    if (req.has) for (const id of req.has) {
      const st = s.evidence[id];
      if (st !== 'held' && st !== 'verified') return fail('Needs ' + LC.EVIDENCE[id].code);
    }
    if (req.verified) for (const id of req.verified) {
      if (s.evidence[id] !== 'verified') return fail('Needs ' + LC.EVIDENCE[id].code + ' verified');
    }
    if (req.notHas) for (const id of req.notHas) {
      if (s.evidence[id] === 'held' || s.evidence[id] === 'verified') return fail('Already in hand');
    }
    if (req.flag) for (const f of req.flag) { if (!s.flags[f]) return fail('Not yet'); }
    if (req.notFlag) for (const f of req.notFlag) { if (s.flags[f]) return fail('That door is closed now'); }
    if (req.verifiedCount != null && LC.verifiedCount(s) < req.verifiedCount) {
      return fail('Needs ' + req.verifiedCount + ' verified items — you have ' + LC.verifiedCount(s));
    }
    if (req.integrity != null && s.integrity < req.integrity) return fail('Your account cannot carry that right now');
    if (req.credibility != null && s.credibility < req.credibility) return fail('Nobody would take your word for it today');
    if (req.stressBelow != null && s.stress >= req.stressBelow) return fail('You are too wound up to do this well');
    if (req.capital != null && LC.equity(s) < req.capital) return fail('Not enough equity');
    if (req.position === true && !s.position) return fail('You are flat');
    if (req.position === false && s.position) return fail('Not while you are in the name');
    if (req.focus != null && s.focus < req.focus) return fail('No focus left this session');
    return { ok: true };
  };

  /* ---------------- effects ---------------- */
  /* fx = { capital, integrity, credibility, stress, focus, setFocus,
            rel:{}, gain:[], verify:'E01', debunk:'E04', flag:{}, note:'',
            trade:{...}, close:true, tension:true }                          */
  LC.applyFx = function (fx, s) {
    s = s || LC.state;
    const out = [];
    if (!fx) return out;

    if (fx.trade) out.push.apply(out, LC.doTrade(fx.trade, s));
    if (fx.close) out.push.apply(out, LC.closePosition(s, fx.close === 'stop'));

    if (fx.capital) { s.capital += fx.capital; out.push({ kind: fx.capital > 0 ? 'good' : 'bad', text: U.money(fx.capital, { sign: true }) + ' cash' }); }

    const meters = [['integrity','Account integrity'],['credibility','Credibility'],['stress','Stress']];
    meters.forEach(([k, label]) => {
      if (fx[k]) {
        const before = s[k];
        s[k] = U.clamp(s[k] + fx[k], 0, 100);
        const d = Math.round(s[k] - before);
        if (d) {
          const good = (k === 'stress') ? d < 0 : d > 0;
          out.push({ kind: good ? 'good' : 'bad', text: label + ' ' + (d > 0 ? '+' : '') + d, meter: k });
        }
      }
    });

    if (fx.rel) for (const k in fx.rel) {
      const before = s.rel[k];
      s.rel[k] = U.clamp(s.rel[k] + fx.rel[k], 0, 100);
      const d = Math.round(s.rel[k] - before);
      if (d) out.push({ kind: d > 0 ? 'good' : 'bad', text: LC.CAST[k].short + ' ' + (d > 0 ? '+' : '') + d, person: k });
    }

    if (fx.gain) fx.gain.forEach((id) => {
      if (s.evidence[id] === 'unknown') {
        s.evidence[id] = 'held';
        out.push({ kind: 'ember', text: 'Pinned to the board — ' + LC.EVIDENCE[id].code + ' ' + LC.EVIDENCE[id].name, evidence: id });
      }
    });
    if (fx.verify) { s.evidence[fx.verify] = 'verified'; out.push({ kind: 'good', text: LC.EVIDENCE[fx.verify].code + ' verified', evidence: fx.verify }); }
    if (fx.debunk) { s.evidence[fx.debunk] = 'debunked'; out.push({ kind: 'bad', text: LC.EVIDENCE[fx.debunk].code + ' does not hold up', evidence: fx.debunk }); }

    if (fx.flag) for (const k in fx.flag) s.flags[k] = fx.flag[k];

    if (fx.focus) s.focus = Math.max(0, s.focus + fx.focus);
    if (fx.setFocus != null) { s.focus = fx.setFocus; s.focusMax = Math.max(s.focusMax, fx.setFocus); }

    if (fx.note) s.history.push({ phase: LC.phase(s).id, note: fx.note });
    return out;
  };

  /* ---------------- position handling ---------------- */
  const SIZES = {
    starter:  { frac: 0.08, label: 'starter' },
    normal:   { frac: 0.18, label: 'planned size' },
    heavy:    { frac: 0.42, label: 'oversized' },
    allin:    { frac: 0.92, label: 'the whole account' },
    margin:   { frac: 1.85, label: 'on margin', leveraged: true }
  };

  LC.doTrade = function (t, s) {
    s = s || LC.state;
    const out = [];
    const size = SIZES[t.size] || SIZES.normal;
    const px = LC.price(s);
    const eq = LC.equity(s);
    const notional = eq * size.frac;
    const shares = Math.max(1, Math.floor(notional / px));

    if (s.position && s.position.dir !== (t.dir || 'long')) out.push.apply(out, LC.closePosition(s));

    if (s.position) {
      const tot = s.position.shares + shares;
      s.position.avg = (s.position.avg * s.position.shares + px * shares) / tot;
      s.position.shares = tot;
      s.position.leveraged = s.position.leveraged || !!size.leveraged;
    } else {
      s.position = { shares, avg: px, dir: t.dir || 'long', opened: LC.phase(s).id, leveraged: !!size.leveraged, sizeKey: t.size };
    }

    /* risk discipline: integrity is about how you hold risk, not whether you win */
    let hit = 0;
    if (size.frac > 0.35) hit -= 8;
    if (size.frac > 0.8) hit -= 10;
    if (size.leveraged) hit -= 14;
    if (t.noStop) hit -= 6; else hit += 2;
    if (t.revenge) hit -= 8;
    if (hit) {
      s.integrity = U.clamp(s.integrity + hit, 0, 100);
      out.push({ kind: hit > 0 ? 'good' : 'bad', text: 'Account integrity ' + (hit > 0 ? '+' : '') + hit, meter: 'integrity' });
    }
    const stress = size.frac > 0.35 ? 9 : 4;
    s.stress = U.clamp(s.stress + stress, 0, 100);

    s.flags.hasTraded = true;
    if (size.frac >= 0.42) s.flags.tradedBig = true;
    out.push({ kind: 'info', text: (t.dir === 'short' ? 'Short ' : 'Long ') + shares.toLocaleString() + ' HALX @ ' + U.px(px) + ' — ' + size.label });

    if (s.evidence.E08 === 'unknown' && (size.frac >= 0.42 || s.flags.tradedTwice)) {
      s.evidence.E08 = 'verified';
      out.push({ kind: 'bad', text: 'Your own book is now part of the story', evidence: 'E08' });
    }
    if (s.flags.hasTraded) s.flags.tradedTwice = true;
    return out;
  };

  LC.closePosition = function (s, stopped) {
    s = s || LC.state;
    const out = [];
    if (!s.position) return out;
    const pnl = LC.openPnl(s);
    s.capital += pnl;
    s.realized += pnl;
    const held = s.position.shares;
    s.position = null;
    out.push({
      kind: pnl >= 0 ? 'good' : 'bad',
      text: 'Closed ' + held.toLocaleString() + ' shares — ' + U.money(pnl, { sign: true })
    });
    if (stopped) {
      s.integrity = U.clamp(s.integrity + 5, 0, 100);
      out.push({ kind: 'good', text: 'Account integrity +5 — you honoured the stop', meter: 'integrity' });
    }
    s.stress = U.clamp(s.stress + (pnl < 0 ? 8 : -6), 0, 100);
    return out;
  };

  /* mark the book at each phase boundary; drawdown erodes integrity */
  LC.settlePhase = function (s) {
    s = s || LC.state;
    const out = [];
    if (!s.position) return out;
    const pnl = LC.openPnl(s);
    const dd = pnl / Math.max(1, s.capital);
    if (dd < -0.12) {
      const hit = dd < -0.3 ? -12 : -6;
      s.integrity = U.clamp(s.integrity + hit, 0, 100);
      s.stress = U.clamp(s.stress + 10, 0, 100);
      out.push({ kind: 'bad', text: 'Drawdown is eating the account — integrity ' + hit, meter: 'integrity' });
    } else if (dd > 0.15) {
      s.stress = U.clamp(s.stress + 5, 0, 100);
    }
    if (s.position.leveraged) {
      s.stress = U.clamp(s.stress + 6, 0, 100);
    }
    return out;
  };

  LC.enterPhase = function (s, index) {
    s = s || LC.state;
    s.phase = U.clamp(index, 0, LC.PHASES.length - 1);
    const p = LC.PHASES[s.phase];
    let f = p.focus;
    if (s.stress >= 72) f -= 1;
    if (s.stress >= 90) f -= 1;
    if (s.integrity >= 80) f += 1;
    s.focus = Math.max(1, f);
    s.focusMax = s.focus;
    return p;
  };

  /* ---------------- save / ledger ---------------- */
  LC.save = function () { if (LC.state) U.store.set(SAVE_KEY, LC.state); };
  LC.loadSave = function () {
    const raw = U.store.get(SAVE_KEY, null);
    if (!raw || raw.v !== 1 || !raw.node) return null;
    return raw;
  };
  LC.clearSave = function () { U.store.del(SAVE_KEY); };
  LC.hasSave = function () { return !!LC.loadSave(); };

  LC.ledger = function () { return U.store.get(LEDGER_KEY, {}); };
  LC.recordEnding = function (id) {
    const l = LC.ledger();
    l[id] = (l[id] || 0) + 1;
    U.store.set(LEDGER_KEY, l);
  };
})(window.LC);
