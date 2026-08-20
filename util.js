/* ============================================================
   THE LAST CANDLE — utilities
   Namespace: window.LC
   ============================================================ */
window.LC = window.LC || {};

(function (LC) {
  'use strict';

  /* ---------- dom ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      }
    }
    (Array.isArray(children) ? children : children == null ? [] : [children])
      .forEach((c) => { if (c != null && c !== false) node.append(c.nodeType ? c : document.createTextNode(c)); });
    return node;
  }

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- deterministic pseudo-random ---------- */
  function seeded(seed) {
    let s = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
    s = s || 1;
    return function rand() {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  /* ---------- formatting ---------- */
  function money(n, opts) {
    const o = opts || {};
    const sign = n < 0 ? '-' : (o.sign && n > 0 ? '+' : '');
    const abs = Math.abs(Math.round(n));
    return sign + '$' + abs.toLocaleString('en-US');
  }
  const px = (n) => '$' + n.toFixed(2);
  const pct = (n) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

  /* ---------- misc ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initials(name) {
    return name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  }

  /* deterministic pastel-ish avatar colour from a string */
  function hueOf(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) % 360;
    return h;
  }
  function avatarStyle(seed, color) {
    if (color) return { background: `linear-gradient(150deg, ${color}, ${color}aa)` };
    const h = hueOf(seed);
    return { background: `linear-gradient(150deg, hsl(${h} 62% 66%), hsl(${(h + 40) % 360} 58% 48%))` };
  }

  /* localStorage that never throws (private mode, file://, quota) */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    del(key) { try { localStorage.removeItem(key); } catch (e) {} }
  };

  LC.util = { $, $$, el, clamp, lerp, seeded, money, px, pct, sleep, reduceMotion, initials, hueOf, avatarStyle, store };
})(window.LC);
