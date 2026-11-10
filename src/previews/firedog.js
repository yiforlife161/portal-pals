/* Fire Pup: an original fire dog after the owner's idea: a red pup standing on two legs, with perky ears that flop
   over at the tips, a small flame crest, round amber eyes, a long cream muzzle with a big dark nose, a toothy grin with two fangs, a cream chest ruff, ember speckles, flames at his wrists and ankles and a blazing tail
   and he throws ember balls (Fire, ranged, Normal). */
var FD = { R: '#d23a24', RD: '#3a0a06', RL: '#ff7a52', C: '#f6dcae', CD: '#8a5a2a', F: '#ff6a1e', FL: '#ffd23e', FD: '#8a1a00', A: '#ffb21e', K: '#1a0806' };
function fdFlame(cx, cy, s, ang){      /* a flame licking upwards (rotated by ang) */
  function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<g transform="rotate(' + (ang || 0) + ' ' + cx + ' ' + cy + ')"><path d="M' + P(-8, 4) + 'C' + P(-12, -4) + ' ' + P(-5, -7) + ' ' + P(-6, -14) + 'C' + P(-1, -10) + ' ' + P(-1, -7) + ' ' + P(0, -5) + 'C' + P(0, -12) + ' ' + P(3, -16) + ' ' + P(2, -22) + 'C' + P(9, -15) + ' ' + P(7, -8) + ' ' + P(9, -6) + 'C' + P(10, -9) + ' ' + P(12, -10) + ' ' + P(12, -12) + 'C' + P(15, -3) + ' ' + P(12, 3) + ' ' + P(8, 4) + 'Z" fill="' + FD.F + '" stroke="' + FD.FD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M' + P(-5, 4) + 'C' + P(-6, -2) + ' ' + P(-1, -3) + ' ' + P(0, -1) + 'C' + P(2, -8) + ' ' + P(3, -9) + ' ' + P(3, -12) + 'C' + P(8, -6) + ' ' + P(8, 0) + ' ' + P(5, 4) + 'Z" fill="' + FD.FL + '"/></g>';
}
function fdArt(){
  var D = FD, O = '#140404';
  return wrapSvg(
    /* body with a cream chest ruff and ember speckles */
    outlined('<path d="M35 61Q50 55 65 61Q69 76 62 89Q50 94 38 89Q31 76 35 61Z"/>', D.R, D.RD) +
    '<path d="M41 60L44 66L47 61L50 68L53 61L56 66L59 60Q60 76 55 86Q50 89 45 86Q40 76 41 60Z" fill="' + D.C + '"/>' +
    '<circle cx="37.5" cy="72" r="1.1" fill="' + D.FL + '"/><circle cx="63" cy="70" r="1" fill="' + D.FL + '"/><circle cx="61" cy="80" r=".9" fill="' + D.FL + '"/><circle cx="39" cy="81" r=".9" fill="' + D.FL + '"/>' +
    /* tall pointed ears with orange tufts, and a flame crest between them */
    fdFlame(50, 18, 0.7, 0) +
    outlined('<path d="M31 32Q24 18 30 9Q38 9 43 22Z"/><path d="M69 32Q76 18 70 9Q62 9 57 22Z"/>', D.R, D.RD, 2.2) +
    '<path d="M32 26Q28 18 32 13Q37 15 39 22Z M68 26Q72 18 68 13Q63 15 61 22Z" fill="' + D.F + '"/>' +
    outlined('<path d="M30 9Q21 10 19 21Q25 18 31 16Z"/><path d="M70 9Q79 10 81 21Q75 18 69 16Z"/>', D.RD, D.K, 1.6) +
    /* head: a wide pup face with fluffy cheek tufts and a cream muzzle patch */
    outlined('<path d="M50 17C63 17 70 26 70 36C72 40 76 42 72 46C70 52 62 56 50 56C38 56 30 52 28 46C24 42 28 40 30 36C30 26 37 17 50 17Z"/>', D.R, D.RD) +
    '<path d="M36 24Q42 20 48 19.5" fill="none" stroke="' + D.RL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    outlined('<path d="M50 37C58 37 64 41 64 48C64 55 58 59 50 59C42 59 36 55 36 48C36 41 42 37 50 37Z"/>', D.C, D.CD, 1.8) +
    '<path d="M50 37.5V43" stroke="' + D.CD + '" stroke-width="1" stroke-linecap="round" stroke-opacity=".5"/>' +
    /* fierce amber eyes with slit pupils and angled brows */
    '<circle cx="40.5" cy="31.5" r="4.4" fill="' + D.A + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="41.2" cy="32" r="2.4" fill="' + O + '"/><circle cx="42.2" cy="30.6" r=".9" fill="#fff"/>' +
    '<circle cx="59.5" cy="31.5" r="4.4" fill="' + D.A + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="58.8" cy="32" r="2.4" fill="' + O + '"/><circle cx="59.8" cy="30.6" r=".9" fill="#fff"/>' +
    '<path d="M34.5 26L45 28M65.5 26L55 28" stroke="' + D.RD + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* short dark nose and a closed toothy grin with two fangs */
    '<path d="M44.5 43Q50 39.8 55.5 43Q54.6 47.4 50 48.2Q45.4 47.4 44.5 43Z" fill="' + D.K + '"/><ellipse cx="47.6" cy="42.6" rx="1.4" ry=".8" fill="#fff" fill-opacity=".75"/>' +
    '<path d="M50 48.2V50.6M41.5 50Q46 54.6 50 50.6Q54 54.6 58.5 50" fill="none" stroke="' + O + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M44 51.6L45.2 55L46.6 52.6ZM56 51.6L54.8 55L53.4 52.6Z" fill="#fff" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>');
}
function fdBack(c){
  var D = FD;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + D.RD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + D.R + '" stroke-width="6.4" stroke-linecap="round"/>' +
      fdFlame(fx, 100, 0.5, 0) +
      '<path d="M' + (fx - 7) + ' 103Q' + (fx - 7) + ' 95.5 ' + fx + ' 95.5Q' + (fx + 7) + ' 95.5 ' + (fx + 7) + ' 103Z" fill="' + D.R + '" stroke="' + D.RD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 4) + ' 103V100.4M' + fx + ' 103V100M' + (fx + 4) + ' 103V100.4" stroke="' + D.RD + '" stroke-width="1.3" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + D.RD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + D.R + '" stroke-width="5.4" stroke-linecap="round"/>';
  }
  /* a blazing tail swept out to the left */
  var tp = 'M38 84Q28 86 22 78';
  var tail = '<path d="' + tp + '" fill="none" stroke="' + D.RD + '" stroke-width="8" stroke-linecap="round"/><path d="' + tp + '" fill="none" stroke="' + D.R + '" stroke-width="4.6" stroke-linecap="round"/>' + fdFlame(20, 74, 1.15, -25);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + tail + leg('lgL', 42, 39, 37) + leg('lgR', 58, 61, 63) +
    '<g><g class="pump pL">' + arm(35, 64, 19, 69) + fdFlame(16, 69, 0.55, -60) + '<circle cx="16.5" cy="70" r="4.6" fill="' + D.R + '" stroke="' + D.RD + '" stroke-width="1.8"/><path d="M13 72.6L12 74.6M16.5 73.6V75.8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g></g>' +
    '<g><g class="pump pR">' + arm(65, 64, 82, 65) + '</g></g></svg>';
}
function fdFront(c){
  /* the front paw with a glowing ember ball he throws; it sits in the weapon group so it jolts when he throws */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + fdFlame(84, 64, 0.6, 60) +
    '<circle cx="96" cy="55" r="9" fill="#ff9a2e" fill-opacity=".25"/><circle cx="96" cy="55" r="5.4" fill="' + FD.F + '" stroke="' + FD.FD + '" stroke-width="1.5"/><circle cx="95" cy="54" r="2.8" fill="' + FD.FL + '"/>' +
    '<circle cx="88" cy="65" r="5.2" fill="' + FD.R + '" stroke="' + FD.RD + '" stroke-width="1.9"/><path d="M90.6 62L93.4 60.4M91.8 65H94.8M90.8 68.2L93.4 69.8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' +
    '</g></g></g></g></svg>';
}
