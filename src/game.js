/* ============================================================
   Game — boot, routing, choices, the finale
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util, $ = U.$, el = U.el;

  const OBJECTIVES = {
    premarket: 'Before the bell: decide how much risk you are willing to carry, and find one thing you can actually prove.',
    open: 'Survive the open. Watch who is trading, not what the chart is doing.',
    midday: 'The quiet hours. This is when verification happens or does not happen at all.',
    power: 'The last hour decides the day. Everything moves at twice speed.',
    after: 'The market is shut. The people are not.'
  };
  LC.objective = function (s) {
    const p = LC.phase(s);
    if (p.day === 3 && p.key === 'midday') return 'Choose your channel. Everything before this was preparation.';
    if (p.day === 3) return 'The lockup expires at today\'s close. Something is scheduled for 16:15.';
    return OBJECTIVES[p.key] || '';
  };

  LC.game = {

    /* ---------------- boot ---------------- */
    boot() {
      LC.rain.start('rain');
      LC.room.mount($('#chatlog'));
      LC.chart.mount($('#chart'));
      LC.chart.onTick = () => LC.ui.tape();

      const save = LC.loadSave();
      if (save) {
        const btn = $('[data-menu="continue"]');
        btn.disabled = false;
        const p = LC.PHASES[save.phase] || LC.PHASES[0];
        $('#continue-sub').textContent = 'Day ' + p.day + ' · ' + p.name + ' · ' + U.money(save.capital);
      }
      $('#endings-count').textContent = Object.keys(LC.ledger()).length;

      $$('[data-menu]').forEach((b) => b.addEventListener('click', () => {
        const k = b.dataset.menu;
        if (k === 'new') this.contentNote();
        if (k === 'continue') this.start(LC.loadSave());
        if (k === 'endings') LC.panels.endingsGallery();
        if (k === 'about') LC.panels.about();
      }));

      $('#overlay-close').addEventListener('click', () => LC.ui.closeSheet());
      $('#overlay').addEventListener('click', (e) => { if (e.target.id === 'overlay') LC.ui.closeSheet(); });

      $$('.tab').forEach((t) => t.addEventListener('click', () => this.tab(t.dataset.tab)));
      $('#btn-audio').addEventListener('click', (e) => {
        const on = LC.audio.toggle();
        e.currentTarget.setAttribute('aria-pressed', String(on));
        LC.setPrefs({ audio: on });
      });
      $('#btn-menu').addEventListener('click', () => document.body.classList.toggle('left-open'));
      $('#btn-inv').addEventListener('click', () => LC.panels.inventory());
      $('#btn-journal').addEventListener('click', () => LC.panels.journal());
      $('#btn-settings').addEventListener('click', () => LC.panels.settings());

      document.addEventListener('keydown', (e) => this.key(e));
    },

    contentNote() {
      LC.ui.sheet('Before you sit down',
        '<p style="font-size:15px"><b>The Last Candle is fiction.</b></p>' +
        '<p>Every company, ticker, exchange, platform, person and price in it is invented. Nothing here is financial advice, and none of it describes a real market or a real case.</p>' +
        '<p>It is a story about verification, pressure, and what being right costs.</p>' +
        '<div class="setrow" style="margin-top:22px"><button class="setbtn is-on" id="note-ok">Open the desk</button></div>');
      $('#note-ok').addEventListener('click', () => { LC.ui.closeSheet(); this.start(null); });
    },

    /* ---------------- session ---------------- */
    start(saved) {
      LC.state = saved || LC.newState();
      if (!saved) LC.enterPhase(LC.state, 0);
      if (LC.prefs().audio && !LC.audio.isOn()) {
        LC.audio.toggle();
        $('#btn-audio').setAttribute('aria-pressed', 'true');
      }
      $('#title-screen').classList.remove('is-active');
      $('#title-screen').hidden = true;
      $('#game-screen').hidden = false;
      $('#game-screen').classList.add('is-active');
      LC.chart.update(LC.state.phase);
      LC.room.setPhase(LC.phase(LC.state).id);
      this.render();
      if (!LC.storageOK) {
        LC.ui.toast({ kind: 'bad', text: 'This browser will not let the page save. Settings → copy your save code.' });
      }
    },

    render() {
      const node = LC.getNode(LC.state.node, LC.state);
      if (!node) { console.warn('missing node', LC.state.node); return; }
      LC.ui.all();
      LC.ui.scene(node);
    },

    /* ---------------- movement ---------------- */
    goto(id) {
      const s = LC.state;

      if (id === 'ENDING') return this.ending();
      if (id && id.indexOf('BACK') === 0) {
        const loc = id.indexOf(':') > 0 ? id.split(':')[1] : s.at;
        s.at = loc;
        return this.goto(LC.hubId(LC.phase(s).id, loc));
      }
      if (id && id.indexOf('VERIFY:') === 0) return this.verify(id.split(':')[1]);

      const node = LC.getNode(id, s);
      if (!node) { console.warn('missing node', id); return; }

      /* crossing into a new session settles the book and refills focus */
      if (node.phase && node.phase !== LC.phase(s).id) {
        LC.ui.toast(LC.settlePhase(s));
        LC.enterPhase(s, LC.phaseIndexById(node.phase));
        LC.chart.update(s.phase);
        LC.room.setPhase(node.phase);
        if (node.at) s.at = node.at;
      }

      /* actions cost attention and only happen once */
      if (node.kind === 'action') {
        if ((node.cost || 0) > s.focus) return;
        s.focus -= (node.cost || 0);
        if (node.once) s.used[id] = true;
      }
      if (node.at) s.at = node.at;

      s.node = id;
      if (node.hinge) { s.hinges[node.hinge] = true; LC.save(); }

      const fx = LC.applyFx(node.onEnter, s);
      LC.save();
      this.render();
      if (fx.length) LC.ui.toast(fx);
    },

    choose(c, node) {
      const s = LC.state;
      if (c.travel) return this.travel(c.travel);
      const fx = LC.applyFx(c.fx, s);
      if (fx.length) LC.ui.toast(fx);
      if (node && node.hinge && c.label) {
        s.journal.push({ phase: LC.phase(s).id, kind: 'hinge', text: (node.title || 'Hinge') + ' — ' + c.label });
      }
      this.goto(c.to);
    },

    travel(locId) {
      const s = LC.state;
      if (!LC.locOpen(locId, s)) return;
      s.at = locId;
      this.goto(LC.hubId(LC.phase(s).id, locId));
    },

    verify(evId) {
      const s = LC.state;
      const e = LC.EVIDENCE[evId];
      const cost = (e.verify && e.verify.cost) || 1;
      if (cost > s.focus) {
        LC.ui.toast({ kind: 'bad', text: 'Not enough focus left to do that properly.' });
        return this.goto('BACK');
      }
      s.focus -= cost;
      const r = LC.resolveVerify(evId, s);
      s.evidence[evId] = r.result === 'held' ? 'held' : r.result;
      s.journal.push({ phase: LC.phase(s).id, kind: 'verify', text: e.code + ' — ' + r.msg });
      LC.ui.toast({
        kind: r.result === 'verified' ? 'good' : r.result === 'debunked' ? 'bad' : 'info',
        text: e.code + ' · ' + (r.result === 'verified' ? 'verified' : r.result === 'debunked' ? 'does not hold' : 'still unconfirmed'),
        evidence: evId
      });
      LC.save();
      const vid = LC.phase(s).id + '_verify';
      const node = {
        phase: LC.phase(s).id, at: s.at,
        text: [{ beat: e.code + ' · ' + e.name }, r.msg],
        choices: [
          LC.nodes[vid] ? { label: 'Check something else', to: vid, tone: 'evidence' } : null,
          { label: 'Back to ' + LC.LOCATIONS[s.at].name, to: 'BACK:' + s.at, tone: 'ember', group: 'advance' }
        ].filter(Boolean)
      };
      LC.ui.all();
      LC.ui.scene(node);
    },

    tab(name) {
      $$('.tab').forEach((t) => {
        const on = t.dataset.tab === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      $$('.tabpane').forEach((p) => {
        const on = p.id === 'pane-' + name;
        p.classList.toggle('is-active', on);
        p.hidden = !on;
      });
      const dot = document.getElementById(name + '-dot');
      if (dot) dot.hidden = true;
    },

    key(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') return LC.ui.closeSheet();
      if (!LC.state || $('#game-screen').hidden) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (/^[1-9]$/.test(e.key)) {
        const btns = $$('#scene-choices .choice:not([disabled])');
        const b = btns[parseInt(e.key, 10) - 1];
        if (b) { b.click(); e.preventDefault(); }
        return;
      }
      const k = e.key.toLowerCase();
      if (k === 'i') LC.panels.inventory();
      if (k === 'j') LC.panels.journal();
      if (k === 'm') document.body.classList.toggle('left-open');
      if (k === 't') this.tab('tape');
      if (k === 'r') this.tab('room');
      if (k === 'b') this.tab('board');
    },

    /* ---------------- the finale ---------------- */
    ending() {
      const s = LC.state;
      LC.chart.finale(LC.FINAL_PRICE, 5200);
      const res = LC.resolveEnding(s);
      const E = LC.ENDINGS[res.id];
      const variant = res.variant && E.variants ? E.variants[res.variant] : null;

      /* the book settles at the real price */
      if (s.position) {
        LC.TAPE.d3_after = Object.assign({}, LC.TAPE.d3_after, { c: LC.FINAL_PRICE });
        LC.closePosition(s);
      }
      LC.recordEnding(res.id);
      LC.clearSave();

      const body = (variant && variant.body) ? variant.body
                 : (res.variant === 'strong' && E.bodyStrong) ? E.bodyStrong
                 : (res.variant === 'weak' && E.bodyWeak) ? E.bodyWeak
                 : (E.body || E.bodyStrong || []);

      const host = $('#ending-body');
      host.innerHTML = '';
      host.className = 'ending ending--' + E.cls;
      host.append(
        el('div', { class: 'ending__kicker', text: E.kicker }),
        el('h1', { class: 'ending__title', text: E.title }),
        el('div', { class: 'ending__sub', text: (variant && variant.sub) || E.sub }),
        el('div', { class: 'ending__body' }, body.map((p) => el('p', { html: LC.md(p) })))
      );

      const eq = LC.equity(s);
      const rows = [
        ['Equity', U.money(eq) + '  (' + U.money(eq - s.startCapital, { sign: true }) + ')'],
        ['Evidence verified', LC.verifiedCount(s) + ' of 7'],
        ['Account integrity', Math.round(s.integrity)],
        ['Credibility', Math.round(s.credibility)],
        ['Composure', Math.round(s.composure)],
        ['Channel', ({ regulator: 'The regulator', press: 'The Ledger Review', public: 'Your own audience',
                       hold: 'Nobody — file kept', silence: 'Nobody — file deleted' })[s.flags.channel] || 'Never chose one']
      ];
      LC.CAST_ORDER.forEach((k) => rows.push([LC.CAST[k].name, LC.relLabel(k, s.rel[k])]));

      host.append(el('div', { class: 'ledger' }, [
        el('div', { class: 'ledger__head', text: 'The ledger' }),
        ...rows.map(([k, v]) => el('div', { class: 'ledger__row' }, [
          el('span', { class: 'ledger__k', text: k }), el('span', { class: 'ledger__v', text: String(v) })
        ])),
        el('div', { class: 'ledger__note', text: s.flags.warnedRoom || s.flags.warnedOriDirect || s.flags.warnedOri
          ? 'You warned somebody. It is the only line in this table that was free to write and expensive to earn.'
          : 'Nobody was warned.' })
      ]));

      if (E.epilogue) {
        host.append(el('div', { class: 'epilogue' }, [
          el('h3', { text: 'Afterwards' }),
          ...E.epilogue.map(([who, what]) => el('p', { html: '<b>' + who + '</b> — ' + LC.md(what) }))
        ]));
      }

      const unseen = LC.ENDING_ORDER.filter((id) => !LC.ledger()[id]).length;
      host.append(el('div', { class: 'ending__actions' }, [
        el('button', { class: 'ebtn ebtn--primary', text: 'Play again', onclick: () => location.reload() }),
        el('button', { class: 'ebtn', text: 'The Ledger (' + (6 - unseen) + '/6)', onclick: () => LC.panels.endingsGallery() })
      ]));
      host.append(el('p', { class: 'ending__hint', text: unseen
        ? 'There are ' + unseen + ' endings you have not reached. The hinges are where they diverge.'
        : 'You have found all six. Including the one that is hidden.' }));

      $('#game-screen').classList.remove('is-active');
      $('#game-screen').hidden = true;
      $('#ending-screen').hidden = false;
      $('#ending-screen').classList.add('is-active');
    }
  };

  const $$ = U.$$;
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => LC.game.boot());
  } else {
    LC.game.boot();
  }
})(window.LC);
