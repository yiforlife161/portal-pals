/* Undead purple dragon (no name yet): an original slim grave dragon pal (preview only). Undead, ranged.
   Long snout, dark swept-back horns, bone ridge spikes, glowing cyan eyes,
   torn wings with holes, a bony tail ending in a purple lightning bolt, and purple lightning he shoots. */
var WYRM = { P: '#6e4aa8', PD: '#2f1d55', PL: '#a98bd8', SH: '#4a3080', B: '#ece2c8', BD: '#5a4a3a', G: '#7ff3ff', GD: '#1a7f8f', M: '#3d3550', MD: '#1c1628' };
/* crackling purple lightning: a glow, a zigzag bolt and a few sparks */
function wyrmBolt(cx, cy, s){
  function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (10 * s) + '" fill="#b77bff" fill-opacity=".28"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + (6 * s) + '" fill="#d6b3ff" fill-opacity=".45"/>' +
    '<path d="M' + P(2, -12) + 'L' + P(-5, -1) + 'L' + P(0, -1) + 'L' + P(-4, 11) + 'L' + P(6, -3) + 'L' + P(1, -3) + 'L' + P(5, -12) + 'Z" fill="#f1e2ff" stroke="#5a1fa0" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M' + P(-7, -7) + 'L' + P(-10, -9) + 'M' + P(8, 5) + 'L' + P(11, 7) + 'M' + P(-8, 6) + 'L' + P(-11, 8) + 'M' + P(8, -8) + 'L' + P(10, -11) + '" stroke="#c99aff" stroke-width="' + (1.6 * s).toFixed(1) + '" stroke-linecap="round"/>';
}
function wyrmArt(){
  var W = WYRM, O = '#160f26';
  return wrapSvg(
    /* slim body with a paler belly */
    outlined('<path d="M39 64Q50 59 61 64Q65 78 60 90Q50 94 40 90Q35 78 39 64Z"/>', W.P, W.PD) +
    '<path d="M44 68Q50 65 56 68Q58 79 55 87Q50 89.5 45 87Q42 79 44 68Z" fill="' + W.PL + '" fill-opacity=".55"/>' +
    /* thin neck */
    outlined('<path d="M44 52L56 52L57 66Q50 69 43 66Z"/>', W.P, W.PD, 2.4) +
    /* dark swept-back horns */
    outlined('<path d="M37 27Q25 22 17 8Q27 13 41 22Z"/><path d="M63 27Q75 22 83 8Q73 13 59 22Z"/>', '#2b2238', '#120c1e', 2.2) +
    '<path d="M22 12Q29 18 36 22M78 12Q71 18 64 22" fill="none" stroke="#6a5a88" stroke-width="1.4" stroke-linecap="round"/>' +
    /* narrow head */
    outlined('<path d="M50 18C63 18 71 27 71 38C71 47 64 54 50 54C36 54 29 47 29 38C29 27 37 18 50 18Z"/>', W.P, W.PD) +
    /* bone ridge spikes along the top */
    outlined('<path d="M46 20L50 11L54 20Z"/><path d="M41 22L43 15L46.5 20.5Z"/><path d="M59 22L57 15L53.5 20.5Z"/>', W.B, W.BD, 1.8) +
    /* rounded snout */
    outlined('<path d="M50 42C58 42 62 46 62 52C62 59 57 63 50 63C43 63 38 59 38 52C38 46 42 42 50 42Z"/>', W.PL, W.PD, 2.4) +
    '<path d="M44.5 48L47 50.5M55.5 48L53 50.5" stroke="' + W.PD + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M42.5 57Q50 60 57.5 57" fill="none" stroke="' + W.PD + '" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M45 57.6L46.2 61L47.6 58.2Z M55 57.6L53.8 61L52.4 58.2Z" fill="' + W.B + '" stroke="' + W.PD + '" stroke-width="0.9" stroke-linejoin="round"/>' +
    /* sunken eye shadows and glowing cyan eyes */
    '<path d="M31 36Q37 29 46 34Q44 42 37 42Q32 41 31 36Z M69 36Q63 29 54 34Q56 42 63 42Q68 41 69 36Z" fill="' + W.SH + '"/>' +
    '<path d="M33.5 36.5Q38 32 44 35Q42.5 40 37.5 40Q34.5 39.6 33.5 36.5Z" fill="' + W.G + '" stroke="' + O + '" stroke-width="1.6"/><path d="M39.6 33.6V40" stroke="' + O + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M66.5 36.5Q62 32 56 35Q57.5 40 62.5 40Q65.5 39.6 66.5 36.5Z" fill="' + W.G + '" stroke="' + O + '" stroke-width="1.6"/><path d="M60.4 33.6V40" stroke="' + O + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M33 31L44 33.5M67 31L56 33.5" stroke="' + W.PD + '" stroke-width="2.4" stroke-linecap="round"/>');
}
function wyrmBack(c){
  var W = WYRM;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 97" stroke="' + W.PD + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 97" stroke="' + W.P + '" stroke-width="4.2" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 6.5) + ' 103Q' + (fx - 6) + ' 96 ' + fx + ' 96Q' + (fx + 6) + ' 96 ' + (fx + 6.5) + ' 103Z" fill="' + W.P + '" stroke="' + W.PD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 5) + ' 103L' + (fx - 6.5) + ' 106M' + fx + ' 103V106.5M' + (fx + 5) + ' 103L' + (fx + 6.5) + ' 106" stroke="' + W.B + '" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + W.PD + '" stroke-width="7.6" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + W.P + '" stroke-width="4" stroke-linecap="round"/>';
  }
  /* torn wings: dark membrane with a ragged edge and holes, thin purple frame */
  function wing(m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    var bone = 'M' + X(40) + ' 66Q' + X(22) + ' 46 ' + X(2) + ' 30';
    var skin = bone + 'L' + X(6) + ' 42L' + X(1) + ' 47L' + X(9) + ' 52L' + X(6) + ' 59L' + X(16) + ' 60L' + X(16) + ' 67L' + X(26) + ' 66L' + X(30) + ' 71L' + X(40) + ' 66Z' +
      'M' + X(15) + ' 47a2.6 3.2 0 1 0 0.1 0Z M' + X(25) + ' 58a2 2.4 0 1 0 0.1 0Z';
    return '<path d="' + skin + '" fill="' + W.M + '" fill-rule="evenodd" stroke="' + W.MD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + X(12) + ' 40L' + X(8) + ' 51M' + X(20) + ' 49L' + X(17) + ' 59M' + X(29) + ' 57L' + X(27) + ' 65" stroke="' + W.PD + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="' + bone + '" fill="none" stroke="' + W.PD + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="' + bone + '" fill="none" stroke="' + W.P + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M' + X(2) + ' 30L' + X(-1) + ' 25L' + X(5) + ' 28Z" fill="' + W.B + '" stroke="' + W.BD + '" stroke-width="1.4" stroke-linejoin="round"/>';
  }
  /* thin bony tail out to the left, a purple lightning bolt at the tip */
  var tailPath = 'M40 89Q26 97 14 90Q8 86 9 80';
  var tail = '<path d="' + tailPath + '" fill="none" stroke="' + W.PD + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="' + tailPath + '" fill="none" stroke="' + W.P + '" stroke-width="3.6" stroke-linecap="round"/>' +
    '<circle cx="33" cy="92.5" r="1.4" fill="' + W.B + '"/><circle cx="25" cy="94" r="1.4" fill="' + W.B + '"/><circle cx="17" cy="92" r="1.3" fill="' + W.B + '"/>' +
    '<path d="M10 82L3 74L8 73L2 64L15 75L10 76L13 82Z" fill="#c99aff" stroke="#3b1a66" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M6 71L8.5 73.5" stroke="#f1e2ff" stroke-width="1.4" stroke-linecap="round"/>';
  /* back arm: thin, with bone claws */
  var claw = '<path d="M17 72L12 70M17 73.5L11.5 75M18 75.5L14 79" stroke="' + W.B + '" stroke-width="2" stroke-linecap="round"/><circle cx="18.5" cy="73" r="3.6" fill="' + W.P + '" stroke="' + W.PD + '" stroke-width="1.8"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wing(-1) + wing(1) + tail + leg('lgL', 44, 41, 39) + leg('lgR', 56, 59, 61) +
    '<g><g class="pump pL">' + arm(38, 70, 20, 73) + claw + '</g></g>' +
    '<g><g class="pump pR">' + arm(62, 69, 81, 66) + '</g></g></svg>';
}
function wyrmFront(c){
  var W = WYRM;
  /* purple lightning crackling over his claw; it sits in the weapon group so it jolts when he attacks */
  var flame = '<g transform="rotate(-18 86 64)">' + wyrmBolt(95, 50, 1.15) + '</g>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + flame +
    '<path d="M85 61L87 56M87.5 62.5L91 59M88 65.5L92.5 64" stroke="' + W.B + '" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="84" cy="65.5" r="3.8" fill="' + W.P + '" stroke="' + W.PD + '" stroke-width="1.8"/></g></g></g></svg>';
}
