/* Masked rogue (no name yet): an original human girl in full leather armour, with a green eye mask, a brown bandana over her
   nose and mouth, an auburn ponytail, and a dagger in each hand (melee). (preview only) */
var ROGUE = { S: '#f2c9a5', SD: '#8a5a3c', H: '#a8432a', HD: '#4a1a0e', HL: '#d0663f', L: '#8a5530', LD: '#3a200e', LL: '#b07444', M: '#2fa86a', MD: '#0f4a2c', B: '#6a3f22', BD: '#2e170a', ST: '#d9dde6', STD: '#4a5060' };
function rogueKnife(x, y, m){      /* a short dagger held point-up; m = 1 blade leaning right, -1 left */
  var R = ROGUE; function X(v){ return x + v * m; }
  return '<path d="M' + X(-1.6) + ' ' + (y - 3) + 'L' + X(4) + ' ' + (y - 21) + 'Q' + X(6) + ' ' + (y - 16) + ' ' + X(2.6) + ' ' + (y - 2) + 'Z" fill="' + R.ST + '" stroke="' + R.STD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M' + X(1) + ' ' + (y - 5) + 'L' + X(3.6) + ' ' + (y - 16) + '" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-opacity=".8"/>' +
    '<rect x="' + (x - 5) + '" y="' + (y - 3.5) + '" width="10" height="3" rx="1.2" fill="#c99a3a" stroke="#5a3a10" stroke-width="1.1"/>' +
    '<rect x="' + (x - 1.6) + '" y="' + (y - 0.5) + '" width="3.2" height="7" rx="1.2" fill="' + R.B + '" stroke="' + R.BD + '" stroke-width="1"/>';
}
function rogueArt(){
  var R = ROGUE, O = '#1e1410';
  return wrapSvg(
    /* ponytail behind the head */
    outlined('<path d="M62 22Q78 18 82 30Q84 42 76 52Q78 40 70 34Z"/>', R.H, R.HD, 2.2) +
    '<path d="M72 26Q79 30 78 40" fill="none" stroke="' + R.HL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* leather cuirass with a strap, shoulder pads and a belt with pouches */
    outlined('<path d="M33 60Q50 54 67 60L69 82Q50 88 31 82Z"/>', R.L, R.LD) +
    '<path d="M36 62L64 78" stroke="' + R.B + '" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="70" r="2" fill="#c99a3a" stroke="#5a3a10" stroke-width="1"/>' +
    '<path d="M40 64Q42 72 40 79M60 64Q58 72 60 79" fill="none" stroke="' + R.LL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    outlined('<path d="M31 79Q50 85 69 79L69 85Q50 91 31 85Z"/>', R.B, R.BD, 2) +
    '<rect x="47" y="81" width="6" height="5" rx="1.2" fill="#c99a3a" stroke="#5a3a10" stroke-width="1.1"/>' +
    outlined('<rect x="34" y="83" width="7" height="7" rx="2"/><rect x="59" y="83" width="7" height="7" rx="2"/>', R.L, R.LD, 1.6) +
    outlined('<path d="M24 56Q26 49 36 50L37 60Q29 62 24 60Z"/><path d="M76 56Q74 49 64 50L63 60Q71 62 76 60Z"/>', R.LL, R.LD, 2.2) +
    '<path d="M27 55Q30 52 34 53M73 55Q70 52 66 53" fill="none" stroke="' + R.LD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* neck and head */
    '<rect x="45" y="52" width="10" height="8" fill="' + R.S + '" stroke="' + R.SD + '" stroke-width="1.6"/>' +
    outlined('<path d="M50 20C62 20 69 29 69 39C69 49 62 57 50 57C38 57 31 49 31 39C31 29 38 20 50 20Z"/>', R.S, R.SD) +
    /* auburn hair: a fringe swept to one side */
    outlined('<path d="M30 38C29 24 38 16 51 16C63 16 71 24 70 36Q64 28 54 27Q48 33 38 32Q33 33 30 38Z"/>', R.H, R.HD, 2.4) +
    '<path d="M40 21Q47 18 55 19" fill="none" stroke="' + R.HL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* green eye mask with the eyes */
    outlined('<path d="M31 36Q40 32 50 36Q60 32 69 36L68 43Q60 47 52 43L50 41.5L48 43Q40 47 32 43Z"/>', R.M, R.MD, 2) +
    '<ellipse cx="41" cy="39.6" rx="4.4" ry="3.4" fill="#fff" stroke="' + O + '" stroke-width="1.3"/><circle cx="41.8" cy="39.8" r="2.2" fill="#3a2a1e"/><circle cx="42.6" cy="39" r="0.8" fill="#fff"/>' +
    '<ellipse cx="59" cy="39.6" rx="4.4" ry="3.4" fill="#fff" stroke="' + O + '" stroke-width="1.3"/><circle cx="58.2" cy="39.8" r="2.2" fill="#3a2a1e"/><circle cx="59" cy="39" r="0.8" fill="#fff"/>' +
    '<path d="M35 34.5L45 36.5M65 34.5L55 36.5" stroke="' + R.HD + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M69 37L76 34L74 39Z" fill="' + R.M + '" stroke="' + R.MD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    /* brown bandana over nose and mouth */
    outlined('<path d="M32 45Q50 50 68 45L66 52Q60 59 50 60Q40 59 34 52Z"/>', R.B, R.BD, 2.2) +
    '<path d="M38 51Q50 55 62 51" fill="none" stroke="' + R.BD + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".7"/>');
}
function rogueBack(c){
  var R = ROGUE;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + R.LD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + R.L + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 7) + ' 104L' + (fx - 6) + ' 93H' + (fx + 5) + 'L' + (fx + 6) + ' 98Q' + (fx + 10) + ' 99 ' + (fx + 10) + ' 104Z" fill="' + R.B + '" stroke="' + R.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 6.5) + ' 96.5H' + (fx + 5.5) + '" stroke="' + R.LL + '" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + R.SD + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + R.S + '" stroke-width="4.6" stroke-linecap="round"/>';
  }
  /* leather bracer and a dagger in the back hand */
  var hand = '<path d="M17 66L25 67.5" stroke="' + R.LD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M17 66L25 67.5" stroke="' + R.L + '" stroke-width="4.6" stroke-linecap="round"/>' +
    rogueKnife(13, 70, -1) + '<circle cx="13.5" cy="69" r="3.4" fill="' + R.S + '" stroke="' + R.SD + '" stroke-width="1.5"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 42, 40, 37) + leg('lgR', 58, 60, 63) +
    '<g><g class="pump pL">' + arm(34, 62, 16, 68) + hand + '</g></g>' +
    '<g><g class="pump pR">' + arm(66, 62, 84, 64) + '<path d="M75 62.5L82 63.5" stroke="' + R.LD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M75 62.5L82 63.5" stroke="' + R.L + '" stroke-width="4.6" stroke-linecap="round"/></g></g></svg>';
}
function rogueFront(c){
  /* the front dagger sits in the weapon group so it slashes when she attacks */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + rogueKnife(86, 64, 1) + '<circle cx="86" cy="64.5" r="3.6" fill="' + ROGUE.S + '" stroke="' + ROGUE.SD + '" stroke-width="1.6"/></g></g></g></svg>';
}
