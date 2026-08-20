/* ============================================================
   #the-candle-room — a private community, streaming in real time.
   Every handle, claim and price here is invented.
   ============================================================ */
(function (LC) {
  'use strict';
  const U = LC.util;

  const M = (who, text, kind) => ({ who, text, kind: kind || '' });
  const SYS = (text) => ({ who: '', text, kind: 'sys' });

  LC.ROOM = {
    d1_premarket: { online: '2,140', log: [
      SYS('— 07:04 · 2,140 members online —'),
      M('DorianVale', 'Morning, room. Watchlist is one line today. HALX.', 'mod'),
      M('wickwatcher', 'saw the release at 4:28 last night. contract with a utility. 4.1m float'),
      M('tendiekid', 'FOUR MILLION FLOAT. do you understand what that means'),
      M('quietfills', 'i understand it means the spread will eat you alive at the open'),
      M('DorianVale', 'Nobody chase. I will post my plan when I have one.', 'mod'),
      M('sablecharts', 'doing a pre-market breakdown at 8. no calls, just levels'),
      M('mira_k', 'third time this month a nothing company gaps 40 overnight. weird.')
    ]},
    d1_open: { online: '3,880', log: [
      SYS('— 09:30 · opening bell —'),
      M('tendiekid', 'GO'),
      M('wickwatcher', 'filled 4.60'),
      M('quietfills', 'filled 5.90 lol why did i do that'),
      M('DorianVale', 'In. Averaged well. Managing.', 'mod'),
      M('tendiekid', 'dorian in = floor is in'),
      M('mira_k', 'he posted "in" at 9:41 and the candle he screenshotted is from 9:33'),
      M('modbot', 'mira_k has been muted for 30 minutes: rule 4, no accusations.', 'sys'),
      M('quietfills', '...')
    ]},
    d1_midday: { online: '3,410', log: [
      SYS('— 12:05 · volume thinning —'),
      M('wickwatcher', 'lunch chop. holding.'),
      M('tendiekid', 'down 900 on the day. adding.'),
      M('quietfills', 'adding to a loser at lunch is how i lost my deposit twice'),
      M('DorianVale', 'Patience is a position. Room upgrade slots open at 4pm.', 'mod'),
      M('sablecharts', 'video is up. be nice, i filmed it at 6am'),
      M('nobody_asked', 'who paid for that video')
    ]},
    d1_power: { online: '4,220', log: [
      SYS('— 15:04 · power hour —'),
      M('tendiekid', 'HERE WE GO'),
      M('wickwatcher', 'bid just stepped up huge under 5.40'),
      M('DorianVale', 'Told you. Patience.', 'mod'),
      M('quietfills', 'somebody is defending that price and it is not retail'),
      M('tendiekid', 'green on the day. i love this room'),
      M('mira_k', 'unmuted. still curious about those timestamps.')
    ]},
    d1_after: { online: '1,905', log: [
      SYS('— 16:22 · after hours —'),
      M('DorianVale', 'Proud of the discipline today. Tier 3 invites go out tonight.', 'mod'),
      M('wickwatcher', 'what is tier 3'),
      M('DorianVale', 'If you have to ask, next quarter.', 'mod'),
      M('sablecharts', 'video did 40k views. weird day.'),
      M('quietfills', 'nobody sold. nobody. that never happens.')
    ]},

    d2_premarket: { online: '2,660', log: [
      SYS('— 06:58 · pre-market —'),
      M('wickwatcher', 'second release. i read it twice. it says nothing the first one didnt'),
      M('tendiekid', 'IT SAYS EXPANSION'),
      M('DorianVale', 'Same plan. Same discipline. Do not chase the open.', 'mod'),
      M('mira_k', 'anyone else notice the filing yesterday went up 47 minutes before the wire'),
      M('modbot', 'mira_k has been removed from the room.', 'sys'),
      M('quietfills', 'oh.'),
      M('sablecharts', 'i am not doing a video today')
    ]},
    d2_open: { online: '5,140', log: [
      SYS('— 09:30 · opening bell —'),
      M('tendiekid', 'HALTED'),
      M('modbot', 'Volatility halt — HALX — resumption 09:57.', 'sys'),
      M('quietfills', 'this is where accounts die, be careful'),
      M('wickwatcher', 'reopened down 4. bought it.'),
      M('DorianVale', 'Halts are gifts to the prepared.', 'mod'),
      M('tendiekid', 'i am on margin. is that bad'),
      M('quietfills', 'yes')
    ]},
    d2_midday: { online: '4,700', log: [
      SYS('— 11:48 · midday —'),
      M('wickwatcher', 'every dip gets bought in 90 seconds by identical size'),
      M('quietfills', 'thats not a person. thats a program'),
      M('DorianVale', 'It is called conviction. Some of you have never seen it.', 'mod'),
      M('newbie_88', 'i put my rent in this. tell me its fine'),
      M('quietfills', 'it is not fine. size down.'),
      M('modbot', 'quietfills has been muted for 60 minutes: rule 2, no fear-mongering.', 'sys')
    ]},
    d2_power: { online: '5,900', log: [
      SYS('— 15:11 · power hour —'),
      M('tendiekid', 'VERTICAL'),
      M('wickwatcher', 'on what news'),
      M('tendiekid', 'ON VIBES'),
      M('DorianVale', 'Tomorrow is the day I have been telling you about for a year.', 'mod'),
      M('newbie_88', 'im up 4k. should i sell'),
      M('DorianVale', 'Ask yourself who is buying when you sell.', 'mod'),
      M('wickwatcher', 'that is not an answer')
    ]},
    d2_after: { online: '2,410', log: [
      SYS('— 16:40 · after hours —'),
      M('wickwatcher', 'price has not moved a cent in forty minutes on 600k shares'),
      M('quietfills', 'unmuted. that is someone holding it still.'),
      M('DorianVale', 'Rest. Big day tomorrow.', 'mod'),
      M('newbie_88', 'i cant sleep')
    ]},

    d3_premarket: { online: '3,300', log: [
      SYS('— 07:05 · pre-market —'),
      M('tendiekid', 'TWELVE BY LUNCH'),
      M('wickwatcher', 'the float. does anyone here actually know what happens to the float today'),
      M('DorianVale', 'Today we find out who was here for the method and who was here for the noise.', 'mod'),
      M('sablecharts', 'im taking my last video down'),
      M('tendiekid', 'why'),
      M('sablecharts', 'because i want to sleep'),
      M('newbie_88', 'im all in. see you at the top')
    ]},
    d3_open: { online: '7,800', log: [
      SYS('— 09:30 · opening bell —'),
      M('tendiekid', 'ELEVEN. ELEVEN.'),
      M('wickwatcher', 'spreads are 30 cents wide, be careful what you are actually paying'),
      M('newbie_88', 'up 9k!!!'),
      M('quietfills', 'take something off. please. anything.'),
      M('DorianVale', 'Hold your line. 16:15 today.', 'mod'),
      M('wickwatcher', 'what happens at 16:15'),
      M('DorianVale', '...', 'mod')
    ]},
    d3_midday: { online: '7,100', log: [
      SYS('— 12:31 · midday —'),
      M('wickwatcher', 'first lower high of the whole move'),
      M('quietfills', 'somebody is selling into every push. quietly. big.'),
      M('newbie_88', 'im down from my high. is it over'),
      M('DorianVale', 'Weak hands always ask that question at the exact wrong moment.', 'mod'),
      M('tendiekid', 'HOLD THE LINE')
    ]},
    d3_power: { online: '8,900', log: [
      SYS('— 15:22 · power hour —'),
      M('tendiekid', 'TWELVE'),
      M('wickwatcher', 'lockup expires at this close. does nobody read filings'),
      M('quietfills', 'i read it. i am flat. i am also very calm.'),
      M('newbie_88', 'i cant sell, the spread is enormous'),
      M('DorianVale', 'Stay in your seat until 16:15.', 'mod'),
      M('wickwatcher', 'why do you keep saying that time')
    ]},
    d3_after: { online: '9,400', log: [
      SYS('— 16:15 · after hours —'),
      M('tendiekid', 'wheres the release'),
      M('newbie_88', 'wheres the release'),
      M('wickwatcher', 'the bid just vanished'),
      M('quietfills', 'there is no bid.'),
      M('newbie_88', 'theres no bid'),
      M('tendiekid', 'DORIAN')
    ]}
  };

  /* ---------------- renderer ---------------- */
  const state = { host: null, queue: [], timer: 0, phase: null, extra: {} };

  function avatarFor(handle) {
    if (handle === 'DorianVale') return LC.CAST.dorian.color;
    if (handle === 'sablecharts') return LC.CAST.sable.color;
    if (handle === 'CANDLEWICK') return null;
    return null;
  }

  function render(msg, animate) {
    const now = state.clock || '';
    if (msg.kind === 'sys') {
      return U.el('div', { class: 'msg msg--sys' }, [U.el('div', { class: 'msg__txt', text: msg.text })]);
    }
    const anon = msg.kind === 'anon';
    const cls = 'msg' + (msg.kind === 'mod' ? ' msg--mod' : '') + (anon ? ' msg--anon' : '') + (msg.kind === 'dm' ? ' msg--dm' : '');
    const av = U.el('div', { class: 'msg__av', style: anon ? {} : U.avatarStyle(msg.who, avatarFor(msg.who)), text: anon ? '?' : U.initials(msg.who) });
    const node = U.el('div', { class: cls }, [
      av,
      U.el('div', { class: 'msg__body' }, [
        U.el('div', { class: 'msg__who' }, [msg.who, U.el('span', { class: 'msg__time', text: msg.time || now })]),
        U.el('div', { class: 'msg__txt', text: msg.text })
      ])
    ]);
    if (!animate) node.style.animation = 'none';
    return node;
  }

  LC.room = {
    mount(hostEl) { state.host = hostEl; },
    setPhase(phaseId) {
      const host = state.host;
      if (!host) return;
      clearTimeout(state.timer);
      host.innerHTML = '';
      state.phase = phaseId;
      state.clock = (LC.PHASES.find((p) => p.id === phaseId) || {}).clock || '';
      const data = LC.ROOM[phaseId] || { log: [], online: '—' };
      const countEl = document.getElementById('room-count');
      if (countEl) countEl.textContent = data.online + ' online';
      state.queue = data.log.slice();
      const fast = U.reduceMotion();
      let i = 0;
      const step = () => {
        if (i >= state.queue.length) return;
        host.append(render(state.queue[i], !fast));
        host.scrollTop = host.scrollHeight;
        i++;
        state.timer = setTimeout(step, fast ? 30 : 420 + Math.random() * 420);
      };
      step();
    },
    /* push a one-off message (DM, anonymous ping, your own post) */
    push(who, text, kind, time) {
      if (!state.host) return;
      state.host.append(render({ who, text, kind: kind || '', time }, true));
      state.host.scrollTop = state.host.scrollHeight;
      LC.ui && LC.ui.markTab && LC.ui.markTab('room');
    }
  };
})(window.LC);
