/* Drill Bot (preview, key 'db'): the owner's drawing: a chunky yellow-and-red robot built from cut, faceted plates: a boxy body that
   is also his head, two round glowing yellow eye lenses with a dark band between them, a dark mouth slot with a yellow chin plate,
   little yellow horn-plates on top, red side panels, a periscope cannon (red barrel, yellow muzzle ring) on a pole on his head,
   a striped cone drill on the front arm, a spiky striped drum drill on the back arm, red-and-dark legs and big blocky yellow boots.
   Faces right like every pal: the cone drill is his weapon. */
var DB = { Y: '#f6c21e', YD: '#5a3a00', YL: '#ffe27a', YM: '#d89a0a', R: '#dc2a22', RD: '#5a0a06', RL: '#f2604e', K: '#3a3a40', KD: '#141418', E: '#ffef6a', EL: '#fffbd0' };
function dbP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
/* the cone drill, drawn pointing right from (x, y) and turned by angle a (degrees) */
function dbCone(x, y, a){
  var Z = DB, h = function(v){ return 7.4 * (x + 22 - v) / 18; };
  function band(x1, x2){ return 'M' + x1 + ' ' + (y - h(x1)) + 'L' + x2 + ' ' + (y - h(x2)) + 'L' + x2 + ' ' + (y + h(x2)) + 'L' + x1 + ' ' + (y + h(x1)) + 'Z'; }
  return '<g transform="rotate(' + a + ' ' + x + ' ' + y + ')">' +
    dbP('M' + (x + 4) + ' ' + (y - h(x + 4)) + 'L' + (x + 22) + ' ' + y + 'L' + (x + 4) + ' ' + (y + h(x + 4)) + 'Z', Z.Y, Z.YD, 1.8) +
    '<path d="' + band(x + 7.5, x + 11) + band(x + 14, x + 16.6) + '" fill="' + Z.K + '"/>' +
    '<path d="M' + (x + 4) + ' ' + (y - h(x + 4)) + 'L' + (x + 22) + ' ' + y + 'L' + (x + 4) + ' ' + (y + h(x + 4)) + 'Z" fill="none" stroke="' + Z.YD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M' + (x + 6) + ' ' + (y - h(x + 6) + 1.6) + 'L' + (x + 18) + ' ' + (y - 1.2) + '" stroke="' + Z.YL + '" stroke-width="1.1" stroke-linecap="round"/>' +
    /* the collar it spins in */
    dbP('M' + (x - 2) + ' ' + (y - 9) + 'L' + (x + 4) + ' ' + (y - 9.6) + 'L' + (x + 5) + ' ' + y + 'L' + (x + 4) + ' ' + (y + 9.6) + 'L' + (x - 2) + ' ' + (y + 9) + 'Z', Z.Y, Z.YD, 1.8) +
    '<path d="M' + (x + 1) + ' ' + (y - 8.6) + 'V' + (y + 8.6) + '" stroke="' + Z.YM + '" stroke-width="1.1"/></g>';
}
/* the spiky drum drill hanging down from (x, y) */
function dbDrum(x, y){
  var Z = DB, s = '', i;
  /* spikes around the drum */
  [[-10, 4, -9.6, -2], [-10, 12, -14, 10], [-10, 20, -14, 22], [10, 4, 9.6, -2], [10, 12, 14, 10], [10, 20, 14, 22], [-5, 27, -6, 33], [5, 27, 6, 33], [0, 28, 0, 35]].forEach(function(q){
    var bx = x + q[0], by = y + q[1], tx = x + q[2], ty = y + q[3], dx = ty - by, dy = bx - tx, l = Math.sqrt(dx * dx + dy * dy) || 1;
    dx = dx / l * 2.6; dy = dy / l * 2.6;
    s += dbP('M' + (bx + dx).toFixed(1) + ' ' + (by + dy).toFixed(1) + 'L' + tx + ' ' + ty + 'L' + (bx - dx).toFixed(1) + ' ' + (by - dy).toFixed(1) + 'Z', Z.Y, Z.YD, 1.3);
  });
  s += dbP('M' + (x - 8) + ' ' + y + 'L' + (x + 8) + ' ' + y + 'L' + (x + 11) + ' ' + (y + 6) + 'L' + (x + 11) + ' ' + (y + 22) + 'L' + (x + 6) + ' ' + (y + 29) + 'L' + (x - 6) + ' ' + (y + 29) + 'L' + (x - 11) + ' ' + (y + 22) + 'L' + (x - 11) + ' ' + (y + 6) + 'Z', Z.Y, Z.YD, 1.9);
  for (i = 0; i < 2; i++) s += dbP('M' + (x - 11) + ' ' + (y + 8 + i * 9) + 'L' + (x + 11) + ' ' + (y + 8 + i * 9) + 'L' + (x + 11) + ' ' + (y + 12 + i * 9) + 'L' + (x - 11) + ' ' + (y + 12 + i * 9) + 'Z', Z.K, Z.KD, 1.2);
  return s + '<path d="M' + (x - 7) + ' ' + (y + 2.4) + 'L' + (x - 9) + ' ' + (y + 6.4) + '" stroke="' + Z.YL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* the red cuff it hangs from */
    dbP('M' + (x - 6) + ' ' + (y - 6) + 'L' + (x + 6) + ' ' + (y - 6) + 'L' + (x + 7) + ' ' + (y + 1) + 'L' + (x - 7) + ' ' + (y + 1) + 'Z', Z.R, Z.RD, 1.6);
}
function dbArt(){
  var Z = DB;
  return wrapSvg(
    /* the periscope cannon on a pole, tilted up and forward */
    dbP('M47.6 30V14H52.4V30Z', Z.K, Z.KD, 1.6) +
    '<g transform="rotate(-30 52 12)">' + dbP('M43 7H58V17H43Z', Z.R, Z.RD, 1.8) + '<path d="M45 9H55" stroke="' + Z.RL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    '<ellipse cx="59" cy="12" rx="4.6" ry="7" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.8"/><ellipse cx="59.6" cy="12" rx="2.6" ry="4.4" fill="' + Z.KD + '"/></g>' +
    /* red side panels behind the body */
    dbP('M28 34L34 30V70L28 66Z', Z.R, Z.RD, 1.8) + dbP('M72 34L66 30V70L72 66Z', Z.R, Z.RD, 1.8) +
    /* the boxy body-head, cut plates */
    dbP('M33 28L39 24H61L67 28L69 50L66 66L58 72H42L34 66L31 50Z', Z.Y, Z.YD, 2.1) +
    '<path d="M36 28L40 26H60" fill="none" stroke="' + Z.YL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* little horn-plates on top */
    dbP('M35 26L33 18L41 23Z', Z.Y, Z.YD, 1.6) + dbP('M65 26L67 18L59 23Z', Z.Y, Z.YD, 1.6) +
    /* the dark band behind the eyes, and the eyes */
    dbP('M33 36H67V44H33Z', Z.K, Z.KD, 1.4) +
    '<circle cx="41.6" cy="39" r="7.4" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.8"/><circle cx="58.4" cy="39" r="7.4" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.8"/>' +
    '<circle cx="41.6" cy="39" r="4.8" fill="' + Z.E + '" stroke="' + Z.YM + '" stroke-width="1.2"/><circle cx="58.4" cy="39" r="4.8" fill="' + Z.E + '" stroke="' + Z.YM + '" stroke-width="1.2"/>' +
    '<circle cx="40" cy="37.4" r="1.5" fill="' + Z.EL + '"/><circle cx="56.8" cy="37.4" r="1.5" fill="' + Z.EL + '"/>' +
    /* mouth: a wide dark slot under a cut brow plate, and a yellow chin plate */
    dbP('M36 48L42 47H58L64 48L63 53H37Z', Z.YM, Z.YD, 1.4) +
    dbP('M37 53H63V59H37Z', Z.KD, Z.KD, 1.2) +
    dbP('M42 58H58L56 67H44Z', Z.Y, Z.YD, 1.6) + '<path d="M44 60H56" stroke="' + Z.YL + '" stroke-width="1" stroke-linecap="round"/>' +
    /* hip plates */
    dbP('M33 63L41 66L40 73L33 71Z', Z.Y, Z.YD, 1.5) + dbP('M67 63L59 66L60 73L67 71Z', Z.Y, Z.YD, 1.5));
}
function dbBack(c){
  var Z = DB;
  /* red-and-dark legs and big blocky yellow boots with a dark notch */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + dbP('M' + (x1 - 4.4) + ' 70L' + (x1 + 4.4) + ' 70L' + (x2 + 4.4) + ' 88L' + (x2 - 4.4) + ' 88Z', Z.R, Z.RD, 1.7) +
      dbP('M' + (x1 - 3.6) + ' 76H' + (x1 + 4.4) + 'L' + (x1 + 4.2) + ' 80H' + (x1 - 3.8) + 'Z', Z.K, Z.KD, 1) +
      dbP('M' + (fx - 7) + ' 86L' + (fx + 6) + ' 86L' + (fx + 8) + ' 94L' + (fx + 12) + ' 98L' + (fx + 12) + ' 104L' + (fx - 10) + ' 104L' + (fx - 10) + ' 97Z', Z.Y, Z.YD, 1.8) +
      dbP('M' + (fx - 2) + ' 94L' + (fx + 3) + ' 94L' + (fx + 2) + ' 104L' + (fx - 1) + ' 104Z', Z.K, Z.KD, 1) +
      '<path d="M' + (fx - 6) + ' 88H' + (fx + 4) + '" stroke="' + Z.YL + '" stroke-width="1.1" stroke-linecap="round"/></g>';
  }
  /* back arm: a yellow shoulder block, a red upper arm, and the drum drill hanging down */
  var back = dbP('M34 40L22 44L20 52L32 50Z', Z.R, Z.RD, 1.8) + dbP('M18 44L26 44L27 53L17 54Z', Z.Y, Z.YD, 1.7) + dbDrum(17, 62);
  /* front arm: the same, reaching out to the cone drill */
  var front = dbP('M66 40L78 50L82 60L74 58L64 50Z', Z.R, Z.RD, 1.8) + dbP('M73 44L80 47L79 55L72 52Z', Z.Y, Z.YD, 1.6);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 43, 40, 38) + leg('lgR', 57, 60, 62) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function dbFront(c){
  /* the cone drill on the front arm, pointing up and forward; it is the weapon */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="translate(84 63) scale(1.35) translate(-84 -63)">' + dbCone(84, 63, -58) + '</g></g></g></g></svg>';
}
