/* ============================================================
   State — the account, the meters, the day clock, the save file
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  const SAVE_KEY = 'lastcandle.save.v2';
  const LEDGER_KEY = 'lastcandle.ledger.v2';
  const PREF_KEY = 'lastcandle.prefs.v2';
  const START_CAPITAL = 28400;

  /* ---------------- the market day ---------------- */
  LC.PHASES = [
    { id:'d1_premarket', day:1, key:'premarket', name:'Pre-market',         clock:'07:12', focus:3 },
    { id:'d1_open',      day:1, key:'open',      name:'Opening volatility', clock:'09:30', focus:2 },
    { id:'d1_midday',    day:1, key:'midday',    name:'Midday',             clock:'12:05', focus:4 },
    { id:'d1_power',     day:1, key:'power',     name:'Power hour',         clock:'15:04', focus:3 },
    { id:'d1_after',     day:1, key:'after',     name:'After-hours',        clock:'16:22', focus:3 },
    { id:'d2_premarket', day:2, key:'premarket', name:'Pre-market',         clock:'06:58', focus:3 },
    { id:'d2_open',      day:2, key:'open',      name:'Opening volatility', clock:'09:30', focus:2 },
    { id:'d2_midday',    day:2, key:'midday',    name:'Midday',             clock:'11:48', focus:4 },
    { id:'d2_power',     day:2, key:'power',     name:'Power hour',         clock:'15:11', focus:3 },
    { id:'d2_after',     day:2, key:'after',     name:'After-hours',        clock:'16:40', focus:3 },
    { id:'d3_premarket', day:3, key:'premarket', name:'Pre-market',         clock:'07:05', focus:3 },
    { id:'d3_open',      day:3, key:'open',      name:'Opening volatility', clock:'09:30', focus:2 },
    { id:'d3_midday',    day:3, key:'midday',    name:'Midday',             clock:'12:31', focus:4 },
    { id:'d3_power',     day:3, key:'power',     name:'Power hour',         clock:'15:22', focus:3 },
    { id:'d3_after',     day:3, key:'after',     name:'After-hours',        clock:'16:15', focus:3 }
  ];
  LC.phaseIndexById = (id) => LC.PHASES.findIndex((p) => p.id === id);
  LC.phaseById = (id) => LC.PHASES[LC.phaseIndexById(id)];

  /* ---------------- construction ---------------- */
  LC.newState = function () {
    const rel = {}; LC.CAST_ALL.forEach((id) => { rel[id] = LC.CAST[id].start; });
    const evidence = {}; LC.EVIDENCE_ORDER.forEach((id) => { evidence[id] = 'unknown'; });
    return {
      v: 2,
      node: 'd1_premarket_open',
      phase: 0,
      at: 'desk',
      capital: START_CAPITAL, startCapital: START_CAPITAL, realized: 0,
      position: null,
      integrity: 78, credibility: 61, composure: 76,
      focus: 3, focusMax: 3,
      rel, evidence,
      flags: {}, used: {}, hinges: {},
      journal: [], foreclosed: [],
      startedAt: Date.now()
    };
  };

  LC.state = null;

  /* ---------------- derived ---------------- */
  LC.phase = (s) => LC.PHASES[(s || LC.state).phase];
  LC.price = (s) => LC.priceAt(LC.phase(s || LC.state).id);

  LC.equity = function (s) {
    s = s || LC.state;
    if (!s.position) return s.capital;
    const px = LC.price(s), p = s.position;
    const mark = p.dir === 'short' ? (p.avg - px) * p.shares : (px - p.avg) * p.shares;
    return s.capital + mark;
  };
  LC.openPnl = (s) => { s = s || LC.state; return s.position ? LC.equity(s) - s.capital : 0; };
  LC.exposure = function (s) {
    s = s || LC.state;
    return s.position ? (s.position.shares * LC.price(s)) / Math.max(1, LC.equity(s)) : 0;
  };

  /* ---------------- position handling ---------------- */
  const SIZES = {
    starter: { frac: 0.08, label: 'starter' },
    normal:  { frac: 0.18, label: 'planned size' },
    heavy:   { frac: 0.42, label: 'oversized' },
    allin:   { frac: 0.92, label: 'the whole account' },
    margin:  { frac: 1.85, label: 'on margin', leveraged: true }
  };

  LC.doTrade = function (t, s) {
    s = s || LC.state;
    const out = [];
    const size = SIZES[t.size] || SIZES.normal;
    const px = LC.price(s);
    const shares = Math.max(1, Math.floor((LC.equity(s) * size.frac) / px));

    if (s.position && s.position.dir !== (t.dir || 'long')) out.push(...LC.closePosition(s));

    if (s.position) {
      const tot = s.position.shares + shares;
      s.position.avg = (s.position.avg * s.position.shares + px * shares) / tot;
      s.position.shares = tot;
      s.position.leveraged = s.position.leveraged || !!size.leveraged;
    } else {
      s.position = { shares, avg: px, dir: t.dir || 'long', opened: LC.phase(s).id,
                     leveraged: !!size.leveraged, sizeKey: t.size };
    }

    /* integrity is about how you carry risk, not whether you win */
    let hit = 0;
    if (size.frac > 0.35) hit -= 8;
    if (size.frac > 0.8) hit -= 10;
    if (size.leveraged) hit -= 14;
    hit += t.noStop ? -6 : 2;
    if (t.revenge) hit -= 8;
    if (hit) {
      s.integrity = U.clamp(s.integrity + hit, 0, 100);
      out.push({ kind: hit > 0 ? 'good' : 'bad', text: 'Account integrity ' + (hit > 0 ? '+' : '') + hit, meter: 'integrity' });
    }
    s.composure = U.clamp(s.composure - (size.frac > 0.35 ? 9 : 4), 0, 100);

    if (s.flags.hasTraded) s.flags.tradedTwice = true;
    s.flags.hasTraded = true;
    if (size.frac >= 0.42) s.flags.tradedBig = true;
    if (size.leveraged) s.flags.usedMargin = true;

    out.push({ kind: 'info', text: (t.dir === 'short' ? 'Short ' : 'Long ') + shares.toLocaleString() +
               ' HALX @ ' + U.px(px) + ' — ' + size.label });

    if (s.evidence.E08 === 'unknown' && (size.frac >= 0.42 || s.flags.tradedTwice)) {
      s.evidence.E08 = 'verified';
      out.push({ kind: 'bad', text: 'Your own book is now part of the story', evidence: 'E08' });
    }
    return out;
  };

  LC.closePosition = function (s, stopped) {
    s = s || LC.state;
    const out = [];
    if (!s.position) return out;
    const pnl = LC.openPnl(s), held = s.position.shares;
    s.capital += pnl; s.realized += pnl; s.position = null;
    out.push({ kind: pnl >= 0 ? 'good' : 'bad',
               text: 'Closed ' + held.toLocaleString() + ' shares — ' + U.money(pnl, { sign: true }) });
    if (stopped) {
      s.integrity = U.clamp(s.integrity + 5, 0, 100);
      out.push({ kind: 'good', text: 'Account integrity +5 — you honoured the stop', meter: 'integrity' });
    }
    s.composure = U.clamp(s.composure + (pnl < 0 ? -8 : 6), 0, 100);
    return out;
  };

  /* mark the book at each boundary; drawdown erodes the account */
  LC.settlePhase = function (s) {
    s = s || LC.state;
    const out = [];
    if (!s.position) return out;
    const dd = LC.openPnl(s) / Math.max(1, s.capital);
    if (dd < -0.12) {
      const hit = dd < -0.3 ? -12 : -6;
      s.integrity = U.clamp(s.integrity + hit, 0, 100);
      s.composure = U.clamp(s.composure - 10, 0, 100);
      out.push({ kind: 'bad', text: 'Drawdown is eating the account — integrity ' + hit, meter: 'integrity' });
    }
    if (s.position.leveraged) s.composure = U.clamp(s.composure - 6, 0, 100);
    return out;
  };

  /* ---------------- the clock ---------------- */
  LC.focusFor = function (s) {
    const p = LC.phase(s);
    let f = p.focus;
    if (s.flags.riskSheet) f += 1;
    if (s.composure <= 34) f -= 1;
    if (s.composure <= 14) f -= 1;
    if (s.integrity >= 80) f += 1;
    return Math.max(1, f);
  };

  LC.enterPhase = function (s, index) {
    s = s || LC.state;
    s.phase = U.clamp(index, 0, LC.PHASES.length - 1);
    s.focus = LC.focusFor(s);
    s.focusMax = s.focus;
    return LC.PHASES[s.phase];
  };

  /* ---------------- save / prefs / ledger ---------------- */
  LC.storageOK = true;
  LC.save = function () {
    if (!LC.state) return;
    LC.storageOK = U.store.set(SAVE_KEY, LC.state);
  };
  LC.loadSave = function () {
    const raw = U.store.get(SAVE_KEY, null);
    return (raw && raw.v === 2 && raw.node) ? raw : null;
  };
  LC.clearSave = () => U.store.del(SAVE_KEY);
  LC.hasSave = () => !!LC.loadSave();

  LC.prefs = function () {
    return Object.assign({ audio: false, speed: 'cinematic', timers: true, motion: 'auto' },
                         U.store.get(PREF_KEY, {}));
  };
  LC.setPrefs = (p) => U.store.set(PREF_KEY, Object.assign(LC.prefs(), p));

  LC.ledger = () => U.store.get(LEDGER_KEY, {});
  LC.recordEnding = function (id) {
    const l = LC.ledger();
    l[id] = (l[id] || 0) + 1;
    U.store.set(LEDGER_KEY, l);
  };

  /* export / import so a run survives a browser that refuses storage */
  LC.exportSave = () => btoa(unescape(encodeURIComponent(JSON.stringify(LC.state))));
  LC.importSave = function (blob) {
    try {
      const s = JSON.parse(decodeURIComponent(escape(atob(blob.trim()))));
      if (!s || s.v !== 2 || !s.node) return null;
      return s;
    } catch (e) { return null; }
  };
})(window.LC);
