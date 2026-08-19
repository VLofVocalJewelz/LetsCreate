/* ============================================================
   The evidence board — cards, statuses, and red string
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  const LABEL = { held: 'unconfirmed', verified: 'verified', debunked: 'does not hold' };

  LC.board = {
    render() {
      const host = document.getElementById('board');
      const lines = document.getElementById('boardlines');
      const stat = document.getElementById('board-stat');
      if (!host) return;
      const s = LC.state;
      host.innerHTML = '';
      if (lines) lines.innerHTML = '';

      const present = LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] !== 'unknown');
      if (stat) {
        const v = LC.verifiedCount(s);
        stat.textContent = v + ' verified · ' + LC.heldCount(s) + ' unconfirmed';
      }

      if (!present.length) {
        host.append(U.el('div', { class: 'board__empty' },
          'Nothing pinned yet. Screenshots are not evidence. Claims are not evidence. ' +
          'A thing becomes evidence when you can show where it came from and prove it has not been edited.'));
        return;
      }

      const nodes = {};
      present.forEach((id) => {
        const e = LC.EVIDENCE[id];
        const st = s.evidence[id];
        const card = U.el('article', {
          class: 'ecard' + (st === 'verified' ? ' is-verified' : '') + (st === 'debunked' ? ' is-debunked' : ''),
          'data-e': id,
          tabindex: '0',
          title: e.detail
        }, [
          U.el('span', { class: 'ecard__pin' }),
          U.el('div', { class: 'ecard__code', text: e.code + (e.counter ? ' · against you' : '') }),
          U.el('h3', { class: 'ecard__name', text: e.name }),
          U.el('p', { class: 'ecard__desc', text: e.desc }),
          U.el('div', { class: 'ecard__foot' }, [
            U.el('span', { class: 'ecard__status st-' + st, text: LABEL[st] || st }),
            U.el('span', { class: 'ecard__code', text: e.hot ? 'handle with care' : (e.forgeable && st === 'held' ? 'source unproven' : '') })
          ])
        ]);
        card.addEventListener('click', () => LC.ui.sheet(e.code + ' · ' + e.name,
          '<p>' + e.detail + '</p><p style="color:var(--text-4);font-size:12px">Status: ' + (LABEL[st] || st) + '</p>'));
        host.append(card);
        nodes[id] = card;
      });

      /* red string between connected, present items */
      requestAnimationFrame(() => {
        if (!lines) return;
        const wrap = lines.parentElement.getBoundingClientRect();
        const drawn = {};
        present.forEach((id) => {
          (LC.EVIDENCE[id].links || []).forEach((other) => {
            if (!nodes[other]) return;
            const key = [id, other].sort().join('-');
            if (drawn[key]) return;
            drawn[key] = 1;
            const a = nodes[id].getBoundingClientRect();
            const b = nodes[other].getBoundingClientRect();
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', a.left - wrap.left + 14);
            line.setAttribute('y1', a.top - wrap.top + a.height / 2);
            line.setAttribute('x2', b.left - wrap.left + 14);
            line.setAttribute('y2', b.top - wrap.top + b.height / 2);
            lines.append(line);
          });
        });
      });
    }
  };
})(window.LC);
