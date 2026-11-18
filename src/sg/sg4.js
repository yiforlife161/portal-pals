
/* ---------- drawing ---------- */
function sgBarDraw(g, x, y, frac, col, w){
  w = w || 60;
  g.fillStyle = 'rgba(20,14,36,.75)'; g.beginPath(); g.roundRect ? g.roundRect(x - w / 2 - 3, y - 6, w + 6, 12, 6) : g.rect(x - w / 2 - 3, y - 6, w + 6, 12); g.fill();
  g.fillStyle = col || '#7affc4'; g.fillRect(x - w / 2, y - 3, w * clamp(frac, 0, 1), 6);
}
function sgDrawHz(g, h){
  var u = h.hit ? 1 : clamp(1 - h.t / (h.T || 1), 0, 1), a = h.hit ? 0.5 * (h.t / 0.3) : 0.18 + 0.32 * u;
  g.save();
  if (h.k === 'c'){
    g.fillStyle = 'rgba(255,60,50,' + a + ')'; g.beginPath(); g.ellipse(h.x, h.y, h.r, h.r / 1.25, 0, 0, 7); g.fill();
    if (!h.hit){ g.fillStyle = 'rgba(255,60,50,.35)'; g.beginPath(); g.ellipse(h.x, h.y, h.r * u, h.r * u / 1.25, 0, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(255,240,240,.85)'; g.lineWidth = 3; g.setLineDash([10, 8]); g.beginPath(); g.ellipse(h.x, h.y, h.r, h.r / 1.25, 0, 0, 7); g.stroke();
    if (!h.hit && h.s === 'rock'){      /* the rock's shadow grows as it falls */
      g.setLineDash([]); g.fillStyle = 'rgba(30,20,40,' + (0.2 + 0.4 * u) + ')'; g.beginPath(); g.ellipse(h.x, h.y, 14 + 20 * u, 8 + 10 * u, 0, 0, 7); g.fill();
      var ry = h.y - 420 * (1 - u); g.fillStyle = '#7a7f8e'; g.strokeStyle = '#2a2436'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(h.x - 22, ry); g.lineTo(h.x - 8, ry - 22); g.lineTo(h.x + 18, ry - 16); g.lineTo(h.x + 24, ry + 6); g.lineTo(h.x, ry + 16); g.closePath(); g.fill(); g.stroke();
    }
  } else {
    var ang = Math.atan2(h.y2 - h.y, h.x2 - h.x), len = Math.hypot(h.x2 - h.x, h.y2 - h.y);
    g.translate(h.x, h.y); g.rotate(ang);
    g.fillStyle = 'rgba(255,60,50,' + a + ')'; g.fillRect(0, -h.r, len, h.r * 2);
    if (!h.hit){ g.fillStyle = 'rgba(255,60,50,.35)'; g.fillRect(0, -h.r, len * u, h.r * 2); }
    g.strokeStyle = 'rgba(255,240,240,.85)'; g.lineWidth = 3; g.setLineDash([10, 8]); g.strokeRect(0, -h.r, len, h.r * 2);
    g.setLineDash([]); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 4;
    for (var q = 40; q < len; q += 70){ g.beginPath(); g.moveTo(q, -10); g.lineTo(q + 14, 0); g.lineTo(q, 10); g.stroke(); }
  }
  g.restore();
}
function sgDrawMob(g, e){
  var T = SG_MOB[e.s] || SG_MOB.crab, bob = Math.sin(sg.t * 8 + e.id) * 2;
  if (e.c > 0){
    var u = clamp(1 - e.c / T.wind, 0, 1);
    g.fillStyle = 'rgba(255,60,50,' + (0.15 + 0.3 * u) + ')'; g.beginPath(); g.ellipse(e.x, e.y, T.r, T.r / 1.25, 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,240,240,.8)'; g.lineWidth = 2.5; g.setLineDash([8, 7]); g.beginPath(); g.ellipse(e.x, e.y, T.r, T.r / 1.25, 0, 0, 7); g.stroke(); g.setLineDash([]);
  }
  if (e.hit > 0){ g.save(); g.globalAlpha = 0.6; }
  sgPic(g, 'mob' + e.s, SG_ART[e.s], e.x, e.y + 4 + bob, e.s === 'skel' ? 74 : 70, e.b < 0);
  if (e.hit > 0) g.restore();
  sgBarDraw(g, e.x, e.y - (e.s === 'skel' ? 98 : 74), e.a / T.hp, '#ff6a5a', 46);
}
function sgDraw(){
  var g = sg.g, W = sg.VW, H = sg.VH, G = sg.G, I = sg.I, i;
  if (!g || !I) return;
  g.setTransform(sg.dpr, 0, 0, sg.dpr, 0, 0);
  var sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, G.sky[0]); sky.addColorStop(1, G.sky[1]);
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = G.cloud || 'rgba(255,255,255,.4)';
  for (i = 0; i < 6; i++){ var cx0 = ((i * 397 + sg.t * 10 - sg.cam.x * 0.2) % (W + 400) + W + 400) % (W + 400) - 200, cy0 = 50 + (i * 151) % Math.max(120, H - 140);
    g.beginPath(); g.ellipse(cx0, cy0, 90, 24, 0, 0, 7); g.ellipse(cx0 + 50, cy0 - 12, 60, 20, 0, 0, 7); g.fill(); }
  g.save();
  g.translate(W / 2 - sg.cam.x * sg.zk, H / 2 - sg.cam.y * sg.zk); g.scale(sg.zk, sg.zk);
  var c = sgIslCanvas(), o = I.co; g.drawImage(c, I.x - o.x, I.y - o.y, o.w, o.h);
  if (G.under) G.under(g);
  sg.H.forEach(function(h){ if (h.k === 'l' || h.s !== 'rock') sgDrawHz(g, h); });
  var list = [];
  (sg.decor || []).forEach(function(d){ list.push({ y: d.y, d: function(){ sgPic(g, 'dec' + d.k + (d.s || 0), d.m, d.x, d.y, d.w, d.f); } }); });
  sg.E.forEach(function(e){
    if (e.k === 'ord') return;
    if (e.k === 'food'){ list.push({ y: e.y, d: function(){ var kf = df.food, kt = df.t; df.food = [{ k: e.s, x: e.x, y: e.y, ph: e.id, drop: e.a || 0 }]; df.t = sg.t; try { dfDrawFood(g); } finally { df.food = kf; df.t = kt; } } }); return; }
    if (e.k === 'mob'){ list.push({ y: e.y, d: function(){ sgDrawMob(g, e); } }); return; }
    list.push({ y: e.y + (G.zOff ? G.zOff(e) : 0), d: function(){ G.draw(g, e); } });
  });
  list.sort(function(a, b){ return a.y - b.y; }).forEach(function(q){ q.d(); });
  sg.H.forEach(function(h){ if (h.k === 'c' && h.s === 'rock') sgDrawHz(g, h); });
  if (G.over) G.over(g);
  var me = sg.hero;
  if (me && me.mv){ g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.ellipse(me.mv.x, me.mv.y, 12 + Math.sin(sg.t * 8) * 2, 6, 0, 0, 7); g.stroke(); }
  /* what my action button would work on now */
  if (me && sg.phase === 'play' && !(me.ko > 0) && !sg.mini){
    var ge = me.goal ? sgById(me.goal) : null, hv = sg.hov && !ge ? sgById(sg.hov) : null;
    if (ge || hv){      /* the thing I tapped (walking there) or the thing under the mouse: a solid yellow ring */
      var re = ge || hv; g.strokeStyle = ge ? '#ffd23e' : 'rgba(255,240,170,.85)'; g.lineWidth = 3.5; g.beginPath(); g.ellipse(re.x, re.y + 2, 46, 17, 0, 0, 7); g.stroke();
    }
    var a = ge ? null : sgPick(me), te = a && !a.msg ? sgById(a.id) : null;
    if (te && te !== hv){ g.strokeStyle = 'rgba(255,255,255,' + (0.55 + 0.3 * Math.sin(sg.t * 6)) + ')'; g.lineWidth = 3; g.setLineDash([7, 6]); g.beginPath(); g.ellipse(te.x, te.y + 2, 42, 15, 0, 0, 7); g.stroke(); g.setLineDash([]); }
  }
  for (i = 0; i < sg.fx.length; i++){
    var f = sg.fx[i], u = 1 - f.t / f.T;
    g.globalAlpha = Math.max(0, Math.min(1, f.t / f.T * 2));
    if (f.k === 'ring'){ g.strokeStyle = f.c || '#fff'; g.lineWidth = 4; g.beginPath(); g.ellipse(f.x, f.y, 14 + u * 50, 7 + u * 25, 0, 0, 7); g.stroke(); }
    else if (f.k === 'poof'){ g.fillStyle = f.c || '#fff'; for (var q = 0; q < 6; q++){ var an = q / 6 * 6.28; g.beginPath(); g.arc(f.x + Math.cos(an) * u * 36, f.y + Math.sin(an) * u * 20, 8 * (1 - u) + 2, 0, 7); g.fill(); } }
    else if (f.k === 'spark'){ g.fillStyle = f.c || '#ffd23e'; for (q = 0; q < 7; q++){ an = q / 7 * 6.28 + f.x; g.beginPath(); g.arc(f.x + Math.cos(an) * u * 44, f.y + Math.sin(an) * u * 30 - u * 10, 4 * (1 - u) + 1.5, 0, 7); g.fill(); } }
    else if (f.k === 'puff'){ g.globalAlpha = 0.6 * (1 - u); g.fillStyle = f.c || 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(f.x, f.y - 10, 16 + u * 30, 0, 7); g.fill(); }
    else if (f.k === 'boom'){ g.fillStyle = 'rgba(255,170,60,' + (1 - u) + ')'; g.beginPath(); g.arc(f.x, f.y - 8, 18 * (0.4 + u * 1.6), 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,' + (1 - u) + ')'; g.lineWidth = 3; g.beginPath(); g.arc(f.x, f.y - 8, 24 * (0.4 + u * 1.6), 0, 7); g.stroke(); }
    else if (f.k === 'txt' || f.k === 'num' || f.k === 'pts'){
      g.font = '900 ' + (f.k === 'num' ? 22 : 26) + 'px system-ui, sans-serif'; g.textAlign = 'center'; g.lineWidth = 6; g.strokeStyle = 'rgba(30,20,50,.85)';
      g.strokeText(f.s, f.x, f.y - u * 40); g.fillStyle = f.c || '#fff'; g.fillText(f.s, f.x, f.y - u * 40);
    }
    g.globalAlpha = 1;
  }
  g.restore();
  /* the pals are html over the canvas */
  var ps = 62 * sg.zk * 1.1;
  sg.P.forEach(function(p){
    var px = W / 2 + (p.x - sg.cam.x) * sg.zk, py = H / 2 + (p.y - sg.cam.y) * sg.zk;
    p.el.style.width = ps + 'px';
    p.el.style.transform = 'translate(' + (px - ps / 2).toFixed(1) + 'px,' + (py - ps * 0.86).toFixed(1) + 'px)';
    p.el.style.setProperty('--f', p.face || 1);
    p.el.classList.toggle('walking', p.walkT > 0); p.el.classList.toggle('ko', p.ko > 0); p.el.classList.toggle('hurt', p.hurt > 0);
    p.el.classList.toggle('atk', p.act > 0 && p.c.style !== 'ranged'); p.el.classList.toggle('zap', p.act > 0 && p.c.style === 'ranged');
    var hb = p.el.querySelector('.dfp-hp i'); if (hb) hb.style.width = Math.max(0, p.hp / p.maxhp * 100).toFixed(1) + '%';
    var cel = p.el.querySelector('.qcarry'), ck = p.cr || '';
    if (cel && cel.dataset.k !== ck){ cel.dataset.k = ck; cel.hidden = !ck; cel.innerHTML = ck ? (G.carrySvg ? G.carrySvg(ck) : sgArtSvg(G.carryArt ? G.carryArt(ck) : ck)) : ''; }
  });
  var pe = petCompanion($('#sg-pals'), sg.area, 'mgpet');
  if (pe && me){
    var tx = me.x - (me.face || 1) * 40, ty = me.y + 8;
    if (!sg.petPos || Math.hypot(tx - sg.petPos.x, ty - sg.petPos.y) > 400) sg.petPos = { x: tx, y: ty };
    sg.petPos.x += (tx - sg.petPos.x) * 0.1; sg.petPos.y += (ty - sg.petPos.y) * 0.1;
    var pw = ps * 0.6, ppx = W / 2 + (sg.petPos.x - sg.cam.x) * sg.zk, ppy = H / 2 + (sg.petPos.y - sg.cam.y) * sg.zk;
    pe.style.width = pw + 'px';
    if (tx > sg.petPos.x + 2) pe.dataset.dir = 1; else if (tx < sg.petPos.x - 2) pe.dataset.dir = -1;
    pe.style.transform = 'translate(' + (ppx - pw / 2).toFixed(1) + 'px,' + (ppy - pw * 0.9).toFixed(1) + 'px) scaleX(' + petFlip(pe.dataset.k, +(pe.dataset.dir || 1)) + ')';
    pe.classList.toggle('walk', Math.hypot(tx - sg.petPos.x, ty - sg.petPos.y) > 6);
  }
  sg.P.forEach(function(p){
    if (!p.mate || !p.mi) return;
    var tk = p.gone ? '' : partnerPet(p.mi, sg.area), te = petNode($('#sg-pals'), tk, 'mgpet matepet mp' + p.slot);
    if (!te) return;
    p.pet2 = p.pet2 || {};
    var mp = petFollow(te, p.pet2, p.x - (p.face || 1) * 40, p.y + 8), mw = ps * 0.6, mpx = W / 2 + (mp.x - sg.cam.x) * sg.zk, mpy = H / 2 + (mp.y - sg.cam.y) * sg.zk;
    te.style.width = mw + 'px';
    te.style.transform = 'translate(' + (mpx - mw / 2).toFixed(1) + 'px,' + (mpy - mw * 0.9).toFixed(1) + 'px) scaleX(' + petFlip(te.dataset.k, +(te.dataset.dir || 1)) + ')';
  });
}

/* ---------- co-op: the host's picture, a guest's input (md 'sg', the game's area as am, lv 1 or SURV_LV) ---------- */
function sgCoopStart(o){
  if (cn.open || df.open || th.open || qu.open || ss.open){ flash('Finish your minigame first.'); return false; }
  if (VISIT) window.ppGame.goHome();
  if (SKP.coop) skpLeave('');
  var area = SG_GAMES[o.am] ? o.am : '';
  if (!area) return false;
  if (o.role !== 'host'){ var why = sgCanPlay(area); if (why){ flash(why); return false; } }
  var mates = coopMates(o); if (!mates.length) return false;
  if (sg.open && sg.area !== area) sgClose();
  if (!sg.open) sgOpen(area);
  if (!sg.open) return false;
  sg.coop = { role: o.role, slot: o.role === 'host' ? 0 : (+o.slot || 1), mates: mates, lastIn: Date.now(), evOut: [], evN: 0, fxOut: [] };
  sgBegin(+o.lv === SURV_LV ? SURV_LV : SG_GAMES[area].mg ? clamp(+o.lv || 1, 1, 3) : 1, sg.coop);
  return true;
}
function sgRow(e){ var r = [e.id, e.k, coopNum(e.x), coopNum(e.y), coopNum(e.a || 0), coopNum(e.b || 0), coopNum(e.c || 0), coopNum(e.d || 0)]; if (e.s) r.push(e.s); return r; }
function sgSnap(){
  var C = sg.coop; if (!C || C.role !== 'host') return null;
  /* data saver, like the quest: things that have not changed for 0.4 s are left out; the full list goes every 10th picture
     and for 0.4 s after something appears or disappears */
  var now = Date.now(), ids = sg.E.map(function(e){ return e.id; }).join(',');
  C.snN = (C.snN || 0) + 1; C.esig = C.esig || {}; C.echg = C.echg || {};
  if (ids !== C.eids){ C.eids = ids; C.fullTo = now + 400; }
  var full = C.snN % 10 === 1 || now < (C.fullTo || 0);
  var rows = sg.E.map(function(e){ var r = sgRow(e), sgn = r.join(','); if (C.esig[e.id] !== sgn){ C.esig[e.id] = sgn; C.echg[e.id] = now; } return r; });
  return { sg: 1, t: now, ph: sg.phase, w: sg.w, sn: sg.surv ? sg.surv.n : 0, sc: sg.sc, need: sg.need, tp: sg.tp || 0, rs: sg.rs || {}, tl: coopNum(sg.tl), Ef: full ? 1 : 0,
    P: sg.P.map(function(p){ return [p.slot, coopNum(p.x), coopNum(p.y), p.face, Math.round(p.hp), Math.round(p.maxhp), p.ko > 0 ? coopNum(p.ko) : 0, p.act > 0 ? 1 : 0, p.walkT > 0 ? 1 : 0, p.cr || '', p.gone ? 1 : 0, p.respawnN || 0, p.bz ? 1 : 0]; }),
    E: full ? rows : rows.filter(function(r){ return now - (C.echg[r[0]] || 0) < 400; }),
    H: sg.H.map(function(h){ return [h.id, h.k, coopNum(h.x), coopNum(h.y), coopNum(h.x2 || 0), coopNum(h.y2 || 0), h.r, coopNum(h.t), h.T, h.hit, h.s || '']; }),
    fx: C.fxOut.splice(0, 40), end: sg.phase === 'ending' || sg.phase === 'end' ? { won: !!sg.won, why: sg.why || '' } : null };
}
function sgOut(){
  var C = sg.coop, h = sg.hero; if (!C || C.role !== 'guest' || !h) return null;
  return { sg: 1, t: Date.now(), x: coopNum(h.x), y: coopNum(h.y), f: h.face, w: h.walkT > 0 ? 1 : 0, b: h.bz ? 1 : 0, ev: C.evOut.slice() };
}
function sgIn(g, slot){
  var C = sg.coop, p = sgBySlot(slot); if (!C || C.role !== 'host' || !p || p.gone || !g) return;
  p.lastIn = Date.now();
  if (!(p.ko > 0)){ netIn(p, g.t, +g.x || p.tx, +g.y || p.ty); p.face = g.f === -1 ? -1 : 1; p.walkT = g.w ? 0.12 : 0; }
  p.bz = g.b ? 1 : 0;
  (g.ev || []).forEach(function(a){
    if (!(a[0] > p.evSeen)) return;
    p.evSeen = a[0];
    if (p.ko > 0 || sg.phase !== 'play') return;
    if (Math.abs((p.tx || p.x) - p.x) + Math.abs((p.ty || p.y) - p.y) < 200){ p.x = p.tx; p.y = p.ty; }      /* act from where the friend really is */
    sgDo(p, String(a[1]), +a[2] || 0, a[3]);
  });
}
function sgApply(S){
  var C = sg.coop; if (!C || C.role !== 'guest' || !S) return;
  C.lastIn = Date.now();
  if (sg.phase === 'end') return;
  if (S.rs) sg.rs = S.rs;
  if (S.tp > (sg.tpSeen || 0)){ sg.runPts += S.tp - (sg.tpSeen || 0); sg.tpSeen = S.tp; }      /* the team's points, counted from the running total */
  if ((S.ph === 'between' && sg.phase === 'play') || (S.w > sg.w && sg.phase === 'play')){ sg.phase = 'between'; sgWaveDone({ w: sg.w }); }
  if (S.w > sg.w && S.ph === 'play') sgWave(S.w);
  sg.sc = S.sc; sg.need = S.need; sg.tl = S.tl;
  var old = {}; sg.E.forEach(function(e){ old[e.id] = e; });
  var rowE = function(a){
    var e = old[a[0]] || { id: a[0], x: a[2], y: a[3] };
    e.k = a[1]; e.a = a[4]; e.b = a[5]; e.c = a[6]; e.d = a[7]; e.s = a[8] || '';
    if (e.k === 'mob' || e.k === 'rain'){ e.tx = a[2]; e.ty = a[3]; if (Math.hypot(e.x - a[2], e.y - a[3]) > 200){ e.x = a[2]; e.y = a[3]; } }
    else { e.x = a[2]; e.y = a[3]; }
    return e;
  };
  if (S.Ef || S.Ef === undefined) sg.E = (S.E || []).map(rowE);      /* the full list */
  else { var seen = {}; (S.E || []).forEach(function(a){ seen[a[0]] = rowE(a); }); sg.E = sg.E.map(function(e){ return seen[e.id] || e; }); Object.keys(seen).forEach(function(id){ if (!old[id]) sg.E.push(seen[id]); }); }      /* only what changed */
  var oldH = {}; sg.H.forEach(function(h){ oldH[h.id] = h; });
  sg.H = (S.H || []).map(function(a){ var h = oldH[a[0]] || {}; h.id = a[0]; h.k = a[1]; h.x = a[2]; h.y = a[3]; h.x2 = a[4]; h.y2 = a[5]; h.r = a[6]; h.t = a[7]; h.T = a[8]; h.hit = a[9]; h.s = a[10] || ''; return h; });
  var me = sg.hero;
  (S.P || []).forEach(function(a){
    if (a[0] === C.slot){
      var wasKo = me.ko > 0; me.hp = a[4]; me.maxhp = a[5] || me.maxhp; me.ko = a[6]; me.cr = a[9] || '';
      if (me.ko > 0 && !wasKo){ me.mv = null; if (sg.mini) sgMiniStop(false); }
      if ((a[11] || 0) > (me.respawnN || 0)){ me.respawnN = a[11]; var s = sgSpawnAt(me.slot); me.x = s.x; me.y = s.y; me.mv = null; }
      return;
    }
    var p = sgBySlot(a[0]); if (!p) return;
    netIn(p, S.t, a[1], a[2]); p.face = a[3]; p.hp = a[4]; p.maxhp = a[5] || p.maxhp; p.ko = a[6]; if (a[7]) p.act = 0.22; p.walkT = a[8] ? 0.12 : 0; p.cr = a[9] || ''; p.bz = a[12] ? 1 : 0;
    if (a[10] && !p.gone){ p.gone = true; p.el.classList.add('gone'); }
  });
  (S.fx || []).forEach(function(o){ sg.fx.push(o); });
  if (S.end && sg.phase !== 'end' && sg.phase !== 'ending'){ sg.won = !!S.end.won; sg.why = S.end.why || (sg.won ? '' : 'The challenge was stopped.'); sg.phase = 'ending'; sg.endT = 1.4; }
}
function sgGuestTick(dt){
  var C = sg.coop, k = Math.min(1, dt * 12);
  if (!C) return;
  if (Date.now() - C.lastIn > 9000 && (sg.phase === 'play' || sg.phase === 'between')){ sgEnd(false, 'The connection to your friend was lost.'); return; }
  sg.E.forEach(function(e){ if (e.tx !== undefined){ e.x += (e.tx - e.x) * k; e.y += (e.ty - e.y) * k; } if (e.k === 'food' && e.a > 0) e.a = Math.max(0, e.a - dt); });
  sg.H.forEach(function(h){ if (h.t > 0) h.t = Math.max(0, h.t - dt); });
  sg.P.forEach(function(p){ if (p.mate) netStep(p, dt); });
  if (sg.phase === 'play') sg.tl = Math.max(0, sg.tl - dt);
  if (sg.G.guestTick) sg.G.guestTick(dt);
}

/* ---------- input ---------- */
/* the thing drawn under a tap/click: inside its picture first (nearest centre wins), else the nearest one close by */
function sgHit(p){
  var best = null, bd = 1e9, near = null, nd = 64;
  sg.E.forEach(function(e){
    if (e.k === 'food' || e.k === 'ord' || e.k === 'bridge') return;
    var dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy + 30);
    if (Math.abs(dx) < 54 && dy > -100 && dy < 40){ if (d < bd){ bd = d; best = e; } }
    else if (d < nd){ nd = d; near = e; }
  });
  return best || near;
}
/* where to stand to use it: the free side closest to me */
function sgApproach(me, e){
  var G = sg.G, c = [[-58, 8], [58, 8], [0, 54], [0, -46], [-46, 40], [46, 40]].map(function(o){ return { x: e.x + o[0], y: e.y + o[1] }; }).filter(function(q){
    if (!sgWalk(q.x, q.y)) return false;
    return !sg.E.some(function(o){ var r = o !== e && G.solid ? G.solid(o) : 0; return r && Math.hypot(o.x - q.x, (o.y - q.y) * 1.6) < r + 16; });
  });
  c.sort(function(a, b){ return Math.hypot(a.x - me.x, a.y - me.y) - Math.hypot(b.x - me.x, b.y - me.y); });
  return c[0] || { x: e.x + (me.x < e.x ? -50 : 50), y: e.y + 10 };
}
function sgToWorld(cx, cy){ var r = sg.cv.getBoundingClientRect(); return { x: sg.cam.x + (cx - r.left - sg.VW / 2) / sg.zk, y: sg.cam.y + (cy - r.top - sg.VH / 2) / sg.zk }; }
(function(){
  var cv = $('#sg-canvas'); if (!cv) return;
  cv.addEventListener('pointerdown', function(ev){
    if (!sg.open || sg.phase !== 'play') return;
    ev.preventDefault();
    var me = sg.hero; if (!me || me.ko > 0) return;
    if (sg.mini){ sg.ptrHold = true; sgMiniPress(); return; }
    var p = sgToWorld(ev.clientX, ev.clientY), best = sgHit(p);
    if (best && ev.button !== 2){      /* a tap or click works on exactly what was tapped: walk up to it, then act on it */
      sg.tapHold = best.id;
      if (Math.hypot(best.x - me.x, (best.y - me.y) * 1.2) < SG_REACH * 0.9){ me.mv = null; me.goal = 0; sgAct(true, best.id); }
      else { me.goal = best.id; me.mv = sgApproach(me, best); }
      return;
    }
    me.goal = 0; me.mv = { x: p.x, y: p.y + 10 };
  });
  cv.addEventListener('pointermove', function(ev){      /* the mouse shows what a click would use */
    if (!sg.open || ev.pointerType !== 'mouse') return;
    var h = sg.phase === 'play' ? sgHit(sgToWorld(ev.clientX, ev.clientY)) : null;
    sg.hov = h ? h.id : 0; cv.style.cursor = h ? 'pointer' : '';
  });
  var up = function(){ sg.ptrHold = false; sg.tapHold = 0; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); cv.addEventListener('pointerleave', up);
  cv.addEventListener('contextmenu', function(ev){ ev.preventDefault(); });
  window.addEventListener('resize', sgResize);
  var KM = { w: 'u', s: 'd', a: 'l', d: 'r', arrowup: 'u', arrowdown: 'd', arrowleft: 'l', arrowright: 'r', ' ': 'atk', j: 'atk', e: 'atk' };
  document.addEventListener('keydown', function(ev){
    if (!sg.open) return;
    if (ev.key === 'Escape'){ ev.preventDefault(); if (sg.mini) sgMiniStop(false, 'Stopped.'); else sgClose(); return; }
    if (ev.target && /INPUT|TEXTAREA/.test(ev.target.tagName)) return;
    var k = KM[(ev.key || '').toLowerCase()]; if (!k) return;
    ev.preventDefault();
    if (k === 'atk' && !sg.keys.atk){ sg.keys.atk = true; sgAct(true); return; }
    sg.keys[k] = true;
  });
  document.addEventListener('keyup', function(ev){ var k = KM[(ev.key || '').toLowerCase()]; if (k) sg.keys[k] = false; });
  window.addEventListener('blur', function(){ sg.keys = {}; sg.ptrHold = false; sg.tapHold = 0; });
})();
