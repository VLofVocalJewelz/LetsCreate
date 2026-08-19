/* ============================================================
   Evidence — everything you can hold, and what it costs to be sure
   status: 'unknown' | 'held' | 'verified' | 'debunked'
   ============================================================ */
(function (LC) {
  'use strict';

  LC.EVIDENCE = {
    E01: {
      code: 'E-01',
      name: 'The 47-minute gap',
      desc: 'The amended share registration hit the public archive 47 minutes before the press release went out.',
      detail: 'Two documents, one afternoon. The filing is timestamped 15:41. The wire story is timestamped 16:28. In between, the tape shows steady accumulation in odd-lot blocks.',
      links: ['E03', 'E04'],
      weight: 2,
      verifyLabel: 'Pull the archive access log',
      verifyCost: 1,
      verify: function (s) {
        if (s.flags.archiveLog || s.rel.nadia >= 58) {
          return { result: 'verified', msg: 'Archive log matches. The gap is real and it is on the record.' };
        }
        return { result: 'held', msg: 'Two screenshots are not a record. You need the archive access log itself.' };
      }
    },

    E02: {
      code: 'E-02',
      name: 'The Bellwether agreement',
      desc: 'A six-thousand-dollar "awareness content" contract with an investor-relations shop. No disclosure clause anywhere in it.',
      detail: 'Bellwether Investor Relations LLC. Two pages. Deliverables: three videos, one live session, "organic tone". Payment on publication, not on performance — which is the only reason it is technically legal, and the reason it is disgusting.',
      links: ['E04'],
      weight: 2,
      verifyLabel: 'Ask Sable for the signed copy',
      verifyCost: 1,
      verify: function (s) {
        if (s.flags.sableBurned) return { result: 'held', msg: 'She read what you posted about her. She is not sending you anything.' };
        if (s.rel.sable >= 58) return { result: 'verified', msg: 'Signed copy, both counterparties, wire confirmation. Sable sent all of it.' };
        return { result: 'held', msg: 'She will not hand over a signed contract to someone she is not sure of.' };
      }
    },

    E03: {
      code: 'E-03',
      name: 'Fills before the call',
      desc: "Dorian's own screenshots show fills at prices that printed before he posted the alert to the room.",
      detail: 'He posted the entry at 09:41. The block he screenshotted filled at a price the tape only touched between 09:33 and 09:36. He is bragging with a receipt that indicts him.',
      links: ['E01', 'E04'],
      weight: 3,
      verifyLabel: 'Match against the time-and-sales export',
      verifyCost: 2,
      verify: function (s) {
        if (s.flags.tapeExport) return { result: 'verified', msg: 'Time and sales confirms it. That price did not exist when he told the room to buy.' };
        return { result: 'held', msg: 'A screenshot proves nothing without the raw time-and-sales beside it.' };
      }
    },

    E04: {
      code: 'E-04',
      name: 'The tier ledger',
      desc: 'A spreadsheet of Candle Room members sorted into tiers, with dollar figures beside the top rows.',
      detail: 'Forty-one names. Three tiers. A column labelled ALLOC. If it is real it is the whole scheme in one file. If it is fake it is the perfect thing to hand a man you want destroyed — or a trap for whoever publishes it.',
      links: ['E01', 'E03', 'E06'],
      weight: 3,
      forgeable: true,
      verifyLabel: 'Cross-check the ledger against the filings and the tape',
      verifyCost: 2,
      verify: function (s) {
        const e1 = s.evidence.E01 === 'verified';
        const e3 = s.evidence.E03 === 'verified';
        if (e1 && e3) return { result: 'verified', msg: 'Three of the ALLOC rows line up to the minute with fills you already proved. This file is real.' };
        if (s.flags.pushedLedgerBlind) return { result: 'debunked', msg: 'The metadata is eight days old and authored on a machine that did not exist eight days ago. Someone built this for you.' };
        return { result: 'held', msg: 'You cannot check a ledger against nothing. Prove the filing gap and the fills first, or you are just holding a spreadsheet.' };
      }
    },

    E05: {
      code: 'E-05',
      name: 'The lockup calendar',
      desc: 'Insider lockup on the placement shares expires this week. The date is public. Almost nobody reads it.',
      detail: 'Restricted shares become sellable at the close of the third session. The float roughly triples. Every candle before that is being drawn on a floor that is about to vanish.',
      links: ['E07'],
      weight: 2,
      verifyLabel: 'Read the placement prospectus properly',
      verifyCost: 1,
      verify: function () {
        return { result: 'verified', msg: 'Page 41, in the language nobody reads. The floor disappears Thursday at the close.' };
      }
    },

    E06: {
      code: 'E-06',
      name: 'Who CANDLEWICK is',
      desc: 'A trail of small mistakes — a reused handle, a timezone, a phrase only one person uses — pointing at a name.',
      detail: 'Elias Marek. Co-founded the room with Dorian, left eighteen months ago with no announcement and no goodbye post. Currently positioned for the thing he is warning you about.',
      links: ['E04'],
      weight: 2,
      verifyLabel: 'Put the name to him and watch what he does',
      verifyCost: 1,
      verify: function (s) {
        if (s.rel.candlewick >= 52 || s.flags.marisolHelp) {
          return { result: 'verified', msg: 'He does not deny it. He asks how long you have known — which is its own confirmation.' };
        }
        return { result: 'held', msg: 'He goes quiet for six hours, then sends a single question mark. Not enough.' };
      }
    },

    E07: {
      code: 'E-07',
      name: 'The 16:15 draft',
      desc: 'A press release that has not been released yet, scheduled for after the close on the final day.',
      detail: 'Embargoed, unpublished, and in your inbox. Holding it makes you a witness. Trading on it makes you the thing you are chasing.',
      links: ['E05'],
      weight: 3,
      hot: true,
      verifyLabel: 'Confirm the release is genuine without touching a trade',
      verifyCost: 2,
      verify: function (s) {
        if (s.evidence.E01 === 'verified' && s.rel.candlewick >= 40) {
          return { result: 'verified', msg: 'Same distribution service, same account number as the last one. It is genuine, and it is not yours to use.' };
        }
        return { result: 'held', msg: 'Unsigned, unheaded, unverifiable. Right now it is a rumour with formatting.' };
      }
    },

    E08: {
      code: 'E-08',
      name: 'Your own book',
      desc: 'Your trade log. Every fill you took in this name, timestamped and permanent.',
      detail: 'If you go to anyone with this story, this file goes with it. It either says you watched, or it says you participated.',
      links: [],
      weight: 0,
      counter: true,
      verifyLabel: null,
      verify: function () { return { result: 'verified', msg: 'It verifies itself. That is the problem.' }; }
    }
  };

  LC.EVIDENCE_ORDER = ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08'];

  LC.verifiedCount = function (s) {
    return LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'verified' && !LC.EVIDENCE[id].counter).length;
  };
  LC.evidenceWeight = function (s) {
    return LC.EVIDENCE_ORDER.reduce((sum, id) =>
      sum + (s.evidence[id] === 'verified' ? LC.EVIDENCE[id].weight : 0), 0);
  };
  LC.heldCount = function (s) {
    return LC.EVIDENCE_ORDER.filter((id) => s.evidence[id] === 'held').length;
  };
})(window.LC);
