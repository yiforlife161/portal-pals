
/* ---------- each frame ---------- */
function sgHostTick(dt){
  var G = sg.G, P = sgPlayers();
  P.forEach(function(p){
    if (p.mate) netStep(p, dt);
    if (p.ko > 0){
      if (!sg.coop || sg.P.length < 2) return;
      p.ko -= dt;
      if (p.ko <= 0){ p.ko = 0; p.hp = p.maxhp; var s = sgSpawnAt(p.slot); p.x = p.tx = s.x; p.y = p.ty = s.y; p.respawnN = (p.respawnN || 0) + 1; }
      return;
    }
    /* no healing over time: food is the only way to heal */
    sg.E.slice().forEach(function(e){
      if (e.k !== 'food' || e.a > 0 || Math.hypot(e.x - p.x, e.y - p.y) > 34) return;
      var F = DF_FOOD.filter(function(f){ return f.k === e.s; })[0] || DF_FOOD[0], amt = Math.round(p.maxhp * F.heal), got = Math.min(amt, p.maxhp - p.hp);
      p.hp = Math.min(p.maxhp, p.hp + amt); sgDel(e);
      sgFx({ k: 'txt', x: e.x, y: e.y - 40, t: 0.8, T: 0.8, s: got > 0 ? '+' + got + ' HP' : 'Full HP', c: '#2fbf6a' });
    });
  });
  sg.E.forEach(function(e){ if (e.k === 'food' && e.a > 0) e.a = Math.max(0, e.a - dt); });
  sg.E.slice().forEach(function(e){ if (e.k === 'mob') sgMobTick(e, dt); });
  for (var i = sg.H.length - 1; i >= 0; i--){
    var h = sg.H[i];
    h.t -= dt;
    if (h.t <= 0 && !h.hit){
      h.hit = 1; h.t = 0.3;
      P.forEach(function(p){ if (sgInHz(h, p.x, p.y)) sgHurt(p, h.dmg); });
      if (G.impact) G.impact(h);
      sgFx({ k: h.k === 'c' ? 'boom' : 'puff', small: 1, x: h.k === 'c' ? h.x : (h.x + h.x2) / 2, y: h.k === 'c' ? h.y : (h.y + h.y2) / 2, t: 0.45, T: 0.45, c: h.col });
    } else if (h.t <= 0) sg.H.splice(i, 1);
  }
  if (sg.phase === 'play'){
    G.tick(dt, sg.k);
    sg.tl -= dt;
    var alive = P.filter(function(p){ return !(p.ko > 0); });
    if (sg.sc >= sg.need){
      if (sg.rs && !sg.rs.wbad) sg.rs.cw = 1;
      if (!sg.surv && sg.w >= SG_WAVES){ sg.phase = 'ending'; sg.endT = 1.6; sg.won = true; sg.why = ''; }
      else { sg.phase = 'between'; sg.betT = 3.2; sgWaveDone({ w: sg.w }); }
    } else if (sg.tl <= 0){ sg.phase = 'ending'; sg.endT = 1.4; sg.won = false; sg.why = 'Time ran out on wave ' + (sg.surv ? sg.surv.n : sg.w) + '.'; sgBanner('Time is up!', '', 1500); }
    else if (!alive.length){ sg.phase = 'ending'; sg.endT = 1.4; sg.won = false; sg.why = sg.P.length > 1 ? 'Everyone was knocked out.' : 'You were knocked out.'; }
  }
}
function sgUpdate(dt){
  var me = sg.hero, C = sg.coop, G = sg.G;
  sg.t = (sg.t || 0) + dt;
  if (!me) return;
  var host = !C || C.role === 'host';
  if (sg.phase === 'ending'){ sg.endT -= dt; if (sg.endT <= 0) sgEnd(!!sg.won, sg.why); }
  if (sg.phase === 'between'){ sg.betT -= dt; if (sg.betT <= 0 && host) sgWave(sg.w + 1); }
  /* my pal: walking (keys, joystick or a tapped spot), or busy with a timing bar */
  if (sg.phase === 'play' && !(me.ko > 0)){
    var K = sg.keys, kx = (K.r ? 1 : 0) - (K.l ? 1 : 0), ky = (K.d ? 1 : 0) - (K.u ? 1 : 0), tx = null, ty = null;
    if (sg.mini && (kx || ky)) sgMiniStop(false, 'You moved away.');
    if (!sg.mini){
      if (kx || ky){ me.mv = null; me.goal = 0; var kl = Math.hypot(kx, ky); tx = me.x + kx / kl * 80; ty = me.y + ky / kl * 80; }
      else if (me.mv){ tx = me.mv.x; ty = me.mv.y; var wp = G.route ? G.route(me, me.mv) : null; if (wp){ tx = wp.x; ty = wp.y; } }
      if (tx !== null){
        var dx = tx - me.x, dy = ty - me.y, dd = Math.hypot(dx, dy), step = 260 * (me.spd || 1) * dt;
        if (dd > 3){ var m = Math.min(step, dd); if (sgMove(me, dx / dd * m, dy / dd * m)){ me.walkT = 0.08; if (Math.abs(dx) > 1) me.face = dx > 0 ? 1 : -1; } else if (me.mv && !wp){ me.mv = null; } }
        else if (me.mv && !wp) me.mv = null;
      }
      if (me.goal){
        var ge = sgById(me.goal);
        if (!ge){ me.goal = 0; me.mv = null; }
        else if (Math.hypot(ge.x - me.x, (ge.y - me.y) * 1.2) < SG_REACH * 0.9){ me.goal = 0; me.mv = null; sgAct(true, ge.id); }
      }
      if (K.atk) sgAct(false);
      else if (sg.tapHold && !me.goal) sgAct(false, sg.tapHold);      /* holding a tap/click on a thing keeps working on it */
    } else sgMiniTick(dt);
  } else if (sg.mini) sgMiniStop(false);
  if (G.local) G.local(dt);
  if (sg.phase === 'play' && me.maxhp) sg.minHp = Math.min(sg.minHp === undefined ? 1 : sg.minHp, me.hp / me.maxhp);
  sg.P.forEach(function(p){ p.cd = Math.max(0, p.cd - dt); p.act = Math.max(0, p.act - dt); p.walkT = Math.max(0, p.walkT - dt); p.hurt = Math.max(0, p.hurt - dt); });
  if (host){ if (sg.phase === 'play' || sg.phase === 'between' || sg.phase === 'ending') sgHostTick(dt); }
  else sgGuestTick(dt);
  if (C && C.role === 'host' && !C.endAt) sg.P.forEach(function(p){ if (p.mate && !p.gone && Date.now() - p.lastIn > 12000){ p.gone = true; p.cr = ''; p.el.classList.add('gone'); sgBanner(p.name + ' left', 'Keep going!', 1600); } });
  if (C && C.role === 'host' && C.endAt && Date.now() - C.endAt > 4000){ sg.coop = null; if (window.ppCoop && window.ppCoop.left) window.ppCoop.left(); }
  /* events every screen handles: points into my own run, cleared waves */
  for (var i = sg.fx.length - 1; i >= 0; i--){
    var f = sg.fx[i];
    f.t -= dt;
    if (f.t <= 0) sg.fx.splice(i, 1);
  }
  /* camera follows my pal */
  var I = sg.I, vw = sg.VW / sg.zk / 2, vh = sg.VH / sg.zk / 2;
  var bx0 = I.x - I.rx - 60, bx1 = I.x + I.rx + 60, by0 = I.y - I.ry - 140, by1 = I.y + I.ry + 120;
  var gx = clamp(me.x, bx0 + vw, bx1 - vw), gy = clamp(me.y - 30, by0 + vh, by1 - vh);
  if (vw * 2 > bx1 - bx0) gx = (bx0 + bx1) / 2; if (vh * 2 > by1 - by0) gy = (by0 + by1) / 2;
  sg.cam.x += (gx - sg.cam.x) * Math.min(1, dt * 6); sg.cam.y += (gy - sg.cam.y) * Math.min(1, dt * 6);
  if (Math.floor(sg.t * 4) !== sg.hudT){ sg.hudT = Math.floor(sg.t * 4); sgHud(); }
}
/* move my pal, sliding along the island's edge and around stations */
function sgMove(p, dx, dy){
  var nx = p.x + dx, ny = p.y + dy, moved = false;
  if (sgWalk(nx, ny)){ p.x = nx; p.y = ny; moved = true; }
  else if (sgWalk(nx, p.y)){ p.x = nx; moved = true; }
  else if (sgWalk(p.x, ny)){ p.y = ny; moved = true; }
  var G = sg.G;
  if (G.solid) sg.E.forEach(function(e){
    var r = G.solid(e); if (!r) return;
    var ex = p.x - e.x, ey = (p.y - e.y) * 1.6, d = Math.hypot(ex, ey);
    if (d < r && d > 0.01){ var px = e.x + ex / d * r, py = e.y + ey / d * r / 1.6; if (sgWalk(px, py)){ p.x = px; p.y = py; } }
  });
  return moved;
}
function sgLoop(ts){
  if (!sg.open) return;
  var dt = Math.min(0.05, (ts - sg.last) / 1000); sg.last = ts;
  if (sg.phase !== 'intro') sgUpdate(dt);
  sgDraw();
  sg.raf = requestAnimationFrame(sgLoop);
}

/* ---------- acting: work on the closest thing (hold to keep going) ---------- */
/* what the action does: with tid (a tapped or clicked thing) it works on exactly that thing, otherwise on what is
   closest (the action button and the keyboard) */
function sgPick(p, tid){
  var te = tid ? sgById(tid) : null;
  if (tid && !te) return null;
  if (te && te.k === 'mob') return Math.hypot(te.x - p.x, (te.y - p.y) * 1.2) < SG_REACH + 10 ? { t: 'mob', id: te.id } : null;
  if (!te){ var mob = sgNear(p, function(e){ return e.k === 'mob'; }, SG_REACH + 10); if (mob) return { t: 'mob', id: mob.id }; }
  sg.only = te ? te.id : 0;
  try { return sg.G.pick(p); } finally { sg.only = 0; }
}
function sgAct(first, tid){
  var me = sg.hero;
  if (!sg.open || sg.phase !== 'play' || !me || me.ko > 0) return;
  if (sg.mini){ if (first) sgMiniPress(); return; }
  if (me.cd > 0) return;
  var a = sgPick(me, tid);
  if (!a){
    if (first && !(sg.hintT > sg.t)){ sg.hintT = sg.t + 1.5; sgTxt(me.x, me.y - 120, sg.G.hint || 'Walk closer to something.', '#fff'); }
    return;
  }
  if (a.msg){ if (first || !(sg.hintT > sg.t)){ sg.hintT = sg.t + 1.2; sgTxt(me.x, me.y - 120, a.msg, '#ffe58a'); } return; }
  if (tid){ if (first) sg.tapT = a.t; else if (a.t !== sg.tapT) return; }      /* a held tap repeats the same kind of action only (chop, chop, chop — not put, take, put) */
  var e = sgById(a.id); if (e && Math.abs(e.x - me.x) > 4) me.face = e.x > me.x ? 1 : -1;
  me.cd = SG_CD * (me.hat ? SG_HAT_CD : 1); me.act = 0.22;
  if (a.mini){ sgMiniStart(a); return; }
  sgSend(a.t, a.id, a.v);
}
/* an action goes to the host (or straight in, when I am the host) */
function sgSend(t, id, v){
  var C = sg.coop, me = sg.hero;
  if (C && C.role === 'guest'){ C.evOut.push([++C.evN, t, id || 0, v === undefined ? 0 : v]); if (C.evOut.length > 12) C.evOut.shift(); return; }
  sgDo(me, t, id, v);
}
function sgDo(p, t, id, v){
  if (!p || p.ko > 0 || sg.phase !== 'play') return;
  p.act = 0.22;
  var e = id ? sgById(id) : null;
  if (t === 'mob'){ if (e && e.k === 'mob') sgHitMob(p, e); return; }
  sg.G.ev(p, t, e, v);
}

/* ---------- timing bars (fishing reel, forging): played on my own screen, the result goes to the host ---------- */
function sgMiniStart(a){
  var me = sg.hero;
  sg.mini = { k: a.mini, id: a.id, t: 0, o: a.o || {}, hold: false };
  me.bz = 1;
  if (sg.G.miniStart) sg.G.miniStart(sg.mini, me);
  if (a.t) sgSend(a.t, a.id, a.v);
  sgMiniUi();
}
function sgMiniStop(ok, why){
  var M = sg.mini; if (!M) return;
  sg.mini = null; if (sg.hero) sg.hero.bz = 0;
  if (sg.G.miniEnd) sg.G.miniEnd(M, ok, why);
  sgMiniUi();
}
function sgMiniPress(){ var M = sg.mini; if (M && sg.G.miniPress) sg.G.miniPress(M); }
function sgMiniTick(dt){
  var M = sg.mini; if (!M) return;
  M.t += dt;
  M.hold = !!(sg.keys.atk || (tc.mode === 'sg' && tc.hold) || sg.ptrHold);
  sg.G.miniTick(M, dt);
  if (sg.mini) sg.G.miniDraw(M, $('#sg-mini'));
}
function sgMiniUi(){
  var el = $('#sg-mini'); if (!el) return;
  if (!sg.mini){ el.hidden = true; el.innerHTML = ''; el.dataset.k = ''; return; }
  el.hidden = false;
  if (el.dataset.k !== sg.mini.k){ el.dataset.k = sg.mini.k; el.innerHTML = sg.G.miniHtml(sg.mini); }
  sg.G.miniDraw(sg.mini, el);
}
