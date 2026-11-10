/* Shark Suit: the owner's own drawing: a burly guy in a dark grey shark suit, his pale face frowning out of
   the hood under a big swept-back dorsal fin, a broad chest, clawed feet with silver claws, and big brown rock fists he punches
   with (Earth, melee, Normal). */
var SS2 = { G: '#4a4e5c', GD: '#14161e', GL: '#767c8e', GM: '#3a3e4a', F: '#e8e2cc', FD: '#7a7460', R: '#9a8672', RD: '#2e241a', RL: '#c8b8a2', RM: '#76644e', S: '#e6eaf0', SD: '#5a6070' };
function ssRockFist(x, y, m){      /* a big brown rock fist; m = 1 knuckles right, -1 left */
  var S = SS2; function X(v){ return x + v * m; }
  return '<path d="M' + X(-10) + ' ' + (y - 2) + 'L' + X(-6) + ' ' + (y - 10) + 'L' + X(4) + ' ' + (y - 11) + 'L' + X(11) + ' ' + (y - 5) + 'L' + X(12) + ' ' + (y + 4) + 'L' + X(6) + ' ' + (y + 10) + 'L' + X(-5) + ' ' + (y + 10) + 'L' + X(-11) + ' ' + (y + 4) + 'Z" fill="' + S.R + '" stroke="' + S.RD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M' + X(1) + ' ' + (y - 10.6) + 'L' + X(3) + ' ' + (y - 4) + 'L' + X(0) + ' ' + y + 'M' + X(3) + ' ' + (y - 4) + 'L' + X(9) + ' ' + (y - 2) + 'M' + X(-9) + ' ' + (y + 5) + 'L' + X(-3) + ' ' + (y + 4) + 'L' + X(-1) + ' ' + (y + 9.6) + '" fill="none" stroke="' + S.RD + '" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<path d="M' + X(-5) + ' ' + (y - 8) + 'L' + X(2) + ' ' + (y - 9) + '" stroke="' + S.RL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="' + X(8) + '" cy="' + (y + 5) + '" r="1.2" fill="' + S.RM + '"/><circle cx="' + X(-6) + '" cy="' + (y + 5) + '" r="1" fill="' + S.RM + '"/>';
}
function ssArt(){
  var S = SS2, O = '#0c0e14';
  return wrapSvg(
    /* burly suited body with a lighter grey belly plate */
    outlined('<path d="M30 58Q50 50 70 58Q75 74 66 90Q50 96 34 90Q25 74 30 58Z"/>', S.G, S.GD) +
    '<path d="M40 62Q50 58 60 62Q63 75 58 86Q50 89 42 86Q37 75 40 62Z" fill="' + S.GM + '"/>' +
    '<path d="M41 70Q50 73 59 70M41.5 78Q50 81 58.5 78" fill="none" stroke="' + S.GD + '" stroke-width="1.3" stroke-linecap="round" stroke-opacity=".7"/>' +
    '<path d="M33 61Q40 56 47 56" fill="none" stroke="' + S.GL + '" stroke-width="2" stroke-linecap="round"/>' +
    /* big swept-back dorsal fin on top of the hood */
    outlined('<path d="M44 20Q34 2 14 -2Q26 8 30 26Z"/>', S.G, S.GD, 2.2) +
    '<path d="M38 14Q30 6 20 2" fill="none" stroke="' + S.GL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* the shark hood: a rounded dome with a snout ridge over the face */
    outlined('<path d="M50 12C66 12 74 24 74 38C74 52 66 60 50 60C34 60 26 52 26 38C26 24 34 12 50 12Z"/>', S.G, S.GD) +
    '<path d="M34 20Q42 14 50 14" fill="none" stroke="' + S.GL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* his pale face looking out of the hood */
    outlined('<path d="M50 28C60 28 66 34 66 42C66 50 60 56 50 56C40 56 34 50 34 42C34 34 40 28 50 28Z"/>', S.F, S.FD, 1.8) +
    outlined('<path d="M30 33Q50 22 70 33Q66 30 50 28Q34 30 30 33Z"/>', S.GM, S.GD, 1.8) +
    /* a heavy frown: low brows, small dark eyes, a downturned mouth */
    '<path d="M38 35.5L47 38M62 35.5L53 38" stroke="' + O + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<ellipse cx="43" cy="41" rx="3.4" ry="3.2" fill="#fff" stroke="' + O + '" stroke-width="1.4"/><circle cx="43.6" cy="41.4" r="1.7" fill="' + O + '"/>' +
    '<ellipse cx="57" cy="41" rx="3.4" ry="3.2" fill="#fff" stroke="' + O + '" stroke-width="1.4"/><circle cx="56.4" cy="41.4" r="1.7" fill="' + O + '"/>' +
    '<path d="M44 51Q50 47.6 56 51" fill="none" stroke="' + O + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* gill slits on the hood's sides */
    '<path d="M28 44L30 49M30.5 43L32.5 48M72 44L70 49M69.5 43L67.5 48" stroke="' + S.GD + '" stroke-width="1.4" stroke-linecap="round"/>');
}
function ssBack(c){
  var S = SS2;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + S.GD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + S.G + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 9) + ' 103Q' + (fx - 9) + ' 95 ' + fx + ' 95Q' + (fx + 9) + ' 95 ' + (fx + 9) + ' 103Z" fill="' + S.G + '" stroke="' + S.GD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 8) + ' 103L' + (fx - 7) + ' 107L' + (fx - 4) + ' 103ZM' + (fx - 2) + ' 103L' + fx + ' 107.5L' + (fx + 2) + ' 103ZM' + (fx + 4) + ' 103L' + (fx + 7) + ' 107L' + (fx + 8) + ' 103Z" fill="' + S.S + '" stroke="' + S.SD + '" stroke-width="1" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.GD + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.G + '" stroke-width="9" stroke-linecap="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 40, 37, 34) + leg('lgR', 60, 63, 66) +
    '<g><g class="pump pL">' + arm(29, 62, 16, 68) + ssRockFist(12, 72, -1) + '</g></g>' +
    '<g><g class="pump pR">' + arm(71, 62, 83, 65) + '</g></g></svg>';
}
function ssFront(c){
  /* the front rock fist; it sits in the weapon group so it punches when he hits */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + ssRockFist(89, 66, 1) + '</g></g></g></g></svg>';
}
