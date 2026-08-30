/* ============================================================
   Endings — six, plus variant epilogues inside the failure.
   Nobody gets out of this clean. That is the design.
   ============================================================ */
(function (LC) {
  'use strict';

  LC.ENDINGS = {
    clean: {
      id: 'clean', cls: 'clean', kicker: 'Ending · high integrity',
      title: 'The Clean Print',
      sub: 'You were careful. It cost everybody something.',
      body: [
        'The story runs on Friday at six in the morning and it is not about you. Your name appears once, in the ninth paragraph, described as "a retail trader and content creator who provided documentation". You read that sentence about forty times.',
        'What makes it work is the boring part. The retrieval log with its timestamp. The time-and-sales export nobody wanted to pay for. A signed contract with a real counterparty and a woman who put her name on two handwritten pages and did not ask what it would do to her.',
        'Dorian Vale posts a nine-minute video about how he is being targeted. It does four hundred thousand views. Eleven days later the room is archived without an announcement, and the video is still up, and it will be up forever.',
        'The regulator does not call. Regulators do not call. Eleven months later there is a paragraph in a filing you have to read twice to understand, and it is enough.'
      ],
      epilogue: [
        ['Sable', 'Loses everything she was afraid of losing. Gets a job doing production for a podcast about restaurants and is, by the following spring, funnier than you have ever seen her. She does not talk about it. She does not have to.'],
        ['Nadia', 'Was already flat. Sends you a photograph of the napkin, framed, as a joke that is not entirely a joke.'],
        ['ori', 'Loses eleven thousand dollars. Posts once, months later, in a different room: *someone told me to read page 41 and i didnt.* He is still trading. He is much better at it now.'],
        ['CANDLEWICK', 'Made a great deal of money on the way down and never once pretended otherwise. You have not spoken since. You are not sure whether you owe him a thank you or an apology, and you suspect the answer is both.']
      ]
    },

    secret: {
      id: 'secret', cls: 'secret', kicker: 'Ending · hidden',
      title: 'The Long Wick',
      sub: 'Everything proven, everyone still standing, and it still was not yours.',
      body: [
        'You did it the slow way and you did all of it. Every item on the board sourced twice. Four people who would each, separately, say the same thing out loud with their names attached. Nothing published that you could not defend line by line, and nothing traded, at all, in three days.',
        'The Ledger Review runs it Friday and the regulator has already had it since Thursday afternoon, which turns out to matter enormously. Two other outlets pick it up by lunchtime. A fourth writes a piece about you, which is worse than it sounds.',
        'And on Monday morning a fund nobody has heard of files a disclosure showing a short position opened eleven days before any of it, closed on Thursday evening at 16:19, and the beneficial owner is a man called Elias Marek.',
        'He never lied to you. That was the trick. He told you the truth for three days and let you do the only thing he could not do himself, which was be believed.',
        'You built the cleanest case anybody in this story will ever build, and somebody else got paid for it. Both of those are permanent.'
      ],
      epilogue: [
        ['Sable', 'Named, ruined, and the first person quoted in every follow-up. Two years later she writes something about it herself and it is better than anything written by anyone else.'],
        ['Nadia', 'Flat, calm, and unbearable about it in the way only she is allowed to be.'],
        ['Dorian', 'Does not go to prison. Very few people do. He is, however, finished, which is a different and slower thing.'],
        ['You', 'Fourteen thousand followers became sixty. You are asked to speak at things. You keep saying the same sentence and nobody wants it: *the story was not that I was right, it was that I nearly was not.*']
      ]
    },

    viral: {
      id: 'viral', cls: 'viral', kicker: 'Ending · public and unprotected',
      title: 'Wildfire',
      sub: 'You were first. First is not the same as right.',
      bodyStrong: [
        'It goes out at 16:20 and by 16:41 it is the only thing anybody is talking about. Two million views before midnight. Your notifications become a physical sensation, a sort of pressure behind the eyes that does not stop for four days.',
        'And most of it holds. The retrieval log holds. The fills hold. Four of the eleven screenshots do not, and those four are all anybody on the other side wants to discuss, for eleven months, in public, using your name.',
        'You are right, and it is nothing at all like being believed. The correction you post on day six gets four percent of the reach of the original.'
      ],
      bodyWeak: [
        'It goes out at 16:20 and for about ninety minutes you are the most important person on the internet.',
        'Then somebody with a law degree and a grudge starts going through it line by line, and by Saturday the conversation is not about a manipulated stock. It is about a man who posted eleven screenshots, four of which prove nothing, and named people he could not prove anything about.',
        'The letter arrives on Tuesday. It is very polite. It uses your legal name, which you have not seen written down in years, and it lists nine statements and asks you to substantiate each one.',
        'You can substantiate two.'
      ],
      epilogue: [
        ['Dorian', 'Sues. Not to win — to make it expensive. It is expensive.'],
        ['Sable', 'Is named in your thread whether or not you meant to name her. She does not reply to your message. She does not reply to the next one either.'],
        ['ori', 'Reads it at 16:44, eleven minutes too late to matter, and thanks you anyway, which is the single hardest part of the whole week.'],
        ['You', 'Are, eventually, largely vindicated. It takes fourteen months and by then the audience that would have cared has moved on to something else. You still think it was worth it. Most days.']
      ]
    },

    profit: {
      id: 'profit', cls: 'profit', kicker: 'Ending · paid',
      title: 'The Green Day',
      sub: 'Nothing bad happened. That is the whole ending.',
      body: [
        'The release lands at 16:15 and the floor goes and you watch it go with a number in your account that is larger than it has ever been.',
        'Nobody comes for you. There is no knock, no letter, no thread. On Monday you post a video about risk management and it does well, because you are good at this, and everything you say in it is true.',
        'The room is archived in the spring. Dorian starts another one under a different name eighteen months later and it is bigger. Two of the people in it are people you introduced him to.',
        'You keep the file. Not to use — you are never going to use it. You keep it because deleting it would be an admission, and you are not ready to make one of those to an empty room at two in the morning.',
        'The money is still there. It works exactly like money. That is what nobody warns you about: it does not feel like anything, and it never stops not feeling like anything.'
      ],
      epilogue: [
        ['ori', 'Eleven thousand dollars. He posts once at 16:17 asking what to do. You are online. You see it.'],
        ['Sable', 'Takes the rest of the contract, because you told her it was fine, and is finished as a creator within a year. She does not blame you. That is worse.'],
        ['Nadia', 'Never asks. Not once. But something in how she answers the phone changes in about March, and it does not change back.'],
        ['You', 'Are fine. You are going to be completely fine. You have thought about the 16:17 message roughly once a week since, usually at around two in the morning, usually about the word *someone*.']
      ]
    },

    fail: {
      id: 'fail', cls: 'fail', kicker: 'Ending · the story is you',
      title: 'Bagholder',
      sub: 'You were mostly right, and it did not save you.',
      body: [
        'You were not wrong about the big thing. You were wrong about the small things, and the small things are all anybody litigates.',
        'The ledger was fabricated — not entirely, which is what made it lethal. Thirty-eight of the forty-one names were real. Three were not, and two of those three had lawyers, and one of them had never heard of Dorian Vale in his life.',
        'By Saturday you are not a person who found something. You are a case study, used by other people, in videos with your face in the thumbnail, about the dangers of amateur investigation.'
      ],
      variants: {
        marginCall: {
          sub: 'The account went first. Everything else followed.',
          body: [
            'The account is gone before the story is. You are liquidated on Thursday afternoon, four minutes before the release that would have made you right, which is the kind of detail nobody believes when you tell it.',
            'That is the thing that finishes it. Not the ledger, not the lawyers — the fact that when it mattered you were not a journalist with a file, you were a blown-up trader with a grievance, and every single person on the other side got to say so.'
          ]
        },
        becameIt: {
          sub: 'You had the document and you used it.',
          body: [
            'The short filled at 11.14 and closed at 3.90 and made you more money in ninety seconds than the previous two years combined.',
            'They do not find it because they are clever. They find it because that is exactly what the surveillance is for: an account with no history in the name, opening a large position against the trend, hours before a scheduled release that had not been distributed.',
            'The file you spent three days building is entered into evidence. Not as your case. As the proof you knew.'
          ]
        }
      },
      epilogue: [
        ['Dorian', 'Is the injured party now. He is extremely good at being the injured party.'],
        ['CANDLEWICK', 'Goes dark on Thursday night and never comes back. The account is deleted on Sunday. He made his money either way.'],
        ['Nadia', 'Says one thing, once, and never brings it up again: *you did the brave version before the boring version.*'],
        ['ori', 'Loses everything and never learns that any of it was connected to any of this.']
      ]
    },

    survive: {
      id: 'survive', cls: 'survive', kicker: 'Ending · unresolved',
      title: 'Flat and Breathing',
      sub: 'You kept the file. The file keeps.',
      body: [
        'It happens without you. You watch it the way you would watch weather, from a chair, with your hands still.',
        'Nine thousand four hundred people are online at 16:15. You are one of them. You do not type anything, and the thing about not typing anything is that it takes no time at all and leaves no record.',
        'On Friday the room reframes it as a hit piece by shorts. By the following Thursday the price is at ninety cents and the room is quiet, and Dorian posts a long message about grief that is genuinely moving if you do not know what you know.',
        'The folder is on a drive in a drawer. Every document in it is still true. The retrieval log will still say forty-seven minutes in ten years, and the fills will still be five minutes early, and page 41 is not going anywhere.',
        'Nothing is resolved. You still have every option you had on Monday, plus one: you now know exactly what you are, when it is difficult, at four o\'clock in the afternoon.'
      ],
      epilogue: [
        ['The file', 'Intact. Sourced. Unused. It does not expire.'],
        ['Dorian', 'Fine. Better than fine. Starts a new room in the autumn and messages you about it, warmly, as if nothing at all had happened. Because from where he is standing, nothing did.'],
        ['Sable', 'Survives, barely, on the strength of not having filmed the last two.'],
        ['ori', 'Is still in the room. There is always another one. You have his handle written down.']
      ]
    }
  };

  LC.ENDING_ORDER = ['clean', 'secret', 'viral', 'profit', 'fail', 'survive'];

  /* ---------------- resolution ---------------- */
  LC.resolveEnding = function (s) {
    const f = s.flags;
    const v = LC.verifiedCount(s);
    const named = !!(f.sableOnRecord || f.nadiaVouches && f.marisolReady);
    const profited = !!(f.finalShort || f.finalLong || f.tradedOnDraft);
    const kept = ['nadia', 'sable', 'candlewick'].every((k) => s.rel[k] >= 62);

    if (s.integrity <= 0) return { id: 'fail', variant: 'marginCall' };
    if (f.tradedOnDraft) return { id: 'fail', variant: 'becameIt' };
    if (f.pushedLedgerBlind && f.channel !== 'regulator') return { id: 'fail', variant: null };

    if (v >= 5 && kept && f.refusedDeal && f.sableOnRecord && f.finalFlat &&
        (f.channel === 'regulator' || f.channel === 'press')) return { id: 'secret', variant: null };

    if ((f.channel === 'regulator' || f.channel === 'press')) {
      if (v >= 4 && named && !profited) return { id: 'clean', variant: null };
      if (v < 3) return { id: 'fail', variant: null };
      return { id: 'clean', variant: null };
    }

    if (f.channel === 'public') {
      if (v < 2) return { id: 'fail', variant: null };
      return { id: 'viral', variant: v >= 4 ? 'strong' : 'weak' };
    }

    if (f.tookTheDeal || f.channel === 'silence' || (profited && LC.equity(s) > s.startCapital * 1.4)) {
      return { id: 'profit', variant: null };
    }
    return { id: 'survive', variant: null };
  };
})(window.LC);
