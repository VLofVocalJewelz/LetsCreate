/* ============================================================
   DAY ONE — IGNITION
   ============================================================ */
(function (LC) {
  'use strict';
  LC.nodes = LC.nodes || {};
  const A = (o) => Object.assign({ kind: 'action', cost: 1, once: true, back: true }, o);

  Object.assign(LC.nodes, {

  /* ======================================= PRE-MARKET ======================================= */
  d1_premarket_open: {
    phase: 'd1_premarket',
    text: [
      { lede: 'Rain again. Four days of it, running down the glass in the same three channels, like the window has learned a habit.' },
      'Three monitors. A cold mug you keep meaning to move. Twenty-eight thousand four hundred dollars that took two years and one very bad summer to rebuild, sitting in an account with your name spelled slightly wrong.',
      'On the left screen, fourteen thousand people follow someone called @nightdesk who explains charts calmly and never tells anybody what to buy. That is also you. The difference between the two of you is the only thing you own that nobody can margin-call.',
      { sys: 'TESSERA MARKETS · PRE-MARKET 07:12\nMB:HALX — Halcyon Exogrid Inc.\nLast 4.35   +46.0%   Vol 1.2M   Float 4.1M', kind: 'doc' },
      'Forty-six percent overnight, on a company you had never heard of on Friday.',
      { beat: 'Four hours until the bell. Attention is the only thing you have less of than money.' }
    ],
    choices: [{ label: 'Sit down at the desk', to: '__hub_d1_premarket_desk', tone: 'ember' }]
  },

  d1_pm_read: A({
    phase: 'd1_premarket', at: 'desk', tone: 'evidence',
    label: 'Actually read the press release',
    detail: 'All of it, including the parts written by a lawyer.',
    text: [
      'Four hundred words. You read it twice, then a third time with a pen.',
      { sys: 'HALCYON EXOGRID INC. announces a non-binding letter of intent with a regional utility partner regarding potential deployment of its grid-scale storage platform. Terms were not disclosed. The Company expects to provide further updates as milestones are achieved.', kind: 'doc' },
      '*Non-binding. Letter of intent. Potential. Not disclosed. Expects to.* Five hedges in one sentence. There is no contract in this contract announcement.',
      'Then, because you are the sort of person who does this, you open the placement prospectus from two months ago and start reading the parts nobody reads.',
      { beat: 'Page 41 is about a lockup. You do not understand all of it yet. You understand enough to know it matters.' }
    ],
    onEnter: { gain: ['E05'], credibility: 3, flag: { readPR: true }, note: 'Read the filings before the open.' }
  }),

  d1_pm_plan: {
    kind: 'action', phase: 'd1_premarket', at: 'desk', cost: 1, once: true, tone: 'safe',
    label: 'Write the plan before you look at the price again',
    detail: 'Size, stop, invalidation, walk-away number.',
    text: [
      'You open the notebook. Not the app — the notebook, because things written by hand are harder to lie to.',
      { beat: 'A plan is not a prediction. It is a promise about what you will do when you are frightened.' }
    ],
    choicesHead: 'Write it down',
    choices: [
      { label: 'Small starter, hard stop, one add only', detail: 'Boring. Repeatable. The version of you that is still here on Thursday.', to: 'd1_pm_plan_a', tone: 'safe' },
      { label: 'Full size on any pullback. No stop. Conviction.', detail: 'The room would applaud this. The room is not wiring your rent.', to: 'd1_pm_plan_b', tone: 'risk' },
      { label: 'No position. Watch and take notes.', detail: 'You cannot be shaken out of a trade you never took.', to: 'd1_pm_plan_c', tone: 'safe' }
    ]
  },
  d1_pm_plan_a: { phase: 'd1_premarket', back: 'desk',
    text: ['Four lines, and the third one underlined twice: *if it prints below the pre-market low I am wrong, I am out, and I do not get a vote.*'],
    onEnter: { integrity: 8, composure: 4, flag: { hasPlan: true, planTight: true }, note: 'Wrote a plan with a stop and kept it in view.' } },
  d1_pm_plan_b: { phase: 'd1_premarket', back: 'desk',
    text: ['You write CONVICTION at the top of the page and then stop, because you cannot think of a fifth word that is not just a feeling wearing a suit.',
      { beat: 'Something in your chest quietly notes that this is how the bad summer started.' }],
    onEnter: { integrity: -9, composure: -8, flag: { hasPlan: true, planLoose: true }, note: 'Called a feeling a plan.' } },
  d1_pm_plan_c: { phase: 'd1_premarket', back: 'desk',
    text: ['*No position. Observation only. Log everything.* The least exciting sentence you have ever written and the only one that has never cost you money.'],
    onEnter: { integrity: 10, composure: 8, credibility: 2, flag: { hasPlan: true, planFlat: true }, note: 'Chose to sit the first day out.' } },

  d1_pm_film: {
    kind: 'action', phase: 'd1_premarket', at: 'desk', cost: 1, once: true, tone: 'social',
    label: 'Film a pre-market video',
    detail: 'Ninety seconds of fourteen thousand people\'s attention.',
    text: ['The ring light makes this room look like a place where a professional works.'],
    choicesHead: 'Record',
    choices: [
      { label: '"Here is why this move is fragile."', detail: 'Float, hedged language, what would make you wrong. Fewer views. Better people.', to: 'd1_pm_film_a', tone: 'safe' },
      { label: '"This is the setup of the year."', detail: 'Not lying, exactly. Just leaving out everything that makes it a lie.', to: 'd1_pm_film_b', tone: 'risk' }
    ]
  },
  d1_pm_film_a: { phase: 'd1_premarket', back: 'desk',
    text: ['You hold the release up to the camera and read the hedges out loud. Two thousand views by nine — a third of your usual.',
      'The comments are mostly people calling you boring, and one from a stranger: *thank you, i was about to put my savings in this.*'],
    onEnter: { credibility: 7, rel: { nadia: 4, dorian: -3 }, note: 'Told your audience what could go wrong before what could go right.' } },
  d1_pm_film_b: { phase: 'd1_premarket', back: 'desk',
    text: ['Nineteen thousand views before the bell. Your best morning ever. All fire emojis and one comment that says *finally you get it.*',
      { beat: 'You watch it back once and notice you never said the word risk.' }],
    onEnter: { credibility: -6, composure: -6, rel: { dorian: 6, nadia: -6 }, flag: { hypedEarly: true }, note: 'Sold excitement you had not verified.' } },

  d1_pm_nadia: A({
    phase: 'd1_premarket', at: 'desk', tone: 'social',
    label: 'Message Nadia', detail: 'She will tell you the truth, which is not always what you want at seven in the morning.',
    text: [
      'Eleven seconds. She was already awake and already looking.',
      { s: 'nadia', t: 'Before you ask: yes I see it. No I am not in it. Four million float, forty-six percent gap, and a press release with the word *potential* in it.' },
      { s: 'nadia', t: 'You are allowed to trade it. You are not allowed to trade it in a size that makes you a different person by lunchtime. Tell me your stop before you tell me your target.' },
      { s: 'you', t: 'I have not decided anything yet.' },
      { s: 'nadia', t: "Good. That is the only sentence I have heard today that wasn't somebody's P&L talking." }
    ],
    onEnter: { rel: { nadia: 5 }, composure: 5, integrity: 3, flag: { nadiaBriefed: true } }
  }),

  d1_pm_room: A({
    phase: 'd1_premarket', at: 'room', tone: 'social',
    label: 'Read the room properly', detail: 'Two thousand people awake at seven in the morning, all using the same words.',
    text: [
      'The room loads the way it always does: a wall of green, a wall of noise, and Dorian pinned at the top since 2019.',
      { s: 'dorian', t: 'Morning, room. Watchlist is one line today. HALX. Nobody chase. I will post my plan when I have one.' },
      'It is a good message. You have quoted it in your own videos as an example of a responsible community. Four hundred people react with a rocket.',
      'Underneath, somebody called mira_k has typed: *third time this month a nothing company gaps forty percent overnight. weird.* Eleven people tell her to log off.'
    ],
    onEnter: { composure: -4, flag: { readRoom: true } }
  }),

  d1_premarket_beat: {
    kind: 'beat', phase: 'd1_premarket',
    text: [
      { sys: 'TESSERA MARKETS · 09:28:40\nMB:HALX  4.41   pre-market volume 1.9M\norder book: 300 shares on the bid', kind: 'alert' },
      'Three hundred shares on the bid. In ninety seconds, forty thousand people are going to try to fit through that door at once.'
    ],
    choicesHead: 'The bell',
    choices: [
      { label: 'Flat. Watch the first fifteen minutes and write down what actually happens.', detail: 'No position. No adrenaline. Full attention.', to: 'd1_open_open', tone: 'safe', fx: { integrity: 6, composure: 6, note: 'Sat out the open.' } },
      { label: 'Starter position, stop under the pre-market low', detail: 'Small enough that being wrong is a lesson, not an event.', to: 'd1_open_open', tone: 'safe', fx: { trade: { size: 'starter' }, note: 'Opened a starter with a defined stop.' } },
      { label: 'Full planned size at the open', detail: 'The size you agreed to when the price was two dollars lower.', to: 'd1_open_open', tone: 'risk', fx: { trade: { size: 'normal' }, composure: -5, note: 'Opened full size into the bell.' } },
      { label: 'Everything. Right now. Before it leaves.', detail: 'Ninety percent of the account into a four-million-share float at the open.', to: 'd1_open_open', tone: 'risk', req: { notFlag: ['planFlat'] }, fx: { trade: { size: 'allin', noStop: true }, composure: -16, note: 'Put the account into one open.' } }
    ]
  },

  /* ======================================= OPEN ======================================= */
  d1_open_open: {
    phase: 'd1_open',
    text: [
      { lede: 'The bell does not ring anywhere near you. It arrives as a change in the texture of the numbers.' },
      'Four thirty-five. Four ninety. Five sixty. Five ten. Six forty-two. Four-oh-two. Back to five ninety, in eleven minutes, on nine million shares in a company that has four million to sell.',
      'That last part is the whole story and almost nobody is saying it out loud.',
      { beat: 'Your hands are warm. That is a signal, and it is not about the stock.' }
    ],
    choices: [{ label: 'Work the open', to: '__hub_d1_open_desk', tone: 'ember' }]
  },

  d1_op_tape: A({
    phase: 'd1_open', at: 'desk', tone: 'evidence',
    label: 'Watch the tape, not the chart', detail: 'Time and sales. Who is actually trading, in what size, when.',
    text: [
      'You pull time and sales onto the right monitor and stop looking at the chart entirely.',
      { sys: '09:33:02  4.62  ×800\n09:33:09  4.64  ×800\n09:33:41  4.66  ×800\n09:34:15  4.69  ×800\n09:35:50  4.71  ×800', kind: 'doc' },
      'Eight hundred shares. Every time. Never a round thousand, never a stray odd lot. A metronome wearing a costume.',
      { beat: 'Retail does not buy like a metronome. Retail buys like a panic.' }
    ],
    onEnter: { flag: { sawProgram: true }, credibility: 2, note: 'Read the tape and saw the pattern under the noise.' }
  }),

  d1_op_trade: {
    kind: 'action', phase: 'd1_open', at: 'desk', cost: 0, tone: 'risk',
    label: 'Work the position', detail: 'Everyone who has ever blown up did it at roughly this moment.',
    text: [{ beat: 'Five ninety. The room is screaming. Your finger is already in the size field.' }],
    choicesHead: 'Do something, or decide not to',
    choices: [
      { label: 'One planned add — the one you wrote down', to: 'BACK', tone: 'safe', req: { position: true }, fx: { trade: { size: 'starter' }, note: 'Added once, as planned.' } },
      { label: 'Double it', to: 'BACK', tone: 'risk', req: { position: true }, fx: { trade: { size: 'heavy' }, composure: -8, note: 'Doubled into strength.' } },
      { label: 'Use margin', detail: 'Money that is not yours, in a stock with no floor.', to: 'BACK', tone: 'risk', fx: { trade: { size: 'margin', noStop: true }, composure: -18, note: 'Went on margin.' } },
      { label: 'Open a starter — late, but small', to: 'BACK', tone: 'risk', req: { position: false }, fx: { trade: { size: 'starter' }, composure: -6, note: 'Chased small.' } },
      { label: 'Flatten. Take it off.', to: 'BACK', tone: 'safe', req: { position: true }, fx: { close: true, note: 'Closed during the open.' } },
      { label: 'Nothing. Sit on your hands.', to: 'BACK', tone: 'safe', fx: { integrity: 5, composure: 5, note: 'Refused the chase.' } }
    ]
  },

  d1_op_dorian: {
    kind: 'action', phase: 'd1_open', at: 'room', cost: 1, once: true, tone: 'social',
    label: "Read what Dorian posted", detail: 'He said "in" at 09:41, with a receipt.',
    text: [
      { s: 'dorian', t: 'In. Averaged well. Managing.' },
      'Posted 09:41. Attached: a screenshot of his fills, because the room likes receipts.',
      'You look at it for a long time. The fill price in the corner is 4.66.',
      { beat: 'The tape only touched 4.66 between 09:33 and 09:36. He posted at 09:41. He bought five minutes before he told two thousand people to look at it.' },
      'mira_k has just typed the same observation into the room, in worse words.',
      { sys: 'modbot: mira_k has been muted for 30 minutes — rule 4, no accusations.', kind: 'alert' }
    ],
    onEnter: { flag: { sawFills: true }, composure: -6 },
    choicesHead: 'That screenshot is still on your screen',
    choices: [
      { label: 'Screenshot it. Timestamp it. Save it somewhere that is not the room.', detail: 'You are not accusing anyone. You are keeping a copy.', to: 'BACK', tone: 'evidence', fx: { gain: ['E03'], composure: -3, note: 'Started keeping copies.' } },
      { label: 'Defend mira_k publicly, right now', detail: 'Say the quiet thing to three thousand people with nothing but a screenshot.', to: 'd1_op_defend', tone: 'risk' },
      { label: 'Close the tab. This is how paranoid people start.', to: 'BACK', tone: 'safe', fx: { composure: 3, rel: { dorian: 2 }, note: 'Let the timestamp go.' } }
    ]
  },
  d1_op_defend: { phase: 'd1_open', back: 'room',
    text: ['You type it: *her question is reasonable, and muting her instead of answering it is worse than the question.* You hit enter before the part of you that considers consequences catches up.',
      'Four seconds of nothing. Then ninety messages at once.',
      { s: 'dorian', t: 'I have known you three years. You are better than this. Cool off.' },
      'You are not muted. Somehow that is worse — he wants everyone to watch you being wrong.'],
    onEnter: { rel: { dorian: -14, nadia: 3 }, credibility: -3, composure: -12, flag: { publicDoubt: true }, note: 'Accused the room out loud with a screenshot and nothing else.' } },

  d1_open_beat: {
    kind: 'beat', phase: 'd1_open',
    text: [
      'By 10:15 the volatility has drained out and what is left is a stock at five ninety with nine million shares of history behind it.',
      { beat: 'Your phone buzzes. Not the room. A direct message from an account with no picture and no posts.' },
      { s: 'candlewick', t: 'you looked at the tape today instead of the chart. almost nobody does.' },
      { s: 'candlewick', t: 'ask yourself why the filing went up 47 minutes before the news did.' }
    ],
    choices: [{ label: 'Read that again', to: 'd1_midday_open', tone: 'ember' }]
  },

  /* ======================================= MIDDAY ======================================= */
  d1_midday_open: {
    phase: 'd1_midday',
    text: [
      { lede: 'Midday separates traders from gamblers, mostly by boring the gamblers into mistakes.' },
      'The stock bleeds sideways. The room has thinned from four thousand to three, and the ones left are talking about lunch and averaging down.',
      'And there is a message on your phone you have now read fourteen times.'
    ],
    onEnter: { gain: ['E01'], composure: -5 },
    choices: [{ label: 'Get to work', to: '__hub_d1_midday_desk', tone: 'ember' }]
  },

  d1_md_wick: {
    kind: 'action', phase: 'd1_midday', at: 'desk', cost: 1, once: true, tone: 'social',
    label: 'Reply to CANDLEWICK', detail: 'Somebody with no name is offering you something. Find the price.',
    text: [{ beat: 'The cursor blinks. Whatever you type first decides what kind of source this becomes.' }],
    choicesHead: 'Reply',
    choices: [
      { label: '"Who are you and what do you want?"', detail: 'Sources who want something tell you eventually.', to: 'd1_md_wick_a', tone: 'evidence' },
      { label: '"Send me everything you have."', detail: 'Eager. Sources love eager. That is the problem with eager.', to: 'd1_md_wick_b', tone: 'risk' },
      { label: '"I do not take anonymous tips. On the record or not at all."', detail: 'The clean answer. It may also end the only thread you have.', to: 'd1_md_wick_c', tone: 'safe' }
    ]
  },
  d1_md_wick_a: { phase: 'd1_midday', back: 'desk',
    text: [{ s: 'candlewick', t: 'fair.' },
      { s: 'candlewick', t: 'i was in that room when it was five hundred people and it meant something. i want you to look at things and check them yourself. that is all i will say today.' },
      { s: 'you', t: 'People who want nothing do not use burner accounts.' },
      { s: 'candlewick', t: 'no. they do not. hold onto that, you will need it thursday.' }],
    onEnter: { rel: { candlewick: 12 }, credibility: 2, note: 'Asked the source what they wanted before taking anything.' } },
  d1_md_wick_b: { phase: 'd1_midday', back: 'desk',
    text: [{ s: 'candlewick', t: 'that was quick.' },
      'Three files arrive inside a minute, which means they were selected and waiting. That is either preparation or a trap, and from here both look identical.',
      { s: 'candlewick', t: 'do not publish any of it yet. you will want to. do not.' }],
    onEnter: { rel: { candlewick: 8 }, credibility: -2, composure: -6, flag: { eagerWithSource: true }, note: 'Asked an anonymous account for everything it had.' } },
  d1_md_wick_c: { phase: 'd1_midday', back: 'desk',
    text: [{ s: 'candlewick', t: 'good. mostly right.' },
      { s: 'candlewick', t: 'but nobody goes on the record about a man with nine thousand followers and a lawyer on retainer. so instead: i will only send you things you can check without me. check them. if one is wrong, throw all of it away, including me.' },
      'It is, annoyingly, the exact standard you would have set yourself.'],
    onEnter: { rel: { candlewick: 6 }, credibility: 5, integrity: 3, flag: { sourceOnMyTerms: true }, note: 'Set the terms with the source instead of accepting theirs.' } },

  d1_md_archive: A({
    phase: 'd1_midday', at: 'desk', tone: 'evidence', cost: 2,
    label: 'Pull the archive retrieval log', detail: 'Ugly, paginated, free. Forty minutes and a wall of monospace.',
    text: [
      'Almost nobody uses the retrieval log, because it takes forty minutes and gives you nothing pretty.',
      { sys: 'DOC ID 4471-A · amendment to registration statement\nfirst public retrieval   15:41:06\nwire distribution (service header)   16:28:11\nelapsed   00:47:05', kind: 'doc' },
      'Forty-seven minutes and five seconds. Not a rounding error. Not a timezone. A window.',
      { beat: 'And in that window, on yesterday\'s tape, somebody bought eight hundred shares at a time, over and over, like a metronome.' }
    ],
    onEnter: { flag: { archiveLog: true }, credibility: 4, composure: -5, note: 'Pulled the archive retrieval log by hand.' }
  }),

  d1_md_lockup: A({
    phase: 'd1_midday', at: 'desk', tone: 'evidence',
    label: 'Read page 41 properly', detail: 'The lockup language in the prospectus you skimmed this morning.',
    req: { has: ['E05'] },
    text: [
      'Page 41, paragraph three, in the sentence structure legal documents use when they would prefer you stopped reading.',
      { sys: 'Holders of the Placement Shares have agreed not to offer, sell or otherwise dispose of such shares until the close of trading on the third business day following the Effective Date, after which such shares shall become freely tradable.', kind: 'doc' },
      'Third business day. You count on your fingers like a child and get Thursday.',
      { beat: 'Thursday at the close, the number of sellable shares roughly triples. Every candle before that is painted on a floor with an expiry date printed on it.' }
    ],
    onEnter: { verify: 'E05', credibility: 4, note: 'Verified the lockup expiry from the prospectus.' }
  }),

  d1_md_sable: {
    kind: 'action', phase: 'd1_midday', at: 'room', cost: 1, once: true, tone: 'social',
    label: 'Check on Sable', detail: 'She posted a video this morning and has not posted since.',
    text: [
      'Sable Reyes makes better videos than you do, has six times your audience, and has not looked at the camera properly in about a month.',
      { s: 'sable', t: 'hey. saw your morning video.' },
      { s: 'sable', t: 'can i ask you something and you not make it a whole thing' },
      { s: 'you', t: 'Always.' },
      { s: 'sable', t: 'if a company pays you to make a video about "market awareness" and you never actually say buy it. is that fine' },
      { beat: 'There are nine ways to answer and eight of them end with her never asking you anything again.' }
    ],
    onEnter: { rel: { sable: 4 } },
    choicesHead: 'Answer her',
    choices: [
      { label: '"Depends. Did you disclose it?"', detail: 'The actual question, asked without judgment.', to: 'd1_md_sable_a', tone: 'evidence' },
      { label: '"No. It is not fine. You know it is not fine."', detail: 'True, and delivered like a door closing.', to: 'd1_md_sable_b', tone: 'risk' },
      { label: '"Everybody does it. Do not lose sleep."', detail: 'Kind. Cheap. Wrong.', to: 'd1_md_sable_c', tone: 'risk' }
    ]
  },
  d1_md_sable_a: { phase: 'd1_midday', back: 'room',
    text: [{ s: 'sable', t: 'they said the disclosure "kills the organic tone"' },
      { s: 'you', t: 'That is not a marketing note. That is the entire point of the payment.' },
      'Typing. Stopping. Typing again.',
      { s: 'sable', t: 'my landlord filed on tuesday. four months of nothing behind me and an income chart that looks like a heart monitor flatlining. six thousand dollars.' },
      { s: 'sable', t: 'i have not cashed it.' },
      { s: 'you', t: 'Then you still have every option.' },
      { s: 'sable', t: 'dont tell anyone yet. please.' }],
    onEnter: { rel: { sable: 14 }, gain: ['E02'], flag: { sableConfided: true }, note: 'Asked Sable the right question instead of the loud one.' } },
  d1_md_sable_b: { phase: 'd1_midday', back: 'room',
    text: [{ s: 'sable', t: 'ok' }, { s: 'sable', t: 'thanks' },
      'She goes offline. Her video stays up. You were right, which turns out to be a very small thing to be.'],
    onEnter: { rel: { sable: -10 }, integrity: 2, composure: -5, note: 'Was right at Sable instead of useful to her.' } },
  d1_md_sable_c: { phase: 'd1_midday', back: 'room',
    text: [{ s: 'sable', t: 'ok. ok cool. thank you.' }, { s: 'sable', t: 'i needed someone to say that' },
      { beat: 'You have just made it slightly easier for her to do the thing that will hurt her. It cost you nothing. It will cost her everything.' }],
    onEnter: { rel: { sable: 6 }, credibility: -4, integrity: -6, flag: { enabledSable: true }, note: 'Told Sable what she wanted to hear.' } },

  d1_midday_beat: {
    kind: 'beat', phase: 'd1_midday',
    text: ['14:40. There is a folder on your desktop with three files in it and no name.',
      { beat: 'Naming it makes it a thing you are doing. Leaving it unnamed means you can still be somebody who trades stocks and goes to bed.' }],
    choicesHead: 'The folder',
    choices: [
      { label: 'Name it. Dates, sources, and a column for everything you cannot prove.', to: 'd1_power_open', tone: 'evidence', fx: { credibility: 5, integrity: 4, composure: -6, flag: { openedFile: true }, note: 'Opened a proper file, gaps included.' } },
      { label: 'Leave it unnamed. Keep watching.', to: 'd1_power_open', tone: 'safe', fx: { composure: 3 } },
      { label: 'Delete it. This is a stock, not a conspiracy.', to: 'd1_power_open', tone: 'risk', fx: { composure: 10, credibility: -3, flag: { deletedFile: true }, note: 'Deleted the folder.' } }
    ]
  },

  /* ======================================= POWER HOUR ======================================= */
  d1_power_open: {
    phase: 'd1_power',
    text: [
      { lede: 'At 15:20 the bid steps up like somebody flipped a switch, and the room decides this is a miracle.' },
      'Five forty-two to six thirty-one in fifty minutes, on volume arriving in identical blocks. Nobody in three thousand people asks who is buying. They only ask how high.',
      { s: 'dorian', t: 'Told you. Patience.' }
    ],
    choices: [{ label: 'Power hour', to: '__hub_d1_power_desk', tone: 'ember' }]
  },

  d1_ph_floor: A({
    phase: 'd1_power', at: 'desk', tone: 'evidence',
    label: 'Watch who is defending the price', detail: 'Twenty minutes of doing nothing else. The hardest thing you will do today.',
    text: [
      { sys: '15:22:11  5.44 ×800    15:24:03  5.44 ×800\n15:27:40  5.46 ×800    15:31:16  5.47 ×800\n15:36:02  5.51 ×800    15:39:55  5.55 ×800', kind: 'doc' },
      'It never lets it print below 5.42. Not once. Every time the offer gets heavy, the same eight hundred shares step in and take it.',
      { beat: 'Somebody is not buying a stock. Somebody is buying a chart — because a chart is what gets screenshotted into forty thousand feeds tonight.' }
    ],
    onEnter: { flag: { sawFloor: true, sawProgram: true }, credibility: 3, composure: -4, note: 'Watched someone hold a floor for an hour.' }
  }),

  d1_ph_rest: A({
    phase: 'd1_power', at: 'desk', tone: 'safe',
    label: 'Get up. Make food. Look at the rain.', detail: 'Twelve minutes away from the screen. Cheaper than the mistake you are about to make.',
    text: ['You stand. Your knees crack. The kitchen is four steps away and you have not been in it since six.',
      'Toast. The rain in its three familiar channels. Somebody downstairs playing the same eight bars over and over.',
      { beat: 'When you sit back down the numbers are numbers again, your hands are cold, and you can think.' }],
    onEnter: { composure: 18, integrity: 3, note: 'Got up before the desk made the decision.' }
  }),

  d1_ph_trade: {
    kind: 'action', phase: 'd1_power', at: 'desk', cost: 0, tone: 'risk',
    label: 'Trade the close', detail: 'The last forty minutes decide the day.',
    text: [{ beat: 'Six-thirty and rising into the bell.' }],
    choicesHead: 'Trade the close',
    choices: [
      { label: 'Sell into the strength — use the floor somebody else is paying for', to: 'BACK', tone: 'safe', req: { position: true }, fx: { close: true, integrity: 5, note: 'Sold into manufactured strength.' } },
      { label: 'Buy the close with the floor under you', to: 'BACK', tone: 'risk', fx: { trade: { size: 'normal' }, composure: -8, note: "Bought the close leaning on somebody else's bid." } },
      { label: 'Short it. If this is what you think it is, it ends badly.', detail: 'Early and wrong pay out identically.', to: 'BACK', tone: 'risk', fx: { trade: { size: 'starter', dir: 'short', noStop: true }, composure: -14, flag: { shorted: true }, note: 'Shorted a stock being held up on purpose.' } },
      { label: 'Nothing. Watch the bell.', to: 'BACK', tone: 'safe', fx: { integrity: 3, composure: 4 } }
    ]
  },

  /* ---- HINGE 1 ---- */
  d1_ph_dorian: {
    kind: 'action', phase: 'd1_power', at: 'room', cost: 1, once: true, tone: 'ember',
    label: 'Message Dorian directly', detail: 'Three years of your trading education is on the other end of this chat.',
    text: [
      'Ninety seconds. For a man with nine thousand paying members that is a form of flattery and you both know it.',
      { s: 'dorian', t: 'There he is. Good morning?' },
      { s: 'dorian', t: 'Listen. I have been watching your videos. You are the only one of the young ones who does the work. I want you in Tier 3.' },
      { s: 'dorian', t: 'Different room. Forty people. We talk before we talk, if you follow me.' },
      { beat: 'You do follow him. That is exactly the problem.' }
    ],
    choices: [{ label: 'Answer him', to: 'H1_tier3', tone: 'ember' }]
  },

  H1_tier3: {
    kind: 'hinge', phase: 'd1_power', hinge: 'H1',
    title: 'The room behind the room',
    text: [{ beat: 'Forty people. A pinned rule that says what is said here is said nowhere else. He is holding the door open and waiting.' }],
    choicesHead: 'Tier 3',
    choices: [
      { label: '"What does Tier 3 actually do?"', detail: 'Make him describe it in words that exist.', to: 'H1_ask', tone: 'evidence' },
      { label: '"I am in."', detail: 'Access is access. You can decide what you are later.', to: 'H1_yes', tone: 'risk' },
      { label: '"No. I like being able to say what I see."', detail: 'Close the only door into the room behind the room.', to: 'H1_no', tone: 'safe' }
    ]
  },
  H1_ask: { phase: 'd1_power', back: 'room',
    text: [{ s: 'dorian', t: 'It does what every serious desk does. Information moves through people before it moves through wires. That is not a scandal, that is Tuesday.' },
      { s: 'you', t: 'Moves how?' },
      { s: 'dorian', t: 'You are asking me to write something down.' },
      { s: 'dorian', t: 'I like you. The invitation stays open until tomorrow night. I am going to stop typing now.' },
      'And he does. The last message sits there like a hand held out over a gap.'],
    onEnter: { rel: { dorian: 3 }, credibility: 3, flag: { tier3Open: true }, note: 'Made Dorian refuse to put it in writing.' } },
  H1_yes: { phase: 'd1_power', back: 'room',
    text: ['The invite arrives before you finish exhaling. A separate room. Forty names. A pinned message: *what is said here is said nowhere else.*',
      { beat: 'You are inside. Whatever you find in here, you found after agreeing to that sentence.' }],
    onEnter: { rel: { dorian: 12 }, integrity: -4, credibility: -2, composure: -8, flag: { tier3: true }, note: 'Accepted Tier 3 access.',
      closes: ['You agreed to a confidentiality rule before reading it. Anything you take out of Tier 3 will be argued about.'] } },
  H1_no: { phase: 'd1_power', back: 'room',
    text: [{ s: 'dorian', t: 'Careful. You are turning down a chair you have been asking about for three years.' },
      { s: 'you', t: 'I know what I am doing.' },
      { s: 'dorian', t: 'I hope so. Doors like this get quieter every year.' },
      'It is not a threat. It is worse than a threat, because he is right and you both know it.'],
    onEnter: { rel: { dorian: -6 }, integrity: 6, credibility: 4, flag: { refusedTier3: true }, note: 'Turned down the room behind the room.',
      closes: ['Tier 3 is closed to you. The ledger will have to reach you another way.'] } },

  d1_power_beat: {
    kind: 'beat', phase: 'd1_power',
    text: [
      { sys: 'TESSERA MARKETS · 16:00:00 · CLOSING PRINT\nMB:HALX  6.31   +111.7% on session   Vol 21.4M', kind: 'alert' },
      'It closed on the high. Twenty-one million shares through a four-million-share float, and it closed on the high, and not one person in that room sold.',
      { beat: 'That does not happen. Something has to sell for something else to close on the high — unless somebody arranged for nothing to be for sale.' }
    ],
    choices: [{ label: 'After hours', to: 'd1_after_open', tone: 'ember' }]
  },

  /* ======================================= AFTER HOURS ======================================= */
  d1_after_open: {
    phase: 'd1_after',
    text: [
      { lede: 'After hours the city gets its colour back — sodium orange, wet asphalt, the tower across the street with four windows still lit at ten past five.' },
      'Your phone rings. Not a message. A call. Sable Reyes has never once called you.'
    ],
    onEnter: { flag: { dinerOpen: true }, gain: ['E02'] },
    choices: [{ label: 'Answer', to: 'H2_sable', tone: 'ember' }]
  },

  /* ---- HINGE 2 ---- */
  H2_sable: {
    kind: 'hinge', phase: 'd1_after', hinge: 'H2',
    title: 'The call from the parking lot',
    text: [
      'She is in a car. You can hear the wipers.',
      { s: 'sable', t: 'I cashed it. The six thousand. Two hours ago.' },
      { s: 'sable', t: 'Then I sat in the parking lot and could not make myself go in and film the second one, so I am calling you, which is insane, because you are the person who is going to be disappointed in me.' },
      { s: 'you', t: 'I am not.' },
      { s: 'sable', t: 'You should be. There are two more. Three videos, one live session. They gave me talking points and one of the talking points is a *price.*' },
      { beat: 'That is the sentence. Not the money — the price. Somebody wrote a number and paid a person with ninety-one thousand followers to say it in her own voice.' }
    ],
    onEnter: { composure: -8 },
    choicesHead: 'She is waiting',
    choices: [
      { label: '"Send me the contract. Not to use — so you are not the only one holding it."', detail: 'Take the weight. Get the document as a consequence, not a goal.', to: 'H2_a', tone: 'evidence' },
      { label: '"Give the money back and post the truth tonight."', detail: 'The right answer, delivered to someone four months in arrears.', to: 'H2_b', tone: 'safe' },
      { label: '"Film them. I will use them later."', detail: 'Let her burn so the fire is bigger when you point at it.', to: 'H2_c', tone: 'risk' },
      { label: '"Take the money. Everyone is taking the money."', detail: 'Absolution is free and she is desperate for it.', to: 'H2_d', tone: 'risk' }
    ]
  },
  H2_a: { phase: 'd1_after', back: 'desk',
    text: ['The PDF arrives while she is still on the line. Two pages. *Bellwether Investor Relations LLC.* Deliverables, payment on publication, and a clause about "organic tone" somebody typed on purpose.',
      { s: 'sable', t: 'what do i do' },
      { s: 'you', t: 'Tonight? Nothing. Do not film. Do not post. Do not spend it. That is the whole list.' },
      { s: 'sable', t: 'ok' }, { s: 'sable', t: 'ok. thank you.' }],
    onEnter: { rel: { sable: 16 }, integrity: 4, flag: { sableAlly: true, studioOpen: true }, note: 'Took the weight off Sable instead of the story out of her.' } },
  H2_b: { phase: 'd1_after', back: 'desk',
    text: [{ s: 'sable', t: 'Give it back.' },
      { s: 'sable', t: 'Sure. And on thursday i hand the landlord a screenshot of my integrity.' },
      'Quiet except for the wipers. When she speaks again she sounds very tired and very far away.',
      { s: 'sable', t: 'you are not wrong. i just needed you to be wrong tonight.' }],
    onEnter: { rel: { sable: -4 }, integrity: 5, credibility: 2, flag: { studioOpen: true }, note: 'Gave Sable the correct answer and none of the help.' } },
  H2_c: { phase: 'd1_after', back: 'desk',
    text: [{ s: 'sable', t: 'you mean that?' }, { s: 'you', t: 'I mean it is not my business.' },
      'A lie with a clean surface. You have decided that somebody you like is worth more as an exhibit than as a friend.',
      { beat: 'It will work. That is the part you will think about later.' }],
    onEnter: { rel: { sable: 5 }, integrity: -10, credibility: -3, flag: { usingSable: true }, note: 'Let Sable dig the hole because the hole was useful.',
      closes: ['Sable will not testify for you. She is a witness against herself now, and you helped.'] } },
  H2_d: { phase: 'd1_after', back: 'desk',
    text: [{ s: 'sable', t: 'yeah' }, { s: 'sable', t: 'yeah, everyone is.' },
      'She hangs up first. The videos go up over the next two days, and every view is partly yours.'],
    onEnter: { rel: { sable: 8 }, integrity: -12, credibility: -6, flag: { enabledSable: true, sableBurned: true }, note: 'Gave Sable permission.',
      closes: ['E-02 is out of reach. Sable will never hand you that contract.'] } },

  d1_ah_file: A({
    phase: 'd1_after', at: 'desk', tone: 'evidence',
    label: 'Work the file', detail: 'Sort today into proven, unproven, and wishful.',
    text: ['Three columns. PROVEN. UNPROVEN. WANT TO BE TRUE.',
      'The third column is the longest, and that is the most useful thing you learn all day.',
      { beat: 'A story that only works if every unproven thing is true is not a story. It is a hope with footnotes.' }],
    onEnter: { credibility: 5, integrity: 4, composure: 4, flag: { openedFile: true }, note: 'Sorted what was proven from what you wanted to be true.' }
  }),

  d1_ah_wick: A({
    phase: 'd1_after', at: 'desk', tone: 'social',
    label: 'Tell CANDLEWICK what you saw', detail: 'Watch how a source reacts to being told something for once.',
    text: [{ s: 'you', t: 'Somebody held a floor at 5.42 for an hour. Eight hundred share blocks. It never printed lower once.' },
      'Nine minutes of nothing.',
      { s: 'candlewick', t: 'you saw that today.' },
      { s: 'candlewick', t: 'i watched a man do that for eleven weeks in 2021 and tell four hundred people it was accumulation. tomorrow he does it again and somebody puts their rent in it.' },
      { s: 'candlewick', t: 'you are asking whether i am reliable. wrong question. ask whether the documents are.' },
      { beat: 'Eleven weeks. In 2021. *Watched.* That is not the vocabulary of an outsider.' }],
    onEnter: { rel: { candlewick: 10 }, gain: ['E06'], note: 'Learned the source was inside the room, once.' }
  }),

  d1_ah_post: {
    kind: 'action', phase: 'd1_after', at: 'desk', cost: 1, once: true, tone: 'social',
    label: 'Post your day recap', detail: 'Fourteen thousand people, most of whom held this today.',
    text: [{ beat: 'The camera light is red.' }],
    choicesHead: 'Say something',
    choices: [
      { label: 'Teach the float. No names, no accusations, just mechanics.', to: 'd1_ah_post_a', tone: 'safe' },
      { label: 'Hint that something is wrong', detail: 'Enough for engagement, not enough to be responsible for it.', to: 'd1_ah_post_b', tone: 'risk' },
      { label: 'Post nothing tonight', to: 'BACK', tone: 'safe', fx: { composure: 4 } }
    ]
  },
  d1_ah_post_a: { phase: 'd1_after', back: 'desk',
    text: ['Eight minutes on mechanics. Float, lockups, why volume can exceed tradeable shares five times over, why a stock closing on its high on enormous volume is not automatically good news.',
      'Six thousand views. Two hundred saves. A comment from a name you recognise from the room: *i sized down after watching this. thank you.*',
      { beat: 'You named nobody. You did not need to. The people who needed it got it, and the people who would sue you have nothing to sue.' }],
    onEnter: { credibility: 9, rel: { nadia: 4, dorian: -3 }, note: 'Taught mechanics without an accusation you could not prove.' } },
  d1_ah_post_b: { phase: 'd1_after', back: 'desk',
    text: ['*Some of you should look very carefully at who was buying today. That is all I am going to say.*',
      'Forty thousand views in two hours. Your biggest post ever. The replies are a bonfire — half naming people you never named, half calling you a jealous nobody.',
      { beat: 'You have started something you cannot steer, with material you cannot prove, in front of the person it is about.' }],
    onEnter: { credibility: -5, composure: -14, rel: { dorian: -10, nadia: -5 }, flag: { publicDoubt: true, teasedPublicly: true }, note: 'Teased an accusation you could not support.' } },

  d1_ah_sleep: A({
    phase: 'd1_after', at: 'desk', tone: 'safe',
    label: 'Sleep', detail: 'A real decision, with real effects, that nobody ever makes.',
    text: ['Laptop closed at 21:40, early enough that it feels like defiance.',
      'You do the arithmetic anyway, but at some point the arithmetic becomes rain, and then it becomes nothing.',
      { beat: 'Seven hours. Tomorrow you will be the only person in this story who is not exhausted.' }],
    onEnter: { composure: 26, integrity: 4, flag: { slept1: true }, note: 'Slept.' }
  }),

  d1_ah_diner: A({
    phase: 'd1_after', at: 'diner', tone: 'safe', cost: 1,
    label: 'Sit with Nadia', detail: 'She ordered for you. She always orders for you.',
    text: [
      'Kettleman\'s at nine on a Tuesday: four people, one of them asleep. Nadia has the corner booth and a notebook open in front of her.',
      'You tell her all of it in one breath — the timestamps, the metronome, the muting, the burner account.',
      'She is quiet for eight seconds, which from Nadia is a paragraph.',
      { s: 'nadia', t: 'Two things, and you will not like the second.' },
      { s: 'nadia', t: 'One: you are probably right. The tape reads wrong and I saw it too.' },
      { s: 'nadia', t: 'Two: right now you have screenshots and a feeling. Say any of it out loud with only that and you are not a whistleblower, you are a defendant. Get the log. Get the raw prints. Get a document with a header on it.' },
      { s: 'you', t: 'And if I get all of that?' },
      { s: 'nadia', t: 'Then I help you carry it. But you do not get to do the brave version before you do the boring version.' },
      'She tears the carbon copy out of the back of the notebook and slides it across the formica. One line per rule, in pen.'
    ],
    onEnter: { rel: { nadia: 10 }, integrity: 5, composure: 12, flag: { nadiaOnBoard: true, riskSheet: true }, note: 'Told Nadia everything and accepted the boring version first.' }
  }),

  d1_after_beat: {
    kind: 'beat', phase: 'd1_after',
    text: ['23:14. Your phone lights the ceiling.',
      { s: 'candlewick', t: 'tomorrow they halt it. that is not a prediction, that is a schedule.' },
      { s: 'candlewick', t: 'watch what the room does in the eleven minutes it is frozen. that is when you see who knows.' },
      { beat: 'You put the phone face down. It glows through the case anyway, like a coal.' }],
    choices: [{ label: 'Day two', to: 'd2_premarket_open', tone: 'ember', fx: { flag: { day1Done: true } } }]
  }

  });
})(window.LC);
