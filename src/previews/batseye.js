/* Bat's Eye (key 'be', Undead, melee, giant): the owner's drawing: a black armoured brute whose head is one huge eyeball with a blue iris, the eye
   sitting right on the black suit (no collar, at the owner's request), big black bat wings on his back (the owner moved them there from the sides of the eye and
   dropped the grille faceplate), gold shoulder stripes, a chest plate with a bat-shaped edge, thick black arms with gold bands ending in big black fists, and black
   boots with gold trim. Faces right like every pal: the front fist is the weapon. */
var BE = { K: '#2a2a30', KD: '#0a0a0e', KL: '#4a4a56', Y: '#f2b61e', YD: '#5a3e00', YL: '#ffe08a', W: '#f6f6f2', WD: '#1a1a20', I: '#2a62e0', ID: '#0e2a7a', IL: '#6a9cff', P: '#0e0e14', S: '#b8bcc6', SD: '#2a2e38' };
function beP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
function beLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a gold band across a limb at (x, y) */
function beBand(x, y, rot, w, h){
  var Z = BE;
  return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')"><rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="1.6" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.4"/>' +
    '<path d="M' + (x - w / 2 + 1.4) + ' ' + (y - h / 2 + 1.2) + 'H' + (x + w / 2 - 1.4) + '" stroke="' + Z.YL + '" stroke-width=".9" stroke-linecap="round"/></g>';
}
/* a big black fist at (x, y); m = 1 knuckles to the right */
function beFist(x, y, m){
  var Z = BE; function X(v){ return x + v * m; }
  return beP('M' + X(-6) + ' ' + (y - 6) + 'Q' + X(4) + ' ' + (y - 8) + ' ' + X(7) + ' ' + (y - 2) + 'Q' + X(8) + ' ' + (y + 3) + ' ' + X(5) + ' ' + (y + 7) + 'Q' + X(-2) + ' ' + (y + 9) + ' ' + X(-6) + ' ' + (y + 5) + 'Q' + X(-8) + ' ' + y + ' ' + X(-6) + ' ' + (y - 6) + 'Z', Z.K, Z.KD, 1.8) +
    '<path d="M' + X(1) + ' ' + (y + 1) + 'Q' + X(3) + ' ' + (y + 4) + ' ' + X(1) + ' ' + (y + 6) + 'M' + X(4.6) + ' ' + (y - 1) + 'Q' + X(6.6) + ' ' + (y + 2) + ' ' + X(5) + ' ' + (y + 4.6) + '" fill="none" stroke="' + Z.KD + '" stroke-width="1" stroke-linecap="round"/>' +
    '<path d="M' + X(-4) + ' ' + (y - 4) + 'Q' + X(1) + ' ' + (y - 6) + ' ' + X(4) + ' ' + (y - 4) + '" fill="none" stroke="' + Z.KL + '" stroke-width="1.2" stroke-linecap="round"/>';
}
function beArt(){
  var Z = BE;
  return wrapSvg(
    /* the armoured body */
    beP('M34 50Q34 42 42 40H58Q66 42 66 50L64 66Q58 76 50 78Q42 76 36 66Z', Z.K, Z.KD, 2) +
    '<path d="M38 64Q44 68 46 64L50 68L54 64Q56 68 62 64" fill="none" stroke="' + Z.KL + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
    /* gold shoulder stripes */
    beP('M33 46L40 40L42 43L36 50Z', Z.Y, Z.YD, 1.3) + beP('M67 46L60 40L58 43L64 50Z', Z.Y, Z.YD, 1.3) +
    /* the huge eyeball head, sitting right on top of the black suit */
    '<circle cx="50" cy="27" r="15" fill="' + Z.W + '" stroke="' + Z.WD + '" stroke-width="2.2"/>' +
    '<path d="M38.6 35Q44 41 52 41" fill="none" stroke="#d8d8e0" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="52" cy="27" r="8" fill="' + Z.I + '" stroke="' + Z.ID + '" stroke-width="1.4"/>' +
    '<circle cx="52.6" cy="27.4" r="4.4" fill="' + Z.P + '"/>' +
    '<circle cx="48.6" cy="23.6" r="2.2" fill="#fff"/><circle cx="56" cy="30.4" r="1" fill="' + Z.IL + '"/>');
}
function beBack(c){
  var Z = BE;
  /* black legs with gold ankle bands and chunky boots with gold trim */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + beLine('M' + x1 + ' 74L' + x2 + ' 92', 6, Z.K, Z.KD) + beBand(x2, 90, 0, 11, 3.6) +
      beP('M' + (fx - 8) + ' 104L' + (fx - 7) + ' 94H' + (fx + 4) + 'Q' + (fx + 11) + ' 96 ' + (fx + 11) + ' 104Z', Z.K, Z.KD, 1.8) +
      '<path d="M' + (fx - 6) + ' 99Q' + (fx + 2) + ' 96 ' + (fx + 9) + ' 100" fill="none" stroke="' + Z.Y + '" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  /* thick arms hanging out to the sides, gold bands, big fists */
  /* big bat wings on his back, spreading up and out behind the shoulders */
  function wing(m){
    function X(v){ return 50 + v * m; }
    return beP('M' + X(6) + ' 52L' + X(14) + ' 36Q' + X(24) + ' 20 ' + X(44) + ' 14Q' + X(40) + ' 24 ' + X(44) + ' 34Q' + X(38) + ' 32 ' + X(35) + ' 39Q' + X(29) + ' 36 ' + X(26) + ' 44Q' + X(20) + ' 42 ' + X(17) + ' 50Z', Z.K, Z.KD, 1.8) +
      '<path d="M' + X(14) + ' 36L' + X(44) + ' 14M' + X(16) + ' 40L' + X(35) + ' 39M' + X(15) + ' 44L' + X(26) + ' 44" fill="none" stroke="' + Z.KL + '" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="' + X(14) + '" cy="36" r="1.6" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width=".8"/>';
  }
  var wings = wing(-1) + wing(1);
  var back = beLine('M36 48L20 60', 8, Z.K, Z.KD) + beBand(24, 57, -38, 4, 11) + beBand(28.6, 53.6, -38, 4, 11) + beFist(16, 64, -1);
  var front = beLine('M64 48L80 60', 8, Z.K, Z.KD) + beBand(76, 57, 38, 4, 11) + beBand(71.4, 53.6, 38, 4, 11);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wings + leg('lgL', 44, 41, 39) + leg('lgR', 56, 59, 61) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function beFront(c){
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + beFist(85, 64, 1) + '</g></g></g></svg>';
}
