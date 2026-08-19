/* ============================================================
   The tape — HALX / Halcyon Exogrid Inc. (fictional)
   A drawn simulation. No real market data, no real ticker.
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  /* open / high / low / close per session, plus what the tape "says" */
  LC.TAPE = {
    d1_premarket: { o:2.98, h:4.62, l:2.95, c:4.35, vol:'1.2M', note:'Gapping 46% on a contract announcement. Volume is already twice a normal full session.' },
    d1_open:      { o:4.35, h:6.42, l:4.02, c:5.90, vol:'9.4M', note:'Two-dollar range in eleven minutes. The book is paper thin under 5.' },
    d1_midday:    { o:5.90, h:6.05, l:5.18, c:5.42, vol:'3.1M', note:'Bleeding sideways. This is where the impatient give their money away.' },
    d1_power:     { o:5.42, h:6.48, l:5.30, c:6.31, vol:'6.8M', note:'Bid stepped up at 15:20 like someone flipped a switch.' },
    d1_after:     { o:6.31, h:6.70, l:6.20, c:6.55, vol:'0.4M', note:'Held the day\'s gain into the close. Nobody sold. That is not normal.' },

    d2_premarket: { o:6.55, h:7.95, l:6.48, c:7.80, vol:'2.0M', note:'Up again pre-market on a second release with almost no new information in it.' },
    d2_open:      { o:7.80, h:8.60, l:6.11, c:6.94, vol:'14.2M', note:'Halted for volatility at 09:52. Reopened four percent lower and kept going.' },
    d2_midday:    { o:6.94, h:7.40, l:6.72, c:7.25, vol:'4.4M', note:'Grinding back. Every dip bought within ninety seconds by the same size.' },
    d2_power:     { o:7.25, h:8.61, l:7.18, c:8.55, vol:'8.9M', note:'Vertical into the close on no news at all.' },
    d2_after:     { o:8.55, h:8.75, l:8.28, c:8.40, vol:'0.6M', note:'Flat after hours. Somebody is holding the price still on purpose.' },

    d3_premarket: { o:8.40, h:9.70, l:8.35, c:9.60, vol:'2.6M', note:'The room is calling for twelve by lunch. The float has not changed. Yet.' },
    d3_open:      { o:9.60, h:11.85, l:9.05, c:11.20, vol:'18.7M', note:'Parabolic. Spreads are a nightmare. This is the part people remember wrong.' },
    d3_midday:    { o:11.20, h:11.45, l:10.30, c:10.62, vol:'6.2M', note:'First lower high of the entire move. Distribution, if you want to see it.' },
    d3_power:     { o:10.62, h:12.05, l:10.44, c:11.90, vol:'11.4M', note:'Squeezed into the bell. Lockup expires at this close. The floor goes away tonight.' },
    d3_after:     { o:11.90, h:12.40, l:11.62, c:11.98, vol:'0.9M', note:'Thin, wide, and waiting. Something is scheduled for 16:15.' }
  };

  LC.priceAt = function (phaseId) {
    const t = LC.TAPE[phaseId];
    return t ? t.c : 0;
  };
  LC.tapeNote = function (phaseId) {
    const t = LC.TAPE[phaseId];
    return t ? t.note : '';
  };

  /* ---------- candle generation (deterministic per session) ---------- */
  const PER = 22;
  function sessionCandles(phaseId) {
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
      let c = o + drift + shock;
      c = U.clamp(c, t.l, t.h);
      const wickUp = rand() * range * 0.8;
      const wickDn = rand() * range * 0.8;
      out.push({
        o, c,
        h: U.clamp(Math.max(o, c) + wickUp, t.l, t.h + 0.001),
        l: U.clamp(Math.min(o, c) - wickDn, t.l - 0.001, t.h),
        v: 0.35 + rand() * 0.65,
        phase: phaseId
      });
      px = c;
    }
    /* force the session to close exactly on the authored close */
    const last = out[out.length - 1];
    last.c = t.c;
    last.h = Math.max(last.h, t.c);
    last.l = Math.min(last.l, t.c);
    return out;
  }

  const cache = {};
  LC.seriesTo = function (phaseIndex) {
    const key = 'k' + phaseIndex;
    if (cache[key]) return cache[key];
    let all = [];
    for (let i = 0; i <= phaseIndex; i++) all = all.concat(sessionCandles(LC.PHASES[i].id));
    cache[key] = all;
    return all;
  };

  /* ---------- renderer ---------- */
  const view = { canvas: null, ctx: null, data: [], live: null, raf: 0, t: 0, crash: 0 };

  function resize() {
    const c = view.canvas;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth || 340;
    const h = c.clientHeight || 240;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    view.w = w; view.h = h;
  }

  LC.chart = {
    mount(canvas) {
      view.canvas = canvas;
      view.ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', () => { resize(); draw(); });
      loop();
    },
    update(phaseIndex) {
      const all = LC.seriesTo(phaseIndex);
      view.data = all.slice(Math.max(0, all.length - 64));
      view.live = view.data.length ? Object.assign({}, view.data[view.data.length - 1]) : null;
      view.crash = 0;
      draw();
    },
    /* the last candle: a scripted after-hours print used by the finale */
    finale(targetPrice, ms) {
      const from = view.live ? view.live.c : targetPrice;
      const t0 = performance.now();
      view.crashFrom = from;
      view.crashTo = targetPrice;
      view.crashT0 = t0;
      view.crashMs = ms || 4200;
      view.crash = 1;
    }
  };

  function loop() {
    view.t += 1;
    if (view.live) {
      if (view.crash) {
        const k = U.clamp((performance.now() - view.crashT0) / view.crashMs, 0, 1);
        const eased = 1 - Math.pow(1 - k, 2.4);
        const target = U.lerp(view.crashFrom, view.crashTo, eased);
        view.live.c = target + (Math.random() - 0.5) * Math.abs(view.crashFrom - view.crashTo) * 0.03 * (1 - k);
        view.live.l = Math.min(view.live.l, view.live.c);
        view.live.h = Math.max(view.live.h, view.crashFrom);
      } else if (!U.reduceMotion()) {
        const base = view.data.length ? view.data[view.data.length - 1].c : 1;
        const wob = base * 0.0035;
        view.live.c = base + Math.sin(view.t / 9) * wob + (Math.random() - 0.5) * wob;
        view.live.h = Math.max(view.live.h, view.live.c);
        view.live.l = Math.min(view.live.l, view.live.c);
      }
      draw();
      if (LC.chart.onTick) LC.chart.onTick(view.live.c);
    }
    view.raf = requestAnimationFrame(() => setTimeout(loop, U.reduceMotion() ? 900 : 90));
  }

  function draw() {
    const ctx = view.ctx;
    if (!ctx || !view.data.length) return;
    const w = view.w, h = view.h;
    const padT = 14, padB = 26, padR = 52, padL = 8;
    ctx.clearRect(0, 0, w, h);

    const rows = view.data.slice();
    if (view.live) rows[rows.length - 1] = view.live;

    let hi = -Infinity, lo = Infinity;
    rows.forEach((d) => { hi = Math.max(hi, d.h); lo = Math.min(lo, d.l); });
    const span = Math.max(0.05, hi - lo);
    hi += span * 0.08; lo -= span * 0.08;
    const y = (p) => padT + (hi - p) / (hi - lo) * (h - padT - padB);
    const cw = (w - padL - padR) / rows.length;

    /* grid */
    ctx.strokeStyle = 'rgba(150,180,220,.07)';
    ctx.lineWidth = 1;
    ctx.font = '10px ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const p = lo + (hi - lo) * (i / 4);
      const yy = Math.round(y(p)) + 0.5;
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(w - padR, yy); ctx.stroke();
      ctx.fillStyle = 'rgba(120,140,170,.55)';
      ctx.fillText('$' + p.toFixed(2), w - padR + 7, yy);
    }

    /* session separators */
    let prev = rows[0].phase;
    rows.forEach((d, i) => {
      if (d.phase !== prev) {
        const x = Math.round(padL + i * cw) + 0.5;
        ctx.strokeStyle = 'rgba(150,180,220,.13)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, h - padB); ctx.stroke();
        ctx.setLineDash([]);
        prev = d.phase;
      }
    });

    /* volume shelf */
    rows.forEach((d, i) => {
      const x = padL + i * cw;
      const vh = d.v * (padB - 8);
      ctx.fillStyle = d.c >= d.o ? 'rgba(61,220,151,.16)' : 'rgba(255,90,106,.16)';
      ctx.fillRect(x + cw * 0.16, h - padB + 4, Math.max(1, cw * 0.68), vh * 0.6);
    });

    /* candles */
    rows.forEach((d, i) => {
      const x = padL + i * cw + cw / 2;
      const up = d.c >= d.o;
      const isLast = i === rows.length - 1;
      const body = Math.abs(y(d.c) - y(d.o));
      ctx.strokeStyle = up ? 'rgba(61,220,151,.85)' : 'rgba(255,90,106,.85)';
      ctx.fillStyle = up ? 'rgba(61,220,151,.75)' : 'rgba(255,90,106,.75)';
      if (isLast) {
        ctx.shadowColor = up ? 'rgba(61,220,151,.85)' : 'rgba(255,90,106,.9)';
        ctx.shadowBlur = 14;
        ctx.strokeStyle = up ? '#7dffc4' : '#ff8a95';
        ctx.fillStyle = up ? '#7dffc4' : '#ff8a95';
      }
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, y(d.h)); ctx.lineTo(x, y(d.l)); ctx.stroke();
      ctx.fillRect(x - cw * 0.32, y(Math.max(d.o, d.c)), Math.max(1.2, cw * 0.64), Math.max(1.2, body));
      ctx.shadowBlur = 0;
    });

    /* last price line */
    const last = rows[rows.length - 1];
    const ly = Math.round(y(last.c)) + 0.5;
    ctx.strokeStyle = 'rgba(240,162,74,.6)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(padL, ly); ctx.lineTo(w - padR, ly); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(240,162,74,.95)';
    ctx.fillRect(w - padR + 2, ly - 8, padR - 4, 16);
    ctx.fillStyle = '#150c02';
    ctx.font = '600 10px ui-monospace, monospace';
    ctx.fillText(last.c.toFixed(2), w - padR + 7, ly);
  }
})(window.LC);
