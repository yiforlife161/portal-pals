/* ==RB== Boss Gallery (Boss Raid): 8 bosses, one per element, each with its own look and attack pattern. Edit this file
   (src/raid/bosses.js) and run src/raid/patch_rb.py (rebuild.sh does it) to put it into the html between the RB markers.
   - RB_ORDER: the order they unlock in (beat a boss on any level to open the next) and the order Survival cycles through.
   - Each boss is weak to the element just before it on the Element Clash wheel (KC_WHEEL): pals of that element hit it x1.5.
   - Attacks are built from the arena's telegraphed pieces: 'shot' (a fan of shots), 'dash' (a charge, f.chain = more charges
     straight after), 'slam' (a red circle), plus 'ring' (shots in every direction), 'cast' (drops 'rain' zones: df.rockets with
     dmg + el, landing after their red circle closes) and 'blink' (teleports to the marked circle, then fires a fan).
   - Picked boss: state.island.raidBoss; best level won per boss: state.island.rbw[key] (both cleaned in cleanIsland). */
var RB_ORDER = ['earth', 'fire', 'water', 'life', 'tech', 'air', 'magic', 'undead'];
var RAID_BOSSES = {
  earth:  { name: 'Boulderback', title: 'the Rolling Mountain', weak: 'life',   hp: 0.9,  spd: 0.85, r: 42, col: '#a07a4e', dk: '#3a2610' },
  fire:   { name: 'Magmaw',      title: 'the Lava Turtle',      weak: 'water',  hp: 0.95, spd: 0.9,  r: 42, col: '#d8502a', dk: '#3a0e04' },
  water:  { name: 'Tidejaw',     title: 'the Reef Crab',        weak: 'undead', hp: 1,    spd: 1,    r: 41, col: '#2e9ad8', dk: '#0a2a4a' },
  life:   { name: 'Thornmother', title: 'the Wild Bloom',       weak: 'fire',   hp: 1.05, spd: 0.45, r: 42, col: '#5aae3a', dk: '#1a3a10' },
  tech:   { name: 'Gearlord',    title: 'the Iron Engine',      weak: 'air',    hp: 1.1,  spd: 0.95, r: 41, col: '#8c96a8', dk: '#1e2430' },
  air:    { name: 'Stormwing',   title: 'the Thunder Hawk',     weak: 'earth',  hp: 1.1,  spd: 1.3,  r: 38, col: '#5ab4e8', dk: '#123a5a' },
  magic:  { name: 'Hexweaver',   title: 'the Star Witch',       weak: 'tech',   hp: 1.15, spd: 1,    r: 39, col: '#9a5ae8', dk: '#2a1050' },
  undead: { name: 'Bone Tyrant', title: 'the Grave King',       weak: 'magic',  hp: 1.2,  spd: 1,    r: 42, col: '#d8d4c4', dk: '#2a2a2a' }
};
/* colours of each boss's shots and rain: [core, middle, glow rgb] */
var RB_FX = { earth: ['#fff1c8', '#b8864a', '160,110,50'], fire: ['#fff6d0', '#ff7a2a', '255,110,30'], water: ['#e8fbff', '#3ab0ff', '60,170,255'],
  life: ['#f6ffd8', '#6ad83a', '90,200,50'], tech: ['#ffffff', '#ffd23a', '255,210,60'], air: ['#ffffff', '#9ae8ff', '150,230,255'],
  magic: ['#fff0ff', '#c46aff', '190,100,255'], undead: ['#eaffea', '#7aff9a', '110,255,150'] };
var RB_T = {};
RB_ORDER.forEach(function(k){
  var B = RAID_BOSSES[k], T = {}, b = DF_TYPES.boss;
  Object.keys(b).forEach(function(q){ T[q] = b[q]; });
  T.hp = b.hp * B.hp; T.spd = b.spd * B.spd; T.r = B.r; T.col = B.col; T.dk = B.dk;
  T.gold = Math.round(b.gold * (0.9 + 0.1 * B.hp) * 10) / 10; T.xp = Math.round(b.xp * (0.9 + 0.1 * B.hp) * 10) / 10;      /* tougher bosses pay a touch more */
  RB_T[k] = T;
});
/* save data: best level won per boss. Older saves: whatever raid level was won counts for the first boss */
function rbData(){
  var I = state.island;
  if (!I.rbw || typeof I.rbw !== 'object'){ I.rbw = {}; var old = lvWon('raid'); if (old > 0) I.rbw[RB_ORDER[0]] = Math.min(3, old); }
  return I.rbw;
}
function rbWon(k){ return rbData()[k] || 0; }
function rbOpen(k){ var i = RB_ORDER.indexOf(k); return i === 0 || (i > 0 && rbWon(RB_ORDER[i - 1]) >= 1); }
function rbPicked(){ var k = state.island.raidBoss; return RAID_BOSSES[k] && rbOpen(k) ? k : RB_ORDER[0]; }
function rbName(k){ return RAID_BOSSES[k] ? RAID_BOSSES[k].name : 'the boss'; }
/* which boss a raid wave brings: the picked one, or in Survival the gallery in order, round and round */
function rbForWave(w){ return df.lv === SURV_LV ? RB_ORDER[(Math.max(1, w) - 1) % RB_ORDER.length] : (df.boss || rbPicked()); }
function rbRecordWin(k, lv){ var D = rbData(); if (lv >= 1 && lv <= 3 && (D[k] || 0) < lv) D[k] = lv; }
function rbAllWon(lv){ return RB_ORDER.every(function(k){ return rbWon(k) >= lv; }); }

/* ---- attacks ---- */
function rbAddsAlive(){ return df.foes.filter(function(q){ return !q.dead && q.k !== 'boss'; }).length; }
function rbAim(f, H){ return H ? { x: H.x, y: H.y } : { x: 500, y: 345 }; }
/* set up an attack: the red mark shows for `w` seconds, then rbRelease / the arena code fires it */
function rbSet(f, type, w, x, y, o){
  f.atkType = type; f.wind = f.windMax = w; f.sx = x; f.sy = y;
  f.vol = 0; f.spr = 0.2; f.ss = 300; f.sr = 0; f.chain = 0; f.rain = null; f.off = 0;
  if (o) for (var q in o) f[q] = o[q];
}
/* rain zones: each a red circle that something lands on after `t` seconds */
function rbRain(f, pts, t, r){
  var el = f.bk || 'fire', dmg = f.T.atk * 1.0 * DF_SET.hp;
  pts.forEach(function(p, i){
    var c = dfClampIsland(p.x, p.y);
    df.rockets.push({ x: c.x, y: c.y, t: t + (p.d || 0), T0: t + (p.d || 0), r: r || 50, el: el, dmg: dmg });
  });
}
function rbAround(H, n, spread){
  var out = [], i;
  for (i = 0; i < n; i++){ var a = Math.random() * 6.283, d = 40 + Math.random() * spread; out.push({ x: H.x + Math.cos(a) * d, y: H.y + Math.sin(a) * d * 0.7 }); }
  return out;
}
function rbOnPlayers(){ return dfPlayers().filter(function(q){ return q && !q.ko; }).map(function(q){ return { x: q.x, y: q.y }; }); }
function rbSummon(f, n){
  if (rbAddsAlive() >= 5) return false;
  raidAdds(n, true);
  dfFx('ring', f.x, f.y, { life: 0.6, max: 0.6, col: RB_FX[f.bk || 'undead'][1] });
  return true;
}
/* pick the next attack (host / solo only). dH = distance to the target, enr = below 35% health */
function rbChoose(f, H, dH){
  var k = f.bk || 'fire', enr = f.hp < f.max * 0.35, r = f.T.r, roll = Math.random(), A = rbAim(f, H);
  var near = dH < r + 70 && Math.random() < 0.6;      /* up close it mostly stomps, but not always */
  if (k === 'earth'){
    if (near) return rbSet(f, 'slam', enr ? 0.75 : 1, f.x, f.y, { sr: r + 82 });
    if (roll < 0.4) return rbSet(f, 'dash', enr ? 0.6 : 0.8, A.x, A.y, { chain: enr ? 2 : 1 });                         /* rolls, then rolls again */
    if (roll < 0.7) return rbSet(f, 'slam', enr ? 0.95 : 1.2, A.x, A.y, { sr: 112 });                                 /* a quake where you stand */
    return rbSet(f, 'cast', 0.55, A.x, A.y, { rain: 'rocks' });                                                       /* boulders fall */
  }
  if (k === 'fire'){
    if (near) return rbSet(f, 'slam', enr ? 0.7 : 0.95, f.x, f.y, { sr: r + 78 });
    if (roll < 0.4) return rbSet(f, 'shot', enr ? 0.6 : 0.85, A.x, A.y, { vol: enr ? 7 : 5, spr: 0.2, ss: 300 });     /* a fan of fireballs */
    if (roll < 0.72) return rbSet(f, 'cast', 0.6, A.x, A.y, { rain: 'meteors' });                                     /* meteor shower */
    return rbSet(f, 'dash', enr ? 0.55 : 0.75, A.x, A.y);                                                             /* a lava charge */
  }
  if (k === 'water'){
    if (near) return rbSet(f, 'slam', enr ? 0.65 : 0.85, f.x, f.y, { sr: r + 70 });                                   /* claw snap */
    if (roll < 0.35) return rbSet(f, 'ring', enr ? 0.7 : 0.9, f.x, f.y, { vol: enr ? 14 : 10, ss: 200, off: Math.random() });   /* a burst of bubbles */
    if (roll < 0.65) return rbSet(f, 'dash', enr ? 0.5 : 0.7, A.x, A.y, { chain: enr ? 1 : 0 });                        /* scuttles sideways at you */
    return rbSet(f, 'cast', 0.55, A.x, A.y, { rain: 'line' });                                                        /* whirlpools in a line */
  }
  if (k === 'life'){
    if (near) return rbSet(f, 'slam', enr ? 0.7 : 0.9, f.x, f.y, { sr: r + 92 });                                     /* thorns burst out all round */
    if (roll < 0.4) return rbSet(f, 'cast', 0.5, A.x, A.y, { rain: 'line' });                                         /* vines erupt in a line to you */
    if (roll < 0.72) return rbSet(f, 'shot', enr ? 0.6 : 0.8, A.x, A.y, { vol: enr ? 9 : 7, spr: 0.15, ss: 260 });     /* a spray of seeds */
    if (rbAddsAlive() < 4) return rbSet(f, 'cast', 0.7, A.x, A.y, { rain: 'summon' });                                /* sprouts helpers */
    return rbSet(f, 'shot', 0.8, A.x, A.y, { vol: 7, spr: 0.15, ss: 260 });
  }
  if (k === 'tech'){
    if (near) return rbSet(f, 'slam', enr ? 0.7 : 0.9, f.x, f.y, { sr: r + 76 });                                     /* shock stomp */
    if (roll < 0.35) return rbSet(f, 'ring', enr ? 0.65 : 0.85, f.x, f.y, { vol: enr ? 12 : 8, ss: 340, off: Math.random(), twice: enr ? 1 : 0 });   /* bolts every way */
    if (roll < 0.65) return rbSet(f, 'cast', 0.5, A.x, A.y, { rain: 'mines' });                                      /* lays mines */
    return rbSet(f, 'dash', enr ? 0.5 : 0.65, A.x, A.y);                                                              /* rocket boost */
  }
  if (k === 'air'){
    if (near) return rbSet(f, 'slam', enr ? 0.6 : 0.8, f.x, f.y, { sr: r + 86 });                      /* a wing gust */
    if (roll < 0.45) return rbSet(f, 'dash', enr ? 0.45 : 0.6, A.x, A.y, { chain: enr ? 2 : 1 });                      /* dives, again and again */
    if (roll < 0.72) return rbSet(f, 'shot', enr ? 0.55 : 0.7, A.x, A.y, { vol: enr ? 9 : 7, spr: 0.14, ss: 360 });    /* a fan of feathers */
    return rbSet(f, 'cast', 0.45, A.x, A.y, { rain: 'bolts' });                                                       /* lightning strikes */
  }
  if (k === 'magic'){
    if (near) return rbSet(f, 'slam', enr ? 0.65 : 0.85, f.x, f.y, { sr: r + 80 });
    if (roll < 0.32){      /* blinks across the arena, then fires */
      var tries = 0, bx, by;
      do { bx = 160 + Math.random() * 680; by = 190 + Math.random() * 300; } while ((!dfInIsland(bx, by) || Math.hypot(bx - A.x, by - A.y) < 200) && ++tries < 20);
      return rbSet(f, 'blink', enr ? 0.55 : 0.75, bx, by, { vol: enr ? 7 : 5, spr: 0.18, ss: 300, tx: A.x, ty: A.y });
    }
    if (roll < 0.64) return rbSet(f, 'ring', enr ? 0.65 : 0.85, f.x, f.y, { vol: enr ? 16 : 12, ss: 230, off: Math.random(), twice: 1 });   /* a star spiral */
    return rbSet(f, 'cast', 0.5, A.x, A.y, { rain: 'tri' });                                                          /* arcane circles */
  }
  /* undead */
  if (near) return rbSet(f, 'slam', enr ? 0.7 : 0.9, f.x, f.y, { sr: r + 86 });                                       /* scythe sweep */
  if (roll < 0.3) return rbSet(f, 'shot', enr ? 0.6 : 0.8, A.x, A.y, { vol: enr ? 7 : 5, spr: 0.22, ss: 280 });       /* skulls */
  if (roll < 0.55) return rbSet(f, 'cast', 0.55, A.x, A.y, { rain: 'curse' });                                         /* curse circles */
  if (roll < 0.75 && rbAddsAlive() < 4) return rbSet(f, 'cast', 0.75, A.x, A.y, { rain: 'summon' });                  /* raises the dead */
  return rbSet(f, 'dash', enr ? 0.55 : 0.75, A.x, A.y);
}
/* fire the new kinds of attack once their mark has shown; true = handled (the arena code does shot / dash / slam) */
function rbRelease(f, H){
  var k = f.bk || 'fire', i, n, a, el = k, dmg = f.T.atk * 0.8 * DF_SET.hp, cy = f.y - f.T.r * 0.4;
  if (f.atkType === 'ring'){
    var rounds = f.twice ? 2 : 1;
    for (var rr = 0; rr < rounds; rr++){
      n = f.vol || 10;
      for (i = 0; i < n; i++){ a = (i + (f.off || 0) + rr * 0.5) / n * 6.283; df.eshots.push({ x: f.x, y: cy, vx: Math.cos(a) * (f.ss || 260) * (1 - rr * 0.25), vy: Math.sin(a) * (f.ss || 260) * (1 - rr * 0.25), life: 2.2, dmg: dmg, el: el }); }
    }
    f.atk = bossCd(f); return true;
  }
  if (f.atkType === 'blink'){
    dfFx('ring', f.x, f.y, { life: 0.5, max: 0.5, col: RB_FX[k][1] });
    f.x = f.sx; f.y = f.sy;
    dfFx('ring', f.x, f.y, { life: 0.5, max: 0.5, col: RB_FX[k][1] });
    var T0 = H && !H.ko ? H : { x: f.tx || 500, y: f.ty || 345 }, a0 = Math.atan2(T0.y - cy, T0.x - f.x); cy = f.y - f.T.r * 0.4;
    a0 = Math.atan2(T0.y - 20 - cy, T0.x - f.x);
    for (i = 0; i < (f.vol || 5); i++){ a = a0 + (i - ((f.vol || 5) - 1) / 2) * (f.spr || 0.18); df.eshots.push({ x: f.x, y: cy, vx: Math.cos(a) * (f.ss || 300), vy: Math.sin(a) * (f.ss || 300), life: 1.8, dmg: dmg, el: el }); }
    f.atk = bossCd(f) * 0.8; return true;
  }
  if (f.atkType === 'cast'){
    var tg = H && !H.ko ? H : { x: f.sx, y: f.sy }, enr = f.hp < f.max * 0.35, pts = [];
    if (f.rain === 'summon'){ if (!rbSummon(f, k === 'undead' ? 2 : 2)) rbRain(f, rbOnPlayers(), 1.1, 50); f.atk = bossCd(f); return true; }
    if (f.rain === 'rocks') pts = rbOnPlayers().concat(rbAround(tg, enr ? 5 : 3, 170));
    else if (f.rain === 'meteors') pts = rbOnPlayers().concat(rbAround(tg, enr ? 6 : 4, 200));
    else if (f.rain === 'bolts'){ pts = rbOnPlayers().concat(rbAround(tg, enr ? 3 : 2, 150)); rbRain(f, pts, 0.85, 44); f.atk = bossCd(f); return true; }
    else if (f.rain === 'mines'){ for (i = 0; i < (enr ? 7 : 5); i++){ var mx, my, t2 = 0; do { mx = 140 + Math.random() * 720; my = 180 + Math.random() * 330; } while (!dfInIsland(mx, my) && ++t2 < 20); pts.push({ x: mx, y: my, d: i * 0.12 }); } pts = pts.concat(rbOnPlayers()); rbRain(f, pts, 1.7, 52); f.atk = bossCd(f); return true; }
    else if (f.rain === 'line'){
      var ax = tg.x - f.x, ay = tg.y - f.y, al = Math.hypot(ax, ay) || 1, steps = enr ? 7 : 5;
      for (i = 1; i <= steps; i++){ var d0 = Math.min(al + 120, i * 85); pts.push({ x: f.x + ax / al * d0, y: f.y + ay / al * d0, d: i * 0.13 }); }
      rbRain(f, pts, 0.75, 46); f.atk = bossCd(f); return true;
    }
    else if (f.rain === 'tri'){ for (i = 0; i < 3; i++){ a = i / 3 * 6.283 + Math.random(); pts.push({ x: tg.x + Math.cos(a) * 70, y: tg.y + Math.sin(a) * 50 }); } pts.push({ x: tg.x, y: tg.y, d: 0.35 }); if (enr) pts = pts.concat(rbAround(tg, 3, 220)); }
    else if (f.rain === 'curse') pts = rbOnPlayers().concat(rbAround(tg, enr ? 5 : 3, 180));
    rbRain(f, pts, 1.15, 50);
    f.atk = bossCd(f); return true;
  }
  return false;
}
/* a rain zone landing: hurts every pal inside (the host decides for everyone) */
function rbRainHit(k){
  var C = RB_FX[k.el] || RB_FX.fire;
  dfFx('boom', k.x, k.y + 8, { life: 0.5, max: 0.5, col: C[1] });
  dfFx('ring', k.x, k.y, { life: 0.45, max: 0.45, col: C[0] });
  if (df.coop && df.coop.role !== 'host') return;
  dfPlayers().forEach(function(q){ if (q && !q.ko && Math.hypot(q.x - k.x, (q.y - k.y) * 1.5) < k.r) dfHitPal(q, k.dmg || 20); });
}
/* weak spots: pals of the boss's weak element hit it x1.5 */
function rbWeakMul(f, who){
  if (!f || f.k !== 'boss' || !f.bk || !who || !who.c) return 1;
  return RAID_BOSSES[f.bk] && RAID_BOSSES[f.bk].weak === who.c.element ? 1.5 : 1;
}

/* ---- drawing ---- */
function rbC(f, c){ return f.hit > 0 ? '#fff' : c; }
function rbEll(g, x, y, rx, ry, rot, fill, stroke){ g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, 7); if (fill){ g.fillStyle = fill; g.fill(); } if (stroke !== false) g.stroke(); }
function rbPoly(g, pts, fill, stroke){ g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); if (fill){ g.fillStyle = fill; g.fill(); } if (stroke !== false) g.stroke(); }
/* draws the boss's body centred on (0, 0), facing right, radius r; t = time, f = the foe (hit flash, wind, enraged) */
var RB_DRAW = {
  earth: function(g, f, r, t){
    var o = f.wind > 0 ? Math.sin(t * 30) * 1.5 : 0;
    g.strokeStyle = '#3a2610'; g.lineWidth = 3.5;
    rbEll(g, -r * 0.55, r * 0.75, r * 0.22, r * 0.2, 0, rbC(f, '#6a5038')); rbEll(g, r * 0.45, r * 0.78, r * 0.22, r * 0.2, 0, rbC(f, '#6a5038'));
    rbEll(g, r * 0.95, r * 0.3, r * 0.42, r * 0.36, 0, rbC(f, '#8a6a48'));                                                         /* head */
    rbEll(g, 0, o, r * 1.1, r * 0.95, 0, rbC(f, '#a07a4e'));                                                                        /* shell */
    g.lineWidth = 2.5;
    rbPoly(g, [[-r * 0.7, -r * 0.5], [-r * 0.2, -r * 0.85], [r * 0.3, -r * 0.6], [r * 0.1, -r * 0.1], [-r * 0.5, -r * 0.05]], rbC(f, '#b8946a'));
    rbPoly(g, [[r * 0.35, -r * 0.55], [r * 0.85, -r * 0.3], [r * 0.8, r * 0.25], [r * 0.25, r * 0.2], [r * 0.15, -r * 0.1]], rbC(f, '#94704a'));
    rbPoly(g, [[-r * 0.95, 0], [-r * 0.45, r * 0.05], [-r * 0.2, r * 0.6], [-r * 0.75, r * 0.6]], rbC(f, '#8a6a44'));
    rbPoly(g, [[-r * 0.1, r * 0.1], [r * 0.2, r * 0.25], [r * 0.15, r * 0.75], [-r * 0.2, r * 0.7]], rbC(f, '#9a7650'));
    g.fillStyle = '#7ab83a'; g.lineWidth = 2; rbEll(g, -r * 0.25, -r * 0.82, r * 0.3, r * 0.1, -0.2, '#7ab83a');                 /* moss */
    g.fillStyle = f.hp < f.max * 0.35 ? '#ff5a2a' : '#ffcf3a'; g.beginPath(); g.arc(r * 1.12, r * 0.22, r * 0.09, 0, 7); g.fill();
    g.strokeStyle = '#3a2610'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(r * 0.98, r * 0.12); g.lineTo(r * 1.25, r * 0.1); g.stroke();
  },
  fire: function(g, f, r, t){
    g.strokeStyle = '#2a0a04'; g.lineWidth = 3.5;
    rbEll(g, -r * 0.7, r * 0.7, r * 0.26, r * 0.2, 0, rbC(f, '#7a3a20')); rbEll(g, r * 0.55, r * 0.72, r * 0.26, r * 0.2, 0, rbC(f, '#7a3a20'));
    rbEll(g, r * 1.0, r * 0.15, r * 0.42, r * 0.34, 0, rbC(f, '#9a4a2a'));
    g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(r * 1.12, r * 0.04, r * 0.09, 0, 7); g.fill();
    g.fillStyle = '#2a0a04'; g.beginPath(); g.moveTo(r * 0.9, r * 0.3); g.lineTo(r * 1.4, r * 0.28); g.lineTo(r * 1.1, r * (f.wind > 0 ? 0.48 : 0.36)); g.closePath(); g.fill();
    rbEll(g, 0, 0, r * 1.1, r * 0.92, 0, rbC(f, '#4a2418'));                                                                       /* rock shell */
    g.strokeStyle = 'rgba(255,' + (140 + Math.round(60 * Math.sin(t * 4))) + ',40,.95)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-r * 0.8, r * 0.1); g.lineTo(-r * 0.35, -r * 0.2); g.lineTo(-r * 0.4, r * 0.4); g.moveTo(-r * 0.35, -r * 0.2); g.lineTo(r * 0.15, -r * 0.35); g.lineTo(r * 0.55, -r * 0.05); g.lineTo(r * 0.3, r * 0.45); g.moveTo(r * 0.15, -r * 0.35); g.lineTo(r * 0.05, r * 0.25); g.stroke();
    g.strokeStyle = '#2a0a04'; g.lineWidth = 3;
    rbPoly(g, [[-r * 0.35, -r * 0.8], [-r * 0.2, -r * 1.2], [r * 0.2, -r * 1.2], [r * 0.35, -r * 0.8]], rbC(f, '#3a1a10'));      /* the volcano vent */
    for (var i = 0; i < 3; i++){ var fh = r * (0.35 + 0.15 * Math.sin(t * 9 + i * 2)); g.fillStyle = i === 1 ? '#ffd23a' : '#ff7a2a'; g.beginPath(); g.moveTo((i - 1) * r * 0.16 - r * 0.1, -r * 1.18); g.quadraticCurveTo((i - 1) * r * 0.16, -r * 1.18 - fh * 1.4, (i - 1) * r * 0.16 + r * 0.1, -r * 1.18); g.closePath(); g.fill(); }
  },
  water: function(g, f, r, t){
    var cl = f.wind > 0 ? 0.35 : 0.12 + Math.sin(t * 3) * 0.05, i;
    g.strokeStyle = '#0a2a4a'; g.lineWidth = 3;
    for (i = 0; i < 3; i++){ g.beginPath(); g.moveTo(-r * 0.5 + i * r * 0.15, r * 0.4); g.lineTo(-r * 1.15 + i * r * 0.1, r * (0.8 + i * 0.12)); g.moveTo(r * 0.5 - i * r * 0.15, r * 0.4); g.lineTo(r * 1.15 - i * r * 0.1, r * (0.8 + i * 0.12)); g.stroke(); }
    [-1, 1].forEach(function(s){      /* the big claws */
      g.save(); g.translate(s * r * 0.95, -r * 0.55); g.rotate(s * 0.3);
      g.lineWidth = 3; rbEll(g, 0, 0, r * 0.42, r * 0.3, 0, rbC(f, '#e85a3a'));
      rbPoly(g, [[r * 0.05 * s, -r * 0.1], [r * 0.55 * s, -r * (0.35 + cl)], [r * 0.4 * s, -r * 0.02]], rbC(f, '#ff7a5a'));
      rbPoly(g, [[r * 0.05 * s, r * 0.1], [r * 0.55 * s, r * (0.25 + cl * 0.5)], [r * 0.4 * s, r * 0.05]], rbC(f, '#ff7a5a'));
      g.restore();
    });
    g.lineWidth = 3.5; rbEll(g, 0, 0, r * 1.05, r * 0.68, 0, rbC(f, '#2e9ad8'));
    g.fillStyle = 'rgba(255,255,255,.18)'; rbEll(g, -r * 0.3, -r * 0.25, r * 0.5, r * 0.18, -0.2, 'rgba(255,255,255,.18)', false);
    g.strokeStyle = '#0a2a4a'; g.lineWidth = 2.5;
    [-0.3, 0.3].forEach(function(s){ g.beginPath(); g.moveTo(r * s, -r * 0.5); g.lineTo(r * s * 1.2, -r * 0.95); g.stroke(); rbEll(g, r * s * 1.2, -r * 1.02, r * 0.14, r * 0.14, 0, '#fff'); g.fillStyle = '#111'; g.beginPath(); g.arc(r * s * 1.2 + r * 0.04, -r * 1.02, r * 0.06, 0, 7); g.fill(); });
    g.strokeStyle = '#0a2a4a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-r * 0.3, r * 0.2); g.quadraticCurveTo(0, r * 0.38, r * 0.3, r * 0.2); g.stroke();
  },
  life: function(g, f, r, t){
    var i, sway = Math.sin(t * 2) * 0.08;
    g.strokeStyle = '#1a3a10'; g.lineWidth = 3;
    for (i = 0; i < 5; i++){ var a = -0.4 + i * 0.2; g.beginPath(); g.moveTo(0, r * 0.6); g.quadraticCurveTo(Math.sin(a) * r * 1.3, r * 0.95, Math.sin(a) * r * 1.6, r * 0.85); g.stroke(); }   /* roots */
    rbEll(g, 0, r * 0.55, r * 0.75, r * 0.32, 0, rbC(f, '#6a4a2a'));
    rbPoly(g, [[-r * 0.2, r * 0.5], [-r * 1.2, r * 0.05], [-r * 0.5, r * 0.25]], rbC(f, '#4a9a2a')); rbPoly(g, [[r * 0.2, r * 0.5], [r * 1.2, r * 0.05], [r * 0.5, r * 0.25]], rbC(f, '#4a9a2a'));
    g.lineWidth = 6; g.strokeStyle = '#1a3a10'; g.beginPath(); g.moveTo(0, r * 0.5); g.quadraticCurveTo(r * 0.1, 0, 0, -r * 0.3); g.stroke(); g.lineWidth = 3.5; g.strokeStyle = '#4a9a2a'; g.stroke();
    g.save(); g.translate(0, -r * 0.45); g.rotate(sway);
    g.strokeStyle = '#5a1030'; g.lineWidth = 2.5;
    for (i = 0; i < 7; i++){ g.save(); g.rotate(i / 7 * 6.283 + t * 0.2); rbEll(g, 0, -r * 0.62, r * 0.28, r * 0.45, 0, rbC(f, i % 2 ? '#ff6aa8' : '#e8408a')); g.restore(); }
    rbEll(g, 0, 0, r * 0.5, r * 0.5, 0, rbC(f, '#ffd23a'));
    g.fillStyle = '#3a0a1a'; g.beginPath(); g.ellipse(0, r * 0.12, r * 0.32, r * (f.wind > 0 ? 0.24 : 0.15), 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; for (i = -2; i <= 2; i++){ g.beginPath(); g.moveTo(i * r * 0.1 - r * 0.04, r * 0.02); g.lineTo(i * r * 0.1 + r * 0.04, r * 0.02); g.lineTo(i * r * 0.1, r * 0.13); g.closePath(); g.fill(); }
    g.fillStyle = f.hp < f.max * 0.35 ? '#ff2a2a' : '#2a1a0a'; g.beginPath(); g.ellipse(-r * 0.18, -r * 0.16, r * 0.08, r * 0.1, 0, 0, 7); g.ellipse(r * 0.18, -r * 0.16, r * 0.08, r * 0.1, 0, 0, 7); g.fill();
    g.restore();
  },
  tech: function(g, f, r, t){
    var i;
    g.strokeStyle = '#1e2430'; g.lineWidth = 3.5;
    rbPoly(g, [[-r * 0.55, r * 0.55], [-r * 0.25, r * 0.55], [-r * 0.2, r * 0.95], [-r * 0.65, r * 0.95]], rbC(f, '#5a6272'));
    rbPoly(g, [[r * 0.55, r * 0.55], [r * 0.25, r * 0.55], [r * 0.2, r * 0.95], [r * 0.65, r * 0.95]], rbC(f, '#5a6272'));
    [-1, 1].forEach(function(s){ rbPoly(g, [[s * r * 0.85, -r * 0.6], [s * r * 1.3, -r * 0.55], [s * r * 1.3, -r * 0.2], [s * r * 0.85, -r * 0.15]], rbC(f, '#6a7484')); g.fillStyle = '#222'; g.fillRect(s > 0 ? r * 1.3 : -r * 1.45, -r * 0.48, r * 0.15, r * 0.22); });   /* shoulder cannons */
    rbPoly(g, [[-r * 0.9, -r * 0.7], [r * 0.9, -r * 0.7], [r * 1.0, r * 0.6], [-r * 1.0, r * 0.6]], rbC(f, '#8c96a8'));
    g.save(); g.translate(0, r * 0.05); g.rotate(t * (f.wind > 0 ? 6 : 1.5));       /* the chest gear */
    g.fillStyle = rbC(f, '#ffd23a'); g.lineWidth = 2.5; g.beginPath();
    for (i = 0; i < 16; i++){ var rr = i % 2 ? r * 0.32 : r * 0.42, a = i / 16 * 6.283; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#5a4a10'; g.beginPath(); g.arc(0, 0, r * 0.12, 0, 7); g.fill(); g.restore();
    rbPoly(g, [[-r * 0.5, -r * 1.25], [r * 0.5, -r * 1.25], [r * 0.6, -r * 0.7], [-r * 0.6, -r * 0.7]], rbC(f, '#6a7484'));     /* head */
    g.fillStyle = f.hp < f.max * 0.35 ? '#ff2a2a' : (f.wind > 0 ? '#ff8a3a' : '#ff4a4a'); g.fillRect(-r * 0.4, -r * 1.08, r * 0.8, r * 0.16);
    g.strokeStyle = '#1e2430'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, -r * 1.25); g.lineTo(0, -r * 1.55); g.stroke();
    g.fillStyle = (Math.sin(t * 6) > 0) ? '#ff4a4a' : '#ffd23a'; g.beginPath(); g.arc(0, -r * 1.58, r * 0.07, 0, 7); g.fill();
  },
  air: function(g, f, r, t){
    var fl = Math.sin(t * (f.dash > 0 ? 20 : 7)) * 0.35;
    g.strokeStyle = '#123a5a'; g.lineWidth = 3;
    [-1, 1].forEach(function(s){      /* wings */
      g.save(); g.rotate(s * fl * 0.6);
      rbPoly(g, [[s * r * 0.3, -r * 0.2], [s * r * 1.9, -r * (0.9 + fl * 0.4)], [s * r * 1.7, -r * 0.35], [s * r * 1.85, -r * 0.1], [s * r * 1.45, r * 0.05], [s * r * 1.55, r * 0.3], [s * r * 0.4, r * 0.25]], rbC(f, '#3a8ac8'));
      g.strokeStyle = '#9ae8ff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(s * r * 0.5, -r * 0.05); g.lineTo(s * r * 1.6, -r * 0.55); g.stroke(); g.strokeStyle = '#123a5a'; g.lineWidth = 3;
      g.restore();
    });
    rbEll(g, 0, r * 0.1, r * 0.62, r * 0.78, 0, rbC(f, '#5ab4e8'));
    rbPoly(g, [[-r * 0.1, -r * 0.15], [r * 0.15, -r * 0.15], [-r * 0.05, r * 0.15], [r * 0.15, r * 0.15], [-r * 0.2, r * 0.6], [-r * 0.05, r * 0.25], [-r * 0.25, r * 0.25]], '#ffe03a');   /* lightning mark */
    rbEll(g, r * 0.1, -r * 0.7, r * 0.42, r * 0.38, 0, rbC(f, '#e8f6ff'));
    rbPoly(g, [[r * 0.45, -r * 0.75], [r * 0.85, -r * 0.62], [r * 0.45, -r * 0.5]], rbC(f, '#ffc23a'));
    g.fillStyle = f.hp < f.max * 0.35 ? '#ff2a2a' : '#111'; g.beginPath(); g.arc(r * 0.25, -r * 0.78, r * 0.07, 0, 7); g.fill();
    g.strokeStyle = '#123a5a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(r * 0.08, -r * 0.92); g.lineTo(r * 0.4, -r * 0.86); g.stroke();
    rbPoly(g, [[-r * 0.2, -r * 1.0], [-r * 0.1, -r * 1.35], [r * 0.05, -r * 1.02], [r * 0.15, -r * 1.3], [r * 0.25, -r * 1.0]], rbC(f, '#3a8ac8'));
    g.strokeStyle = '#ffc23a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-r * 0.2, r * 0.85); g.lineTo(-r * 0.25, r * 1.05); g.moveTo(r * 0.2, r * 0.85); g.lineTo(r * 0.25, r * 1.05); g.stroke();
  },
  magic: function(g, f, r, t){
    var i, hv = Math.sin(t * 3) * r * 0.08;
    g.save(); g.translate(0, hv);
    g.strokeStyle = '#2a1050'; g.lineWidth = 3;
    rbPoly(g, [[0, -r * 0.9], [r * 0.85, r * 0.9], [r * 0.45, r * 0.75], [r * 0.15, r * 0.95], [-r * 0.15, r * 0.75], [-r * 0.45, r * 0.95], [-r * 0.85, r * 0.9]], rbC(f, '#6a3ab8'));   /* robe */
    g.strokeStyle = '#ffd23a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-r * 0.65, r * 0.8); g.lineTo(0, -r * 0.6); g.lineTo(r * 0.65, r * 0.8); g.stroke();
    g.strokeStyle = '#2a1050'; g.lineWidth = 3;
    rbPoly(g, [[0, -r * 1.5], [r * 0.55, -r * 0.55], [r * 0.4, -r * 0.35], [-r * 0.4, -r * 0.35], [-r * 0.55, -r * 0.55]], rbC(f, '#4a2090'));     /* hood */
    rbEll(g, 0, -r * 0.62, r * 0.3, r * 0.24, 0, '#12061e');
    g.fillStyle = f.hp < f.max * 0.35 ? '#ff4a8a' : '#e8c4ff'; g.beginPath(); g.ellipse(-r * 0.12, -r * 0.64, r * 0.07, r * 0.05, 0, 0, 7); g.ellipse(r * 0.12, -r * 0.64, r * 0.07, r * 0.05, 0, 0, 7); g.fill();
    [-1, 1].forEach(function(s){ rbEll(g, s * r * 0.9, -r * 0.05 + Math.sin(t * 4 + s) * r * 0.08, r * 0.16, r * 0.16, 0, rbC(f, '#c8a4ff')); });   /* floating hands */
    for (i = 0; i < 4; i++){      /* orbiting stars */
      var a = t * 1.6 + i * 1.571, sx = Math.cos(a) * r * 1.25, sy = Math.sin(a) * r * 0.45 - r * 0.2;
      g.fillStyle = '#ffe85a'; g.beginPath();
      for (var j = 0; j < 10; j++){ var rr = j % 2 ? r * 0.06 : r * 0.15, b = j / 10 * 6.283 - 1.571; g.lineTo(sx + Math.cos(b) * rr, sy + Math.sin(b) * rr); }
      g.closePath(); g.fill();
    }
    g.restore();
  },
  undead: function(g, f, r, t){
    var i;
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 3;
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 5; g.beginPath(); g.moveTo(r * 0.9, r * 0.9); g.lineTo(r * 1.15, -r * 1.2); g.stroke();      /* the scythe */
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 2.5;
    rbPoly(g, [[r * 1.15, -r * 1.2], [r * 0.2, -r * 1.35], [r * 0.6, -r * 1.12], [r * 1.12, -r * 1.02]], rbC(f, '#c8ccd4'));
    g.lineWidth = 3;
    rbPoly(g, [[-r * 0.85, -r * 0.35], [r * 0.85, -r * 0.35], [r * 0.65, r * 0.95], [-r * 0.65, r * 0.95]], rbC(f, '#3a2a4a'));     /* tattered cloak */
    g.strokeStyle = '#d8d4c4'; g.lineWidth = 3;
    for (i = 0; i < 4; i++){ g.beginPath(); g.moveTo(-r * 0.35, -r * 0.1 + i * r * 0.18); g.quadraticCurveTo(0, r * 0.05 + i * r * 0.18, r * 0.35, -r * 0.1 + i * r * 0.18); g.stroke(); }   /* ribs */
    g.beginPath(); g.moveTo(0, -r * 0.3); g.lineTo(0, r * 0.65); g.stroke();
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 3;
    rbEll(g, -r * 0.95, r * 0.05, r * 0.14, r * 0.14, 0, rbC(f, '#d8d4c4')); rbEll(g, r * 0.95, r * 0.05, r * 0.14, r * 0.14, 0, rbC(f, '#d8d4c4'));
    rbEll(g, 0, -r * 0.75, r * 0.5, r * 0.45, 0, rbC(f, '#e8e4d4'));                                                                /* skull */
    rbPoly(g, [[-r * 0.3, -r * 0.42], [r * 0.3, -r * 0.42], [r * 0.25, -r * 0.25], [-r * 0.25, -r * 0.25]], rbC(f, '#e8e4d4'));
    g.fillStyle = '#111'; for (i = -1; i <= 1; i++) g.fillRect(i * r * 0.14 - r * 0.03, -r * 0.4, r * 0.06, r * 0.12);
    var gl = f.hp < f.max * 0.35 ? '#ff4a4a' : '#7aff9a';
    g.fillStyle = '#111'; g.beginPath(); g.ellipse(-r * 0.18, -r * 0.78, r * 0.13, r * 0.12, 0, 0, 7); g.ellipse(r * 0.18, -r * 0.78, r * 0.13, r * 0.12, 0, 0, 7); g.fill();
    g.fillStyle = gl; g.beginPath(); g.arc(-r * 0.18, -r * 0.78, r * 0.05 + Math.sin(t * 5) * r * 0.015, 0, 7); g.arc(r * 0.18, -r * 0.78, r * 0.05 + Math.sin(t * 5) * r * 0.015, 0, 7); g.fill();
    g.strokeStyle = '#5a3e00'; g.lineWidth = 2;
    rbPoly(g, [[-r * 0.4, -r * 1.08], [-r * 0.42, -r * 1.42], [-r * 0.18, -r * 1.22], [0, -r * 1.5], [r * 0.18, -r * 1.22], [r * 0.42, -r * 1.42], [r * 0.4, -r * 1.08]], '#ffd23e');   /* crown */
  }
};
function rbDraw(g, f){
  var k = f.bk && RB_DRAW[f.bk] ? f.bk : 'fire', T = f.T, r = T.r, x = f.x, y = f.y + Math.sin(df.t * 5 + f.ph) * 2.5, enr = f.hp < f.max * 0.35;
  g.fillStyle = 'rgba(20,10,30,.35)'; g.beginPath(); g.ellipse(f.x, f.y + r * 0.75, r * 1.15, r * 0.4, 0, 0, 7); g.fill();
  if (enr){ g.fillStyle = 'rgba(255,60,60,' + (0.18 + 0.1 * Math.sin(df.t * 8)) + ')'; g.beginPath(); g.ellipse(x, y - r * 0.4, r * 1.45, r * 1.45, 0, 0, 7); g.fill(); }
  if (f.wind > 0 && f.atkType === 'cast'){ var C = RB_FX[k]; g.fillStyle = 'rgba(' + C[2] + ',' + (0.2 + 0.15 * Math.sin(df.t * 14)) + ')'; g.beginPath(); g.ellipse(x, y + r * 0.6, r * 1.6, r * 0.55, 0, 0, 7); g.fill(); }
  g.save(); g.translate(x, y - r * 0.4); g.scale(f.dir || 1, 1);
  g.lineJoin = 'round'; g.lineCap = 'round';
  RB_DRAW[k](g, f, r, df.t + (f.ph || 0));
  g.restore();
  var w = 150, pct = Math.max(0, f.hp / f.max), by = y - r * 2.45;
  g.fillStyle = 'rgba(20,10,40,.8)'; g.fillRect(x - w / 2 - 2, by - 2, w + 4, 12);
  g.fillStyle = pct > 0.66 ? RB_FX[k][1] : pct > 0.33 ? '#ffb13a' : '#ff4b4b'; g.fillRect(x - w / 2, by, w * pct, 8);
  g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x - w / 2 + w * 0.33, by, 2, 8); g.fillRect(x - w / 2 + w * 0.66, by, 2, 8);
}
/* the red marks of the new attack kinds (shot / dash / slam marks are drawn by the arena code) */
function rbDrawMark(g, f, u){
  var C = RB_FX[f.bk || 'fire'], i;
  if (f.atkType === 'ring'){
    var n = f.vol || 10, R = f.T.r + 28 + u * 18, cy = f.y - f.T.r * 0.4;
    g.save(); g.strokeStyle = 'rgba(255,40,40,' + (0.45 + u * 0.5) + ')'; g.lineWidth = 3;
    for (i = 0; i < n; i++){ var a = (i + (f.off || 0)) / n * 6.283; g.beginPath(); g.moveTo(f.x + Math.cos(a) * (f.T.r + 14), cy + Math.sin(a) * (f.T.r + 14)); g.lineTo(f.x + Math.cos(a) * R * 1.6, cy + Math.sin(a) * R * 1.6); g.stroke(); }
    g.restore(); return true;
  }
  if (f.atkType === 'blink'){
    g.save(); g.setLineDash([10, 8]); g.strokeStyle = 'rgba(' + C[2] + ',.9)'; g.lineWidth = 3;
    g.beginPath(); g.ellipse(f.sx, f.sy, 55 - u * 15, 30 - u * 8, 0, 0, 7); g.stroke(); g.restore();
    return true;
  }
  if (f.atkType === 'cast') return true;
  return false;
}
/* what falls into a rain zone */
function rbDrawRain(g, k){
  var u = 1 - k.t / k.T0, C = RB_FX[k.el] || RB_FX.fire, ry;
  if (k.el === 'air'){      /* lightning flashes down at the very end */
    if (u < 0.82) return;
    g.save(); g.strokeStyle = '#fffbe0'; g.lineWidth = 4; g.shadowColor = '#9ae8ff'; g.shadowBlur = 14; g.beginPath(); g.moveTo(k.x + 10, k.y - 420);
    for (var i = 1; i <= 6; i++) g.lineTo(k.x + (i % 2 ? -14 : 12), k.y - 420 + i * 70);
    g.stroke(); g.restore(); return;
  }
  if (k.el === 'life' || k.el === 'tech'){      /* vines push up / mines blink on the ground */
    if (k.el === 'tech'){ g.fillStyle = Math.sin(df.t * (6 + u * 20)) > 0 ? '#ff4a4a' : '#555'; g.strokeStyle = '#1e2430'; g.lineWidth = 2; g.beginPath(); g.arc(k.x, k.y, 9, 0, 7); g.fill(); g.stroke(); return; }
    if (u < 0.75) return;
    var h = (u - 0.75) / 0.25 * 46; g.strokeStyle = '#1a3a10'; g.lineWidth = 3; g.fillStyle = '#5aae3a';
    [-14, 0, 14].forEach(function(dx, j){ g.beginPath(); g.moveTo(k.x + dx - 6, k.y); g.lineTo(k.x + dx, k.y - h * (j === 1 ? 1.2 : 0.8)); g.lineTo(k.x + dx + 6, k.y); g.closePath(); g.fill(); g.stroke(); });
    return;
  }
  ry = k.y - 480 * (1 - u * u) - 10;
  var gl = g.createRadialGradient(k.x, ry, 2, k.x, ry, 22); gl.addColorStop(0, C[0]); gl.addColorStop(0.5, C[1]); gl.addColorStop(1, 'rgba(' + C[2] + ',0)');
  g.fillStyle = gl; g.beginPath(); g.arc(k.x, ry, 22, 0, 7); g.fill();
  g.strokeStyle = 'rgba(' + C[2] + ',.45)'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(k.x, ry); g.lineTo(k.x, ry - 40); g.stroke();
  if (k.el === 'earth'){ g.fillStyle = '#8a6a44'; g.strokeStyle = '#3a2610'; g.lineWidth = 2; rbPoly(g, [[k.x - 12, ry - 6], [k.x - 4, ry - 14], [k.x + 10, ry - 9], [k.x + 12, ry + 6], [k.x - 6, ry + 11]], '#8a6a44'); }
}
/* a boss's portrait for the picker */
function rbPortrait(cv, k){
  var g = cv.getContext('2d'), T = RB_T[k], w = cv.width, h = cv.height, s = Math.min(w, h) / 120;
  g.clearRect(0, 0, w, h);
  var f = { k: 'boss', bk: k, T: T, x: 0, y: 0, hp: 1, max: 1, hit: 0, wind: 0, dir: 1, ph: 0, dash: 0 };
  g.save(); g.translate(w / 2, h * 0.62); g.scale(s * 1.05, s * 1.05); g.translate(0, -T.r * 0.4);
  g.lineJoin = 'round'; g.lineCap = 'round';
  RB_DRAW[k](g, f, T.r, (df.t || 0) + 1);
  g.restore();
}
/* ---- the boss picker in the raid window ---- */
function rbPicker(){
  var cur = rbPicked();
  return '<p class="lvpick-t">Choose a boss</p><div class="rbpick">' + RB_ORDER.map(function(k, i){
    var B = RAID_BOSSES[k], open = rbOpen(k), won = rbWon(k), st = '';
    for (var j = 1; j <= 3; j++) st += '<i class="' + (won >= j ? 'on' : '') + '">\u2605</i>';
    if (!open) return '<button class="rbb lock" type="button" disabled title="Beat ' + esc(rbName(RB_ORDER[i - 1])) + ' first"><canvas class="rbc" width="96" height="84" data-k="' + k + '"></canvas><b>' + esc(B.name) + '</b><small>Beat ' + esc(rbName(RB_ORDER[i - 1])) + '</small></button>';
    return '<button class="rbb' + (k === cur ? ' on' : '') + '" type="button" data-action="rb-pick" data-k="' + k + '" style="' + EL[k].vars + '"><canvas class="rbc" width="96" height="84" data-k="' + k + '"></canvas>' +
      '<b>' + esc(B.name) + '</b><small><span class="rbe">' + ICON[k] + '</span> weak to <span class="rbe">' + ICON[B.weak] + '</span></small><span class="rbs">' + st + '</span></button>';
  }).join('') + '</div><p class="small rbnote">' + (function(){ var B = RAID_BOSSES[cur]; return '<b>' + esc(B.name) + '</b>, ' + esc(B.title) + '. ' + EL[B.weak].label + ' pals hit it 50% harder.'; })() + '</p>';
}
function rbPortraits(){ $$('#df-panel canvas.rbc').forEach(function(cv){ rbPortrait(cv, cv.dataset.k); }); }
function rbPick(k){
  if (!RAID_BOSSES[k] || !rbOpen(k)) return;
  state.island.raidBoss = k; save();
  if (df.open && df.mode === 'raid' && (df.phase === 'intro' || df.phase === 'end')) dfIntro();
}
/* ==/RB== */
