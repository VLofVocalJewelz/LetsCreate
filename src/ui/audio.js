/* ============================================================
   Ambience — synthesised, no asset files. Off until asked for.
   ============================================================ */
(function (LC) {
  'use strict';
  let ctx = null, master = null, on = false, nodes = [];

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    /* rain: filtered white noise */
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
    const noise = ctx.createBufferSource();
    noise.buffer = buf; noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1150; bp.Q.value = 0.5;
    const ng = ctx.createGain(); ng.gain.value = 0.16;
    noise.connect(bp).connect(ng).connect(master);
    noise.start();

    /* room hum: two detuned low oscillators */
    [52, 78.2].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i ? 0.012 : 0.022;
      o.connect(g).connect(master); o.start();
      nodes.push(o);
    });
    nodes.push(noise);
    return true;
  }

  LC.audio = {
    toggle() {
      if (!ctx && !build()) return false;
      on = !on;
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.5 : 0, ctx.currentTime + 0.8);
      return on;
    },
    isOn() { return on; },
    /* short UI blips — only audible when ambience is on */
    blip(kind) {
      if (!on || !ctx) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      const f = kind === 'bad' ? 190 : kind === 'good' ? 640 : 420;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.value = 0.0001;
      o.connect(g).connect(master);
      const t = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.start(t); o.stop(t + 0.3);
    }
  };
})(window.LC);
