/* ============================================================
   DAY TWO — THE SQUEEZE
   ============================================================ */
(function (LC) {
  'use strict';
  LC.nodes = LC.nodes || {};
  const A = (o) => Object.assign({ kind: 'action', cost: 1, once: true, back: true }, o);

  Object.assign(LC.nodes, {

  /* ======================================= PRE-MARKET ======================================= */
  d2_premarket_open: {
    phase: 'd2_premarket',
    text: [
      { lede: 'You wake at 5:40 without an alarm, which is the body\'s way of telling you it has already decided something.' },
      { sys: 'TESSERA MARKETS · PRE-MARKET 06:58\nMB:HALX  7.80   +19.1%   second release 06:31', kind: 'doc' },
      'A second press release. You read it three times looking for the new information and there is none. The same letter of intent, described again, in a different order.',
      'In the room, mira_k has posted the thing you have been sitting on since yesterday: *anyone else notice the filing went up 47 minutes before the wire.*',
      { sys: 'modbot: mira_k has been removed from the room.', kind: 'alert' },
      { beat: 'Not muted. Removed. Somebody woke up and made that decision before seven in the morning.' }
    ],
    onEnter: { composure: -6 },
    choices: [{ label: 'Start the day', to: '__hub_d2_premarket_desk', tone: 'ember' }]
  },

  d2_pm_tape: A({
    phase: 'd2_premarket', at: 'desk', tone: 'evidence', cost: 2,
    label: 'Get the raw time-and-sales', detail: 'A Marketscope trial is fourteen days and a credit card. Every print, every millisecond.',
    text: [
      'The trial takes eleven minutes to approve and another forty to export. What comes back is a CSV with two million rows in it and no opinions at all.',
      { sys: 'MARKETSCOPE · export complete\nMB:HALX · time & sales · 2 sessions · 2,141,880 rows\nformat: ts, px, size, venue, condition', kind: 'doc' },
      { beat: 'This is the boring version Nadia meant. It is also the only thing in your possession that a lawyer could not wave away.' }
    ],
    onEnter: { flag: { tapeExport: true }, credibility: 4, composure: -4, note: 'Bought the raw time-and-sales. The boring version.' }
  }),

  d2_pm_modlog: A({
    phase: 'd2_premarket', at: 'room', tone: 'evidence',
    label: 'Screenshot the moderation log', detail: 'Two removals in two days, both for the same question.',
    text: [
      'The mod log is public to members. It has to be — Dorian made a whole video about transparency in 2020.',
      { sys: 'modbot · public moderation log\n09:47 mira_k — muted 30m — rule 4\n06:44 mira_k — removed — rule 4\n06:44 [3 messages deleted]', kind: 'doc' },
      'Three messages deleted at 06:44. You will never see them. But the log admits they existed, and the log has a timestamp.',
      { beat: 'A room that deletes the question is telling you something about the answer.' },
      'Scrolling back through it, you find the thing you missed on Monday: his own alert post, still up, still timestamped, still attached to a screenshot of fills at a price that had already gone.'
    ],
    onEnter: { credibility: 3, composure: -4, flag: { sawModLog: true }, gain: ['E03'],
      note: 'Preserved the moderation log — and his own timestamped receipt with it.' }
  }),

  d2_pm_tier3: A({
    phase: 'd2_premarket', at: 'tier3', tone: 'risk',
    label: 'Read what they said overnight', detail: 'Forty people, and none of them are surprised.',
    text: [
      'The Tier 3 log from 04:12 this morning, six hours before the wire:',
      { sys: 'v_marek_ii   ·  04:12  ·  second one lands at 6:30. same shape as monday.\nDorianVale   ·  04:14  ·  Nobody posts about it before it is out. Obviously.\nk_holt       ·  04:19  ·  understood', kind: 'doc' },
      { beat: 'Six hours before the release, forty people knew what time it was arriving.' },
      'Nobody in here says anything illegal. Nobody has to. They discuss the schedule of a thing that has not happened as if it were weather.'
    ],
    onEnter: { credibility: 4, composure: -8, flag: { sawTier3Log: true }, gain: ['E04'],
      note: 'Saw the room behind the room discuss an unreleased announcement as a schedule.' }
  }),

  d2_pm_sable: A({
    phase: 'd2_premarket', at: 'studio', tone: 'social',
    label: 'Go and see Sable', detail: 'She has not slept and the ring light is still up.',
    text: [
      'Two boxes taped shut by the door. A letter on the counter she has not opened, with a window envelope you both pretend not to see.',
      { s: 'sable', t: 'I did not film it.' },
      { s: 'sable', t: 'They have emailed me four times. The last one used the word *breach*, which is a fun word to read at 4am.' },
      { s: 'you', t: 'Do you have the talking points?' },
      { s: 'sable', t: 'I have everything. I keep everything. That is either very smart or the most incriminating personality trait a person can have.' },
      'She turns the laptop around. A slide deck. Slide four is a chart with a target price on it and the words SUGGESTED PHRASING underneath.'
    ],
    onEnter: { rel: { sable: 8 }, credibility: 3, flag: { hasTalkingPoints: true }, note: 'Saw the talking points. Slide four has a price on it.' }
  }),

  d2_premarket_beat: {
    kind: 'beat', phase: 'd2_premarket',
    text: [{ sys: 'TESSERA MARKETS · 09:29:50\nMB:HALX  7.80   pre-market volume 2.0M', kind: 'alert' },
      { beat: 'CANDLEWICK said they would halt it today. You have spent twenty minutes deciding whether that was a warning or a boast.' }],
    choices: [{ label: 'The bell', to: 'd2_open_open', tone: 'ember' }]
  },

  /* ======================================= OPEN ======================================= */
  d2_open_open: {
    phase: 'd2_open',
    text: [
      'Eight sixty in four minutes. Then a wall of red so fast the chart looks like it has been cut with scissors.',
      { sys: 'TESSERA MARKETS · 09:52:04\n*** VOLATILITY HALT — MB:HALX ***\nresumption estimate 09:57', kind: 'alert' },
      'The screen freezes. The price does not move. The order book empties out to nothing and sits there.',
      { beat: 'Eleven minutes, as it turns out. CANDLEWICK told you to watch the room. So watch the room.' }
    ],
    choices: [{ label: 'Eleven frozen minutes', to: '__hub_d2_open_room', tone: 'ember' }]
  },

  d2_op_frozen: A({
    phase: 'd2_open', at: 'room', tone: 'evidence',
    label: 'Watch the room during the halt', detail: 'Nobody can trade. Everybody can talk.',
    text: [
      'Three thousand people panicking in real time, and four accounts that are not.',
      { sys: 'tendiekid  09:53  WHAT IS HAPPENING\nori        09:53  is my money gone\nk_holt     09:53  reopens lower. hold.\nv_marek_ii 09:54  it reopens at 6.90, calm down\nwickwatch  09:55  how do you know that', kind: 'doc' },
      'It reopens at 6.94.',
      { beat: 'Four cents. He was four cents out, eleven minutes early, on a stock that had been frozen with no book.' }
    ],
    onEnter: { credibility: 4, composure: -8, flag: { sawHaltCall: true }, note: 'Saw someone call the reopen price eleven minutes before it existed.' }
  }),

  d2_op_trade: {
    kind: 'action', phase: 'd2_open', at: 'desk', cost: 0, tone: 'risk',
    label: 'Trade the reopen', detail: 'The halt is a gift or a guillotine and you get to find out which.',
    text: [{ beat: 'Reopened at 6.94, four percent below the halt. The room is buying it with both hands.' }],
    choicesHead: 'The reopen',
    choices: [
      { label: 'Buy the reopen with the room', to: 'BACK', tone: 'risk', fx: { trade: { size: 'normal' }, composure: -6, note: 'Bought the reopen.' } },
      { label: 'Flatten into the panic. Live to Thursday.', to: 'BACK', tone: 'safe', req: { position: true }, fx: { close: 'stop', note: 'Honoured the stop through the halt.' } },
      { label: 'Add on margin. It is going back to nine.', to: 'BACK', tone: 'risk', fx: { trade: { size: 'margin', noStop: true }, composure: -18, note: 'Added on margin after a halt.' } },
      { label: 'Sit it out and keep reading the room', to: 'BACK', tone: 'safe', fx: { integrity: 4, composure: 3 } }
    ]
  },

  d2_open_beat: {
    kind: 'beat', phase: 'd2_open',
    text: ['By 10:30 it is back to seven twenty and the room has decided the halt was a conspiracy against them, which is almost funny.',
      { s: 'candlewick', t: 'told you.' },
      { s: 'candlewick', t: 'i am going to send you something at lunch. read it twice before you feel anything about it.' }],
    choices: [{ label: 'Midday', to: 'd2_midday_open', tone: 'ember' }]
  },

  /* ======================================= MIDDAY ======================================= */
  d2_midday_open: {
    phase: 'd2_midday',
    text: [
      { lede: 'The file arrives at 11:52 with no message attached.' },
      { sys: 'tier_allocations_r3.xlsx  ·  41 rows  ·  columns: HANDLE · TIER · ALLOC · NOTE', kind: 'doc' },
      'Forty-one names. Three tiers. A column labelled ALLOC with dollar figures beside the top eleven rows. Your own handle is not on it, which is either a relief or an insult.',
      { beat: 'If it is real it is the whole thing in one file. If it is fake it is the perfect gift for somebody who wants a man destroyed.' }
    ],
    onEnter: { gain: ['E04'], composure: -6 },
    choices: [{ label: 'Read it twice', to: '__hub_d2_midday_desk', tone: 'ember' }]
  },

  d2_md_marisol: {
    kind: 'action', phase: 'd2_midday', at: 'desk', cost: 1, once: true, tone: 'social',
    label: 'A reporter has emailed you', detail: 'Marisol Trang, The Ledger Review. Subject line: "the 47 minutes".',
    text: [
      { sys: 'From: m.trang@ledgerreview\nSubject: the 47 minutes\n\nI have been on this name for nine days and your video is the only public thing about it that is not either hype or libel. I am not asking you to be a source. I am asking whether you would like to be wrong in private instead of in public.\n\nNinth floor, after six, any night this week.', kind: 'doc' },
      { beat: 'Being wrong in private. It is the most attractive offer anybody has made you in two days.' }
    ],
    choicesHead: 'Reply',
    choices: [
      { label: '"Tonight."', detail: 'A journalist with a standards desk is the only person who can check you.', to: 'BACK', tone: 'evidence', fx: { flag: { marisolCard: true, newsroomOpen: true }, rel: { marisol: 20 }, note: 'Agreed to meet Marisol Trang.' } },
      { label: '"Not yet. I have nothing you could print."', detail: 'True, and it keeps the door open.', to: 'BACK', tone: 'safe', fx: { flag: { marisolCard: true, newsroomOpen: true }, rel: { marisol: 8 }, credibility: 3, note: 'Told a reporter you had nothing worth printing yet.' } },
      { label: 'Do not reply', detail: 'Journalists are how private problems become permanent ones.', to: 'BACK', tone: 'risk', fx: { rel: { marisol: -10 }, note: 'Ignored the reporter.' } }
    ]
  },


  d2_md_newsroom: A({
    phase: 'd2_midday', at: 'newsroom', tone: 'evidence',
    label: 'Sit down with Marisol', detail: 'Ninth floor. Four desks lit. A whiteboard that says WHAT DO WE ACTUALLY HAVE.',
    text: [
      'She is younger than you expected and reads faster than anybody you have met. She goes through your file in nine minutes and asks four questions, all of which hurt.',
      { s: 'marisol', t: 'Who gave you the ledger?' },
      { s: 'you', t: 'I do not know.' },
      { s: 'marisol', t: 'Then it is not evidence, it is a gift. Gifts have givers and givers have reasons.' },
      { s: 'marisol', t: 'Here is my standard, and it is not negotiable. Two independent sources or a document I can authenticate myself. Your screenshots are neither. Your retrieval log is one of them.' },
      { s: 'marisol', t: 'Get me a person who will put their name on it and I will run this. Get me forty screenshots and I will run nothing, and you will spend two years in a deposition.' }
    ],
    onEnter: { rel: { marisol: 12 }, credibility: 6, integrity: 3, flag: { marisolBriefed: true, marisolHelp: true },
      note: 'Learned the standard: two sources, or a document she can authenticate.' }
  }),

  d2_md_nadia: A({
    phase: 'd2_midday', at: 'diner', tone: 'safe',
    label: 'Bring Nadia the ledger', detail: 'She will not tell you it is real. She will tell you how to find out.',
    text: [
      { s: 'nadia', t: 'Metadata first. Always metadata first.' },
      'She opens the properties pane like other people open a menu.',
      { s: 'nadia', t: 'Authored eight days ago. Modified eight days ago. One revision. Do you know what a spreadsheet forty-one people have been added to over three years looks like? It does not look like this.' },
      { s: 'you', t: 'So it is fake.' },
      { s: 'nadia', t: 'No. It means it was *exported* eight days ago. Could be a dump from a real system. Could be a man in a kitchen with a keyboard. You cannot tell from here, which is exactly why you do not publish it from here.' },
      { beat: 'She writes one line on a napkin: WHAT ELSE WOULD HAVE TO BE TRUE.' }
    ],
    onEnter: { rel: { nadia: 8 }, integrity: 4, composure: 8, credibility: 3, flag: { ledgerMeta: true },
      note: 'Checked the ledger metadata before believing it.' }
  }),

  /* ---- HINGE 3 ---- */
  H3_ledger: {
    kind: 'hinge', phase: 'd2_midday', hinge: 'H3',
    title: 'What you do with a gift',
    text: [
      'It is 14:55. The ledger has been open on your second monitor for three hours.',
      { s: 'candlewick', t: 'post it.' },
      { s: 'candlewick', t: 'you have forty thousand people who will read it tonight. by friday nobody will care.' },
      { beat: 'He has never pushed before. Not once in two days. That is the first genuinely new piece of information you have had all afternoon.' }
    ],
    choicesHead: 'The ledger',
    choices: [
      { label: 'Post it tonight. All forty-one names.', detail: 'Maximum reach, zero verification, and forty-one people who did not consent to being on a list you did not make.', to: 'H3_blind', tone: 'risk' },
      { label: 'Cross-check it against the filings and the tape first', detail: 'Slower. Needs E-01 and E-03 proven. It is the only thing that turns a gift into evidence.', to: 'H3_check', tone: 'evidence' },
      { label: 'Refuse it. Delete the file and tell him why.', detail: 'You cannot authenticate it and you did not ask for it.', to: 'H3_refuse', tone: 'safe' }
    ]
  },
  H3_blind: { phase: 'd2_midday', back: 'desk',
    text: ['You post it at 15:20 with four lines of context and no hedging.',
      'It does ninety thousand views in an hour. Three of the forty-one names are people you have met. One of them is a nineteen-year-old who moderates the room for free.',
      { beat: 'At 17:40 somebody replies with the file properties. Authored eight days ago, on a machine that did not exist eight days ago.' },
      'By nine, the story is not the ledger. The story is you.'],
    onEnter: { credibility: -22, composure: -20, rel: { dorian: -20, nadia: -12, marisol: -25 },
      flag: { pushedLedgerBlind: true, h3done: true }, note: 'Published an unverified list of forty-one names.',
      closes: ['The Clean Print is closed. No newsroom will touch you now.', 'E-04 will not survive scrutiny.'] } },
  H3_check: { phase: 'd2_midday', back: 'desk',
    text: [{ s: 'you', t: 'Not until I can check it.' },
      'Six minutes of nothing.',
      { s: 'candlewick', t: 'you are the first person in eighteen months to say that to me.' },
      { s: 'candlewick', t: 'fine. check it. i will send the metadata dump so you can check me too.' },
      { beat: 'He has just handed you the thread that leads back to him. Either he is honest, or he is very good, and you still cannot tell which.' }],
    onEnter: { rel: { candlewick: 14 }, credibility: 6, integrity: 5, flag: { metaDump: true, refusedToRush: true, h3done: true },
      note: 'Refused to publish a document you could not authenticate.' } },
  H3_refuse: { phase: 'd2_midday', back: 'desk',
    text: [{ s: 'you', t: 'I did not ask for this and I cannot authenticate it. I am deleting it.' },
      { s: 'candlewick', t: 'then you will never prove any of it.' },
      { s: 'you', t: 'Maybe. But I will still be someone whose word means something on friday.' },
      'He does not reply for eleven hours.',
      { beat: 'You are cleaner than you were an hour ago, and further from the truth than you have been since Monday.' }],
    onEnter: { rel: { candlewick: -18 }, credibility: 8, integrity: 8, composure: 6, flag: { refusedLedger: true, h3done: true },
      debunk: 'E04', note: 'Refused the ledger outright.',
      closes: ['E-04 is gone. Whatever it proved, it proves it for somebody else now.'] } },

  d2_midday_beat: {
    kind: 'beat', phase: 'd2_midday',
    text: [{ beat: 'Ten past three. The spreadsheet is still open on the second monitor.' }],
    choices: [
      { label: 'You still have not decided what to do with the ledger', to: 'H3_ledger', tone: 'ember', req: { notFlag: ['h3done'] } },
      { label: 'Power hour', to: 'd2_power_open', tone: 'ember', req: { flag: ['h3done'] } }
    ]
  },

  /* ======================================= POWER HOUR ======================================= */
  d2_power_open: {
    phase: 'd2_power',
    text: [
      'Seven twenty-five to eight fifty-five between 15:11 and the bell, on no news whatsoever.',
      { s: 'dorian', t: 'Tomorrow is the day I have been telling you about for a year.' },
      { beat: 'In the room, somebody called ori asks whether he should sell. Dorian answers: *ask yourself who is buying when you sell.* It is the single most expensive sentence in this entire story and it costs him nothing to type.' }
    ],
    choices: [{ label: 'Power hour', to: '__hub_d2_power_desk', tone: 'ember' }]
  },

  d2_ph_nadia: A({
    phase: 'd2_power', at: 'diner', tone: 'social',
    label: 'Nadia is not answering her phone', detail: 'Three messages, no reply. She always replies.',
    text: [
      'She is in the booth with the notebook shut, which you have never seen.',
      { s: 'nadia', t: 'I am short. Since Monday.' },
      { s: 'you', t: 'You told me you were not in it.' },
      { s: 'nadia', t: 'I was not, on Monday. I got certain on Tuesday. Certainty is the most expensive thing I own.' },
      'She turns the phone over. The number on it has a minus in front of it that has four figures behind it.',
      { s: 'nadia', t: 'I am telling you because I made you tell me. That was the deal.' },
      { beat: 'The person who taught you risk is down four figures being right too early. Which is the entire thesis of this week, arriving at the worst possible time.' }
    ],
    choicesHead: 'What do you say',
    choices: [
      { label: '"Close it. Today. I will sit here while you do it."', detail: 'The advice she would give you, given back.', to: 'd2_ph_nadia_a', tone: 'safe' },
      { label: '"Hold. You are right, and Thursday proves it."', detail: 'Encourage a friend to stay in a position because it suits your story.', to: 'd2_ph_nadia_b', tone: 'risk' },
      { label: 'Say nothing. Let her decide.', detail: 'She is an adult and it is her account.', to: 'd2_ph_nadia_c', tone: 'evidence' }
    ]
  }),
  d2_ph_nadia_a: { phase: 'd2_power', back: 'diner',
    text: ['She closes it in front of you. It takes four seconds and costs her more than you have ever lost in a day.',
      { s: 'nadia', t: 'Right. Now I am a person with an opinion instead of a person with a position. They are very different jobs.' },
      { beat: 'She picks the notebook back up. That is how you know she is alright.' }],
    onEnter: { rel: { nadia: 16 }, integrity: 6, composure: 6, flag: { nadiaFlat: true, nadiaVouches: true },
      note: 'Told Nadia to close it, and stayed while she did.' } },
  d2_ph_nadia_b: { phase: 'd2_power', back: 'diner',
    text: [{ s: 'nadia', t: 'You need me to be right.' }, { s: 'you', t: 'I need you to be okay.' },
      { s: 'nadia', t: 'Those were the same sentence a minute ago and now they are not.' },
      'She holds. By Thursday morning it will have cost her another six thousand dollars, and she will not mention it once.'],
    onEnter: { rel: { nadia: -6 }, integrity: -8, flag: { nadiaHeld: true },
      note: 'Kept a friend in a losing position because it suited your story.',
      closes: ['Nadia will not vouch for you. You spent that.'] } },
  d2_ph_nadia_c: { phase: 'd2_power', back: 'diner',
    text: ['You sit. The coffee gets cold. After eleven minutes she says "yeah" to nobody and closes half of it.',
      { s: 'nadia', t: 'Thank you for not managing me.' }],
    onEnter: { rel: { nadia: 6 }, integrity: 2, flag: { nadiaVouches: true }, note: 'Let Nadia make her own call.' } },

  d2_ph_record: A({
    phase: 'd2_power', at: 'desk', tone: 'risk',
    label: 'Install a call recorder', detail: 'One tap, no light, no sound.',
    text: ['It takes forty seconds and it is legal where you live, which is not the same as being the kind of thing you do.',
      { beat: 'You sit looking at the icon for a while. Nadia would tell you that a tool you have is a tool you will use.' }],
    onEnter: { flag: { recorder: true }, composure: -5, note: 'Installed a call recorder.' }
  }),

  d2_ph_ori: A({
    phase: 'd2_power', at: 'room', tone: 'social',
    label: 'Answer ori', detail: 'He has asked whether he should sell. Nine hundred people have seen it. Nobody has answered.',
    text: [
      { sys: 'ori   ·  15:41  ·  im up 4k. should i sell\nDorianVale · 15:42 · Ask yourself who is buying when you sell.\nori   ·  15:44  ·  ok', kind: 'doc' },
      { beat: 'You can type into that room. You have fourteen thousand followers and a screenshot you cannot prove.' }
    ],
    choicesHead: 'Type something',
    choices: [
      { label: '"Nobody can tell you that. But take enough off that you can sleep."', detail: 'Not a call. A method. It is the most you can honestly say.', to: 'd2_ph_ori_a', tone: 'safe' },
      { label: '"Sell. All of it. Tonight."', detail: 'A direct instruction to a stranger, on a conviction you cannot yet prove.', to: 'd2_ph_ori_b', tone: 'risk' },
      { label: 'Close the tab.', detail: 'It is not your job and he is not your responsibility.', to: 'd2_ph_ori_c', tone: 'risk' }
    ]
  }),
  d2_ph_ori_a: { phase: 'd2_power', back: 'room',
    text: [{ sys: 'ori · 15:51 · ok. sold half. feels weird.\nori · 15:52 · thanks for actually answering', kind: 'doc' },
      'Forty seconds later a moderator deletes your message for "unsolicited advice", which is a phrase with a lot of work to do in this room.'],
    onEnter: { credibility: 6, rel: { dorian: -6 }, flag: { warnedOri: true }, note: 'Told a stranger to size down, and got deleted for it.' } },
  d2_ph_ori_b: { phase: 'd2_power', back: 'room',
    text: ['You are removed from the room in under two minutes.',
      { sys: 'modbot: you have been removed — rule 4.', kind: 'alert' },
      'ori sells. He also posts a screenshot of your message with the word LIAR over it three days later, when the price is briefly higher, and deletes it two days after that.'],
    onEnter: { credibility: -6, rel: { dorian: -18 }, flag: { warnedOri: true, kickedFromRoom: true },
      note: 'Gave a stranger a direct instruction and got thrown out for it.' } },
  d2_ph_ori_c: { phase: 'd2_power', back: 'room',
    text: ['You close the tab. It takes about a second and it does not feel like anything at all.',
      { beat: 'That is worth noticing. The things that cost the most rarely feel like anything at the time.' }],
    onEnter: { composure: -4, integrity: -3, note: 'Said nothing to ori.' } },

  d2_power_beat: {
    kind: 'beat', phase: 'd2_power',
    text: [{ sys: 'TESSERA MARKETS · 16:00:00 · CLOSING PRINT\nMB:HALX  8.55   +23.0% on session   Vol 27.6M', kind: 'alert' },
      'Your phone goes at 16:31. Dorian Vale, calling. Not messaging. Calling.'],
    choices: [{ label: 'Answer it', to: 'H4_offer', tone: 'ember' }]
  },

  /* ---- HINGE 4 ---- */
  H4_offer: {
    kind: 'hinge', phase: 'd2_after', hinge: 'H4',
    title: 'The offer',
    text: [
      'No hello. He does not do hello on the phone; he does it on video, where people are watching.',
      { s: 'dorian', t: 'You have been busy.' },
      { s: 'dorian', t: 'The retrieval log. The Marketscope trial. You went to see the reporter. I am not angry, I am *impressed*, which should worry you more.' },
      { beat: 'You have told four people. One of them told him.' },
      { s: 'dorian', t: 'So here is the offer, and I am only making it once. Tier 1 allocation. Not a payment — an allocation, which is a different word for a reason. Call it forty on the first one and we go from there.' },
      { s: 'dorian', t: 'And nothing happens. You do not have to say anything, print anything, sign anything. You just keep doing exactly what you were doing on Sunday.' },
      { s: 'you', t: 'And if I say no?' },
      { s: 'dorian', t: 'Then on Friday I post three years of our messages and a very sad video about a young man who could not handle someone else\'s success. And I will not enjoy it.' },
      { s: 'dorian', t: 'That is the part you keep getting wrong about me. I never enjoy it.' }
    ],
    onEnter: { composure: -14 },
    choicesHead: 'Forty thousand dollars and nothing happens',
    choices: [
      { label: 'Take it.', detail: 'Rent for two years. Nobody ever knows. The room carries on exactly as it would have anyway.', to: 'H4_take', tone: 'risk' },
      { label: 'Refuse. Say nothing else.', detail: 'Do not argue with him. Do not explain. Just no.', to: 'H4_refuse', tone: 'safe' },
      { label: 'Refuse — and record it.', detail: 'You have the recorder. This call is the closest thing to a confession you will ever get.', to: 'H4_record', tone: 'evidence', req: { item: ['recorder'] } },
      { label: 'Stall. "Give me until tomorrow."', detail: 'Buy a day. Give him a day too.', to: 'H4_stall', tone: 'evidence' }
    ]
  },
  H4_take: { phase: 'd2_after', choices: [{ label: 'The rest of the evening', to: 'd2_after_open', tone: 'ember' }],
    text: ['The transfer lands at 17:12 from an entity called Aurelian Holdings SPC and it takes four seconds to arrive.',
      'You look at the number for a long time. It is more than you made in either of the last two years.',
      { beat: 'Nothing bad happens. That is the thing nobody tells you. Nothing bad happens at all.' }],
    onEnter: { capital: 40000, credibility: -10, integrity: -25, rel: { dorian: 20, candlewick: -30 },
      flag: { tookTheDeal: true }, note: 'Took forty thousand dollars to be quiet.',
      closes: ['The Clean Print, Wildfire and The Long Wick are closed. You are inside it now.'] } },
  H4_refuse: { phase: 'd2_after', choices: [{ label: 'The rest of the evening', to: 'd2_after_open', tone: 'ember' }],
    text: [{ s: 'you', t: 'No.' },
      'Eight seconds of a man breathing on a phone.',
      { s: 'dorian', t: 'Alright.' },
      'He hangs up. Within an hour, two people you have known for three years have quietly unfollowed you, which is how this kind of thing actually starts.'],
    onEnter: { integrity: 12, credibility: 5, rel: { dorian: -30 }, composure: -8, flag: { refusedDeal: true },
      note: 'Refused forty thousand dollars in one syllable.' } },
  H4_record: { phase: 'd2_after', choices: [{ label: 'The rest of the evening', to: 'd2_after_open', tone: 'ember' }],
    text: [{ s: 'you', t: 'No.' }, { s: 'dorian', t: 'Alright.' },
      'The recording is eleven minutes long. In it, a man offers you money and then describes, unprompted, exactly what he will do to you if you refuse it.',
      { beat: 'You did not tell him. Whatever else is true on Friday, that will also be true, and you will have to carry it.' }],
    onEnter: { integrity: 6, credibility: 8, rel: { dorian: -30 }, composure: -12,
      flag: { refusedDeal: true, hasRecording: true }, gain: ['E07'],
      note: 'Recorded Dorian offering you money, without telling him.',
      closes: ['You recorded a private call without consent. It is admissible in your jurisdiction and it will still be used against you.'] } },
  H4_stall: { phase: 'd2_after', choices: [{ label: 'The rest of the evening', to: 'd2_after_open', tone: 'ember' }],
    text: [{ s: 'you', t: 'Give me until tomorrow.' },
      { s: 'dorian', t: 'Of course. Sleep on it. Everybody does.' },
      'He is entirely relaxed, because in his experience the people who ask for a night always say yes in the morning.',
      { beat: 'You have bought twenty-four hours. So has he.' }],
    onEnter: { composure: 4, rel: { dorian: 4 }, flag: { stalledDeal: true }, note: 'Bought a day from Dorian. He bought one too.' } },

  d2_after_open: {
    phase: 'd2_after',
    text: [{ beat: 'Nine at night. The price has not moved a cent in forty minutes on six hundred thousand shares, which is not a market, it is a hand held flat over a candle.' }],
    choices: [{ label: 'The rest of the evening', to: '__hub_d2_after_desk', tone: 'ember' }],
  },

  d2_ah_wick: A({
    phase: 'd2_after', at: 'desk', tone: 'social',
    label: 'Ask CANDLEWICK the direct question', detail: 'Elias Marek. Say the name and watch.',
    req: { has: ['E06'] },
    text: [
      { s: 'you', t: 'Elias Marek.' },
      'Two hours. Then:',
      { s: 'candlewick', t: 'how long have you known.' },
      { s: 'you', t: 'Since Monday night. You said "eleven weeks in 2021" and outsiders do not count weeks.' },
      { s: 'candlewick', t: 'i built the room with him. i wrote the rules everybody quotes. i left because he started charging for the part that used to be free, and i took eleven percent of nothing with me.' },
      { s: 'you', t: 'You are short, are you not.' },
      { s: 'candlewick', t: 'yes.' },
      { s: 'candlewick', t: 'i have never once lied to you. i have also never once done this for you. both of those are true and you are going to have to decide what to do with a person like that.' }
    ],
    onEnter: { rel: { candlewick: 16 }, verify: 'E06', credibility: 4, flag: { knowsWick: true },
      note: 'Named the source. He did not deny it, and he is positioned short.' }
  }),

  d2_ah_sable: A({
    phase: 'd2_after', at: 'studio', tone: 'social',
    label: 'Ask Sable the hard thing', detail: 'Whether she would say it out loud, with her name on it.',
    req: { flag: ['sableAlly'] },
    text: [
      { s: 'you', t: 'If a reporter asked you to go on the record — your name, the contract, the talking points — would you?' },
      'She does not answer for a long time.',
      { s: 'sable', t: 'It ends me. You understand that. Not the money, the — the thing where I am the person who took it. That is the first line of everything written about me for the rest of my life.' },
      { s: 'you', t: 'Yes.' },
      { s: 'sable', t: 'You are not going to tell me it will be fine.' },
      { s: 'you', t: 'No.' },
      { s: 'sable', t: 'ok.' },
      { s: 'sable', t: 'then ask me again on thursday and i will say yes.' }
    ],
    onEnter: { rel: { sable: 14 }, flag: { sableWillTestify: true }, credibility: 4,
      note: 'Sable will go on the record on Thursday. She knows what it costs.' }
  }),

  d2_after_beat: {
    kind: 'beat', phase: 'd2_after',
    text: [{ beat: 'At 23:58 an email arrives from an address that is a string of numbers. No subject. One attachment.' },
      { sys: 'FOR RELEASE — THURSDAY 16:15 EMBARGOED\nHALCYON EXOGRID INC. announces termination of discussions with utility partner and a review of strategic alternatives.', kind: 'alert' },
      { beat: 'Termination. Not expansion. Termination, at 16:15 on the day the lockup expires.' },
      'You are now holding a document that has not happened yet, about a company nine thousand people are all-in on, and the only thing that separates you from Dorian Vale is what you do in the next sixteen hours.'],
    onEnter: { gain: ['E07'], flag: { draft1615: true }, composure: -16 },
    choices: [{ label: 'Day three', to: 'd3_premarket_open', tone: 'ember', fx: { flag: { day2Done: true } } }]
  }

  });
})(window.LC);
