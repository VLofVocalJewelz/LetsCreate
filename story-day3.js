/* ============================================================
   DAY THREE — THE LAST CANDLE
   ============================================================ */
(function (LC) {
  'use strict';
  LC.nodes = LC.nodes || {};
  const A = (o) => Object.assign({ kind: 'action', cost: 1, once: true, back: true }, o);

  Object.assign(LC.nodes, {

  /* ======================================= PRE-MARKET ======================================= */
  d3_premarket_open: {
    phase: 'd3_premarket',
    text: [
      { lede: 'You did not really sleep. You lay in the dark composing sentences to people who were not there, which is the closest thing to rest this week has offered.' },
      { sys: 'TESSERA MARKETS · PRE-MARKET 07:05\nMB:HALX  9.60   +14.3%\nNOTE: placement lockup expires at today\'s close', kind: 'doc' },
      'The note is one line in grey text at the bottom of a page nobody scrolls to. Today, at four o\'clock, the number of shares that can be sold roughly triples.',
      'In the room, somebody has made a graphic. It says WE ARE THE FLOAT.',
      { beat: 'They are not. That is the entire problem, and it is written on page 41 of a document that has been public for two months.' }
    ],
    onEnter: { composure: -8 },
    choices: [{ label: 'The last day', to: '__hub_d3_premarket_desk', tone: 'ember' }]
  },


  d3_pm_marisol: A({
    phase: 'd3_premarket', at: 'newsroom', tone: 'evidence',
    label: 'Marisol wants a decision', detail: 'She has a slot at six and a lawyer who leaves at seven.',
    req: { flag: ['newsroomOpen'] },
    text: [
      { s: 'marisol', t: 'I will tell you exactly where we are, because you have earned that and because I do not have time to be gentle.' },
      { s: 'marisol', t: 'Your retrieval log is a document I can authenticate. That is one. The fills are a document I can authenticate *if* your time-and-sales export is genuine, and I can check that myself. That is two.' },
      { s: 'marisol', t: 'The ledger is nothing until somebody puts a name on it. And the draft you say you have is the single most dangerous piece of paper any of us have ever touched — I cannot print it, and if you trade on it you go to prison and I go to your trial.' },
      { s: 'you', t: 'And if I get you a person?' },
      { s: 'marisol', t: 'Then I run it Friday morning, our lawyers read it tonight, and every one of us finds out what we are made of.' }
    ],
    onEnter: { rel: { marisol: 10 }, credibility: 4, flag: { marisolReady: true },
      note: 'Marisol will run it Friday — if you bring her a person who will be named.' }
  }),

  d3_pm_sable: A({
    phase: 'd3_premarket', at: 'studio', tone: 'social',
    label: 'Ask her again, like you promised', detail: 'She said Thursday. This is Thursday.',
    req: { flag: ['sableWillTestify'] },
    text: [
      'The boxes are gone. The ring light is folded in its bag by the door. She has done her hair, which somehow makes it worse.',
      { s: 'sable', t: 'I wrote it out. So I would not have to think of the words while somebody was recording me.' },
      'Two pages, handwritten. Dates, amounts, the phrase *organic tone* in quotation marks, and at the bottom, in different ink, added later: *I knew. I did it anyway. That is the whole thing.*',
      { s: 'sable', t: 'Do not thank me. If you thank me I will change my mind.' }
    ],
    onEnter: { rel: { sable: 12 }, credibility: 6, integrity: 4, flag: { sableOnRecord: true },
      note: 'Sable put it in writing, in her own hand, with her name on it.' }
  }),

  d3_pm_room: A({
    phase: 'd3_premarket', at: 'room', tone: 'social',
    label: 'Look at the room one more time', detail: 'Nine thousand people on the last morning.',
    text: [
      'It does not look like a scam from the inside. That is what nobody understands about it afterwards.',
      'It looks like a lot of people being kind to each other about a shared idea. Somebody has made a spreadsheet to help newer members size their positions. Somebody else is offering to explain options to anybody who asks, for free, at eight o\'clock, because he remembers what it was like.',
      { sys: 'ori · 07:41 · im all in. see you at the top', kind: 'doc' },
      { beat: 'The machinery is four people. The room is nine thousand. Whatever you do today, you do to both.' }
    ],
    onEnter: { composure: -10, flag: { sawTheRoom: true }, note: 'Looked at nine thousand people and understood the arithmetic.' }
  }),

  d3_premarket_beat: {
    kind: 'beat', phase: 'd3_premarket',
    text: [{ beat: 'Six and a half hours until the close. Nine and a half until 16:15.' }],
    choices: [{ label: 'The bell', to: 'd3_open_open', tone: 'ember' }]
  },

  /* ======================================= OPEN ======================================= */
  d3_open_open: {
    phase: 'd3_open',
    text: [
      'Nine sixty to eleven eighty-five in forty minutes. Spreads thirty cents wide. The chart stops looking like a chart and starts looking like a wall.',
      { sys: 'TESSERA MARKETS · 10:11\nMB:HALX  11.20   +33.3%   Vol 18.7M\nspread 11.06 / 11.36', kind: 'alert' },
      { beat: 'This is the part people will remember wrong. They will remember it as obvious.' }
    ],
    choices: [{ label: 'The open', to: '__hub_d3_open_desk', tone: 'ember' }]
  },

  d3_op_trade: {
    kind: 'action', phase: 'd3_open', at: 'desk', cost: 0, tone: 'risk',
    label: 'Your own book', detail: 'You know something nine thousand people do not.',
    text: [{ beat: 'You have an unpublished press release in your inbox that says this ends today. Acting on it is the exact crime you have spent three days documenting.' }],
    choicesHead: 'What do you do with your account',
    choices: [
      { label: 'Close everything. Go flat and stay flat.', detail: 'Whatever happens now, your book says you watched.', to: 'BACK', tone: 'safe', req: { position: true }, fx: { close: true, integrity: 10, note: 'Went flat before the end.' } },
      { label: 'Short it. You have the draft. You know.', detail: 'This is trading on material non-public information. The game will let you. It will not forget.', to: 'd3_op_short', tone: 'risk', req: { has: ['E07'] } },
      { label: 'Buy it. Ride the top with everybody else.', detail: 'You have read the draft and you are buying anyway, which is its own kind of answer.', to: 'BACK', tone: 'risk', fx: { trade: { size: 'heavy', noStop: true }, composure: -14, note: 'Bought into a top you had read the ending of.' } },
      { label: 'Nothing. Sit still.', to: 'BACK', tone: 'safe', fx: { integrity: 4 } }
    ]
  },
  d3_op_short: { phase: 'd3_open', back: 'desk',
    text: ['You fill at 11.14. The confirmation arrives in green text, the way all confirmations do, with no opinion about what you have just done.',
      { beat: 'There is now a document in your inbox and a position in your account, and a timestamp linking them that will exist for as long as records exist.' }],
    onEnter: { trade: { size: 'heavy', dir: 'short', noStop: true }, integrity: -30, credibility: -10, composure: -20,
      flag: { tradedOnDraft: true }, note: 'Traded on the unpublished release.',
      closes: ['You are now the story. Every ending except the worst ones is closed.'] } },

  d3_op_ori: A({
    phase: 'd3_open', at: 'room', tone: 'social',
    label: 'ori is up nine thousand dollars', detail: 'He has posted a screenshot of his account. The whole account.',
    text: [
      { sys: 'ori · 10:04 · up 9k!!!\nori · 10:04 · [screenshot]\nquietfills · 10:05 · take something off. please. anything.', kind: 'doc' },
      'The screenshot shows a balance of $14,210 and a position worth all of it. Under the numbers, visible in the corner because he did not think to crop it, is a bank name and the words OVERDRAFT PROTECTION DECLINED.',
      { beat: 'Nine thousand dollars of profit, and he cannot cover an overdraft.' }
    ],
    onEnter: { composure: -12, flag: { sawOriAccount: true }, note: "Saw ori's account. All of it was in." }
  }),

  d3_open_beat: {
    kind: 'beat', phase: 'd3_open',
    text: [{ s: 'dorian', t: 'Hold your line. 16:15 today.' },
      { s: 'wickwatcher', t: 'what happens at 16:15' },
      { s: 'dorian', t: '...' },
      { beat: 'He has now said that time in public twice. That is either arrogance or a man building an alibi, and you genuinely cannot tell.' }],
    choices: [{ label: 'Midday', to: 'd3_midday_open', tone: 'ember' }]
  },

  /* ======================================= MIDDAY — THE CHANNEL ======================================= */
  d3_midday_open: {
    phase: 'd3_midday',
    text: [
      'At 12:31 it makes a lower high for the first time in three days. Nobody in the room says anything about it. Everybody in the room sees it.',
      { beat: 'Three hours and twenty-nine minutes until the close. Three hours and forty-four until 16:15. Whatever you are going to do, you are going to do it now.' }
    ],
    choices: [
      { label: 'One more hour of work first', to: '__hub_d3_midday_desk', tone: 'evidence' },
      { label: 'Decide.', to: 'H5_channel', tone: 'ember' }
    ]
  },

  d3_md_shore: A({
    phase: 'd3_midday', at: 'desk', tone: 'evidence', cost: 1,
    label: 'Read your own file as if you were the defence', detail: 'Every hole in it, out loud, in your own voice.',
    text: [
      'You read it as Dorian\'s lawyer would. It takes forty minutes and it is the worst forty minutes of the week.',
      { beat: 'Everything you cannot source dies in the first paragraph of the reply. Everything you can source survives contact.' },
      'What is left after that is smaller than you wanted and harder than you expected.'
    ],
    onEnter: { credibility: 6, integrity: 4, composure: -6, flag: { stressTested: true },
      note: 'Attacked your own file the way an opponent would.' }
  }),

  d3_md_nadia: A({
    phase: 'd3_midday', at: 'diner', tone: 'safe',
    label: 'Ask Nadia what she would do', detail: 'She has never once told you what to do.',
    text: [
      { s: 'nadia', t: 'I am not going to tell you what to do.' },
      { s: 'you', t: 'I know.' },
      { s: 'nadia', t: 'I will tell you the test I use, and you can hate it. If it goes wrong, can you say out loud what you knew and when you knew it, and have that be enough?' },
      { s: 'nadia', t: 'Not "was I right". Right is luck. *Was I careful.* That is the only part of this that is yours.' },
      { beat: 'She writes it on the napkin under the other one and pushes it across. WAS I CAREFUL.' }
    ],
    onEnter: { rel: { nadia: 8 }, composure: 14, integrity: 4, note: 'Asked Nadia for the test, not the answer.' }
  }),

  /* ---- HINGE 5 — THE CHANNEL ---- */
  H5_channel: {
    kind: 'hinge', phase: 'd3_midday', hinge: 'H5',
    title: 'What you are going to do',
    text: [
      'Four windows open on the left monitor. A regulator\'s tip form, blank. An email to Marisol, unsent. A draft post, seven hundred words, unpublished. And nothing — a desktop, a folder, a cursor.',
      { beat: 'The rest of your life is one of these four windows and you have about ninety seconds before you start lying to yourself about which.' }
    ],
    choicesHead: 'Choose the channel',
    choices: [
      { label: 'File it with the regulator', detail: 'Slow, unglamorous, and the only route where being right eventually means something. Needs a case that survives without you.', to: 'H5_regulator', tone: 'safe', req: { verifiedCount: 3 } },
      { label: 'Give it to Marisol and let a newsroom carry it', detail: 'A lawyer reads it, a standards desk checks it, and your name is one of several. Needs a person who will be named.', to: 'H5_press', tone: 'evidence', req: { flag: ['marisolReady'], verifiedCount: 2 } },
      { label: 'Publish the thread yourself. Tonight. Everything.', detail: 'Enormous reach, no lawyer, no editor, and nobody to catch you if you are wrong.', to: 'H5_public', tone: 'risk' },
      { label: 'Hold the file. Say nothing. Stay alive.', detail: 'Nobody is warned. Nobody is exposed. You keep everything, including the option.', to: 'H5_hold', tone: 'safe' },
      { label: 'Nothing. There is no story. There never was.', detail: 'Close the windows and go back to being somebody who trades stocks and sleeps.', to: 'H5_silence', tone: 'risk' }
    ]
  },
  H5_regulator: { phase: 'd3_midday', back: 'desk',
    text: ['The form is eleven pages and asks for nothing you have not already written down.',
      'You attach the retrieval log, the time-and-sales, and every document you can source, and you leave out everything you cannot, which hurts more than you expected.',
      'At the end there is a box that says DESCRIBE YOUR RELATIONSHIP TO THE SUBJECT and you sit in front of it for six minutes before typing: *He taught me how to do this.*',
      { beat: 'Submitted 13:22. Reference number, no acknowledgement, no thank you. It will be eleven months before you hear anything at all.' }],
    onEnter: { flag: { channel: 'regulator', channelSet: true }, integrity: 10, credibility: 6, composure: -6,
      note: 'Filed with the regulator.' } },
  H5_press: { phase: 'd3_midday', back: 'desk',
    text: ['You send Marisol everything, including the parts that make you look bad, because she asked for those first and you have started to understand why.',
      { s: 'marisol', t: 'Received. Lawyers at six. If this holds we run Friday 06:00.' },
      { s: 'marisol', t: 'One more thing and I need you to hear it properly. From the moment this publishes you do not control any of it. Not the headline, not the framing, not what happens to the people in it. If that is not something you can live with, tell me in the next hour.' },
      { beat: 'You do not tell her anything in the next hour.' }],
    onEnter: { flag: { channel: 'press', channelSet: true }, integrity: 8, credibility: 8, composure: -8, rel: { marisol: 14 },
      note: 'Gave it to a newsroom with a standards desk.' } },
  H5_public: { phase: 'd3_midday', back: 'desk',
    text: ['Seven hundred words, eleven screenshots, and one line at the top that says *I am going to lose friends over this.*',
      'You schedule it for 16:20. Five minutes after the release. Long enough to be vindicated, short enough to be first.',
      { beat: 'You read it back nine times. On the ninth read you notice that four of the eleven screenshots prove nothing at all, and you leave them in anyway, because eleven looks like more than seven.' }],
    onEnter: { flag: { channel: 'public', channelSet: true }, credibility: -4, composure: -14,
      note: 'Wrote the thread and scheduled it for 16:20.' } },
  H5_hold: { phase: 'd3_midday', back: 'desk',
    text: ['You close all four windows and copy the folder to a drive that has never touched the internet.',
      'It is not cowardice, exactly. It is the recognition that you are one person with a laptop and forty thousand dollars of legal exposure, and that the file will still be true in a year.',
      { beat: 'Nine thousand people are not warned. That is also true, and it will be true tomorrow, and the day after that.' }],
    onEnter: { flag: { channel: 'hold', channelSet: true }, composure: 10, integrity: 2,
      note: 'Kept the file. Warned nobody. Stayed alive.' } },
  H5_silence: { phase: 'd3_midday', back: 'desk',
    text: ['You delete the folder, then empty the trash, then sit very still.',
      { beat: 'The relief is enormous and it lasts about four minutes.' }],
    onEnter: { flag: { channel: 'silence', channelSet: true }, credibility: -8, integrity: -12, composure: 16,
      note: 'Deleted everything.',
      closes: ['There is no file any more. Whatever happens at 16:15 happens to people you could have warned.'] } },

  d3_midday_beat: {
    kind: 'beat', phase: 'd3_midday',
    text: [{ beat: 'Two hours and fifty minutes to the close.' }],
    choices: [
      { label: 'You have not decided what you are going to do', to: 'H5_channel', tone: 'ember', req: { notFlag: ['channelSet'] } },
      { label: 'Power hour', to: 'd3_power_open', tone: 'ember', req: { flag: ['channelSet'] } }
    ]
  },

  /* ======================================= POWER HOUR ======================================= */
  d3_power_open: {
    phase: 'd3_power',
    text: [
      'It squeezes into the bell. Twelve-oh-five at 15:48, which is the high of the entire move and will be the high forever.',
      { sys: 'wickwatcher · 15:22 · lockup expires at this close. does nobody read filings\nDorianVale · 15:24 · Stay in your seat until 16:15.\nori · 15:31 · i cant sell, the spread is enormous', kind: 'doc' },
      { beat: 'Thirty-eight minutes until the floor is legally allowed to disappear.' }
    ],
    choices: [{ label: 'The last hour', to: '__hub_d3_power_desk', tone: 'ember' }]
  },

  d3_ph_warn: A({
    phase: 'd3_power', at: 'room', tone: 'evidence', cost: 2,
    label: 'Warn the room. No accusations, just the filing.', detail: 'You can be removed for this. You can also be the only person who said it.',
    text: [
      'You do not name anybody. You post the prospectus page, the lockup paragraph, and one sentence: *at today\'s close the number of sellable shares roughly triples. that is public and it is on page 41.*',
      'You are removed in ninety seconds.',
      { sys: 'modbot: you have been removed — rule 4.', kind: 'alert' },
      { beat: 'Before it goes, four hundred people see it. You will never know how many of them read it. You will find out, months later, that ori did.' }
    ],
    onEnter: { credibility: 10, integrity: 8, composure: -6, rel: { dorian: -20 },
      flag: { warnedRoom: true, kickedFromRoom: true },
      note: 'Posted the public filing to nine thousand people and got removed for it.' }
  }),

  d3_ph_ori: A({
    phase: 'd3_power', at: 'desk', tone: 'social',
    label: 'Message ori directly', detail: 'One person instead of nine thousand.',
    req: { flag: ['sawOriAccount'] },
    text: [
      { s: 'you', t: 'You do not know me. Read page 41 of the placement prospectus before four o\'clock. That is all. I am not telling you what to do.' },
      'Typing. Stopping. Typing.',
      { s: 'ori', t: 'is this a short attack' },
      { s: 'you', t: 'No. It is a filing. It has been public for two months.' },
      { s: 'ori', t: 'ok' },
      { s: 'ori', t: 'ok im reading it' },
      { beat: 'Three dots. Then nothing, for a very long time.' }
    ],
    onEnter: { integrity: 6, credibility: 3, composure: 6, flag: { warnedOriDirect: true },
      note: 'Sent one stranger a public filing and let him decide.' }
  }),

  d3_power_beat: {
    kind: 'beat', phase: 'd3_power',
    text: [{ sys: 'TESSERA MARKETS · 16:00:00 · CLOSING PRINT\nMB:HALX  11.90   +11.9% on session   Vol 42.1M\n*** placement lockup expired at this close ***', kind: 'alert' },
      { beat: 'Fifteen minutes.' }],
    choices: [{ label: '16:15', to: 'H6_book', tone: 'ember' }]
  },

  /* ---- HINGE 6 ---- */
  H6_book: {
    kind: 'hinge', phase: 'd3_after', hinge: 'H6',
    title: 'What you are holding at 16:15',
    text: [
      'The after-hours book is four hundred shares wide and eleven cents deep. The room is at nine thousand four hundred people, all of them watching a number that has not moved in eleven minutes.',
      { s: 'ori', t: 'wheres the release' },
      { beat: 'Whatever you do in the next nine hundred seconds is the version of this that gets written down.' }
    ],
    choicesHead: '16:06',
    choices: [
      { label: 'Flat. Nothing in the account. Watch it happen.', detail: 'Your book will say you knew and did not profit. It is the only sentence that costs nothing to say later.', to: 'H6_flat', tone: 'safe' },
      { label: 'Keep the short on. You were right and you should be paid for it.', detail: 'Being right and being clean are about to become different things.', to: 'H6_short', tone: 'risk', req: { position: true } },
      { label: 'Buy the dip when it comes. Somebody has to.', detail: 'You have read the release. You are buying anyway.', to: 'H6_buy', tone: 'risk' },
      { label: 'Close everything right now, at any price.', detail: 'Whatever it costs. Just be flat.', to: 'H6_flat', tone: 'safe', req: { position: true } }
    ]
  },
  H6_flat: { phase: 'd3_after', to: 'd3_after_final',
    text: ['You flatten at whatever the screen will give you and then you put your hands in your lap like a child at a table.'],
    onEnter: { close: true, integrity: 12, flag: { finalFlat: true }, note: 'Flat at 16:15.' },
    choices: [{ label: '16:15', to: 'd3_after_final', tone: 'ember' }] },
  H6_short: { phase: 'd3_after',
    text: ['You leave it on. Your hands are completely steady, which you will think about for years.'],
    onEnter: { integrity: -10, flag: { finalShort: true }, note: 'Held the short into 16:15.' },
    choices: [{ label: '16:15', to: 'd3_after_final', tone: 'ember' }] },
  H6_buy: { phase: 'd3_after',
    text: ['You put a bid in under the market and it fills faster than you expected, which should have told you something.'],
    onEnter: { trade: { size: 'heavy', noStop: true }, integrity: -14, flag: { finalLong: true }, note: 'Bought into 16:15.' },
    choices: [{ label: '16:15', to: 'd3_after_final', tone: 'ember' }] },

  d3_after_final: {
    kind: 'finale', phase: 'd3_after',
    text: [
      { sys: '16:15:00\nHALCYON EXOGRID INC. announces termination of discussions with its utility partner and a review of strategic alternatives.', kind: 'alert' },
      'For two seconds nothing happens at all.',
      'Then the bid is gone. Not lower — gone, the way a floor is gone when somebody stops paying for it. Eleven ninety to nine forty to six-twenty in under a minute, on a book that has nothing in it, in a stock where three times as many shares became sellable forty-five minutes ago.',
      { beat: 'Four twenty. Three ninety. Three eighty-five.' },
      { sys: 'ori · 16:16 · theres no bid\nori · 16:17 · can someone tell me what to do', kind: 'doc' },
      'Nobody answers him. Nine thousand four hundred people online, and nobody answers him.'
    ],
    choices: [{ label: 'After that', to: 'ENDING', tone: 'ember' }]
  }

  });
})(window.LC);
