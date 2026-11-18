
/* ===== Elemental Kitchen (game key 'chef', building 'chefhall'): a cooking rush minigame on the skill challenge engine.
   Unlike the skill challenges it is a normal minigame: any pal can play, levels 1-3 plus Survival, it pays gold and pal xp
   (no skill xp), and it has its own hat, pet, cape and achievements. Every level is its own kitchen layout:
   1 Cottage Kitchen, 2 Sky Bridge Galley (two halves joined by a drawbridge and pass counters), 3 Midnight Crypt Kitchen
   (all 8 stations, gusts and gremlins). Survival goes through the three kitchens in turn.
   Every station has an element: a pal of that element works there twice as fast (or speeds up the cooking), so a
   party with different elements splits the jobs naturally. ---------- */
var CH_DISH = {
  salad: { name: 'Garden Salad', c: ['herb', 'tomC'], pts: 4, T: 52 },
  soupT: { name: 'Tomato Soup', c: ['soupT'], pts: 5, T: 62 },
  soupM: { name: 'Mushroom Soup', c: ['soupM'], pts: 5, T: 62 },
  fishp: { name: 'Herb Fish', c: ['fshG', 'herb'], pts: 6, T: 64 },
  sandw: { name: 'Fish Sandwich', c: ['bread', 'fshG'], pts: 7, T: 72 },
  icec:  { name: 'Starberry Ice Cream', c: ['ice'], pts: 7, T: 70 }
};
var CH_ITEM = { tom: 'Tomato', tomC: 'Chopped tomato', shr: 'Mushroom', shrC: 'Chopped mushroom', fsh: 'Fish', fshC: 'Fish fillet', fshG: 'Grilled fish',
  dough: 'Dough', bread: 'Bread', ber: 'Starberries', cream: 'Starberry cream', ice: 'Ice cream', herb: 'Herbs', soupT: 'Tomato soup', soupM: 'Mushroom soup', burnt: 'Burnt food' };
/* stations: element, what goes in and what comes out. work = press the button to make progress, cook = cooks by itself */
var CH_ST = {
  chop:  { name: 'Chopping board', el: 'earth', mode: 'work', io: { tom: 'tomC', shr: 'shrC', fsh: 'fshC' }, w: 0.25 },
  mix:   { name: 'Magic mixer', el: 'magic', mode: 'work', io: { ber: 'cream' }, w: 0.2 },
  plant: { name: 'Herb planter', el: 'life', mode: 'pick', w: 0.34 },
  sink:  { name: 'Sink', el: 'water', mode: 'wash', w: 0.25 },
  pot:   { name: 'Stove', el: 'fire', mode: 'cook', T: 8, burn: 11 },
  grill: { name: 'Spark grill', el: 'tech', mode: 'cook', io: { fshC: 'fshG' }, T: 6.5, burn: 9 },
  oven:  { name: 'Wind oven', el: 'air', mode: 'cook', io: { dough: 'bread' }, T: 7, burn: 10 },
  chill: { name: 'Crypt chill box', el: 'undead', mode: 'cook', io: { cream: 'ice' }, T: 5.5, burn: 0 },
  crate: { name: 'Crate' }, ctr: { name: 'Counter' }, rack: { name: 'Plate rack' }, serve: { name: 'Serving hatch' }, trash: { name: 'Bin' }
};
var CH_NEED = { 1: [16, 19, 22], 2: [17, 20, 23], 3: [20, 23, 26] };      /* points per wave, × players */
var CH_GOLD = { 1: 0.8, 2: 1.05, 3: 1.35 }, CH_XPK = 6.5, CH_WIN_GOLD = { 1: 25, 2: 40, 3: 60 }, CH_SURV_GOLD = 30;
/* the three kitchens. Spots are in the island's 1200 x 860 world (island centre 600, 430) */
var CH_LAY = {
  1: { name: 'Cottage Kitchen', dishes: ['salad', 'soupT', 'soupM'],
    land: { rim: '#e8d2a8', top: '#f4e4c4', bot: '#d8bf94', spot: ['rgba(140,90,40,.12)', 'rgba(255,255,255,.3)'] }, sky: ['#ffb27a', '#ffe8c8'], cloud: 'rgba(255,255,255,.55)',
    st: [['crate', 330, 235, 'tom'], ['crate', 450, 215, 'shr'], ['plant', 600, 205], ['rack', 750, 215], ['sink', 870, 240],
      ['ctr', 220, 430], ['ctr', 450, 430], ['chop', 540, 430], ['chop', 660, 430], ['ctr', 750, 430], ['ctr', 980, 430],
      ['pot', 360, 610], ['pot', 490, 645], ['serve', 720, 645], ['trash', 860, 605]],
    spawn: [[600, 530], [600, 330], [330, 430], [870, 430]], decor: ['flowerpot', 'barrels', 'crates', 'bush'] },
  2: { name: 'Sky Bridge Galley', dishes: ['salad', 'soupT', 'soupM', 'fishp', 'sandw'], gap: [545, 655], by: 430,
    land: { rim: '#c8d6f0', top: '#eef4ff', bot: '#cbdaf4', spot: ['rgba(90,130,200,.12)', 'rgba(255,255,255,.45)'] }, sky: ['#5aa8f0', '#d8ecff'], cloud: 'rgba(255,255,255,.7)',
    st: [['crate', 250, 300, 'tom'], ['crate', 205, 430, 'shr'], ['crate', 260, 560, 'fsh'], ['crate', 380, 245, 'dough'],
      ['chop', 430, 370], ['chop', 430, 510], ['plant', 370, 640], ['ctr', 300, 430],
      ['ctr', 600, 265], ['ctr', 600, 600],
      ['pot', 770, 300], ['pot', 900, 275], ['grill', 1010, 385], ['oven', 1000, 505], ['ctr', 800, 450], ['trash', 715, 565],
      ['rack', 755, 640], ['sink', 870, 650], ['serve', 965, 615]],
    spawn: [[440, 440], [770, 440], [330, 380], [880, 420]], decor: ['chimes', 'crates', 'flowerpot', 'barrels'] },
  3: { name: 'Midnight Crypt Kitchen', dishes: ['salad', 'soupT', 'soupM', 'fishp', 'sandw', 'icec'],
    land: { rim: '#7a7290', top: '#5a5274', bot: '#3a3452', spot: ['rgba(20,10,40,.3)', 'rgba(190,150,255,.12)'] }, sky: ['#120c2a', '#4a2a6a'], cloud: 'rgba(160,140,220,.18)',
    st: [['crate', 245, 330, 'tom'], ['crate', 245, 525, 'shr'], ['crate', 380, 210, 'fsh'], ['crate', 520, 190, 'dough'], ['crate', 680, 190, 'ber'], ['trash', 170, 430],
      ['chop', 420, 335], ['chop', 420, 540], ['plant', 830, 205], ['mix', 960, 315], ['chill', 1000, 455], ['oven', 925, 600],
      ['grill', 560, 665], ['pot', 700, 665], ['pot', 330, 645], ['sink', 830, 670],
      ['serve', 600, 345], ['rack', 600, 525], ['ctr', 515, 435], ['ctr', 685, 435]],
    spawn: [[600, 430], [760, 520], [440, 430], [780, 360]], decor: ['lamp', 'rock', 'crates', 'barrels'] }
};
function chLayNo(w){ return sg.surv ? ((Math.max(1, w) - 1) % 3) + 1 : (sg.lv || 1); }
function chLay(){ return CH_LAY[sg.chL || 1]; }
function chEl(e){ var T = CH_ST[e.k]; return T && T.el ? T.el : ''; }
/* a plate is 'P' or 'P:a+b' (its parts, sorted) */
function chPlate(s){ return typeof s === 'string' && s.charAt(0) === 'P'; }
function chParts(s){ return chPlate(s) && s.length > 2 ? s.slice(2).split('+') : []; }
function chPlateOf(parts){ return parts.length ? 'P:' + parts.slice().sort().join('+') : 'P'; }
function chDishOf(parts){
  var key = parts.slice().sort().join('+'), out = '';
  Object.keys(CH_DISH).forEach(function(k){ if (CH_DISH[k].c.join('+') === key) out = k; });
  return out;
}
/* can this part go on this plate? Only if some dish of this kitchen has all of them */
function chFits(plate, part){
  var ps = chParts(plate); if (ps.indexOf(part) >= 0) return false;
  var all = ps.concat([part]), L = chLay();
  return L.dishes.some(function(k){ var c = CH_DISH[k].c; return all.every(function(q){ return c.indexOf(q) >= 0; }); });
}
function chPlateable(item){ return ['tomC', 'herb', 'soupT', 'soupM', 'fshG', 'bread', 'ice'].indexOf(item) >= 0; }
function chMatch(p, e){ return !!(p && p.c && chEl(e) && p.c.element === chEl(e)); }

/* ---------- pictures ---------- */
var CH_ART = {
  tom: function(){ return E(50, 88, 26, 6, 'rgba(0,0,0,.2)', 0) + C(50, 56, 30, '#e8402c') + E(40, 46, 9, 6, 'rgba(255,255,255,.45)', 0) + P('M50 28L40 20L48 24L50 14L52 24L60 20Z', '#3fae4a', 2.2); },
  tomC: function(){ return E(50, 86, 34, 6, 'rgba(0,0,0,.2)', 0) + P('M14 74Q14 50 34 50Q54 50 54 74Z', '#e8402c') + P('M46 76Q46 52 66 52Q86 52 86 76Z', '#e8402c') + P('M30 58Q34 54 40 58M62 60Q66 56 72 60', '#ffd0c0', 0) + C(28, 66, 3, '#ffe0a0', 0) + C(40, 66, 3, '#ffe0a0', 0) + C(60, 68, 3, '#ffe0a0', 0) + C(72, 68, 3, '#ffe0a0', 0); },
  shrC: function(){ return E(50, 86, 34, 6, 'rgba(0,0,0,.2)', 0) + P('M12 74Q12 52 30 52Q48 52 48 74Z', '#c87a5a') + R(26, 66, 8, 12, '#f4ecd8', 2, 2) + P('M50 76Q50 54 68 54Q86 54 86 76Z', '#c87a5a') + R(64, 68, 8, 12, '#f4ecd8', 2, 2); },
  fshC: function(){ return E(50, 86, 34, 6, 'rgba(0,0,0,.2)', 0) + P('M14 66Q30 44 66 50Q88 54 86 70Q70 84 30 80Q14 78 14 66Z', '#ff9a8a') + L('M34 56Q38 66 34 76M50 54Q54 66 50 78M66 54Q70 66 66 76', '#ffd2c8', 2.6); },
  fshG: function(){ return E(50, 86, 34, 6, 'rgba(0,0,0,.2)', 0) + P('M14 66Q30 44 66 50Q88 54 86 70Q70 84 30 80Q14 78 14 66Z', '#e0943a') + L('M30 54L44 80M46 52L60 80M62 52L74 76', '#7a3e10', 3.2); },
  dough: function(){ return E(50, 86, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M18 74Q14 52 34 46Q50 36 68 46Q88 54 82 76Q50 84 18 74Z', '#f4e2c0') + E(40, 56, 8, 4, 'rgba(255,255,255,.6)', 0); },
  bread: function(){ return E(50, 88, 34, 6, 'rgba(0,0,0,.2)', 0) + P('M12 74Q10 44 50 40Q90 44 88 74Q50 84 12 74Z', '#d08a3a') + L('M30 52L36 64M48 48L52 62M66 52L64 64', '#f4d8a0', 3.4); },
  ber: function(){ return E(50, 88, 28, 6, 'rgba(0,0,0,.2)', 0) + '<polygon points="' + starPts(36, 60, 18, 9) + '" fill="#b04ae0" stroke="' + O + '" stroke-width="2.6" stroke-linejoin="round"/>' + '<polygon points="' + starPts(64, 58, 16, 8) + '" fill="#d070ff" stroke="' + O + '" stroke-width="2.6" stroke-linejoin="round"/>' + '<polygon points="' + starPts(50, 38, 14, 7) + '" fill="#c060f0" stroke="' + O + '" stroke-width="2.6" stroke-linejoin="round"/>' + L('M50 24V14', '#3fae4a', 3); },
  cream: function(){ return E(50, 88, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M14 54H86Q84 84 50 86Q16 84 14 54Z', '#f6f2ff') + P('M18 54Q30 34 50 40Q70 30 82 54Z', '#ffb0e8') + '<polygon points="' + starPts(40, 46, 5, 2.2) + '" fill="#fff6a0"/><polygon points="' + starPts(62, 44, 4, 1.8) + '" fill="#fff6a0"/>'; },
  ice: function(){ return E(50, 88, 30, 6, 'rgba(0,0,0,.2)', 0) + P('M18 56H82Q80 84 50 86Q20 84 18 56Z', '#bfe8ff') + C(38, 46, 15, '#d070ff') + C(62, 46, 15, '#ff9ad8') + C(50, 32, 14, '#f6f2ff') + L('M30 66L36 72M64 66L70 60', '#ffffff', 2.4) + '<polygon points="' + starPts(50, 20, 6, 2.6) + '" fill="#ffd23e" stroke="' + O + '" stroke-width="1.6"/>'; },
  soupT: function(){ return E(50, 88, 32, 6, 'rgba(0,0,0,.2)', 0) + P('M12 50H88Q86 84 50 86Q14 84 12 50Z', '#f6f2ea') + E(50, 50, 38, 9, '#e0482c', 2.4) + C(40, 50, 3, '#ffb09a', 0) + C(58, 48, 2.4, '#ffb09a', 0) + L('M38 34Q42 26 38 18M56 34Q60 26 56 18', 'rgba(255,255,255,.8)', 3); },
  soupM: function(){ return E(50, 88, 32, 6, 'rgba(0,0,0,.2)', 0) + P('M12 50H88Q86 84 50 86Q14 84 12 50Z', '#f6f2ea') + E(50, 50, 38, 9, '#a8744a', 2.4) + C(40, 50, 3.4, '#f4ecd8', 0) + C(60, 49, 3, '#f4ecd8', 0) + L('M38 34Q42 26 38 18M56 34Q60 26 56 18', 'rgba(255,255,255,.8)', 3); },
  plate: function(){ return E(50, 76, 42, 14, 'rgba(0,0,0,.15)', 0) + E(50, 70, 42, 14, '#ffffff') + E(50, 69, 28, 8, '#eef0f8', 2); },
  dirty: function(){ return E(50, 70, 42, 14, '#d8d2c0') + E(50, 69, 28, 8, '#c8bea4', 2) + C(40, 68, 4, '#a08a5a', 0) + C(60, 72, 3, '#a08a5a', 0); },
  /* stations (100 units, standing on y 90) */
  ctr: function(){ return E(50, 94, 46, 6, 'rgba(0,0,0,.2)', 0) + R(10, 52, 80, 40, '#b07a48', 4) + R(6, 44, 88, 14, '#e2b47a', 5) + L('M14 70H86', '#8a5a30', 2); },
  crate: function(){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(12, 46, 76, 46, '#c08a4a', 4) + L('M12 62H88M12 78H88', '#8a5a24', 3) + L('M20 48L80 90', '#8a5a24', 3); },
  chop: function(){ return CH_ART.ctr() + R(20, 38, 56, 16, '#f0d29a', 6, 2.6) + L('M26 44H70', '#d0a868', 2) + L('M78 44L94 30', '#8a8f9e', 5) + L('M76 46L80 42', '#5a3a1c', 6); },
  mix: function(){ return E(50, 94, 40, 6, 'rgba(0,0,0,.2)', 0) + R(34, 66, 32, 26, '#7a4ac0', 4) + P('M10 42H90Q86 74 50 76Q14 74 10 42Z', '#f6c928') + E(50, 42, 40, 9, '#fff3c0', 2.6) +
    '<polygon points="' + starPts(28, 22, 6, 2.6) + '" fill="#fff3b0"/><polygon points="' + starPts(74, 18, 5, 2.2) + '" fill="#fff3b0"/>' + L('M60 40L72 10', '#8a5e00', 4) + C(72, 10, 4, '#ffd23e', 2); },
  plant: function(){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(10, 58, 80, 34, '#8a5a34', 4) + R(14, 54, 72, 10, '#5a3a24', 3, 2) +
    P('M24 56Q18 34 28 26Q34 40 30 56Z', '#5cc85a', 2.2) + P('M40 56Q40 28 50 20Q58 34 50 56Z', '#4fae4a', 2.2) + P('M62 56Q64 32 76 28Q78 44 70 56Z', '#7ad96a', 2.2) + C(34, 40, 3, '#ffe0f0', 0) + C(66, 38, 3, '#ffe0f0', 0); },
  sink: function(){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(10, 52, 80, 40, '#9aa6b8', 4) + R(6, 44, 88, 14, '#d8e0ea', 5) + E(50, 50, 30, 6, '#3a8ad8', 2.4) + E(46, 49, 10, 2.4, 'rgba(255,255,255,.6)', 0) +
    L('M70 44V24Q70 18 62 18H56', '#8a96a8', 5) + C(56, 24, 3, '#7ac8ff', 0); },
  pot: function(on){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(10, 52, 80, 40, '#5a5a66', 4) + R(6, 44, 88, 14, '#3a3a44', 5) + (on ? P('M30 44Q34 30 40 40Q46 26 52 40Q58 30 64 44Z', '#ff8a2a', 2) : '') +
    P('M24 42Q24 14 50 14Q76 14 76 42Z', '#8d91a6') + E(50, 16, 26, 6, '#5a5e70', 2.4) + L('M18 26H26M74 26H82', '#5a5e70', 4) + R(18, 76, 14, 8, '#e8402c', 3, 2); },
  grill: function(on){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(12, 48, 76, 44, '#6a7488', 5) + R(8, 38, 84, 14, '#3a4258', 4) + L('M18 45H82', on ? '#ff8a2a' : '#8a96a8', 3) +
    L('M24 40V50M38 40V50M52 40V50M66 40V50M80 40V50', '#20283a', 2.4) + C(26, 72, 5, on ? '#5af0ff' : '#2a6a8a', 2) + C(42, 72, 5, on ? '#5af0ff' : '#2a6a8a', 2) + R(54, 66, 26, 12, '#20283a', 3, 2) + L('M58 72H76', '#5af0ff', 2); },
  oven: function(on){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + P('M10 92V54Q10 12 50 12Q90 12 90 54V92Z', '#d8e2f0') + P('M28 88V60Q28 40 50 40Q72 40 72 60V88Z', on ? '#ffb24a' : '#4a5470') +
    L('M20 30Q30 20 44 26Q54 30 50 36', '#7ab8ff', 3) + L('M58 22Q68 16 78 26', '#7ab8ff', 3) + C(50, 18, 4, '#ffffff', 2); },
  chill: function(on){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(10, 40, 80, 52, '#4a4460', 4) + R(6, 32, 88, 14, '#6a6288', 4) + L('M14 40L22 48M30 40L36 46M64 40L70 46M78 40L86 48', '#bfe8ff', 2.6) +
    P('M38 54Q38 44 50 44Q62 44 62 54Q62 62 56 62V68H44V62Q38 62 38 54Z', '#e8e0ff', 2.2) + C(45, 54, 3, '#4a4460', 0) + C(55, 54, 3, '#4a4460', 0) + (on ? C(50, 66, 30, 'rgba(154,88,216,.25)', 0) : ''); },
  rack: function(){ return E(50, 94, 44, 6, 'rgba(0,0,0,.2)', 0) + R(10, 60, 80, 32, '#b07a48', 4) + R(6, 52, 88, 12, '#e2b47a', 4) + L('M16 52V28M84 52V28M16 30H84', '#8a5a30', 4); },
  serve: function(){ return E(50, 94, 46, 6, 'rgba(0,0,0,.2)', 0) + R(8, 50, 84, 42, '#e8b84a', 4) + R(4, 42, 92, 14, '#ffe08a', 5) + P('M6 34L50 6L94 34Z', '#e8402c') + L('M20 26H80', '#fff', 3) +
    P('M58 42Q58 30 68 30Q78 30 78 42Z', '#ffd23e', 2.2) + C(68, 28, 2.6, '#ffd23e', 1.8); },
  trash: function(){ return E(50, 94, 32, 6, 'rgba(0,0,0,.2)', 0) + P('M24 40H76L70 92H30Z', '#6a7a6a') + R(18, 30, 64, 12, '#8a9a8a', 4) + L('M40 50L42 84M50 50V84M60 50L58 84', '#4a5a4a', 2.6) + R(42, 22, 16, 9, '#8a9a8a', 3, 2); },
  grem: function(){ return E(50, 92, 26, 6, 'rgba(0,0,0,.22)', 0) + P('M28 86Q20 60 30 44Q40 30 50 32Q60 30 70 44Q80 60 72 86Z', '#7a4ad0') + P('M30 46L18 22L38 38Z', '#7a4ad0', 2.4) + P('M70 46L82 22L62 38Z', '#7a4ad0', 2.4) +
    C(40, 54, 8, '#ffe85a', 2) + C(60, 54, 8, '#ffe85a', 2) + C(41, 55, 3.4, '#1b1730', 0) + C(59, 55, 3.4, '#1b1730', 0) + P('M38 70Q50 80 62 70L58 74L54 70L50 75L46 70L42 74Z', '#fff', 1.6) +
    L('M28 76L16 70M72 76L84 70', '#7a4ad0', 5) + L('M80 60L90 46', '#8a8f9e', 4); }
};
['shroom', 'raw', 'herb', 'burnt'].forEach(function(k){ CH_ART[{ shroom: 'shr', raw: 'fsh', herb: 'herb', burnt: 'burnt' }[k]] = SG_ART[k]; });
SG_ART.grem = CH_ART.grem;
SG_MOB.grem = { hp: 3, spd: 92, r: 60, wind: 0.8, cd: 1.5, dmg: 0.09, pts: 2, name: 'Gremlin' };
function chSvg(k){ return CH_ART[k] ? '<svg viewBox="-10 -10 120 120" aria-hidden="true">' + soften(CH_ART[k]()) + '</svg>' : ''; }
/* a plate with its parts, as one small picture (carried, on a counter, in the order list) */
function chPlateMarkup(s){
  var ps = chParts(s), m = CH_ART.plate();
  ps.forEach(function(q, i){ var dx = ps.length > 1 ? (i ? 14 : -14) : 0; m += '<g transform="translate(' + (dx + 12) + ' -4) scale(.76)">' + (CH_ART[q] ? CH_ART[q]() : '') + '</g>'; });
  return m;
}
function chItemMarkup(s){ return chPlate(s) ? chPlateMarkup(s) : CH_ART[s] ? CH_ART[s]() : ''; }
function chItemSvg(s){ return '<svg viewBox="-10 -10 120 120" aria-hidden="true">' + soften(chItemMarkup(s)) + '</svg>'; }
function chElBadge(el){ return ICON[el] ? ICON[el].replace('<svg ', '<svg x="0" y="0" width="100" height="100" ') : ''; }
function chPic(g, s, x, y, w){ if (s) sgPic(g, 'chi' + s, function(){ return chItemMarkup(s); }, x, y, w); }

/* ---------- the game ---------- */
SG_GAMES.chef = { mg: 'chef', name: 'Elemental Kitchen', verb: 'Use', hint: 'Walk up to a crate, a station or a counter.',
  intro: 'Hungry islanders are ordering! Grab ingredients, chop, cook and plate them, then serve each dish at the hatch before its order runs out.',
  how: 'Press the action button at a crate to grab, at a station to put something in or work on it, and at a counter to put down or pick up. Carry a plate to finished food to plate it. Each station has an element: pals of that element work there twice as fast. Wash dirty plates at the sink.',
  goal: 'Serve the orders before they run out!',
  waveT: 120,      /* 2 minutes, x SG_LONG = one 3 min 12 s wave (the skill challenges: 75 s x SG_LONG) */
  land: CH_LAY[1].land, sky: CH_LAY[1].sky, cloud: CH_LAY[1].cloud,
  need: CH_NEED[1],
  decor: function(R){ return sgRing(R, 11, 0.86, 0.96, chLay().decor, 80); },
  icon: function(){ return '<svg viewBox="0 0 100 100" aria-hidden="true">' + CH_ART.pot(true) + '</svg>'; },
  sfx: function(t){ return t === 'serve' ? 'coin' : t === 'work' ? 'build' : t === 'toss' || t === 'scrape' ? 'click' : 'click'; },
  /* the kitchen for this wave: the island, its colours and stations (every screen builds the same picture) */
  layout: function(w){
    var n = chLayNo(w); if (sg.chL === n && sg.I && sg.I.chef) return false;
    var L = CH_LAY[n], G = this;
    sg.chL = n; G.land = L.land; G.sky = L.sky; G.cloud = L.cloud;
    var R = rng(9137 + n * 101);
    sg.I = { x: 600, y: 430, rx: 560, ry: 340, sh: quShape(R), props: [], chef: n };
    sg.decor = G.decor(R).filter(function(d){      /* no decorations on top of a station or in the gap */
      if (L.gap && d.x > L.gap[0] - 50 && d.x < L.gap[1] + 50) return false;
      return !L.st.some(function(q){ return Math.hypot(q[1] - d.x, (q[2] - d.y) * 1.2) < 120; });
    });
    return true;
  },
  begin: function(){ sg.chBuilt = 0; sg.chL = 0; sg.dishPaid = 0; sg.lastG = 0; sg.lastX = 0; },
  preview: function(){      /* the kitchen behind the menu */
    var L = chLay(); sg.E = [];
    L.st.forEach(function(q){ sgNew(q[0], q[1], q[2], { s: q[0] === 'crate' ? q[3] : '', a: q[0] === 'rack' ? 3 : 0 }); });
    if (L.gap) sgNew('bridge', 600, L.by, { a: 1 });
  },
  spawn: function(slot){ var s = chLay().spawn[slot] || chLay().spawn[0]; return { x: s[0], y: s[1] }; },
  needFor: function(w){
    var L = chLayNo(w);
    var sum = CH_NEED[L][0] + CH_NEED[L][1] + CH_NEED[L][2];      /* one long wave: about half of the old 3 waves' total */
    if (sg.surv) return Math.round(sum * 0.5 * (1 + 0.05 * Math.max(0, sg.surv.n - 1)));
    return Math.round(sum * 0.5);
  },
  wave: function(w){
    var L = chLay(), n = sg.chL;
    sg.st = { ord: 1.5, oil: 9, gust: 7, grem: 12, dirty: [], combo: 0, br: 0, brT: 6 };
    if (w === 1 || sg.chBuilt !== n || !sgAll('rack').length){      /* a new run or a new kitchen: build its stations */
      sg.E = []; sg.chBuilt = n;
      L.st.forEach(function(q){ sgNew(q[0], q[1], q[2], { s: q[0] === 'crate' ? q[3] : '' }); });
      if (L.gap) sgNew('bridge', 600, L.by, { a: 1 });
    }
    sg.E = sg.E.filter(function(e){ return e.k !== 'ord' && e.k !== 'mob'; });
    sgAll('rack').forEach(function(r){ r.a = Math.max(r.a || 0, 2 + sgPlayers().length); r.b = 0; });
    sgAll('bridge').forEach(function(b){ b.a = 1; b.c = 0; });
  },
  /* who can walk where: the Sky Bridge Galley's gap can only be crossed on the drawbridge while it is down */
  walk: function(x, y){
    var L = chLay(); if (!L.gap || x < L.gap[0] || x > L.gap[1]) return true;
    var b = sgAll('bridge')[0];
    return !!(b && b.a >= 1 && Math.abs(y - L.by) < 44);
  },
  /* tapping a spot on the other side of the gap walks you to the drawbridge first */
  route: function(p, to){
    var L = chLay(); if (!L.gap) return null;
    var side = function(x){ return x < 600 ? -1 : 1; }, s0 = side(p.x), s1 = side(to.x);
    if (s0 === s1 || (p.x > L.gap[0] - 4 && p.x < L.gap[1] + 4)) return null;
    var ex = s0 < 0 ? L.gap[0] - 22 : L.gap[1] + 22;
    if (Math.hypot(p.x - ex, p.y - L.by) > 26) return { x: ex, y: L.by };
    var b = sgAll('bridge')[0];
    return b && b.a >= 1 ? { x: s1 < 0 ? L.gap[0] - 30 : L.gap[1] + 30, y: L.by } : { x: p.x, y: p.y };      /* wait for the bridge */
  },
  /* on every screen: if the bridge goes up under my pal, step off to the nearest side */
  local: function(dt){
    var me = sg.hero, L = chLay(); if (!me || !L.gap) return;
    if (me.x > L.gap[0] && me.x < L.gap[1] && !this.walk(me.x, me.y)){ me.x = me.x < 600 ? L.gap[0] - 6 : L.gap[1] + 6; me.mv = null; }
  },
  tick: function(dt, k){
    var S = sg.st, L = chLay(), G = this, P = sgPlayers();
    /* orders */
    var ords = sgAll('ord'), max = Math.min(6, Math.round((2.2 + 0.3 * (sg.chL - 1)) * Math.sqrt(sg.mul)));
    ords.forEach(function(o){
      o.a -= dt;
      if (o.a <= 0){ sgDel(o); S.combo = 0; sgRs('miss'); if (sg.rs) sg.rs.wbad = 1; sgBad(3, 600, 160, 'Order missed!'); }
    });
    if ((S.ord -= dt) <= 0 && ords.length < max){
      S.ord = rand(8.5, 12) * sgRate(1) * (ords.length ? 1 : 0.4);
      var pool = L.dishes, dk = pool[Math.floor(Math.random() * pool.length)];
      if (!ords.length && sg.chL === 3 && !sg.rs.icecSeen){ dk = 'icec'; sg.rs.icecSeen = 1; }      /* the crypt kitchen always asks for ice cream once */
      var T = CH_DISH[dk].T * 1.25 / Math.min(1.45, Math.sqrt(k)) * (1 + 0.12 * (sg.mul - 1));
      sgNew('ord', 0, 0, { s: dk, a: T, b: T });
    }
    /* cooking stations cook by themselves, and burn if left too long */
    sg.E.forEach(function(e){
      var T = CH_ST[e.k]; if (!T || T.mode !== 'cook') return;
      if (e.c === 1){
        e.a += dt / T.T;
        if (e.a >= 1){ e.a = 1; e.c = 2; e.b = 0; e.s = e.k === 'pot' ? (e.s.indexOf('shr') === 0 ? 'soupM' : 'soupT') : T.io[e.s]; sgTxt(e.x, e.y - 130, 'Ready!', '#ffe58a'); }
      } else if (e.c === 2 && T.burn){
        e.b += dt / T.burn;
        if (e.b >= 1){ e.c = 3; e.s = 'burnt'; e.b = 0; sgFx({ k: 'puff', x: e.x, y: e.y - 70, t: 1, T: 1, c: 'rgba(60,60,70,.85)' }); sgBad(2, e.x, e.y - 120, 'Burnt!'); sgRs('burn'); if (sg.rs) sg.rs.wbad = 1; }
      }
    });
    /* dirty plates come back a little after serving */
    for (var i = S.dirty.length - 1; i >= 0; i--){ S.dirty[i] -= dt; if (S.dirty[i] <= 0){ S.dirty.splice(i, 1); var rk = sgAll('rack')[0]; if (rk) rk.b = (rk.b || 0) + 1; } }
    /* the drawbridge */
    sgAll('bridge').forEach(function(b){
      S.brT -= dt;
      if (S.brT <= 0){ b.a = b.a >= 1 ? 0 : 1; S.brT = b.a ? rand(9, 12) : rand(2.5, 3.5) * Math.min(1.3, Math.sqrt(k)); sgTxt(600, L.by - 90, b.a ? 'Bridge down' : 'Bridge going up!', b.a ? '#7affc4' : '#ffb06a'); }
    });
    /* trouble: hot oil (cottage), gusts (galley, crypt), gremlins (crypt) */
    if ((S.oil -= dt) <= 0){
      S.oil = rand(8, 11) * sgRate(1);
      var pots = sgAll('pot').concat(sgAll('grill')), hp = pots[Math.floor(Math.random() * pots.length)];
      if (hp) sgHz({ k: 'c', x: hp.x + rand(-30, 30), y: hp.y + 50, r: 80, T: 1.4, dmg: 0.08, s: 'oil', col: 'rgba(255,190,60,.9)' });
    }
    if (sg.chL >= 2 && (S.gust -= dt) <= 0){
      S.gust = rand(7, 10) * sgRate(1);
      var tp = P.filter(function(p){ return !(p.ko > 0); }), qp = tp[Math.floor(Math.random() * tp.length)], gy = qp ? clamp(qp.y + rand(-30, 30), 200, 680) : 430;
      sgHz({ k: 'l', x: 60, y: gy, x2: 1140, y2: gy, r: 38, T: 1.6, dmg: 0.08, s: 'gust', col: 'rgba(255,255,255,.95)' });
    }
    if (sg.chL === 3 && (S.grem -= dt) <= 0){
      S.grem = rand(12, 16) * sgRate(1);
      if (sgAll('mob').length < Math.round(1 + sg.mul)){ var sp = sgSpot(120, 220); sgNew('mob', sp.x, sp.y, { s: 'grem', a: SG_MOB.grem.hp, b: 1 }); sgFx({ k: 'poof', x: sp.x, y: sp.y - 20, t: 0.6, T: 0.6, c: 'rgba(170,120,255,.85)' }); }
    }
  },
  /* of the stations in reach, the closest one where the button can do something (else the closest one's hint) */
  pick: function(p){
    if (sg.only){ var oe = sgById(sg.only); return oe && CH_ST[oe.k] && Math.hypot(oe.x - p.x, (oe.y - p.y) * 1.2) < SG_REACH ? this.pickAt(p, oe) : null; }
    var G = this, list = sg.E.filter(function(o){ return CH_ST[o.k] && Math.hypot(o.x - p.x, (o.y - p.y) * 1.2) < SG_REACH; })
      .sort(function(a, b){ return Math.hypot(a.x - p.x, (a.y - p.y) * 1.2) - Math.hypot(b.x - p.x, (b.y - p.y) * 1.2); });
    var first = null;
    for (var i = 0; i < list.length; i++){ var r = G.pickAt(p, list[i]); if (r && r.t) return r; if (!first) first = r; }
    return first;
  },
  pickAt: function(p, e){
    var cr = p.cr || '', T = CH_ST[e.k], id = e.id;
    switch (e.k){
      case 'crate': return cr ? { msg: 'Your hands are full.' } : { t: 'grab', id: id };
      case 'rack':
        if (cr) return { msg: 'Your hands are full.' };
        return e.a > 0 ? { t: 'take', id: id } : { msg: e.b > 0 ? 'Wash the dirty plates at the sink!' : 'No clean plates right now.' };
      case 'sink': return cr ? { msg: 'Put that down first.' } : (sgAll('rack').some(function(r){ return r.b > 0; }) ? { t: 'work', id: id } : { msg: 'No dirty plates.' });
      case 'serve': return chPlate(cr) && chParts(cr).length ? { t: 'serve', id: id } : { msg: cr ? 'Put it on a plate first.' : 'Bring a finished dish on a plate.' };
      case 'trash': return cr ? { t: 'toss', id: id } : { msg: 'Throw away what you carry here.' };
      case 'plant':
        if (chPlate(cr)) return chFits(cr, 'herb') ? { t: 'work', id: id } : { msg: 'Herbs don’t go on this plate.' };
        return cr ? { msg: 'Your hands are full.' } : { t: 'work', id: id };
      case 'ctr':
        if (!cr) return e.s ? { t: 'take', id: id } : { msg: 'Put something down here.' };
        if (!e.s) return { t: 'put', id: id };
        if (chPlate(cr) && chPlateable(e.s) && chFits(cr, e.s)) return { t: 'plate', id: id };
        if (chPlate(e.s) && chPlateable(cr) && chFits(e.s, cr)) return { t: 'plate', id: id };
        return { msg: 'This counter is taken.' };
    }
    if (T.mode === 'work'){
      if (!e.s) return cr && T.io[cr] ? { t: 'put', id: id } : { msg: cr ? 'That doesn’t go here.' : e.k === 'chop' ? 'Bring something to chop.' : 'Bring starberries to mix.' };
      if (T.io[e.s]) return cr ? { msg: 'Finish this first.' } : { t: 'work', id: id };
      if (!cr) return { t: 'take', id: id };
      if (chPlate(cr) && chPlateable(e.s) && chFits(cr, e.s)) return { t: 'plate', id: id };
      return { msg: 'Take it off first.' };
    }
    /* cooking stations: the stove (pot of soup), the grill, the oven and the chill box */
    if (e.c === 3) return cr ? { msg: 'Burnt! Empty-handed, scrape it out.' } : { t: 'scrape', id: id };
    if (e.c === 2){
      if (!cr) return e.k === 'pot' ? { msg: 'Bring an empty plate for the soup.' } : { t: 'take', id: id };
      if (chPlate(cr) && chFits(cr, e.s)) return { t: 'plate', id: id };
      return { msg: e.k === 'pot' ? 'Soup needs an empty plate.' : 'Your hands are full.' };
    }
    if (e.k === 'pot'){
      var n = e.s ? e.s.split(',').length : 0, ty = e.s ? e.s.split(',')[0] : '';
      if ((cr === 'tomC' || cr === 'shrC') && e.c !== 1){ if (ty && ty !== cr) return { msg: 'One kind of soup per pot.' }; return { t: 'put', id: id }; }
      if (e.c === 1) return chMatch(p, e) ? { t: 'stoke', id: id } : { msg: 'Cooking…' };
      return { msg: n ? (ty === 'shrC' ? 'Chopped mushrooms needed: ' : 'Chopped tomatoes needed: ') + (3 - n) : 'Add 3 chopped tomatoes or mushrooms.' };
    }
    if (e.c === 1) return chMatch(p, e) ? { t: 'stoke', id: id } : { msg: 'Cooking…' };
    if (cr && T.io[cr]) return { t: 'put', id: id };
    return { msg: cr ? 'That doesn’t go here.' : e.k === 'grill' ? 'Bring a chopped fish.' : e.k === 'oven' ? 'Bring dough.' : 'Bring starberry cream.' };
  },
  ev: function(p, t, e){
    if (!e) return;
    var cr = p.cr || '', T = CH_ST[e.k], fast = chMatch(p, e);
    if (!T) return;
    if (t === 'grab' && e.k === 'crate' && !cr){ p.cr = e.s; return; }
    if (t === 'take'){
      if (cr) return;
      if (e.k === 'rack'){ if (e.a > 0){ e.a--; p.cr = 'P'; } return; }
      if (e.k === 'ctr' || T.mode === 'work'){ if (e.s && !(T.io && T.io[e.s])){ p.cr = e.s; e.s = ''; e.a = 0; } return; }
      if (T.mode === 'cook' && e.c === 2 && e.k !== 'pot'){ p.cr = e.s; e.s = ''; e.a = 0; e.b = 0; e.c = 0; }
      return;
    }
    if (t === 'put'){
      if (!cr) return;
      if (e.k === 'ctr'){ if (!e.s){ e.s = cr; p.cr = ''; } return; }
      if (T.mode === 'work'){ if (!e.s && T.io[cr]){ e.s = cr; e.a = 0; p.cr = ''; } return; }
      if (e.k === 'pot'){
        if ((cr !== 'tomC' && cr !== 'shrC') || e.c === 1 || e.c === 2 || e.c === 3) return;
        var parts = e.s ? e.s.split(',') : [];
        if (parts.length && parts[0] !== cr) return;
        parts.push(cr); e.s = parts.join(','); p.cr = '';
        if (parts.length >= 3){ e.c = 1; e.a = 0; e.b = 0; }
        return;
      }
      if (T.mode === 'cook' && !e.c && !e.s && T.io[cr]){ e.s = cr; e.c = 1; e.a = 0; e.b = 0; p.cr = ''; }
      return;
    }
    if (t === 'work'){
      var w = (T.w || 0.2) * (fast ? 2 : 1);
      if (fast){ sgRs('el'); sgTxt(e.x, e.y - 150, EL[T.el].label + ' bonus!', EL[T.el].c); }
      if (e.k === 'plant'){
        if (cr && !(chPlate(cr) && chFits(cr, 'herb'))) return;
        e.a = (e.a || 0) + w;
        if (e.a >= 1){ e.a = 0; p.cr = cr ? chPlateOf(chParts(cr).concat(['herb'])) : 'herb'; sgFx({ k: 'spark', x: e.x, y: e.y - 60, t: 0.4, T: 0.4, c: '#7ad96a' }); }
        return;
      }
      if (e.k === 'sink'){
        var rk = sgAll('rack').filter(function(r){ return r.b > 0; })[0]; if (!rk || cr) return;
        e.a = (e.a || 0) + w;
        if (e.a >= 1){ e.a = 0; rk.b--; rk.a++; sgFx({ k: 'spark', x: e.x, y: e.y - 60, t: 0.4, T: 0.4, c: '#7ac8ff' }); sgTxt(e.x, e.y - 120, 'Clean plate!', '#bfe8ff'); }
        return;
      }
      if (T.mode === 'work' && e.s && T.io[e.s] && !cr){
        e.a = (e.a || 0) + w;
        sgFx({ k: 'spark', x: e.x + rand(-20, 20), y: e.y - 50, t: 0.3, T: 0.3, c: e.k === 'chop' ? '#ffd0a0' : '#fff3b0' });
        if (e.a >= 1){ e.a = 0; e.s = T.io[e.s]; }
      }
      return;
    }
    if (t === 'stoke' && T.mode === 'cook' && e.c === 1 && fast){
      e.a = Math.min(0.999, e.a + 0.12); sgRs('el');
      sgTxt(e.x, e.y - 150, EL[T.el].label + ' bonus!', EL[T.el].c);
      sgFx({ k: 'spark', x: e.x, y: e.y - 60, t: 0.35, T: 0.35, c: EL[T.el].c });
      return;
    }
    if (t === 'plate'){
      if (e.k === 'ctr'){
        if (chPlate(cr) && chPlateable(e.s) && chFits(cr, e.s)){ p.cr = chPlateOf(chParts(cr).concat([e.s])); e.s = ''; return; }
        if (chPlate(e.s) && chPlateable(cr) && chFits(e.s, cr)){ e.s = chPlateOf(chParts(e.s).concat([cr])); p.cr = ''; }
        return;
      }
      if (!chPlate(cr)) return;
      if (T.mode === 'work' && e.s && chPlateable(e.s) && chFits(cr, e.s)){ p.cr = chPlateOf(chParts(cr).concat([e.s])); e.s = ''; e.a = 0; return; }
      if (T.mode === 'cook' && e.c === 2 && chFits(cr, e.s)){ p.cr = chPlateOf(chParts(cr).concat([e.s])); e.s = ''; e.a = 0; e.b = 0; e.c = 0; }
      return;
    }
    if (t === 'scrape' && e.c === 3 && !cr){ e.s = ''; e.a = 0; e.b = 0; e.c = 0; sgFx({ k: 'puff', x: e.x, y: e.y - 50, t: 0.5, T: 0.5, c: 'rgba(80,80,90,.7)' }); return; }
    if (t === 'toss' && e.k === 'trash' && cr){
      p.cr = chPlate(cr) ? 'P' : ''; sgFx({ k: 'puff', x: e.x, y: e.y - 40, t: 0.5, T: 0.5, c: 'rgba(120,140,120,.7)' });
      return;
    }
    if (t === 'serve' && e.k === 'serve' && chPlate(cr)){
      var dk = chDishOf(chParts(cr));
      var ords = sgAll('ord').filter(function(o){ return o.s === dk; }).sort(function(a, b){ return a.a - b.a; }), o = ords[0];
      if (!o){ sgTxt(e.x, e.y - 130, dk ? 'Nobody ordered that!' : 'That’s not a dish yet.', '#ffb06a'); return; }
      p.cr = ''; sgDel(o); sg.st.dirty.push(4);
      var S = sg.st; S.combo++;
      var quick = o.a > o.b / 2, D = CH_DISH[dk], n = D.pts + (quick ? 2 : 0) + (S.combo >= 3 ? 1 : 0);
      sgRs('dish'); if (dk === 'icec') sgRs('ice');
      sgPts(p, n, e.x, e.y - 130, S.combo >= 3 ? 'Combo x' + S.combo + '!' : quick ? 'Speedy!' : 'Served!');
      sgFx({ k: 'ring', x: e.x, y: e.y - 30, t: 0.6, T: 0.6, c: '#ffd23e' }); sgFood(e.x - 60, e.y + 40, 0.08);
    }
  },
  mobDown: function(){},
  solid: function(e){ return CH_ST[e.k] && e.k !== 'bridge' ? 40 : 0; },
  carrySvg: function(k){ return chItemSvg(k); },
  zOff: function(e){ return 0; },
  /* the gap and the drawbridge are painted over the island */
  under: function(g){
    var L = chLay(); if (!L.gap) return;
    var x0 = L.gap[0], x1 = L.gap[1], I = sg.I, sky = g.createLinearGradient(0, I.y - I.ry, 0, I.y + I.ry + 200);
    sky.addColorStop(0, L.sky[0]); sky.addColorStop(1, L.sky[1]);
    g.save();
    g.beginPath(); g.rect(x0, I.y - I.ry - 40, x1 - x0, I.ry * 2 + 260); g.clip();
    g.fillStyle = sky; g.fillRect(x0, I.y - I.ry - 40, x1 - x0, I.ry * 2 + 260);
    g.fillStyle = 'rgba(255,255,255,.55)'; for (var i = 0; i < 4; i++){ var cy = 200 + i * 150 + Math.sin(sg.t * 0.6 + i) * 20; g.beginPath(); g.ellipse(600 + Math.sin(sg.t * 0.4 + i * 2) * 20, cy, 46, 12, 0, 0, 7); g.fill(); }
    g.restore();
    g.fillStyle = '#7a4d2e'; g.fillRect(x0 - 8, I.y - I.ry, 10, I.ry * 2); g.fillRect(x1 - 2, I.y - I.ry, 10, I.ry * 2);
    var b = sgAll('bridge')[0], down = b && b.a >= 1;
    b = b || {}; b.u = clamp((b.u === undefined ? 1 : b.u) + (down ? 1 : -1) * 0.06, 0, 1);      /* drawn sliding in and out */
    var u = b.u, y = L.by;
    if (u > 0.02){
      var w = (x1 - x0 + 16) * u;
      g.fillStyle = 'rgba(30,20,40,.25)'; g.fillRect(x0 - 8, y - 38, w, 86);
      g.fillStyle = '#b07a48'; g.strokeStyle = '#5a3418'; g.lineWidth = 3;
      for (var q = 0; q < w; q += 20){ g.fillRect(x0 - 8 + q, y - 40, Math.min(18, w - q), 80); g.strokeRect(x0 - 8 + q, y - 40, Math.min(18, w - q), 80); }
      g.strokeStyle = '#8a5a30'; g.lineWidth = 5; g.beginPath(); g.moveTo(x0 - 8, y - 42); g.lineTo(x0 - 8 + w, y - 42); g.moveTo(x0 - 8, y + 42); g.lineTo(x0 - 8 + w, y + 42); g.stroke();
    }
    if (!down){ g.fillStyle = 'rgba(255,90,70,.9)'; g.font = '900 22px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('▲', x0 - 30, y + 8); g.fillText('▲', x1 + 30, y + 8); }
  },
  draw: function(g, e){
    var T = CH_ST[e.k]; if (!T) return;
    var on = e.c === 1 || e.c === 2, me = sg.hero;
    if (T.el && me && me.c && me.c.element === T.el){      /* my element's stations glow under them */
      g.fillStyle = rgba(EL[T.el].c, 0.28 + 0.12 * Math.sin(sg.t * 3)); g.beginPath(); g.ellipse(e.x, e.y + 8, 64, 22, 0, 0, 7); g.fill();
    }
    sgPic(g, 'chs' + e.k + (on ? 1 : 0), function(){ return CH_ART[e.k](on); }, e.x, e.y + 8, 112);
    if (T.el) sgPic(g, 'chb' + T.el, function(){ return chElBadge(T.el); }, e.x + 48, e.y - 50, 34);
    if (e.k === 'crate'){ sgPic(g, 'chi' + e.s, CH_ART[e.s], e.x, e.y - 40 + Math.sin(sg.t * 3 + e.id) * 2, 62); return; }
    if (e.k === 'rack'){
      var n = Math.min(5, e.a || 0); for (var i = 0; i < n; i++) sgPic(g, 'chiP', CH_ART.plate, e.x - 2 + i * 1.5, e.y - 48 - i * 7, 58);
      for (i = 0; i < Math.min(4, e.b || 0); i++) sgPic(g, 'chdirty', CH_ART.dirty, e.x + 34, e.y - 20 - i * 7, 40);
      g.font = '900 20px system-ui, sans-serif'; g.textAlign = 'center'; g.lineWidth = 5; g.strokeStyle = 'rgba(30,20,50,.85)'; g.fillStyle = '#fff';
      var lab = (e.a || 0) + (e.b ? ' · ' + e.b + ' dirty' : ''); g.strokeText(lab, e.x, e.y - 112); g.fillText(lab, e.x, e.y - 112);
      return;
    }
    if (e.k === 'sink'){ if (e.a > 0) sgBarDraw(g, e.x, e.y - 112, e.a, '#7ac8ff', 56); return; }
    if (e.k === 'plant'){ if (e.a > 0) sgBarDraw(g, e.x, e.y - 112, e.a, '#7ad96a', 56); return; }
    if (e.k === 'ctr'){ chPic(g, e.s, e.x, e.y - 34, 60); return; }
    if (T.mode === 'work'){
      if (e.s){ chPic(g, e.s, e.x - 4, e.y - 38, 56); if (T.io[e.s]) sgBarDraw(g, e.x, e.y - 112, e.a, '#ffd23e', 56); }
      return;
    }
    if (T.mode === 'cook'){
      if (e.k === 'pot'){
        var ps = e.c === 0 && e.s ? e.s.split(',') : [];
        if (ps.length){
          g.fillStyle = 'rgba(20,14,36,.75)'; g.beginPath(); g.ellipse(e.x, e.y - 118, 56, 22, 0, 0, 7); g.fill();
          for (i = 0; i < 3; i++){ if (ps[i]) sgPic(g, 'chi' + ps[i], CH_ART[ps[i]], e.x - 34 + i * 34, e.y - 100, 36); else { g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(e.x - 34 + i * 34, e.y - 116, 10, 0, 7); g.stroke(); } }
        }
        if (e.c >= 2) chPic(g, e.s, e.x, e.y - 76, 52);
      } else if (e.s) chPic(g, e.s, e.x, e.y - 52, 54);
      if (e.c === 1){ sgBarDraw(g, e.x, e.y - 112, e.a, '#ffd23e', 56); if (Math.random() < 0.1) sgFx({ k: 'puff', x: e.x + rand(-16, 16), y: e.y - 70, t: 0.6, T: 0.6, c: e.k === 'chill' ? 'rgba(200,230,255,.7)' : 'rgba(255,255,255,.6)' }); }
      if (e.c === 2 && T.burn && e.b > 0.25){ var fl = Math.sin(sg.t * 14) > 0; sgBarDraw(g, e.x, e.y - 128, e.b, fl ? '#ff5a4a' : '#ff9a4a', 56); }
    }
  },
  /* the order cards are only rebuilt when an order comes or goes (or turns late); the timer bars are updated in place */
  hud: function(){
    var ords = sgAll('ord').sort(function(a, b){ return a.a - b.a; });
    if (!ords.length) return '';
    return '<div class="sg-ords">' + ords.map(function(o){
      var D = CH_DISH[o.s], late = o.a / (o.b || 1) < 0.25;
      return '<div class="sg-o ch-o' + (late ? ' late' : '') + '"><span class="ch-dish">' + chItemSvg(chPlateOf(D.c)) + '</span><div class="sg-oi">' +
        D.c.map(function(q){ return '<span class="sg-ic" style="width:24px">' + chSvg(q) + '</span>'; }).join('') + '</div><i data-o="' + o.id + '"></i></div>';
    }).join('') + '</div>';
  },
  hudBars: function(box){
    var by = {}; sgAll('ord').forEach(function(o){ by[o.id] = o; });
    box.querySelectorAll('i[data-o]').forEach(function(el){ var o = by[el.dataset.o]; if (o) el.style.width = (o.a / (o.b || 1) * 100).toFixed(0) + '%'; });
  }
};
/* ---------- rewards: gold and pal xp per point (like the other minigames), win bonus, survival pot ---------- */
function chChefLv(){ return sg.surv ? 3 : (sg.lv || 1); }
function chPay(pts){ var lv = chChefLv(), g = pts * CH_GOLD[lv] / (sg.mul || 1); return [Math.round(g), Math.round(g * CH_XPK) * 1]; }
function sgMgPay(bonusK){
  var pts = sg.runPts, r = chPay(pts), S = sg.surv;
  sg.runPts = 0;
  if (!(r[0] || r[1])) return 0;
  if (S){ S.gold = (S.gold || 0) + r[0]; S.xp = (S.xp || 0) + r[1]; return 0; }
  var got = giveReward(r[0], r[1]); sg.lastG = (sg.lastG || 0) + got[0]; sg.lastX = (sg.lastX || 0) + got[1];
  return got[1];
}
/* a survival run's pot (and the waves cleared as a record) */
function sgMgPotPay(){
  var S = sg.surv; if (!S) return;
  sgMgPay(0);
  var got = giveReward(S.gold || 0, S.xp || 0); sg.lastG = (sg.lastG || 0) + got[0]; sg.lastX = (sg.lastX || 0) + got[1];
  S.gold = 0; S.xp = 0;
  if (sg.done > 0) S.nb = survRecord('chef', sg.done);
  achCheck({ g: 'chef', surv: sg.done });
}
function sgMgWaveDone(){      /* survival: every kitchen cleared = +1 win, bonus coins in the pot */
  var S = sg.surv;
  state.island.chefWins = (state.island.chefWins || 0) + 1; mgPetRoll('chef'); hatCheck();
  S.gold = (S.gold || 0) + CH_SURV_GOLD;
  S.n++;
  sgBanner('Kitchen cleared! +1 win', '+' + CH_SURV_GOLD + ' bonus coins in the pot. Next: ' + CH_LAY[((S.n - 1) % 3) + 1].name, 2800);
}
function chRunStats(){ var rs = sg.rs || {}, I = achI(); if (rs.dish && !sg.dishPaid){ sg.dishPaid = 1; I.st.ch_dish = (I.st.ch_dish || 0) + rs.dish; } }
function sgMgEnd(won, why){
  if (sg.phase === 'end') return;
  var S = sg.surv, C = sg.coop, lv = sg.lv, bonus = 0;
  sg.phase = 'end'; sg.mini = null; sgMiniUi();
  if (C){ if (C.role === 'host') C.endAt = Date.now(); else { sg.coop = null; if (window.ppCoop && window.ppCoop.left) window.ppCoop.left(); } }
  chRunStats();
  if (S){ sgMgPotPay(); }
  else {
    sgMgPay(0);
    if (won){
      state.island.chefWins = (state.island.chefWins || 0) + 1;
      bonus = giveReward(CH_WIN_GOLD[lv] || 0, 0)[0]; sg.lastG = (sg.lastG || 0) + bonus;
      mgPetRoll('chef'); hatCheck();
    }
    achCheck({ g: 'chef', won: !!won, lv: lv, miss: (sg.rs || {}).miss || 0, dish: (sg.rs || {}).dish || 0, ice: (sg.rs || {}).ice || 0, el: (sg.rs || {}).el || 0 });
  }
  achCheck(null);
  sg.surv = null;
  save(); updateHud();
  var rs = sg.rs || {};
  sgPanel('<h2>' + (S ? 'Rewards claimed!' : won ? 'Kitchen cleared!' : 'Kitchen closed') + '</h2><p><span>' + esc(why || (won ? 'You served every wave of ' + CH_LAY[lv].name + '.' : '')) + '</span>' +
    (S ? ' <span>Kitchens cleared: ' + sg.done + '.</span> <span>' + (S.nb ? 'New best!' : 'Best: ' + survBest('chef') + ' waves.') + '</span>' : '') + '</p>' +
    '<div class="cn-stats"><div><b>+' + (sg.lastG || 0).toLocaleString() + '</b><span>Coins</span></div><div><b>+' + (sg.lastX || 0).toLocaleString() + '</b><span>XP</span></div><div><b>' + (rs.dish || 0) + '</b><span>Dishes</span></div><div><b>' + sg.done + '</b><span>Waves</span></div></div>' + sgMenuHtml());
  sgHud();
}
function chLvButtons(){
  return '<p class="lvpick-t">Choose a kitchen</p><div class="lvpick">' + [1, 2, 3].map(function(lv){
    if (!lvOpen('chef', lv)) return lvLockBtn('', 'Level ' + lv, lv);
    return '<button class="btn lvb lv' + lv + '" type="button" data-action="sg-start" data-lv="' + lv + '"><b>Level ' + lv + '</b><small>' + esc(CH_LAY[lv].name) + ' &middot; ' + CH_LAY[lv].dishes.length + ' dishes</small></button>';
  }).join('') + '</div>';
}
function chRecipeHtml(){
  var step = function(k){ return '<span class="ch-st"><span class="sg-ic" style="width:26px">' + chSvg(k) + '</span></span>'; };
  var how = { salad: [['tom', 'chop'], ['plant']], soupT: [['tom', 'chop', 'pot']], soupM: [['shr', 'chop', 'pot']], fishp: [['fsh', 'chop', 'grill'], ['plant']], sandw: [['fsh', 'chop', 'grill'], ['dough', 'oven']], icec: [['ber', 'mix', 'chill']] };
  var stIc = function(k){ var T = CH_ST[k]; return '<span class="ch-st ch-stn" style="--c:' + EL[T.el].c + '"><span class="sg-ic" style="width:26px">' + chSvg(k) + '</span></span>'; };
  return '<p class="lvpick-t">Recipes</p><div class="ch-book">' + Object.keys(CH_DISH).map(function(k){
    var D = CH_DISH[k], lv0 = [1, 2, 3].filter(function(l){ return CH_LAY[l].dishes.indexOf(k) >= 0; })[0];
    return '<div class="ch-rec"><span class="ch-rd">' + chItemSvg(chPlateOf(D.c)) + '</span><span class="ch-rt"><b>' + esc(D.name) + '</b><small>From level ' + lv0 + (k.indexOf('soup') === 0 ? ' &middot; 3 in the pot' : '') + '</small><span class="ch-steps">' +
      how[k].map(function(ch){ return ch.map(function(q, i){ return (i ? '<i>›</i>' : '') + (CH_ST[q] ? stIc(q) : step(q)); }).join(''); }).join('<i>+</i>') + '</span></span></div>';
  }).join('') + '</div><p class="small"><span>Pals work twice as fast at stations of their own element:</span> ' + ['chop', 'plant', 'sink', 'pot', 'grill', 'oven', 'mix', 'chill'].map(function(k){ return '<span>' + esc(CH_ST[k].name) + ' (' + esc(EL[CH_ST[k].el].label) + ')</span>'; }).join(', ') + '</p>';
}
function chGearHtml(){
  var c = heroChar(), H = HATS.h_chef, P0 = PETS.chef, K = CAPES.g_chef;
  var row = function(on, name, eff, how){ return '<li class="' + (on ? 'on' : '') + '"><b>' + esc(name) + '</b> <span>' + esc(eff) + '</span>' + (on ? ' <i>✓ On</i>' : ' <small>' + esc(how) + '</small>') + '</li>'; };
  return '<p class="lvpick-t">Kitchen gear</p><ul class="sg-gear">' +
    row(sgHatOn(c), H.name, 'You chop, wash and pick 30% faster.', hatOwned('h_chef') ? 'Wear it on this pal to use it.' : 'Win ' + HAT_WINS + ' times.') +
    row(petOn('chef'), P0.name, '1 in 4 dishes give a bonus point.', hasPet('chef') ? 'Make it the pet that follows you.' : '1 in ' + MG_PET_RATE + ' chance with every win.') +
    row(!!(c && c.cape === 'g_chef' && capeOwned('g_chef')), K.name, '+25% gold and xp here.', capeOwned('g_chef') ? 'Wear it on this pal to use it.' : 'Win ' + GCAPE_WINS + ' times.') + '</ul>';
}
function chCoopBox(){
  if (!window.ppCoop || !window.ppCoop.ready()) return '';
  return '<div class="coop-box"><p class="lvpick-t">Cook with friends</p><p class="small">Invite up to 3 friends. More cooks means more orders, and pals of different elements can split the stations. Everyone earns their own gold and xp.</p>' +
    '<div class="row"><button class="btn" type="button" data-action="coop-list">Invite friends</button></div><div id="coop-list"></div></div>';
}
function sgMgMenu(){
  return winsLine('chef') + chLvButtons() + '<div class="lvpick lvpick-s">' + survButton('sg-surv', 'chef') + '</div><div class="row"><button class="btn" type="button" data-action="sg-leave">Leave</button></div>' + chCoopBox() + chRecipeHtml() + chGearHtml() + achHtml('chef');
}
/* the friends list in the kitchen: any open level, and Survival when it is unlocked */
function chCoopList(box){
  var fq = window.ppCoop.friends();
  box.innerHTML = fq.length ? fq.map(function(x){ return '<div class="coop-fr"><b data-notr>' + esc(x.name) + '</b><span>' + [1, 2, 3].map(function(lv){ return lvOpen('chef', lv) ? '<button class="btn sm" type="button" data-action="coop-inv" data-uid="' + esc(x.uid) + '" data-lv="' + lv + '">Level ' + lv + '</button>' : ''; }).join('') +
    (survOpen('chef') ? '<button class="btn sm" type="button" data-action="coop-inv" data-uid="' + esc(x.uid) + '" data-lv="' + SURV_LV + '">Survival</button>' : '') + '</span></div>'; }).join('') : '<p class="small">None of your friends are online right now.</p>';
}
function chHudTxt(){ var r = chPay(sg.runPts || 0), S = sg.surv; return '+' + ((S ? S.gold || 0 : sg.lastG || 0) + r[0]).toLocaleString() + ' · ' + ((S ? S.xp || 0 : sg.lastX || 0) + r[1]).toLocaleString() + ' xp'; }
/* ==/SG== */
