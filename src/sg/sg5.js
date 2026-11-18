
/* ---------- the 8 games ---------- */
function sgRing(R, n, k0, k1, keys, sz, sMin){      /* decorations around the island's rim, in front and behind */
  var out = [];
  for (var i = 0; i < n; i++){
    var a = (i + R() * 0.6) / n * 6.283, r = k0 + R() * (k1 - k0), x = 600 + Math.cos(a) * 560 * r, y = 430 + Math.sin(a) * 340 * r;
    if (Math.abs(Math.cos(a)) < 0.35 && Math.sin(a) > 0) continue;      /* keep the front middle clear */
    var k = keys[Math.floor(R() * keys.length)];
    out.push({ k: k, s: 1, m: sgItem(k, 1), x: x, y: y, w: (sz || 90) * (sMin || 0.85 + R() * 0.3), f: R() < 0.5 });
  }
  return out;
}
var SG_ING = { b: 'bone', m: 'shroom', h: 'herb', c: 'crys' }, SG_ING_NAME = { b: 'Bone dust', m: 'Mushroom', h: 'Herb', c: 'Crystal' };
function sgIcons(str, sz){ return str.split('').map(function(ch){ return '<span class="sg-ic" style="width:' + (sz || 34) + 'px">' + sgArtSvg(SG_ING[ch]) + '</span>'; }).join(''); }
function sgRate(base){ return base / Math.max(0.6, sg.k || 1) / Math.sqrt(sg.mul || 1); }
function sgRockAt(x, y, T){ sgHz({ k: 'c', x: x, y: y, r: 62, T: T || 1.3, dmg: 0.12, s: 'rock' }); }
var SG_LAKE = { x: 600, y: 410, rx: 300, ry: 150 };
function sgLakeD(x, y){ return Math.pow((x - SG_LAKE.x) / SG_LAKE.rx, 2) + Math.pow((y - SG_LAKE.y) / SG_LAKE.ry, 2); }

var SG_GAMES = {
  /* ===== Mining: Cave Collapse ===== */
  mine: { name: 'Cave Collapse', verb: 'Strike', hint: 'Walk up to a glowing vein.',
    intro: 'The cave is caving in! Ore veins glint in the rock for a few seconds before they crumble. Mine as many as you can while rocks rain down from the ceiling.',
    how: 'Stand next to a vein and keep pressing the action button. Blue gem veins take longer but are worth more. Red circles are falling rocks: get out of them.',
    goal: 'Mine the veins before they crumble. Dodge the falling rocks!',
    land: { rim: '#4a4456', top: '#8a8496', bot: '#5e5868', spot: ['rgba(30,20,50,.3)', 'rgba(220,210,240,.15)'] }, sky: ['#1a1430', '#3e3456'], cloud: 'rgba(140,120,190,.12)',
    need: [28, 33, 38],
    decor: function(R){ return sgRing(R, 12, 0.8, 0.93, ['rock', 'crystal', 'rock', 'minecart', 'lamp'], 80); },
    wave: function(w){ sg.st = { spawn: 0, rock: 2.2, cave: 12 }; sg.E = sg.E.filter(function(e){ return e.k !== 'vein'; }); },
    tick: function(dt, k){
      var S = sg.st, veins = sgAll('vein'), max = Math.round((4 + sg.w * 0.5) * Math.sqrt(sg.mul));
      veins.forEach(function(v){ v.c -= dt; if (v.c <= 0){ sgDel(v); sgFx({ k: 'poof', x: v.x, y: v.y - 20, t: 0.5, T: 0.5, c: 'rgba(160,150,180,.9)' }); sgFx({ k: 'txt', x: v.x, y: v.y - 90, t: 0.9, T: 0.9, s: 'Crumbled', c: '#c9c2d8' }); } });
      if ((S.spawn -= dt) <= 0 && veins.length < max){
        S.spawn = 1.1 / Math.sqrt(sg.mul);
        var gem = Math.random() < 0.16, at = sgSpot(120, 80);
        sgNew('vein', at.x, at.y, { s: gem ? 'gem' : 'ore', b: gem ? 9 : 6, c: gem ? 11 : 16, d: gem ? 11 : 16 });
      }
      if ((S.rock -= dt) <= 0){
        S.rock = rand(1.5, 2.5) * sgRate(1);
        var tp = sgPlayers().filter(function(p){ return !(p.ko > 0); }), q = tp[Math.floor(Math.random() * tp.length)];
        if (q && Math.random() < 0.55) sgRockAt(q.x + rand(-50, 50), q.y + rand(-30, 30), 1.35 / Math.min(1.3, Math.sqrt(k)));
        else { var sp = sgSpot(0); sgRockAt(sp.x, sp.y); }
      }
      if ((S.cave -= dt) <= 0){      /* a cave-in: a line of rocks across the cave */
        S.cave = rand(11, 15) / Math.min(1.6, k);
        var a = Math.random() * Math.PI, cx = 600 + rand(-150, 150), cy = 430 + rand(-80, 80);
        for (var i = -3; i <= 3; i++){ var x = cx + Math.cos(a) * i * 110, y = cy + Math.sin(a) * i * 70; if (sgInIsl(x, y, 0.9)) sgRockAt(x, y, 1.5 + Math.abs(i) * 0.08); }
        sgFx({ k: 'txt', x: cx, y: cy - 140, t: 1.4, T: 1.4, s: 'Cave-in!', c: '#ff9a5a' });
      }
    },
    pick: function(p){ var v = sgNear(p, function(e){ return e.k === 'vein'; }); return v ? { t: 'hit', id: v.id } : null; },
    ev: function(p, t, e){
      if (t !== 'hit' || !e || e.k !== 'vein') return;
      e.a += 1;
      sgFx({ k: 'spark', x: e.x, y: e.y - 40, t: 0.35, T: 0.35, c: e.s === 'gem' ? '#7af0ff' : '#ffd23e' });
      if (e.a >= e.b){ if (e.s === 'gem') sgRs('gem'); sgDel(e); sgPts(p, e.s === 'gem' ? 5 : 2, e.x, e.y - 90, e.s === 'gem' ? 'Gem!' : ''); sgFood(e.x, e.y, 0.1); sgFx({ k: 'poof', x: e.x, y: e.y - 20, t: 0.5, T: 0.5, c: 'rgba(200,190,220,.9)' }); }
    },
    solid: function(e){ return e.k === 'vein' ? 34 : 0; },
    draw: function(g, e){
      var kind = e.s === 'gem' ? 'runite' : (e.id % 2 ? 'gold' : 'mithril'), fr = Math.min(3, Math.floor(e.a / e.b * 4)), blink = e.c < 3.5 && Math.sin(sg.t * 14) > 0;
      var gl = g.createRadialGradient(e.x, e.y - 30, 4, e.x, e.y - 30, 70); gl.addColorStop(0, e.s === 'gem' ? 'rgba(120,240,255,.45)' : 'rgba(255,220,90,.35)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gl; g.beginPath(); g.arc(e.x, e.y - 30, 70, 0, 7); g.fill();
      if (blink){ g.save(); g.globalAlpha = 0.55; }
      sgPic(g, 'ore' + kind + fr, function(){ return oreSvg(kind, [0, 0.3, 0.6, 0.85][fr]); }, e.x, e.y + 6, 100, e.id % 3 === 0);
      if (blink) g.restore();
      sgBarDraw(g, e.x, e.y + 22, e.c / (e.d || 16), e.c < 3.5 ? '#ff7a5a' : '#c9c2d8', 54);
      if (e.a > 0) sgBarDraw(g, e.x, e.y - 98, e.a / e.b, '#ffd23e');
    }
  },

  /* ===== Fishing: The Big Catch ===== */
  fish: { name: 'The Big Catch', verb: 'Cast', hint: 'Walk to the shore next to a bubbling spot.',
    intro: 'The big lake is full of fish today, and so is the shore… with grumpy crabs. Catch as many fish as you can before time runs out.',
    how: 'Stand on the shore next to bubbles and press the action button to cast. Then hold the button to push the green zone along the bar and let go to let it slide back: keep the fish inside it until the catch bar fills. Big fish fight harder, golden fish are worth the most. Hit crabs to chase them off.',
    goal: 'Reel in the fish, and keep the crabs off you!',
    land: { rim: '#e9d49a', top: '#9ad46a', bot: '#5aa83e', spot: ['rgba(30,80,20,.2)', 'rgba(190,240,120,.2)'] }, sky: ['#5a8ff0', '#c8e4ff'],
    need: [24, 29, 34],
    decor: function(R){ return sgRing(R, 12, 0.82, 0.94, ['bush', 'fishrack', 'rock', 'flowers', 'barrels'], 84); },
    walk: function(x, y){ return sgLakeD(x, y) > 1.12; },
    under: function(g){
      var L = SG_LAKE;
      g.fillStyle = '#e8d6a0'; g.beginPath(); g.ellipse(L.x, L.y + 6, L.rx * 1.08, L.ry * 1.1, 0, 0, 7); g.fill();
      var wg = g.createRadialGradient(L.x, L.y - 20, 20, L.x, L.y, L.rx); wg.addColorStop(0, '#5ab8f0'); wg.addColorStop(1, '#2a72c8');
      g.fillStyle = wg; g.beginPath(); g.ellipse(L.x, L.y, L.rx, L.ry, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 4; g.beginPath(); g.ellipse(L.x, L.y, L.rx - 4, L.ry - 4, 0, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 3;
      for (var i = 0; i < 6; i++){ var x = L.x + Math.cos(i * 1.9 + sg.t * 0.2) * L.rx * 0.55, y = L.y + Math.sin(i * 2.3) * L.ry * 0.5; g.beginPath(); g.moveTo(x - 20, y); g.quadraticCurveTo(x, y - 6, x + 20, y); g.stroke(); }
    },
    wave: function(w){ sg.st = { spawn: 0, crab: 7 }; sg.E = sg.E.filter(function(e){ return e.k !== 'spot'; }); },
    tick: function(dt, k){
      var S = sg.st, spots = sgAll('spot'), max = Math.round((3 + sg.w * 0.5) * Math.sqrt(sg.mul));
      spots.forEach(function(e){
        if (e.d){ var by = sgBySlot(e.d - 1); if (!by || by.gone || by.ko > 0 || !by.bz){ e.h = (e.h || 0) + dt; if (e.h > 2.5){ e.d = 0; e.h = 0; } } else e.h = 0; return; }
        e.c -= dt; if (e.c <= 0) sgDel(e);
      });
      if ((S.spawn -= dt) <= 0 && spots.length < max){
        S.spawn = 1.4 / Math.sqrt(sg.mul);
        for (var n = 0; n < 30; n++){
          var a = Math.random() * 6.283, x = SG_LAKE.x + Math.cos(a) * SG_LAKE.rx * 0.84, y = SG_LAKE.y + Math.sin(a) * SG_LAKE.ry * 0.8;
          if (spots.some(function(o){ return Math.hypot(o.x - x, o.y - y) < 120; })) continue;
          var r = Math.random(), sz = r < 0.1 ? 'gold' : r < 0.38 ? 'big' : 'small';
          sgNew('spot', x, y, { s: sz, c: sz === 'gold' ? 9 : 15, b: sz === 'gold' ? 9 : 15 }); break;
        }
      }
      if ((S.crab -= dt) <= 0){
        S.crab = rand(7, 10) * sgRate(1);
        if (sgAll('mob').length < Math.round((1 + sg.w * 0.5) * sg.mul)){
          var ca = Math.random() * 6.283, cx = SG_LAKE.x + Math.cos(ca) * SG_LAKE.rx * 1.18, cy = SG_LAKE.y + Math.sin(ca) * SG_LAKE.ry * 1.25;
          if (sgWalk(cx, cy)){ sgNew('mob', cx, cy, { s: 'crab', a: 3, b: 1 }); sgFx({ k: 'ring', x: cx, y: cy, t: 0.5, T: 0.5, c: '#5ab8f0' }); }
        }
      }
    },
    pick: function(p){
      var e = sgNear(p, function(o){ return o.k === 'spot' && (!o.d || o.d === p.slot + 1); }, 140);
      if (e) return { mini: 'reel', t: 'cast', id: e.id, o: { s: e.s } };
      if (sgNear(p, function(o){ return o.k === 'spot'; }, 140)) return { msg: 'Someone is fishing there.' };
      return null;
    },
    ev: function(p, t, e, v){
      if (!e || e.k !== 'spot') return;
      if (t === 'cast'){ if (!e.d) e.d = p.slot + 1; return; }
      if (t === 'catch'){ if (e.s === 'gold') sgRs('gold'); sgDel(e); var n = e.s === 'gold' ? 10 : e.s === 'big' ? 5 : 3; sgPts(p, n, e.x, e.y - 60, e.s === 'gold' ? 'Golden fish!' : e.s === 'big' ? 'Big one!' : ''); sgFx({ k: 'ring', x: e.x, y: e.y, t: 0.5, T: 0.5, c: '#fff' }); sgFood(p.x, p.y + 20, 0.1); return; }
      if (t === 'lost'){ e.d = 0; sgFx({ k: 'txt', x: e.x, y: e.y - 60, t: 1, T: 1, s: 'Got away!', c: '#c9e4ff' }); }
    },
    draw: function(g, e){
      var gold = e.s === 'gold', big = e.s !== 'small';
      for (var i = 0; i < 3; i++){ var u = ((sg.t * 0.8 + i / 3 + e.id * 0.13) % 1); g.strokeStyle = gold ? 'rgba(255,225,100,' + (1 - u) + ')' : 'rgba(255,255,255,' + (0.9 - u * 0.9) + ')'; g.lineWidth = 3; g.beginPath(); g.ellipse(e.x, e.y, 14 + u * (big ? 46 : 32), 6 + u * (big ? 18 : 12), 0, 0, 7); g.stroke(); }
      g.fillStyle = gold ? 'rgba(255,200,40,.75)' : 'rgba(10,40,90,.45)'; g.beginPath(); g.ellipse(e.x + Math.sin(sg.t * 2 + e.id) * 10, e.y, big ? 22 : 15, big ? 8 : 6, 0, 0, 7); g.fill();
      for (i = 0; i < 3; i++){ var bu = ((sg.t * 1.4 + i * 0.37 + e.id) % 1); g.fillStyle = 'rgba(255,255,255,' + (1 - bu) + ')'; g.beginPath(); g.arc(e.x - 10 + i * 10, e.y - bu * 18, 3 + i, 0, 7); g.fill(); }
      if (!e.d) sgBarDraw(g, e.x, e.y + 24, e.c / (e.b || 15), e.c < 3 ? '#ff7a5a' : '#c9e4ff', 44);
      if (e.d){      /* the line and bobber from whoever is fishing it */
        var by = sgBySlot(e.d - 1);
        if (by){ var hx = by.x + (by.face || 1) * 26, hy = by.y - 66; g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo((hx + e.x) / 2, Math.min(hy, e.y) - 50, e.x, e.y - 4); g.stroke(); }
        g.fillStyle = '#ff4a4a'; g.strokeStyle = '#2b2338'; g.lineWidth = 2; g.beginPath(); g.arc(e.x, e.y - 4 + Math.sin(sg.t * 9) * 3, 7, 0, 7); g.fill(); g.stroke();
      }
    },
    miniStart: function(M){ var D = { small: [0.55, 0.3], big: [0.85, 0.25], gold: [1.2, 0.21] }[M.o.s] || [0.55, 0.3]; M.spd = D[0] * Math.min(1.5, 0.9 + 0.1 * (sg.k || 1)); M.zw = D[1] + (sg.hero.hat ? 0.08 : 0); M.f = 0.5; M.ft = 0.5; M.fn = 0; M.z = 0.4; M.zv = 0; M.pr = 0.3; },
    miniTick: function(M, dt){
      if (!sgById(M.id)){ sgMiniStop(false, 'It swam off.'); return; }
      if ((M.fn -= dt) <= 0){ M.fn = rand(0.35, 1.1) / M.spd; M.ft = clamp(M.f + rand(-0.55, 0.55) * Math.min(1.4, M.spd), 0.04, 0.96); }
      M.f += (M.ft - M.f) * Math.min(1, dt * 2.6 * M.spd);
      M.zv += (M.hold ? 2.4 : -2.1) * dt; M.zv = clamp(M.zv, -1.6, 1.6); M.z += M.zv * dt;
      if (M.z < M.zw / 2){ M.z = M.zw / 2; M.zv = Math.max(0, -M.zv * 0.3); }
      if (M.z > 1 - M.zw / 2){ M.z = 1 - M.zw / 2; M.zv = Math.min(0, -M.zv * 0.3); }
      var inZ = Math.abs(M.f - M.z) < M.zw / 2;
      M.pr += inZ ? dt / 1.7 : -dt / 2.6;
      if (M.pr >= 1) sgMiniStop(true); else if (M.pr <= 0) sgMiniStop(false, 'It got away!');
    },
    miniEnd: function(M, ok, why){ sgSend(ok ? 'catch' : 'lost', M.id, 0); var me = sg.hero; if (!ok && why) sgTxt(me.x, me.y - 120, why, '#c9e4ff'); },
    miniHtml: function(M){ return '<div class="sg-mb"><b>' + (M.o.s === 'gold' ? 'A golden fish!' : M.o.s === 'big' ? 'A big one!' : 'Reel it in!') + '</b><div class="sg-rbar"><i class="z"></i><i class="f">' + sgArtSvg('raw') + '</i></div><div class="sg-prog"><i></i></div><small>Hold to push the green zone right, let go to let it slide back. Keep the fish inside it.</small></div>'; },
    miniDraw: function(M, el){
      var z = el.querySelector('.z'), f = el.querySelector('.f'), pr = el.querySelector('.sg-prog i'); if (!z) return;
      z.style.left = ((M.z - M.zw / 2) * 100).toFixed(1) + '%'; z.style.width = (M.zw * 100).toFixed(1) + '%';
      f.style.left = (M.f * 100).toFixed(1) + '%'; pr.style.width = (clamp(M.pr, 0, 1) * 100).toFixed(1) + '%';
      z.classList.toggle('in', Math.abs(M.f - M.z) < M.zw / 2);
    }
  },

  /* ===== Woodcutting: Timber Rush ===== */
  forest: { name: 'Timber Rush', verb: 'Chop', hint: 'Walk up to a grown tree.',
    intro: 'The forest is growing faster than anyone can chop it! Every tree you cut falls away from you, and a falling tree knocks down every tree in its way for bonus points.',
    how: 'Keep pressing the action button next to a tree. When it falls, it falls away from you along the red lane: stand so it hits other trees for a domino bonus, and keep your friends out of the lane. Watch for falling branches.',
    goal: 'Chop trees. Line them up so they knock each other down!',
    land: { rim: '#e3cf92', top: '#6cbf4a', bot: '#357a2c', spot: ['rgba(10,50,15,.3)', 'rgba(140,220,90,.2)'] }, sky: ['#4f86e0', '#bfe0ff'],
    need: [26, 31, 36],
    decor: function(R){ return sgRing(R, 12, 0.84, 0.95, ['pine', 'bush', 'mushroom', 'flowers', 'logpile'], 90); },
    cells: function(){ var out = []; for (var r = 0; r < 3; r++) for (var c = 0; c < 6; c++) out.push({ x: 600 + (c - 2.5) * 150 + (r % 2) * 40, y: 430 + (r - 1) * 175 - 10 }); return out; },
    wave: function(w){
      sg.st = { branch: 3, cells: this.cells().map(function(c){ return { x: c.x, y: c.y, t: 0, id: 0 }; }) };
      sg.E = sg.E.filter(function(e){ return e.k !== 'tree'; });
      sg.st.cells.forEach(function(c){ var sap = Math.random() < 0.35, old = !sap && Math.random() < 0.15; var e = sgNew('tree', c.x + rand(-20, 20), c.y + rand(-14, 14), { s: sap ? 'sap' : old ? 'old' : 'tree', b: old ? 12 : 6, c: sap ? rand(2, 6) : 0 }); c.id = e.id; });
    },
    tick: function(dt, k){
      var S = sg.st;
      sgAll('tree').forEach(function(e){
        if (e.s === 'sap'){ e.c -= dt; if (e.c <= 0){ var old = Math.random() < 0.15; e.s = old ? 'old' : 'tree'; e.b = old ? 12 : 6; e.a = 0; } }
        else if (e.s === 'fall'){ e.c -= dt; if (e.c <= -0.4) sgDel(e); }
      });
      S.cells.forEach(function(c){
        if (c.id && sgById(c.id)) return;
        c.id = 0; c.t += dt;
        if (c.t > 3.5 / Math.sqrt(sg.mul) && !sgPlayers().some(function(p){ return Math.hypot(p.x - c.x, p.y - c.y) < 60; })){ c.t = 0; c.id = sgNew('tree', c.x + rand(-20, 20), c.y + rand(-14, 14), { s: 'sap', b: 6, c: rand(3, 5) / Math.sqrt(sg.mul) }).id; }
      });
      if ((S.branch -= dt) <= 0){
        S.branch = rand(1.8, 2.8) * sgRate(1);
        var tp = sgPlayers().filter(function(p){ return !(p.ko > 0); }), q = tp[Math.floor(Math.random() * tp.length)];
        if (q) sgHz({ k: 'c', x: q.x + rand(-40, 40), y: q.y + rand(-25, 25), r: 58, T: 1.25, dmg: 0.11, s: 'branch', col: 'rgba(110,170,70,.9)' });
      }
    },
    pick: function(p){
      var e = sgNear(p, function(o){ return o.k === 'tree' && (o.s === 'tree' || o.s === 'old'); });
      if (e) return { t: 'chop', id: e.id };
      if (sgNear(p, function(o){ return o.k === 'tree' && o.s === 'sap'; })) return { msg: 'Still growing!' };
      return null;
    },
    fell: function(p, e, dx, dy, chain, ch){
      var d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      e.s = 'fall'; e.c = chain ? 0.4 : 0.7; e.d = dx; e.T0 = e.c;
      sgHz({ k: 'l', x: e.x, y: e.y, x2: e.x + dx * 270, y2: e.y + dy * 270 * 0.75, r: 34, T: e.c, dmg: 0.14, s: 'fall', src: e.id, by: p ? p.slot : 0, dx: dx, dy: dy, ch: ch || 1, col: 'rgba(140,100,60,.9)' });
      sg.rs = sg.rs || {}; sg.rs.chain = Math.max(sg.rs.chain || 0, ch || 1);      /* how many trees one chop has knocked down */
    },
    ev: function(p, t, e){
      if (t !== 'chop' || !e || e.k !== 'tree' || (e.s !== 'tree' && e.s !== 'old')) return;
      e.a += 1; sgFx({ k: 'spark', x: e.x, y: e.y - 40, t: 0.3, T: 0.3, c: '#e6c08c' });
      if (e.a < e.b) return;
      var old = e.s === 'old';
      sgPts(p, old ? 4 : 1, e.x, e.y - 130, old ? 'Ancient tree!' : '');
      sgFood(e.x, e.y + 30, 0.08);
      this.fell(p, e, e.x - p.x, e.y - p.y, false);
    },
    impact: function(h){
      if (h.s !== 'fall') return;
      var G = this, by = sgBySlot(h.by) || sg.hero;
      sgAll('tree').forEach(function(o){
        if (o.id === h.src || (o.s !== 'tree' && o.s !== 'old') || !sgInHz({ k: 'l', x: h.x, y: h.y, x2: h.x2, y2: h.y2, r: 46 }, o.x, o.y)) return;
        sgPts(by, o.s === 'old' ? 3 : 1, o.x, o.y - 130, 'Domino!');
        G.fell(by, o, h.dx, h.dy, true, (h.ch || 1) + 1);
      });
    },
    solid: function(e){ return e.k === 'tree' && e.s !== 'fall' ? (e.s === 'sap' ? 18 : 30) : 0; },
    draw: function(g, e){
      if (e.s === 'sap'){ sgPic(g, 'sap', SG_ART.sap, e.x, e.y + 4, 62); return; }
      var kind = e.s === 'old' || e.old ? 'magic' : (e.id % 3 ? 'oak' : 'normal');
      if (e.s === 'old') e.old = 1;
      if (e.s === 'fall'){
        var T0 = e.T0 || 0.7, u = clamp(1 - e.c / T0, 0, 1), dir = e.d < 0 ? -1 : 1;
        g.save(); g.globalAlpha = e.c < 0 ? Math.max(0, 1 + e.c / 0.4) : 1; g.translate(e.x, e.y); g.rotate(dir * u * u * 1.45);
        sgPic(g, 'tree' + kind, function(){ return treeSvg(kind, 0); }, 0, 4, 130);
        g.restore(); return;
      }
      sgPic(g, 'tree' + kind, function(){ return treeSvg(kind, 0); }, e.x, e.y + 4, 130, e.id % 2 === 0);
      if (e.a > 0) sgBarDraw(g, e.x, e.y - 150, e.a / e.b, '#e6c08c');
    }
  }
};
