/* ==SG== */
/* ---------- skill challenges: one minigame per skill, opened from a portal in that skill's area (no building to buy).
   Needs that skill at level 50 and a pal of that skill's element, and only gives xp in that skill (no gold).
   One difficulty (one long wave, SG_LONG x the old wave time) plus Survival (endless waves, unlocked by winning once). Up to 4 players: the host runs
   everything, and more players means more to do and more danger (SG_MUL), while everyone's xp is divided by the same
   number so each player earns about a solo run. The skill's own hat, pet and cape help here:
   hat = work 30% faster (and easier timing bars), pet = 1 in 4 jobs give a bonus point, cape (or Max Cape) = +25% xp.
   xp per point = 8 + your level (the practice spot's xp per action); a good run makes about 35 points a minute,
   so about 3.5 times practice-spot xp, well under active skilling at the same level, and without using any materials. ---------- */
var SG_LV = 50, SG_WAVES = 1, SG_LONG = 1.6, SG_WAVE_T = 75, SG_REVIVE = 8, SG_PET_P = 0.25, SG_CAPE_MUL = 1.25, SG_HAT_CD = 0.7, SG_CD = 0.3;
var SG_REACH = 84, SG_WIN_BONUS = 0.15, SG_SURV_BONUS = 5;
var sg = { open: false, area: '', phase: 'intro', P: [], E: [], H: [], fx: [], keys: {}, coop: null, eid: 0, w: 0 };
function sgUnit(lv){ return 8 + (lv || 1); }
function sgMulFor(n){ return 1 + 0.6 * Math.max(0, n - 1); }
function sgRec(area){ var R = state.island.sg || (state.island.sg = {}); return R[area] || (R[area] = { w: 0, b: 0 }); }
/* achievements: 5 per challenge, each pays xp in that skill (no gold); all 5 done unlocks Survival */
var SG_ACH = {
  mine:   ['Cave Survivor', 'Not a Scratch', 'Gem Hunter', 'Mine 5 gem veins in one run', function(r){ return (r.rs.gem || 0) >= 5; }, 'Ore Rush', 'Tunnel Veteran'],
  fish:   ['First Catch', 'Calm Waters', 'Golden Hook', 'Catch 2 golden fish in one run', function(r){ return (r.rs.gold || 0) >= 2; }, 'Full Net', 'Lake Legend'],
  forest: ['Timber!', 'Light on Your Feet', 'Domino Master', 'Knock down 3 trees with one chop', function(r){ return (r.rs.chain || 0) >= 3; }, 'Lumber Pile', 'Forest Ranger'],
  potion: ['First Brew', 'Steady Hands', 'Master Recipe', 'Brew a potion with 4 ingredients', function(r){ return (r.rs.four || 0) >= 1; }, 'Bubbling Over', 'Potion Professor'],
  cook:   ['Order Up!', 'Cool Chef', 'Star Service', 'Serve 3 star customers in one run', function(r){ return (r.rs.vip || 0) >= 3; }, 'Busy Kitchen', 'Head Chef'],
  smith:  ['Hot Iron', 'Safe Smith', 'Masterworker', 'Forge 5 masterworks in one run', function(r){ return (r.rs.mw || 0) >= 5; }, 'Anvil Rhythm', 'Forge Legend'],
  fire:   ['Kindled', 'Not Burned', 'Never Dark', 'Clear a wave without any beacon going out', function(r){ return !!r.rs.cw; }, 'Bonfire Night', 'Flame Keeper'],
  grave:  ['Night Shift', 'Bones Intact', 'Rest in Peace', 'Clear a wave without any skeleton getting out', function(r){ return !!r.rs.cw; }, 'Bone Collector', 'Grave Warden']
};
var SG_ACH_PTS = 500, SG_ACH_WINS = 5;
Object.keys(SG_ACH).forEach(function(a){
  var N = SG_ACH[a], g = 'sg_' + a, sk = { mine: 'mining', fish: 'fishing', forest: 'woodcutting', potion: 'potionmaking', cook: 'cooking', smith: 'smithing', fire: 'firemaking', grave: 'gravedigging' }[a];
  ACH_DEFS.push(
    { id: 'k_' + a + '1', g: g, name: N[0], desc: 'Win the challenge', xp: 2000, skill: sk, gold: 0, run: function(r){ return r.won; } },
    { id: 'k_' + a + 'hp', g: g, name: N[1], desc: 'Win without dropping below half health', xp: 4000, skill: sk, gold: 0, run: function(r){ return r.won && r.minHp >= 0.5; } },
    { id: 'k_' + a + 'sp', g: g, name: N[2], desc: N[3], xp: 5000, skill: sk, gold: 0, run: N[4] },
    { id: 'k_' + a + 'pts', g: g, name: N[5], desc: 'Score ' + SG_ACH_PTS + ' points', xp: 3000, skill: sk, gold: 0, stat: 'sp_' + a, need: SG_ACH_PTS },
    { id: 'k_' + a + 'w', g: g, name: N[6], desc: 'Win ' + SG_ACH_WINS + ' times', xp: 6000, skill: sk, gold: 0, stat: 'sw_' + a, need: SG_ACH_WINS });      /* ids and stat names fit cleanIsland's patterns */
});
function sgRs(k, n){ sg.rs = sg.rs || {}; sg.rs[k] = (sg.rs[k] || 0) + (n === undefined ? 1 : n); }
function sgMg(){ return !!(sg.G && sg.G.mg); }      /* a normal minigame on this engine (the Elemental Kitchen), not a skill challenge */
function sgCanPlay(area){
  var A = AREAS[area], c = heroChar(), G0 = SG_GAMES[area];
  if (G0 && G0.mg) return c ? '' : 'Pick a pal first.';
  if (!A) return 'That challenge is not here.';
  if (skillOf(A.skill).lv < SG_LV) return 'Needs ' + skillLabel(A.skill) + ' level ' + SG_LV + '.';
  if (!c || c.element !== A.el) return 'Only ' + EL[A.el].label + ' pals can play this.';
  return '';
}
function sgHatOn(c){ return !!(c && c.hat === 'h_' + sg.area); }
function sgCapeOn(){ if (sgMg()) return false; var c = heroChar(), A = AREAS[sg.area]; return !!(c && A && (c.cape === A.skill || c.cape === 'max')); }
function sgPetOn(p){ return p.me ? petOn(sg.area) : !!(p.mi && p.mi.partnerPm === sg.area); }

/* ---------- pictures: the game's own item art (rocks, trees, cauldrons, stoves...) turned into images once ---------- */
var SG_IMG = {};
function sgImg(id, markup){
  var im = SG_IMG[id]; if (im) return im.complete && im.naturalWidth ? im : null;
  im = new Image();
  var str = soften(typeof markup === 'function' ? markup() : markup).replace(/<circle class="glow[^>]*>/g, '');      /* the animated glows would be solid discs in a still picture */
  im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -30 130 130" width="260" height="260">' + str + '</svg>');
  SG_IMG[id] = im;
  return null;
}
/* draws a 100-unit item picture standing at x, y (its feet at y), w world units wide */
function sgPic(g, id, markup, x, y, w, flip){
  var im = sgImg(id, markup); if (!im) return;
  var k = w / 100;
  g.save(); g.translate(x, y); if (flip) g.scale(-1, 1);
  g.drawImage(im, -65 * k, -122 * k, 130 * k, 130 * k);
  g.restore();
}
function sgItem(key, s){ return function(){ var d = ITEMS[key]; return d ? (typeof d.fn === 'function' ? d.fn(s) : d.fn) : ''; }; }
/* small things to carry and to draw (100 x 100 like the items) */
var SG_ART = {
  ore: function(){ return E(50, 88, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M18 80Q14 56 34 44Q54 32 74 46Q90 60 82 80Z', '#8a8f9e') + L('M30 54Q42 44 56 48', '#c9cedb', 3) + P('M36 66L44 60L50 66L44 72Z', '#4a7cff', 2) + P('M58 58L66 54L70 62L62 66Z', '#4a7cff', 2) + P('M50 74L56 70L60 76L54 79Z', '#ffd23e', 1.8); },
  gem: function(){ return E(50, 88, 26, 6, 'rgba(0,0,0,.2)', 0) + P('M50 14L76 40L50 86L24 40Z', '#5ef0ff') + P('M50 14L62 40L50 86L38 40Z', '#b9fbff', 2) + L('M24 40H76', '#1f6b8a', 2.4); },
  log: function(){ return E(50, 86, 34, 6, 'rgba(0,0,0,.2)', 0) + '<g transform="rotate(-18 50 60)">' + R(16, 46, 66, 26, '#9a6232', 12) + E(82, 59, 9, 13, '#e6c08c') + E(82, 59, 4, 6, 'none', 2) + L('M26 54H60M30 64H66', '#6a3e1c', 2.4) + '</g>'; },
  raw: function(){ return E(50, 86, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M16 56Q40 30 70 52L86 40L84 72L70 60Q40 82 16 56Z', '#8fb8d8') + C(28, 52, 3.4, '#1b1730', 0) + L('M44 46Q48 56 44 66', '#5a86aa', 2.4); },
  done: function(){ return E(50, 86, 34, 6, 'rgba(0,0,0,.2)', 0) + E(50, 70, 40, 12, '#f4f4fa') + P('M18 62Q42 38 70 58L84 48L82 76L70 66Q42 86 18 62Z', '#e0943a') + L('M34 56L40 66M46 54L52 66M58 56L62 64', '#8a4a10', 2.6) + C(28, 58, 3, '#1b1730', 0); },
  burnt: function(){ return E(50, 86, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M16 56Q40 30 70 52L86 40L84 72L70 60Q40 82 16 56Z', '#2a2430') + C(40, 30, 7, 'rgba(120,120,130,.6)', 0) + C(52, 20, 9, 'rgba(120,120,130,.45)', 0); },
  bar: function(){ return E(50, 86, 30, 6, 'rgba(0,0,0,.2)', 0) + C(50, 60, 34, 'rgba(255,150,40,.35)', 0) + P('M18 70L30 50H82L70 70Z', '#ff8a2a') + P('M30 50H82L80 56H32Z', '#ffd23e', 2) + L('M36 62H64', '#fff3b0', 3); },
  cold: function(){ return E(50, 86, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M18 70L30 50H82L70 70Z', '#8a8f9a') + P('M30 50H82L80 56H32Z', '#c5ccd8', 2) + L('M36 62H64', '#dfe6ef', 3); },
  blade: function(){ return E(50, 86, 30, 6, 'rgba(0,0,0,.2)', 0) + '<g transform="rotate(-35 50 55)">' + P('M46 10H54L56 64H44Z', '#dfe6ef') + L('M50 14V60', '#ffffff', 2) + R(32, 62, 36, 8, '#d9a520', 3) + R(46, 70, 8, 18, '#7a4d2e', 2) + '</g>'; },
  bone: function(){ return E(50, 86, 26, 6, 'rgba(0,0,0,.2)', 0) + P('M30 34Q50 26 70 34L74 74Q50 84 26 74Z', '#c9a2f0') + E(50, 34, 20, 6, '#e8d8ff', 2) + L('M42 52Q50 58 58 52', '#7a4ac0', 2.4) + C(44, 30, 3, '#ffffff', 0) + C(56, 32, 3, '#ffffff', 0) + P('M40 22H60L58 30H42Z', '#f6efdc', 2.2); },
  shroom: function(){ return E(50, 88, 26, 6, 'rgba(0,0,0,.2)', 0) + R(42, 52, 16, 32, '#f4ecd8', 6) + P('M14 56Q16 20 50 18Q84 20 86 56Z', '#e33a3a') + C(36, 36, 6, '#ffffff', 0) + C(60, 32, 5, '#ffffff', 0) + C(72, 46, 4, '#ffffff', 0); },
  herb: function(){ return E(50, 88, 24, 6, 'rgba(0,0,0,.2)', 0) + L('M50 86V40', '#2f7a2a', 4) + P('M50 60Q24 56 22 34Q44 34 50 60Z', '#5cc85a') + P('M50 50Q76 46 78 24Q56 26 50 50Z', '#7ad96a') + P('M50 40Q40 22 50 10Q60 22 50 40Z', '#4fae4a'); },
  crys: function(){ return E(50, 88, 24, 6, 'rgba(0,0,0,.2)', 0) + P('M36 84L30 44L44 20L52 44Z', '#7a8cff') + P('M48 84L52 30L64 12L74 40L68 84Z', '#a8b4ff') + L('M60 22L62 70', '#e8ecff', 3); },
  crab: function(){ return E(50, 88, 34, 6, 'rgba(0,0,0,.22)', 0) + L('M26 72L12 84M30 76L20 90M74 72L88 84M70 76L80 90', '#a8301e', 4) + E(50, 66, 30, 18, '#e8553a') + L('M32 60Q50 52 68 60', '#ff9a7a', 3) +
    L('M30 56L16 40M70 56L84 40', '#a8301e', 5) + P('M8 34Q12 22 22 28L16 36L24 38Q18 48 8 34Z', '#e8553a', 2.4) + P('M92 34Q88 22 78 28L84 36L76 38Q82 48 92 34Z', '#e8553a', 2.4) +
    L('M42 50V40M58 50V40', '#a8301e', 3) + C(42, 38, 4.4, '#fff', 2) + C(58, 38, 4.4, '#fff', 2) + C(43, 38, 2, '#1b1730', 0) + C(57, 38, 2, '#1b1730', 0); },
  skel: function(){ return E(50, 92, 26, 6, 'rgba(0,0,0,.25)', 0) + L('M42 74L38 92M58 74L62 92', '#ede6d2', 6) + L('M42 74L38 92M58 74L62 92', '#8a8270', 1.4) +
    R(38, 46, 24, 30, '#ede6d2', 8, 2.6) + L('M40 54H60M40 62H60M40 70H60', '#8a8270', 2) + L('M38 50L22 66M62 50L80 40', '#ede6d2', 6) + L('M38 50L22 66M62 50L80 40', '#8a8270', 1.4) +
    P('M30 28Q30 6 50 6Q70 6 70 28Q70 42 60 44V50H40V44Q30 42 30 28Z', '#f6efdc', 2.8) + E(42, 27, 6, 7, '#2a2436', 0) + E(58, 27, 6, 7, '#2a2436', 0) + C(42, 28, 2, '#7affc4', 0) + C(58, 28, 2, '#7affc4', 0) + L('M44 40V46M50 40V46M56 40V46', '#8a8270', 1.6); },
  cust: function(){ return E(50, 92, 28, 6, 'rgba(0,0,0,.18)', 0) + P('M20 80Q8 78 10 64Q8 50 22 48Q24 30 44 30Q56 22 68 34Q86 34 86 52Q94 64 84 76Q78 84 64 82Q50 90 36 82Q28 86 20 80Z', '#ffffff', 2.6) +
    C(40, 58, 4.4, '#1b1730', 0) + C(62, 58, 4.4, '#1b1730', 0) + C(41.4, 56.6, 1.4, '#fff', 0) + C(63.4, 56.6, 1.4, '#fff', 0) + E(32, 66, 5, 3, '#ffb3c8', 0) + E(70, 66, 5, 3, '#ffb3c8', 0) + L('M46 68Q51 72 56 68', '#1b1730', 2.4); },
  cloud: function(){ return P('M18 70Q4 68 8 54Q6 40 22 40Q26 22 46 24Q60 14 72 28Q90 28 90 46Q98 58 88 68Z', '#6a7488', 2.6) + L('M24 54Q40 46 56 50', 'rgba(255,255,255,.35)', 4); },
  basket: function(){ return E(50, 90, 40, 7, 'rgba(0,0,0,.2)', 0) + P('M12 50H88L80 88H20Z', '#c9934a') + L('M18 62H82M20 74H80M36 50L34 88M50 50V88M64 50L66 88', '#8a5a24', 2) + P('M24 50Q34 30 50 40Q60 26 76 50Z', '#8fb8d8', 2.4) + C(40, 42, 2.4, '#1b1730', 0); },
  shelf: function(){ return E(50, 92, 40, 6, 'rgba(0,0,0,.2)', 0) + R(14, 40, 72, 50, '#8a5a34', 4) + L('M14 64H86', '#5a3418', 3) + R(20, 46, 60, 14, '#6a4020', 2, 2) + R(20, 70, 60, 14, '#6a4020', 2, 2); },
  pile: function(){ return E(50, 90, 44, 7, 'rgba(0,0,0,.22)', 0) + P('M8 88Q12 60 30 56Q36 40 52 44Q68 36 76 54Q94 58 92 88Z', '#7a7f8e') + P('M24 70L32 64L38 70L32 76Z', '#c98a4b', 2) + P('M54 58L62 52L68 60L60 64Z', '#3558d4', 2) + P('M66 74L74 70L78 78L70 81Z', '#8a8f9a', 2) + P('M40 54L46 50L50 56L44 59Z', '#ffcc33', 1.8); },
  logs: function(){ var s = E(50, 90, 44, 7, 'rgba(0,0,0,.22)', 0); [[30, 78], [52, 78], [74, 78], [41, 60], [63, 60], [52, 42]].forEach(function(q){ s += C(q[0], q[1], 11, '#9a6232', 2.6) + C(q[0], q[1], 7, '#e6c08c', 0) + C(q[0], q[1], 3, 'none', 1.6); }); return s; },
  sap: function(){ return E(50, 90, 18, 4, 'rgba(0,0,0,.2)', 0) + L('M50 90V60', '#7a4d2e', 4) + C(50, 56, 12, '#68cc5a', 2.4) + C(42, 62, 8, '#58bf4b', 2) + C(58, 62, 8, '#58bf4b', 2); },
  hole: function(){ return E(50, 82, 30, 12, '#2a1e18', 2.4) + E(50, 80, 24, 8, '#120c0a', 0) + P('M18 82Q20 70 32 72L26 86Z', '#6a5a48', 2) + P('M82 82Q80 70 68 72L74 86Z', '#6a5a48', 2); },
  mound: function(){ return E(50, 84, 32, 12, '#5a4a3a', 2.4) + L('M30 80Q50 74 70 80', '#7a6a58', 3); }
};
function sgArtSvg(k){ return SG_ART[k] ? '<svg viewBox="-10 -10 120 120" aria-hidden="true">' + soften(SG_ART[k]()) + '</svg>' : ''; }

/* ---------- the arena: one big floating island per game (painted once, like the Island Quest's) ---------- */
function sgIsl(){ var I = sg.I; if (I) return I; return null; }
function sgInIsl(x, y, k){ return quInIsl(sg.I, x, y, k || 0.88); }
function sgWalk(x, y){
  if (!sgInIsl(x, y)) return false;
  var G = sg.G; if (G.walk && !G.walk(x, y)) return false;
  return true;
}
function sgIslCanvas(){
  var keep = [qu.sc, qu.dpr], I = sg.I;
  qu.sc = sg.zk; qu.dpr = sg.dpr;
  try { return quIslCanvas(I, sg.G.land); } finally { qu.sc = keep[0]; qu.dpr = keep[1]; }
}
/* a random free spot on the island: away from things (gap) and pals (pg) */
function sgSpot(gap, pg, test){
  var I = sg.I;
  for (var n = 0; n < 200; n++){
    var a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * 0.8, x = I.x + Math.cos(a) * I.rx * r, y = I.y + Math.sin(a) * I.ry * r;
    if (!sgWalk(x, y) || !sgInIsl(x, y, 0.8)) continue;
    if (test && !test(x, y)) continue;
    var ok = true;
    for (var i = 0; i < sg.E.length; i++){ var e = sg.E[i]; if (e.k === 'food' || e.k === 'ord') continue; if (Math.hypot(e.x - x, e.y - y) < (gap || 90)){ ok = false; break; } }
    if (ok && pg) for (i = 0; i < sg.P.length; i++) if (Math.hypot(sg.P[i].x - x, sg.P[i].y - y) < pg){ ok = false; break; }
    if (ok) return { x: x, y: y };
  }
  return { x: I.x + (Math.random() - 0.5) * I.rx, y: I.y + (Math.random() - 0.5) * I.ry * 0.6 };
}

/* ---------- things on the island: every one is { id, k, x, y, a, b, c, d, s } so the host can send them as one row ---------- */
function sgNew(k, x, y, o){ var e = { id: ++sg.eid, k: k, x: x, y: y, a: 0, b: 0, c: 0, d: 0, s: '' }; if (o) for (var q in o) e[q] = o[q]; sg.E.push(e); return e; }
function sgById(id){ for (var i = 0; i < sg.E.length; i++) if (sg.E[i].id === id) return sg.E[i]; return null; }
function sgDel(e){ var i = sg.E.indexOf(e); if (i >= 0) sg.E.splice(i, 1); }
function sgAll(k){ return sg.E.filter(function(e){ return e.k === k; }); }
function sgNear(p, test, r){
  var best = null, bd = r || SG_REACH;
  /* a tap or click on one thing: only that thing counts (sgPick sets sg.only while the game picks) */
  if (sg.only){ var oe = sgById(sg.only); return oe && test(oe) && Math.hypot(oe.x - p.x, (oe.y - p.y) * 1.2) < bd ? oe : null; }
  sg.E.forEach(function(e){ if (!test(e)) return; var d = Math.hypot(e.x - p.x, (e.y - p.y) * 1.2); if (d < bd){ bd = d; best = e; } });
  return best;
}
function sgPlayers(){ return sg.P.filter(function(p){ return !p.gone; }); }
function sgBySlot(s){ for (var i = 0; i < sg.P.length; i++) if (sg.P[i].slot === s) return sg.P[i]; return null; }
function sgFx(o){ sg.fx.push(o); var C = sg.coop; if (C && C.role === 'host'){ C.fxOut.push(o); if (C.fxOut.length > 40) C.fxOut.shift(); } }
function sgTxt(x, y, s, c){ sgFx({ k: 'txt', x: x, y: y, t: 1, T: 1, s: s, c: c || '#fff' }); }
/* host: points for the team. Everyone's device adds them to its own run when it sees them */
function sgPts(p, n, x, y, why){
  if (p && p.pet && Math.random() < SG_PET_P){ n++; why = (why ? why + ' ' : '') + '+1 pet'; }
  sg.sc += n; sg.tp = (sg.tp || 0) + n; sg.runPts += n;      /* tp: the team's running total, sent in every picture so no friend misses a point */
  sgFx({ k: 'pts', n: n, x: x, y: y, t: 1.1, T: 1.1, s: '+' + n + (why ? ' ' + why : ''), c: '#ffe58a' });
}
function sgBad(n, x, y, why){
  sg.sc = Math.max(0, sg.sc - n);
  sgFx({ k: 'txt', x: x, y: y, t: 1.3, T: 1.3, s: (why || 'Oops!') + (n ? ' -' + n : ''), c: '#ff7a6a' });
}
function sgFood(x, y, chance){ if (Math.random() < (chance || 0.12)){ var f = DF_FOOD[Math.floor(Math.random() * DF_FOOD.length)]; sgNew('food', x, y, { s: f.k, a: 0.6 }); } }
/* hazards: a red warning first (circle or lane), then the hit */
function sgHz(o){
  o.t = o.T = o.T || 1.2; o.dmg = o.dmg === undefined ? 0.12 : o.dmg; o.hit = 0; o.id = ++sg.eid;
  sg.H.push(o); return o;
}
function sgInHz(h, x, y){
  if (h.k === 'c') return Math.hypot(x - h.x, (y - h.y) * 1.25) < h.r;
  var dx = h.x2 - h.x, dy = h.y2 - h.y, L2 = dx * dx + dy * dy || 1, t = clamp(((x - h.x) * dx + (y - h.y) * dy) / L2, 0, 1);
  return Math.hypot(h.x + dx * t - x, h.y + dy * t - y) < h.r;
}
function sgHurt(p, frac, from){
  if (!p || p.ko > 0 || p.gone || sg.phase !== 'play') return;
  var amt = Math.round(p.maxhp * frac * (sg.hk || 1));
  p.hp -= amt; p.hurt = 0.35;
  sgFx({ k: 'num', x: p.x, y: p.y - 70, t: 0.8, T: 0.8, s: '-' + amt, c: '#ff6a5a' });
  if (p.hp <= 0){
    p.hp = 0; p.ko = SG_REVIVE; p.cr = '';
    sgFx({ k: 'txt', x: p.x, y: p.y - 110, t: 1.4, T: 1.4, s: p.me ? 'Knocked out!' : p.name + ' is down!', c: '#ff9a5a' });
  }
}
