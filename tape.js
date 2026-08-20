/* ============================================================
   The tape — MB:HALX / Halcyon Exogrid Inc.
   A drawn simulation on the fictional Meridian Board. The path is
   authored and identical every playthrough: there is no market
   model here and nothing to optimise against.
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  LC.SYMBOL = 'HALX';
  LC.SYMBOL_FULL = 'MB:HALX';
  LC.EXCHANGE = 'Meridian Board';
  LC.COMPANY = 'Halcyon Exogrid Inc.';

  LC.TAPE = {
    d1_premarket: { o:2.98, h:4.62, l:2.95, c:4.35, vol:'1.2M', note:'Gapping 46% on a contract announcement. Volume already twice a normal full session.' },
    d1_open:      { o:4.35, h:6.42, l:4.02, c:5.90, vol:'9.4M', note:'Two-dollar range in eleven minutes. The book is paper thin under 5.' },
    d1_midday:    { o:5.90, h:6.05, l:5.18, c:5.42, vol:'3.1M', note:'Bleeding sideways. This is where the impatient give their money away.' },
    d1_power:     { o:5.42, h:6.48, l:5.30, c:6.31, vol:'6.8M', note:'The bid stepped up at 15:20 like somebody flipped a switch.' },
    d1_after:     { o:6.31, h:6.70, l:6.20, c:6.55, vol:'0.4M', note:'Held the whole gain into the close. Nobody sold. That is not normal.' },
    d2_premarket: { o:6.55, h:7.95, l:6.48, c:7.80, vol:'2.0M', note:'Up again on a second release with almost no new information in it.' },
    d2_open:      { o:7.80, h:8.60, l:6.11, c:6.94, vol:'14.2M', note:'Halted for volatility at 09:52. Reopened four percent lower and kept going.' },
    d2_midday:    { o:6.94, h:7.40, l:6.72, c:7.25, vol:'4.4M', note:'Grinding back. Every dip bought inside ninety seconds by the same size.' },
    d2_power:     { o:7.25, h:8.61, l:7.18, c:8.55, vol:'8.9M', note:'Vertical into the close on no news at all.' },
    d2_after:     { o:8.55, h:8.75, l:8.28, c:8.40, vol:'0.6M', note:'Flat after hours on heavy volume. Somebody is holding the price still.' },
    d3_premarket: { o:8.40, h:9.70, l:8.35, c:9.60, vol:'2.6M', note:'The room is calling for twelve by lunch. The float has not changed. Yet.' },
    d3_open:      { o:9.60, h:11.85, l:9.05, c:11.20, vol:'18.7M', note:'Parabolic. Spreads are a nightmare. This is the part people remember wrong.' },
    d3_midday:    { o:11.20, h:11.45, l:10.30, c:10.62, vol:'6.2M', note:'First lower high of the entire move. Distribution, if you want to see it.' },
    d3_power:     { o:10.62, h:12.05, l:10.44, c:11.90, vol:'11.4M', note:'Squeezed into the bell. Lockup expires at this close. The floor goes away tonight.' },
    d3_after:     { o:11.90, h:12.40, l:11.62, c:11.98, vol:'0.9M', note:'Thin, wide, and waiting. Something is scheduled for 16:15.' }
  };

  LC.FINAL_PRICE = 3.85;   /* where the last candle lands */

  LC.priceAt = (id) => (LC.TAPE[id] ? LC.TAPE[id].c : 0);
  LC.tapeNote = (id) => (LC.TAPE[id] ? LC.TAPE[id].note : '');

  /* deterministic candles: a seeded walk pinned to the authored OHLC */
  const PER = 22;
  function session(phaseId) {
    const t = LC.TAPE[phaseId];
    if (!t) return [];
    const rand = U.seeded(phaseId);
    const out = [];
    let px = t.o;
    const drift = (t.c - t.o) / PER;
    const range = Math.max(0.04, (t.h - t.l) / 7);
    for (let i = 0; i < PER; i++) {
      const o = px;
      const shock = (rand() - 0.48) * range * (i === 2 || i === Math.floor(PER * 0.6) ? 2.4 : 1);
      const c = U.clamp(o + drift + shock, t.l, t.h);
      out.push({
        o, c,
        h: U.clamp(Math.max(o, c) + rand() * range * 0.8, t.l, t.h + 0.001),
        l: U.clamp(Math.min(o, c) - rand() * range * 0.8, t.l - 0.001, t.h),
        v: 0.35 + rand() * 0.65, phase: phaseId
      });
      px = c;
    }
    const last = out[out.length - 1];
    last.c = t.c;
    last.h = Math.max(last.h, t.c);
    last.l = Math.min(last.l, t.c);
    return out;
  }

  const cache = {};
  LC.seriesTo = function (phaseIndex) {
    const k = 'k' + phaseIndex;
    if (cache[k]) return cache[k];
    let all = [];
    for (let i = 0; i <= phaseIndex; i++) all = all.concat(session(LC.PHASES[i].id));
    return (cache[k] = all);
  };
})(window.LC);
