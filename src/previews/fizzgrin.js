/* Fizzgrin (preview, key 'fz'): the owner's drawing: a furry blue gremlin alchemist with big round ears, a swept-up blue tuft of hair,
   huge yellow eyes, a giant grin full of square teeth, a green tunic with gold trim and a gold belt, silver bands on the arms and
   ankles, white claws, and a round potion flask of glowing purple brew in his hand with little magic orbs swirling round it.
   Faces right like every pal: the potion is in the front hand (the weapon), the back hand is open with its claws out. */
var FZ = { B: '#2a7ae8', BD: '#0a1e4e', BL: '#6aaaff', BM: '#1e5ec0', IN: '#1a4aa8', E: '#ffe02a', K: '#121016', W: '#f6f4ee', WD: '#3a3630', M: '#4a0c14', T: '#e8404a',
  G: '#2e8a3a', GD: '#0e3014', GL: '#5ab85a', Y: '#e8b82a', YD: '#5a4000', S: '#b8bec8', SD: '#2a2e38', SL: '#eef0f4',
  P: '#a03ae8', PD: '#3a0a6a', PL: '#d89aff', GLS: '#d8ecff', C: '#8a5a30', CD: '#3a200c', O: '#8a6aff' };
function fzP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
function fzLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a silver band round an arm or ankle at (x, y) */
function fzBand(x, y, rot, h){
  var Z = FZ; h = h || 9;
  return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')"><rect x="' + (x - 2.6) + '" y="' + (y - h / 2) + '" width="5.2" height="' + h + '" rx="1.6" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="1.4"/>' +
    '<path d="M' + x + ' ' + (y - h / 2 + 1) + 'V' + (y + h / 2 - 1) + '" stroke="' + Z.SD + '" stroke-width=".8"/><path d="M' + (x - 1.4) + ' ' + (y - h / 2 + 1.4) + 'V' + (y + h / 2 - 1.4) + '" stroke="' + Z.SL + '" stroke-width=".9" stroke-linecap="round"/></g>';
}
/* a white claw from (x, y) pointing along angle a */
function fzClaw(x, y, a, l){
  var Z = FZ, r = a * Math.PI / 180, dx = Math.cos(r), dy = Math.sin(r), nx = -dy * l * 0.32, ny = dx * l * 0.32;
  function p(v){ return Math.round(v * 10) / 10; }
  return fzP('M' + p(x + nx) + ' ' + p(y + ny) + 'L' + p(x + dx * l) + ' ' + p(y + dy * l) + 'L' + p(x - nx) + ' ' + p(y - ny) + 'Z', Z.S, Z.SD, 1.1);
}
function fzArt(){
  var Z = FZ;
  return wrapSvg(
    /* big round ears */
    '<circle cx="25" cy="28" r="11" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2"/><circle cx="25.6" cy="28.6" r="6.6" fill="' + Z.IN + '"/>' +
    '<circle cx="75" cy="28" r="11" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2"/><circle cx="74.4" cy="28.6" r="6.6" fill="' + Z.IN + '"/>' +
    /* the body in its green tunic with gold trim, and the gold belt */
    fzP('M38 56Q50 52 62 56L63 74L58 80L50 84L42 80L37 74Z', Z.G, Z.GD, 1.9) +
    '<path d="M38.6 57.4L46 70M61.4 57.4L54 70M38.6 73.6L42.4 79.2L50 82.8L57.6 79.2L61.4 73.6" fill="none" stroke="' + Z.Y + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M42 62Q44 64 42 66M58 62Q56 64 58 66M45 76Q47 78 49 76" fill="none" stroke="' + Z.GL + '" stroke-width="1" stroke-linecap="round"/>' +
    fzP('M46 56L50 62L54 56Z', Z.B, Z.BD, 1.2) +
    fzP('M37 69Q50 72 63 69L63 73Q50 76 37 73Z', Z.Y, Z.YD, 1.4) +
    /* the furry head */
    fzP('M50 18Q66 18 70 30L72 34L70 37L71 43L68 46Q64 56 50 58Q36 56 32 46L29 43L30 37L28 34L30 30Q34 18 50 18Z', Z.B, Z.BD, 2.1) +
    /* the swept-up tuft of hair */
    fzP('M38 22Q38 10 48 8Q44 13 47 17Q49 6 60 4Q54 10 56 16Q62 12 66 14Q60 17 62 22Q50 17 38 22Z', Z.B, Z.BD, 1.8) +
    '<path d="M44 14Q46 10 50 9M54 10Q57 7 60 6" fill="none" stroke="' + Z.BL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* huge yellow eyes */
    '<circle cx="42" cy="31" r="7.4" fill="' + Z.E + '" stroke="' + Z.BD + '" stroke-width="1.8"/><circle cx="58" cy="31" r="7.4" fill="' + Z.E + '" stroke="' + Z.BD + '" stroke-width="1.8"/>' +
    '<circle cx="43.4" cy="31.6" r="3" fill="' + Z.K + '"/><circle cx="56.6" cy="31.6" r="3" fill="' + Z.K + '"/>' +
    '<circle cx="44.4" cy="30.4" r="1" fill="#fff"/><circle cx="57.6" cy="30.4" r="1" fill="#fff"/>' +
    /* the giant grin full of square teeth */
    fzP('M34 40Q50 44 66 40Q64 53 50 55Q36 53 34 40Z', Z.M, Z.BD, 1.8) +
    '<path d="M42 51Q50 46.6 58 51Q55 54 50 54.4Q45 54 42 51Z" fill="' + Z.T + '"/>' +
    fzP('M36 41.2Q50 45 64 41.2L63 45.4Q50 48.4 37 45.4Z', Z.W, Z.WD, 1) +
    '<path d="M41.6 42.8V46.8M46.6 43.6V47.8M53.4 43.6V47.8M58.4 42.8V46.8" stroke="' + Z.WD + '" stroke-width=".9"/>' +
    fzP('M43 51.4Q50 49.6 57 51.4L56.4 53.6Q50 55 43.6 53.6Z', Z.W, Z.WD, .9) +
    '<path d="M47.4 50.6V54.4M52.6 50.6V54.4" stroke="' + Z.WD + '" stroke-width=".8"/>' +
    /* a little fur tuft on the chin */
    fzP('M47 56L50 61L53 56Z', Z.B, Z.BD, 1.2));
}
function fzBack(c){
  var Z = FZ;
  /* furry legs with silver ankle bands and big clawed feet */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + fzLine('M' + x1 + ' 78L' + x2 + ' 93', 6, Z.B, Z.BD) +
      fzClaw(fx - 6, 101, 150, 5) + fzClaw(fx - 1, 102.4, 105, 5) + fzClaw(fx + 4, 102.4, 75, 5) + fzClaw(fx + 8, 101, 30, 5) +
      fzP('M' + (fx - 8) + ' 102Q' + (fx - 7) + ' 94 ' + fx + ' 93Q' + (fx + 8) + ' 94 ' + (fx + 10) + ' 102Z', Z.B, Z.BD, 1.8) +
      fzBand(x2, 92, 90, 12) + '</g>';
  }
  /* the back arm: silver bands and an open hand with its claws out */
  var hand = fzClaw(11, 57.6, -150, 6) + fzClaw(9, 61.4, 178, 6.4) + fzClaw(9.6, 65.4, 152, 6) + fzClaw(13, 67.6, 118, 5) +
    fzP('M17 58Q12 56 9 58Q6 62 9 66Q13 69 17 66Z', Z.B, Z.BD, 1.7);
  var back = fzLine('M36 58L18 62', 5.4, Z.B, Z.BD) + fzBand(24, 61, -12, 10) + fzBand(29, 60, -12, 10) + hand;
  var front = fzLine('M64 58L81 62', 5.4, Z.B, Z.BD) + fzBand(71, 59.6, 12, 10) + fzBand(76, 60.6, 12, 10);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 41, 39) + leg('lgR', 56, 59, 61) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function fzFront(c){
  var Z = FZ;
  /* the potion: a round flask of glowing purple brew with a cork, held from below, and magic orbs swirling round it */
  function orb(x, y, r, col){
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 1.9) + '" fill="' + col + '" fill-opacity=".25"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + col + '" stroke="' + Z.PD + '" stroke-width=".9"/>' +
      '<circle cx="' + (x - r * 0.35) + '" cy="' + (y - r * 0.35) + '" r="' + (r * 0.3) + '" fill="#fff"/>';
  }
  var potion = '<g transform="rotate(-18 86 64)">' +
    '<path d="M76 40Q72 50 80 56M98 46Q104 54 98 62M78 70Q86 76 96 70" fill="none" stroke="' + Z.PL + '" stroke-width="1" stroke-dasharray="1.4 2" stroke-linecap="round"/>' +
    '<circle cx="87" cy="54" r="9" fill="' + Z.GLS + '" stroke="' + Z.SD + '" stroke-width="1.8"/>' +
    '<path d="M78.6 55Q87 51 95.4 55Q95 62 87 63Q79 62 78.6 55Z" fill="' + Z.P + '"/><path d="M80 55Q87 52.6 94 55" fill="none" stroke="' + Z.PL + '" stroke-width="1.1" stroke-linecap="round"/>' +
    '<circle cx="87" cy="54" r="9" fill="none" stroke="' + Z.SD + '" stroke-width="1.8"/>' +
    '<path d="M81.6 49Q83 46.6 85.6 46" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>' +
    fzP('M83.6 46.4V42H90.4V46.4Z', Z.GLS, Z.SD, 1.5) + fzP('M83 42.4H91V40.4H83Z', Z.S, Z.SD, 1.1) +
    fzP('M84 40.6L84.6 36H89.4L90 40.6Z', Z.C, Z.CD, 1.4) +
    orb(77, 42, 2.2, Z.P) + orb(100, 50, 1.8, Z.O) + orb(77, 66, 1.8, Z.O) + orb(97, 68, 2, Z.P) + '</g>';
  /* the hand cupped under the flask */
  var hand = fzP('M80.6 62Q86 59.6 91.4 62Q92.6 66 90 68.4Q86 70 82 68.4Q79.4 66 80.6 62Z', Z.B, Z.BD, 1.7) +
    '<path d="M84 62.4V66M87 62V66.4M90 62.6V65.6" stroke="' + Z.BD + '" stroke-width=".9" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + potion + hand + '</g></g></g></svg>';
}
