
/* ===== Potionmaking: Cauldron Chaos ===== */
SG_GAMES.potion = { name: 'Cauldron Chaos', verb: 'Use', hint: 'Walk to a shelf to grab an ingredient.',
  intro: 'Potion orders are pouring in! Each order lists ingredients in order. Grab them from the shelves and drop them into a cauldron in that order to brew the potion.',
  how: 'Press the action button at a shelf to pick up its ingredient, then at a cauldron to drop it in. A wrong ingredient makes the cauldron blow up. Press the action button at a cauldron with empty hands to tip it out. Cauldrons boil over now and then: stay out of the red.',
  goal: 'Brew the orders at the top before they run out!',
  land: { rim: '#d8c8f0', top: '#8a6ad0', bot: '#5a3f9a', spot: ['rgba(40,20,80,.3)', 'rgba(220,190,255,.18)'] }, sky: ['#2a1a5e', '#8a5ee0'], cloud: 'rgba(220,190,255,.2)',
  need: [24, 29, 34],
  decor: function(R){ return sgRing(R, 11, 0.84, 0.95, ['orb', 'flowers', 'bush', 'lamp'], 84); },
  wave: function(w){
    sg.st = { ord: 0.5 };
    if (!sgAll('shelf').length){
      ['b', 'm', 'h', 'c'].forEach(function(ch, i){ sgNew('shelf', 600 + (i - 1.5) * 190, 300, { s: ch }); });
      [-1, 0, 1].forEach(function(i){ sgNew('caul', 600 + i * 230, 520 + (i === 0 ? 30 : 0)); });
    }
    sg.E = sg.E.filter(function(e){ return e.k !== 'ord'; });
    sgAll('caul').forEach(function(c){ c.s = ''; c.a = 0; });
  },
  recipe: function(){
    var w = sg.surv ? Math.min(3, 1 + Math.floor((sg.surv.n + 1) / 2)) : sg.w, len = w <= 1 ? (Math.random() < 0.6 ? 2 : 3) : w === 2 ? 3 : (Math.random() < 0.5 ? 3 : 4), s = '', all = 'bmhc';
    for (var i = 0; i < len; i++) s += all[Math.floor(Math.random() * 4)];
    return s;
  },
  tick: function(dt, k){
    var S = sg.st, ords = sgAll('ord'), max = Math.min(5, Math.round((2 + sg.w * 0.4) * Math.sqrt(sg.mul)));
    ords.forEach(function(o){ o.a -= dt; if (o.a <= 0){ sgDel(o); sgBad(3, 600, 200, 'Order spoiled!'); } });
    if ((S.ord -= dt) <= 0 && ords.length < max){
      S.ord = rand(5, 8) * sgRate(1);
      var r = this.recipe(), T = (12 + 7 * r.length) / Math.min(1.5, Math.sqrt(k));
      sgNew('ord', 0, 0, { s: r, a: T, b: T });
    }
    sgAll('caul').forEach(function(c){ if (c.a > 0) c.a = Math.max(0, c.a - dt); });
    if (((S.boil = (S.boil === undefined ? 5 : S.boil) - dt)) <= 0){
      S.boil = rand(5, 7) * sgRate(1);
      var cs = sgAll('caul'), c = cs[Math.floor(Math.random() * cs.length)];
      if (c) sgHz({ k: 'c', x: c.x, y: c.y + 10, r: 105, T: 1.4, dmg: 0.1, s: 'boil', col: 'rgba(170,120,255,.9)' });
    }
  },
  pick: function(p){
    var c = sgNear(p, function(o){ return o.k === 'caul'; }, 100), sh = sgNear(p, function(o){ return o.k === 'shelf'; }, 100);
    if (p.cr){
      if (c) return { t: 'add', id: c.id };
      if (sh && sh.s !== p.cr) return { t: 'take', id: sh.id };
      return { msg: 'Drop it in a cauldron!' };
    }
    if (sh) return { t: 'take', id: sh.id };
    if (c && c.s) return { t: 'dump', id: c.id };
    if (c) return { msg: 'Bring an ingredient first.' };
    return null;
  },
  ev: function(p, t, e){
    if (!e) return;
    if (t === 'take' && e.k === 'shelf'){ p.cr = e.s; return; }
    if (t === 'dump' && e.k === 'caul'){ if (e.s){ e.s = ''; sgFx({ k: 'puff', x: e.x, y: e.y - 40, t: 0.6, T: 0.6, c: 'rgba(200,170,255,.8)' }); sgTxt(e.x, e.y - 110, 'Tipped out', '#e8d8ff'); } return; }
    if (t !== 'add' || e.k !== 'caul' || !p.cr) return;
    e.s += p.cr; p.cr = '';
    sgFx({ k: 'spark', x: e.x, y: e.y - 50, t: 0.4, T: 0.4, c: '#c9a2f0' });
    var ords = sgAll('ord').sort(function(a, b){ return a.a - b.a; }), done = null;
    ords.forEach(function(o){ if (!done && o.s === e.s) done = o; });
    if (done){
      if (done.s.length >= 4) sgRs('four');
      sgDel(done); e.s = ''; e.a = 1.2;
      sgPts(p, done.s.length + 1 + (done.a > done.b / 2 ? 1 : 0), e.x, e.y - 120, done.a > done.b / 2 ? 'Quick brew!' : 'Brewed!');
      sgFx({ k: 'ring', x: e.x, y: e.y - 20, t: 0.6, T: 0.6, c: '#9be86a' }); sgFood(e.x + 60, e.y + 30, 0.08);
      return;
    }
    if (!ords.some(function(o){ return o.s.indexOf(e.s) === 0; })){
      sgFx({ k: 'puff', x: e.x, y: e.y - 40, t: 0.8, T: 0.8, c: 'rgba(170,90,230,.85)' });
      sgPlayers().forEach(function(q){ if (Math.hypot(q.x - e.x, q.y - e.y) < 95) sgHurt(q, 0.07); });
      e.s = ''; sgBad(2, e.x, e.y - 120, 'Wrong mix! Boom!');
    }
  },
  solid: function(e){ return e.k === 'shelf' ? 44 : e.k === 'caul' ? 42 : 0; },
  carryArt: function(k){ return SG_ING[k] || k; },
  draw: function(g, e){
    if (e.k === 'shelf'){
      sgPic(g, 'shelf', SG_ART.shelf, e.x, e.y + 6, 110);
      sgPic(g, 'ing' + e.s, SG_ART[SG_ING[e.s]], e.x, e.y - 44 + Math.sin(sg.t * 3 + e.id) * 3, 84);
      return;
    }
    if (e.k === 'caul'){
      if (e.a > 0){ var gl = g.createRadialGradient(e.x, e.y - 40, 4, e.x, e.y - 40, 90); gl.addColorStop(0, 'rgba(160,255,120,' + (0.5 * e.a) + ')'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.beginPath(); g.arc(e.x, e.y - 40, 90, 0, 7); g.fill(); }
      sgPic(g, 'caul' + (e.s ? 1 : 0), function(){ return cauldronSvg(!!e.s); }, e.x, e.y + 6, 120);
      if (e.s){
        var n = e.s.length, w = 50;
        g.fillStyle = 'rgba(20,14,36,.75)'; g.strokeStyle = '#c9a24a'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(e.x, e.y - 140, n * w / 2 + 14, 32, 0, 0, 7); g.fill(); g.stroke();
        for (var i = 0; i < n; i++) sgPic(g, 'ing' + e.s[i], SG_ART[SG_ING[e.s[i]]], e.x - (n - 1) * w / 2 + i * w, e.y - 118, 54);
      }
    }
  },
  hud: function(){
    var ords = sgAll('ord').sort(function(a, b){ return a.a - b.a; });
    if (!ords.length) return '';
    return '<div class="sg-ords">' + ords.map(function(o){ var f = o.a / (o.b || 1); return '<div class="sg-o' + (f < 0.25 ? ' late' : '') + '"><div class="sg-oi">' + sgIcons(o.s) + '</div><i style="width:' + (f * 100).toFixed(0) + '%"></i></div>'; }).join('') + '</div>';
  }
};

/* ===== Cooking: Sky Kitchen Rush ===== */
SG_GAMES.cook = { name: 'Sky Kitchen Rush', verb: 'Use', hint: 'Grab a raw fish from the basket.',
  intro: 'Hungry cloud folk are lining up at the sky kitchen! Cook fish on the wind stoves and serve them before the customers float away.',
  how: 'Grab a raw fish from the basket and put it on an empty stove. Keep pressing the action button at the stove to fan it: the fish only cooks while the heat needle is in the green, and burns if you fan it into the red. Take the cooked fish to a customer. Watch out for gusts of wind.',
  goal: 'Cook fish and serve the customers before they leave!',
  land: { rim: '#c8d6f0', top: '#ffffff', bot: '#dfe8fb', spot: ['rgba(120,150,210,.15)', 'rgba(255,255,255,.4)'] }, sky: ['#7ab8ff', '#fde2f0'], cloud: 'rgba(255,255,255,.6)',
  need: [20, 25, 30],
  decor: function(R){ return sgRing(R, 10, 0.86, 0.96, ['chimes', 'barrels', 'crates', 'flowerpot'], 76); },
  SLOTS: [[1000, 300], [1060, 450], [990, 600], [790, 180], [800, 700], [440, 170]],
  wave: function(w){
    sg.st = { cust: 0.5, gust: 4 };
    if (!sgAll('stove').length){
      sgNew('basket', 210, 430);
      [[470, 340], [690, 340], [470, 540], [690, 540]].forEach(function(q){ sgNew('stove', q[0], q[1]); });
    }
    sg.E = sg.E.filter(function(e){ return e.k !== 'cust'; });
    sgAll('stove').forEach(function(s){ s.s = ''; s.a = 0; s.b = 0; s.c = 0; });
  },
  tick: function(dt, k){
    var S = sg.st, G = this;
    sgAll('stove').forEach(function(s){
      if (!s.s || s.s === 'burnt') return;
      if (s.s === 'raw'){
        s.a = Math.max(0, s.a - (0.1 + 0.02 * (k - 1)) * dt);
        if (s.a >= 0.35 && s.a <= 0.85) s.b += dt / 4.5;
        if (s.a > 0.85){ s.c += dt; } else s.c = Math.max(0, s.c - dt * 0.5);
        if (s.b >= 1){ s.s = 'done'; s.b = 1; s.c = 0; sgTxt(s.x, s.y - 130, 'Cooked!', '#ffe58a'); }
      } else if (s.s === 'done'){ s.c += dt * 0.18; }
      if (s.c > 1.4){ s.s = 'burnt'; s.c = 0; sgFx({ k: 'puff', x: s.x, y: s.y - 60, t: 0.9, T: 0.9, c: 'rgba(60,60,70,.8)' }); sgBad(2, s.x, s.y - 120, 'Burnt!'); }
    });
    var cs = sgAll('cust'), max = Math.min(6, Math.round((2 + sg.w * 0.4) * Math.sqrt(sg.mul)));
    cs.forEach(function(c){ c.a -= dt; if (c.a <= 0){ sgDel(c); sgFx({ k: 'poof', x: c.x, y: c.y - 30, t: 0.6, T: 0.6, c: '#fff' }); sgBad(3, c.x, c.y - 100, 'Left hungry!'); } });
    if ((S.cust -= dt) <= 0 && cs.length < max){
      S.cust = rand(4, 6.5) * sgRate(1);
      var free = G.SLOTS.filter(function(q){ return !cs.some(function(c){ return Math.hypot(c.x - q[0], c.y - q[1]) < 20; }); });
      if (free.length){ var q = free[Math.floor(Math.random() * free.length)], vip = Math.random() < 0.12, T = (vip ? 22 : 34) / Math.min(1.5, Math.sqrt(k)); sgNew('cust', q[0], q[1], { s: vip ? 'vip' : '', a: T, b: T }); }
    }
    if ((S.gust -= dt) <= 0){
      S.gust = rand(5, 7) * sgRate(1);
      var tp = sgPlayers().filter(function(p){ return !(p.ko > 0); }), qp = tp[Math.floor(Math.random() * tp.length)], y = qp ? qp.y + rand(-30, 30) : 430;
      sgHz({ k: 'l', x: 60, y: y, x2: 1140, y2: y, r: 40, T: 1.5, dmg: 0.1, s: 'gust', col: 'rgba(255,255,255,.95)' });
    }
  },
  pick: function(p){
    var st = sgNear(p, function(o){ return o.k === 'stove'; }, 95), cu = sgNear(p, function(o){ return o.k === 'cust'; }, 100), bk = sgNear(p, function(o){ return o.k === 'basket'; }, 105);
    if (p.cr === 'raw'){ if (st && !st.s) return { t: 'put', id: st.id }; if (st && st.s === 'raw') return { t: 'fan', id: st.id }; return { msg: 'Put it on an empty stove.' }; }
    if (p.cr === 'done'){ if (cu) return { t: 'serve', id: cu.id }; return { msg: 'Take it to a customer!' }; }
    if (st && st.s === 'raw') return { t: 'fan', id: st.id };
    if (st && st.s === 'done') return { t: 'take', id: st.id };
    if (st && st.s === 'burnt') return { t: 'clear', id: st.id };
    if (bk) return { t: 'grab', id: bk.id };
    if (cu) return { msg: 'Cook them a fish first!' };
    return null;
  },
  ev: function(p, t, e){
    if (!e) return;
    if (t === 'grab' && e.k === 'basket' && !p.cr){ p.cr = 'raw'; return; }
    if (t === 'put' && e.k === 'stove' && !e.s && p.cr === 'raw'){ p.cr = ''; e.s = 'raw'; e.a = 0.5; e.b = 0; e.c = 0; return; }
    if (t === 'fan' && e.k === 'stove' && e.s === 'raw'){ e.a = Math.min(1, e.a + 0.13); sgFx({ k: 'puff', x: e.x + rand(-20, 20), y: e.y - 70, t: 0.4, T: 0.4, c: 'rgba(255,255,255,.9)' }); return; }
    if (t === 'take' && e.k === 'stove' && e.s === 'done' && !p.cr){ p.cr = 'done'; e.s = ''; e.a = 0; e.b = 0; e.c = 0; return; }
    if (t === 'clear' && e.k === 'stove' && e.s === 'burnt'){ e.s = ''; e.a = 0; e.b = 0; e.c = 0; sgFx({ k: 'puff', x: e.x, y: e.y - 50, t: 0.5, T: 0.5, c: 'rgba(80,80,90,.7)' }); return; }
    if (t === 'serve' && e.k === 'cust' && p.cr === 'done'){
      p.cr = ''; sgDel(e);
      var quick = e.a > e.b / 2, n = (4 + (quick ? 1 : 0)) * (e.s === 'vip' ? 2 : 1);
      if (e.s === 'vip') sgRs('vip');
      sgPts(p, n, e.x, e.y - 110, e.s === 'vip' ? 'Star customer!' : quick ? 'Speedy!' : 'Yum!');
      sgFx({ k: 'ring', x: e.x, y: e.y - 30, t: 0.6, T: 0.6, c: '#ffb3c8' }); sgFood(e.x - 40, e.y + 20, 0.1);
    }
  },
  solid: function(e){ return e.k === 'stove' ? 42 : e.k === 'basket' ? 44 : e.k === 'cust' ? 34 : 0; },
  carryArt: function(k){ return k; },
  draw: function(g, e){
    if (e.k === 'basket'){ sgPic(g, 'basket', SG_ART.basket, e.x, e.y + 6, 110); return; }
    if (e.k === 'stove'){
      sgPic(g, 'stove' + (e.s ? 1 : 0), function(){ return stoveSvg(!!e.s); }, e.x, e.y + 6, 118);
      if (e.s) sgPic(g, 'food' + e.s, SG_ART[e.s], e.x, e.y - 110 + (e.s === 'raw' ? Math.sin(sg.t * 10) * 2 : 0), 56);
      if (e.s === 'raw'){
        var gx = e.x + 66, gy = e.y - 100, gh = 90;      /* heat gauge: blue, green, red */
        g.fillStyle = 'rgba(20,14,36,.8)'; g.fillRect(gx - 8, gy - 4, 16, gh + 8);
        g.fillStyle = '#5ab8f0'; g.fillRect(gx - 5, gy + gh * 0.65, 10, gh * 0.35);
        g.fillStyle = '#5ad86a'; g.fillRect(gx - 5, gy + gh * 0.15, 10, gh * 0.5);
        g.fillStyle = '#ff5a4a'; g.fillRect(gx - 5, gy, 10, gh * 0.15);
        var ny = gy + gh * (1 - e.a); g.fillStyle = '#fff'; g.strokeStyle = '#2b2338'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx - 14, ny); g.lineTo(gx + 14, ny); g.lineTo(gx + 14, ny + 4); g.lineTo(gx - 14, ny + 4); g.closePath(); g.fill(); g.stroke();
        sgBarDraw(g, e.x, e.y - 150, e.b, '#ffd23e', 56);
        if (e.c > 0.2) sgBarDraw(g, e.x, e.y - 166, e.c / 1.4, '#ff5a4a', 56);
      } else if (e.s === 'done' && e.c > 0.6) sgBarDraw(g, e.x, e.y - 150, e.c / 1.4, '#ff5a4a', 56);
      return;
    }
    if (e.k === 'cust'){
      var bob = Math.sin(sg.t * 2 + e.id) * 5, vip = e.s === 'vip';
      sgPic(g, 'cust', SG_ART.cust, e.x, e.y + bob, vip ? 92 : 80);
      if (vip){ g.fillStyle = '#ffd23e'; g.strokeStyle = '#8a5a00'; g.lineWidth = 2; g.beginPath(); for (var i = 0; i < 10; i++){ var an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 6 : 14; g.lineTo(e.x + Math.cos(an) * rr, e.y - 96 + bob + Math.sin(an) * rr); } g.closePath(); g.fill(); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.95)'; g.strokeStyle = '#2b2338'; g.lineWidth = 2.4; g.beginPath(); g.ellipse(e.x + 52, e.y - 108 + bob, 30, 22, 0, 0, 7); g.fill(); g.stroke();
      sgPic(g, 'food' + 'done', SG_ART.done, e.x + 52, e.y - 92 + bob, 44);
      var f = e.a / (e.b || 1); sgBarDraw(g, e.x, e.y + 22, f, f < 0.3 ? '#ff5a4a' : f < 0.6 ? '#ffd23e' : '#5ad86a', 60);
    }
  }
};

/* ===== Smithing: Forge Master ===== */
SG_GAMES.smith = { name: 'Forge Master', verb: 'Use', hint: 'Grab ore from the pile.',
  intro: 'The forge has a mountain of orders. Smelt ore into glowing bars, then hammer them on the anvils before they cool down.',
  how: 'Take ore from the pile and put it in an empty furnace. When the bar glows, take it to an anvil and press the action button to start hammering: press again each time the mark is in the yellow zone. Bars cool down while you carry them: a cold bar has to go back in a furnace. Sparks fly out of the furnaces now and then.',
  goal: 'Smelt, hammer and finish as many blades as you can!',
  land: { rim: '#8a7e70', top: '#6a6270', bot: '#3e3846', spot: ['rgba(255,120,40,.12)', 'rgba(20,10,30,.3)'] }, sky: ['#2a1c2a', '#6a3a2a'], cloud: 'rgba(255,160,90,.12)',
  need: [24, 29, 34],
  decor: function(R){ return sgRing(R, 11, 0.84, 0.95, ['barrels', 'crates', 'cogtower', 'rock'], 84); },
  wave: function(w){
    sg.st = { spark: 3 };
    if (!sgAll('furn').length){
      sgNew('pile', 220, 470);
      [-1, 0, 1].forEach(function(i){ sgNew('furn', 620 + i * 210, 290); });
      [-1, 1].forEach(function(i){ sgNew('anvil', 640 + i * 150, 570); });
    }
    sgAll('furn').forEach(function(f){ f.s = ''; f.a = 0; });
    sgAll('anvil').forEach(function(a){ a.d = 0; });
  },
  tick: function(dt, k){
    var S = sg.st;
    sgAll('furn').forEach(function(f){ if (f.s === 'ore'){ f.a += dt / 3.5; if (f.a >= 1){ f.s = 'hot'; f.a = 1; sgFx({ k: 'spark', x: f.x, y: f.y - 60, t: 0.5, T: 0.5, c: '#ffb13a' }); } } });
    sgAll('anvil').forEach(function(a){ if (a.d){ var by = sgBySlot(a.d - 1); if (!by || by.gone || by.ko > 0 || !by.bz){ a.h = (a.h || 0) + dt; if (a.h > 2){ a.d = 0; a.h = 0; } } else a.h = 0; } });
    if ((S.spark -= dt) <= 0){
      S.spark = rand(2.2, 3.4) * sgRate(1);
      var tp = sgPlayers().filter(function(p){ return !(p.ko > 0); }), q = tp[Math.floor(Math.random() * tp.length)];
      if (q && Math.random() < 0.6) sgHz({ k: 'c', x: q.x + rand(-45, 45), y: q.y + rand(-25, 25), r: 64, T: 1.3, dmg: 0.11, s: 'spark', col: 'rgba(255,160,60,.95)' });
      else { var fs = sgAll('furn'), f0 = fs[Math.floor(Math.random() * fs.length)]; if (f0) sgHz({ k: 'c', x: f0.x, y: f0.y + 70, r: 95, T: 1.4, dmg: 0.11, s: 'spark', col: 'rgba(255,160,60,.95)' }); }
    }
  },
  local: function(dt){      /* my carried bar cools down on my own screen */
    var me = sg.hero; if (!me) return;
    if (me.cr === 'bar'){ if (sg.bhFor !== 'bar'){ sg.bhFor = 'bar'; sg.bh = 1; } sg.bh -= dt / (me.hat ? 19 : 15); if (sg.bh <= 0 && !sg.coolSent){ sg.coolSent = 1; if (sg.mini) sgMiniStop(false, 'Too cold!'); sgSend('cool', 0, 0); sgTxt(me.x, me.y - 120, 'The bar went cold!', '#c5ccd8'); } }
    else { sg.bhFor = me.cr; sg.coolSent = 0; }
  },
  pick: function(p){
    var pile = sgNear(p, function(o){ return o.k === 'pile'; }, 105), fu = sgNear(p, function(o){ return o.k === 'furn'; }, 100), an = sgNear(p, function(o){ return o.k === 'anvil'; }, 95);
    if (p.cr === 'ore' || p.cr === 'cold'){ if (fu && !fu.s) return { t: 'smelt', id: fu.id }; if (an && p.cr === 'cold') return { msg: 'Too cold! Heat it in a furnace.' }; return { msg: 'Put it in an empty furnace.' }; }
    if (p.cr === 'bar'){ if (an && (!an.d || an.d === p.slot + 1)) return { mini: 'forge', t: 'anvil', id: an.id }; if (an) return { msg: 'That anvil is busy.' }; return { msg: 'Take it to an anvil!' }; }
    if (fu && fu.s === 'hot') return { t: 'take', id: fu.id };
    if (pile) return { t: 'ore', id: pile.id };
    if (fu && fu.s === 'ore') return { msg: 'Still smelting…' };
    return null;
  },
  ev: function(p, t, e, v){
    if (t === 'cool'){ if (p.cr === 'bar') p.cr = 'cold'; return; }
    if (!e) return;
    if (t === 'ore' && e.k === 'pile' && !p.cr){ p.cr = 'ore'; return; }
    if (t === 'smelt' && e.k === 'furn' && !e.s && (p.cr === 'ore' || p.cr === 'cold')){ e.a = p.cr === 'cold' ? 0.6 : 0; e.s = 'ore'; p.cr = ''; return; }
    if (t === 'take' && e.k === 'furn' && e.s === 'hot' && !p.cr){ e.s = ''; e.a = 0; p.cr = 'bar'; return; }
    if (t === 'anvil' && e.k === 'anvil'){ if (!e.d) e.d = p.slot + 1; return; }
    if (t === 'fail' && e.k === 'anvil'){ if (e.d === p.slot + 1) e.d = 0; return; }
    if (t === 'forge' && e.k === 'anvil' && p.cr === 'bar'){
      p.cr = ''; e.d = 0; v = clamp(+v || 0, 0, 2); if (v >= 2) sgRs('mw');
      sgPts(p, 3 + v, e.x, e.y - 110, v >= 2 ? 'Masterwork!' : v ? 'Fine blade!' : 'Blade done!');
      sgFx({ k: 'spark', x: e.x, y: e.y - 50, t: 0.6, T: 0.6, c: '#ffd23e' }); sgFood(e.x + 50, e.y + 30, 0.1);
    }
  },
  miniStart: function(M){ M.m = 0; M.dir = 1; M.spd = 1.15 * Math.min(1.5, 0.9 + 0.1 * (sg.k || 1)); M.zw = sg.hero.hat ? 0.24 : 0.18; M.zc = rand(0.3, 0.7); M.hits = 0; M.need = (sg.k || 1) > 1.1 ? 4 : 3; M.perf = 0; M.flash = 0; },
  miniTick: function(M, dt){
    if (!sgById(M.id) || sg.hero.cr !== 'bar' && M.t > 0.6){ sgMiniStop(false); return; }
    M.m += M.dir * M.spd * dt; if (M.m > 1){ M.m = 1; M.dir = -1; } if (M.m < 0){ M.m = 0; M.dir = 1; }
    M.flash = Math.max(0, M.flash - dt);
  },
  miniPress: function(M){
    var d = Math.abs(M.m - M.zc), me = sg.hero;
    if (d < M.zw / 2){
      M.hits++; var perf = d < M.zw / 6; if (perf) M.perf++;
      M.flash = 0.25; M.last = perf ? 'Perfect!' : 'Good!';
      sgFx({ k: 'spark', x: me.x + me.face * 40, y: me.y - 30, t: 0.35, T: 0.35, c: '#ffd23e' }); sfx('smith');
      M.zc = clamp(M.zc + rand(-0.35, 0.35), 0.15, 0.85); M.spd *= 1.06;
      if (M.hits >= M.need) sgMiniStop(true);
    } else { M.last = 'Miss!'; M.flash = 0.25; sg.bh -= 0.15; sfx('nothing'); }
    sgMiniUi();
  },
  miniEnd: function(M, ok, why){ if (ok) sgSend('forge', M.id, Math.min(2, M.perf)); else { sgSend('fail', M.id, 0); if (why) sgTxt(sg.hero.x, sg.hero.y - 120, why, '#c5ccd8'); } },
  miniHtml: function(M){ return '<div class="sg-mb"><b>Hammer it!</b><div class="sg-fbar"><i class="z"></i><i class="m"></i></div><div class="sg-hits"></div><div class="sg-heat"><i></i></div><small>Press when the mark is in the yellow zone. Each miss cools the bar.</small></div>'; },
  miniDraw: function(M, el){
    var z = el.querySelector('.z'), m = el.querySelector('.m'), h = el.querySelector('.sg-hits'), ht = el.querySelector('.sg-heat i'); if (!z) return;
    z.style.left = ((M.zc - M.zw / 2) * 100).toFixed(1) + '%'; z.style.width = (M.zw * 100).toFixed(1) + '%';
    m.style.left = (M.m * 100).toFixed(1) + '%';
    var hs = ''; for (var i = 0; i < M.need; i++) hs += '<span class="' + (i < M.hits ? 'on' : '') + '"></span>';
    if (h.dataset.v !== M.hits + '/' + M.need + (M.flash > 0 ? M.last : '')){ h.dataset.v = M.hits + '/' + M.need + (M.flash > 0 ? M.last : ''); h.innerHTML = hs + (M.flash > 0 ? '<em>' + esc(M.last) + '</em>' : ''); }
    ht.style.width = (clamp(sg.bh || 0, 0, 1) * 100).toFixed(1) + '%';
  },
  solid: function(e){ return e.k === 'furn' ? 46 : e.k === 'anvil' ? 36 : e.k === 'pile' ? 48 : 0; },
  carryArt: function(k){ return k; },
  draw: function(g, e){
    if (e.k === 'pile'){ sgPic(g, 'pile', SG_ART.pile, e.x, e.y + 6, 120); return; }
    if (e.k === 'furn'){
      if (e.s){ var gl = g.createRadialGradient(e.x, e.y - 30, 4, e.x, e.y - 30, 90); gl.addColorStop(0, 'rgba(255,150,40,.4)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.beginPath(); g.arc(e.x, e.y - 30, 90, 0, 7); g.fill(); }
      sgPic(g, 'furn' + (e.s ? 1 : 0), function(){ return furnaceSvg(!!e.s); }, e.x, e.y + 6, 124);
      if (e.s === 'ore') sgBarDraw(g, e.x, e.y - 150, e.a, '#ffb13a', 60);
      if (e.s === 'hot') sgPic(g, 'barhot', SG_ART.bar, e.x, e.y - 128 + Math.sin(sg.t * 5) * 4, 58);
      return;
    }
    if (e.k === 'anvil'){
      sgPic(g, 'anvil' + (e.d ? 1 : 0), sgItem('anvil', e.d ? 1 : 0), e.x, e.y + 6, 96);
    }
  }
};

/* ===== Firemaking: Beacon Keeper ===== */
SG_GAMES.fire = { name: 'Beacon Keeper', verb: 'Use', hint: 'Grab a log from the pile in the middle.',
  intro: 'The beacons on the cliff must stay lit through the storm. Carry logs from the pile to keep them burning while rain clouds and gusts try to put them out.',
  how: 'Press the action button at the log pile to pick up a log, then at a beacon to throw it on. Saving a beacon that is almost out is worth more, and relighting one that went out costs you points. Rain clouds drain the beacons under them, and gusts blow along the red lanes.',
  goal: 'Keep every beacon burning!',
  land: { rim: '#c9a27a', top: '#b07a50', bot: '#7a4a2c', spot: ['rgba(60,20,10,.25)', 'rgba(255,190,120,.18)'] }, sky: ['#3a2a5a', '#e08a5a'], cloud: 'rgba(80,70,100,.25)',
  need: [26, 31, 36],
  decor: function(R){ return sgRing(R, 11, 0.86, 0.96, ['rock', 'torches', 'tent', 'barrels', 'rock'], 84); },
  wave: function(w){
    sg.st = { rain: 6, gust: 7 };
    if (!sgAll('beacon').length){
      sgNew('logs', 600, 440);
      var n = sg.mul > 2 ? 8 : 6;
      for (var i = 0; i < n; i++){ var a = -Math.PI / 2 + i / n * 6.283 + 0.25; sgNew('beacon', 600 + Math.cos(a) * 560 * 0.66, 430 + Math.sin(a) * 340 * 0.62, { s: '1', a: rand(0.6, 0.9) }); }
    }
    sg.E = sg.E.filter(function(e){ return e.k !== 'rain'; });
    sgAll('beacon').forEach(function(b){ if (b.s !== '1' || b.a < 0.5){ b.s = '1'; b.a = rand(0.55, 0.85); } });
  },
  tick: function(dt, k){
    var S = sg.st, rains = sgAll('rain'), drain = 0.022 * (0.85 + 0.15 * k) * Math.pow(sg.mul, 0.85) * dt;
    sgAll('beacon').forEach(function(b){
      if (b.s !== '1') return;
      var wet = rains.some(function(r){ return Math.hypot(r.x - b.x, (r.y - b.y) * 1.3) < 100; });
      b.a -= drain + (wet ? 0.12 * dt : 0); b.b = wet ? 1 : 0;
      if (b.a <= 0){ b.a = 0; b.s = '0'; sgFx({ k: 'puff', x: b.x, y: b.y - 50, t: 0.9, T: 0.9, c: 'rgba(90,80,100,.8)' }); sgBad(2, b.x, b.y - 120, 'Beacon out!'); sgRs('wbad'); }
    });
    rains.forEach(function(r){ r.x += r.c * dt; r.y += Math.sin(sg.t * 0.7 + r.id) * 8 * dt; r.d -= dt; if (r.d <= 0 || r.x < -100 || r.x > 1300) sgDel(r); });
    if ((S.rain -= dt) <= 0){
      S.rain = rand(7, 10) * sgRate(1);
      if (rains.length < 1 + Math.floor(sg.w / 2) + (sg.mul > 1 ? 1 : 0)){ var dir = Math.random() < 0.5 ? 1 : -1; sgNew('rain', dir > 0 ? 40 : 1160, rand(250, 610), { c: dir * rand(45, 70), d: 22 }); }
    }
    if ((S.gust -= dt) <= 0){
      S.gust = rand(6, 8) * sgRate(1);
      var a = Math.random() * Math.PI, cx = 600 + rand(-120, 120), cy = 430 + rand(-60, 60), L = 700;
      sgHz({ k: 'l', x: cx - Math.cos(a) * L, y: cy - Math.sin(a) * L * 0.6, x2: cx + Math.cos(a) * L, y2: cy + Math.sin(a) * L * 0.6, r: 46, T: 1.6, dmg: 0.1, s: 'gust', col: 'rgba(255,255,255,.9)' });
    }
  },
  impact: function(h){
    if (h.s !== 'gust') return;
    sgAll('beacon').forEach(function(b){ if (b.s === '1' && sgInHz(h, b.x, b.y)){ b.a = Math.max(0.01, b.a - 0.3); sgTxt(b.x, b.y - 120, 'Gust!', '#fff'); } });
  },
  pick: function(p){
    var lg = sgNear(p, function(o){ return o.k === 'logs'; }, 110), b = sgNear(p, function(o){ return o.k === 'beacon'; }, 100);
    if (p.cr === 'log'){ if (b){ if (b.s === '1' && b.a >= 0.92) return { msg: 'It is blazing already!' }; return { t: 'fuel', id: b.id }; } return { msg: 'Throw it on a beacon!' }; }
    if (lg) return { t: 'log', id: lg.id };
    if (b) return { msg: 'Bring a log from the pile.' };
    return null;
  },
  ev: function(p, t, e){
    if (!e) return;
    if (t === 'log' && e.k === 'logs' && !p.cr){ p.cr = 'log'; return; }
    if (t !== 'fuel' || e.k !== 'beacon' || p.cr !== 'log') return;
    p.cr = '';
    sgFx({ k: 'spark', x: e.x, y: e.y - 60, t: 0.5, T: 0.5, c: '#ffb13a' });
    if (e.s !== '1'){ e.s = '1'; e.a = 0.35; sgTxt(e.x, e.y - 120, 'Relit', '#ffd23e'); return; }
    var low = e.a < 0.3; e.a = Math.min(1, e.a + 0.35);
    sgPts(p, low ? 3 : 1, e.x, e.y - 120, low ? 'Saved!' : '');
    sgFood(e.x, e.y + 40, 0.06);
  },
  solid: function(e){ return e.k === 'beacon' ? 34 : e.k === 'logs' ? 52 : 0; },
  carryArt: function(k){ return k; },
  draw: function(g, e){
    if (e.k === 'logs'){ sgPic(g, 'logs', SG_ART.logs, e.x, e.y + 6, 120); return; }
    if (e.k === 'beacon'){
      var lit = e.s === '1';
      if (lit){ var r0 = 40 + e.a * 70, gl = g.createRadialGradient(e.x, e.y - 50, 4, e.x, e.y - 50, r0); gl.addColorStop(0, 'rgba(255,170,60,' + (0.25 + 0.3 * e.a) + ')'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.beginPath(); g.arc(e.x, e.y - 50, r0, 0, 7); g.fill(); }
      sgPic(g, 'beacon' + (lit ? 1 : 0), sgItem('brazier', lit ? 1 : 0), e.x, e.y + 6, 92);
      sgBarDraw(g, e.x, e.y + 22, e.a, !lit ? '#7a7488' : e.a < 0.3 ? '#ff5a4a' : e.a < 0.6 ? '#ffd23e' : '#ff9a3a', 56);
      if (!lit){ g.font = '900 15px system-ui, sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.strokeStyle = 'rgba(30,20,50,.85)'; g.lineWidth = 4; g.strokeText('OUT', e.x, e.y - 96); g.fillText('OUT', e.x, e.y - 96); }
    }
  },
  over: function(g){
    sgAll('rain').forEach(function(r){
      g.fillStyle = 'rgba(40,60,110,.22)'; g.beginPath(); g.ellipse(r.x, r.y, 100, 76, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(170,200,255,.7)'; g.lineWidth = 2;
      for (var i = 0; i < 9; i++){ var rx = r.x - 70 + i * 18, ry = r.y - 160 + ((sg.t * 300 + i * 37) % 150); g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 4, ry + 14); g.stroke(); }
      sgPic(g, 'cloud', SG_ART.cloud, r.x, r.y - 120, 200);
    });
  }
};

/* ===== Gravedigging: Restless Graves ===== */
SG_GAMES.grave = { name: 'Restless Graves', verb: 'Dig', hint: 'Walk to a glowing grave.',
  intro: 'It is a restless night in the graveyard. Graves start to glow as skeletons try to climb out: dig up their bones first! If a grave opens, knock its skeleton back down.',
  how: 'Keep pressing the action button next to a glowing grave to dig it up before its timer runs out. A skeleton that gets out chases you and swings (red circle): hit it a few times to put it back down.',
  goal: 'Dig up the glowing graves before the skeletons get out!',
  land: { rim: '#6a7a5a', top: '#4a5e46', bot: '#2a3a2a', spot: ['rgba(10,20,10,.35)', 'rgba(140,255,190,.08)'] }, sky: ['#0e0a24', '#3a2a5a'], cloud: 'rgba(120,110,170,.15)',
  need: [26, 31, 36],
  decor: function(R){ return sgRing(R, 12, 0.84, 0.95, ['pumpkins', 'cryptgate', 'lamp', 'rock', 'bush'], 84); },
  wave: function(w){
    sg.st = { stir: 1 };
    if (!sgAll('grave').length){ for (var r = 0; r < 3; r++) for (var c = 0; c < 5; c++) sgNew('grave', 600 + (c - 2) * 185 + (r === 1 ? 50 : 0), 430 + (r - 1) * 165 - 20, { s: 'calm', b: 6 }); }
    sgAll('grave').forEach(function(g){ g.s = 'calm'; g.a = 0; g.c = 0; });
  },
  tick: function(dt, k){
    var S = sg.st, gs = sgAll('grave'), stir = gs.filter(function(g){ return g.s === 'stir'; }).length, max = Math.round((2 + sg.w * 0.5) * Math.sqrt(sg.mul));
    gs.forEach(function(g){
      if (g.s !== 'stir') return;
      g.c -= dt;
      if (g.c <= 0){
        g.s = 'open'; g.a = 0; sgRs('wbad');
        sgNew('mob', g.x, g.y + 30, { s: 'skel', a: 4, b: 1, h: g.id });
        sgFx({ k: 'poof', x: g.x, y: g.y - 20, t: 0.6, T: 0.6, c: 'rgba(122,255,196,.7)' }); sgTxt(g.x, g.y - 120, 'It got out!', '#7affc4');
      }
    });
    if ((S.stir -= dt) <= 0 && stir < max){
      S.stir = rand(2.4, 3.6) * sgRate(1);
      var calm = gs.filter(function(g){ return g.s === 'calm'; }), g0 = calm[Math.floor(Math.random() * calm.length)];
      if (g0){ g0.s = 'stir'; g0.a = 0; g0.d = g0.c = rand(9, 11) / Math.min(1.5, Math.sqrt(k)); }
    }
  },
  mobDown: function(m){ var g = sgById(m.h); if (g){ g.s = 'calm'; g.a = 0; } },
  pick: function(p){
    var g = sgNear(p, function(o){ return o.k === 'grave' && o.s === 'stir'; });
    if (g) return { t: 'dig', id: g.id };
    var any = sgNear(p, function(o){ return o.k === 'grave'; });
    if (any) return { msg: any.s === 'open' ? 'Knock its skeleton down!' : 'This one is resting.' };
    return null;
  },
  ev: function(p, t, e){
    if (t !== 'dig' || !e || e.k !== 'grave' || e.s !== 'stir') return;
    e.a += 1; sgFx({ k: 'puff', x: e.x + rand(-20, 20), y: e.y + 10, t: 0.4, T: 0.4, c: 'rgba(120,95,70,.8)' });
    if (e.a >= e.b){ e.s = 'calm'; e.a = 0; sgPts(p, 2, e.x, e.y - 120, 'Bones!'); sgFood(e.x + 40, e.y + 30, 0.08); sgFx({ k: 'ring', x: e.x, y: e.y, t: 0.5, T: 0.5, c: '#ede6d2' }); }
  },
  solid: function(e){ return e.k === 'grave' ? 30 : 0; },
  draw: function(g, e){
    var stir = e.s === 'stir', open = e.s === 'open';
    if (stir){ var u = 1 - e.c / (e.d || 10), gl = g.createRadialGradient(e.x, e.y - 20, 4, e.x, e.y - 20, 80); gl.addColorStop(0, 'rgba(122,255,196,' + (0.3 + 0.4 * u) + ')'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.beginPath(); g.arc(e.x, e.y - 20, 80, 0, 7); g.fill(); }
    sgPic(g, open ? 'hole' : 'mound', SG_ART[open ? 'hole' : 'mound'], e.x, e.y + 34, 90);
    var sh = stir ? Math.sin(sg.t * (14 + 20 * (1 - e.c / (e.d || 10)))) * 3 : 0;
    g.save(); g.translate(e.x + sh, e.y); if (open) g.rotate(-0.35);
    sgPic(g, 'tomb', sgItem('tomb', 0), 0, 0, 74);
    g.restore();
    if (stir){ sgBarDraw(g, e.x, e.y - 92, e.c / (e.d || 10), e.c < 3 ? '#ff5a4a' : '#7affc4', 56); if (e.a > 0) sgBarDraw(g, e.x, e.y - 108, e.a / e.b, '#e6c08c', 56); }
  }
};

