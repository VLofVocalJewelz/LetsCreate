/* ============================================================
   Items — keys and tools. Each is a flag with a face on it, so
   there is exactly one source of truth for what you are carrying.
   ============================================================ */
(function (LC) {
  'use strict';

  LC.ITEMS = {
    archiveLog: {
      name: 'Archive retrieval log', kind: 'document',
      desc: 'Forty pages of monospace proving when a document became public.',
      use: 'Verifies E-01.'
    },
    tapeExport: {
      name: 'Time-and-sales export', kind: 'document',
      desc: 'Raw prints from the Marketscope trial. Every trade, every millisecond.',
      use: 'Verifies E-03 — and E-03 is what makes the ledger checkable.'
    },
    riskSheet: {
      name: "Nadia's carbon risk sheet", kind: 'tool',
      desc: 'Handwritten, photographed, one line per rule. She gave you the copy under the carbon.',
      use: '+1 Focus every session, permanently. Discipline is an item.'
    },
    recorder: {
      name: 'Phone recorder', kind: 'tool',
      desc: 'One tap, no light, no sound.',
      use: 'Lets you record a conversation. Consider what that makes you.'
    },
    tier3: {
      name: 'Tier 3 invite code', kind: 'key',
      desc: 'Eight characters and a rule you agreed to before you read it.',
      use: 'Opens the room behind the room.'
    },
    marisolCard: {
      name: "Marisol Trang's card", kind: 'key',
      desc: 'A phone number, an outlet, and a standard you may not be able to meet.',
      use: 'Opens the newsroom.'
    },
    metaDump: {
      name: 'Burner metadata', kind: 'document',
      desc: 'Headers, timezones, and one reused handle from eight years ago.',
      use: 'Points at who CANDLEWICK really is.'
    },
    draft1615: {
      name: 'The 16:15 draft', kind: 'hot',
      desc: 'A press release that has not happened yet.',
      use: 'Evidence if you hold it. A felony if you trade it.'
    }
  };

  LC.ITEM_ORDER = ['riskSheet','archiveLog','tapeExport','metaDump','recorder','tier3','marisolCard','draft1615'];
  LC.heldItems = (s) => LC.ITEM_ORDER.filter((k) => !!s.flags[k]);
})(window.LC);
