/* Mushroom guy (no name yet): the owner's own drawing of a yellow one-eyed mushroom creature with a big red cap with white spots,
   red clawed gloves, and a little spotted mushroom he throws (ranged). (preview only) */
var SH = { Y: '#f6c63a', YD: '#7a5600', YL: '#ffe07a', R: '#e2382a', RD: '#6e140c', W: '#fbf7ee', GL: '#e8b86a', GLD: '#8a5a1a' };
function shGlove(x, y, m, k){      /* a bulky red glove with white claws; m = 1 claws right, -1 left */
  var S = SH; k = k || 1; function X(v){ return x + v * m * k; } function Y(v){ return y + v * k; }
  return '<path d="M' + X(-7) + ' ' + Y(-3) + 'Q' + X(-7) + ' ' + Y(-9) + ' ' + X(0) + ' ' + Y(-9) + 'Q' + X(8) + ' ' + Y(-8) + ' ' + X(8) + ' ' + Y(0) + 'Q' + X(8) + ' ' + Y(8) + ' ' + X(0) + ' ' + Y(8) + 'Q' + X(-8) + ' ' + Y(7) + ' ' + X(-7) + ' ' + Y(-3) + 'Z" fill="' + S.R + '" stroke="' + S.RD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M' + X(-3) + ' ' + Y(-7) + 'Q' + X(1) + ' ' + Y(-4) + ' ' + X(-2) + ' ' + Y(0) + 'M' + X(2) + ' ' + Y(-6) + 'Q' + X(6) + ' ' + Y(-2) + ' ' + X(3) + ' ' + Y(2) + '" fill="none" stroke="' + S.RD + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".6"/>' +
    '<path d="M' + X(5) + ' ' + Y(-6) + 'L' + X(11) + ' ' + Y(-9) + 'L' + X(8) + ' ' + Y(-2) + 'Z M' + X(7) + ' ' + Y(1) + 'L' + X(13) + ' ' + Y(1) + 'L' + X(7.5) + ' ' + Y(5) + 'Z M' + X(2) + ' ' + Y(6) + 'L' + X(5) + ' ' + Y(12) + 'L' + X(-1) + ' ' + Y(7) + 'Z" fill="' + S.W + '" stroke="#5a5040" stroke-width="1.1" stroke-linejoin="round"/>';
}
function shMini(cx, cy, s){      /* the little spotted mushroom he throws */
  var S = SH; function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<path d="M' + P(-3, 0) + 'L' + P(-3.5, 9) + 'Q' + P(0, 11) + ' ' + P(3.5, 9) + 'L' + P(3, 0) + 'Z" fill="' + S.W + '" stroke="#7a6a50" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="M' + P(-11, 1) + 'C' + P(-11, -9) + ' ' + P(11, -9) + ' ' + P(11, 1) + 'Q' + P(0, 4) + ' ' + P(-11, 1) + 'Z" fill="' + S.R + '" stroke="' + S.RD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<circle cx="' + (cx - 4.5 * s) + '" cy="' + (cy - 3 * s) + '" r="' + (2 * s) + '" fill="' + S.W + '"/><circle cx="' + (cx + 3 * s) + '" cy="' + (cy - 5 * s) + '" r="' + (1.6 * s) + '" fill="' + S.W + '"/><circle cx="' + (cx + 7 * s) + '" cy="' + (cy - 1 * s) + '" r="' + (1.3 * s) + '" fill="' + S.W + '"/>';
}
function shArt(){
  var S = SH, O = '#1e1608';
  return wrapSvg(
    /* yellow bean body with the big eye and smile */
    outlined('<path d="M29 36Q29 29 36 29L64 29Q71 29 71 36L73 76Q73 91 50 91Q27 91 27 76Z"/>', S.Y, S.YD) +
    '<path d="M33 38Q32 60 35 80" fill="none" stroke="' + S.YL + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<circle cx="50" cy="52" r="14" fill="#fff" stroke="' + O + '" stroke-width="2.2"/><circle cx="51.4" cy="53" r="7.6" fill="' + O + '"/><circle cx="54.6" cy="49.6" r="2.7" fill="#fff"/>' +
    '<path d="M35.5 52Q34 44 38.5 39M64.5 52Q66 44 61.5 39" fill="none" stroke="#c99a1a" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M36 71Q50 81 64 71" fill="none" stroke="' + O + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M45 80Q50 82.5 55 80" fill="none" stroke="#c99a1a" stroke-width="1.3" stroke-linecap="round"/>' +
    /* gills under the cap */
    '<path d="M14 32Q50 21 86 32Q80 39 50 38Q20 39 14 32Z" fill="' + S.GL + '" stroke="' + S.GLD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M22 33L26 37M30 31L33 37.5M39 29.5L41 38M47 29L48 38M53 29L52 38M61 29.5L59 38M70 31L67 37.5M78 33L74 37" stroke="' + S.GLD + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* big red cap with white spots */
    outlined('<path d="M7 33C2 10 28 -4 50 -4C72 -4 98 10 93 33Q50 21 7 33Z"/>', S.R, S.RD) +
    '<ellipse cx="50" cy="4" rx="10" ry="5.4" fill="' + S.W + '"/><ellipse cx="27" cy="11" rx="7" ry="5.2" fill="' + S.W + '"/><ellipse cx="73" cy="11" rx="7" ry="5.2" fill="' + S.W + '"/>' +
    '<ellipse cx="40" cy="19" rx="5.6" ry="4" fill="' + S.W + '"/><ellipse cx="61" cy="19.5" rx="5.2" ry="3.8" fill="' + S.W + '"/><ellipse cx="13" cy="25" rx="3.6" ry="3" fill="' + S.W + '"/><ellipse cx="87" cy="25" rx="3.6" ry="3" fill="' + S.W + '"/>' +
    '<path d="M18 11Q28 3 40 1" fill="none" stroke="#ff8a7a" stroke-width="2.4" stroke-linecap="round" stroke-opacity=".8"/>');
}
function shBack(c){
  var S = SH;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + S.YD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + S.Y + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 8) + ' 103Q' + (fx - 8) + ' 94 ' + fx + ' 94Q' + (fx + 8) + ' 94 ' + (fx + 8) + ' 103Z" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="2.2" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.YD + '" stroke-width="8.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.Y + '" stroke-width="4.6" stroke-linecap="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 39, 36) + leg('lgR', 59, 61, 64) +
    '<g><g class="pump pL">' + arm(30, 62, 18, 68) + shGlove(13, 70, -1, 1.35) + '</g></g>' +
    '<g><g class="pump pR">' + arm(70, 62, 83, 65) + '</g></g></svg>';
}
function shFront(c){
  /* the front glove holds a little mushroom up, drawn over the glove, ready to throw; it sits in the weapon group so it jerks when he throws */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + shGlove(88, 65, 1, 1.35) + shMini(92, 52, 1.35) + '</g></g></g></g></svg>';
}
