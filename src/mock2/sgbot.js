// a simple player for the skill challenges: walks to the next job, presses the button, dodges red warnings
window.__sgBot = function(opts){
  opts = opts || {};
  var sg = window.__sg, R = 84;
  function d(a, b){ return Math.hypot(a.x - b.x, (a.y - b.y) * 1.2); }
  function all(k){ return sg.E.filter(function(e){ return e.k === k; }); }
  function near(me, list){ var best = null, bd = 1e9; list.forEach(function(e){ var q = d(me, e); if (q < bd){ bd = q; best = e; } }); return best; }
  function inHz(h, x, y){
    if (h.k === 'c') return Math.hypot(x - h.x, (y - h.y) * 1.25) < h.r + 12;
    var dx = h.x2 - h.x, dy = h.y2 - h.y, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - h.x) * dx + (y - h.y) * dy) / L2));
    return Math.hypot(h.x + dx * t - x, h.y + dy * t - y) < h.r + 12;
  }
  function target(me){
    var a = sg.area, cr = me.cr || '';
    var mob = near(me, all('mob')); if (mob && d(me, mob) < 160) return mob;
    if (a === 'mine') return near(me, all('vein'));
    if (a === 'forest') return near(me, all('tree').filter(function(e){ return e.s === 'tree' || e.s === 'old'; }));
    if (a === 'grave') return near(me, all('grave').filter(function(e){ return e.s === 'stir'; }));
    if (a === 'fish'){ var sp = near(me, all('spot').filter(function(e){ return !e.d || e.d === me.slot + 1; })); if (!sp) return null; var L = { x: 600, y: 410 }, ux = sp.x - L.x, uy = sp.y - L.y, D0 = Math.pow(ux / 300, 2) + Math.pow(uy / 150, 2), k = Math.sqrt(1.3 / D0); return { id: sp.id, x: L.x + ux * k, y: L.y + uy * k, fish: 1 }; }
    if (a === 'fire'){ if (cr === 'log'){ var bs = all('beacon').filter(function(b){ return b.s !== '1' || b.a < 0.9; }).sort(function(p, q){ return (p.s === '1' ? p.a : -1) - (q.s === '1' ? q.a : -1); }); return bs[0] || null; } return all('logs')[0]; }
    if (a === 'smith'){
      if (cr === 'ore' || cr === 'cold') return near(me, all('furn').filter(function(f){ return !f.s; }));
      if (cr === 'bar') return near(me, all('anvil').filter(function(f){ return !f.d || f.d === me.slot + 1; }));
      var hot = near(me, all('furn').filter(function(f){ return f.s === 'hot'; })); if (hot) return hot;
      if (all('furn').some(function(f){ return !f.s; })) return all('pile')[0];
      return null;
    }
    if (a === 'cook'){
      var st = all('stove');
      if (cr === 'raw') return near(me, st.filter(function(s){ return !s.s; })) || near(me, st.filter(function(s){ return s.s === 'raw'; }));
      if (cr === 'done') return near(me, all('cust'));
      var hot2 = st.filter(function(s){ return s.s === 'raw' && s.a < 0.62; }).sort(function(p, q){ return p.a - q.a; })[0]; if (hot2) return hot2;
      var dn = near(me, st.filter(function(s){ return s.s === 'done' || s.s === 'burnt'; })); if (dn && all('cust').length) return dn;
      if (st.some(function(s){ return !s.s; })) return all('basket')[0];
      return near(me, st.filter(function(s){ return s.s === 'raw' && s.a < 0.75; }));
    }
    if (a === 'potion'){
      var ords = all('ord').sort(function(p, q){ return p.a - q.a; }), cs = all('caul');
      if (cr){
        var good = cs.filter(function(c){ return ords.some(function(o){ return o.s.indexOf(c.s + cr) === 0; }) && !(sg.claim && sg.claim[c.id] && sg.claim[c.id] !== me.slot + 1); });
        return near(me, good) || near(me, cs.filter(function(c){ return !c.s; })) || cs[0];
      }
      var bad = cs.filter(function(c){ return c.s && !ords.some(function(o){ return o.s.indexOf(c.s) === 0; }); })[0]; if (bad) return bad;
      for (var i = 0; i < ords.length; i++){
        var o = ords[i], c0 = cs.filter(function(c){ return c.s && o.s.indexOf(c.s) === 0 && c.s.length < o.s.length; })[0] || cs.filter(function(c){ return !c.s; })[0];
        if (c0){ var need = o.s[c0.s.length]; return all('shelf').filter(function(s){ return s.s === need; })[0]; }
      }
      return null;
    }
    return null;
  }
  clearInterval(window.__sgBotT);
  window.__sgBotT = setInterval(function(){
    if (!sg.open || sg.phase !== 'play') { sg.keys.atk = false; return; }
    var me = sg.hero; if (!me || me.ko > 0) return;
    var M = sg.mini;
    if (M){
      if (M.k === 'reel'){ sg.keys.atk = M.f > M.z + (M.zv > 0.4 ? 0.05 : -0.02); }
      if (M.k === 'forge' && Math.abs(M.m - M.zc) < M.zw * (opts.sloppy ? 0.5 : 0.3) && !(M.cool > 0)){ M.cool = 1; window.__sgAct(true); setTimeout(function(){ M.cool = 0; }, 150); }
      return;
    }
    sg.keys.atk = false;
    /* dodge */
    var hz = sg.H.filter(function(h){ return !h.hit && inHz(h, me.x, me.y); })[0];
    if (hz && !opts.noDodge){
      var ax, ay;
      if (hz.k === 'c'){ ax = me.x - hz.x; ay = me.y - hz.y; } else { var dx = hz.x2 - hz.x, dy = hz.y2 - hz.y; ax = -dy; ay = dx; var side = (me.x - hz.x) * ax + (me.y - hz.y) * ay; if (side < 0){ ax = -ax; ay = -ay; } }
      var l = Math.hypot(ax, ay) || 1; me.goal = 0; me.mv = { x: me.x + ax / l * 140, y: me.y + ay / l * 100 }; return;
    }
    var food = all('food').filter(function(f){ return me.hp < me.maxhp * 0.7 && d(me, f) < 400; })[0];
    if (food){ me.goal = 0; me.mv = { x: food.x, y: food.y }; return; }
    var t = target(me);
    if (!t){ return; }
    var reach = t.fish ? 30 : (t.k === 'spot' ? 120 : 70);
    if (d(me, t) < reach){ me.mv = null; window.__sgAct(true); return; }
    me.goal = 0; me.mv = { x: t.x + (me.x < t.x ? -48 : 48), y: t.y + 14 };
    if (t.fish) me.mv = { x: t.x, y: t.y };
  }, 90);
};
