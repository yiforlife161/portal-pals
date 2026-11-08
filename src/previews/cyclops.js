/* One-eyed soldier (no name yet): an original pal in the owner's black-and-gold colours. An all-black full helmet with a gold crest,
   one big blue eye showing through a round opening, a mouth grille, black plate armour with gold trim, and big gauntlet fists
   (Undead, melee, Giant). (preview only) */
var CYC = { K: '#24222a', KD: '#0b0a0f', KL: '#46424f', Y: '#f2b81e', YD: '#7a5400', E: '#2f5fd8', ED: '#13286a' };
function cycFist(x, y, m){      /* a black gauntlet fist with gold knuckles; m = 1 knuckles right, -1 left */
  var C = CYC; function X(v){ return x + v * m; }
  return '<path d="M' + X(-6) + ' ' + (y - 6) + 'Q' + X(5) + ' ' + (y - 9) + ' ' + X(8) + ' ' + (y - 2) + 'Q' + X(9) + ' ' + (y + 5) + ' ' + X(3) + ' ' + (y + 7) + 'Q' + X(-5) + ' ' + (y + 8) + ' ' + X(-8) + ' ' + (y + 2) + 'Q' + X(-9) + ' ' + (y - 4) + ' ' + X(-6) + ' ' + (y - 6) + 'Z" fill="' + C.K + '" stroke="' + C.KD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M' + X(4) + ' ' + (y - 6) + 'Q' + X(8) + ' ' + (y - 1) + ' ' + X(5) + ' ' + (y + 4) + '" fill="none" stroke="' + C.Y + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M' + X(-3) + ' ' + (y + 1) + 'H' + X(2) + '" stroke="' + C.KL + '" stroke-width="1.4" stroke-linecap="round"/>';
}
function cycArt(){
  var C = CYC, O = '#120f18';
  return wrapSvg(
    /* black breastplate with gold trim, a gold chevron and a gold belt */
    outlined('<path d="M30 58Q50 51 70 58L72 80Q50 88 28 80Z"/>', C.K, C.KD) +
    '<path d="M33 60Q50 54 67 60" fill="none" stroke="' + C.Y + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M42 66L50 71L58 66" fill="none" stroke="' + C.Y + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M38 64Q40 72 38 78M62 64Q60 72 62 78" fill="none" stroke="' + C.KL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    outlined('<path d="M29 78Q50 85 71 78L71 84Q50 91 29 84Z"/>', C.Y, C.YD, 2) +
    '<rect x="46.5" y="80.5" width="7" height="6" rx="1.5" fill="' + C.K + '" stroke="' + C.YD + '" stroke-width="1.4"/>' +
    /* shoulder plates */
    outlined('<path d="M20 52Q24 44 35 47L37 58Q28 60 21 58Z"/><path d="M80 52Q76 44 65 47L63 58Q72 60 79 58Z"/>', C.K, C.KD, 2.4) +
    '<path d="M22 53Q26 47 34 49M78 53Q74 47 66 49" fill="none" stroke="' + C.Y + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* all-black full helmet */
    outlined('<path d="M50 12C64 12 72 22 72 36L71 52Q68 59 62 60L38 60Q32 59 29 52L28 36C28 22 36 12 50 12Z"/>', C.K, C.KD) +
    '<path d="M35 20Q41 15 48 14.5" fill="none" stroke="' + C.KL + '" stroke-width="2.6" stroke-linecap="round"/>' +
    /* gold crest running over the top of the helmet */
    outlined('<path d="M45.5 18Q44 6 50 -1Q56 6 54.5 18Q50 15.5 45.5 18Z"/>', C.Y, C.YD, 2) +
    '<path d="M50 2V14" stroke="#ffe08a" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M29.5 44H35M70.5 44H65" stroke="' + C.KL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* round opening with the one big eye */
    '<circle cx="50" cy="35" r="16" fill="' + C.KD + '" stroke="' + C.Y + '" stroke-width="2.6"/>' +
    '<circle cx="50" cy="35.5" r="13.4" fill="#fbf8f0" stroke="' + O + '" stroke-width="1.8"/>' +
    '<circle cx="50.5" cy="36.2" r="8.2" fill="' + C.E + '" stroke="' + C.ED + '" stroke-width="1.8"/><circle cx="50.5" cy="36.2" r="4" fill="' + O + '"/>' +
    '<circle cx="47.4" cy="33" r="2" fill="#fff"/><circle cx="54.6" cy="39.6" r="1.1" fill="#bcd0ff"/>' +
    '<path d="M36 25Q50 18 64 25" fill="none" stroke="' + C.KD + '" stroke-width="3.8" stroke-linecap="round"/>' +
    /* mouth grille */
    '<path d="M42 53.5H58M43.5 57H56.5" stroke="' + C.Y + '" stroke-width="2.2" stroke-linecap="round"/>');
}
function cycBack(c){
  var C = CYC;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 96" stroke="' + C.KD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 96" stroke="' + C.K + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="' + (x1 + (x2 - x1) * 0.45) + '" cy="89.5" r="3.2" fill="' + C.Y + '" stroke="' + C.YD + '" stroke-width="1.4"/>' +
      '<path d="M' + (fx - 8.5) + ' 104Q' + (fx - 8.5) + ' 95 ' + fx + ' 95Q' + (fx + 9.5) + ' 95 ' + (fx + 9.5) + ' 104Z" fill="' + C.K + '" stroke="' + C.KD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 7) + ' 102H' + (fx + 8) + '" stroke="' + C.Y + '" stroke-width="2.2" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.KD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.K + '" stroke-width="8" stroke-linecap="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(32, 60, 17, 68) + '<path d="M19 63.5L22 70" stroke="' + C.Y + '" stroke-width="3.4" stroke-linecap="round"/>' + cycFist(13, 72, -1) + '</g></g>' +
    '<g><g class="pump pR">' + arm(68, 60, 82, 64) + '<path d="M79 59.5L78 66.5" stroke="' + C.Y + '" stroke-width="3.4" stroke-linecap="round"/></g></g></svg>';
}
function cycFront(c){
  /* the front fist sits in the weapon group so it punches forward when he hits */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + cycFist(89, 66, 1) + '</g></g></g></g></svg>';
}
