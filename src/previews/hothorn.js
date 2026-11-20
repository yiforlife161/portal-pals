/* Hothorn (preview, key 'hh'): the owner's drawing (inspired by arena-brawler cartoon heroes, own look): a furry red imp with two
   tall curved horns striped cream on the inside, a spiky tuft between them, huge round yellow eyes under a cheeky brow, a wide fanged
   grin with cream lips, a cream belly, red furry arms with dark wrist cuffs, and a chunky dark blaster with gold bands in each fist,
   short legs on clawed feet. Faces right like every pal: the front blaster is the weapon, the back one points out behind him. */
var HOT = { R: '#e8302a', RD: '#4a0a08', RL: '#ff7a5a', RM: '#b81e1a', C: '#f6dca4', CD: '#7a5a2a', E: '#ffe02a', K: '#141012', M: '#3a0c10', T: '#e8505a',
  F: '#fffaf0', G: '#3a3c44', GD: '#121318', GL: '#6a6e7a', Y: '#f2b81e', YD: '#5a3e00', YL: '#ffe08a', B: '#7a4a1a' };
function hhP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
function hhLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a chunky blaster held at (x, y): the grip in the fist, the barrel pointing m = 1 right / -1 left */
function hhGun(x, y, m){
  var Z = HOT; function X(v){ return x + v * m; }
  return hhP('M' + X(-1) + ' ' + (y + 1) + 'L' + X(3) + ' ' + (y + 1) + 'L' + X(2) + ' ' + (y + 9) + 'L' + X(-2.4) + ' ' + (y + 8.4) + 'Z', Z.G, Z.GD, 1.5) +
    hhP('M' + X(-5) + ' ' + (y - 6) + 'L' + X(8) + ' ' + (y - 6) + 'L' + X(8) + ' ' + (y + 2) + 'L' + X(-5) + ' ' + (y + 2) + 'Z', Z.G, Z.GD, 1.7) +
    hhP('M' + X(-3) + ' ' + (y - 8) + 'L' + X(2) + ' ' + (y - 8) + 'L' + X(2) + ' ' + (y - 6) + 'L' + X(-3) + ' ' + (y - 6) + 'Z', Z.Y, Z.YD, 1.2) +
    hhP('M' + X(8) + ' ' + (y - 5.4) + 'L' + X(17) + ' ' + (y - 5.4) + 'L' + X(17) + ' ' + (y + 1.4) + 'L' + X(8) + ' ' + (y + 1.4) + 'Z', Z.G, Z.GD, 1.6) +
    hhP('M' + X(8) + ' ' + (y - 6.4) + 'L' + X(10.6) + ' ' + (y - 6.4) + 'L' + X(10.6) + ' ' + (y + 2.4) + 'L' + X(8) + ' ' + (y + 2.4) + 'Z', Z.Y, Z.YD, 1.2) +
    '<ellipse cx="' + X(17.6) + '" cy="' + (y - 2) + '" rx="2.4" ry="4.8" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.5"/>' +
    '<ellipse cx="' + X(18) + '" cy="' + (y - 2) + '" rx="1.1" ry="2.6" fill="' + Z.GD + '"/>' +
    '<path d="M' + X(-3) + ' ' + (y - 4.4) + 'L' + X(6) + ' ' + (y - 4.4) + 'M' + X(11.6) + ' ' + (y - 4) + 'L' + X(15.6) + ' ' + (y - 4) + '" stroke="' + Z.GL + '" stroke-width="1" stroke-linecap="round"/>';
}
/* a red furry fist round the grip at (x, y), with a dark cuff; m = 1 knuckles to the right */
function hhFist(x, y, m){
  var Z = HOT; function X(v){ return x + v * m; }
  return hhP('M' + X(-7.4) + ' ' + (y - 3) + 'L' + X(-4) + ' ' + (y - 4) + 'L' + X(-3.4) + ' ' + (y + 5) + 'L' + X(-6.8) + ' ' + (y + 5.6) + 'Z', Z.B, Z.RD, 1.3) +
    hhP('M' + X(-4) + ' ' + (y - 3) + 'Q' + X(2) + ' ' + (y - 5) + ' ' + X(5) + ' ' + (y - 1) + 'Q' + X(6) + ' ' + (y + 3) + ' ' + X(3) + ' ' + (y + 6) + 'Q' + X(-2) + ' ' + (y + 7) + ' ' + X(-4) + ' ' + (y + 4.6) + 'Z', Z.R, Z.RD, 1.6) +
    '<path d="M' + X(0) + ' ' + (y - 1.6) + 'H' + X(4.6) + 'M' + X(0) + ' ' + (y + 1.2) + 'H' + X(5.2) + 'M' + X(0) + ' ' + (y + 4) + 'H' + X(4) + '" stroke="' + Z.RD + '" stroke-width=".9" stroke-linecap="round"/>';
}
function hhArt(){
  var Z = HOT;
  return wrapSvg(
    /* the tall curved horns, cream inside */
    hhP('M37 30Q24 18 34 0Q34 14 44 24Z', Z.R, Z.RD, 1.9) + hhP('M63 30Q76 18 66 0Q66 14 56 24Z', Z.R, Z.RD, 1.9) +
    hhP('M37.6 26Q31 18 33.6 7Q35 17 41.6 23Z', Z.C, Z.CD, 1) + hhP('M62.4 26Q69 18 66.4 7Q65 17 58.4 23Z', Z.C, Z.CD, 1) +
    /* the furry egg-shaped body */
    hhP('M50 18Q70 18 70 42L71 46L69 48L70 56L67 58L67 66Q62 80 50 80Q38 80 33 66L33 58L30 56L31 48L29 46L30 42Q30 18 50 18Z', Z.R, Z.RD, 2.1) +
    /* spiky tuft on top */
    hhP('M44 21L44 13L47 17L49 10L51 16L54 11L54 17L57 15L56 21Z', Z.R, Z.RD, 1.6) +
    '<path d="M36 34Q37 26 42 23M64 34Q63 26 58 23" fill="none" stroke="' + Z.RL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* the cream belly */
    hhP('M39 58Q50 54 61 58Q61 72 50 77Q39 72 39 58Z', Z.C, Z.CD, 1.3) +
    '<path d="M44 66L45 68M55 66L54 68M49 71L50 73" stroke="' + Z.CD + '" stroke-width=".9" stroke-linecap="round" stroke-opacity=".6"/>' +
    /* huge round yellow eyes under a cheeky brow */
    '<circle cx="41.6" cy="34" r="6.4" fill="' + Z.E + '" stroke="' + Z.RD + '" stroke-width="1.7"/><circle cx="58.4" cy="34" r="6.4" fill="' + Z.E + '" stroke="' + Z.RD + '" stroke-width="1.7"/>' +
    '<circle cx="42.8" cy="34.6" r="2.6" fill="' + Z.K + '"/><circle cx="57.2" cy="34.6" r="2.6" fill="' + Z.K + '"/>' +
    '<circle cx="43.6" cy="33.6" r=".9" fill="#fff"/><circle cx="58" cy="33.6" r=".9" fill="#fff"/>' +
    hhP('M34 27Q42 24 48 29L47 30.4Q41 27.4 34.6 29.6Z', Z.RM, Z.RD, 1.2) + hhP('M66 27Q58 24 52 29L53 30.4Q59 27.4 65.4 29.6Z', Z.RM, Z.RD, 1.2) +
    /* the wide fanged grin with cream lips and a small tongue */
    hhP('M33 42Q50 48 67 42Q66 54 56 58Q50 60 44 58Q34 54 33 42Z', Z.C, Z.CD, 1.6) +
    hhP('M36 43.6Q50 49 64 43.6Q62 52 55 55Q50 56.6 45 55Q38 52 36 43.6Z', Z.M, Z.RD, 1.3) +
    '<path d="M44 54Q50 50 56 54Q53 56.4 50 56.4Q47 56.4 44 54Z" fill="' + Z.T + '"/>' +
    hhP('M38 44.6L40.6 49L42.4 45.8ZM57.6 45.8L59.4 49L62 44.6Z', Z.F, Z.CD, .8) +
    '<path d="M44 46.6Q50 48.4 56 46.6" fill="none" stroke="' + Z.F + '" stroke-width="1.6" stroke-linecap="round"/>');
}
function hhBack(c){
  var Z = HOT;
  /* short furry legs on clawed feet */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + hhLine('M' + x1 + ' 76L' + x2 + ' 94', 6, Z.R, Z.RD) +
      hhP('M' + (fx - 8) + ' 103Q' + (fx - 7) + ' 95 ' + fx + ' 94Q' + (fx + 7) + ' 95 ' + (fx + 9) + ' 103L' + (fx + 5) + ' 101.6L' + (fx + 2) + ' 104L' + (fx - 1) + ' 101.6L' + (fx - 4) + ' 104Z', Z.R, Z.RD, 1.8) + '</g>';
  }
  /* the back arm holds the second blaster, pointing out behind him */
  var back = hhLine('M34 56L20 60', 5, Z.R, Z.RD) + '<g class="wpn2">' + hhGun(15, 61, -1) + hhFist(15, 61, -1) + '</g>';      /* the back blaster fires every other shot */
  var front = hhLine('M66 56L80 61', 5, Z.R, Z.RD);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 41, 39) + leg('lgR', 56, 59, 61) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function hhFront(c){
  /* the front blaster, held level (turned back against the weapon group's idle tilt) */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + hhGun(85, 63, 1) + hhFist(85, 63, 1) + '</g></g></g></g></svg>';
}
