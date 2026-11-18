import re, sys, os
SP = '/home/claude/portal-pals/src/sg/'
P = '/home/claude/portal-pals/src/portal-pals-play.html'
s = open(P).read()

def rep(a, b, n=1):
    global s
    c = s.count(a)
    if c != n:
        print('COUNT', c, 'for', a[:120]); sys.exit(1)
    s = s.replace(a, b)

code = ''.join(open(SP + f).read() for f in ['sg1.js', 'sg2.js', 'sg3.js', 'sg4.js', 'sg5.js', 'sg6.js', 'sg7.js'])
if '/* ==SG== */' in s:
    s = re.sub(r'/\* ==SG== \*/.*?/\* ==/SG== \*/\n?', lambda m: code.strip() + '\n', s, flags=re.S)
else:
    rep("/* ---------- card collection: 500 creature cards", code.strip() + "\n\n/* ---------- card collection: 500 creature cards")

if 'id="sgame"' not in s:
    # ---- html
    rep('''  <div class="cn-panel th-panel" id="qu-panel" hidden></div>
</div>
''', '''  <div class="cn-panel th-panel" id="qu-panel" hidden></div>
</div>
<div class="cn df th qu sg" id="sgame" role="dialog" aria-modal="true" aria-label="Skill challenge" tabindex="-1" hidden>
  <canvas id="sg-canvas"></canvas>
  <div class="df-pals" id="sg-pals"></div>
  <div class="cn-hud">
    <div class="cn-card"><span id="sg-lvl">Wave 1 / 3</span><b id="sg-time">1:15</b></div>
    <div class="cn-card sg-goal"><span>Points <b id="sg-pts">0 / 0</b></span><div class="sg-gbar"><i id="sg-bar"></i></div></div>
    <div class="cn-card sg-xpc"><span>XP</span><b id="sg-xp">+0</b></div>
    <button class="cn-leave th-claim" type="button" data-action="sg-claim" id="sg-claim" hidden>Stop &amp; claim</button>
    <button class="cn-leave" type="button" data-action="sg-leave">Leave</button>
  </div>
  <div class="sg-ord" id="sg-ord" hidden></div>
  <div class="sg-mini" id="sg-mini" hidden></div>
  <div class="cn-banner" id="sg-banner" aria-live="polite"></div>
  <div class="cn-panel th-panel" id="sg-panel" hidden></div>
</div>
''')
    # ---- css
    rep(".tc.df .tc-btn,.tc.th .tc-btn,.tc.qu .tc-btn{display:flex}", ".tc.df .tc-btn,.tc.th .tc-btn,.tc.qu .tc-btn,.tc.sg .tc-btn{display:flex}\n"
        ".sg-goal{min-width:130px}.sg-gbar{height:8px;background:rgba(255,255,255,.15);border-radius:5px;margin-top:5px;overflow:hidden}.sg-gbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#7affc4,#ffd23e);transition:width .25s}\n"
        "#sg-time.low{color:#ff7a6a}.sg-xpc b{color:#7affc4}\n"
        ".sg-ord{position:absolute;left:50%;top:calc(max(10px,env(safe-area-inset-top)) + 74px);transform:translateX(-50%);z-index:5;pointer-events:none}.sg-ord[hidden]{display:none}\n"
        ".sg-ords{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:max-content;max-width:94vw}\n"
        ".sg-o{background:rgba(24,14,48,.88);border:2px solid #c9a24a;border-radius:12px;padding:5px 7px 9px;position:relative;overflow:hidden}.sg-o.late{border-color:#ff5a4a}\n"
        ".sg-oi{display:flex;gap:2px}.sg-ic{display:inline-block}.sg-ic svg{display:block;width:100%;height:auto}\n"
        ".sg-o>i{position:absolute;left:0;bottom:0;height:5px;background:#7affc4;transition:width .25s linear}.sg-o.late>i{background:#ff5a4a}\n"
        ".sg-mini{position:absolute;left:50%;bottom:calc(max(12px,env(safe-area-inset-bottom)) + 150px);transform:translateX(-50%);z-index:8;width:min(90vw,380px);pointer-events:none}.sg-mini[hidden]{display:none}\n"
        ".sg-mb{background:rgba(24,14,48,.93);border:3px solid #c9a24a;border-radius:16px;padding:10px 14px;text-align:center;color:#fff;display:grid;gap:8px;font-weight:800}.sg-mb small{opacity:.8;font-size:12px;font-weight:600}\n"
        ".sg-rbar,.sg-fbar{position:relative;height:36px;background:linear-gradient(#2a72c8,#1a4a90);border-radius:10px;border:2px solid #fff}\n"
        ".sg-rbar .z{position:absolute;top:2px;bottom:2px;background:rgba(122,255,150,.4);border:2px solid #7aff96;border-radius:8px}.sg-rbar .z.in{background:rgba(122,255,150,.75)}\n"
        ".sg-rbar .f{position:absolute;top:50%;width:42px;transform:translate(-50%,-50%)}.sg-rbar .f svg{display:block;width:100%;height:auto}\n"
        ".sg-prog,.sg-heat{height:10px;background:rgba(255,255,255,.15);border-radius:6px;overflow:hidden}.sg-prog i{display:block;height:100%;background:#7affc4}\n"
        ".sg-fbar{background:linear-gradient(90deg,#3e3846,#6a6270,#3e3846)}.sg-fbar .z{position:absolute;top:2px;bottom:2px;background:rgba(255,210,62,.55);border:2px solid #ffd23e;border-radius:6px}\n"
        ".sg-fbar .m{position:absolute;top:-7px;bottom:-7px;width:6px;margin-left:-3px;background:#fff;border-radius:3px;box-shadow:0 0 8px #fff}\n"
        ".sg-heat i{display:block;height:100%;background:linear-gradient(90deg,#8a8f9a,#ff8a2a,#ffd23e)}\n"
        ".sg-hits{display:flex;gap:6px;justify-content:center;align-items:center;min-height:20px}.sg-hits span{width:14px;height:14px;border-radius:50%;border:2px solid #ffd23e}.sg-hits span.on{background:#ffd23e}.sg-hits em{font-style:normal;font-weight:900;color:#ffd23e;margin-left:8px}\n"
        ".sg-gear{list-style:none;padding:0;margin:0;display:grid;gap:6px;text-align:left;font-size:13px;width:100%}.sg-gear li{background:rgba(255,255,255,.06);border-radius:10px;padding:6px 9px;opacity:.8;border:1px solid transparent}\n"
        ".sg-gear li.on{opacity:1;border-color:#7affc4}.sg-gear i{color:#7affc4;font-style:normal;font-weight:800}.sg-gear small{display:block;opacity:.75}.sg-rate{font-size:13px;opacity:.92;margin:0}\n"
        "@media (max-width:520px){.sg-goal{min-width:96px}.sg-ord{top:calc(max(10px,env(safe-area-inset-top)) + 64px)}}")

    # ---- the portal into each challenge, next to each skilling area's gate
    rep("function wandSvg(col, cls){", '''/* the skill challenge portal: a stone arch with a swirl in the skill's colour and its icon on top (level 50+) */
function sgGateSvg(area){
  var A = AREAS[area], col = EL[A.el].c, sk = SKILLS.filter(function(k){ return k.key === A.skill; })[0];
  var ic = sk ? sk.icon().replace('<svg ', '<svg x="33" y="-14" width="34" height="34" ') : '';
  return SHD(36) + P('M12 92V46Q12 10 50 8Q88 10 88 46V92H72V48Q72 26 50 26Q28 26 28 48V92Z', '#8a8496', 2.8) +
    L('M18 60H26M18 76H26M74 60H82M74 76H82M30 18L36 26M70 18L64 26', '#5e5868', 2.4) +
    E(50, 62, 21, 30, col, 2.2) + E(50, 62, 15, 22, 'rgba(255,255,255,.35)', 0) + E(50, 62, 8, 12, 'rgba(255,255,255,.55)', 0) +
    L('M38 48Q50 40 60 52Q66 62 54 72Q44 76 42 66', 'rgba(255,255,255,.75)', 2.4) +
    C(50, 2, 19, '#2b2338', 2.4) + C(50, 2, 16, '#fff6c8', 0) + ic +
    R(34, 82, 32, 12, '#2b2338', 4, 2) + '<text x="50" y="91.5" text-anchor="middle" font-size="9" font-weight="900" fill="#ffd23e" font-family="system-ui,sans-serif">LV 50</text>';
}
[['mine', 'Cave Collapse'], ['fish', 'The Big Catch'], ['forest', 'Timber Rush'], ['potion', 'Cauldron Chaos'], ['cook', 'Sky Kitchen Rush'], ['smith', 'Forge Master'], ['fire', 'Beacon Keeper'], ['grave', 'Restless Graves']].forEach(function(g){
  def('sg_' + g[0], g[1], 'ore', 12, function(){ return sgGateSvg(g[0]); }, { mine:{ area: g[0], kind:'sgame' } });
});

function wandSvg(col, cls){''')
    rep("var node = !!(d.mine && d.mine.kind !== 'door' && d.mine.kind !== 'shop' && d.mine.kind !== 'afk');", "var node = !!(d.mine && d.mine.kind !== 'door' && d.mine.kind !== 'shop' && d.mine.kind !== 'afk' && d.mine.kind !== 'sgame');")
    rep("ITEMS[it.type].mine.kind !== 'afk' && it.s >= ITEMS[it.type].n));", "ITEMS[it.type].mine.kind !== 'afk' && ITEMS[it.type].mine.kind !== 'sgame' && it.s >= ITEMS[it.type].n));")
    rep("function isNode(it, area){ var m = ITEMS[it.type].mine; return !!(m && m.kind !== 'door' && m.kind !== 'shop' && m.kind !== 'afk' && (m.area || 'mine') === area); }",
        "function isNode(it, area){ var m = ITEMS[it.type].mine; return !!(m && m.kind !== 'door' && m.kind !== 'shop' && m.kind !== 'afk' && m.kind !== 'sgame' && (m.area || 'mine') === area); }")
    rep("""    isl.items = isl.items.filter(function(i){ return !isNode(i, area) || Math.hypot(i.x - afk.x, i.y - afk.y) > 6; });      /* nothing grows on top of the practice spot */""",
        """    isl.items = isl.items.filter(function(i){ return !isNode(i, area) || Math.hypot(i.x - afk.x, i.y - afk.y) > 6; });      /* nothing grows on top of the practice spot */
    var sgT = 'sg_' + area, sgp = isl.items.filter(function(i){ return i.type === sgT; })[0], sgq = sgGatePos(area);      /* the skill challenge portal */
    if (!sgp){ sgp = { id: uid(), type: sgT, x: sgq.x, y: sgq.y, flip: false, sc: 1, s: 0 }; isl.items.push(sgp); }
    else { sgp.x = sgq.x; sgp.y = sgq.y; }
    isl.items = isl.items.filter(function(i){ return !isNode(i, area) || Math.hypot(i.x - sgp.x, i.y - sgp.y) > 8; });""")
    rep("function gatePos(area){", "function sgGatePos(area){ var g = gatePos(area), I = SKILL_ISLES[AREAS[area].isle]; return { x: g.x + Math.min(25, I.r * 0.74), y: g.y + 7 }; }\nfunction gatePos(area){")
    rep("  if (m.kind === 'shop'){ cancelMining(); face(it.x > state.island.hx ? 1 : -1); pkOpen(area); return; }\n  if (c.element",
        "  if (m.kind === 'shop'){ cancelMining(); face(it.x > state.island.hx ? 1 : -1); pkOpen(area); return; }\n"
        "  if (m.kind === 'sgame'){ cancelMining(); face(it.x > state.island.hx ? 1 : -1); var sgWhy = sgCanPlay(area); if (sgWhy){ bubble(sgWhy); return; } if (SKP.coop) skpFinish('You started a skill challenge, so you stopped skilling together.'); sgOpen(area); return; }\n  if (c.element")

    # ---- every "is a minigame open" check
    rep("if (state.tab !== 'island' || document.hidden || !stage.clientWidth || cn.open || df.open || th.open || qu.open || ss.open) return;", "if (state.tab !== 'island' || document.hidden || !stage.clientWidth || cn.open || df.open || th.open || qu.open || ss.open || sg.open) return;")
    rep("if (state.tab !== 'island' || cn.open || df.open || th.open || qu.open || ss.open || ui.mode !== 'play' || !heroEl){ wkeys = {}; return; }", "if (state.tab !== 'island' || cn.open || df.open || th.open || qu.open || ss.open || sg.open || ui.mode !== 'play' || !heroEl){ wkeys = {}; return; }")
    rep("  if (state.tab !== 'island' || cn.open || df.open || th.open || qu.open || ss.open) return;", "  if (state.tab !== 'island' || cn.open || df.open || th.open || qu.open || ss.open || sg.open) return;")
    rep("  if (df.open || th.open || qu.open || ss.open){ flash('Finish your minigame first.'); return false; }", "  if (df.open || th.open || qu.open || ss.open || sg.open){ flash('Finish your minigame first.'); return false; }")
    rep("  if (cn.open || th.open || qu.open || ss.open){ flash('Finish your minigame first.'); return false; }", "  if (cn.open || th.open || qu.open || ss.open || sg.open){ flash('Finish your minigame first.'); return false; }")
    rep("  if (ss.open || df.open || cn.open || th.open || qu.open || !pal) return;", "  if (ss.open || df.open || cn.open || th.open || qu.open || sg.open || !pal) return;")
    rep("  if (cn.open || df.open || th.open || qu.open){ flash('Finish your minigame first.'); return false; }", "  if (cn.open || df.open || th.open || qu.open || sg.open){ flash('Finish your minigame first.'); return false; }")
    rep("  if (th.open || df.open || cn.open || qu.open || !pal) return;", "  if (th.open || df.open || cn.open || qu.open || sg.open || !pal) return;")
    rep("  if (qu.open || df.open || cn.open || th.open || ss.open || !pal) return;", "  if (qu.open || df.open || cn.open || th.open || ss.open || sg.open || !pal) return;")
    rep("  if (cn.open || df.open || th.open || qu.open || ss.open){ flash('Finish your minigame first.'); return false; }\n  if (VISIT) window.ppGame.goHome();\n  var c = heroChar();",
        "  if (cn.open || df.open || th.open || qu.open || ss.open || sg.open){ flash('Finish your minigame first.'); return false; }\n  if (VISIT) window.ppGame.goHome();\n  var c = heroChar();")

    # ---- co-op dispatch
    rep("  if (o.md === 'dig') return thCoopStart(o);", "  if (o.md === 'dig') return thCoopStart(o);\n  if (o.md === 'sg') return sgCoopStart(o);")
    rep("  if (qu.open && qu.coop) return quSnap();", "  if (qu.open && qu.coop) return quSnap();\n  if (sg.open && sg.coop) return sgSnap();")
    rep("  if (qu.open && qu.coop){ quIn(g, slot || 1); return; }", "  if (qu.open && qu.coop){ quIn(g, slot || 1); return; }\n  if (sg.open && sg.coop){ sgIn(g, slot || 1); return; }")
    rep("  if (qu.open && qu.coop) return quOut();", "  if (qu.open && qu.coop) return quOut();\n  if (sg.open && sg.coop) return sgOut();")
    rep("  if (qu.open && qu.coop){ quApply(S); return; }", "  if (qu.open && qu.coop){ quApply(S); return; }\n  if (sg.open && sg.coop){ sgApply(S); return; }")

    # ---- buttons
    rep("    case 'qu-claim': if (qu.surv) quSurvClaim(false); break;", "    case 'qu-claim': if (qu.surv) quSurvClaim(false); break;\n"
        "    case 'sg-start': if (sg.open) sgBegin(1); break;\n    case 'sg-surv': if (sg.open && sgRec(sg.area).won) sgBegin(SURV_LV); break;\n    case 'sg-leave': sgClose(); break;\n    case 'sg-claim': sgClaim(); break;")
    rep("    case 'coop-inv': if (window.ppCoop && cn.open){", "    case 'coop-inv': if (window.ppCoop && sg.open){ if (sg.phase !== 'intro' && sg.phase !== 'end') break; window.ppCoop.invite(t.dataset.uid, +t.dataset.lv === SURV_LV ? SURV_LV : 1, sg.area, 'sg'); break; }\n      if (window.ppCoop && cn.open){")
    rep("function coopList(){\n  var box = $('#coop-list'); if (!box || !window.ppCoop) return;\n", '''function coopList(){
  var box = $('#coop-list'); if (!box || !window.ppCoop) return;
  if (sg.open){      /* skill challenges: only friends with that skill at level 50 can come */
    var fsg = window.ppCoop.friends(), sk = AREAS[sg.area].skill, won = sgRec(sg.area).won;
    box.innerHTML = fsg.length ? fsg.map(function(x){
      var flv = window.ppCoop.skillLv ? window.ppCoop.skillLv(x.uid, sk) : -1;
      return '<div class="coop-fr"><b data-notr>' + esc(x.name) + '</b><span>' + (flv >= 0 && flv < SG_LV ? '<small>' + esc(skillLabel(sk)) + ' level ' + flv + ' (needs ' + SG_LV + ')</small>'
        : '<button class="btn sm" type="button" data-action="coop-inv" data-uid="' + esc(x.uid) + '" data-lv="1">Play</button>' + (won ? '<button class="btn sm" type="button" data-action="coop-inv" data-uid="' + esc(x.uid) + '" data-lv="' + SURV_LV + '">Survival</button>' : '')) + '</span></div>';
    }).join('') : '<p class="small">None of your friends are online right now.</p>';
    return;
  }
''')
    rep("    : a === 'qu-leave' ? (qu.phase === 'play' || qu.phase === 'ending' || qu.phase === 'between')", "    : a === 'qu-leave' ? (qu.phase === 'play' || qu.phase === 'ending' || qu.phase === 'between')\n    : a === 'sg-leave' ? (sg.phase === 'play' || sg.phase === 'ending' || sg.phase === 'between')")

    # ---- touch controls
    rep("    else if (qu.open){ if (qu.phase === 'play') mode = 'qu'; }      /* only in minigames, in any orientation */", "    else if (qu.open){ if (qu.phase === 'play') mode = 'qu'; }      /* only in minigames, in any orientation */\n    else if (sg.open){ if (sg.phase === 'play') mode = 'sg'; }")
    rep("  else if (mode === 'qu'){ var QH = qu.hero, qr = QH && QH.ranged; ico = qr ? TC_WAND : TC_SWORD; lab = qr ? 'Shoot' : 'Attack'; }",
        "  else if (mode === 'qu'){ var QH = qu.hero, qr = QH && QH.ranged; ico = qr ? TC_WAND : TC_SWORD; lab = qr ? 'Shoot' : 'Attack'; }\n"
        "  else if (mode === 'sg'){ var SK0 = SKILLS.filter(function(k){ return k.key === AREAS[sg.area].skill; })[0]; ico = SK0 ? SK0.icon() : TC_SWORD; lab = sg.mini ? (sg.mini.k === 'reel' ? 'Reel' : 'Hammer') : sg.G.verb; }")
    rep("function tcKeys(){ return tc.mode === 'df' ? (df.keys = df.keys || {}) :", "function tcKeys(){ return tc.mode === 'sg' ? (sg.keys = sg.keys || {}) : tc.mode === 'df' ? (df.keys = df.keys || {}) :")
    rep("  } else if (tc.mode === 'th' && first){\n    if (!th.open", "  } else if (tc.mode === 'sg'){\n    sgAct(!!first);\n  } else if (tc.mode === 'th' && first){\n    if (!th.open")

    # ---- saves: the challenge records
    rep("    surv: (function(a){ var out = {}; if (a && typeof a === 'object') ['cannon', 'defense', 'arena', 'raid', 'dig', 'quest'].forEach(function(k){ var v = parseInt(a[k], 10); if (v > 0) out[k] = v; }); return out; })(o.surv),",
        "    surv: (function(a){ var out = {}; if (a && typeof a === 'object') ['cannon', 'defense', 'arena', 'raid', 'dig', 'quest'].forEach(function(k){ var v = parseInt(a[k], 10); if (v > 0) out[k] = v; }); return out; })(o.surv),\n"
        "    sg: (function(a){ var out = {}; if (a && typeof a === 'object') ['mine', 'fish', 'forest', 'potion', 'cook', 'smith', 'fire', 'grave'].forEach(function(k){ var r = a[k]; if (r && typeof r === 'object') out[k] = { w: clamp(parseInt(r.w, 10) || 0, 0, 999999), b: clamp(parseInt(r.b, 10) || 0, 0, 99999), won: r.won ? 1 : 0 }; }); return out; })(o.sg),")

    # ---- sounds
    rep("  quHurtPal = wrap(quHurtPal, function(p){ if (p && p.me && !(p.ko > 0)) sfx('hurt'); });", "  quHurtPal = wrap(quHurtPal, function(p){ if (p && p.me && !(p.ko > 0)) sfx('hurt'); });\n"
        "  sgSend = wrap(sgSend, function(t){ if (sg.open && sg.phase === 'play' && t !== 'cool' && t !== 'lost' && t !== 'fail' && t !== 'catch' && t !== 'forge') sfx(t === 'mob' ? 'swing' : sg.area); });\n"
        "  sgHurt = wrap(sgHurt, function(p){ if (p && p.me && !(p.ko > 0)) sfx('hurt'); });\n"
        "  sgWave = wrap(sgWave, function(){ sfx('wave'); });\n"
        "  sgEnd = wrap(sgEnd, function(won){ if (sg.phase !== 'end') sfx(won ? 'win' : 'lose'); });\n"
        "  sgWaveDone = wrap(sgWaveDone, function(){ sfx('coin'); });")

    # ---- the cloud module's window into the game
    rep("  coopRole: function(){ if (SKP.coop) return SKP.coop.role;", "  coopRole: function(){ if (SKP.coop) return SKP.coop.role; if (sg.open && sg.coop) return sg.coop.role;")
    rep("  arenaOpen: function(){ return !!((cn.open && !cn.coop && (cn.phase === 'intro' || cn.phase === 'victory' || cn.phase === 'lost')) ||", "  arenaOpen: function(){ return !!((sg.open && !sg.coop && (sg.phase === 'intro' || sg.phase === 'end')) || (cn.open && !cn.coop && (cn.phase === 'intro' || cn.phase === 'victory' || cn.phase === 'lost')) ||")
    rep("  busy: function(){ return !!(SKP.coop || cn.open || df.open || th.open || qu.open || (ss.open && ss.phase === 'play')); },",
        "  busy: function(){ return !!(SKP.coop || cn.open || df.open || th.open || qu.open || sg.open || (ss.open && ss.phase === 'play')); },\n"
        "  /* skill challenges: can I join this one (my level and my pal), and what is it called */\n"
        "  sgCanJoin: function(am){ return SG_GAMES[am] ? sgCanPlay(am) : 'Reload the game to play this.'; },\n"
        "  sgInfo: function(am){ var A = AREAS[am], G = SG_GAMES[am]; return G && A ? { name: G.name, skill: skillLabel(A.skill), key: A.skill, el: EL[A.el].label, lv: SG_LV } : null; },")
    rep("    if (cn.open || df.open || th.open || qu.open || ss.open){ flash('Finish your minigame first.'); return false; }\n    if (realm !== 'main')", "    if (cn.open || df.open || th.open || qu.open || ss.open || sg.open){ flash('Finish your minigame first.'); return false; }\n    if (realm !== 'main')")
    rep("skills: I.skills, cannonWins", "skills: I.skills, sg: I.sg, cannonWins")

open(P, 'w').write(s)
print('ok')
