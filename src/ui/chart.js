/* ============================================================
   Chart renderer — candles, volume shelf, the last candle.
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;
  const view = { canvas:null, ctx:null, data:[], live:null, t:0, crash:0, w:0, h:0 };

  function resize() {
    const c = view.canvas; if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    view.w = c.clientWidth || 340; view.h = c.clientHeight || 232;
    c.width = Math.round(view.w * dpr); c.height = Math.round(view.h * dpr);
    view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  LC.chart = {
    mount(canvas) {
      view.canvas = canvas; view.ctx = canvas.getContext('2d');
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
    finale(target, ms) {
      if (!view.live) return;
      view.crashFrom = view.live.c; view.crashTo = target;
      view.crashT0 = performance.now(); view.crashMs = ms || 5200; view.crash = 1;
    },
    last() { return view.live ? view.live.c : 0; }
  };

  function loop() {
    view.t++;
    if (view.live) {
      if (view.crash) {
        const k = U.clamp((performance.now() - view.crashT0) / view.crashMs, 0, 1);
        const eased = 1 - Math.pow(1 - k, 2.6);
        const jitter = Math.abs(view.crashFrom - view.crashTo) * 0.03 * (1 - k);
        view.live.c = U.lerp(view.crashFrom, view.crashTo, eased) + (Math.random() - 0.5) * jitter;
        view.live.l = Math.min(view.live.l, view.live.c);
        view.live.h = Math.max(view.live.h, view.crashFrom);
      } else if (!U.reduceMotion()) {
        const base = view.data.length ? view.data[view.data.length - 1].c : 1;
        const w = base * 0.0035;
        view.live.c = base + Math.sin(view.t / 9) * w + (Math.random() - 0.5) * w;
        view.live.h = Math.max(view.live.h, view.live.c);
        view.live.l = Math.min(view.live.l, view.live.c);
      }
      draw();
      if (LC.chart.onTick) LC.chart.onTick(view.live.c);
    }
    setTimeout(() => requestAnimationFrame(loop), U.reduceMotion() ? 900 : 95);
  }

  function draw() {
    const ctx = view.ctx;
    if (!ctx || !view.data.length) return;
    const w = view.w, h = view.h, padT = 14, padB = 24, padR = 52, padL = 8;
    ctx.clearRect(0, 0, w, h);

    const rows = view.data.slice();
    if (view.live) rows[rows.length - 1] = view.live;

    let hi = -Infinity, lo = Infinity;
    rows.forEach(d => { hi = Math.max(hi, d.h); lo = Math.min(lo, d.l); });
    const span = Math.max(0.05, hi - lo);
    hi += span * 0.08; lo -= span * 0.08;
    const y = p => padT + (hi - p) / (hi - lo) * (h - padT - padB);
    const cw = (w - padL - padR) / rows.length;

    ctx.font = '10px ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const p = lo + (hi - lo) * (i / 4), yy = Math.round(y(p)) + 0.5;
      ctx.strokeStyle = 'rgba(150,180,220,.07)';
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(w - padR, yy); ctx.stroke();
      ctx.fillStyle = 'rgba(120,140,170,.55)';
      ctx.fillText('$' + p.toFixed(2), w - padR + 7, yy);
    }

    let prev = rows[0].phase;
    rows.forEach((d, i) => {
      if (d.phase === prev) return;
      const x = Math.round(padL + i * cw) + 0.5;
      ctx.strokeStyle = 'rgba(150,180,220,.13)'; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, h - padB); ctx.stroke();
      ctx.setLineDash([]); prev = d.phase;
    });

    rows.forEach((d, i) => {
      const x = padL + i * cw;
      ctx.fillStyle = d.c >= d.o ? 'rgba(61,220,151,.16)' : 'rgba(255,90,106,.16)';
      ctx.fillRect(x + cw * 0.16, h - padB + 4, Math.max(1, cw * 0.68), d.v * (padB - 8) * 0.6);
    });

    rows.forEach((d, i) => {
      const x = padL + i * cw + cw / 2, up = d.c >= d.o, isLast = i === rows.length - 1;
      ctx.strokeStyle = up ? 'rgba(61,220,151,.85)' : 'rgba(255,90,106,.85)';
      ctx.fillStyle   = up ? 'rgba(61,220,151,.75)' : 'rgba(255,90,106,.75)';
      if (isLast) {
        ctx.shadowColor = up ? 'rgba(61,220,151,.85)' : 'rgba(255,90,106,.9)';
        ctx.shadowBlur = 14;
        ctx.strokeStyle = up ? '#7dffc4' : '#ff8a95';
        ctx.fillStyle   = up ? '#7dffc4' : '#ff8a95';
      }
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, y(d.h)); ctx.lineTo(x, y(d.l)); ctx.stroke();
      ctx.fillRect(x - cw * 0.32, y(Math.max(d.o, d.c)),
                   Math.max(1.2, cw * 0.64), Math.max(1.2, Math.abs(y(d.c) - y(d.o))));
      ctx.shadowBlur = 0;
    });

    const last = rows[rows.length - 1], ly = Math.round(y(last.c)) + 0.5;
    ctx.strokeStyle = 'rgba(240,162,74,.6)'; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(padL, ly); ctx.lineTo(w - padR, ly); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(240,162,74,.95)';
    ctx.fillRect(w - padR + 2, ly - 8, padR - 4, 16);
    ctx.fillStyle = '#150c02'; ctx.font = '600 10px ui-monospace, monospace';
    ctx.fillText(last.c.toFixed(2), w - padR + 7, ly);
  }
})(window.LC);
