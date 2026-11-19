/* Four-Arm Yeti (preview, key 'yt'): the owner's drawing (inspired by arena-brawler cartoon heroes, no franchise look): a shaggy white
   yeti with FOUR arms (two each side), a spiky white mane, a blue face with yellow eyes under an angry brow and a roaring fanged
   mouth, a dark tuft under the chin, dark stone shoulder guards with silver spikes, a dark belt with silver studs and a loin flap,
   shaggy legs, and big blue fists and feet. Faces right like every pal: the lower front fist is the weapon. */
var YT = { W: '#f4f8ff', WD: '#141c2c', WS: '#c8d6ec', B: '#28a0ec', BD: '#0b2a4e', BL: '#7ccaff', K: '#4a4e58', KD: '#16181e', S: '#c4c8d0', SL: '#eef0f4',
  E: '#ffd23a', M: '#5a0e14', T: '#e0404a', F: '#fffaf0' };
function ytP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
function ytR(v){ return Math.round(v * 10) / 10; }
/* a shaggy fur arm from (x1, y1) to (x2, y2), w thick, with zig-zag tufts along both edges */
function ytArm(x1, y1, x2, y2, w){
  var Z = YT, dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux, n = Math.max(3, Math.round(l / 4)), a = [], b = [], i;
  for (i = 0; i <= n; i++){
    var t = i / n, px = x1 + dx * t, py = y1 + dy * t, o = (i % 2 ? 1.6 : 0);
    a.push(ytR(px + nx * (w / 2 + o)) + ' ' + ytR(py + ny * (w / 2 + o)));
    b.unshift(ytR(px - nx * (w / 2 + o)) + ' ' + ytR(py - ny * (w / 2 + o)));
  }
  return ytP('M' + a.join('L') + 'L' + b.join('L') + 'Z', Z.W, Z.WD, 1.8);
}
/* a big blue fist at (x, y); m = 1 knuckles to the right */
function ytFist(x, y, m){
  var Z = YT; function X(v){ return x + v * m; }
  return ytP('M' + X(-5) + ' ' + (y - 6) + 'Q' + X(5) + ' ' + (y - 8) + ' ' + X(7) + ' ' + (y - 3) + 'Q' + X(8) + ' ' + y + ' ' + X(7) + ' ' + (y + 3) + 'Q' + X(5) + ' ' + (y + 8) + ' ' + X(-5) + ' ' + (y + 6) + 'Q' + X(-7) + ' ' + y + ' ' + X(-5) + ' ' + (y - 6) + 'Z', Z.B, Z.BD, 1.8) +
    '<path d="M' + X(2) + ' ' + (y - 3.4) + 'H' + X(7) + 'M' + X(2) + ' ' + y + 'H' + X(7.6) + 'M' + X(2) + ' ' + (y + 3.4) + 'H' + X(7) + 'M' + X(2) + ' ' + (y - 5) + 'V' + (y + 5) + '" stroke="' + Z.BD + '" stroke-width="1" stroke-linecap="round" fill="none"/>' +
    '<path d="M' + X(-4) + ' ' + (y - 4) + 'Q' + X(-5) + ' ' + y + ' ' + X(-4) + ' ' + (y + 3) + '" fill="none" stroke="' + Z.BL + '" stroke-width="1.2" stroke-linecap="round"/>';
}
/* a dark stone shoulder guard with a silver spike, at (x, y); m = 1 for the right shoulder */
function ytPad(x, y, m){
  var Z = YT; function X(v){ return x + v * m; }
  return ytP('M' + X(-3) + ' ' + (y - 6) + 'L' + X(1) + ' ' + (y - 19) + 'L' + X(6) + ' ' + (y - 7) + 'Z', Z.S, Z.KD, 1.5) +
    '<path d="M' + X(0) + ' ' + (y - 9) + 'L' + X(1.2) + ' ' + (y - 16) + '" stroke="' + Z.SL + '" stroke-width="1.1" stroke-linecap="round"/>' +
    ytP('M' + X(-9) + ' ' + (y - 4) + 'L' + X(-2) + ' ' + (y - 8) + 'L' + X(8) + ' ' + (y - 7) + 'L' + X(11) + ' ' + y + 'L' + X(8) + ' ' + (y + 9) + 'L' + X(-4) + ' ' + (y + 10) + 'L' + X(-10) + ' ' + (y + 4) + 'Z', Z.K, Z.KD, 1.8) +
    ytP('M' + X(-2) + ' ' + (y - 1) + 'L' + X(3) + ' ' + (y - 2) + 'L' + X(5) + ' ' + (y + 3) + 'L' + X(1) + ' ' + (y + 6) + 'L' + X(-3) + ' ' + (y + 3) + 'Z', Z.S, Z.KD, 1.1);
}
function ytArt(){
  var Z = YT;
  return wrapSvg(
    /* the shaggy white body */
    ytP('M34 40L31 50L34 54L31 62L35 66L33 74L40 78H60L67 74L65 66L69 62L66 54L69 50L66 40L58 36H42Z', Z.W, Z.WD, 2) +
    '<path d="M40 50L43 56M58 50L55 56M42 64L45 70M58 64L55 70" stroke="' + Z.WS + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* the studded belt and the dark loin flap */
    ytP('M44 78H56L50 88Z', Z.K, Z.KD, 1.6) +
    ytP('M33 72Q50 76 67 72L67 79Q50 83 33 79Z', Z.K, Z.KD, 1.8) +
    ytP('M38 73.4L40 76.4L38.6 79.6L36.6 76.6Z', Z.S, Z.KD, .9) + ytP('M44 74.6L46 77.6L44.6 80.8L42.6 77.8Z', Z.S, Z.KD, .9) + ytP('M50 75L52 78.4L50 81.8L48 78.4Z', Z.S, Z.KD, .9) +
    ytP('M56 74.6L57.4 77.8L55.4 80.8L54 77.6Z', Z.S, Z.KD, .9) + ytP('M62 73.4L63.4 76.6L61.4 79.6L60 76.4Z', Z.S, Z.KD, .9) +
    /* shoulder guards */
    ytPad(31, 38, -1) + ytPad(69, 38, 1) +
    /* the spiky white mane around the face */
    ytP('M33 40L28 34L32 30L27 22L34 20L32 11L40 13L42 5L48 10L52 2L55 10L61 6L61 14L68 12L66 20L73 22L68 30L72 34L67 40L60 44L54 50L50 46L46 50L40 44Z', Z.W, Z.WD, 2) +
    '<path d="M44 9L45 15M56 9L55 15M35 17L38 21M65 17L62 21" stroke="' + Z.WS + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* the dark tuft under the chin */
    ytP('M43 45L46 52L48 49L50 54L52 49L54 52L57 45Z', Z.K, Z.KD, 1.4) +
    /* the blue face */
    ytP('M38 22Q42 18 50 21Q58 18 62 22L63 34Q63 44 56 47H44Q37 44 37 34Z', Z.B, Z.BD, 1.9) +
    /* angry brow and yellow eyes */
    ytP('M38 25L49 30L50 28L51 30L62 25L62 28L51 33H49L38 28Z', '#1a7ec0', Z.BD, 1.3) +
    ytP('M40 29.5L48 32.6Q47.6 36.6 44 36.6Q40.4 36.4 40 29.5Z', Z.E, Z.BD, 1.4) + ytP('M60 29.5L52 32.6Q52.4 36.6 56 36.6Q59.6 36.4 60 29.5Z', Z.E, Z.BD, 1.4) +
    '<circle cx="44.4" cy="33.6" r="1.4" fill="' + Z.KD + '"/><circle cx="55.6" cy="33.6" r="1.4" fill="' + Z.KD + '"/>' +
    '<path d="M48.6 36.2L50 37.4L51.4 36.2" fill="none" stroke="' + Z.BD + '" stroke-width="1" stroke-linecap="round"/>' +
    /* the roaring mouth with fangs */
    ytP('M42 39Q50 37 58 39L57 44Q50 47 43 44Z', Z.M, Z.BD, 1.4) + '<path d="M44.6 43.6Q50 41.4 55.4 43.6Q50 45.8 44.6 43.6Z" fill="' + Z.T + '"/>' +
    ytP('M43 39.4L44.6 42L46 39ZM48.6 38.4L50 40.8L51.4 38.4ZM54 39L55.4 42L57 39.4Z', Z.F, Z.BD, .7) +
    ytP('M45.4 44.6L46.6 42.4L47.6 45.2ZM52.4 45.2L53.4 42.4L54.6 44.6Z', Z.F, Z.BD, .7));
}
function ytBack(c){
  var Z = YT;
  /* shaggy legs and big blue feet with fat toes */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + ytArm(x1, 76, x2, 93, 11) +
      ytP('M' + (fx - 9) + ' 103L' + (fx - 8) + ' 96Q' + fx + ' 92 ' + (fx + 8) + ' 96L' + (fx + 10) + ' 103Z', Z.B, Z.BD, 1.8) +
      '<path d="M' + (fx - 3.6) + ' 98V103M' + (fx + 1) + ' 97.6V103M' + (fx + 5.4) + ' 98V103" stroke="' + Z.BD + '" stroke-width="1.1" stroke-linecap="round"/></g>';
  }
  /* two arms on the back side, each with its fist */
  var back = ytArm(36, 46, 16, 44, 11) + ytFist(12, 44, -1) + ytArm(36, 60, 16, 63, 11) + ytFist(12, 63, -1);
  /* two arms on the front side; the upper one has its fist here, the lower one's fist is the weapon (front layer) */
  var front = ytArm(64, 46, 82, 44, 11) + ytFist(86, 44, 1) + ytArm(64, 60, 80, 63, 11);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 43, 40, 38) + leg('lgR', 57, 60, 62) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function ytFront(c){
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + ytFist(85, 64, 1) + '</g></g></g></svg>';
}
