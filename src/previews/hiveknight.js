/* Hive Knight (preview, key 'hk'): the owner's drawing: an armoured bee warrior striped yellow and black: four big pale-yellow wings,
   a round yellow head with two curly antennae and big white almond eyes, black shoulder armour, a yellow chest plate with black
   chevrons and two glowing blue gems, a pointed hip plate, striped arms that end in big curved yellow claw-blades, and thick
   striped legs on rounded yellow boots. Faces right like every pal: the front claw is the weapon. */
var HK = { Y: '#f6c21e', YD: '#4a3400', YL: '#ffe48a', K: '#2a2a2e', KD: '#0c0c10', KL: '#55555e', W: '#fbeaa0', WD: '#b89a2a', WL: '#fff6d0', B: '#2aa0f0', BL: '#bfe8ff', E: '#ffffff' };
function hkP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
/* a striped limb segment from (x1, y1) to (x2, y2), w thick, n stripes */
function hkSeg(x1, y1, x2, y2, w, n){
  var Z = HK, dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy), nx = -dy / l * w / 2, ny = dx / l * w / 2, s = '', i;
  function p(v){ return Math.round(v * 10) / 10; }
  s += hkP('M' + p(x1 + nx) + ' ' + p(y1 + ny) + 'L' + p(x2 + nx) + ' ' + p(y2 + ny) + 'L' + p(x2 - nx) + ' ' + p(y2 - ny) + 'L' + p(x1 - nx) + ' ' + p(y1 - ny) + 'Z', Z.Y, Z.YD, 1.7);
  for (i = 0; i < n; i++){
    var a = (i * 2 + 0.6) / (n * 2), b = (i * 2 + 1.4) / (n * 2);
    s += '<path d="M' + p(x1 + dx * a + nx) + ' ' + p(y1 + dy * a + ny) + 'L' + p(x1 + dx * b + nx) + ' ' + p(y1 + dy * b + ny) + 'L' + p(x1 + dx * b - nx) + ' ' + p(y1 + dy * b - ny) + 'L' + p(x1 + dx * a - nx) + ' ' + p(y1 + dy * a - ny) + 'Z" fill="' + Z.K + '"/>';
  }
  return s + '<path d="M' + p(x1 + nx) + ' ' + p(y1 + ny) + 'L' + p(x2 + nx) + ' ' + p(y2 + ny) + 'L' + p(x2 - nx) + ' ' + p(y2 - ny) + 'L' + p(x1 - nx) + ' ' + p(y1 - ny) + 'Z" fill="none" stroke="' + Z.YD + '" stroke-width="1.7" stroke-linejoin="round"/>';
}
/* a big claw: three curved yellow blades from a black wrist at (x, y); m = 1 blades curve to the right */
function hkClaw(x, y, m){
  var Z = HK; function X(v){ return x + v * m; }
  function blade(a, b, c, d, e, f){ return hkP('M' + X(a) + ' ' + b + 'Q' + X(c) + ' ' + d + ' ' + X(e) + ' ' + f + 'Q' + X(c - 5) + ' ' + (d + 4.4) + ' ' + X(a - 1) + ' ' + (b + 5.6) + 'Z', Z.Y, Z.YD, 1.5); }
  return blade(1, y - 6, 9, y - 12, 13, y - 2) + blade(2, y - 1, 11, y - 2, 13, y + 8) + blade(0, y + 3, 7, y + 8, 7, y + 15) +
    '<path d="M' + X(4) + ' ' + (y - 6.6) + 'Q' + X(9) + ' ' + (y - 9.6) + ' ' + X(11.4) + ' ' + (y - 4) + '" fill="none" stroke="' + Z.YL + '" stroke-width="1" stroke-linecap="round"/>' +
    hkP('M' + X(-4) + ' ' + (y - 6) + 'L' + X(3) + ' ' + (y - 7) + 'L' + X(4) + ' ' + (y + 6) + 'L' + X(-4) + ' ' + (y + 6) + 'Z', Z.K, Z.KD, 1.6) +
    '<rect x="' + (x + (m > 0 ? 0.4 : -2.4)) + '" y="' + (y - 2.4) + '" width="2" height="4.8" rx="1" fill="' + Z.B + '"/>';
}
/* a pale wing from (x, y) pointing at angle a (degrees), length l */
function hkWing(x, y, a, l, w){
  var Z = HK;
  return '<g transform="rotate(' + a + ' ' + x + ' ' + y + ')"><ellipse cx="' + (x + l / 2) + '" cy="' + y + '" rx="' + (l / 2) + '" ry="' + w + '" fill="' + Z.W + '" stroke="' + Z.WD + '" stroke-width="1.5"/>' +
    '<path d="M' + (x + 3) + ' ' + y + 'L' + (x + l - 4) + ' ' + y + 'M' + (x + l * 0.4) + ' ' + y + 'L' + (x + l * 0.7) + ' ' + (y - w * 0.6) + '" stroke="' + Z.WD + '" stroke-width=".8" stroke-opacity=".6" fill="none"/>' +
    '<ellipse cx="' + (x + l * 0.62) + '" cy="' + (y - w * 0.36) + '" rx="' + (l * 0.22) + '" ry="' + (w * 0.22) + '" fill="' + Z.WL + '"/></g>';
}
function hkArt(){
  var Z = HK;
  return wrapSvg(
    /* waist and the pointed hip plate */
    hkP('M44 64H56L58 74L50 86L42 74Z', Z.Y, Z.YD, 1.7) + hkP('M45 70H55L53 76H47Z', Z.K, Z.KD, 1.1) + hkP('M47 78H53L50 84Z', Z.K, Z.KD, 1) +
    /* the chest plate with black chevrons and two blue gems */
    hkP('M36 40L44 36H56L64 40L62 58L50 68L38 58Z', Z.Y, Z.YD, 1.9) +
    hkP('M43 50.4L50 55L57 50.4L57 54L50 58.6L43 54Z', Z.K, Z.KD, 1) + hkP('M45 58.4L50 61.6L55 58.4L54.4 61L50 64.4L45.6 61Z', Z.K, Z.KD, 1) +
    hkP('M46 40H54L50 44Z', Z.K, Z.KD, 1) +
    '<circle cx="43.4" cy="45.6" r="3.4" fill="' + Z.B + '" stroke="' + Z.KD + '" stroke-width="1.3"/><circle cx="56.6" cy="45.6" r="3.4" fill="' + Z.B + '" stroke="' + Z.KD + '" stroke-width="1.3"/>' +
    '<circle cx="42.4" cy="44.6" r="1.1" fill="' + Z.BL + '"/><circle cx="55.6" cy="44.6" r="1.1" fill="' + Z.BL + '"/>' +
    /* black shoulder armour */
    hkP('M25 42Q25 34 33 34L39 37L37 46Q31 49 26 47Z', Z.K, Z.KD, 1.8) + hkP('M75 42Q75 34 67 34L61 37L63 46Q69 49 74 47Z', Z.K, Z.KD, 1.8) +
    '<path d="M28 38Q30 36 34 36M72 38Q70 36 66 36" fill="none" stroke="' + Z.KL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* black collar */
    hkP('M43 32H57L56 38H44Z', Z.K, Z.KD, 1.4) +
    /* curly antennae */
    '<path d="M45 14Q40 4 34 6Q31 8 34 10M55 14Q60 4 66 6Q69 8 66 10" fill="none" stroke="' + Z.YD + '" stroke-width="3.2" stroke-linecap="round"/>' +
    '<path d="M45 14Q40 4 34 6Q31 8 34 10M55 14Q60 4 66 6Q69 8 66 10" fill="none" stroke="' + Z.Y + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* the round yellow head with big white almond eyes */
    hkP('M50 12Q61 12 61 23Q61 32 50 35Q39 32 39 23Q39 12 50 12Z', Z.Y, Z.YD, 1.9) +
    '<path d="M42.6 16Q46 13.6 49 14" fill="none" stroke="' + Z.YL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    hkP('M41.4 21Q45.6 20 48 24Q47.6 28.6 44.6 28.6Q41 27 41.4 21Z', Z.E, Z.KD, 1.6) + hkP('M58.6 21Q54.4 20 52 24Q52.4 28.6 55.4 28.6Q59 27 58.6 21Z', Z.E, Z.KD, 1.6) +
    '<path d="M47 31Q50 32.4 53 31" fill="none" stroke="' + Z.YD + '" stroke-width="1.1" stroke-linecap="round"/>');
}
function hkBack(c){
  var Z = HK;
  /* four big wings behind everything */
  var wings = hkWing(42, 42, -128, 38, 9) + hkWing(58, 42, -52, 38, 9) + hkWing(42, 50, 150, 32, 8) + hkWing(58, 50, 30, 32, 8);
  /* thick striped legs on rounded boots */
  function leg(cls, x1, x2, fx, m){
    return '<g class="lg ' + cls + '">' + hkSeg(x1, 74, x2, 94, 9, 2) +
      hkP('M' + (fx - 8 * m) + ' 104L' + (fx - 7 * m) + ' 95H' + (fx + 3 * m) + 'Q' + (fx + 11 * m) + ' 97 ' + (fx + 11 * m) + ' 104Z', Z.Y, Z.YD, 1.8) +
      '<path d="M' + (fx - 6 * m) + ' 97.4H' + (fx + 3 * m) + '" stroke="' + Z.YL + '" stroke-width="1.1" stroke-linecap="round"/></g>';
  }
  var back = hkSeg(30, 44, 18, 54, 7, 2) + hkClaw(14, 56, -1);
  var front = hkSeg(70, 44, 80, 58, 7, 2);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wings + leg('lgL', 45, 41, 40, -1) + leg('lgR', 55, 59, 60, 1) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function hkFront(c){
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + hkClaw(84, 62, 1) + '</g></g></g></svg>';
}
