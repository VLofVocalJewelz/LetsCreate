/* Shared harness: loads the browser globals into node and drives the graph
   headlessly. Mirrors the routing in src/game.js (goto / choose / verify). */
'use strict';
const path = require('path');

function load() {
  global.window = { matchMedia: () => ({ matches: false }), addEventListener() {} };
  global.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
  const files = [
    'engine/util.js', 'data/cast.js', 'data/evidence.js', 'data/items.js', 'data/locations.js',
    'engine/state.js', 'data/tape.js', 'engine/rules.js', 'data/roomfeed.js',
    'data/story-day1.js', 'data/story-verify.js', 'data/story-day2.js', 'data/story-day3.js', 'data/endings.js'
  ];
  files.forEach((f) => {
    delete require.cache[require.resolve(path.join(__dirname, '..', 'src', f))];
    require(path.join(__dirname, '..', 'src', f));
  });
  return global.window.LC;
}

/* choices visible at a node, with their gate state */
function optionsAt(LC, s, node) {
  let list = (node.choices || []).slice();
  if (node.back) {
    const to = typeof node.back === 'string' ? node.back : s.at;
    list.push({ label: 'Back', to: 'BACK:' + to, group: 'advance' });
  }
  return list.map((c) => {
    const gate = c.locked != null ? { ok: !c.locked } : LC.meets(c.req, s);
    const poor = (c.cost || 0) > s.focus;
    return { c, ok: gate.ok && !poor };
  });
}

/* one transition; returns {done, ending} */
function apply(LC, s, choice) {
  if (choice.travel) {
    if (!LC.locOpen(choice.travel, s)) return {};
    s.at = choice.travel;
    s.node = LC.hubId(LC.phase(s).id, choice.travel);
    return {};
  }
  LC.applyFx(choice.fx, s);
  return goto(LC, s, choice.to);
}

function goto(LC, s, id) {
  if (id === 'ENDING') return { done: true, ending: LC.resolveEnding(s) };
  if (id && id.indexOf('BACK') === 0) {
    const loc = id.indexOf(':') > 0 ? id.split(':')[1] : s.at;
    s.at = loc;
    s.node = LC.hubId(LC.phase(s).id, loc);
    return {};
  }
  if (id && id.indexOf('VERIFY:') === 0) {
    const ev = id.split(':')[1];
    const cost = (LC.EVIDENCE[ev].verify || {}).cost || 1;
    if (cost <= s.focus) {
      s.focus -= cost;
      const r = LC.resolveVerify(ev, s);
      s.evidence[ev] = r.result;
    }
    const vid = LC.phase(s).id + '_verify';
    s.node = LC.nodes[vid] ? vid : LC.hubId(LC.phase(s).id, s.at);
    return {};
  }
  const node = LC.getNode(id, s);
  if (!node) return { error: 'missing node: ' + id };
  if (node.phase && node.phase !== LC.phase(s).id) {
    LC.settlePhase(s);
    LC.enterPhase(s, LC.phaseIndexById(node.phase));
    if (node.at) s.at = node.at;
  }
  if (node.kind === 'action') {
    if ((node.cost || 0) > s.focus) return {};
    s.focus -= (node.cost || 0);
    if (node.once) s.used[id] = true;
  }
  if (node.at) s.at = node.at;
  s.node = id;
  LC.applyFx(node.onEnter, s);
  return {};
}

/* play one full run under a policy(options, node, state) -> chosen option */
function play(LC, policy, maxSteps) {
  const s = LC.newState();
  LC.enterPhase(s, 0);
  s.node = 'd1_premarket_open';
  goto(LC, s, 'd1_premarket_open');
  const trail = [];
  let phaseKey = LC.phase(s).id;
  let visited = new Set();
  let repeats = {};
  for (let i = 0; i < (maxSteps || 900); i++) {
    const node = LC.getNode(s.node, s);
    if (!node) return { error: 'missing node: ' + s.node, trail, s };
    if (LC.phase(s).id !== phaseKey) { phaseKey = LC.phase(s).id; visited = new Set(); repeats = {}; }
    repeats[s.node] = (repeats[s.node] || 0) + 1;
    const opts = optionsAt(LC, s, node).filter((o) => o.ok);
    if (!opts.length) return { error: 'dead end at ' + s.node, trail, s };
    let pick = policy(opts, node, s);
    if (repeats[s.node] > 3) {
      const adv = opts.find((o) => o.c.advance) || opts.find((o) => o.c.group === 'advance');
      if (adv) pick = adv;
    }
    /* a real player does not pace between rooms forever: revisiting a place
       with nothing left to do in it means the session is over */
    if (pick.c.travel) {
      const key = phaseKey + '/' + pick.c.travel;
      if (visited.has(key)) {
        const adv = opts.find((o) => o.c.advance) || opts.find((o) => o.c.group === 'advance');
        if (adv) pick = adv;
      } else visited.add(key);
    }
    trail.push(s.node + ' -> ' + pick.c.label);
    const r = apply(LC, s, pick.c);
    if (r.error) return { error: r.error, trail, s };
    if (r.done) return { ending: r.ending, trail, s };
  }
  return { error: 'no ending within step budget', trail, s };
}

module.exports = { load, optionsAt, goto, apply, play };
