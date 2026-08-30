/* ============================================================
   Panels — inventory, journal, settings, the ledger of endings
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util, el = U.el;

  const esc = (t) => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  LC.panels = {

    inventory() {
      const s = LC.state;
      const items = LC.heldItems(s);
      const ev = LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] !== 'unknown');
      let html = '<h3>Evidence</h3>';
      html += ev.length ? '<ul>' + ev.map((id) => {
        const e = LC.EVIDENCE[id], st = s.evidence[id];
        const tag = st === 'verified' ? '<span class="st-verified">verified</span>'
                  : st === 'debunked' ? '<span class="st-debunked">does not hold</span>'
                  : '<span class="st-held">unconfirmed</span>';
        return '<li><b>' + e.code + ' · ' + esc(e.name) + '</b> — ' + tag +
               '<br><span style="color:var(--text-3);font-size:12px">' + esc(e.detail) + '</span></li>';
      }).join('') + '</ul>'
        : '<p>Nothing pinned yet. A claim becomes evidence when you can show where it came from.</p>';

      html += '<h3>Items</h3>';
      html += items.length ? '<ul>' + items.map((k) => {
        const it = LC.ITEMS[k];
        return '<li><b>' + esc(it.name) + '</b> — <span style="color:var(--text-3)">' + esc(it.desc) +
               '</span><br><span style="color:var(--ember);font-size:12px">' + esc(it.use) + '</span></li>';
      }).join('') + '</ul>' : '<p>Empty pockets.</p>';

      LC.ui.sheet('What you are carrying', html);
    },

    journal() {
      const s = LC.state;
      const proven = LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'verified' && !LC.hasTag(id, 'counter'));
      const suspect = LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'held');
      const dead = LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'debunked');

      let html = '<p style="color:var(--text-3);font-size:12.5px">' + esc(LC.objective(s)) + '</p>';
      html += '<h3>What I can prove</h3>';
      html += proven.length ? '<ul>' + proven.map((id) => '<li>' + LC.EVIDENCE[id].code + ' · ' + esc(LC.EVIDENCE[id].name) + '</li>').join('') + '</ul>'
                            : '<p style="color:var(--ask)">Nothing. Not one thing.</p>';
      html += '<h3>What I suspect</h3>';
      html += suspect.length ? '<ul>' + suspect.map((id) => '<li>' + LC.EVIDENCE[id].code + ' · ' + esc(LC.EVIDENCE[id].name) + '</li>').join('') + '</ul>'
                             : '<p>Nothing outstanding.</p>';
      if (dead.length) {
        html += '<h3>What did not hold</h3><ul>' +
          dead.map((id) => '<li>' + LC.EVIDENCE[id].code + ' · ' + esc(LC.EVIDENCE[id].name) + '</li>').join('') + '</ul>';
      }
      if (s.foreclosed.length) {
        html += '<h3>Doors that are shut</h3><ul>' +
          s.foreclosed.map((t) => '<li style="color:#ffb3ba">' + esc(t) + '</li>').join('') + '</ul>';
      }
      html += '<h3>What I did</h3>';
      html += s.journal.length ? '<ul>' + s.journal.slice().reverse().map((j) => {
        const p = LC.phaseById(j.phase) || {};
        return '<li><span style="font-family:var(--mono);font-size:10px;color:var(--text-4)">D' +
               (p.day || '?') + ' ' + (p.clock || '') + '</span> ' + esc(j.text) + '</li>';
      }).join('') + '</ul>' : '<p>Nothing yet.</p>';

      LC.ui.sheet('The file', html);
    },

    settings() {
      const p = LC.prefs();
      const html =
        '<h3>Ambience</h3><p>Synthesised rain and room hum. No audio files, nothing downloaded.</p>' +
        '<div class="setrow"><button class="setbtn" data-set="audio">' + (LC.audio.isOn() ? 'On' : 'Off') + '</button></div>' +
        '<h3>Text speed</h3>' +
        '<div class="setrow">' + ['cinematic','fast','instant'].map((k) =>
          '<button class="setbtn' + (p.speed === k ? ' is-on' : '') + '" data-speed="' + k + '">' + k + '</button>').join('') + '</div>' +
        '<h3>Timed choices</h3><p>Two moments in the story run on a clock. Turn this off and they wait for you.</p>' +
        '<div class="setrow"><button class="setbtn' + (p.timers ? ' is-on' : '') + '" data-set="timers">' +
          (p.timers ? 'Timers on' : 'Timers off') + '</button></div>' +
        '<h3>This run</h3>' +
        '<div class="setrow"><button class="setbtn" data-set="export">Copy save code</button>' +
        '<button class="setbtn" data-set="import">Paste save code</button>' +
        '<button class="setbtn" data-set="restart">Restart from the beginning</button></div>' +
        (LC.storageOK ? '' : '<p style="color:var(--warn);font-size:12px">This browser will not let the page save. Copy the save code before you close the tab.</p>');
      LC.ui.sheet('Settings', html);

      const body = U.$('#overlay-body');
      body.querySelectorAll('[data-speed]').forEach((b) => b.addEventListener('click', () => {
        LC.setPrefs({ speed: b.dataset.speed }); LC.panels.settings();
      }));
      body.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => {
        const k = b.dataset.set;
        if (k === 'audio') { LC.audio.toggle(); LC.setPrefs({ audio: LC.audio.isOn() }); LC.panels.settings(); }
        if (k === 'timers') { LC.setPrefs({ timers: !LC.prefs().timers }); LC.panels.settings(); }
        if (k === 'restart') {
          LC.ui.sheet('Restart?', '<p>This run is not kept. Monday morning, $28,400, nothing proven.</p>' +
            '<div class="setrow"><button class="setbtn is-on" id="really-restart">Yes, start over</button>' +
            '<button class="setbtn" id="not-restart">Keep playing</button></div>');
          U.$('#really-restart').addEventListener('click', () => { LC.clearSave(); location.reload(); });
          U.$('#not-restart').addEventListener('click', () => LC.panels.settings());
        }
        if (k === 'export') {
          const code = LC.exportSave();
          navigator.clipboard && navigator.clipboard.writeText(code);
          LC.ui.sheet('Save code', '<p>Copied to your clipboard. Keep it somewhere safe — pasting it back restores this exact run.</p>' +
            '<textarea readonly style="width:100%;height:150px;font-family:var(--mono);font-size:10px;background:rgba(0,0,0,.4);color:var(--text-2);border:1px solid var(--line);border-radius:10px;padding:10px">' + code + '</textarea>');
        }
        if (k === 'import') {
          LC.ui.sheet('Restore a run', '<p>Paste a save code below.</p>' +
            '<textarea id="save-in" style="width:100%;height:130px;font-family:var(--mono);font-size:10px;' +
            'background:rgba(0,0,0,.4);color:var(--text-2);border:1px solid var(--line);border-radius:10px;padding:10px"></textarea>' +
            '<div class="setrow"><button class="setbtn is-on" id="save-go">Restore</button></div>' +
            '<p id="save-msg" style="color:var(--ask);font-size:12px"></p>');
          U.$('#save-go').addEventListener('click', () => {
            const st = LC.importSave(U.$('#save-in').value || '');
            if (!st) { U.$('#save-msg').textContent = 'That code is not readable.'; return; }
            LC.state = st; LC.save(); location.reload();
          });
        }
      }));
    },

    endingsGallery() {
      const l = LC.ledger();
      const html = '<div class="egallery">' + LC.ENDING_ORDER.map((id) => {
        const e = LC.ENDINGS[id], seen = !!l[id];
        return '<div class="ecell' + (seen ? '' : ' is-locked') + '">' +
          '<div class="ecell__t">' + (seen ? esc(e.title) : '— — — — —') + '</div>' +
          '<div class="ecell__d">' + (seen ? esc(e.sub) : 'Not yet reached.') + '</div></div>';
      }).join('') + '</div>' +
      '<p style="margin-top:18px;color:var(--text-4);font-size:12px">Six endings. One of them is hidden and needs everything proven, everyone still standing, and nothing taken.</p>';
      LC.ui.sheet('The Ledger', html);
    },

    about() {
      LC.ui.sheet('About', 
        '<p><b>The Last Candle</b> is a work of fiction. Every company, ticker, exchange, platform, person and price in it is invented — <span class="mono">MB:HALX</span> trades on the Meridian Board, which does not exist.</p>' +
        '<p>Nothing here is financial advice and none of it describes a real market, a real firm, or a real case. The price path is authored and identical on every playthrough: there is no market model underneath it and no strategy to be learned from it.</p>' +
        '<h3>What it is about</h3>' +
        '<p>Verification. Risk discipline. The distance between believing something and being able to prove it. And the fact that the people who get hurt in stories like this are almost never the people the story is about.</p>' +
        '<h3>How to play</h3>' +
        '<ul><li>Each session gives you <b>Focus</b>. Looking at things costs it. It does not carry over.</li>' +
        '<li>Travel between places is free. Acting is not.</li>' +
        '<li>Evidence starts <i>unconfirmed</i>. Only verified evidence counts at the end.</li>' +
        '<li>Six choices are marked <i>this one does not come back</i>. They mean it.</li></ul>' +
        '<p style="color:var(--text-4);font-size:12px;margin-top:20px">Keyboard: number keys pick choices, <b>I</b> inventory, <b>J</b> journal, <b>M</b> map, <b>Esc</b> closes.</p>');
    }
  };
})(window.LC);
