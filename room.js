/* ============================================================
   Room renderer — the chat feed, streaming in
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;
  const st = { host: null, timer: 0, clock: '' };

  function colorFor(handle) {
    const k = LC.MOD_COLORS[handle];
    if (!k) return null;
    return (LC.CAST[k] || LC.VOICES[k] || {}).color || null;
  }

  function render(msg, animate) {
    if (msg.kind === 'sys') {
      return U.el('div', { class: 'msg msg--sys' }, [U.el('div', { class: 'msg__txt', text: msg.text })]);
    }
    const anon = msg.kind === 'anon';
    const cls = 'msg' + (msg.kind === 'mod' ? ' msg--mod' : '') +
                (anon ? ' msg--anon' : '') + (msg.kind === 'dm' ? ' msg--dm' : '') +
                (msg.who === 'ori' ? ' msg--ori' : '');
    const node = U.el('div', { class: cls }, [
      U.el('div', { class: 'msg__av', style: anon ? {} : U.avatarStyle(msg.who, colorFor(msg.who)),
                    text: anon ? '?' : U.initials(msg.who) }),
      U.el('div', { class: 'msg__body' }, [
        U.el('div', { class: 'msg__who' }, [msg.who,
          U.el('span', { class: 'msg__time', text: msg.time || st.clock })]),
        U.el('div', { class: 'msg__txt', text: msg.text })
      ])
    ]);
    if (!animate) node.style.animation = 'none';
    return node;
  }

  LC.room = {
    mount(host) { st.host = host; },
    setPhase(phaseId) {
      if (!st.host) return;
      clearTimeout(st.timer);
      st.host.innerHTML = '';
      st.clock = (LC.phaseById(phaseId) || {}).clock || '';
      const data = LC.ROOM[phaseId] || { log: [], online: '—' };
      const el = document.getElementById('room-count');
      if (el) el.textContent = data.online + ' online';
      const fast = U.reduceMotion() || LC.prefs().speed === 'instant';
      let i = 0;
      const step = () => {
        if (i >= data.log.length) return;
        st.host.append(render(data.log[i], !fast));
        st.host.scrollTop = st.host.scrollHeight;
        i++;
        st.timer = setTimeout(step, fast ? 25 : 360 + Math.random() * 380);
      };
      step();
    },
    push(who, text, kind, time) {
      if (!st.host) return;
      st.host.append(render({ who, text, kind: kind || '', time }, true));
      st.host.scrollTop = st.host.scrollHeight;
      if (LC.ui && LC.ui.markTab) LC.ui.markTab('room');
    }
  };
})(window.LC);
