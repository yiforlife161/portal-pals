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
| `src/previews/` | Drawings for special pals. Sir Rattlebones, Talon (eagle) and the undead dragon are **now in the game** as the Skeleton Knight, Sky Eagle and Grave Dragon looks (see Special pals); Puddle is still **not added**; the robot (`mecha.js`) is now in the game as the Wheel Bot. Now in the game as the Iron Cyclops: an original one-eyed soldier in black and gold (`cyclops.js`, `cyclops_preview.png`: all-black full helmet (no gold on it), one big blue eye in a round opening, black mouth grille, black plate armour with gold trim, gauntlet fists; Undead, melee, Giant). The owner's own drawing of a giant eyeball on a black-and-gold body was declined as an Eye-Brawl (Skylanders) look-alike, and so was a hooded/eye-only version; the helmet keeps it distinct. Now in the game as the Masked Rogue: a slim masked human rogue girl (`rogue.js`, `rogue_preview.png`: dark blue ponytail, green eye mask, brown bandana over nose and mouth, full brown leather armour, a dagger in each hand; Life, melee, Normal). The owner's green-elf ninja drawings were declined as Stealth Elf (Skylanders) look-alikes; the human version replaces them. Now in the game as the Mech Dragon: the owner's mech dragon (`mechdragon.js`, `mechdragon_preview.png`: green dino-dragon standing up, blue mech helmet with gold crest and bolts, toothy jaw, blue-and-gold mech wings, orange claws, yellow lens eyes on the helmet sides, wrist blaster; Tech, Normal, ranged). Now in the game as the Mushroom Guy: the owner's mushroom guy (`shroom.js`, `shroom_preview.png`: yellow one-eyed bean body, big red cap with white spots and gills, red clawed gloves, throws a little spotted mushroom; Life, ranged, Normal). To preview a drawing in game: insert its file before `var PAL_BODIES = {` in a temporary copy, add an entry, build the mock pages, and screenshot (see how the eagle/robot previews were made). Originally: Sir Rattlebones (skeleton knight, Undead, melee) and Puddle (chubby purple baby dragon with gold horns and teal wings, Magic, ranged), and Talon (placeholder name; the owner's own drawing of a blue eagle with an arm cannon, Air, ranged, with a 3-feather crest and glowing cannon core added; the cannon replaces the wand as his weapon). Also an unnamed slim undead purple dragon designed here (dark swept-back horns, bone ridge spikes, round snout, glowing cyan eyes, torn wings with holes, bony tail with a ghost flame, throws a ghost flame; Undead, ranged). The owner's own purple dragon drawing was declined as a Cynder look-alike, so this one was designed from scratch; an earlier cloud/storm version was dropped at the owner's request. The drawing functions are in `knight.js` / `dragon.js` / `eagle.js` / `wyrm.js`; `eagle_preview.png` / `wyrm_preview.png` show them in game. |

Test version (claude.ai artifact, owner's private test page): https://claude.ai/artifact/8Lgy5MWmdkUGTQynb3C2G2. Publish `src/portal-pals-play.html` to that URL after each change.

**Game rule: no passive health regeneration in any minigame.** Food drops are the only way to heal (Guard Post, Boss Raid, Island Quest). Island Quest used to heal 7%/s after 4 s out of a fight; that was removed. Do not add it to new minigames. Test: `node src/mock2/tqregen.js`.

**Special pals (`c.body`):** hand-drawn bodies picked under "Look" in the New pal form: `eagle` (Sky Eagle, Air, ranged, arm cannon), `wyrm` (Grave Dragon, Undead, ranged, purple lightning shots via `shotLook` / `drawZap`, also sent as 'zap' in arena snapshots and as a flag in quest `Z`), `knight` (Skeleton Knight, Undead, melee, sword and shield), `mecha` (Wheel Bot, the owner's yellow robot on a wheel, Tech, ranged, always Giant), `cyc` (Iron Cyclops, the one-eyed soldier with the all-black helmet, Undead, melee with fists, always Giant), `rogue` (Masked Rogue, slim human girl in leather with a green eye mask and bandana, dark blue ponytail, two daggers, Life, melee, Normal), `md` (Mech Dragon, the owner's green dino-dragon in blue-and-gold mech gear with lens eyes and a wrist blaster, Tech, ranged, Normal), `sh` (Mushroom Guy, the owner's yellow one-eyed mushroom with a red spotted cap and red clawed gloves, holding a little mushroom over his glove, Life, ranged, Normal). `tk` (Technician, the owner's technician girl, Tech, melee, Normal). Drawing: (`tinker.js`, `tinker_preview.png`: red bob, blue armour with gold gear emblems, brown suit, blue bracers and boots with gold bands, big double-ended wrench, tech goggles with brass rims and tinted lenses worn over her eyes). `ar` (Arcane Dragon, an original dark-purple magic dragon: fiery orange crystal horns and tail crystal (fireball colours), dark gold cheek runes, wing tips, toe claws and sparkles, amber slit eyes, starry-night wings, lavender belly, holds a magic fireball; Magic, ranged, Normal; `arcane.js`). The owner asked for the small blue bits to be dark yellow; for the horns and tail crystal they then asked for a fiery yellow like the fireball; they were made fire-orange with yellow glints instead of flat yellow, to stay clear of the famous purple fire dragon (gold horns + gold tail tip). Do not make them yellow/gold. Previewed, not added: a winged armoured warrior in yellow and black (`sentinel.js`, `sentinel_preview.png`: knight helmet with a black visor and white eye slits, black crest, breastplate with a black chevron, black shoulder guards, a big silver blade-wing hanging down behind each shoulder, solid plates without stripes, yellow gauntlets with blue gems and one big blue-steel blade sticking out of each; Air, melee, Giant). The owner's bee-warrior drawings were declined as Swarm (Skylanders) look-alikes; keep this one free of bee features (antennae, insect eyes or wings, stripes, stinger). Size is locked too (`giant` in `PAL_BODIES`): the first three are always Normal, the Wheel Bot always Giant; `cleanChar` forces it on load. `PAL_BODIES` holds label, locked element, locked style and the `art` / `back` / `front` drawing functions (from `src/previews/*.js`, now copied into the game). `cleanChar` keeps `body` and forces the element and style to match; `coopChar` sends it to friends. `palFigure` draws the full figure; `palArt` returns the full figure in a `.pbody` wrapper (cards, form preview). Picture upload is hidden for them. The player still names them. Test: `node src/mock2/tbodies.js <outdir>`.

**Pet facing:** every pet entry in `PETS` must have `face: 'left' | 'right' | 'front'` (which way its picture looks). `petFlip` mirrors it so it always looks where it walks. (This used to be a hand-kept list `PET_LEFT`; the Key Bird was missing from it and walked backwards.) A pet without `face` falls back to guessing from its eye positions and logs a console warning. When adding a pet, set `face` and run `node src/mock2/tpets.js` (must say PASS).

**Island Quest bridges:** `mkBr` puts each end at 0.8 of that island's edge measured on the side the bridge meets it (`quEdge(B, -ux, -uy)` for the far end; it used to measure the wrong side, so on lumpy islands about 3% of bridges stopped over the cliff and could not be walked off). `node src/mock2/tbridge.js` walks every bridge of 300 seeds x 3 levels with the game's own movement and must report `bad: 0`.

**Ranged vs melee (combat minigames):** melee swings do 26 to everything in a short arc; ranged shots do `RANGED_DMG` (19, was 11) and pass through up to `SHOT_PIERCE` (3) monsters in a line (was 1). Owner found ranged far too slow before. Same numbers in Arena / Guard Post / Boss Raid (`df.shots`, guest `C.ghost`) and Island Quest (`qu.bolts`). Test: `node src/mock2/tpierce.js`.

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
  - **Direct connections (WebRTC, cloud.js `rtcHost` / `rtcGuest` / `coopLink`):** after the game starts, the host opens a WebRTC data channel to each guest (star: guests only link to the host). The offer/answer go through that pair's `matches/{pairId}` doc as `rtcO` / `rtcA` (`{k: gameKey, sdp}`, whole SDP after ICE gathering, no trickle; free Google STUN, no TURN). Every message carries a per-sender number `_q`; `coFresh` drops anything not newer, so a copy arriving by both roads is used once. Each side pings twice a second with `{_p: 1|0}` = "I hear you"; a link is live (`rtcLive`) only if data came in during the last second AND the other side confirms it hears us (catches one-way breaks). The host writes `/h` to the RTDB only while some guest's link is not live; a guest writes its slot only while its link is not live (Treasure Hunt guests always write too, and the host relays each guest's message to the other guests as `{_r: slot, d}`). Links that don't open within 15 s are closed and the game stays on the server. Old game versions never answer the offer, so they simply stay on the server. `localStorage['pp.noDirect']='1'` forces the server road (testing). The label `#pp-net` ("⚡ Direct connection" / "☁ Server connection" / "⚡ Direct 1/2") sits bottom center, or under the top panels in Sky Cannon. `ppCoop.net()` returns `[1|0]` per link. Tests: `RT_LAT=45 RT_JIT=30 node mock2/tlag.js arena|quest` (direct: ~20 ms behind and 0 KB/s database traffic; `NODIRECT=1` for the server: ~80 ms; `CUT=1` breaks one direction and checks both sides fall back), `node mock2/tdig3.js` (3-player Treasure Hunt relay).
  - Send rates: host and guests both 25 a second (every 40 ms, cloud.js `coopLink`); skilling together every 60 ms (`SKP_RATE`).
  - **Other players' pals use `netIn` / `netStep`** (all co-op games): each update carries the sender's clock (`t`), so the pal's speed is known and it is drawn where it most likely is now (guessing ahead at most `NET_AHEAD` = 0.2 s, stopping the guess as soon as an update shows it slowed down), with small corrections eased in. Any new co-op game should feed friends' positions through `netIn(o, t, x, y, jumpDist)` and move them with `netStep(o, dt)`.
  - **Data use (Firebase Spark: 10 GB RTDB downloads a month).** Measured host→guest / guest→host per second: arena 11 / 2.5 KB, quest 12 / 2.1 KB, cannon 8.1 / 2.3 KB, skilling 3.8 / 1.6 KB. Savers: the quest sends only monsters that changed in the last 0.4 s and are near a player (full list every 10th picture and for 0.4 s after one disappears, `Ff` flag; the guest merges); the cannon sends only the last 1–1.5 s of shots and kills (`cnRecent`). Keep new snapshots small: don't resend history every time, send static or far-away things in the occasional full picture. `node mock2/tquest.js 2 1` etc. print `RATE` with bytes per second and the biggest snapshot fields.
  - Arena monsters still use the snapshot buffer (`coopBufPush` / `coopInterp`, 60–220 ms behind). When a guest attacks, the host strikes from the guest's latest reported spot (`b.tx`), not the smoothed one.
  - Measuring: `RT_LAT=45 RT_JIT=30 node mock2/tlag.js arena|quest` walks a pal in a circle and prints how far behind and how uneven it looks on the other screen (the mock RTDB now delivers every write, in order, with that delay). Results: arena 185 ms → 75 ms behind, quest 230 ms → 85 ms; on a bad connection (90–170 ms) 250 ms → 125 ms.
  - If 3–4 player games freeze at the start while 2-player games work, check the Realtime Database rules allow writes to `g2`/`g3` under `coop/$key`.
- **Skilling together (`SKP`, md `skill`):** the "Skill with friends" button (`#skpinv`, bottom-left on the skilling islands) invites through the normal party lobby. Guests take over the host's gathering nodes (mine, forest, grave, fish; `skpLayout`, kept afterwards) and follow their state from the host (`N`: used up / timer left); a guest's first hit on a tree is sent as `hit` so the host starts its 40 s timer. Everyone's actions, loot, xp and rolls stay on their own device. Snapshots ~8/s (`SKP_RATE`), layout and pal looks every 3 s or when a guest asks (`nl`). Leaving the skilling islands, the Leave button or 15 s without data ends it. Test: `node mock2/tskill.js`.
- **Saves:**
  - Local slot per signed-in user. Cloud sync uses a `pp.syncT.{uid}` stamp and a device id (`DEV`).
  - A BroadcastChannel pauses duplicate tabs.
  - `pullNewer` / `checkNewer` load a newer cloud save if one exists.
  - `nowS()` = server-corrected time.
- **Minigames:**
  - Battle Arena / Guard Post / Boss Raid share the `df` engine (`df.mode` arena/defense/raid; `dfAr()` = arena-like).
  - Boss pay: `RAID_SETS[lv].pay` / `.xpay` multiply the boss's base gold / xp (gold 2.5 / 3.5 / 5, survival 3; xp 1.7 / 2.4 / 3.3, survival 2). Owner wants raids only a little above the arena and Island Quest: hard raid ≈ 205 gold / 990 xp vs hard arena 188 / 825. Check with `node src/mock2/traidpay.js`.
  - Sky Battle = `cn`, Treasure Hunt = `th`, Starstones = `ss`.
  - Levels 1–3 plus Survival (`SURV_LV = 4`, locked behind achievements).
  - Every level is 3 waves (`MG_LEVELS`); Medium and Hard keep only their 3 hardest waves (`CN_SETS`, `DF_SETS`).
  - In Survival, every 3 waves = +1 win (`SURV_EVERY`; every boss in Raid Survival), via `dfSurvWins` and `cnWaveDone`. Treasure Hunt Survival counts each island.
  - 30 wins unlock a game's hat.
- **Sky Cannon co-op (`cn.coop`, md `cannon`):** up to 4 players, levels 1–3 and Survival. Every player has their own cannon: your own double gun and console stay in the middle, friends' cannons stand at the right corner, on a floating rock on the left (above the Leave button) and higher on the right (`cnMateSpot`), with their pal portrait (`cnMatesDom`, `.cn-mate`) and a reticle in their element color.
  - Ships are stored as a share of the screen (`nx`, `ny`, `nvx`, size `ws`; `cnShipPx` turns them into pixels per device), so every screen size sees the same sky. The host spawns and moves them; guests extrapolate between snapshots.
  - More players = more ships: `cnStartWave` sets `cn.mul = 1 + 0.6 × (players − 1)`, need × mul, spawn gap ÷ mul, allowed escapes × (1 + 0.5 × (players − 1)). Solo numbers are unchanged.
  - Each device simulates its own shots and decides its own hits; guests send hit ship ids (`H`) and fire events (`F`) in `cnOut`, the host applies damage (`cnHostTick` → `cnDamage`) and broadcasts fires (`F`) and kills (`K`, numbered, the last 40 kept in every snapshot so nobody misses one).
  - Rewards: every downed ship pays every player, divided by `cn.mul` (each player earns about a solo run, like the arena); achievements `cn_down`/`cn_tough` count only your own kills; accuracy is your own. Wins, Survival wins every 5 waves, Survival record and bonus happen on every device.
  - Host lost: guests end after 9 s ("connection lost", they keep what they earned). A guest who stops sending for 12 s is dropped and the next wave scales down.
  - Test: `node mock2/tcannon.js 2 1` (players, level; `HOSTIDLE=1` only guests shoot, `STOP=45 SECS=220` bots stop so the run is lost; 4 players use 4 different screen sizes).
- **Island Quest (`qu`, game key `quest`, building `questgate`):** a seeded chain of islands (`quGen(seed, lv, players)`: 5/7/9 main islands for levels 1–3, 2 side islands with chests, bridges between them). Some bridges are locked by a gate (needs a key) or a wall (needs a bomb, 1.5 s fuse); each key/bomb is placed on an island before its lock, so every level can be finished. One carried item at a time, shown over the pal's head (`.qcarry`). Monsters are the Battle Arena's (`QU_FOES` points at `DF_TYPES` goblin/imp/brute) with the arena's telegraphed attacks (`quFoeTick`: goblin shot, imp charge, brute slam; fireballs in `qu.esh`), kept on their own island. Levels are 7/10/13 islands with 2/3/4 locks. Monsters are drawn by the arena's own `dfDrawFoe` (with `df.t` swapped for `qu.t`), so arena art updates show up here too. The chain wanders in any direction (`quGenTry`: no overlaps, no bridge over an island or across another bridge; a layout that boxes itself in retries with the next seed). Islands have wobbly outlines (`quF`, also used for walking) and are painted once per island (`quIslCanvas`, props baked in). Walking over a different key/bomb swaps it with the one you hold (`it.noP` keeps the dropped one from swapping straight back). Knocked-out pals get back up at the furthest main island reached (`qu.cp`). Chests roll a golden treasure (`GOLDS`, 12, a book like the fossils, `state.island.golds`/`goldN`) or coins, per device. Reaching the flag wins for everyone: `questWins`, 30-win hat `h_quest`, pet `PETS.quest`, achievements `q_*`. Movement is limited by `quWalk` (islands + bridges, closed locks block the bridge middle) and slides along edges (`quMove`).
  - Losing (like the arena): alone, a knockout ends the quest; in co-op a fallen pal gets back up after 8 s (`QU_RESPAWN`, hat halves it) unless everyone is down at once. You keep what you earned.
  - Survival (`qu.surv`, lv `SURV_LV`, unlocked by finishing every quest achievement, like the other minigames): like Treasure Hunt survival. Each flag = +1 win, the level's bonus gold and the monsters' gold/xp go into a pot (`quPot`), paid by Stop & claim (`quSurvClaim`), by leaving, or when the run is lost. Level size grows 1→2→3, and every level the monsters get tougher: `quSurvK(n)` = +8% health and damage per level, which also sets speed (`quHardSpd`, up to +35%), attack wait (`quHardCd`, down to 60%) and extra monsters per island (`quHardN`, +1 every 5 levels, up to +3). Food drops from 1 in 10 monsters. Next level seed `quSurvSeed`; co-op guests follow the host by the stage number `sn` in the snapshot.
  - Co-op (md `quest`, seed passed as `am`): the host runs monsters, items, locks and chests (`quSnap`); guests send position and attacks (`quOut` → `quIn`) and roll their own chest rewards when they see a chest open (`quApply`).
  - Tests: `node mock2/tquest.js 2 1` (players, level) runs bots (`mock2/qbot.js`) through a co-op quest; `node mock2/tquest.js 4 2` for a full party.
- **Card collection (`CARDS`, binder `KB`, packs `KP`, trades `KT`; "Cards" button in the right dock):**
  - 500 cards made from their number, so every device draws the same card (`kdRecipe` → `kdArt`, cached in `KD_ART`). Element blocks in `ELEMENTS` order, common → legendary inside each (`CARD_SPLIT`: 260/140/75/25). Names = element word (`KD_PRE`) + an ending that fits the creature (`KD_SUF_F`: wings, tail, quad…), legendaries hand-named (`KD_LEG`). All art is original (procedural blobs, ghosts, robots, worms…).
  - Card html: `kdCardHtml(card, variant, { w, n, isNew })`. Variants 0 normal, 1 silver (9% per card), 2 gold (2%) are CSS frames (`.kc.v1/.v2`, shine animation). The art is one SVG with no ids (no gradients), so the same card can show twice on a page.
  - Packs: 1000 coins, 5 cards, last card at least uncommon (`kdRoll`, `CARD_ODDS`). Duplicates from the start.
  - Save: `island.cards = { o: {num*3+variant: count}, p: packs, t: trades, td: applied trade ids, pend }`, cleaned by `kdClean` in `cleanIsland`. **Any new save field must be added to `cleanIsland`**, or it is dropped on load.
  - Binder: 9 pockets a page, 2 pages side by side from 720 px wide, swipe to turn on phones; filters (element, rarity, have/missing, variant); tap a card to zoom. While visiting, the Cards button shows the friend's binder (shared through `shareIsland` → `cards.o`).
  - Trading (cloud.js `TR`, `window.ppTrade`): uses the pair's `matches/{pairId}` doc with `game: 'trade'` (no new Firestore rules needed) and an invite in `users/{uid}/invites` (`game: 'trade'`). Each side edits its own offer (`offA`/`offB`, up to 20 stacks) and raises its own counter (`vA`/`vB`); any offer change clears both Ready marks. A Ready mark (`okA`/`okB`) is the short key `"vA:vB"` (`trKey`), so the swap only happens when both marks equal the current counters. (Ready used to hold the JSON of both offers, which could come out different on two phones and stopped trades.) Every trade has a random `tid`; the swap id is `'t' + tid`, and each side swaps its own cards once (`kdTradeApply`, `td`). The "done" screen only shows when the swap really happened. A doc marked `done` without both Ready marks ends with "Nothing was traded". `TR_PV` is the protocol version: if the two players' games differ, the trade is refused with a "reload" message (bump it whenever the trade doc format changes). Pressing Ready also saves `pend` (with `tid`); if the game closes before the swap, `trResume` finishes it on the next sign-in. Heartbeats `hbA`/`hbB` every 8 s; 45 s without one ends the trade. Not allowed while visiting (visits don't save). Friends list has a Trade button for online friends.
  - Leaderboard "Cards collected" (`lb.cards`, unique cards in any variant).
  - Trade window: each side shows a "✓ Ready" / "Choosing…" badge and a status line; the button reads "✓ Ready" or "Undo Ready" (never "Not ready", which players read as a status and pressed again, undoing their Ready). Your own cards lock while you are ready; a change that clears a Ready shows "The cards changed, so press Ready again." Ready taps within 0.8 s are ignored (`ktReady`). The swap waits until the server has both Ready marks (`includeMetadataChanges`, no `hasPendingWrites`).
  - Test: `node mock2/ttrade.js` (swap, double tap, Ready reset, decline, cancel, reload, resume after closing). `FS_LAT=300` makes the mock Firestore behave like the real one: your own writes show at once, and reach the server and your friend 300 ms later. `FS_SHUF=1` shuffles map key order in every snapshot, like the real server can.
- **Pets:**
  - Skilling pets: 1 in 20,000 per action. Minigame pets: 1 in 300 per win.
  - **A pet only helps while it is the one following you** (`petOn(k)`, `state.island.petMain`).
  - In co-op, only a friend's equipped pet shows and helps.
  - On the main and skilling islands the following pet moves every frame (`petTick(dt)` from `frame`, friends' pets via `skpMatePet(m, dt)`), using `petStep`: time-based easing plus an 8-unit leash from the owner, and it only jumps on a real teleport (over 40 units). Don't move it back to a timer: that caused low-fps lag and snapping.
- **Hats:** skilling hats drop 1 in 3,000 per action, minigame hats come from 30 wins, plus the hat shop. Data is `c.hat`.
- **Capes:** one per skill (`CAPES`, keyed by skill key), unlocked when that skill hits 99 (`capeOwned`, derived from skill level, no extra save data). Worn per pal like hats (`c.cape`, kept by `cleanChar`, sent in `coopChar`). `capeLuck(skill)` = 20% roll, only when the hero wears that skill's cape. Gathering skills (mining, fishing, woodcutting, gravedigging) get +1 resource; making skills (potionmaking, cooking, smithing, firemaking) keep their materials. Drawn behind the body by `capeBack` in `palFigure`. Panel: `capesOpen` (Pal > Capes). The Max Cape (`max`, last in `CAPE_ORDER`) unlocks when every skill is 99 (`capeMaxed`) and works in every skill at 1 in 4 (`CAPE_MAX_CHANCE`).
- **Minigame capes (`g_cannon`, `g_defense`, `g_arena`, `g_raid`, `g_dig`, `g_quest`, `g_stones` in `CAPES`, listed in `GCAPE_ORDER`):** unlocked at 500 wins (`GCAPE_WINS`; Treasure Hunt counts hunts; Starstones also 500, `GCAPE_STONES`). Not needed for the Max Cape, which only counts the 8 skills, from `winCount`, so no extra save data except `st.cp_<game>` that marks the unlock toast as shown (`gcapeCheck`, run from `hatCheck` and `mgPetRoll`). Wearing one gives +25% gold and xp (`GCAPE_BONUS`) from that minigame: `giveReward` boosts whatever is paid while that minigame is open (`mgOpenGame`, `mgCapeMul`) and returns what it actually paid, so result panels show the boosted numbers. Coins added on the spot (Treasure Hunt digs and Pip, Island Quest chests) are boosted where they are found (`capeBoost`), and survival pots pay with `giveReward(…, true)` so nothing is boosted twice. The emblem is the minigame's hat art. Capes panel has two sections; every minigame's wins line shows "Cape: n / 500".
  - Hat, cape and achievement toasts share one queue (`achToastQ`, items can carry `html` and `ms`), so they no longer cover each other.
  - **New minigame:** add its cape to `CAPES`/`GCAPE_ORDER`, its game key to `mgOpenGame`, and make sure its payouts go through `giveReward`.
- **Decorations:**
  - Defined with `def(key, label, cat, w, svgFn, {n, say})`. Each needs an entry in both `BUILD_LIMIT` and `COST`.
  - Categories: buildings, nature, town, fun, themed ("Elements and skills").
  - Tapping with a pal toggles element looks. Build mode has a lock button. Build mode lets the camera pan past the world edges.
- **Practice spots:** 5-minute AFK stations per skill. The four that use something up (fire, cook, smith, potion) also pay gold: `afkGold` = practice xp × that skill's gold-to-xp rate for its most basic item (`AFK_GOLD`: 3/40, 4/40, 8/13, 8/12), so it grows with level like the xp. Endless materials (`end_log`, `end_ore`, `end_fish`, `end_bone`) only work at practice stations.

## Building something new: what the owner expects

These are lessons from earlier requests, where the owner had to send fixes afterwards. Build to them from the start.

### Look and feel
- **Reuse what the arena already has instead of making new versions:**
  - Attacks: `dfMakeTeam` numbers (dmg 26 melee / 11 ranged, range 34 / 140, cd 0.5), with a 0.25 s input buffer.
  - Swipe slash fx, not a circle.
  - Hp bar above the pal (`.dfp-hp`; add the game's class to the `.cn.df.th.qu .dfp-hp` rule).
  - Monsters drawn by the **live** `dfDrawFoe` override, the one near the arena art. It reads `df.t` and `f.T`, so swap `df.t` while drawing.
  - Telegraphed attacks: goblin shot (red line), imp dash (red lane), brute slam (red circle).
  - Food drops, not hearts (`DF_FOOD`, `dfDrawFood`).
- **Islands are never flat circles.** Use wobbly outlines, cliff layers, grass mottling and tufts, and props, painted once to a canvas (see `quShape` and `quIslCanvas`).
- **Levels go in every direction**, not left to right.
- **Minigame buildings** use chunky outlined SVG, the same scale as the Sky Cannon, Guard Post, Arena, Raid, Dig Site, Starstone Table and Quest Gate.
- **Carried or overhead items** must be big enough to read on a phone and sit above the name tag.

### Rules every minigame follows
- **Levels:** 1–3 unlock in order (`lvOpen`, `lvWon`, `lvMark`; needs `LV_FIRST`/`LV_HARD` entries).
- **Survival (`SURV_LV = 4`):**
  - Locked until **every** achievement for that game is done (`survOpen(g)`).
  - Never make an achievement that needs Survival, or it can never be unlocked.
  - The lock button shows the achievement count.
- **Survival works like Treasure Hunt:**
  - Each cleared stage = +1 win.
  - Gold, xp and treasures go into a pot, paid when the player stops, leaves or loses.
  - Difficulty grows over time.
  - Record goes to `survRecord`/`survBest`.
- **Payout like the arena:** per kill `T.gold`/`T.xp`, the total × `MG_PAY` (0.5), xp × `XP_MULT` (15), via `giveReward`. Give both gold and xp.
- **Losing like the arena:** solo, a knockout ends the run. In co-op, fallen pals revive after a delay unless everyone is down. Keep what was earned.
- **Rewards:**
  - Win counter (`winCount`).
  - Game hat at 30 wins (`HAT_ORDER`, `HAT_GAME_NOTE`, `HAT_GAME_NAME`).
  - Game pet at 1 in 300 per win (`MG_PET_GAMES`, `PETS[g]`), with a bonus that only works while it is the pet following you.
  - Achievements in `ACH_DEFS`.
- **No softlocks.** Every required item must be reachable before its lock and must be the right kind. Run a bot over many seeds to prove it.
- **Mobile is the main platform:**
  - Add the mode to the `tc` touch controls (`tcTick`, `tcKeys`, `tcAct`).
  - Add the mode to the `.tc.<mode> .tc-btn` CSS, or the attack button won't show.
  - Check the layout against the HUD at phone width.
- **Sounds:** wrap the game's functions in the `sfx` section near the end of the file. Existing names: click, coin, levelup, ach, pet, swing, zap, hit, hurt, boom, win, lose, wave, build, fossil, and others.
- **Serbian:** every new English string goes into `sr2.py`/`sr3.py`. The game file embeds the dictionary, so a `rep()` on English text can match twice. Update the i18n file first, then patch.

### New-minigame checklist (hard-coded lists)
A new game key must be added to every one of these lists, or something quietly breaks:
- **Island cleaner:** the `lvWon` list, the `surv` list and the win fields.
- **Building:** `BUILD_LIMIT`, `COST` and the games category list.
- **Opening the game:** `commandInteract`, plus the `busy`/`arenaOpen` checks.
- **"Is a minigame open" checks:** the frame loop, WASD, `coopStart`, `ssOpen`, `cnOpen`, `thOpen`, `enterArea` and visits.
  - Do **not** add the new game's own flag to its own co-op start check.
- **Stats and visits:** leaderboards (`lbStats` wins and survival, `lbCats`), `shareIsland` (visit data) and `friendView`.
- **cloud.js:**
  - `PT_TITLE`
  - `md` normalization
  - the building check map `B`
  - the invite popup text, including the Survival text when `lv === 4`
  - `lbFmt` survival unit
- **Other:** `leaveSure`, `tcTick`, `tcKeys` and `tcAct`.
- **Co-op hooks:** `coopStart` dispatches on `md`. The game needs snap/out/in/apply functions, the seed passed as `am`, a guest guard after the link closes, and end/lose sent in the snapshot.
- `ACH_GAMES` is unused, so don't rely on it.

### Known traps
- `dfLevelMult` exists but is **unused**: pal level doesn't scale damage. Only upgrades (dmg/spd/crit with `EL_CAPS`) do.
- There are two `dfDrawFoe` definitions. The later override is the live one.
- Long Python patches break in bash heredocs. Write them to a file. Make `rep()` assert counts and abort before writing.
- Multi-browser tests: invite every player first, then accept, or the first accept auto-starts the game.
- Bot stalls in tests are often caused by running tests in parallel. Rerun the test alone first.

## Content rule

Pals and art must be **original designs**: no characters from Skylanders, Spyro or other franchises, and no look-alikes.

## Open items

- Sir Rattlebones and Puddle: previews approved in spirit, not added to the roster yet (see `src/previews/`). Adding them needs a per-pal body type (e.g. `c.body`) so `palFigure` draws the custom art.
