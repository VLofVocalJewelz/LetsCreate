/* ============================================================
   UI — the desk. HUD, stage, choices, map, toasts.
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util, $ = U.$, el = U.el;

  const SPEED = { instant: 0, fast: 8, cinematic: 18 };
  let typing = null;

  LC.ui = {

    /* ---------------- top bar / clock ---------------- */
    clockrail() {
      const host = $('#clockrail'); if (!host) return;
      const s = LC.state, cur = LC.phase(s);
      host.innerHTML = '';
      host.append(el('span', { class: 'crday', text: 'DAY ' + cur.day + ' / 3' }));
      LC.PHASES.filter((p) => p.day === cur.day).forEach((p) => {
        const i = LC.phaseIndexById(p.id);
        const cls = i < s.phase ? 'is-done' : (i === s.phase ? 'is-now' : '');
        host.append(el('span', { class: 'crseg ' + cls },
          [el('span', { class: 'crseg__dot' }), p.name]));
      });
    },

    tape() {
      const s = LC.state, t = LC.TAPE[LC.phase(s).id] || {};
      const px = LC.chart.last() || t.c || 0;
      const chg = t.o ? ((px - t.o) / t.o) * 100 : 0;
      const set = (id, txt, cls) => {
        const n = document.getElementById(id); if (!n) return;
        n.textContent = txt;
        if (cls != null) n.className = cls;
      };
      set('tapechip-px', U.px(px));
      set('tapechip-chg', U.pct(chg), 'tapechip__chg ' + (chg >= 0 ? 'up' : 'down'));
      set('tape-last', U.px(px));
      set('tape-chg', U.pct(chg) + ' · vol ' + (t.vol || '—'), 'tapehead__chg ' + (chg >= 0 ? 'up' : 'down'));
      const foot = $('#tape-foot'); if (foot) foot.textContent = LC.tapeNote(LC.phase(s).id);
    },

    /* ---------------- left rail ---------------- */
    hud() {
      const s = LC.state;
      const eq = LC.equity(s), pnl = LC.openPnl(s);
      $('#hud-capital').textContent = U.money(eq);
      const d = eq - s.startCapital;
      const dEl = $('#hud-capital-delta');
      dEl.textContent = (d === 0 ? 'flat on the week' : U.money(d, { sign: true }) + ' on the week');
      dEl.className = 'acct__delta ' + (d > 0 ? 'up' : d < 0 ? 'down' : '');

      const pos = $('#hud-position');
      if (s.position) {
        const p = s.position;
        pos.textContent = (p.dir === 'short' ? 'SHORT ' : 'LONG ') + p.shares.toLocaleString() +
          ' @ ' + U.px(p.avg) + '  ·  ' + U.money(pnl, { sign: true }) +
          (p.leveraged ? '  ·  MARGIN' : '');
        pos.className = 'acct__pos' + (p.leveraged || pnl < -eq * 0.1 ? ' is-hot' : '');
      } else {
        pos.textContent = 'Flat — no open risk';
        pos.className = 'acct__pos';
      }

      const meters = [
        ['integrity', 'Account integrity', 'Sizing, stops, and whether your book is defensible.'],
        ['credibility', 'Credibility', 'Whether your word would carry weight tomorrow.'],
        ['composure', 'Composure', 'Low composure costs you a Focus every session.']
      ];
      const host = $('#hud-meters'); host.innerHTML = '';
      meters.forEach(([k, name, note]) => {
        const v = Math.round(s[k]);
        host.append(el('div', { class: 'meter' + (v <= 25 ? ' is-low' : ''), 'data-meter': k }, [
          el('div', { class: 'meter__head' }, [
            el('span', { class: 'meter__name', text: name }),
            el('span', { class: 'meter__val', text: v })
          ]),
          el('div', { class: 'meter__track' }, [
            el('div', { class: 'meter__fill meter__fill--' + k, style: { width: v + '%' } })
          ]),
          v <= 25 ? el('div', { class: 'meter__note', text: note }) : null
        ]));
      });

      const people = $('#hud-people'); people.innerHTML = '';
      LC.CAST_ORDER.concat(s.rel.marisol > 0 ? ['marisol'] : []).forEach((id) => {
        const c = LC.CAST[id], v = Math.round(s.rel[id]);
        people.append(el('li', { class: 'person' }, [
          el('div', { class: 'avatar', style: U.avatarStyle(c.name, c.color), text: U.initials(c.name) }),
          el('div', { class: 'person__body' }, [
            el('div', { class: 'person__name' }, [c.short, el('span', { class: 'person__tag', text: v })]),
            el('div', { class: 'person__role', text: LC.relLabel(id, v) }),
            el('div', { class: 'person__track' }, [
              el('div', { class: 'person__fill', style: { width: v + '%', background: c.color } })
            ])
          ])
        ]));
      });

      const focus = $('#hud-focus'); focus.innerHTML = '';
      for (let i = 0; i < Math.max(s.focusMax, s.focus); i++) {
        focus.append(el('div', { class: 'pip' + (i < s.focus ? ' is-lit' : '') }));
      }

      const obj = $('#hud-objective');
      if (obj) obj.textContent = LC.objective(s);

      const stat = $('#board-stat');
      if (stat) stat.textContent = LC.verifiedCount(s) + ' verified · ' + LC.heldCount(s) + ' unconfirmed';
      const bDot = $('#board-dot');
      if (bDot) bDot.hidden = LC.heldCount(s) === 0;
    },

    /* ---------------- location map ---------------- */
    map() {
      const host = $('#locmap'); if (!host) return;
      const s = LC.state;
      host.innerHTML = '';
      LC.LOC_ORDER.forEach((id) => {
        const L = LC.LOCATIONS[id], open = LC.locOpen(id, s), here = s.at === id;
        host.append(el('button', {
          class: 'loc' + (here ? ' is-here' : '') + (open ? '' : ' is-locked'),
          disabled: !open || here, title: open ? L.sub : L.lockHint,
          'aria-current': here ? 'true' : null,
          onclick: () => LC.game.travel(id)
        }, [
          el('span', { class: 'loc__dot', style: { background: open ? L.tint : 'transparent', borderColor: L.tint } }),
          el('span', { class: 'loc__name', text: L.name }),
          open ? null : el('span', { class: 'loc__lock', text: '🔒' })
        ]));
      });
    },

    /* ---------------- stage ---------------- */
    scene(node) {
      const s = LC.state;
      const stage = $('#stage-scroll');
      const prose = $('#scene-prose'), choices = $('#scene-choices'), slug = $('#scene-slug');
      if (typing) { clearTimeout(typing); typing = null; }
      prose.innerHTML = ''; choices.innerHTML = '';

      const p = LC.phase(s), loc = LC.LOCATIONS[node.at || s.at] || LC.LOCATIONS.desk;
      slug.innerHTML = '';
      slug.append(
        el('span', { text: 'Day ' + p.day }),
        el('span', { class: 'slug__clock', text: p.clock }),
        el('span', { text: p.name }),
        el('span', { class: 'slug__rule' }),
        el('span', { text: loc.name })
      );

      document.body.classList.toggle('is-hinge', node.kind === 'hinge');
      document.body.classList.toggle('is-tense', p.day === 3 || s.composure < 30);

      if (node.kind === 'hinge') {
        prose.append(el('div', { class: 'hingemark' }, [
          el('div', { class: 'hingemark__label', text: 'This one does not come back' }),
          node.title ? el('h2', { class: 'hingemark__title', text: node.title }) : null
        ]));
      }

      const blocks = (node.text || []).map((t) => this.block(t));
      const speed = SPEED[LC.prefs().speed] != null ? SPEED[LC.prefs().speed] : SPEED.cinematic;
      if (speed === 0 || U.reduceMotion()) {
        blocks.forEach((b) => prose.append(b));
        this.choices(node, choices);
      } else {
        let i = 0;
        const step = () => {
          if (i >= blocks.length) { this.choices(node, choices); return; }
          const b = blocks[i++];
          b.classList.add('fadein');
          prose.append(b);
          typing = setTimeout(step, speed * 14);
        };
        step();
      }
      stage.scrollTop = 0;
    },

    block(t) {
      if (typeof t === 'string') return el('p', { html: md(t) });
      if (t.lede) return el('p', { class: 'lede', html: md(t.lede) });
      if (t.beat) return el('p', { class: 'beat', html: md(t.beat) });
      if (t.sys) return el('div', { class: 'sysbox sysbox--' + (t.kind || 'doc'), text: t.sys });
      if (t.s) {
        const c = LC.speaker(t.s);
        const anon = t.s === 'candlewick';
        return el('div', { class: 'line' + (anon ? ' line--anon' : '') + (t.s === 'you' ? ' line--you' : '') }, [
          el('div', { class: 'line__av', style: U.avatarStyle(c.name, c.color), text: anon ? '?' : U.initials(c.name) }),
          el('div', {}, [
            el('div', { class: 'line__who', text: c.name }),
            el('div', { class: 'line__txt', html: md(t.t) })
          ])
        ]);
      }
      return el('p', { text: String(t) });
    },

    choices(node, host) {
      const s = LC.state;
      let list = (node.choices || []).slice();

      if (node.back) {
        const backTo = typeof node.back === 'string' ? node.back : s.at;
        list.push({ label: 'Back to ' + LC.LOCATIONS[backTo].name, to: 'BACK:' + backTo, tone: 'ember', group: 'advance' });
      }

      const groups = [[null, list.filter((c) => !c.group)],
                      ['Elsewhere', list.filter((c) => c.group === 'travel')],
                      [null, list.filter((c) => c.group === 'advance')]];

      if (node.choicesHead) host.append(el('div', { class: 'choices__head', text: node.choicesHead }));

      groups.forEach(([head, arr]) => {
        if (!arr.length) return;
        if (head) host.append(el('div', { class: 'choices__head', text: head }));
        arr.forEach((c, i) => {
          const gate = c.locked != null ? { ok: !c.locked, why: c.lockWhy } : LC.meets(c.req, s);
          const cost = c.cost || 0;
          const poor = cost > s.focus;
          const disabled = !gate.ok || poor;
          const btn = el('button', {
            class: 'choice choice--' + (c.tone || 'safe') + (c.advance ? ' choice--advance' : '') + (disabled ? ' is-locked' : ''),
            disabled: disabled || null,
            onclick: () => LC.game.choose(c, node)
          }, [
            el('div', { class: 'choice__label', text: c.label }),
            (disabled ? (gate.why || 'No focus left this session') : c.detail)
              ? el('div', { class: 'choice__detail', text: disabled ? (gate.why || 'No focus left this session') : c.detail })
              : null,
            (cost || c.tone) ? el('div', { class: 'choice__meta' }, [
              cost ? el('span', { class: 'chip chip--cost', text: cost + ' focus' }) : null,
              c.tone === 'risk' ? el('span', { class: 'chip chip--risk', text: 'risk' }) : null,
              c.tone === 'evidence' ? el('span', { class: 'chip chip--evi', text: 'evidence' }) : null,
              c.tone === 'social' ? el('span', { class: 'chip chip--rel', text: 'people' }) : null
            ]) : null
          ]);
          host.append(btn);
        });
      });

      const first = host.querySelector('.choice:not([disabled])');
      if (first) first.focus({ preventScroll: true });
    },

    /* ---------------- toasts ---------------- */
    toast(items) {
      const host = $('#toasts'); if (!host) return;
      (Array.isArray(items) ? items : [items]).forEach((t, i) => {
        setTimeout(() => {
          const n = el('div', { class: 'toast toast--' + (t.kind || 'info'), text: t.text });
          host.append(n);
          if (LC.audio.isOn()) LC.audio.blip(t.kind);
          if (t.meter) {
            const m = document.querySelector('[data-meter="' + t.meter + '"]');
            if (m) { m.classList.add('flash'); setTimeout(() => m.classList.remove('flash'), 900); }
          }
          setTimeout(() => { n.classList.add('is-out'); setTimeout(() => n.remove(), 420); }, 3600);
        }, i * 260);
      });
    },

    markTab(name) {
      const dot = document.getElementById(name + '-dot');
      if (dot && !document.querySelector('.tab[data-tab="' + name + '"]').classList.contains('is-active')) dot.hidden = false;
    },

    sheet(title, html) {
      $('#overlay-title').textContent = title;
      $('#overlay-body').innerHTML = html;
      $('#overlay').hidden = false;
    },
    closeSheet() { $('#overlay').hidden = true; },

    all() { this.hud(); this.clockrail(); this.tape(); this.map(); LC.board.render(); }
  };

  /* tiny markdown: *emphasis* only */
  function md(t) {
    return String(t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }
  LC.md = md;
})(window.LC);
