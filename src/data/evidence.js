/* ============================================================
   Evidence — everything you can hold, and what it costs to be sure.
   status: 'unknown' | 'held' | 'verified' | 'debunked'
   Verification rules are DECLARATIVE so tools/validate.js can prove
   every item has a satisfiable path to 'verified'.
   ============================================================ */
(function (LC) {
  'use strict';

  LC.EVIDENCE = {
    E01: {
      code: 'E-01', weight: 2, links: ['E03', 'E04'],
      name: 'The 47-minute gap',
      desc: 'The amended share registration hit the public archive 47 minutes before the press release went out.',
      detail: 'Two documents, one afternoon. The filing timestamps 15:41. The wire story timestamps 16:28. In between, the tape shows steady accumulation in identical blocks.',
      verify: {
        cost: 1, label: 'Pull the archive retrieval log',
        rules: [
          { when: { flag: ['archiveLog'] }, result: 'verified', msg: 'Archive log matches to the second. The gap is real and it is on the record.' },
          { when: { rel: { nadia: 58 } }, result: 'verified', msg: 'Nadia pulls the retrieval log in nine minutes flat. "Forty-seven-oh-five. Write it down."' },
          { otherwise: true, result: 'held', msg: 'Two screenshots are not a record. You need the archive retrieval log itself.' }
        ]
      }
    },

    E02: {
      code: 'E-02', weight: 2, links: ['E04'],
      name: 'The Bellwether agreement',
      desc: 'A six-thousand-dollar "awareness content" contract with an investor-relations shop. No disclosure clause anywhere in it.',
      detail: 'Bellwether Investor Relations LLC. Two pages. Three videos, one live session, "organic tone". Payment on publication, not on performance — the only reason it is technically legal, and the reason it is disgusting.',
      verify: {
        cost: 1, label: 'Ask Sable for the signed copy',
        rules: [
          { when: { flag: ['sableBurned'] }, result: 'held', msg: 'She read what you said about her. She is not sending you anything, ever.' },
          { when: { rel: { sable: 58 } }, result: 'verified', msg: 'Signed copy, both counterparties, wire confirmation, the talking-points sheet. She sent all of it without being asked twice.' },
          { otherwise: true, result: 'held', msg: 'She will not hand a signed contract to someone she is not sure of.' }
        ]
      }
    },

    E03: {
      code: 'E-03', weight: 3, links: ['E01', 'E04'],
      name: 'Fills before the call',
      desc: "Dorian's own screenshots show fills at prices that printed before he posted the alert to the room.",
      detail: 'He posted the entry at 09:41. The block he screenshotted filled at a price the tape only touched between 09:33 and 09:36. He is bragging with a receipt that indicts him.',
      verify: {
        cost: 2, label: 'Match it against the raw time-and-sales',
        rules: [
          { when: { flag: ['tapeExport'] }, result: 'verified', msg: 'Time and sales confirms it. That price did not exist when he told the room to buy.' },
          { otherwise: true, result: 'held', msg: 'A screenshot proves nothing without the raw time-and-sales beside it.' }
        ]
      }
    },

    E04: {
      code: 'E-04', weight: 3, links: ['E01', 'E03', 'E06'], tags: ['forgeable'],
      name: 'The tier ledger',
      desc: 'A spreadsheet of Candle Room members sorted into tiers, with dollar figures beside the top rows.',
      detail: 'Forty-one names. Three tiers. A column labelled ALLOC. If it is real it is the whole thing in one file. If it is fake it is the perfect gift for someone who wants a man destroyed — or a trap for whoever publishes it first.',
      verify: {
        cost: 2, label: 'Cross-check the ledger against the filings and the tape',
        rules: [
          { when: { verified: ['E01', 'E03'] }, result: 'verified', msg: 'Three ALLOC rows line up to the minute with fills you already proved. This file is real.' },
          { when: { flag: ['pushedLedgerBlind'] }, result: 'debunked', msg: 'The metadata is eight days old and authored on a machine that did not exist eight days ago. Somebody built this for you.' },
          { otherwise: true, result: 'held', msg: 'You cannot check a ledger against nothing. Prove the gap and the fills first, or you are holding a spreadsheet.' }
        ]
      }
    },

    E05: {
      code: 'E-05', weight: 2, links: ['E07'],
      name: 'The lockup calendar',
      desc: 'Insider lockup on the placement shares expires this week. The date is public. Almost nobody reads it.',
      detail: 'Restricted shares become sellable at the close of the third session. The float roughly triples. Every candle before that is drawn on a floor with an expiry date printed on it.',
      verify: {
        cost: 1, label: 'Read the placement prospectus properly',
        rules: [
          { otherwise: true, result: 'verified', msg: 'Page 41, in the language nobody reads. The floor disappears at Thursday\'s close.' }
        ]
      }
    },

    E06: {
      code: 'E-06', weight: 2, links: ['E04'],
      name: 'Who CANDLEWICK is',
      desc: 'A trail of small mistakes — a reused handle, a timezone, a phrase only one person uses — pointing at a name.',
      detail: 'Elias Marek. Co-founded the room with Dorian, left eighteen months ago with no announcement. Currently positioned for exactly the thing he is warning you about.',
      verify: {
        cost: 1, label: 'Put the name to him and watch what he does',
        rules: [
          { when: { rel: { candlewick: 52 } }, result: 'verified', msg: 'He does not deny it. He asks how long you have known — which is its own confirmation.' },
          { when: { flag: ['marisolHelp'] }, result: 'verified', msg: 'Marisol runs the handle through eight years of archives and comes back with one name and a date.' },
          { otherwise: true, result: 'held', msg: 'He goes quiet for six hours, then sends a single question mark.' }
        ]
      }
    },

    E07: {
      code: 'E-07', weight: 3, links: ['E05'], tags: ['hot'],
      name: 'The 16:15 draft',
      desc: 'A press release that has not been released yet, scheduled for after the close on the final day.',
      detail: 'Embargoed, unpublished, and in your inbox. Holding it makes you a witness. Trading on it makes you the thing you have spent three days chasing.',
      verify: {
        cost: 2, label: 'Confirm it is genuine without touching a trade',
        rules: [
          { when: { verified: ['E01'], rel: { candlewick: 40 } }, result: 'verified', msg: 'Same distribution service, same account number as the last one. It is genuine, and it is not yours to use.' },
          { otherwise: true, result: 'held', msg: 'Unsigned, unheaded, unverifiable. Right now it is a rumour with formatting.' }
        ]
      }
    },

    E08: {
      code: 'E-08', weight: 0, links: [], tags: ['counter'],
      name: 'Your own book',
      desc: 'Your trade log. Every fill you took in this name, timestamped and permanent.',
      detail: 'If you take this story to anyone, this file goes with it. It either says you watched, or it says you joined in.',
      verify: { cost: 0, label: null, rules: [{ otherwise: true, result: 'verified', msg: 'It verifies itself. That is the problem.' }] }
    }
  };

  LC.EVIDENCE_ORDER = ['E01','E02','E03','E04','E05','E06','E07','E08'];
  LC.hasTag = (id, tag) => ((LC.EVIDENCE[id].tags || []).indexOf(tag) >= 0);

  LC.verifiedCount = (s) =>
    LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'verified' && !LC.hasTag(id, 'counter')).length;
  LC.evidenceWeight = (s) =>
    LC.EVIDENCE_ORDER.reduce((n, id) => n + (s.evidence[id] === 'verified' ? LC.EVIDENCE[id].weight : 0), 0);
  LC.heldCount = (s) =>
    LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'held').length;
})(window.LC);
