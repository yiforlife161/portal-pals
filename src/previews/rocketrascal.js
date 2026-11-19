/* Rocket Rascal (preview, key 'rr'): the owner's drawing (inspired by arena-brawler cartoon heroes, no franchise look): a round
   green egg-shaped monster with a shaggy red mop of hair, two black dot eyes and a huge grin with yellow teeth, chunky green arms
   with leafy tufts, short legs on wide three-toed feet, a striped red-and-yellow firecracker drum in the back hand and a toy
   rocket (yellow body, red nose cone and fins) held up in the front hand. Faces right like every pal. */
var RR = { G: '#86cc2c', GD: '#2c5a0c', GL: '#b4ea64', GM: '#5ea81e', H: '#c42a1e', HD: '#5a0c06', HL: '#ec5a3e', Y: '#ffcc2a', YD: '#7a5000', YL: '#fff0a0',
  R: '#ee3a24', RD: '#6e1006', K: '#141012', B: '#3a2e2a' };
function rrP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
/* a stroke drawn twice: dark outline, then the fill colour on top */
function rrLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a leafy tuft: a pointed leaf from (x, y) at angle a (degrees), length l */
function rrLeaf(x, y, a, l){
  var Z = RR, r = a * Math.PI / 180, dx = Math.cos(r), dy = Math.sin(r), nx = -dy, ny = dx, w = l * 0.4;
  function p(v){ return Math.round(v * 10) / 10; }
  var tx = x + dx * l, ty = y + dy * l, mx = x + dx * l * 0.5, my = y + dy * l * 0.5;
  return '<path d="M' + p(x) + ' ' + p(y) + 'Q' + p(mx + nx * w) + ' ' + p(my + ny * w) + ' ' + p(tx) + ' ' + p(ty) + 'Q' + p(mx - nx * w) + ' ' + p(my - ny * w) + ' ' + p(x) + ' ' + p(y) + 'Z" fill="' + Z.GM + '" stroke="' + Z.GD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M' + p(x + dx * l * 0.15) + ' ' + p(y + dy * l * 0.15) + 'L' + p(x + dx * l * 0.75) + ' ' + p(y + dy * l * 0.75) + '" stroke="' + Z.GD + '" stroke-width=".7" stroke-linecap="round" stroke-opacity=".6"/>';
}
/* a chunky green fist at (x, y) with knuckle lines; m = 1 knuckles to the right */
function rrFist(x, y, m){
  var Z = RR; function X(v){ return x + v * m; }
  return rrP('M' + X(-5) + ' ' + (y - 6) + 'Q' + X(4) + ' ' + (y - 8) + ' ' + X(6.4) + ' ' + (y - 3) + 'Q' + X(7.4) + ' ' + y + ' ' + X(6.4) + ' ' + (y + 3) + 'Q' + X(4) + ' ' + (y + 8) + ' ' + X(-5) + ' ' + (y + 6) + 'Q' + X(-7) + ' ' + y + ' ' + X(-5) + ' ' + (y - 6) + 'Z', Z.G, Z.GD, 1.8) +
    '<path d="M' + X(1) + ' ' + (y - 3) + 'H' + X(6.2) + 'M' + X(1) + ' ' + y + 'H' + X(6.8) + 'M' + X(1) + ' ' + (y + 3) + 'H' + X(6.2) + '" stroke="' + Z.GD + '" stroke-width="1" stroke-linecap="round"/>' +
    '<path d="M' + X(-4) + ' ' + (y - 4) + 'Q' + X(-5) + ' ' + y + ' ' + X(-4) + ' ' + (y + 3) + '" fill="none" stroke="' + Z.GL + '" stroke-width="1.1" stroke-linecap="round"/>';
}
function rrArt(){
  var Z = RR;
  return wrapSvg(
    /* the round egg body that is also his head */
    rrP('M50 15Q66 15 68 38Q70 60 64 72Q58 80 50 80Q42 80 36 72Q30 60 32 38Q34 15 50 15Z', Z.G, Z.GD, 2.2) +
    '<path d="M37 30Q38 21 45 18" fill="none" stroke="' + Z.GL + '" stroke-width="2" stroke-linecap="round"/>' +
    /* furry tufts along his sides */
    rrP('M33 62L30 67L34.6 66L33.6 71L37 68Z', Z.G, Z.GD, 1.3) + rrP('M67 62L70 67L65.4 66L66.4 71L63 68Z', Z.G, Z.GD, 1.3) +
    /* the shaggy red mop of hair: two big clumps parted in the middle, flopping down the sides, and a tuft on top */
    rrP('M51 21Q47 11 38 12Q29 14 31 23L27 35L32.4 30L32 38L36.4 29.6L38.6 34.6L40.4 26.6Q45 21.6 51 21Z', Z.H, Z.HD, 1.9) + rrP('M49 21Q53 11 62 12Q71 14 69 23L73 35L67.6 30L68 38L63.6 29.6L61.4 34.6L59.6 26.6Q55 21.6 49 21Z', Z.H, Z.HD, 1.9) +
    rrP('M44 17L45 7L49 13L53 5L54.6 13L58 9L56.6 18Q50 15 44 17Z', Z.H, Z.HD, 1.7) +
    '<path d="M37 15Q33 19 33 26M63 15Q67 19 67 26M50 9L50.4 15" fill="none" stroke="' + Z.HL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* dot eyes */
    '<ellipse cx="43" cy="36" rx="3" ry="3.6" fill="' + Z.K + '"/><ellipse cx="57" cy="36" rx="3" ry="3.6" fill="' + Z.K + '"/>' +
    '<circle cx="44" cy="34.8" r="1" fill="#fff"/><circle cx="58" cy="34.8" r="1" fill="#fff"/>' +
    /* the huge grin: black mouth with a row of yellow teeth on top and bottom */
    rrP('M37 44H63Q63 58 50 59Q37 58 37 44Z', Z.K, Z.K, 1.4) +
    rrP('M38.4 44.8H61.6Q61.4 48 59 48.4H41Q38.6 48 38.4 44.8Z', Z.Y, Z.YD, .9) +
    rrP('M42 55Q46 52.4 50 52.4Q54 52.4 58 55Q55 58 50 58.2Q45 58 42 55Z', Z.Y, Z.YD, .9) +
    '<path d="M36 43.6Q37 44.6 38 44.2M64 43.6Q63 44.6 62 44.2" stroke="' + Z.GD + '" stroke-width="1.2" stroke-linecap="round"/>');
}
function rrBack(c){
  var Z = RR;
  /* short legs on wide three-toed feet, with a leaf tuft on the ankle */
  function leg(cls, x1, x2, fx, m){
    return '<g class="lg ' + cls + '">' + rrLine('M' + x1 + ' 79L' + x2 + ' 93', 7, Z.G, Z.GD) +
      rrLeaf(x2 + 3.5 * m, 90, m > 0 ? -40 : -140, 7) +
      rrP('M' + (fx - 8) + ' 103L' + (fx - 6) + ' 96Q' + fx + ' 92 ' + (fx + 6) + ' 96L' + (fx + 9) + ' 103L' + (fx + 4) + ' 101.6L' + fx + ' 104L' + (fx - 4) + ' 101.6Z', Z.G, Z.GD, 1.8) + '</g>';
  }
  /* the firecracker drum: yellow caps, red body with yellow zig-zags, a dark band round the middle */
  var drum = rrP('M6 50H20V72H6Z', Z.R, Z.RD, 1.8) +
    '<path d="M6.6 52L8.6 58L10.6 52L12.6 58L14.6 52L16.6 58L18.6 52M6.6 70L8.6 64L10.6 70L12.6 64L14.6 70L16.6 64L18.6 70" fill="none" stroke="' + Z.Y + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    rrP('M5.4 59.4H20.6V63H5.4Z', Z.B, Z.K, 1.2) +
    rrP('M4.6 71.6H21.4V75Q13 77 4.6 75Z', Z.Y, Z.YD, 1.6) +
    rrP('M4.6 50.2Q13 52.4 21.4 50.2V47.6Q13 45.4 4.6 47.6Z', Z.Y, Z.YD, 1.6) +
    '<ellipse cx="13" cy="47.6" rx="8.4" ry="2" fill="' + Z.YL + '" stroke="' + Z.YD + '" stroke-width="1.2"/>';
  /* the back arm: chunky, with leaves on the shoulder and forearm, the fist wrapped round the drum */
  var back = rrLine('M36 54L21 60', 8.4, Z.G, Z.GD) + rrLeaf(31, 52, -120, 8) + rrLeaf(24, 55, -100, 7) + drum + rrFist(14, 61, -1);
  var front = rrLine('M64 54L80 60', 8.4, Z.G, Z.GD) + rrLeaf(69, 52, -60, 8) + rrLeaf(76, 55, -80, 7);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 42, 40, -1) + leg('lgR', 56, 58, 60, 1) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function rrFront(c){
  var Z = RR;
  /* the toy rocket held upright: red nose cone, yellow body, red fins and a little nozzle */
  var rocket = rrP('M81.4 70L77.6 78L82 76.4L83 74ZM92.6 70L96.4 78L92 76.4L91 74Z', Z.R, Z.RD, 1.4) +
    rrP('M85 73H89L88.4 76.4H85.6Z', '#c08a1a', Z.YD, 1.2) +
    rrP('M82.6 44H91.4L92.6 73H81.4Z', Z.Y, Z.YD, 1.8) +
    '<path d="M84.4 46L83.6 70" stroke="' + Z.YL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    rrP('M87 28L93 44.6H81Z', Z.R, Z.RD, 1.8) + '<path d="M86 32L83.6 41.6" stroke="' + Z.HL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    rrP('M86 73.6L87 77.4L88 73.6Z', Z.R, Z.RD, .8);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + rocket + rrFist(86, 62, 1) + '</g></g></g></svg>';
}
