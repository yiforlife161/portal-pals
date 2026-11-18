
/* monsters some games send at you: they walk to the closest pal, wind up (red circle) and hit */
var SG_MOB = {
  crab: { hp: 3, spd: 95, r: 62, wind: 0.75, cd: 1.4, dmg: 0.1, pts: 1, name: 'Crab' },
  skel: { hp: 4, spd: 72, r: 70, wind: 0.8, cd: 1.6, dmg: 0.13, pts: 1, name: 'Skeleton' }
};
function sgMobTick(e, dt){
  var T = SG_MOB[e.s] || SG_MOB.crab, k = sg.k || 1;
  if (e.d > 0) e.d -= dt;
  if (e.hit > 0) e.hit -= dt;
  if (e.c > 0){
    e.c -= dt;
    if (e.c <= 0){
      e.c = 0; e.d = T.cd / Math.sqrt(k);
      sgPlayers().forEach(function(p){ if (Math.hypot(p.x - e.x, (p.y - e.y) * 1.25) < T.r) sgHurt(p, T.dmg, e); });
      sgFx({ k: 'ring', x: e.x, y: e.y, t: 0.35, T: 0.35, c: '#ff6a5a' });
    }
    return;
  }
  var best = null, bd = 1e9;
  sgPlayers().forEach(function(p){ if (p.ko > 0) return; var d = Math.hypot(p.x - e.x, p.y - e.y); if (d < bd){ bd = d; best = p; } });
  if (!best) return;
  if (bd < T.r * 0.75){ if (e.d <= 0) e.c = T.wind / Math.min(1.5, Math.sqrt(k)); return; }
  var sp = T.spd * Math.min(1.5, 0.85 + 0.15 * k) * dt, nx = e.x + (best.x - e.x) / bd * sp, ny = e.y + (best.y - e.y) / bd * sp;
  if (sgWalk(nx, ny)){ e.x = nx; e.y = ny; } else if (sgWalk(nx, e.y)) e.x = nx; else if (sgWalk(e.x, ny)) e.y = ny;
  e.b = best.x < e.x ? -1 : 1;      /* which way it faces */
}
function sgHitMob(p, e){
  var T = SG_MOB[e.s] || SG_MOB.crab;
  e.a -= 1; e.hit = 0.15;
  var d = Math.hypot(e.x - p.x, e.y - p.y) || 1, nx = e.x + (e.x - p.x) / d * 34, ny = e.y + (e.y - p.y) / d * 34;
  if (sgWalk(nx, ny)){ e.x = nx; e.y = ny; }
  e.c = 0; e.d = Math.max(e.d, 0.5);
  sgFx({ k: 'ring', x: e.x, y: e.y - 20, t: 0.25, T: 0.25, c: '#fff' });
  if (e.a <= 0){
    sgDel(e); sgFx({ k: 'poof', x: e.x, y: e.y - 20, t: 0.5, T: 0.5, c: 'rgba(255,255,255,.8)' });
    sgPts(p, T.pts, e.x, e.y - 60, T.name + ' down!');
    if (sg.G.mobDown) sg.G.mobDown(e, p);
    sgFood(e.x, e.y, 0.2);
  }
}

/* ---------- open, waves, end ---------- */
function sgOpen(area){
  var pal = heroChar(), G = SG_GAMES[area];
  if (!G || sg.open || df.open || cn.open || th.open || qu.open || ss.open || !pal) return false;
  sg.cv = $('#sg-canvas'); sg.g = sg.cv.getContext('2d');
  sg.area = area; sg.G = G; sg.back = document.activeElement; sg.open = true; sg.keys = {}; sg.fx = []; sg.E = []; sg.H = []; sg.P = []; sg.mini = null;
  hero.mv = null; cancelMining();
  var R = rng(area.length * 7919 + area.charCodeAt(0) * 31);
  sg.I = { x: 600, y: 430, rx: 560, ry: 340, sh: quShape(R), props: [] };
  sg.decor = G.decor ? G.decor(R) : [];
  $('#sgame').hidden = false; $('#sgame').dataset.g = area; $('.wrap').inert = true; document.body.style.overflow = 'hidden';
  $('#sg-pals').innerHTML = ''; $('#sg-ord').innerHTML = ''; $('#sg-ord').hidden = true; sgMiniUi();
  sg.phase = 'intro'; sg.w = 0; sg.sc = 0; sg.need = 1; sg.tl = Math.round((G.waveT || SG_WAVE_T) * SG_LONG); sg.k = 1; sg.mul = 1; sg.surv = null; sg.coop = null;
  if (G.layout){ sg.lv = 1; sg.chL = 0; G.layout(1); if (G.preview) G.preview(); }
  var xl = document.querySelector('.sg-xpc span'); if (xl) xl.textContent = G.mg ? 'Earned' : 'XP';
  sg.cam = { x: sg.I.x, y: sg.I.y };
  sgResize(); sgHud(); sgIntro();
  $('#sg-banner').classList.remove('show');
  $('#sgame').focus();
  if (window.ppCoop && window.ppCoop.lbPush) window.ppCoop.lbPush();      /* friends see my current level when they invite me */
  sg.last = performance.now(); sg.raf = requestAnimationFrame(sgLoop);
  return true;
}
function sgMakePal(c, slot, name, me){
  var el = document.createElement('div');
  el.className = 'dfp' + (me ? ' me' : ' mate') + (c.style === 'ranged' ? ' ranged' : '') + (HATS[c.hat] ? ' hat' : '') + (c.img ? ' pimg' : '');
  el.setAttribute('style', EL[c.element].vars);
  el.innerHTML = '<div class="dfp-shadow"></div><div class="dfp-body">' + palFigure(c) + '</div>' + (me ? '<div class="dfp-you">YOU</div>' : '<div class="dfp-you dfp-mate" data-notr>' + esc(name) + '</div>') +
    '<div class="dfp-hp"><i></i></div><div class="qcarry" hidden></div>';
  $('#sg-pals').appendChild(el);
  var mh = palMaxHp(c);
  return { c: c, el: el, slot: slot, name: name, me: !!me, mate: !me, x: 0, y: 0, tx: 0, ty: 0, face: 1, giant: !!c.giant, spd: palSpeedMult(c), hp: mh, maxhp: mh, ko: 0, cd: 0, act: 0, walkT: 0, hurt: 0,
    cr: '', bz: 0, gone: false, lastIn: Date.now(), evSeen: 0, hat: sgHatOn(c), pet: false, mv: null, goal: 0 };
}
function sgSpawnAt(slot){ if (sg.G && sg.G.spawn) return sg.G.spawn(slot); var I = sg.I, xs = [-60, 60, -150, 150]; return { x: I.x + (xs[slot] || 0), y: I.y + I.ry * 0.5 }; }
/* lv 1 = the normal game (one long wave), SURV_LV = survival; minigames on this engine (G.mg) have levels 1-3 */
function sgBegin(lv, coop){
  var G = sg.G;
  lv = lv === SURV_LV ? SURV_LV : G.mg ? clamp(+lv || 1, 1, 3) : 1;
  if (!coop && G.mg && (lv === SURV_LV ? !survOpen(G.mg) : !lvOpen(G.mg, lv))) return;
  if (!coop && sg.coop){ sg.coop = null; if (window.ppCoop && window.ppCoop.left) window.ppCoop.left(); }
  var why = coop ? '' : sgCanPlay(sg.area); if (why){ flash(why); return; }
  var mates = coop ? coop.mates : [];
  sg.surv = lv === SURV_LV ? { n: 1 } : null; sg.lv = lv;
  if (G.begin) G.begin(lv);
  if (G.layout) G.layout(1);
  $('#sg-pals').innerHTML = '';
  var me = sgMakePal(heroChar(), coop ? coop.slot : 0, '', true);
  sg.P = [me].concat(mates.map(function(m){ var p = sgMakePal(m.partner, m.slot, m.name, false); p.mi = m; return p; }));
  sg.P.forEach(function(p){ var s = sgSpawnAt(p.slot); p.x = p.tx = s.x; p.y = p.ty = s.y; p.pet = sgPetOn(p); });
  sg.hero = me; sg.mul = sgMulFor(sg.P.length);
  sg.rs = {}; sg.minHp = 1; sg.runPts = 0; sg.tp = 0; sg.tpSeen = 0; sg.lastXp = 0; sg.done = 0; sg.t = 0; sg.keys = {}; sg.fx = []; sg.mini = null; sgMiniUi();
  sg.cam = { x: me.x, y: me.y };
  sgPanel(''); sg.w = 0;
  sgWave(1);
  sgBanner(sg.surv ? 'Survival · Wave 1' : G.mg && G.layout ? CH_LAY[sg.chL].name : 'Reach the goal!', (coop ? 'With ' + coopNames(mates) + '. ' : '') + sg.G.goal, 3000);
}
/* how hard a wave is: k grows with the wave (and every survival wave), the goal grows with players */
function sgWaveK(w){
  if (sgMg()) return sg.surv ? 1.25 + 0.1 * (sg.surv.n - 1) : ([1, 1, 1.12, 1.25][sg.lv] || 1) * 1.1;
  return sg.surv ? 1 + 0.12 * (sg.surv.n - 1) : 1.18;      /* the one wave plays like the old middle wave */
}
function sgWave(w){
  var G = sg.G;
  sg.w = w; sg.k = sgWaveK(w); sg.hk = Math.min(1.8, 0.85 + 0.15 * sg.k);
  var host = !sg.coop || sg.coop.role === 'host';
  if (G.layout && G.layout(w)){ sg.mini = null; sgMiniUi(); sg.P.forEach(function(p){ var s0 = sgSpawnAt(p.slot); p.x = p.tx = s0.x; p.y = p.ty = s0.y; p.mv = null; p.goal = 0; }); if (sg.hero) sg.cam = { x: sg.hero.x, y: sg.hero.y }; }
  sg.H = [];
  if (host){
    sg.E = sg.E.filter(function(e){ return e.k !== 'mob' && e.k !== 'food'; });
    /* one long wave: about half of what the old 3 waves asked in total (it lasts SG_LONG x as long as one old wave) */
    var sum = G.need[0] + G.need[1] + G.need[2], base = Math.round(sum * 0.5);
    if (sg.surv) base = Math.round(sum * 0.5 * (1 + 0.06 * Math.max(0, sg.surv.n - 1)));
    if (G.needFor) base = G.needFor(w);
    sg.need = Math.round(base * sg.mul); sg.sc = 0; sg.tl = Math.round((G.waveT || SG_WAVE_T) * SG_LONG);
    if (sg.rs) sg.rs.wbad = 0;
    G.wave(w, sg.k);
  }
  sg.P.forEach(function(p){ if (!p.gone){ if (p.ko > 0){ p.ko = 0; } p.hp = p.maxhp; p.cr = ''; } });
  sg.phase = 'play';
  sgHud();
}
/* the wave's goal was reached: on every screen (the host sends it as an event) */
function sgWaveDone(o){
  var S = sg.surv;
  sg.done++;
  if (S && sgMg()){ sgMgWaveDone(); }
  else if (S){
    sg.runPts += SG_SURV_BONUS;
    var R = sgRec(sg.area);      /* survival: every (long) wave cleared is a win */
    R.w = (R.w || 0) + 1;
    S.n++;
    sgBanner('Wave cleared! +1 win', '+' + SG_SURV_BONUS + ' bonus points. Wave ' + S.n + ' is coming…', 2800);
  } else if (o.w >= SG_WAVES){
    sgBanner('Challenge complete!', '', 2400);
  } else sgBanner('Wave ' + o.w + ' cleared!', 'Wave ' + (o.w + 1) + ' is coming…', 2600);
  save();
}
function sgXpNow(pts){
  if (sgMg()) return chPay(pts || 0)[1];
  var A = AREAS[sg.area], lv = skillOf(A.skill).lv;
  return Math.round((pts || 0) * sgUnit(lv) / (sg.mul || 1) * (sgCapeOn() ? SG_CAPE_MUL : 1) * (1 + kdSetBonus(A.el)));      /* card collection: the element's set bonus */
}
/* pay the run's xp into the skill */
function sgPay(bonusK){
  if (sgMg()) return sgMgPay(bonusK);
  var pts = sg.runPts * (1 + (bonusK || 0)), xp = sgXpNow(pts), I = achI(), sk = 'sp_' + sg.area;
  if (sg.runPts > 0) I.st[sk] = (I.st[sk] || 0) + Math.round(sg.runPts);
  sg.runPts = 0;
  if (xp > 0) skillAdd(AREAS[sg.area].skill, xp);
  sg.lastXp += xp;
  return xp;
}
function sgEnd(won, why){
  if (sg.phase === 'end') return;
  if (sgMg()) return sgMgEnd(won, why);
  var S = sg.surv, A = AREAS[sg.area], C = sg.coop, R = sgRec(sg.area), nb = false, xp;
  sg.phase = 'end'; sg.mini = null; sgMiniUi();
  if (C){ if (C.role === 'host') C.endAt = Date.now(); else { sg.coop = null; if (window.ppCoop && window.ppCoop.left) window.ppCoop.left(); } }
  if (S){
    var waves = sg.done;
    if (waves > (R.b || 0)){ R.b = waves; nb = true; }
    xp = sgPay(0);
  } else {
    if (won){ R.w = (R.w || 0) + 1; R.won = 1; sg.done = SG_WAVES; var I0 = achI(); I0.st['sw_' + sg.area] = (I0.st['sw_' + sg.area] || 0) + 1; }
    xp = sgPay(won ? SG_WIN_BONUS : 0);
  }
  dmNote('sg_' + sg.area, 'wave', sg.done || 0);      /* daily missions: waves cleared, in either mode */
  achCheck({ g: 'sg_' + sg.area, won: !S && !!won, minHp: sg.minHp, rs: sg.rs || {} });
  sg.surv = null;
  save(); updateSkills();
  sgPanel('<h2>' + (S ? 'Run over' : won ? 'Challenge complete!' : 'Challenge over') + '</h2><p><span>' + esc(why || (won ? 'You cleared every wave.' : '')) + '</span>' + (S ? ' <span>Waves cleared: ' + sg.done + '.</span> <span>' + (nb ? 'New best!' : 'Best: ' + (R.b || 0) + ' waves.') + '</span>' : '') + '</p>' +
    '<div class="cn-stats"><div><b>+' + sg.lastXp.toLocaleString() + '</b><span>' + esc(skillLabel(A.skill)) + ' xp</span></div><div><b>' + sg.done + '</b><span>Waves</span></div><div><b>' + skillOf(A.skill).lv + '</b><span>Level</span></div></div>' + sgMenuHtml());
  sgHud();
}
function sgClaim(){ if (sg.surv && (sg.phase === 'play' || sg.phase === 'between')) sgEnd(false, sgMg() ? 'You stopped and claimed the pot.' : 'You stopped and claimed your xp.'); }
function sgClose(){
  sg.keys = {};
  if (!sg.open) return;
  if (sg.phase === 'play' || sg.phase === 'between' || sg.phase === 'ending'){ sgPay(0); if (sgMg()){ chRunStats(); if (sg.surv) sgMgPotPay(); sg.surv = null; } }
  sg.open = false; sg.mini = null; sgMiniUi();
  if (sg.coop){ sg.coop = null; if (window.ppCoop && window.ppCoop.left) window.ppCoop.left(); }
  cancelAnimationFrame(sg.raf);
  $('#sgame').hidden = true; $('#sg-pals').innerHTML = ''; $('.wrap').inert = false; document.body.style.overflow = '';
  sgPanel(''); save(); updateSkills(); updateHud();
  try { if (sg.back && sg.back.focus) sg.back.focus(); } catch (e) {}
}
function sgResize(){
  if (!sg.open) return;
  var W = window.innerWidth, H = window.innerHeight;
  sg.VW = W; sg.VH = H; sg.dpr = Math.min(2, window.devicePixelRatio || 1);
  sg.cv.width = Math.round(W * sg.dpr); sg.cv.height = Math.round(H * sg.dpr);
  sg.zk = Math.max(0.6, Math.min(W / 1240, H / 860));
}

/* ---------- panels and hud ---------- */
function sgPanel(html){ var p = $('#sg-panel'); p.hidden = !html; p.innerHTML = html || ''; p.scrollTop = 0; }
function sgBanner(t, sub, ms){
  var b = $('#sg-banner');
  b.innerHTML = esc(t) + (sub ? '<small>' + esc(sub) + '</small>' : '');
  b.classList.add('show'); clearTimeout(sgBanner.tm);
  sgBanner.tm = setTimeout(function(){ b.classList.remove('show'); }, ms || 1800);
}
function sgGearHtml(){
  var A = AREAS[sg.area], c = heroChar(), H = HATS['h_' + sg.area], P0 = PETS[sg.area], hatOn = sgHatOn(c), petNow = petOn(sg.area), capeNow = sgCapeOn();
  var row = function(on, name, eff, how){ return '<li class="' + (on ? 'on' : '') + '"><b>' + esc(name) + '</b> <span>' + esc(eff) + '</span>' + (on ? ' <i>✓ On</i>' : ' <small>' + esc(how) + '</small>') + '</li>'; };
  return '<p class="lvpick-t">Your ' + esc(skillLabel(A.skill)) + ' gear helps here:</p><ul class="sg-gear">' +
    row(hatOn, H ? H.name : 'Skill hat', 'You work 30% faster, and timing bars are easier.', hatOwned('h_' + sg.area) ? 'Wear it on this pal to use it.' : 'Found while skilling here.') +
    row(petNow, P0 ? P0.name : 'Skill pet', '1 in 4 jobs give a bonus point.', hasPet(sg.area) ? 'Make it the pet that follows you.' : 'Found while skilling here.') +
    row(capeNow, CAPES[A.skill] ? CAPES[A.skill].name : 'Skill cape', '+25% xp (the Max Cape works too).', capeOwned(A.skill) ? 'Wear it on this pal to use it.' : 'Get ' + skillLabel(A.skill) + ' to level 99.') + '</ul>';
}
function sgSurvBtn(){
  var R = sgRec(sg.area), g = 'sg_' + sg.area;
  if (!survOpen(g)){ var L0 = ACH_DEFS.filter(function(d){ return d.g === g; }), got = L0.filter(function(d){ return (state.island.ach || {})[d.id]; }).length;
    return '<div class="lvpick lvpick-s"><button class="btn lvb lvS" type="button" disabled><b>Survival (locked)</b><small>Finish every achievement here to unlock &middot; ' + got + '/' + L0.length + '</small></button></div>'; }
  return '<div class="lvpick lvpick-s"><button class="btn lvb lvS" type="button" data-action="sg-surv"><b>Survival</b><small>Endless waves, stop when you like &middot; best ' + (R.b || 0) + '</small></button></div>';
}
function sgCoopBox(){
  if (!window.ppCoop || !window.ppCoop.ready()) return '';
  return '<div class="coop-box"><p class="lvpick-t">Play with friends</p><p class="small">Invite up to 3 friends who have ' + esc(skillLabel(AREAS[sg.area].skill)) + ' level ' + SG_LV + '. More players means more to do and more danger. Everyone earns xp in their own ' + esc(skillLabel(AREAS[sg.area].skill)) + '.</p>' +
    '<div class="row"><button class="btn" type="button" data-action="coop-list">Invite friends</button></div><div id="coop-list"></div></div>';
}
function sgMenuHtml(){
  if (sgMg()) return sgMgMenu();
  var G = sg.G, R = sgRec(sg.area), A = AREAS[sg.area], lv = skillOf(A.skill).lv;
  return '<p class="sg-rate"><span>Each point gives ' + Math.round(sgUnit(lv) * (sgCapeOn() ? SG_CAPE_MUL : 1)) + ' ' + esc(skillLabel(A.skill)) + ' xp at your level.</span> </p>' + winsLine('sg_' + sg.area) +
    '<div class="lvpick lvpick-s"><button class="btn lvb lv1" type="button" data-action="sg-start"><b>Play</b><small>One long wave &middot; reach the goal before time runs out</small></button></div>' +
    sgSurvBtn() + '<div class="row"><button class="btn" type="button" data-action="sg-leave">Leave</button></div>' + sgCoopBox() + sgGearHtml() + achHtml('sg_' + sg.area);
}
function sgIntro(){
  var G = sg.G;
  sgPanel('<h2>' + esc(G.name) + '</h2><p>' + esc(G.intro) + '</p><p class="th-keys"><span>' + esc(G.how) + '</span> <span>Walk with WASD, the joystick or by tapping the ground. Press Space, tap something, or use the action button to work. Food that drops is the only way to heal.</span></p>' + sgMenuHtml());
}
function sgHud(){
  if (!sg.open) return;
  $('#sg-lvl').textContent = sg.surv ? 'Survival · Wave ' + sg.surv.n : (sgMg() ? 'Level ' + (sg.lv || 1) : 'Challenge');
  var tl = Math.max(0, Math.ceil(sg.tl || 0));
  $('#sg-time').textContent = Math.floor(tl / 60) + ':' + ('0' + tl % 60).slice(-2);
  $('#sg-time').classList.toggle('low', tl <= 10 && sg.phase === 'play');
  $('#sg-pts').textContent = (sg.sc || 0) + ' / ' + (sg.need || 0);
  var bar = $('#sg-bar'); if (bar) bar.style.width = Math.min(100, (sg.sc || 0) / Math.max(1, sg.need || 1) * 100).toFixed(1) + '%';
  $('#sg-xp').textContent = sgMg() ? chHudTxt() : '+' + sgXpNow(sg.runPts).toLocaleString();
  var cb = $('#sg-claim'); if (cb) cb.hidden = !sg.surv || sg.phase === 'end' || sg.phase === 'intro';
  if (sg.G.hud){ var h = sg.G.hud(), o = $('#sg-ord'); if (o.dataset.h !== h){ o.dataset.h = h; o.innerHTML = h; o.hidden = !h; } if (sg.G.hudBars) sg.G.hudBars(o); }
}
