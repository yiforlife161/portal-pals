/* Masked rogue (no name yet): an original human girl in full leather armour, with a green eye mask, a brown bandana over her
   nose and mouth, a dark blue ponytail, and a dagger in each hand (melee). (preview only) */
var ROGUE = { S: '#f2c9a5', SD: '#8a5a3c', H: '#243a7a', HD: '#0c1538', HL: '#4a68b8', L: '#8a5530', LD: '#3a200e', LL: '#b07444', M: '#2fa86a', MD: '#0f4a2c', B: '#6a3f22', BD: '#2e170a', ST: '#d9dde6', STD: '#4a5060' };
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
    /* ponytail behind the head, on the side away from where she faces (her weapon hand is the front) */
    outlined('<path d="M38 22Q22 18 18 30Q16 42 24 52Q22 40 30 34Z"/>', R.H, R.HD, 2.2) +
    '<path d="M28 26Q21 30 22 40" fill="none" stroke="' + R.HL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* leather cuirass with a strap, shoulder pads and a belt with pouches */
    outlined('<path d="M37 60Q50 55 63 60L64 82Q50 87 36 82Z"/>', R.L, R.LD) +
    '<path d="M39 62L61 78" stroke="' + R.B + '" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="70" r="2" fill="#c99a3a" stroke="#5a3a10" stroke-width="1"/>' +
    '<path d="M42 64Q43.5 72 42 79M58 64Q56.5 72 58 79" fill="none" stroke="' + R.LL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    outlined('<path d="M35 79Q50 84 65 79L65 85Q50 90 35 85Z"/>', R.B, R.BD, 2) +
    '<rect x="47" y="81" width="6" height="5" rx="1.2" fill="#c99a3a" stroke="#5a3a10" stroke-width="1.1"/>' +
    outlined('<rect x="37" y="83" width="6" height="6.5" rx="2"/><rect x="57" y="83" width="6" height="6.5" rx="2"/>', R.L, R.LD, 1.6) +
    outlined('<path d="M29 56Q31 50 39 51L40 60Q33 62 29 60Z"/><path d="M71 56Q69 50 61 51L60 60Q67 62 71 60Z"/>', R.LL, R.LD, 2.2) +
    '<path d="M31 55Q34 52.5 37.5 53.5M69 55Q66 52.5 62.5 53.5" fill="none" stroke="' + R.LD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* neck and head */
    '<rect x="46" y="52" width="8" height="8" fill="' + R.S + '" stroke="' + R.SD + '" stroke-width="1.6"/>' +
    outlined('<path d="M50 20C62 20 69 29 69 39C69 49 62 57 50 57C38 57 31 49 31 39C31 29 38 20 50 20Z"/>', R.S, R.SD) +
    /* auburn hair: a fringe swept to one side */
    outlined('<path d="M30 38C29 24 38 16 51 16C63 16 71 24 70 36Q64 28 54 27Q48 33 38 32Q33 33 30 38Z"/>', R.H, R.HD, 2.4) +
    '<path d="M40 21Q47 18 55 19" fill="none" stroke="' + R.HL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* green eye mask with the eyes */
    outlined('<path d="M31 36Q40 32 50 36Q60 32 69 36L68 43Q60 47 52 43L50 41.5L48 43Q40 47 32 43Z"/>', R.M, R.MD, 2) +
    '<ellipse cx="41" cy="39.6" rx="4.4" ry="3.4" fill="#fff" stroke="' + O + '" stroke-width="1.3"/><circle cx="41.8" cy="39.8" r="2.2" fill="#3a2a1e"/><circle cx="42.6" cy="39" r="0.8" fill="#fff"/>' +
    '<ellipse cx="59" cy="39.6" rx="4.4" ry="3.4" fill="#fff" stroke="' + O + '" stroke-width="1.3"/><circle cx="58.2" cy="39.8" r="2.2" fill="#3a2a1e"/><circle cx="59" cy="39" r="0.8" fill="#fff"/>' +
    '<path d="M35 34.5L45 36.5M65 34.5L55 36.5" stroke="' + R.HD + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M31 37L24 34L26 39Z" fill="' + R.M + '" stroke="' + R.MD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    /* brown bandana over nose and mouth */
    outlined('<path d="M32 45Q50 50 68 45L66 52Q60 59 50 60Q40 59 34 52Z"/>', R.B, R.BD, 2.2) +
    '<path d="M38 51Q50 55 62 51" fill="none" stroke="' + R.BD + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".7"/>');
}
function rogueBack(c){
  var R = ROGUE;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + R.LD + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + R.L + '" stroke-width="3.6" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 7) + ' 104L' + (fx - 6) + ' 93H' + (fx + 5) + 'L' + (fx + 6) + ' 98Q' + (fx + 10) + ' 99 ' + (fx + 10) + ' 104Z" fill="' + R.B + '" stroke="' + R.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 6.5) + ' 96.5H' + (fx + 5.5) + '" stroke="' + R.LL + '" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + R.SD + '" stroke-width="6.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + R.S + '" stroke-width="3.4" stroke-linecap="round"/>';
  }
  /* leather bracer and a dagger in the back hand */
  var hand = '<path d="M17 66L25 67.5" stroke="' + R.LD + '" stroke-width="6" stroke-linecap="round"/><path d="M17 66L25 67.5" stroke="' + R.L + '" stroke-width="3.6" stroke-linecap="round"/>' +
    rogueKnife(13, 70, -1) + '<circle cx="13.5" cy="69" r="3.4" fill="' + R.S + '" stroke="' + R.SD + '" stroke-width="1.5"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 42, 39) + leg('lgR', 56, 58, 61) +
    '<g><g class="pump pL">' + arm(37, 62, 17, 68) + hand + '</g></g>' +
    '<g><g class="pump pR">' + arm(63, 62, 84, 64) + '<path d="M75 62.5L82 63.5" stroke="' + R.LD + '" stroke-width="6" stroke-linecap="round"/><path d="M75 62.5L82 63.5" stroke="' + R.L + '" stroke-width="3.6" stroke-linecap="round"/></g></g></svg>';
}
function rogueFront(c){
  /* the front dagger sits in the weapon group so it slashes when she attacks */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + rogueKnife(86, 64, 1) + '<circle cx="86" cy="64.5" r="3.6" fill="' + ROGUE.S + '" stroke="' + ROGUE.SD + '" stroke-width="1.6"/></g></g></g></svg>';
}
