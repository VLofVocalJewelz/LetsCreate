# The Last Candle — design notes

## The premise in one line

Three market days. A low-float stock being walked uphill on purpose. You can prove it,
profit from it, or survive it — and the game is mostly about the difference.

## Structure: time × place

The mandated spine is a market day — pre-market, opening volatility, midday, power hour,
after-hours — repeated across three days. Exploration is layered on top as a **second
axis**: fifteen sessions × six locations.

```
              DESK   ROOM   TIER3   DINER   STUDIO   NEWSROOM
D1 pre-mkt     ██     ██      ·       ·        ·         ·
D1 open        ██     ██      ·       ·        ·         ·
D1 midday      ██     ██      ·       ·        ·         ·
D1 power       ██     ██      ·       ·        ·         ·
D1 after       ██     ██      ·      ██       ▓▓         ·
D2 …           ██     ██     ▓▓      ██       ▓▓        ▓▓
D3 …           ██     ██     ▓▓      ██       ▓▓        ▓▓
                                ▓▓ = unlocked by a story flag
```

Travel is free; acting costs **Focus**. That single rule is what makes exploration a
real decision: you can see everywhere, but you cannot do everything.

## Hubs are generated, not authored

Fifteen sessions × six places would be ninety hand-written "what would you like to do"
nodes. Instead `LC.hubFor(phase, location)` assembles one from whichever action nodes
declare themselves for that phase and place:

```js
{ kind:'action', phase:'d2_midday', at:'newsroom', cost:1, once:true,
  label:'Sit down with Marisol', req:{ flag:['newsroomOpen'] }, … }
```

Authored prose then goes only where it carries story. ~65 hand-written nodes instead
of ~110.

## The four systems

| System | What it actually measures |
|---|---|
| **Account Integrity** | How you *carry* risk — sizing, leverage, honouring a stop, whether your book is defensible if somebody reads it. Not whether you win. Hits zero → forced Margin Call ending. |
| **Credibility** | Whether your word would carry weight tomorrow. Spent by hyping and by teasing claims you cannot support; earned by teaching mechanics instead of making accusations. |
| **Composure** | Energy. Drains with volatility, size, and confrontation; restored by sleeping, eating, and leaving the desk. Below 34 you lose a Focus every session. |
| **Relationships** | Four tracked (Nadia, Dorian, Sable, CANDLEWICK) plus Marisol as a ladder. They gate locations, evidence, and two endings. |

## Evidence and verification

Eight items, each `unknown → held → verified | debunked`. Only **verified** counts.
Verification rules are **declarative**, so `tools/validate.js` can prove every item has
a satisfiable route to verified:

```js
E03: { verify: { cost: 2, rules: [
  { when: { flag:['tapeExport'] }, result:'verified', msg:'…' },
  { otherwise: true,               result:'held',     msg:'…' } ] } }
```

Two design rules the system exists to express:

- **A screenshot is not evidence.** Most items need a *second* artefact — an archive
  retrieval log, a raw time-and-sales export, a signed contract — before they hold.
- **A gift has a giver.** `E-04` (the tier ledger) can only be verified by cross-checking
  it against two things you proved yourself. Publish it blind and it is *debunked*, and
  you become the story. It is a trap, and it is meant to be.

`E-08` is your own trade log. It is acquired automatically if you size up, it cannot be
un-acquired, and it goes with you to whoever you take the story to.

## The six hinges

Ordinary choices have consequences. Hinges reshape the board. They get three things
nothing else gets: the interface goes quiet (rails dim, rain thins, one line reads
*"this one does not come back"*), autosave commits **before** the choice renders so
reloading returns you to the moment of choosing rather than before it, and the journal
writes down what just became impossible.

| | Session | The choice | What closes |
|---|---|---|---|
| **H1** | D1 power | Tier 3 | Opens or seals a location |
| **H2** | D1 after | Sable's call | Her testimony, `E-02`, and her studio |
| **H3** | D2 midday | The tier ledger | The scapegoat trap |
| **H4** | D2 after | Dorian's forty thousand | Four endings |
| **H5** | D3 midday | The channel | Selects the ending |
| **H6** | D3 after | Your book at 16:15 | What the record says you did |

## Ending resolution

`LC.resolveEnding(state)` is a pure function of flags, verified count, relationships and
your final position, evaluated in strict order so the severe cases win:

```
integrity == 0                         → Bagholder / Margin Call
traded on the unpublished draft        → Bagholder / Became It
published the ledger blind             → Bagholder
5+ verified, people kept, money refused, Sable on record, flat, official channel
                                       → The Long Wick
regulator or press   → 4+ verified + named source + flat → Clean Print
                     → under 3 verified                  → Bagholder
public thread        → 4+ verified → Wildfire (strong) / else Wildfire (weak)
took the deal, or silence, or profited heavily and said nothing → Green Day
otherwise                              → Flat and Breathing
```

Nobody gets out clean. The high-integrity ending costs Sable her career and Nadia her
account. The hidden ending ends with Elias Marek making a fortune off work you did for
free. That is the thesis, not a bug.

## Content boundaries

The brief prohibits real signals, advice, tickers, and any instruction for manipulation.
The line held throughout: **detection gets the detail, perpetration stays at narrative
altitude.**

The player learns to read an archive retrieval log, match a screenshot against raw
time-and-sales, notice that uniform 800-share blocks are a machine rather than a crowd,
and find a lockup clause on page 41. All forensic. What the scheme's operators *do* is
only ever described the way a news story describes it — what happened and why it was
wrong, never how to run it.

Enforced structurally as well as editorially: **complicity is playable, execution is
not.** There is no verb in this game for *coordinate*, *pay for promotion*, or *hold a
bid*. Sable takes the promo money; you can only enable, refuse, or protect her. You can
trade badly, stay silent, and take the money. You can never operate the machine.

The price path is authored and identical every run — no market model, no strategy space,
nothing transferable. The largest cash outcome sits on the most compromised path, and
its epilogue is written to land hollow.
