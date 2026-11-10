// a player for the Elemental Kitchen: works out what the oldest order needs and does the next step.
// window.__chefBot({ slot }) — with several bots in co-op each one plans by itself (they still help each other through the counters)
window.__chefBot = function(opts){
  opts = opts || {};
  var sg = window.__sg, DISH = window.__CH_DISH, ST = window.__CH_ST;
  function d(a, b){ return Math.hypot(a.x - b.x, (a.y - b.y) * 1.2); }
  function all(k){ return sg.E.filter(function(e){ return e.k === k; }); }
  function stations(){ return sg.E.filter(function(e){ return ST[e.k]; }); }
  function near(me, list){ var best = null, bd = 1e9; list.forEach(function(e){ var q = d(me, e); if (q < bd){ bd = q; best = e; } }); return best; }
  function isPlate(s){ return typeof s === 'string' && s.charAt(0) === 'P'; }
  function parts(s){ return isPlate(s) && s.length > 2 ? s.slice(2).split('+') : []; }
  function lay(){ return window.__CH_LAY[sg.chL || 1]; }
  function fits(plate, part, dishKey){
    var ps = parts(plate); if (ps.indexOf(part) >= 0) return false;
    var all2 = ps.concat([part]);
    var ks = dishKey ? [dishKey] : lay().dishes;
    return ks.some(function(k){ var c = DISH[k].c; return all2.every(function(q){ return c.indexOf(q) >= 0; }); });
  }
  function dishOf(ps){ var key = ps.slice().sort().join('+'), o = ''; Object.keys(DISH).forEach(function(k){ if (DISH[k].c.join('+') === key) o = k; }); return o; }
  function inHz(h, x, y){
    if (h.k === 'c') return Math.hypot(x - h.x, (y - h.y) * 1.25) < h.r + 12;
    var dx = h.x2 - h.x, dy = h.y2 - h.y, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - h.x) * dx + (y - h.y) * dy) / L2));
    return Math.hypot(h.x + dx * t - x, h.y + dy * t - y) < h.r + 12;
  }
  function freeCtr(me){ return near(me, all('ctr').filter(function(c){ return !c.s; })); }
  function orders(){ return all('ord').sort(function(a, b){ return a.a - b.a; }); }
  /* where a part can be picked up ready right now */
  function readyAt(m){
    return stations().filter(function(e){
      if (e.k === 'ctr') return e.s === m;
      var T = ST[e.k];
      if (T.mode === 'work') return e.s === m;
      if (T.mode === 'cook') return e.c === 2 && e.s === m;
      return false;
    });
  }
  function potCount(ty){ var n = 0; all('pot').forEach(function(p){ if (p.c === 0 && p.s && p.s.split(',')[0] === ty) n = Math.max(n, p.s.split(',').length); }); return n; }
  function itemCount(m){ var n = 0; sg.E.forEach(function(e){ if (e.s === m && (e.k === 'ctr' || e.k === 'chop' || e.k === 'mix')) n++; }); sg.P.forEach(function(p){ if (p.cr === m) n++; }); return n; }
  /* is this part of a dish on its way (cooking or being prepared)? */
  function onWay(m){
    if (readyAt(m).length) return 'ready';
    if (m === 'herb') return 'ready';
    if (m === 'soupT' || m === 'soupM'){
      var ty = m === 'soupT' ? 'tomC' : 'shrC', raw = m === 'soupT' ? 'tom' : 'shr';
      if (all('pot').some(function(p){ return p.c === 1 && p.s.indexOf(ty) === 0; })) return 'cook';
      var have = potCount(ty) + itemCount(ty) + itemCount(raw);
      return have >= 3 ? 'cook' : 'none';
    }
    var chain = { tomC: ['tom'], fshG: ['fshC', 'fsh'], bread: ['dough'], ice: ['cream', 'ber'] }[m] || [];
    if (stations().some(function(e){ return ST[e.k].mode === 'cook' && e.c === 1 && ST[e.k].io && ST[e.k].io[e.s] === m; })) return 'cook';
    if (chain.some(function(q){ return itemCount(q) > 0 || stations().some(function(e){ return ST[e.k].mode === 'cook' && e.c === 1 && e.s === q; }); })) return 'cook';
    return 'none';
  }
  var RAW = { tomC: 'tom', soupT: 'tom', soupM: 'shr', fshG: 'fsh', bread: 'dough', ice: 'ber' };
  function plan(me){
    var cr = me.cr || '', ords = orders();
    if (cr === 'burnt') return all('trash')[0];
    if (isPlate(cr)){
      var ps = parts(cr), dk = dishOf(ps);
      if (dk && ords.some(function(o){ return o.s === dk; })) return all('serve')[0];
      var o = ords.filter(function(o){ return ps.every(function(q){ return DISH[o.s].c.indexOf(q) >= 0; }); })[0];
      if (!o){ return all('trash')[0]; }
      var miss = DISH[o.s].c.filter(function(q){ return ps.indexOf(q) < 0; });
      for (var i = 0; i < miss.length; i++){
        var m = miss[i], src = near(me, readyAt(m));
        if (m.indexOf('soup') === 0 && ps.length) continue;
        if (src) return src;
        if (m === 'herb') return all('plant')[0];
      }
      return freeCtr(me) || all('trash')[0];      /* park the plate */
    }
    if (cr === 'tom' || cr === 'shr' || cr === 'fsh') return near(me, all('chop').filter(function(c){ return !c.s; })) || freeCtr(me);
    if (cr === 'dough') return near(me, all('oven').filter(function(c){ return !c.c && !c.s; })) || freeCtr(me);
    if (cr === 'ber') return near(me, all('mix').filter(function(c){ return !c.s; })) || freeCtr(me);
    if (cr === 'cream') return near(me, all('chill').filter(function(c){ return !c.c && !c.s; })) || freeCtr(me);
    if (cr === 'fshC') return near(me, all('grill').filter(function(c){ return !c.c && !c.s; })) || freeCtr(me);
    if (cr === 'tomC' || cr === 'shrC'){
      var wantSoup = ords.some(function(o){ return o.s === (cr === 'tomC' ? 'soupT' : 'soupM'); });
      var pot = all('pot').filter(function(p){ return p.c === 0 && (!p.s || p.s.split(',')[0] === cr); }).sort(function(a, b){ return (b.s ? b.s.length : 0) - (a.s ? a.s.length : 0); })[0];
      var plateC = near(me, all('ctr').filter(function(c){ return isPlate(c.s) && fits(c.s, cr); }));
      if (cr === 'tomC' && plateC && ords.some(function(o){ return o.s === 'salad'; })) return plateC;
      if (wantSoup && pot) return pot;
      if (plateC) return plateC;
      if (pot && cr === 'shrC') return pot;
      return freeCtr(me) || pot;
    }
    if (cr){ var pc = near(me, all('ctr').filter(function(c){ return isPlate(c.s) && fits(c.s, cr); })); return pc || freeCtr(me) || all('trash')[0]; }
    /* empty hands */
    var bad = near(me, stations().filter(function(e){ return e.c === 3; })); if (bad) return bad;
    var wk = near(me, stations().filter(function(e){ var T = ST[e.k]; return T.mode === 'work' && e.s && T.io[e.s]; })); if (wk) return wk;
    /* finished food first, before it burns: soup needs a plate, the rest is taken off */
    var doneSoup = all('pot').filter(function(p){ return p.c === 2; })[0], rk0 = all('rack')[0];
    if (doneSoup){ var ep = near(me, all('ctr').filter(function(c){ return c.s === 'P'; })); if (ep) return ep; if (rk0 && rk0.a > 0) return rk0; if (rk0 && rk0.b > 0) return all('sink')[0]; }
    var doneX = near(me, stations().filter(function(e){ return ['grill', 'oven', 'chill'].indexOf(e.k) >= 0 && e.c === 2; })); if (doneX) return doneX;
    /* move things along: chopped food to the pot or grill, cream to the chill box, parked raw food to a free board */
    var potFree = function(ty){ return all('pot').some(function(p){ return p.c === 0 && (!p.s || (p.s.split(',')[0] === ty && p.s.split(',').length < 3)); }); };
    var idle = function(k){ return all(k).some(function(c){ return !c.c && !c.s; }); };
    var mv = near(me, sg.E.filter(function(e){
      if (!(e.k === 'chop' || e.k === 'mix' || e.k === 'ctr') || !e.s) return false;
      if (e.s === 'shrC') return potFree('shrC');
      if (e.s === 'tomC') return (ords.some(function(o){ return o.s === 'soupT'; }) && potFree('tomC')) || all('ctr').some(function(c){ return isPlate(c.s) && fits(c.s, 'tomC'); });
      if (e.s === 'fshC') return idle('grill');
      if (e.s === 'cream') return idle('chill');
      if (e.k === 'ctr' && (e.s === 'tom' || e.s === 'shr' || e.s === 'fsh')) return all('chop').some(function(c){ return !c.s; });
      if (e.k === 'ctr' && e.s === 'dough') return idle('oven');
      if (e.k === 'ctr' && e.s === 'ber') return all('mix').some(function(c){ return !c.s; });
      return false;
    }));
    if (mv) return mv;
    var rack = all('rack')[0];
    for (var j = 0; j < ords.length; j++){
      var D = DISH[ords[j].s];
      var st = D.c.map(onWay);
      for (var q = 0; q < D.c.length; q++) if (st[q] === 'none' && RAW[D.c[q]]) return all('crate').filter(function(c){ return c.s === RAW[D.c[q]]; })[0];
      if (st.every(function(x){ return x === 'ready'; })){
        var parked = near(me, all('ctr').filter(function(c){ return isPlate(c.s) && parts(c.s).every(function(p0){ return D.c.indexOf(p0) >= 0; }); }));
        if (parked) return parked;
        if (rack && rack.a > 0) return rack;
        if (rack && rack.b > 0) return all('sink')[0];
      }
    }
    var lone = near(me, stations().filter(function(e){ return ['grill', 'oven', 'chill'].indexOf(e.k) >= 0 && e.c === 2; })); if (lone) return lone;
    if (rack && rack.b > 0 && rack.a < 2) return all('sink')[0];
    return null;
  }
  /* a spot next to the station where it is the closest one */
  function standAt(me, t){
    var cand = [];
    [44, 58, 72].forEach(function(r){ for (var i = 0; i < 12; i++){ var an = i / 12 * 6.283; cand.push({ x: t.x + Math.cos(an) * r, y: t.y + Math.sin(an) * r / 1.2 + 4 }); } });
    var Gc = window.__SG.chef;
    cand = cand.filter(function(p){
      if (!window.__sgWalk(p.x, p.y)) return false;
      var r = Gc.pick({ x: p.x, y: p.y, cr: me.cr, c: me.c });
      return r && r.id === t.id;
    });
    cand.sort(function(a, b){ return d(me, a) - d(me, b); });
    return cand[0] || { x: t.x, y: t.y + 50 };
  }
  clearInterval(window.__chefBotT);
  var lastT = null, stuck = 0, lastPos = null;
  window.__chefBotT = setInterval(function(){
    if (!sg.open || sg.phase !== 'play'){ sg.keys.atk = false; return; }
    var me = sg.hero; if (!me || me.ko > 0) return;
    var hz = sg.H.filter(function(h){ return !h.hit && inHz(h, me.x, me.y); })[0];
    if (hz && !opts.noDodge){
      var ax, ay; if (hz.k === 'c'){ ax = me.x - hz.x; ay = me.y - hz.y; } else { ax = 0; ay = me.y < hz.y ? -1 : 1; }
      var l = Math.hypot(ax, ay) || 1; me.goal = 0; me.mv = { x: me.x + ax / l * 120, y: me.y + ay / l * 100 }; return;
    }
    var mob = near(me, all('mob')); if (mob && d(me, mob) < 150){ if (d(me, mob) < 80){ me.mv = null; window.__sgAct(true); } else me.mv = { x: mob.x, y: mob.y }; return; }
    var food = all('food').filter(function(f){ return me.hp < me.maxhp * 0.6 && d(me, f) < 300; })[0];
    if (food){ me.mv = { x: food.x, y: food.y }; return; }
    var t; try { t = plan(me); } catch (err){ window.__chefBotErr = String(err && err.stack || err); }
    window.__chefBotLast = t ? t.k + ':' + (t.s || '') + '@' + Math.round(t.x) + ',' + Math.round(t.y) + ' me ' + Math.round(me.x) + ',' + Math.round(me.y) : 'idle';
    if (!t) return;
    var a = window.__sgPick(me), te = a && a.id ? window.__sgById(a.id) : null; window.__chefBotPick = a ? (a.t || a.msg) + (te ? ' ' + te.k : '') : '-';
    if (te === t && !a.msg){ me.mv = null; window.__sgAct(true); return; }
    if (a && a.msg && te === t && d(me, t) < 70){ window.__chefBotMsg = a.msg; }
    var sp = standAt(me, t);
    me.goal = 0; me.mv = sp;
  }, 90);
};
