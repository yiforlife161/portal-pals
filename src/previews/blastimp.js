/* Blast Imp (preview, key 'bi'): the owner's drawing: a skinny blue scaly imp with a big grinning head: a tall blue fin-crest with a
   green frill behind it, two huge pale-blue curved horns, segmented pale ear-fins, angry orange eyes with slit pupils, a pale blue
   muzzle with a wide toothy grin, a pale belly, a dark strap across the chest, a dark belt with a gold buckle and a green gem, a
   bundle of red dynamite strapped to his back, long thin arms with four spread clawed fingers, and big four-toed frog feet.
   Faces right like every pal: the dynamite is on his back (left), the front hand is the weapon. */
var BI = { B: '#2f6cd8', BD: '#0c1c4a', BL: '#6c9cf0', BM: '#2456b8', P: '#a8daf0', PD: '#2a5a7a', H: '#bfe6f6', HD: '#24506a', G: '#3ab54a', GD: '#14501a',
  E: '#ff9a1a', ED: '#7a3a00', K: '#141418', T: '#ffffff', M: '#3a1a1e', S: '#2e2e34', SD: '#0e0e12', Y: '#e8c02a', YD: '#6a4e00', GM: '#5aea6a', R: '#d8262a', RD: '#5a0808' };
function biP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
function biLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a hand with four long spread fingers at (x, y); m = 1 fingers to the right */
function biHand(x, y, m){
  var Z = BI; function X(v){ return x + v * m; }
  return biP('M' + X(-4) + ' ' + (y - 3.6) + 'L' + X(3) + ' ' + (y - 4.4) + 'L' + X(8) + ' ' + (y - 9) + 'Q' + X(9.6) + ' ' + (y - 9.4) + ' ' + X(9.4) + ' ' + (y - 7.6) + 'L' + X(5.6) + ' ' + (y - 3) +
    'L' + X(11) + ' ' + (y - 3.4) + 'Q' + X(12.4) + ' ' + (y - 2.4) + ' ' + X(11) + ' ' + (y - 1.4) + 'L' + X(5.8) + ' ' + (y - 0.6) +
    'L' + X(10.6) + ' ' + (y + 2.6) + 'Q' + X(11.4) + ' ' + (y + 4) + ' ' + X(9.8) + ' ' + (y + 4.2) + 'L' + X(4.6) + ' ' + (y + 1.8) +
    'L' + X(6.4) + ' ' + (y + 7) + 'Q' + X(6.2) + ' ' + (y + 8.4) + ' ' + X(4.8) + ' ' + (y + 7.6) + 'L' + X(1.4) + ' ' + (y + 3.6) + 'L' + X(-4) + ' ' + (y + 3) + 'Z', Z.B, Z.BD, 1.6);
}
function biArt(){
  var Z = BI;
  return wrapSvg(
    /* the slim body with a pale belly */
    biP('M41 54Q50 52 59 54L61 70Q58 80 50 81Q42 80 39 70Z', Z.B, Z.BD, 2) +
    biP('M45 56Q50 55 55 56L56 70Q54 76 50 77Q46 76 44 70Z', Z.P, Z.PD, 1.2) +
    '<path d="M46 62H54M45.6 67H54.4" stroke="' + Z.PD + '" stroke-width=".9" stroke-opacity=".5" stroke-linecap="round"/>' +
    /* the strap across his chest and the belt with a gold buckle and green gem */
    biP('M58 54L62 57L44 76L40 73Z', Z.S, Z.SD, 1.4) + '<rect x="49" y="63" width="3" height="3" rx=".6" fill="none" stroke="#6a6a72" stroke-width=".8" transform="rotate(-45 50.5 64.5)"/>' +
    biP('M39 72Q50 75 61 72L61.6 77Q50 80 38.4 77Z', Z.S, Z.SD, 1.4) +
    biP('M43.6 72.6L56.4 72.6L57.6 76L54 80H46L42.4 76Z', Z.Y, Z.YD, 1.4) +
    '<ellipse cx="50" cy="76.4" rx="3.6" ry="3" fill="' + Z.GM + '" stroke="' + Z.GD + '" stroke-width="1.1"/><circle cx="49" cy="75.4" r=".9" fill="#d8ffd8"/>' +
    /* the green frill and the tall blue fin-crest on top */
    biP('M44 22L40 10L45 12L44 4L50 9L52 2L54 16Z', Z.G, Z.GD, 1.6) +
    biP('M46 24Q48 10 56 0Q55 12 58 24Z', Z.B, Z.BD, 1.8) + '<path d="M51 18Q52 9 55 4" fill="none" stroke="' + Z.BL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* the huge pale horns */
    biP('M33 34Q20 30 14 12Q24 24 36 27Z', Z.H, Z.HD, 1.9) + biP('M67 34Q80 30 86 12Q76 24 64 27Z', Z.H, Z.HD, 1.9) +
    biP('M60 25Q62 18 59 12Q66 17 65 26Z', Z.H, Z.HD, 1.6) +
    '<path d="M18 17Q24 26 32 29M82 17Q76 26 68 29" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>' +
    /* the head */
    biP('M34 34Q34 20 50 20Q66 20 66 34L65 44Q60 54 50 56Q40 54 35 44Z', Z.B, Z.BD, 2.1) +
    '<path d="M40 26Q44 24 46 27M53 24Q57 23 59 26M38 32Q41 30 43 32" fill="none" stroke="' + Z.BM + '" stroke-width="1" stroke-linecap="round"/>' +
    /* segmented pale ear-fins */
    biP('M33 31L29 33L29 39L31 44L35 43Z', Z.H, Z.HD, 1.5) + biP('M67 31L71 33L71 39L69 44L65 43Z', Z.H, Z.HD, 1.5) +
    '<path d="M29.4 36H33.6M29.8 40H34M70.6 36H66.4M70.2 40H66" stroke="' + Z.HD + '" stroke-width=".9"/>' +
    /* angry orange eyes with slit pupils */
    biP('M38 33L47 36.4Q47 41.4 42.4 41.4Q38 41 38 33Z', Z.E, Z.ED, 1.4) + biP('M62 33L53 36.4Q53 41.4 57.6 41.4Q62 41 62 33Z', Z.E, Z.ED, 1.4) +
    '<ellipse cx="43" cy="38.2" rx="1.2" ry="2.4" fill="' + Z.K + '"/><ellipse cx="57" cy="38.2" rx="1.2" ry="2.4" fill="' + Z.K + '"/>' +
    '<circle cx="41.4" cy="36.6" r=".8" fill="#fff"/><circle cx="55.4" cy="36.6" r=".8" fill="#fff"/>' +
    '<path d="M36.6 31L48 35.4M63.4 31L52 35.4" stroke="' + Z.BD + '" stroke-width="2.2" stroke-linecap="round"/>' +
    /* nose ridge */
    '<path d="M48 41.6Q50 40 52 41.6M48.4 42.6L49 43.4M51.6 42.6L51 43.4" fill="none" stroke="' + Z.BD + '" stroke-width="1" stroke-linecap="round"/>' +
    /* the pale muzzle with the wide toothy grin */
    biP('M36 43Q50 48 64 43L62 51Q57 57 50 57Q43 57 38 51Z', Z.P, Z.PD, 1.6) +
    biP('M38 45Q50 50 62 45Q60 52 50 53.6Q40 52 38 45Z', Z.M, Z.BD, 1.3) +
    biP('M38.6 45.6L40.4 49L42 46.6L43.6 50L45.4 47.4L47 50.6L48.6 47.8L50 51L51.4 47.8L53 50.6L54.6 47.4L56.4 50L58 46.6L59.6 49L61.4 45.6Q50 50.4 38.6 45.6Z', Z.T, Z.PD, .8) +
    biP('M43 52L44.4 50L45.6 52.6ZM49 53.4L50 51.2L51 53.4ZM54.4 52.6L55.6 50L57 52Z', Z.T, Z.PD, .7));
}
function biBack(c){
  var Z = BI;
  /* thin bent legs and big four-toed frog feet */
  function leg(cls, x1, kx, x2, fx, m){
    return '<g class="lg ' + cls + '">' + biLine('M' + x1 + ' 78L' + kx + ' 87L' + x2 + ' 95', 3.8, Z.B, Z.BD) +
      biP('M' + (fx - 2) + ' 94Q' + fx + ' 93 ' + (fx + 3) + ' 95L' + (fx + 11 * m) + ' 101Q' + (fx + 11.6 * m) + ' 103 ' + (fx + 9.4 * m) + ' 102.6L' + (fx + 4 * m) + ' 100L' + (fx + 4.6 * m) + ' 104Q' + (fx + 3 * m) + ' 105 ' + (fx + 2 * m) + ' 103.6L' + fx + ' 100L' + (fx - 2 * m) + ' 104Q' + (fx - 3.6 * m) + ' 104.4 ' + (fx - 3.4 * m) + ' 102.8L' + (fx - 3 * m) + ' 99L' + (fx - 8 * m) + ' 102Q' + (fx - 9.4 * m) + ' 101.6 ' + (fx - 8.4 * m) + ' 100L' + (fx - 3) + ' 95Z', Z.B, Z.BD, 1.6) + '</g>';
  }
  /* the dynamite bundle strapped to his back, peeking out behind his shoulder (under the arm) */
  var dyn = '<g transform="translate(2 -8) rotate(-20 30 60)">' + biP('M20 50H36V58H20Z', Z.R, Z.RD, 1.6) + biP('M20 58H36V66H20Z', Z.R, Z.RD, 1.6) + biP('M22 54H38V62H22Z', Z.R, Z.RD, 1.6) +
    '<path d="M26 49V67M32 49V67" stroke="' + Z.SD + '" stroke-width="2.2"/><path d="M21 51.6H34" stroke="#ff6a5a" stroke-width="1" stroke-linecap="round"/></g>';
  var back = biLine('M40 58L26 60L16 62', 3.6, Z.B, Z.BD) + biHand(13, 62, -1);
  var front = biLine('M60 58L74 61L82 63', 3.6, Z.B, Z.BD);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 45, 38, 41, 38, -1) + leg('lgR', 55, 62, 59, 62, 1) + dyn +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function biFront(c){
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + biHand(85, 64, 1) + '</g></g></g></svg>';
}
