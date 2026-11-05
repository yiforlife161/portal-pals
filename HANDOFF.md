# Portal Pals: handoff notes

Read this first when picking the project up in a new chat.

Portal Pals is a single-file browser game: build an island, pick pals, play minigames and skilling, with co-op over Firebase. The owner plays it on Android phones and a PC with his sister and girlfriend. There's also a Serbian translation.

## Where things live

| Path | What it is |
|---|---|
| `index.html` (repo root) | The **live site** (GitHub Pages: https://yiforlife161.github.io/portal-pals/). Built output: don't edit by hand. |
| `src/portal-pals-play.html` | **The game source.** One HTML file with one big ES5 IIFE. This is what you edit. It's also the "test version" (no cloud, its own save slot, a one-time 500,000-gold gift line). |
| `src/cloud.js` | Firebase module: sign-in, cloud saves, friends, chat, invites, Starstones PvP, co-op party lobby and Realtime Database links. Gets appended to the live build. |
| `src/make_live.py` | Builds `src/index.html` (live version) from the two files above: live save keys, removes the gold gift, adds cloud.js and the tab icons. |
| `src/i18n/` | Serbian translation. `sr2.py` = exact strings, `sr3.py` = templates (`§` = any text, `§1`/`§2` numbered). `build.py` injects the dictionary into the game file. |
| `src/mkx.py` | Builds the test pages in `src/mock2/` (adds `window.__df`, `__th`, `__st`, … hooks). |
| `src/mock2/` | Playwright test harness with a mock Firebase (`server.js` simulates Firestore rules, `rt.js` the Realtime Database). `t*.js` are tests. |
| `src/previews/` | Two original pals drawn but **not added yet**: Sir Rattlebones (skeleton knight, Undead, melee) and Puddle (chubby purple baby dragon with gold horns and teal wings, Magic, ranged). The drawing functions are in `knight.js` / `dragon.js`. |

Test version (claude.ai artifact, owner's private test page): https://claude.ai/artifact/8Lgy5MWmdkUGTQynb3C2G2. Publish `src/portal-pals-play.html` to that URL after each change.

## How every change ships

All commands run from `src/`.

1. **Back up:** `cp portal-pals-play.html pre-vNNN.html` (backups are git-ignored scratch, optional).
2. **Patch with Python, not by hand:** read the file and use a `rep(a, b)` helper that asserts the exact match count before replacing. Keep the ES5 style (no arrow functions or `let` in the game file; cloud.js is a modern module).
3. **Translate:** add new English UI strings to `i18n/sr2.py` (insert before the line containing `"Chat": "Ćaskanje",`), or to `i18n/sr3.py` for templates (after the `"Co-op · Level §. You both get…"` line). Text inside `data-notr` spans (player names) is skipped.
4. **Build and check:**
   ```
   python3 i18n/build.py portal-pals-play.html
   node -e "const s=require('fs').readFileSync('portal-pals-play.html','utf8');const m=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];require('fs').writeFileSync('chk_main.js',m)" && node --check chk_main.js
   node --input-type=module --check < cloud.js
   python3 make_live.py      # -> src/index.html
   python3 mkx.py            # -> mock2/coopx.html, newx.html, ssx.html test pages
   ```
5. **Test** with Playwright (Chromium and Playwright are preinstalled in Claude's workspace), for example:
   - `node mock2/tco.js`: 2-player arena co-op.
   - `node mock2/t4co.js arena|raid|dig`: 4-player party.
   - `node mock2/t3surv.js dig`: 3-player treasure hunt survival.
   - `node mock2/treinv.js`: re-invite after a game.
   - `node mock2/tpv2.js`: Starstones PvP.
   - `node mock2/up3.js`: reload safety.
   Multi-browser tests sometimes flake on setup; rerun before debugging.
6. **Ship:** copy `src/index.html` to the repo root and commit with these lines at the end of the message:
   ```
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01VLdLc6X68oqXFjxVGVTjho
   ```
   Then `git push`, and publish `src/portal-pals-play.html` to the test artifact URL above.
7. **Also commit the updated `src/` files**, so the next chat has the latest source.

A "fresh build" (a clean copy without test gifts) is only made when the owner asks for one (`make_fresh.py` was not carried over; recreate it if needed).

## Key systems (quick map)

- **Co-op (up to 4 players):**
  - The host simulates the game. Snapshots go to RTDB `coop/{key}/h` every 50 ms. Guests write their input to `/g`, `/g2`, `/g3` every 66 ms.
  - Each player has a slot: 0 = host, 1–3 = guests. Snapshot field `P` = `[slot, x, y, face, hp, maxhp, ko, swing, zap, walk, kbN, kbx, kby, stN, gone]`.
  - Game-side helpers: `df.mates`, `coopMatePal(slot)`, `coopMates(o)`. Treasure Hunt uses `th.coop.mates`, `thMate(slot)` and `thMatesDone()`.
  - Lobby is in cloud.js (`PT`, `ptLobby`, `ptGo`, `coopInvite`, `coopAccept`). Invites are one Firestore `matches/{pairId}` doc per pair, with states invite → joined → go (with `key`, `slot`, `roster`), or cancel/left/declined.
  - Guests smooth with a snapshot buffer (`coopBufPush` / `coopInterp`).
  - If 3–4 player games freeze at the start while 2-player games work, check the Realtime Database rules allow writes to `g2`/`g3` under `coop/$key`.
- **Skilling together (`SKP`, md `skill`):** the "Skill with friends" button (`#skpinv`, bottom-left on the skilling islands) invites through the normal party lobby. Guests take over the host's gathering nodes (mine, forest, grave, fish; `skpLayout`, kept afterwards) and follow their state from the host (`N`: used up / timer left); a guest's first hit on a tree is sent as `hit` so the host starts its 40 s timer. Everyone's actions, loot, xp and rolls stay on their own device. Snapshots ~8/s (`SKP_RATE`), layout and pal looks every 3 s or when a guest asks (`nl`). Leaving the skilling islands, the Leave button or 15 s without data ends it. Test: `node mock2/tskill.js`.
- **Saves:**
  - Local slot per signed-in user. Cloud sync uses a `pp.syncT.{uid}` stamp and a device id (`DEV`).
  - A BroadcastChannel pauses duplicate tabs.
  - `pullNewer` / `checkNewer` load a newer cloud save if one exists.
  - `nowS()` = server-corrected time.
- **Minigames:**
  - Battle Arena / Guard Post / Boss Raid share the `df` engine (`df.mode` arena/defense/raid; `dfAr()` = arena-like).
  - Sky Battle = `cn`, Treasure Hunt = `th`, Starstones = `ss`.
  - Levels 1–3 plus Survival (`SURV_LV = 4`, locked behind achievements).
  - In Survival, every 5 waves = +1 win (every boss in Raid Survival), via `dfSurvWins`. Treasure Hunt Survival counts each island.
  - 30 wins unlock a game's hat.
- **Island Quest (`qu`, game key `quest`, building `questgate`):** a seeded chain of islands (`quGen(seed, lv, players)`: 5/7/9 main islands for levels 1–3, 2 side islands with chests, bridges between them). Some bridges are locked by a gate (needs a key) or a wall (needs a bomb, 1.5 s fuse); each key/bomb is placed on an island before its lock, so every level can be finished. One carried item at a time, shown over the pal's head (`.qcarry`). Monsters are the Battle Arena's (`QU_FOES` points at `DF_TYPES` goblin/imp/brute) with the arena's telegraphed attacks (`quFoeTick`: goblin shot, imp charge, brute slam; fireballs in `qu.esh`), kept on their own island. Levels are 7/10/13 islands with 2/3/4 locks. Knocked-out pals get back up at the furthest main island reached (`qu.cp`). Chests roll a golden treasure (`GOLDS`, 12, a book like the fossils, `state.island.golds`/`goldN`) or coins, per device. Reaching the flag wins for everyone: `questWins`, 30-win hat `h_quest`, pet `PETS.quest`, achievements `q_*`. Movement is limited by `quWalk` (islands + bridges, closed locks block the bridge middle) and slides along edges (`quMove`).
  - Co-op (md `quest`, seed passed as `am`): the host runs monsters, items, locks and chests (`quSnap`); guests send position and attacks (`quOut` → `quIn`) and roll their own chest rewards when they see a chest open (`quApply`).
  - Tests: `node mock2/tquest.js 2 1` (players, level) runs bots (`mock2/qbot.js`) through a co-op quest; `node mock2/tquest.js 4 2` for a full party.
- **Pets:**
  - Skilling pets: 1 in 20,000 per action. Minigame pets: 1 in 300 per win.
  - **A pet only helps while it is the one following you** (`petOn(k)`, `state.island.petMain`).
  - In co-op, only a friend's equipped pet shows and helps.
- **Hats:** skilling hats drop 1 in 3,000 per action, minigame hats come from 30 wins, plus the hat shop. Data is `c.hat`.
- **Capes:** one per skill (`CAPES`, keyed by skill key), unlocked when that skill hits 99 (`capeOwned`, derived from skill level, no extra save data). Worn per pal like hats (`c.cape`, kept by `cleanChar`, sent in `coopChar`). `capeLuck(skill)` = 20% roll, only when the hero wears that skill's cape. Gathering skills (mining, fishing, woodcutting, gravedigging) get +1 resource; making skills (potionmaking, cooking, smithing, firemaking) keep their materials. Drawn behind the body by `capeBack` in `palFigure`. Panel: `capesOpen` (Pal > Capes). The Max Cape (`max`, last in `CAPE_ORDER`) unlocks when every skill is 99 (`capeMaxed`) and works in every skill at 1 in 4 (`CAPE_MAX_CHANCE`).
- **Decorations:**
  - Defined with `def(key, label, cat, w, svgFn, {n, say})`. Each needs an entry in both `BUILD_LIMIT` and `COST`.
  - Categories: buildings, nature, town, fun, themed ("Elements and skills").
  - Tapping with a pal toggles element looks. Build mode has a lock button. Build mode lets the camera pan past the world edges.
- **Practice spots:** 5-minute AFK stations per skill. Endless materials (`end_log`, `end_ore`, `end_fish`, `end_bone`) only work at practice stations.

## Content rule

Pals and art must be **original designs**: no characters from Skylanders, Spyro or other franchises, and no look-alikes.

## Open items

- Sir Rattlebones and Puddle: previews approved in spirit, not added to the roster yet (see `src/previews/`). Adding them needs a per-pal body type (e.g. `c.body`) so `palFigure` draws the custom art.
