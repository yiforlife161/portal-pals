/* ---------- languages: the game is written in English; other languages are swapped in on screen ---------- */
(function(){
  'use strict';
  var LANG = 'en';
  try { LANG = localStorage.getItem('portalPals.lang') || 'en'; } catch (e) {}
  if (LANG !== 'sr') LANG = 'en';
  window.PP_LANG = LANG;
  document.documentElement.lang = LANG;
  if (LANG === 'en'){ window.ppTr = function(s){ return s; }; return; }
  var D = __DICT__, T = __TPL__, LC = {}, TPL = [], cache = new Map();
  function norm(s){ return s.replace(/\s+/g, ' '); }
  Object.keys(D).forEach(function(k){ LC[k.toLowerCase()] = D[k]; });
  T.forEach(function(p){
    var parts = p[0].split('§'), src = '^' + parts.map(function(x){ return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('(.*?)') + '$';
    TPL.push({ re: new RegExp(src), sr: p[1], len: p[0].length });
  });
  TPL.sort(function(a, b){ return b.len - a.len; });
  function fill(sr, caps){
    var i = 0;
    return sr.replace(/§(\d?)/g, function(m, n){ var c = n ? caps[+n - 1] : caps[i++]; return c === undefined ? '' : c; });
  }
  function core(c){
    if (D.hasOwnProperty(c)) return D[c];
    for (var i = 0; i < TPL.length; i++){
      var m = TPL[i].re.exec(c);
      if (m){ var caps = m.slice(1).map(function(x){ return /[A-Za-z]{2}/.test(x) ? tr(x) : x; }); return fill(TPL[i].sr, caps); }
    }
    var l = c.toLowerCase();
    if (LC.hasOwnProperty(l)){ var r = LC[l]; return c === l ? r.toLowerCase() : r; }
    var g, a, b;
    if ((g = /^(.+?) \+ (.+)$/.exec(c))){ a = tr(g[1]); b = tr(g[2]); if (a !== g[1] || b !== g[2]) return a + ' + ' + b; }
    if ((g = /^(.+) \(([^()]*)\)$/.exec(c))){ a = tr(g[1]); b = tr(g[2]); if (a !== g[1] || b !== g[2]) return a + ' (' + b + ')'; }
    if ((g = /^([+\-]?[\d][\d,.]*%?) (.+)$/.exec(c))){ a = tr(g[2]); if (a !== g[2]) return g[1] + ' ' + a; }
    return null;
  }
  function tr(s){
    if (typeof s !== 'string' || !/[A-Za-z]{2}/.test(s)) return s;
    var hit = cache.get(s); if (hit !== undefined) return hit;
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), c = norm(m[2]), r = core(c);
    var out = r === null ? s : m[1] + r + m[3];
    if (cache.size > 5000) cache.clear();
    cache.set(s, out);
    return out;
  }
  window.ppTr = tr;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, NOSCRIPT: 1 };
  var ATTRS = ['title', 'placeholder', 'aria-label'];
  function doText(n){
    var p = n.parentNode; if (!p || SKIP[p.nodeName] || (p.closest && p.closest('[data-notr]'))) return;
    var v = n.data, t = tr(v); if (t !== v) n.data = t;
  }
  function doEl(el){
    if (el.nodeName === 'SCRIPT' || el.nodeName === 'STYLE' || el.hasAttribute('data-notr')) return;
    for (var i = 0; i < ATTRS.length; i++){ var a = el.getAttribute(ATTRS[i]); if (a){ var t = tr(a); if (t !== a) el.setAttribute(ATTRS[i], t); } }
  }
  function walk(root){
    if (root.nodeType === 3){ doText(root); return; }
    if (root.nodeType !== 1) return;
    doEl(root);
    if (SKIP[root.nodeName] || root.hasAttribute('data-notr')) return;
    var w = document.createTreeWalker(root, 5, null), n;
    while ((n = w.nextNode())){ if (n.nodeType === 3) doText(n); else doEl(n); }
  }
  walk(document.body || document.documentElement);
  new MutationObserver(function(list){
    for (var i = 0; i < list.length; i++){
      var r = list[i];
      if (r.type === 'childList'){ for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]); }
      else if (r.type === 'characterData') doText(r.target);
      else if (r.type === 'attributes') doEl(r.target);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  /* words drawn on canvases (minigame banners, labels) */
  var P = CanvasRenderingContext2D.prototype;
  ['fillText', 'strokeText', 'measureText'].forEach(function(f){
    var o = P[f];
    P[f] = function(t){ var a = Array.prototype.slice.call(arguments); a[0] = tr(String(t)); return o.apply(this, a); };
  });
  ['alert', 'confirm', 'prompt'].forEach(function(f){ var o = window[f]; if (o) window[f] = function(t){ var a = Array.prototype.slice.call(arguments); a[0] = tr(String(t)); return o.apply(window, a); }; });
})();
