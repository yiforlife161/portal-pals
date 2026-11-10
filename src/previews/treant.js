/* Tree Giant: the owner's own old-school MMO style treant: a bark body with wood grain, a crown of leaves, glowing
   orange eyes under carved brows, a long pointed wooden nose over a carved grin, a mossy collar, a vine belt with a leaf skirt,
   log arms with cut rings, root feet, a glowing blue crystal in his back hand and a big log fist he smashes with like a hammer (Life, melee, Giant). */
var TR = { W: '#9a6236', WD: '#2e1608', WL: '#c88a52', WM: '#7a4a24', R: '#e8b46a', RD: '#8a5a24', L: '#5aa83a', LD: '#1e4a12', LL: '#8ad45a', V: '#6a8a2a', E: '#ff8a1e', C: '#5ad8ff', CD: '#0e4a7a', CL: '#d8f8ff' };
function trRing(x, y, r){ var T = TR; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + T.R + '" stroke="' + T.WD + '" stroke-width="1.4"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.55) + '" fill="none" stroke="' + T.RD + '" stroke-width=".9"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.18) + '" fill="' + T.RD + '"/>'; }
function trLeaves(list, s){      /* pointed leaves: [x, y, angle] */
  var T = TR; s = s || 1;
  return list.map(function(q){ return '<g transform="translate(' + q[0] + ' ' + q[1] + ') rotate(' + q[2] + ') scale(' + s + ')"><path d="M0 0Q-4 -6 0 -13Q4 -6 0 0Z" fill="' + (q[3] ? T.LL : T.L) + '" stroke="' + T.LD + '" stroke-width="1.2" stroke-linejoin="round"/><path d="M0 -1V-11" stroke="' + T.LD + '" stroke-width=".7" stroke-opacity=".7"/></g>'; }).join('');
}
function trCrystal(cx, cy, s){
  var T = TR; function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (13 * s) + '" fill="' + T.C + '" fill-opacity=".25"/>' +
    '<path d="M' + P(-5, 9) + 'L' + P(-7, -3) + 'L' + P(-1, -13) + 'L' + P(6, -6) + 'L' + P(5, 7) + 'Z" fill="' + T.C + '" stroke="' + T.CD + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M' + P(-1, -13) + 'L' + P(0, 8) + 'M' + P(-7, -3) + 'L' + P(0, -1) + 'L' + P(6, -6) + '" fill="none" stroke="' + T.CD + '" stroke-width=".9" stroke-opacity=".6"/>' +
    '<path d="M' + P(-4.4, -3) + 'L' + P(-3, 5) + '" stroke="' + T.CL + '" stroke-width="' + (1.4 * s).toFixed(1) + '" stroke-linecap="round"/>';
}
function trArt(){
  var T = TR, O = '#1a0a02';
  return wrapSvg(
    /* bark body with grain, a vine belt with a knot and a leaf skirt */
    outlined('<path d="M33 60Q50 54 67 60Q71 76 64 89Q50 94 36 89Q29 76 33 60Z"/>', T.W, T.WD) +
    '<path d="M42 62Q41 72 43 82M50 60V84M58 62Q59 72 57 82M37 70Q36 76 38 82M63 70Q64 76 62 82" fill="none" stroke="' + T.WM + '" stroke-width="1.3" stroke-linecap="round"/>' +
    trLeaves([[36, 90, 200], [42, 92, 185], [48, 93, 175, 1], [54, 93, 180], [60, 92, 170, 1], [65, 89, 160]], 0.8) +
    '<path d="M33 81Q50 86 67 81" fill="none" stroke="' + T.LD + '" stroke-width="4.4" stroke-linecap="round"/><path d="M33 81Q50 86 67 81" fill="none" stroke="' + T.V + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M46 83Q50 78 54 83Q50 88 46 83Z" fill="' + T.V + '" stroke="' + T.LD + '" stroke-width="1.3"/>' +
    /* a crown of leaves on top of the head */
    '<path d="M28 28Q24 18 32 14Q34 6 42 7Q46 0 54 3Q60 -1 64 6Q72 6 72 14Q78 20 72 28Z" fill="' + TR.L + '" stroke="' + TR.LD + '" stroke-width="2" stroke-linejoin="round"/>' +
    trLeaves([[27, 27, -80], [29, 20, -62, 1], [33, 14, -45], [38, 9, -28, 1], [44, 6, -12], [50, 5, 0, 1], [56, 6, 12], [62, 9, 28, 1], [67, 14, 45], [71, 20, 62, 1], [73, 27, 80]], 1.35) +
    trLeaves([[38, 17, -20, 1], [46, 13, -5], [54, 13, 5, 1], [62, 17, 20]], 1.1) +
    /* tall wooden head with grain */
    outlined('<path d="M33 22Q50 16 67 22L68 50Q60 60 50 60Q40 60 32 50Z"/>', T.W, T.WD) +
    '<path d="M38 24V34M62 24V34M44 21V27M56 21V27" stroke="' + T.WM + '" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M36 23Q42 20 48 19.6" fill="none" stroke="' + T.WL + '" stroke-width="2" stroke-linecap="round"/>' +
    /* the leafy crown overlaps the top of the head */
    trLeaves([[34, 25, -50, 1], [40, 23, -20], [46, 22, 0, 1], [52, 22, -8], [58, 22, 12, 1], [64, 23, 30], [67, 26, 55, 1]], 0.95) +
    /* carved brows over glowing orange eyes */
    '<path d="M35 32L47 36L47 39L35 36Z M65 32L53 36L53 39L65 36Z" fill="' + T.WM + '" stroke="' + T.WD + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<ellipse cx="41" cy="39.6" rx="4.2" ry="3" fill="#ffd23e" stroke="' + O + '" stroke-width="1.5"/><ellipse cx="41.4" cy="39.8" rx="2" ry="1.5" fill="' + T.E + '"/>' +
    '<ellipse cx="59" cy="39.6" rx="4.2" ry="3" fill="#ffd23e" stroke="' + O + '" stroke-width="1.5"/><ellipse cx="58.6" cy="39.8" rx="2" ry="1.5" fill="' + T.E + '"/>' +
    /* a carved grin behind the long pointed wooden nose */
    '<path d="M38 47Q50 51 62 47L60 53Q50 56 40 53Z" fill="#2a1406" stroke="' + O + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M40.5 48.4V52.6M44 49.4V53.6M56 49.4V53.6M59.5 48.4V52.6" stroke="' + T.R + '" stroke-width="1.6"/>' +
    outlined('<path d="M47 37L53 37L55 44L50 56L45 44Z"/>', T.WL, T.WD, 1.8) + '<path d="M50 39V53" stroke="' + T.WM + '" stroke-width="1" stroke-linecap="round"/>' +
    /* mossy collar around the neck */
    '<path d="M28 58Q30 52 36 54Q38 50 43 53Q46 50 50 53Q54 50 57 53Q62 50 64 54Q70 52 72 58Q68 62 64 60Q60 64 55 61Q50 65 45 61Q40 64 36 60Q32 62 28 58Z" fill="' + T.L + '" stroke="' + T.LD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<circle cx="38" cy="57" r="1.4" fill="' + T.LL + '"/><circle cx="56" cy="56" r="1.2" fill="' + T.LL + '"/><circle cx="65" cy="58" r="1.1" fill="' + T.LL + '"/>');
}
function trBack(c){
  var T = TR;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + T.WD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + T.W + '" stroke-width="8" stroke-linecap="round"/>' +
      trRing(x1 + (x1 < 50 ? -4 : 4), 88, 3) +
      '<path d="M' + (fx - 10) + ' 104Q' + (fx - 6) + ' 96 ' + fx + ' 95Q' + (fx + 6) + ' 96 ' + (fx + 10) + ' 104L' + (fx + 6) + ' 101L' + (fx + 2) + ' 105L' + fx + ' 101L' + (fx - 3) + ' 105L' + (fx - 6) + ' 101Z" fill="' + T.W + '" stroke="' + T.WD + '" stroke-width="2" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.WD + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.W + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + (x1 + (x2 - x1) * 0.25) + ' ' + (y1 + (y2 - y1) * 0.25 - 2) + 'L' + (x1 + (x2 - x1) * 0.75) + ' ' + (y1 + (y2 - y1) * 0.75 - 2) + '" stroke="' + T.WM + '" stroke-width="1.2" stroke-linecap="round"/>';
  }
  function logFist(x, y){ return '<rect x="' + (x - 9) + '" y="' + (y - 8) + '" width="18" height="16" rx="5" fill="' + T.W + '" stroke="' + T.WD + '" stroke-width="2"/>' + trRing(x - 4, y - 4, 3.6) + trRing(x + 3.6, y - 4, 3.6) + trRing(x - 4, y + 3.6, 3.4) + trRing(x + 3.6, y + 3.6, 3.4); }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(31, 64, 17, 69) + trRing(25, 66.6, 4) + trCrystal(12, 58, 0.95) +
    '<rect x="5" y="63" width="15" height="13" rx="5" fill="' + T.W + '" stroke="' + T.WD + '" stroke-width="2"/>' + trRing(9.6, 67, 3) + trRing(15.4, 67, 3) + trRing(12.5, 72.4, 2.8) + '</g></g>' +
    '<g><g class="pump pR">' + arm(69, 64, 83, 65) + trRing(76, 64.4, 4) + '</g></g></svg>';
}
function trFront(c){
  var T = TR;
  /* the big log fist he swings like a hammer; it sits in the weapon group so it smashes when he hits */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' +
    '<rect x="78" y="55" width="22" height="20" rx="6" fill="' + T.W + '" stroke="' + T.WD + '" stroke-width="2.2"/>' +
    '<path d="M80 60H97M80 70H97" stroke="' + T.WM + '" stroke-width="1.1" stroke-linecap="round"/>' +
    trRing(84, 60, 4.2) + trRing(93.6, 60, 4.2) + trRing(84, 70, 4) + trRing(93.6, 70, 4) +
    '</g></g></g></g></svg>';
}
