/* Skull Witch: the owner's own drawing: a slim figure in a black hooded gown that flows to the ground, a smooth blue
   face with glowing white almond eyes and no mouth, long wide sleeves with blue clawed hands, and glowing blue skulls floating
   around her; she throws glowing skulls (Undead, ranged, Normal; shot 'skull'). */
var WI = { K: '#1e2230', KD: '#05060c', KL: '#3a4258', B: '#4a8ae8', BD: '#0e2a6a', BL: '#8ab8ff', E: '#ffffff', S: '#cfe4ff', SD: '#2a5ab8', G: '#7ab8ff' };
function wiSkull(cx, cy, s){      /* a glowing blue skull with an angry look */
  var W = WI; function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (11 * s) + '" fill="' + W.G + '" fill-opacity=".28"/>' +
    '<path d="M' + P(-7, 2) + 'Q' + P(-8, -8) + ' ' + P(0, -8) + 'Q' + P(8, -8) + ' ' + P(7, 2) + 'Q' + P(6, 4) + ' ' + P(4, 4.4) + 'V' + (cy + 7 * s).toFixed(1) + 'H' + (cx - 4 * s).toFixed(1) + 'V' + (cy + 4.4 * s).toFixed(1) + 'Q' + P(-6, 4) + ' ' + P(-7, 2) + 'Z" fill="' + W.S + '" stroke="' + W.SD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M' + P(-5, -2.6) + 'L' + P(-1, -1) + 'L' + P(-2, 1.6) + 'L' + P(-5, 1) + 'Z M' + P(5, -2.6) + 'L' + P(1, -1) + 'L' + P(2, 1.6) + 'L' + P(5, 1) + 'Z" fill="' + W.SD + '"/>' +
    '<path d="M' + P(-0.8, 2.4) + 'L' + P(0, 3.6) + 'L' + P(0.8, 2.4) + 'Z" fill="' + W.SD + '"/>' +
    '<path d="M' + P(-2.6, 4.4) + 'V' + (cy + 7 * s).toFixed(1) + 'M' + P(0, 4.4) + 'V' + (cy + 7 * s).toFixed(1) + 'M' + P(2.6, 4.4) + 'V' + (cy + 7 * s).toFixed(1) + '" stroke="' + W.SD + '" stroke-width=".9"/>';
}
function wiArt(){
  var W = WI;
  return wrapSvg(
    /* slim black bodice */
    outlined('<path d="M38 58Q50 54 62 58L60 74Q50 78 40 74Z"/>', W.K, W.KD) +
    '<path d="M44 66Q46 70 50 70Q54 70 56 66" fill="none" stroke="' + W.KL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* the hood: a tall pointed dark hood framing the face */
    outlined('<path d="M50 6Q66 8 72 26Q76 42 70 54L64 62Q57 58 50 66Q43 58 36 62L30 54Q24 42 28 26Q34 8 50 6Z"/>', W.K, W.KD) +
    '<path d="M38 14Q44 9 51 8.6" fill="none" stroke="' + W.KL + '" stroke-width="2" stroke-linecap="round"/>' +
    /* smooth blue face with a pointed chin, glowing white almond eyes, no mouth */
    outlined('<path d="M50 22C60 22 65 29 65 37C65 46 57 54 50 58C43 54 35 46 35 37C35 29 40 22 50 22Z"/>', W.B, W.BD, 2) +
    '<path d="M41 27Q45 24 50 24" fill="none" stroke="' + W.BL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    '<circle cx="43" cy="39" r="6" fill="' + W.G + '" fill-opacity=".35"/><circle cx="57" cy="39" r="6" fill="' + W.G + '" fill-opacity=".35"/>' +
    '<path d="M36.6 37Q42 33.4 48 39.8Q43 43.4 36.6 37Z" fill="' + W.E + '" stroke="' + W.BD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M63.4 37Q58 33.4 52 39.8Q57 43.4 63.4 37Z" fill="' + W.E + '" stroke="' + W.BD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    /* her neck in the hood's V-collar */
    '<path d="M47 57L50 66L53 57" fill="' + W.B + '" stroke="' + W.BD + '" stroke-width="1.2" stroke-linejoin="round"/>');
}
function wiBack(c){
  var W = WI;
  /* no legs: a long flowing gown down to the ground; its two halves sway as she moves */
  function hem(cls, m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    return '<g class="lg ' + cls + '"><path d="M' + X(50) + ' 72L' + X(50) + ' 104Q' + X(41) + ' 102 ' + X(33) + ' 105Q' + X(26) + ' 101 ' + X(19) + ' 105Q' + X(24) + ' 88 ' + X(40) + ' 72Z" fill="' + W.K + '" stroke="' + W.KD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + X(44) + ' 80Q' + X(40) + ' 92 ' + X(38) + ' 102M' + X(48) + ' 82V102" fill="none" stroke="' + W.KL + '" stroke-width="1.2" stroke-linecap="round"/></g>';
  }
  /* long wide sleeves with blue clawed hands */
  function sleeve(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + W.KD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + W.K + '" stroke-width="6.6" stroke-linecap="round"/>';
  }
  function cuff(x, y){ return '<path d="M' + (x + 6) + ' ' + (y - 6) + 'L' + (x - 2) + ' ' + (y - 4) + 'L' + (x - 2) + ' ' + (y + 6) + 'L' + (x + 6) + ' ' + (y + 6) + 'Z" fill="' + W.K + '" stroke="' + W.KD + '" stroke-width="1.6" stroke-linejoin="round"/>'; }
  function claw(x, y){ return '<path d="M' + x + ' ' + (y - 3) + 'Q' + (x - 6) + ' ' + (y - 3) + ' ' + (x - 9) + ' ' + y + 'M' + x + ' ' + y + 'Q' + (x - 6) + ' ' + y + ' ' + (x - 10) + ' ' + (y + 3) + 'M' + x + ' ' + (y + 2.6) + 'Q' + (x - 5) + ' ' + (y + 3.4) + ' ' + (x - 7) + ' ' + (y + 6.4) + '" fill="none" stroke="' + W.BD + '" stroke-width="3.6" stroke-linecap="round"/>' +
    '<path d="M' + x + ' ' + (y - 3) + 'Q' + (x - 6) + ' ' + (y - 3) + ' ' + (x - 9) + ' ' + y + 'M' + x + ' ' + y + 'Q' + (x - 6) + ' ' + y + ' ' + (x - 10) + ' ' + (y + 3) + 'M' + x + ' ' + (y + 2.6) + 'Q' + (x - 5) + ' ' + (y + 3.4) + ' ' + (x - 7) + ' ' + (y + 6.4) + '" fill="none" stroke="' + W.B + '" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="' + (x + 1) + '" cy="' + y + '" r="3.6" fill="' + W.B + '" stroke="' + W.BD + '" stroke-width="1.4"/>'; }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    wiSkull(14, 34, 0.75) + wiSkull(86, 22, 0.6) + hem('lgL', 1) + hem('lgR', -1) +
    '<g><g class="pump pL">' + sleeve(39, 62, 20, 67) + cuff(18, 67) + claw(14, 67) + '</g></g>' +
    '<g><g class="pump pR">' + sleeve(61, 62, 80, 64) + '</g></g></svg>';
}
function wiFront(c){
  var W = WI;
  /* a glowing skull floating over her clawed hand, ready to throw; it sits in the weapon group so it jolts when she throws */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + wiSkull(94, 50, 0.95) + '</g>' +
    '<path d="M78 58L86 60L86 70L78 70Z" fill="' + W.K + '" stroke="' + W.KD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<circle cx="88" cy="65" r="3.6" fill="' + W.B + '" stroke="' + W.BD + '" stroke-width="1.4"/>' +
    '<path d="M89 62Q94 60 96 57M90 64.6Q95 64 98 61.6M89.6 67.4Q94 68 96 66" fill="none" stroke="' + W.BD + '" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M89 62Q94 60 96 57M90 64.6Q95 64 98 61.6M89.6 67.4Q94 68 96 66" fill="none" stroke="' + W.B + '" stroke-width="1.8" stroke-linecap="round"/>' +
    '</g></g></g></svg>';
}
