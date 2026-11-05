// in-page bot: walks the islands, carries keys/bombs to their locks, opens chests, fights, goes to the flag
window.__qbot = function(){
  if (window.__qbotT) clearInterval(window.__qbotT);
  window.__qbotLog = [];
  window.__qbotT = setInterval(function(){
    var qu = __qu, L = qu.L, me = qu.hero; if (!me || qu.phase !== 'play' || me.ko > 0) return;
    var isAt = function(p){ return __quIslAt(p.x, p.y); };
    // fight anything close
    var near = L.foes.filter(function(f){ return Math.hypot(f.x - me.x, f.y - me.y) < (me.ranged ? 150 : 110); });
    if (near.length){ near.sort(function(a, b){ return Math.hypot(a.x - me.x, a.y - me.y) - Math.hypot(b.x - me.x, b.y - me.y); }); qu.aim = { x: near[0].x, y: near[0].y - 10 }; __quTry(); }
    // islands reachable through open bridges
    var reach = {}; reach[isAt(me) >= 0 ? isAt(me) : (window.__lastIsl || 0)] = 1;
    var grow = true; while (grow){ grow = false; L.br.forEach(function(b){ if (b.st === 1 && (!!reach[b.a]) !== (!!reach[b.b])){ reach[b.a] = reach[b.b] = 1; grow = true; } }); }
    if (isAt(me) >= 0) window.__lastIsl = isAt(me);
    var goal = null, carrying = L.items.filter(function(i){ return i.by === (me.slot || 0) && i.k !== 'heart' && i.k !== 'food'; })[0] || null;
    if (carrying){
      var want = carrying.k === 'key' ? 'gate' : 'wall';
      var b = L.br.filter(function(b){ return b.st === 0 && b.fuse <= 0 && b.lock === want && (reach[b.a] || reach[b.b]); })[0];
      if (b) goal = { x: b.mx - b.ux * 60 * (reach[b.a] ? 1 : -1), y: b.my - b.uy * 60 * (reach[b.a] ? 1 : -1), isl: reach[b.a] ? b.a : b.b, end: true };
      else { // holding the wrong thing: swap it for one that opens a lock we can reach
        var sw = L.items.filter(function(i){ return i.by < 0 && i.k !== 'heart' && i.k !== 'food' && i.k !== carrying.k && reach[isAt(i)] && L.br.some(function(b2){ return b2.st === 0 && b2.lock === (i.k === 'key' ? 'gate' : 'wall') && (reach[b2.a] || reach[b2.b]); }); })[0];
        if (sw) goal = { x: sw.x, y: sw.y, isl: isAt(sw) };
      }
    } else {
      var it = L.items.filter(function(i){ return i.by < 0 && i.k !== 'heart' && i.k !== 'food' && reach[isAt(i)] && L.br.some(function(b){ return b.st === 0 && b.lock === (i.k === 'key' ? 'gate' : 'wall'); }); })[0];
      if (it) goal = { x: it.x, y: it.y, isl: isAt(it) };
      else { var ch = L.chests.filter(function(c){ return !c.op && reach[c.isl]; })[0]; if (ch) goal = { x: ch.x, y: ch.y - 10, isl: ch.isl }; }
      if (!goal && L.br.some(function(b){ return b.fuse > 0; })) return;      // wait for the bomb
      if (!goal) goal = { x: L.flag.x, y: L.flag.y, isl: L.N - 1 };
    }
    if (!goal) return;
    var key = goal.isl + ':' + Math.round(goal.x) + ':' + Math.round(goal.y), QB = window.__qb || (window.__qb = {});
    if (QB.key !== key || !QB.path){
      var from = window.__lastIsl || 0, prev = {}, q = [from]; prev[from] = -1;
      while (q.length){ var c = q.shift(); if (c === goal.isl) break; L.br.forEach(function(b, bi){ if (b.st !== 1) return; var o = b.a === c ? b.b : b.b === c ? b.a : -1; if (o >= 0 && prev[o] === undefined){ prev[o] = { from: c, b: bi }; q.push(o); } }); }
      var path = [], n = goal.isl;
      while (prev[n] && prev[n] !== -1){ var P = prev[n], B = L.br[P.b], fwd = B.a === P.from; path.unshift(fwd ? { x: B.x1, y: B.y1 } : { x: B.x2, y: B.y2 }, fwd ? { x: B.x2, y: B.y2 } : { x: B.x1, y: B.y1 }); n = P.from; }
      path.push({ x: goal.x, y: goal.y });
      QB.key = key; QB.path = path;
    }
    while (QB.path.length > 1 && Math.hypot(QB.path[0].x - me.x, QB.path[0].y - me.y) < 16) QB.path.shift();
    var tgt = QB.path[0];
    if (!near.length) me.mv = { x: tgt.x, y: tgt.y };
    else if (me.ranged) me.mv = Math.hypot(near[0].x - me.x, near[0].y - me.y) < 70 ? { x: me.x - 60 * Math.sign(near[0].x - me.x || 1), y: me.y } : null;
    else me.mv = { x: near[0].x - 34 * Math.sign(near[0].x - me.x || 1), y: near[0].y + 4 };
  }, 100);
};
