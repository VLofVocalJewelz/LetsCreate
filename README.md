# The Last Candle

A narrative thriller about a retail trader who finds the seams in a coordinated pump —
and has three market days to decide whether being right is worth what proving it costs.

**Fiction.** Every company, ticker, exchange, platform, person and price is invented.
`MB:HALX` trades on the Meridian Board, which does not exist. Nothing here is financial
advice, and none of it describes a real market, firm, or case. The price path is authored
and identical on every playthrough — there is no market model underneath it and no
strategy to be learned from it.

---

## Run it

**Double-click `index.html`.** No build step, no install, no server, no backend.
Everything is plain HTML/CSS/vanilla JS loaded with classic `<script>` tags
specifically so it works from `file://`.

If your browser blocks `localStorage` on `file://`, saving degrades to session-only and
the game says so — use **Settings → Copy save code** to keep a run, or serve it:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

Fonts load from Google Fonts when online and fall back to system stacks when not.

## Play it

You are **@nightdesk** — a retail trader and small content creator with $28,400 you
rebuilt after one very bad summer. A low-float stock gaps 46% overnight on a press
release with five hedges in one sentence.

- Each session gives you **Focus**. Looking at things costs it. It does not carry over.
- **Travel between places is free. Acting is not.**
- Evidence starts *unconfirmed*. Only **verified** evidence counts at the end.
- Six choices are marked *"this one does not come back."* They mean it.

Keyboard: number keys pick choices · `I` inventory · `J` the file · `M` status ·
`T`/`R`/`B` tape/room/board · `Esc` closes.

## The six endings

| Ending | How to reach it |
|---|---|
| **The Clean Print** | File with the regulator or hand it to the newsroom, with **4+ verified** items and a named source (Sable on the record). Stay flat into the close. |
| **Wildfire** | Publish the thread yourself. Two variants: **4+ verified** survives contact; fewer and you become the story. |
| **The Green Day** | Take Dorian's forty thousand, or delete the file, or profit heavily and stay quiet. |
| **Bagholder** | Fewer than 2 verified on a public channel, or publish the tier ledger unchecked. Variants: **Margin Call** (integrity hits zero) and **Became It** (trade on the unpublished draft). |
| **Flat and Breathing** | Keep the file, warn nobody, survive. The sequel hook. |
| **The Long Wick** *(hidden)* | 5+ verified, Nadia/Sable/CANDLEWICK all ≥62, refuse the money, get Sable on the record, stay flat, and go to the regulator or the press. You will still not get out clean. |

## Tests

Everything is plain data, so the whole story is machine-checkable. Requires only `node`.

```bash
node tools/validate.js       # graph integrity: links, reachability, ids, flags
node tools/endings.test.js   # 13 resolver unit tests — every ending and variant
node tools/simulate.js       # 11 scripted policies, reports the ending each reaches
node tools/fuzz.js 3000      # random playthroughs: no crashes, no dead ends
```

Current status: **127 nodes, all reachable · 13/13 resolver tests · 3,000 fuzz runs
with 0 crashes and 0 dead ends.**

These caught six real bugs during the build, including Focus being billed twice per
action (which silently capped verification at 2 and made half the endings unreachable),
and a hidden ending that required keeping the trust of the man you were exposing.

## Layout

```
index.html
styles/     theme · layout · components · scenes
src/
  engine/   util · state · rules          (requirements, effects, generated hubs)
  data/     cast · evidence · items · locations · tape · roomfeed
            story-day1 · story-day2 · story-day3 · story-verify · endings
  ui/       ui · panels · board · chart · room · rain · audio
  game.js                                  (boot, routing, the finale)
tools/      validate · simulate · fuzz · endings.test · lib
docs/       DESIGN.md
```

## Known limitations

- **The hidden ending is verified by resolver unit test, not by a bot playthrough.**
  The best heuristic policy reaches 7/7 evidence and passes every gate except getting
  Sable on the record — it cannot plan cross-session travel the way a player can.
- Location art is CSS/SVG atmosphere rather than illustration.
- `tools/lib.js` mirrors the routing in `src/game.js` rather than sharing it; the two
  can drift. Worth extracting if the story grows.
- No audio files — ambience is synthesised with WebAudio and off until you ask for it.
