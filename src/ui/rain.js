/* ============================================================
   Rain on the window behind the monitors
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  LC.rain = { start(canvasId) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    let w = 0, h = 0, dpr = 1, drops = [], streaks = [], running = true;

    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(180, (w * h) / 11000));
      drops = Array.from({ length: n }, () => spawn(true));
      streaks = Array.from({ length: Math.round(n / 7) }, () => ({
        x: Math.random() * w, y: Math.random() * h, len: 20 + Math.random() * 90,
        v: 0.25 + Math.random() * 0.7, a: 0.05 + Math.random() * 0.1, wob: Math.random() * 6
      }));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -20,
        len: 8 + Math.random() * 22,
        v: 3.6 + Math.random() * 7,
        a: 0.06 + Math.random() * 0.24,
        drift: (Math.random() - 0.5) * 0.7
      };
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      /* slow condensation streaks on the glass */
      streaks.forEach((s) => {
        s.y += s.v;
        if (s.y - s.len > h) { s.y = -s.len; s.x = Math.random() * w; }
        const g = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
        g.addColorStop(0, 'rgba(160,200,255,0)');
        g.addColorStop(1, 'rgba(180,215,255,' + s.a + ')');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x + Math.sin(s.y / 40) * s.wob, s.y - s.len);
        ctx.lineTo(s.x, s.y); ctx.stroke();
      });
      /* falling rain */
      ctx.lineWidth = 1;
      drops.forEach((d, i) => {
        d.y += d.v; d.x += d.drift;
        if (d.y > h + 20) drops[i] = spawn(false);
        ctx.strokeStyle = 'rgba(190,220,255,' + d.a + ')';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.drift * 2.2, d.y - d.len);
        ctx.stroke();
      });
      requestAnimationFrame(frame);
    }

    size();
    window.addEventListener('resize', size);
    if (U.reduceMotion()) {
      /* one static frame, no motion */
      ctx.clearRect(0, 0, w, h);
      drops.forEach((d) => {
        ctx.strokeStyle = 'rgba(190,220,255,' + d.a * 0.7 + ')';
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y - d.len); ctx.stroke();
      });
      running = false;
    } else frame();
  } };
})(window.LC);
