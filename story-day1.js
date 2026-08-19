/* ============================================================
   DAY ONE — IGNITION
   ============================================================ */
(function (LC) {
  'use strict';
  LC.nodes = LC.nodes || {};

  Object.assign(LC.nodes, {

  /* ---------------------------------------------------------- PRE-MARKET */
  d1_premarket_open: {
    phase: 'd1_premarket',
    text: [
      { lede: 'Rain again. Four days of it, running down the window in the same three channels, like the glass has learned a habit.' },
      'Three monitors. A cold mug you keep meaning to move. Twenty-eight thousand four hundred dollars that took you two years and one very bad summer to rebuild, sitting in a brokerage account with your name spelled slightly wrong.',
      'On the left screen, fourteen thousand people follow a person called @nightdesk who explains charts calmly and never tells anyone what to buy. That person is also you, and the difference between the two of you is the only thing you own that nobody can margin-call.',
      { sys: 'TESSERA MARKETS · PRE-MARKET 07:12\nHALX — Halcyon Exogrid Inc.\nLast 4.35  (+46.0%)  Vol 1.2M  Float 4.1M', kind: 'doc' },
      'Forty-six percent, overnight, on a company you had never heard of on Friday.',
      { beat: 'The room is already screaming. You have four hours until the open and a finite amount of attention. Spend it.' }
    ],
    choices: [{ label: 'Sit down at the desk', to: 'd1_premarket_hub', tone: 'ember' }]
  },

  d1_premarket_hub: {
    phase: 'd1_premarket',
    hub: true,
    text: [{ beat: 'Pre-market. The tape is thin and everything you decide now will feel obvious in hindsight, in one direction or the other.' }],
    choicesHead: 'Pre-market',
    choices: [
      { label: 'Open the Candle Room', detail: "Dorian's private community. Two thousand people awake at seven in the morning.", to: 'd1_pm_room', cost: 1, once: true, tone: 'social' },
      { label: 'Actually read the press release', detail: 'All of it, including the part in the footnotes.', to: 'd1_pm_read', cost: 1, once: true, tone: 'evidence' },
      { label: 'Message Nadia', detail: 'She will tell you the truth, which is not always what you want at 7am.', to: 'd1_pm_nadia', cost: 1, once: true, tone: 'social' },
      { label: 'Write your plan before you look at the price again', detail: 'Size, stop, invalidation, walk-away number.', to: 'd1_pm_plan', cost: 1, once: true, tone: 'safe' },
      { label: 'Film a pre-market video', detail: 'Fourteen thousand people will watch you be either careful or exciting.', to: 'd1_pm_film', cost: 1, once: true, tone: 'social' },
      { label: 'The bell is coming — take your seat', to: 'd1_premarket_beat', tone: 'ember', advance: true }
    ]
  },

  d1_pm_room: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: [
      'The room loads the way it always does: a wall of green, a wall of noise, and Dorian at the top of it in a pinned message that has been there since 2019.',
      { s: 'dorian', t: 'Morning, room. Watchlist is one line today. HALX. Nobody chase. I will post my plan when I have one.' },
      'It is a good message. It is the kind of message you have quoted in your own videos as an example of a responsible community. Four hundred people react to it with a rocket.',
      'Underneath, somebody called mira_k has typed: *third time this month a nothing company gaps forty percent overnight. weird.* Eleven people have told her to log off.'
    ],
    onEnter: { stress: 4, flag: { readRoom: true } }
  },

  d1_pm_read: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: [
      'The release is four hundred words. You read it twice and then a third time with a pen.',
      { sys: 'HALCYON EXOGRID INC. announces a non-binding letter of intent with a regional utility partner regarding potential deployment of its grid-scale storage platform. Terms were not disclosed. The Company expects to provide further updates as milestones are achieved.', kind: 'doc' },
      '*Non-binding. Letter of intent. Potential. Not disclosed. Expects to.* Five hedges in one sentence. There is no contract in this contract announcement.',
      'Then, because you are the kind of person who does this, you open the placement prospectus filed two months ago and start skimming the parts nobody reads.',
      { beat: 'Page 41 is about a lockup. You do not fully understand it yet, but you know enough to know it matters.' }
    ],
    onEnter: { gain: ['E05'], credibility: 3, flag: { readPR: true }, note: 'Read the filings before the open.' }
  },

  d1_pm_nadia: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: [
      'She answers in eleven seconds, which means she was already awake and already looking.',
      { s: 'nadia', t: 'Before you ask: yes I see it. No I am not in it. Four million float, forty-six percent gap, and a press release with the word *potential* in it.' },
      { s: 'nadia', t: 'You are allowed to trade it. You are not allowed to trade it with a size that makes you a different person by lunchtime. Tell me your stop before you tell me your target.' },
      { s: 'you', t: 'I have not decided anything yet.' },
      { s: 'nadia', t: "Good. That is the only sentence I have heard today that wasn't someone's P&L talking." },
      'She sends a screenshot of her own risk sheet: a maximum loss per idea, written in pen, photographed because she does not trust software with promises she makes to herself.'
    ],
    onEnter: { rel: { nadia: 5 }, stress: -5, integrity: 3, flag: { nadiaBriefed: true } }
  },

  d1_pm_plan: {
    phase: 'd1_premarket',
    text: [
      'You open the notebook. Not the app — the notebook, because things you write by hand are harder to lie to.',
      { beat: 'A plan is not a prediction. It is a promise about what you will do when you are frightened.' }
    ],
    choicesHead: 'Write it down',
    choices: [
      { label: 'Small starter, hard stop, one add only', detail: 'Boring. Repeatable. The version of you that survives to Thursday.', to: 'd1_pm_plan_a', tone: 'safe' },
      { label: 'Full size on any pullback, no stop — conviction play', detail: 'The room would applaud this. The room is not the one wiring your rent.', to: 'd1_pm_plan_b', tone: 'risk' },
      { label: 'No position. Watch and take notes.', detail: 'You cannot be shaken out of a trade you never took.', to: 'd1_pm_plan_c', tone: 'safe' }
    ]
  },
  d1_pm_plan_a: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: ['You write four lines and underline the third one twice: *if it prints below the pre-market low, I am wrong and I am out, and I do not get a vote.*'],
    onEnter: { integrity: 8, stress: -4, flag: { hasPlan: true, planKind: 'tight' }, note: 'Wrote a plan with a stop and kept it in view.' }
  },
  d1_pm_plan_b: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: [
      'You write *CONVICTION* at the top of the page and then you stop, because you cannot think of a fifth word that is not just a feeling wearing a suit.',
      { beat: 'Somewhere in your chest something quietly notes that this is how the bad summer started.' }
    ],
    onEnter: { integrity: -9, stress: 8, flag: { hasPlan: true, planKind: 'loose' }, note: 'Called a feeling a plan.' }
  },
  d1_pm_plan_c: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: ['*No position. Observation only. Log everything.* It is the least exciting sentence you have ever written and the only one that has never cost you money.'],
    onEnter: { integrity: 10, stress: -8, credibility: 2, flag: { hasPlan: true, planKind: 'flat' }, note: 'Chose to sit out the first day.' }
  },

  d1_pm_film: {
    phase: 'd1_premarket',
    text: [
      'The ring light makes the room look like a place where a professional works. You have ninety seconds of attention from fourteen thousand people and two ways to spend it.'
    ],
    choicesHead: 'Record',
    choices: [
      { label: '"Here is why this move is fragile."', detail: 'Explain float, hedged language, and what would make you wrong. Fewer views. Better people.', to: 'd1_pm_film_a', tone: 'safe' },
      { label: '"This is the setup of the year."', detail: 'You would not be lying, exactly. You would be leaving out everything that makes it a lie.', to: 'd1_pm_film_b', tone: 'risk' }
    ]
  },
  d1_pm_film_a: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: [
      'You hold the release up to the camera and read the hedges out loud. Two thousand views by 9am, which is a third of your usual.',
      'The comments are mostly people telling you that you are boring, and one from a stranger that says: *thank you, i was about to put my savings in this.*'
    ],
    onEnter: { credibility: 7, rel: { nadia: 4, dorian: -3 }, note: 'Told your audience what could go wrong before telling them what could go right.' }
  },
  d1_pm_film_b: {
    phase: 'd1_premarket', back: 'd1_premarket_hub',
    text: [
      'Nineteen thousand views before the bell. Your best morning ever. The comments are all fire emojis and one that says *finally you get it.*',
      { beat: 'You watch it back once and notice you never said the word *risk*.' }
    ],
    onEnter: { credibility: -6, stress: 6, rel: { dorian: 6, nadia: -6 }, flag: { hypedEarly: true }, note: 'Sold excitement you had not verified.' }
  },

  d1_premarket_beat: {
    phase: 'd1_premarket',
    text: [
      { sys: 'TESSERA MARKETS · 09:28:40\nHALX  4.41  ·  pre-market volume 1.9M  ·  order book: 300 shares on the bid', kind: 'alert' },
      'Three hundred shares on the bid. In ninety seconds, forty thousand people are going to try to fit through that door at once.'
    ],
    choicesHead: 'The bell',
    choices: [
      { label: 'Flat. Watch the first fifteen minutes and write down what actually happens.', detail: 'No position. No adrenaline. Full attention.', to: 'd1_open_open', tone: 'safe', fx: { integrity: 6, stress: -6, note: 'Sat out the open.' } },
      { label: 'Starter position with a stop under the pre-market low', detail: 'Small enough that being wrong is a lesson, not an event.', to: 'd1_open_open', tone: 'safe', fx: { trade: { size: 'starter' }, note: 'Opened a starter with a defined stop.' } },
      { label: 'Full planned size at the open', detail: 'The size you told yourself was fine when the price was two dollars lower.', to: 'd1_open_open', tone: 'risk', fx: { trade: { size: 'normal' }, stress: 5, note: 'Opened full size into the bell.' } },
      { label: 'Everything. Right now. Before it leaves.', detail: 'Ninety percent of the account into a four-million-share float at the open.', to: 'd1_open_open', tone: 'risk', req: { notFlag: ['planKindFlat'] }, fx: { trade: { size: 'allin', noStop: true }, stress: 16, note: 'Put the account into one open.' } }
    ]
  },

  /* ---------------------------------------------------------- OPEN */
  d1_open_open: {
    phase: 'd1_open',
    text: [
      { lede: 'The bell does not ring anywhere near you. It arrives as a change in the texture of the numbers.' },
      'Four thirty-five. Four ninety. Five sixty. Five ten. Six forty-two. Four-oh-two. Back to five ninety, in eleven minutes, on nine million shares in a company that has four million to sell.',
      'That last part is the whole story and almost nobody in the room is saying it out loud.',
      { beat: 'The room is at three thousand eight hundred people. Your hands are warm. That is a signal, and not about the stock.' }
    ],
    choices: [{ label: 'Work the open', to: 'd1_open_hub', tone: 'ember' }]
  },

  d1_open_hub: {
    phase: 'd1_open',
    hub: true,
    text: [{ beat: 'Eleven minutes in. Everything is loud. Choose what you are actually looking at.' }],
    choicesHead: 'Opening volatility',
    choices: [
      { label: 'Watch the tape, not the chart', detail: 'Time and sales. Who is actually trading, in what size, and when.', to: 'd1_op_tape', cost: 1, once: true, tone: 'evidence' },
      { label: 'Read what Dorian posted', detail: 'He said "in" at 09:41.', to: 'd1_op_dorian', cost: 1, once: true, tone: 'social' },
      { label: 'Add to the position', detail: 'Everyone who has ever blown up has done this at exactly this moment.', to: 'd1_op_add', cost: 1, req: { position: true }, tone: 'risk' },
      { label: 'Take the trade off', detail: 'Close the position. Bank it, or eat it, and stop bleeding attention.', to: 'd1_op_close', cost: 1, req: { position: true }, tone: 'safe' },
      { label: 'Open a position now', detail: 'You are flat and it is going without you. That sentence has cost more money than any other.', to: 'd1_op_chase', cost: 1, req: { position: false }, tone: 'risk' },
      { label: 'Let the open finish without you', to: 'd1_open_beat', tone: 'ember', advance: true }
    ]
  },

  d1_op_tape: {
    phase: 'd1_open', back: 'd1_open_hub',
    text: [
      'You pull the time and sales up on the right monitor and stop reading the chart entirely.',
      { sys: '09:33:02  4.62  ×800\n09:33:09  4.64  ×800\n09:33:41  4.66  ×800\n09:34:15  4.69  ×800\n09:35:50  4.71  ×800', kind: 'doc' },
      'Eight hundred shares. Every time. Never a round thousand, never a stray odd lot. A metronome wearing a costume.',
      { beat: 'Retail does not buy like a metronome. Retail buys like a panic.' }
    ],
    onEnter: { flag: { sawProgram: true }, credibility: 2, note: 'Read the tape and noticed the pattern under the noise.' }
  },

  d1_op_dorian: {
    phase: 'd1_open', back: 'd1_open_hub',
    text: [
      { s: 'dorian', t: 'In. Averaged well. Managing.' },
      'Posted 09:41. Attached: a screenshot of his fills, because the room likes receipts.',
      'You look at the screenshot for a long time. The fill price in the corner is 4.66.',
      { beat: 'The tape only touched 4.66 between 09:33 and 09:36. He posted at 09:41. He bought five minutes before he told two thousand people to look at it.' },
      'Somebody named mira_k has just typed the same observation into the room, in worse words.',
      { sys: 'modbot: mira_k has been muted for 30 minutes: rule 4, no accusations.', kind: 'alert' }
    ],
    onEnter: { flag: { sawFills: true }, stress: 6 },
    choicesHead: 'That screenshot is still on your screen',
    choices: [
      { label: 'Screenshot it. Timestamp it. Save it somewhere that is not the room.', detail: 'You are not accusing anyone. You are keeping a copy.', to: 'd1_open_hub', tone: 'evidence', fx: { gain: ['E03'], stress: 3, note: 'Started keeping copies.' } },
      { label: 'Defend mira_k publicly in the room', detail: 'Say the quiet thing in front of three thousand people with nothing but a screenshot.', to: 'd1_op_defend', tone: 'risk' },
      { label: 'Close the tab. This is how paranoid people start.', detail: 'Plenty of traders have sloppy screenshots.', to: 'd1_open_hub', tone: 'safe', fx: { stress: -3, rel: { dorian: 2 }, note: 'Let the timestamp go.' } }
    ]
  },
  d1_op_defend: {
    phase: 'd1_open', back: 'd1_open_hub',
    text: [
      'You type it: *her question is reasonable and muting her instead of answering it is worse than the question.* You hit enter before the part of you that thinks about consequences catches up.',
      'Four seconds of nothing. Then ninety messages at once.',
      { s: 'dorian', t: 'I have known you three years. You are better than this. Cool off.' },
      'You are not muted. Somehow that is worse — it means he wants everyone to watch you being wrong.'
    ],
    onEnter: { rel: { dorian: -14, nadia: 3 }, credibility: -3, stress: 12, flag: { publicDoubt: true, sableWary: true }, note: 'Accused the room out loud with a screenshot and nothing else.' }
  },

  d1_op_add: {
    phase: 'd1_open',
    text: [{ beat: 'It is at five ninety. You are green. The room is screaming. Your finger is already on the size field.' }],
    choicesHead: 'How much',
    choices: [
      { label: 'One planned add. The one you wrote down.', to: 'd1_open_hub', tone: 'safe', fx: { trade: { size: 'starter' }, note: 'Added once, as planned.' } },
      { label: 'Double it', to: 'd1_open_hub', tone: 'risk', fx: { trade: { size: 'heavy' }, stress: 8, note: 'Doubled into strength.' } },
      { label: 'Use margin', detail: 'Money that is not yours, in a stock with no floor.', to: 'd1_open_hub', tone: 'risk', fx: { trade: { size: 'margin', noStop: true }, stress: 18, flag: { usedMargin: true }, note: 'Went on margin.' } }
    ]
  },
  d1_op_close: {
    phase: 'd1_open', back: 'd1_open_hub',
    text: ['You hit the flatten button. The position disappears and the noise in your head drops by about a third, which tells you something about what the noise was made of.'],
    onEnter: { close: true, note: 'Closed the position during the open.' }
  },
  d1_op_chase: {
    phase: 'd1_open',
    text: [{ beat: 'Six-forty. Five ninety. It has already doubled off the pre-market low. Somewhere behind your eyes a voice is saying *this time*.' }],
    choicesHead: 'Chase',
    choices: [
      { label: 'Small. Late is not a strategy, but small and late is survivable.', to: 'd1_open_hub', tone: 'risk', fx: { trade: { size: 'starter' }, stress: 6, note: 'Chased small.' } },
      { label: 'Full size. You have watched it go without you for eleven minutes.', to: 'd1_open_hub', tone: 'risk', fx: { trade: { size: 'heavy', noStop: true }, stress: 14, note: 'Chased in size.' } },
      { label: 'No. Sit on your hands.', to: 'd1_open_hub', tone: 'safe', fx: { integrity: 5, stress: -5, note: 'Refused the chase.' } }
    ]
  },

  d1_open_beat: {
    phase: 'd1_open',
    text: [
      'By 10:15 the volatility has drained out of it and what is left is a stock sitting at five ninety with nine million shares of history behind it.',
      { beat: 'Your phone buzzes. Not the room. A direct message, from an account with no picture and no posts.' },
      { s: 'candlewick', t: 'you looked at the tape today instead of the chart. almost nobody does.' },
      { s: 'candlewick', t: 'ask yourself why the filing went up 47 minutes before the news did.' }
    ],
    choices: [{ label: 'Read that again', to: 'd1_midday_open', tone: 'ember' }]
  },

  /* ---------------------------------------------------------- MIDDAY */
  d1_midday_open: {
    phase: 'd1_midday',
    text: [
      { lede: 'Midday is the hour that separates traders from gamblers, mostly by boring the gamblers into mistakes.' },
      'The stock is bleeding sideways. The room has gone from four thousand to three, and the ones left are talking about lunch and averaging down.',
      'And there is a message on your phone from an account called CANDLEWICK, sent nine minutes ago, that you have now read fourteen times.',
      { s: 'candlewick', t: 'ask yourself why the filing went up 47 minutes before the news did.' },
      { beat: 'It could be nothing. Filings post when they post. It could also be the first true sentence anyone has said to you about this stock.' }
    ],
    onEnter: { gain: ['E01'], stress: 5 },
    choices: [{ label: 'Get to work', to: 'd1_midday_hub', tone: 'ember' }]
  },

  d1_midday_hub: {
    phase: 'd1_midday',
    hub: true,
    text: [{ beat: 'Four hours of low volume. The most useful part of the day, if you can stay off the buy button.' }],
    choicesHead: 'Midday',
    choices: [
      { label: 'Reply to CANDLEWICK', detail: 'Somebody with no name is offering you something. Find out the price.', to: 'd1_md_wick', cost: 1, once: true, tone: 'social' },
      { label: 'Pull the archive access log', detail: 'The filing site logs when documents become publicly retrievable. Tedious. Definitive.', to: 'd1_md_archive', cost: 1, once: true, tone: 'evidence' },
      { label: 'Read page 41 properly', detail: 'The lockup language in the prospectus you skimmed this morning.', to: 'd1_md_lockup', cost: 1, once: true, req: { has: ['E05'] }, tone: 'evidence' },
      { label: 'Call Nadia', detail: 'Say the paranoid thing out loud to somebody who will push back on it.', to: 'd1_md_nadia', cost: 1, once: true, tone: 'social' },
      { label: 'Check on Sable', detail: 'She posted a video this morning and has not posted since.', to: 'd1_md_sable', cost: 1, once: true, tone: 'social' },
      { label: 'Manage the position', detail: 'You are still in the name.', to: 'd1_md_manage', cost: 1, req: { position: true }, tone: 'risk' },
      { label: 'Let the afternoon start', to: 'd1_midday_beat', tone: 'ember', advance: true }
    ]
  },

  d1_md_wick: {
    phase: 'd1_midday',
    text: [{ beat: 'The cursor blinks in the reply box. Whatever you type first will decide what kind of source this person becomes.' }],
    choicesHead: 'Reply',
    choices: [
      { label: '"Who are you and what do you want?"', detail: 'Direct. Sources who want something will tell you, eventually.', to: 'd1_md_wick_a', tone: 'evidence' },
      { label: '"Send me everything you have."', detail: 'Eager. Sources love eager. That is the problem with eager.', to: 'd1_md_wick_b', tone: 'risk' },
      { label: '"I do not take anonymous tips. Go on the record or go away."', detail: 'The clean answer. It may also end the only thread you have.', to: 'd1_md_wick_c', tone: 'safe' }
    ]
  },
  d1_md_wick_a: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      { s: 'candlewick', t: 'fair.' },
      { s: 'candlewick', t: 'i am someone who was in the room when it was five hundred people and it meant something. i want you to look at things and check them yourself. that is all i will say today.' },
      { s: 'you', t: 'People who want nothing do not use burner accounts.' },
      { s: 'candlewick', t: 'no. they do not. keep that thought, you will need it thursday.' }
    ],
    onEnter: { rel: { candlewick: 12 }, credibility: 2, note: 'Asked the source what they wanted before taking anything from them.' }
  },
  d1_md_wick_b: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      { s: 'candlewick', t: 'that was quick.' },
      'Three files arrive in under a minute, which means they were already selected and waiting. That is either preparation or a trap, and both look identical from here.',
      { s: 'candlewick', t: 'do not publish any of it yet. you will want to. do not.' }
    ],
    onEnter: { rel: { candlewick: 8 }, credibility: -2, stress: 6, flag: { eagerWithSource: true }, note: 'Asked an anonymous account for everything it had.' }
  },
  d1_md_wick_c: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      { s: 'candlewick', t: 'good. mostly right.' },
      { s: 'candlewick', t: 'but nobody goes on the record about a man with nine thousand followers and a lawyer on retainer. so here is what i will do instead: i will only ever send you things you can check without me. check them. if one of them is wrong, throw all of it away, including me.' },
      'It is, annoyingly, exactly the standard you would have set yourself.'
    ],
    onEnter: { rel: { candlewick: 6 }, credibility: 5, integrity: 3, flag: { sourceOnMyTerms: true }, note: 'Set the terms of the source relationship instead of accepting theirs.' }
  },

  d1_md_archive: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      'The archive has a retrieval log. It is ugly, paginated, and free, and almost nobody uses it because it takes forty minutes and returns a wall of monospace.',
      { sys: 'DOC ID 4471-A · amendment to registration statement\nfirst public retrieval  15:41:06\nwire distribution (per service header)  16:28:11\nelapsed  00:47:05', kind: 'doc' },
      'Forty-seven minutes and five seconds. Not a rounding error. Not a timezone. A window.',
      { beat: 'In that window, on yesterday\'s tape, someone bought eight hundred shares at a time, over and over, like a metronome.' }
    ],
    onEnter: { flag: { archiveLog: true }, credibility: 4, stress: 5, note: 'Pulled the archive retrieval log by hand.' }
  },

  d1_md_lockup: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      'Page 41, paragraph three, in the sentence structure that legal documents use when they would prefer you stopped reading.',
      { sys: 'Holders of the Placement Shares have agreed not to offer, sell or otherwise dispose of such shares until the close of trading on the third business day following the Effective Date, after which such shares shall become freely tradable.', kind: 'doc' },
      'Third business day. You count on your fingers like a child and get Thursday.',
      { beat: 'Thursday at the close, the number of shares that can be sold roughly triples. Every candle before that is being painted on a floor that has an expiry date printed on it.' }
    ],
    onEnter: { verify: 'E05', credibility: 4, note: 'Verified the lockup expiry from the prospectus.' }
  },

  d1_md_nadia: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      'You tell her all of it in one breath: the timestamps, the metronome, the muting, the burner account.',
      'She is quiet for eight seconds, which from Nadia is a paragraph.',
      { s: 'nadia', t: "Okay. Two things, and you are not going to like the second one." },
      { s: 'nadia', t: 'One: you are probably right that something is wrong. The tape reads wrong and I saw it too.' },
      { s: 'nadia', t: 'Two: right now you have screenshots and a feeling, and if you say any of it out loud with only that, you are not a whistleblower, you are a defendant. Get the log. Get the raw time and sales. Get a document with a header on it.' },
      { s: 'you', t: 'And if I get all of that?' },
      { s: 'nadia', t: 'Then I will help you carry it. But you do not get to do the brave version before you do the boring version.' }
    ],
    onEnter: { rel: { nadia: 8 }, integrity: 4, stress: -8, flag: { nadiaOnBoard: true }, note: 'Told Nadia the whole thing and accepted the boring version first.' }
  },

  d1_md_sable: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      'Sable Reyes makes better videos than you do, has six times your audience, and has not been able to look at the camera properly for about a month.',
      { s: 'sable', t: 'hey. saw your morning video.' },
      { s: 'sable', t: 'can i ask you something and you not make it a whole thing' },
      { s: 'you', t: 'Always.' },
      { s: 'sable', t: 'if a company pays you to make a video about "market awareness" and you never actually say buy it, is that. is that fine' },
      { beat: 'There are about nine ways to answer this and eight of them end with her never asking you anything again.' }
    ],
    onEnter: { rel: { sable: 4 } },
    choicesHead: 'Answer her',
    choices: [
      { label: '"Depends. Did you disclose it?"', detail: 'The actual question, asked without judgment.', to: 'd1_md_sable_a', tone: 'evidence' },
      { label: '"No. It is not fine. You know it is not fine."', detail: 'True, and delivered like a door closing.', to: 'd1_md_sable_b', tone: 'risk' },
      { label: '"Everybody does it. Do not lose sleep."', detail: 'Kind. Cheap. Wrong.', to: 'd1_md_sable_c', tone: 'risk' }
    ]
  },
  d1_md_sable_a: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      { s: 'sable', t: 'they said the disclosure "kills the organic tone"' },
      { s: 'you', t: 'That is not a marketing note. That is the whole point of the payment.' },
      'Typing. Stopping. Typing again.',
      { s: 'sable', t: 'my landlord filed on tuesday. i have four months of nothing behind me and a bar chart of my own income that looks like a heart monitor flatlining. six thousand dollars.' },
      { s: 'sable', t: 'i have not cashed it.' },
      { s: 'you', t: 'Then you still have every option.' },
      { s: 'sable', t: 'do not tell anyone yet. please.' }
    ],
    onEnter: { rel: { sable: 14 }, gain: ['E02'], flag: { sableConfided: true }, note: 'Asked Sable the right question instead of the loud one.' }
  },
  d1_md_sable_b: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      { s: 'sable', t: 'ok' },
      { s: 'sable', t: 'thanks' },
      'She goes offline. Her last video stays up. You were right, which turns out to be a very small thing to be.'
    ],
    onEnter: { rel: { sable: -10 }, integrity: 2, stress: 5, note: 'Was right at Sable instead of useful to her.' }
  },
  d1_md_sable_c: {
    phase: 'd1_midday', back: 'd1_midday_hub',
    text: [
      { s: 'sable', t: 'ok. ok cool. thank you.' },
      { s: 'sable', t: 'i needed someone to say that' },
      { beat: 'You have just made it slightly easier for her to do the thing that is going to hurt her. It cost you nothing and it will cost her everything.' }
    ],
    onEnter: { rel: { sable: 6 }, credibility: -4, integrity: -6, flag: { enabledSable: true }, note: 'Told Sable what she wanted to hear.' }
  },

  d1_md_manage: {
    phase: 'd1_midday',
    text: [{ beat: 'You are still in it. Midday chop is where positions go to quietly become bigger problems.' }],
    choicesHead: 'The position',
    choices: [
      { label: 'Close it. Take the day off the table.', to: 'd1_midday_hub', tone: 'safe', fx: { close: true, note: 'Flattened at midday.' } },
      { label: 'Take half off, let the rest run with a stop at breakeven', to: 'd1_midday_hub', tone: 'safe', fx: { integrity: 6, stress: -6, note: 'Reduced risk and moved the stop to breakeven.' } },
      { label: 'Average down', detail: 'The most expensive two words in the language.', to: 'd1_midday_hub', tone: 'risk', fx: { trade: { size: 'heavy', noStop: true, revenge: true }, stress: 10, note: 'Averaged down at midday.' } },
      { label: 'Leave it alone and go back to the file', to: 'd1_midday_hub', tone: 'evidence', fx: { stress: 2 } }
    ]
  },

  d1_midday_beat: {
    phase: 'd1_midday',
    text: [
      'It is 14:40. You have a folder on your desktop with three files in it and no name.',
      { beat: 'Naming it makes it a thing you are doing. Not naming it means you can still be a person who trades stocks and goes to bed.' }
    ],
    choicesHead: 'The folder',
    choices: [
      { label: 'Name it. Start a proper file with dates, sources and gaps.', detail: 'Including a column for everything you cannot yet prove.', to: 'd1_power_open', tone: 'evidence', fx: { credibility: 5, integrity: 4, stress: 6, flag: { openedFile: true }, note: 'Opened a proper evidence file, gaps included.' } },
      { label: 'Leave it unnamed. Keep watching.', detail: 'Nothing is decided. Nothing is committed.', to: 'd1_power_open', tone: 'safe', fx: { stress: -3 } },
      { label: 'Delete it. This is a stock, not a conspiracy.', detail: 'Some people spend years being interesting instead of solvent.', to: 'd1_power_open', tone: 'risk', fx: { stress: -10, credibility: -3, flag: { deletedFile: true }, note: 'Deleted the folder.' } }
    ]
  },

  /* ---------------------------------------------------------- POWER HOUR */
  d1_power_open: {
    phase: 'd1_power',
    text: [
      { lede: 'At 15:20 the bid steps up like someone flipped a switch, and the room decides this is a miracle.' },
      'Five forty-two to six thirty-one in fifty minutes on volume that arrives in identical blocks. Nobody in three thousand people asks who is buying. They only ask how high.',
      { s: 'dorian', t: 'Told you. Patience.' }
    ],
    choices: [{ label: 'Power hour', to: 'd1_power_hub', tone: 'ember' }]
  },

  d1_power_hub: {
    phase: 'd1_power',
    hub: true,
    text: [{ beat: 'Fifty-six minutes to the close. Everything that happens now happens at twice speed.' }],
    choicesHead: 'Power hour',
    choices: [
      { label: 'Watch who is defending the price', detail: 'Somebody is holding a floor under this, block by identical block.', to: 'd1_ph_floor', cost: 1, once: true, tone: 'evidence' },
      { label: 'Message Dorian directly', detail: 'Three years of your trading education is on the other end of this chat.', to: 'd1_ph_dorian', cost: 1, once: true, tone: 'social' },
      { label: 'Trade the close', detail: 'The last forty minutes are where the day is decided.', to: 'd1_ph_trade', cost: 1, tone: 'risk' },
      { label: 'Get up. Make food. Look at the rain.', detail: 'Twelve minutes away from the screen. Cheaper than the mistake you are about to make.', to: 'd1_ph_rest', cost: 1, once: true, tone: 'safe' },
      { label: 'Ride it into the bell', to: 'd1_power_beat', tone: 'ember', advance: true }
    ]
  },

  d1_ph_floor: {
    phase: 'd1_power', back: 'd1_power_hub',
    text: [
      'You sit with the time and sales for twenty minutes and do nothing else, which is the hardest thing you will do today.',
      { sys: '15:22:11  5.44  ×800   15:24:03  5.44  ×800\n15:27:40  5.46  ×800   15:31:16  5.47  ×800\n15:36:02  5.51  ×800   15:39:55  5.55  ×800', kind: 'doc' },
      'It never lets it print below 5.42. Not once. Every time the offer gets heavy, the same eight hundred shares step in and take it.',
      { beat: 'Somebody is not buying a stock. Somebody is buying a chart, because a chart is what gets screenshotted into forty thousand feeds tonight.' }
    ],
    onEnter: { flag: { sawProgram: true, sawFloor: true }, credibility: 3, stress: 4, note: 'Watched someone hold a floor under the price for an hour.' }
  },

  d1_ph_dorian: {
    phase: 'd1_power',
    text: [
      'He answers in ninety seconds, which for a man with nine thousand paying members is a form of flattery and you both know it.',
      { s: 'dorian', t: 'There he is. You had a good morning?' },
      { s: 'dorian', t: 'Listen — I have been watching your videos. You are the only one of the young ones who does the work. I want you in Tier 3.' },
      { s: 'dorian', t: 'Different room. Forty people. We talk before we talk, if you follow me.' },
      { beat: 'You do follow him. That is exactly the problem.' }
    ],
    choicesHead: 'Answer Dorian',
    choices: [
      { label: '"What does Tier 3 actually do?"', detail: 'Make him describe it in words.', to: 'd1_ph_dorian_a', tone: 'evidence' },
      { label: '"I am in."', detail: 'Access is access. You can decide what you are later.', to: 'd1_ph_dorian_b', tone: 'risk' },
      { label: '"No thanks. I like being able to say what I see."', detail: 'Close the only door you have into the room behind the room.', to: 'd1_ph_dorian_c', tone: 'safe' }
    ]
  },
  d1_ph_dorian_a: {
    phase: 'd1_power', back: 'd1_power_hub',
    text: [
      { s: 'dorian', t: 'It does what every serious desk does. Information moves through people before it moves through wires. That is not a scandal, that is Tuesday.' },
      { s: 'you', t: 'Moves how?' },
      { s: 'dorian', t: 'You are asking me to write something down.' },
      { s: 'dorian', t: 'I like you. I am going to leave the invitation open until tomorrow night and I am going to stop typing now.' },
      'And he does. The last message sits there like a hand held out over a gap.'
    ],
    onEnter: { rel: { dorian: 3 }, credibility: 3, flag: { tier3Open: true }, note: 'Made Dorian refuse to put it in writing.' }
  },
  d1_ph_dorian_b: {
    phase: 'd1_power', back: 'd1_power_hub',
    text: [
      'The invite arrives before you have finished exhaling. A separate room. Forty names. A pinned message that says *what is said here is said nowhere else.*',
      { beat: 'You are inside. Whatever you find in here, you found it after agreeing to that sentence.' }
    ],
    onEnter: { rel: { dorian: 12 }, integrity: -4, credibility: -2, stress: 8, flag: { tier3: true }, note: 'Accepted Tier 3 access.' }
  },
  d1_ph_dorian_c: {
    phase: 'd1_power', back: 'd1_power_hub',
    text: [
      { s: 'dorian', t: 'Careful. You are turning down a chair at a table you have been asking about for three years.' },
      { s: 'you', t: 'I know what I am doing.' },
      { s: 'dorian', t: 'I hope so. Doors like this get quieter every year.' },
      'It is not a threat. It is worse than a threat, because he is right and you both know it.'
    ],
    onEnter: { rel: { dorian: -6 }, integrity: 6, credibility: 4, flag: { refusedTier3: true }, note: 'Turned down the room behind the room.' }
  },

  d1_ph_trade: {
    phase: 'd1_power',
    text: [{ beat: 'Six-thirty and rising into the bell. Forty minutes left.' }],
    choicesHead: 'Trade the close',
    choices: [
      { label: 'Sell into the strength. Somebody is holding this up; use it to get out.', to: 'd1_power_hub', tone: 'safe', req: { position: true }, fx: { close: true, integrity: 5, note: 'Sold into the manufactured strength.' } },
      { label: 'Buy the close with the floor under you', detail: 'Riding a floor that somebody else is paying to maintain.', to: 'd1_power_hub', tone: 'risk', fx: { trade: { size: 'normal' }, stress: 8, note: 'Bought the close, leaning on somebody else\'s bid.' } },
      { label: 'Short it. If this is what you think it is, it ends badly.', detail: 'Being early and being wrong pay out identically.', to: 'd1_power_hub', tone: 'risk', fx: { trade: { size: 'starter', dir: 'short', noStop: true }, stress: 14, flag: { shorted: true }, note: 'Shorted a stock that was being held up on purpose.' } },
      { label: 'Nothing. Watch the bell.', to: 'd1_power_hub', tone: 'safe', fx: { integrity: 3, stress: -4 } }
    ]
  },

  d1_ph_rest: {
    phase: 'd1_power', back: 'd1_power_hub',
    text: [
      'You stand up. Your knees crack. The kitchen is four steps away and you have not been in it since six this morning.',
      'Toast. The rain on the window in its three familiar channels. Someone downstairs playing the same eight bars of something over and over.',
      { beat: 'Twelve minutes. When you sit back down the numbers are just numbers again, and your hands are cold, and you can think.' }
    ],
    onEnter: { stress: -16, integrity: 3, note: 'Got up from the desk before the desk made the decision.' }
  },

  d1_power_beat: {
    phase: 'd1_power',
    text: [
      { sys: 'TESSERA MARKETS · 16:00:00 · CLOSING PRINT\nHALX  6.31  (+111.7% on session)  Vol 21.4M', kind: 'alert' },
      'It closed on the high. Twenty-one million shares in a four-million-share float, and it closed on the high, and not one person in that room sold a single share.',
      { beat: 'That does not happen. Something has to sell for something else to close on the high. Unless somebody has arranged for nothing to be for sale.' }
    ],
    choices: [{ label: 'After hours', to: 'd1_after_open', tone: 'ember' }]
  },

  /* ---------------------------------------------------------- AFTER HOURS */
  d1_after_open: {
    phase: 'd1_after',
    text: [
      { lede: 'After hours the city gets its colour back — sodium orange, wet asphalt, the tower across the street with four windows still lit at ten past five.' },
      'The room is celebrating. Dorian has posted about discipline. Tier 3 invitations are going out tonight, apparently, which is the first time the public room has heard that there is a Tier 3.',
      'Your phone rings. Not a message. A call. Sable Reyes has never once called you.'
    ],
    choices: [{ label: 'Answer', to: 'd1_ah_sable', tone: 'ember' }]
  },

  d1_ah_sable: {
    phase: 'd1_after',
    text: [
      'She is in a car. You can hear the wipers.',
      { s: 'sable', t: 'I cashed it.' },
      { s: 'sable', t: 'The six thousand. Two hours ago. And then I sat in the parking lot and I could not make myself go in and film the second video, so I am sitting here calling you, which is insane, because you are the person who is going to be disappointed in me.' },
      { s: 'you', t: 'I am not.' },
      { s: 'sable', t: 'You should be. There are two more. Three videos, one live session, and they gave me the talking points and one of the talking points is a *price.*' },
      { beat: 'That is the sentence. Not the money — the price. Somebody wrote a number and paid a person with ninety-one thousand followers to say it in her own voice.' }
    ],
    onEnter: { gain: ['E02'], stress: 8 },
    choicesHead: 'She is waiting',
    choices: [
      { label: '"Send me the contract. Not to use — so you are not the only one holding it."', detail: 'Protect her by sharing the weight, and get the document.', to: 'd1_ah_sable_a', tone: 'evidence', cost: 0 },
      { label: '"Give the money back and post the truth tonight."', detail: 'The right answer, delivered to someone with four months of arrears.', to: 'd1_ah_sable_b', tone: 'safe' },
      { label: '"Film the videos. I will use them later."', detail: 'Let her burn so the fire is bigger when you point at it.', to: 'd1_ah_sable_c', tone: 'risk' },
      { label: '"Take the money. Everyone is taking the money."', detail: 'Absolution is free and she is desperate for it.', to: 'd1_ah_sable_d', tone: 'risk' }
    ]
  },
  d1_ah_sable_a: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      'The PDF arrives while she is still on the line. Two pages. *Bellwether Investor Relations LLC.* Deliverables, payment on publication, and a clause about "organic tone" that somebody typed on purpose.',
      { s: 'sable', t: 'what do i do' },
      { s: 'you', t: 'Tonight? Nothing. Do not film. Do not post. Do not spend it. That is the whole list.' },
      { s: 'sable', t: 'ok' },
      { s: 'sable', t: 'ok. thank you.' }
    ],
    onEnter: { rel: { sable: 16 }, integrity: 4, flag: { sableAlly: true }, note: 'Took the weight off Sable instead of the story out of her.' }
  },
  d1_ah_sable_b: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      { s: 'sable', t: 'Give it back.' },
      { s: 'sable', t: 'Sure. And then thursday i give the landlord a screenshot of my integrity.' },
      'The line goes quiet except for the wipers. When she speaks again she sounds very tired and very far away.',
      { s: 'sable', t: 'you are not wrong. i just needed you to be wrong tonight.' }
    ],
    onEnter: { rel: { sable: -4 }, integrity: 5, credibility: 2, note: 'Gave Sable the correct answer and none of the help.' }
  },
  d1_ah_sable_c: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      { s: 'sable', t: 'you mean that?' },
      { s: 'you', t: 'I mean it is not my business.' },
      'It is a lie with a clean surface. You have just decided that a person you like is worth more to you as an exhibit than as a friend.',
      { beat: 'It will work. That is the part you will think about later.' }
    ],
    onEnter: { rel: { sable: 5 }, integrity: -10, credibility: -3, flag: { usingSable: true }, note: 'Let Sable dig the hole because the hole was useful.' }
  },
  d1_ah_sable_d: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      { s: 'sable', t: 'yeah' },
      { s: 'sable', t: 'yeah, everyone is.' },
      'She hangs up first. The videos go up over the next two days, and every single view is partly yours.'
    ],
    onEnter: { rel: { sable: 8 }, integrity: -12, credibility: -6, flag: { enabledSable: true }, note: 'Gave Sable permission.' }
  },

  d1_after_hub: {
    phase: 'd1_after',
    hub: true,
    text: [{ beat: 'Ten past six. The day is over and the file is not.' }],
    choicesHead: 'Evening',
    choices: [
      { label: 'Work the file', detail: 'Everything you gathered today, sorted into proven, unproven, and wishful.', to: 'd1_ah_file', cost: 1, once: true, tone: 'evidence' },
      { label: 'Message CANDLEWICK about the floor', detail: 'Tell the source what you saw and watch how they react to being told something.', to: 'd1_ah_wick', cost: 1, once: true, tone: 'social' },
      { label: 'Post your day recap', detail: 'Fourteen thousand people are waiting to hear what you make of today.', to: 'd1_ah_post', cost: 1, once: true, tone: 'social' },
      { label: 'Sleep', detail: 'A real decision, with real effects, that nobody ever makes.', to: 'd1_ah_sleep', cost: 1, once: true, tone: 'safe' },
      { label: 'End the day', to: 'd1_after_beat', tone: 'ember', advance: true }
    ]
  },

  d1_ah_file: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      'Three columns. PROVEN. UNPROVEN. WANT TO BE TRUE.',
      'The third column is the longest and that is the most useful thing you learn all day.',
      { beat: 'A story that only works if every unproven thing is true is not a story. It is a hope with footnotes.' }
    ],
    onEnter: { credibility: 5, integrity: 4, stress: -4, flag: { openedFile: true }, note: 'Sorted what was proven from what you wanted to be true.' }
  },

  d1_ah_wick: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      { s: 'you', t: 'Somebody held a floor at 5.42 for an hour. Eight hundred share blocks. It never printed lower once.' },
      'Nine minutes of nothing.',
      { s: 'candlewick', t: 'you saw that today.' },
      { s: 'candlewick', t: 'i watched a man do that for eleven weeks in 2021 and tell four hundred people it was accumulation. tomorrow he will do it again and someone will put their rent in it.' },
      { s: 'candlewick', t: 'you are asking whether i am reliable. wrong question. ask whether the documents are.' },
      { beat: 'Eleven weeks. In 2021. Watched. That is not the vocabulary of an outsider.' }
    ],
    onEnter: { rel: { candlewick: 10 }, gain: ['E06'], note: 'Learned the source was inside the room, once.' }
  },

  d1_ah_post: {
    phase: 'd1_after',
    text: [{ beat: 'The camera light is red. Fourteen thousand people, most of whom held this stock today.' }],
    choicesHead: 'Say something',
    choices: [
      { label: 'Teach the float. No names, no accusations, just the mechanics.', detail: 'Why a four-million-share float behaves like this, and what it means for the people in it.', to: 'd1_ah_post_a', tone: 'safe' },
      { label: 'Hint that something is wrong', detail: 'Say enough to get engagement, not enough to be responsible for it.', to: 'd1_ah_post_b', tone: 'risk' },
      { label: 'Post nothing tonight', detail: 'Silence is a position too.', to: 'd1_after_hub', tone: 'safe', fx: { stress: -4 } }
    ]
  },
  d1_ah_post_a: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      'Eight minutes on mechanics. Float, lockups, why volume can exceed the tradeable shares five times over, why a stock closing on its high on enormous volume is not automatically good news.',
      'Six thousand views. Two hundred saves. A comment from a name you recognise from the room: *i sized down after watching this. thank you.*',
      { beat: 'You did not name anyone. You did not need to. The people who needed it got it, and the people who would have sued you have nothing to sue.' }
    ],
    onEnter: { credibility: 9, rel: { nadia: 4, dorian: -3 }, note: 'Taught the mechanics without making an accusation you could not prove.' }
  },
  d1_ah_post_b: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      '*Some of you are going to want to look very carefully at who was buying today. That is all I am going to say.*',
      'Forty thousand views in two hours. Your biggest post ever. The replies are a bonfire — half of them naming people you never named, half of them calling you a jealous nobody.',
      { beat: 'You have started something you cannot steer, using material you cannot prove, in front of the person it is about.' }
    ],
    onEnter: { credibility: -5, stress: 14, rel: { dorian: -10, nadia: -5 }, flag: { publicDoubt: true, teasedPublicly: true }, note: 'Teased an accusation you could not yet support.' }
  },

  d1_ah_sleep: {
    phase: 'd1_after', back: 'd1_after_hub',
    text: [
      'You close the laptop at 21:40, which is early enough that it feels like an act of defiance.',
      'You lie there and do the arithmetic anyway, but at some point the arithmetic becomes rain, and then it becomes nothing.',
      { beat: 'Seven hours. Tomorrow you will be the only person in this story who is not exhausted.' }
    ],
    onEnter: { stress: -22, integrity: 4, flag: { slept1: true }, note: 'Slept.' }
  },

  d1_after_beat: {
    phase: 'd1_after',
    text: [
      'At 23:14 your phone lights the ceiling.',
      { s: 'candlewick', t: 'tomorrow they will halt it. that is not a prediction, that is a schedule.' },
      { s: 'candlewick', t: 'watch what the room does in the eleven minutes it is frozen. that is when you will see who knows.' },
      { beat: 'You put the phone face down. It glows through the case anyway, like a coal.' }
    ],
    choices: [{ label: 'Day two', to: 'd2_premarket_open', tone: 'ember', fx: { flag: { day1Done: true } } }]
  }

  });
})(window.LC);
