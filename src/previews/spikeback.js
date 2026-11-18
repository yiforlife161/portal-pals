/* Spikeback (preview, key 'sb'): the owner's drawing: a squat brown lizard brute with cracked, rocky scales, two big golden
   crescent horns on a gold brow band, golden spikes all over (cheeks, shoulders, arms, thighs, back of the tail), angry red
   eyes, a wide open jaw full of fangs, cream belly plates, big golden claws on all four limbs, and a tail that ends in a
   spiked golden mace ball. Faces right like every pal, so the tail swings out behind him to the left. */
var SB = { B: '#9c5b3b', BD: '#2e1810', BL: '#c27c55', BM: '#7a4329', G: '#e9c25c', GD: '#6e4b0e', GL: '#fff1b8',
  P: '#ead2a8', PD: '#a9875a', E: '#ff3b3b', ED: '#6a0c10', M: '#4a1212', T: '#d9545c', F: '#f6ecd4' };
/* a golden spike: base centre (x, y), pointing at angle a (degrees, 0 = right, -90 = up), length l, half width w */
function sbSpike(x, y, a, l, w){
  var Z = SB, r = a * Math.PI / 180, dx = Math.cos(r), dy = Math.sin(r), nx = -dy, ny = dx;
  var tx = x + dx * l, ty = y + dy * l;
  function p(v){ return Math.round(v * 10) / 10; }
  return '<path d="M' + p(x + nx * w) + ' ' + p(y + ny * w) + 'L' + p(tx) + ' ' + p(ty) + 'L' + p(x - nx * w) + ' ' + p(y - ny * w) + 'Z" fill="' + Z.G + '" stroke="' + Z.BD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M' + p(x + nx * w * 0.35 + dx * l * 0.15) + ' ' + p(y + ny * w * 0.35 + dy * l * 0.15) + 'L' + p(x + dx * l * 0.75) + ' ' + p(y + dy * l * 0.75) + '" stroke="' + Z.GL + '" stroke-width="1" stroke-linecap="round"/>';
}
/* cracked rock-scale marks: little arcs at the given points */
function sbScales(pts){
  var Z = SB, d = '';
  pts.forEach(function(q){ d += 'M' + (q[0] - 2.4) + ' ' + q[1] + 'Q' + q[0] + ' ' + (q[1] + 2.2) + ' ' + (q[0] + 2.4) + ' ' + q[1]; });
  return '<path d="' + d + '" fill="none" stroke="' + Z.BM + '" stroke-width="1" stroke-linecap="round"/>';
}
/* a clawed hand or foot: a rounded paw at (x, y) with three golden claws fanned around angle a */
function sbPaw(x, y, a, r){
  var Z = SB, s = '', i;
  for (i = -1; i <= 1; i++){
    var ang = a + i * 38, rr = ang * Math.PI / 180;
    s += sbSpike(x + Math.cos(rr) * r * 0.7, y + Math.sin(rr) * r * 0.7, ang, r * 1.35, r * 0.42);
  }
  return s + '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 0.86) + '" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8"/>' +
    sbScales([[x - r * 0.3, y - r * 0.2], [x + r * 0.25, y + r * 0.25]]);
}
function sbArt(){
  var Z = SB;
  return wrapSvg(
    /* shoulder and side spikes behind the body */
    sbSpike(33, 52, -150, 9, 3.4) + sbSpike(67, 52, -30, 9, 3.4) + sbSpike(36, 68, 180, 7, 3) + sbSpike(64, 68, 0, 7, 3) +
    /* the stocky torso */
    '<path d="M30 50Q50 42 70 50Q72 66 64 82Q50 88 36 82Q28 66 30 50Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
    sbScales([[34, 58], [36, 66], [38, 74], [66, 58], [64, 66], [62, 74]]) +
    /* cream belly plates, stacked */
    '<path d="M42 52H58L59 59H41ZM41 59H59L58.5 66H41.5ZM41.5 66H58.5L57.5 73H42.5ZM42.5 73H57.5L55.5 80H44.5Z" fill="' + Z.P + '" stroke="' + Z.PD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M43.5 53.8H56.5M43 60.8H57M43.6 67.8H56.4M44.6 74.8H55.4" stroke="#fff6e2" stroke-width="1" stroke-linecap="round"/>' +
    /* big golden crescent horns */
    '<path d="M35 25Q22 12 37 0Q33 13 43 22Z" fill="' + Z.G + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M65 25Q78 12 63 0Q67 13 57 22Z" fill="' + Z.G + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M33 18Q30 10 35 4M67 18Q70 10 65 4" fill="none" stroke="' + Z.GL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* cheek spikes */
    sbSpike(31, 32, 195, 9, 3.4) + sbSpike(32, 40, 160, 7, 3) + sbSpike(69, 32, -15, 9, 3.4) + sbSpike(68, 40, 20, 7, 3) +
    sbSpike(50, 21, -90, 6, 3) +
    /* the head: a broad blocky skull */
    '<path d="M32 28Q34 20 50 20Q66 20 68 28L70 40Q68 50 50 52Q32 50 30 40Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
    sbScales([[36, 30], [64, 30], [34, 44], [66, 44]]) +
    /* the gold brow band the horns sit on */
    '<path d="M33 26Q50 18 67 26L66 29Q50 22 34 29Z" fill="' + Z.G + '" stroke="' + Z.BD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    /* angry red eyes under heavy brows */
    '<path d="M37 31L47 34L46 38L38 37Z" fill="' + Z.E + '" stroke="' + Z.ED + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="M63 31L53 34L54 38L62 37Z" fill="' + Z.E + '" stroke="' + Z.ED + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<circle cx="43" cy="35.2" r="1.3" fill="' + Z.ED + '"/><circle cx="57" cy="35.2" r="1.3" fill="' + Z.ED + '"/>' +
    '<path d="M35 29.5L48 33M65 29.5L52 33" stroke="' + Z.BD + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* nostrils on the snout */
    '<path d="M47 39.5L48.5 40.5M53 39.5L51.5 40.5" stroke="' + Z.BD + '" stroke-width="1.4" stroke-linecap="round"/>' +
    /* the wide open jaw: dark mouth, tongue, and fangs top and bottom */
    '<path d="M38 42Q50 39 62 42Q61 51 50 53Q39 51 38 42Z" fill="' + Z.M + '" stroke="' + Z.BD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M43 50Q50 45 57 50Q50 53 43 50Z" fill="' + Z.T + '"/>' +
    '<path d="M39.5 42.4L41.5 47L43.5 41.6ZM46 41L48 45L50 40.8ZM50 40.8L52 45L54 41ZM56.5 41.6L58.5 47L60.5 42.4Z" fill="' + Z.F + '" stroke="' + Z.BD + '" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M44 51.6L45.5 48L47 52.2ZM53 52.2L54.5 48L56 51.6Z" fill="' + Z.F + '" stroke="' + Z.BD + '" stroke-width=".9" stroke-linejoin="round"/>');
}
function sbBack(c){
  var Z = SB;
  /* the tail: thick at the hip, curling out behind him to the left, spikes along its top, and the golden mace ball */
  var tail = sbSpike(28, 79, -110, 6, 2.6) + sbSpike(19, 80, -100, 6, 2.6) + sbSpike(11, 80, -80, 5, 2.4) +
    '<path d="M40 74Q24 74 16 79Q10 84 6 83L5 89Q12 92 22 86Q30 82 42 84Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    sbScales([[30, 79], [22, 82], [14, 84]]);
  var ball = '';
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(function(a){ var r = a * Math.PI / 180; ball += sbSpike(0 + Math.cos(r) * 6, 82 + Math.sin(r) * 6, a, 6, 2.4); });
  ball += '<circle cx="0" cy="82" r="7.2" fill="' + Z.G + '" stroke="' + Z.BD + '" stroke-width="1.8"/>' +
    '<circle cx="0" cy="82" r="3.2" fill="none" stroke="' + Z.GD + '" stroke-width="1.1"/><circle cx="0" cy="82" r="1.3" fill="' + Z.GD + '"/>' +
    '<path d="M-4 78Q-1 76 2 77" fill="none" stroke="' + Z.GL + '" stroke-width="1.3" stroke-linecap="round"/>';
  /* stout legs with a spike on the outer thigh and a big clawed foot */
  function leg(cls, x1, x2, side){
    return '<g class="lg ' + cls + '">' + sbSpike(x1 + side * 7, 84, side > 0 ? -20 : 200, 7, 2.8) +
      '<path d="M' + (x1 - 8) + ' 80L' + (x1 + 8) + ' 80L' + (x2 + 7) + ' 96L' + (x2 - 7) + ' 96Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      sbScales([[x1, 85], [x2, 91]]) + sbPaw(x2, 97, 90, 6.6) + '</g>';
  }
  /* back arm: reaching out to the left, spikes along the top, claws pointing left */
  var arm = sbSpike(24, 52, -100, 7, 2.8) + sbSpike(15, 54, -110, 6, 2.6) +
    '<path d="M33 51Q22 52 13 54.5L13 62Q22 63.5 33 63Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    sbScales([[26, 57], [19, 58]]) + sbSpike(24, 62, 100, 5, 2.4) + sbPaw(10, 58, 180, 6.6);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + tail + ball +
    leg('lgL', 41, 39, -1) + leg('lgR', 59, 61, 1) +
    '<g><g class="pump pL">' + arm + '</g></g></svg>';
}
function sbFront(c){
  var Z = SB;
  /* front arm: reaching out to the right; the claws are his weapon, so the hand sits in the weapon group */
  var arm = sbSpike(76, 52, -80, 7, 2.8) + sbSpike(85, 54, -70, 6, 2.6) +
    '<path d="M67 51Q78 52 87 54.5L87 62Q78 63.5 67 63Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    sbScales([[74, 57], [81, 58]]) + sbSpike(76, 62, 80, 5, 2.4);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR">' + arm + '<g class="wpn">' + sbPaw(90, 58, 0, 6.6) + '</g></g></g></svg>';
}
