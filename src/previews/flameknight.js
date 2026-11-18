/* Flame Knight (preview, key 'fk'): the owner's drawing: a little knight in deep-blue armour with silver trim: a spiky helmet with
   a silver crest and swept-back side fins, a silver faceplate with a flame-shaped orange-and-yellow visor across the eyes, silver
   shoulder guards and a silver chest plate with a flame on each side, gold bands on the arms and above the boots, a brown belt with
   gold plates and a pointed front tab, chunky gold boots, and a sword whose blade is a living flame. Faces right like every pal:
   the flame sword is held up in the front hand, the back hand points out behind him. */
var FK = { B: '#2f5fb4', BD: '#0f2050', BL: '#5f8ce0', S: '#d8dde6', SD: '#3a4250', SL: '#ffffff', SM: '#a9b0bd', Y: '#e8b04a', YD: '#6a4608', YL: '#ffe4a0',
  L: '#8a5a32', LD: '#3a200c', R: '#e8401a', RD: '#7a1008', O: '#ff9a1e', F: '#ffe03a', FL: '#fff8c0', K: '#6f7fbf', KD: '#1f2a5a', KL: '#a8b6ea' };
/* a stroke drawn twice: dark outline, then the fill colour on top */
function fkLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
function fkP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.8) + '" stroke-linejoin="round"/>';
}
/* a gold arm band across an arm at (x, y) */
function fkBand(x, y, rot){
  var Z = FK;
  return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')"><rect x="' + (x - 2) + '" y="' + (y - 4.4) + '" width="4" height="8.8" rx="1.3" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.3"/>' +
    '<path d="M' + (x - 0.8) + ' ' + (y - 3.4) + 'V' + (y + 3.4) + '" stroke="' + Z.YL + '" stroke-width=".9" stroke-linecap="round"/></g>';
}
/* a little flame emblem standing at (x, y), s = size */
function fkFlame(x, y, s){
  var Z = FK; function P(a, b){ return (x + a * s) + ' ' + (y + b * s); }
  return fkP('M' + P(0, 0) + 'Q' + P(-4, -1) + ' ' + P(-3.6, -5) + 'L' + P(-2, -3.6) + 'L' + P(-1.6, -7.6) + 'L' + P(0, -5) + 'L' + P(1.4, -9) + 'L' + P(2.2, -4.6) + 'L' + P(3.8, -6) + 'Q' + P(4.4, -1) + ' ' + P(0, 0) + 'Z', Z.O, Z.RD, 1.1) +
    '<path d="M' + P(0, -0.8) + 'Q' + P(-2, -1.6) + ' ' + P(-1.2, -4) + 'L' + P(0, -3) + 'L' + P(1, -5.6) + 'L' + P(1.8, -3) + 'Q' + P(2.2, -1) + ' ' + P(0, -0.8) + 'Z" fill="' + Z.F + '"/>';
}
function fkArt(){
  var Z = FK;
  return wrapSvg(
    /* body: blue suit, silver shoulder guards, a silver chest plate with a flame each side */
    fkP('M37 58Q50 54 63 58L63 81H37Z', Z.B, Z.BD, 2) +
    '<path d="M40 61Q39 70 40 78" fill="none" stroke="' + Z.BL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    fkP('M44 57L56 57L58.5 69L50 76L41.5 69Z', Z.S, Z.SD, 1.8) +
    '<path d="M50 57.5V75M45 59L56 59" stroke="' + Z.SM + '" stroke-width="1" stroke-linecap="round"/><path d="M44.5 60L42.6 68.6" stroke="' + Z.SL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    fkFlame(39.5, 71, 1.05) + fkFlame(60.5, 71, 1.05) +
    fkP('M28 61Q29 52 38 53L41 56L40 63L31 64Z', Z.S, Z.SD, 1.8) + fkP('M72 61Q71 52 62 53L59 56L60 63L69 64Z', Z.S, Z.SD, 1.8) +
    '<path d="M30.5 58Q32 54.5 37 55M69.5 58Q68 54.5 63 55" fill="none" stroke="' + Z.SL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* helmet crest: three silver spikes, and swept-back silver side fins */
    fkP('M40 23L35 7L46 19Z', Z.S, Z.SD, 1.8) + fkP('M60 23L65 7L54 19Z', Z.S, Z.SD, 1.8) +
    fkP('M44.5 20L50 0L55.5 20Z', Z.S, Z.SD, 1.8) + '<path d="M49 5L47 17" stroke="' + Z.SL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    fkP('M34 30L21 22L25 40L34 44Z', Z.S, Z.SD, 1.8) + fkP('M66 30L79 22L75 40L66 44Z', Z.S, Z.SD, 1.8) +
    '<path d="M24 25L32 31M76 25L68 31" stroke="' + Z.SL + '" stroke-width="1.1" stroke-linecap="round"/>' +
    /* the helmet itself */
    fkP('M33 31Q34 18 50 16Q66 18 67 31L66 46Q61 55 50 58Q39 55 34 46Z', Z.B, Z.BD, 2.1) +
    '<path d="M37 24Q42 19.5 47 19" fill="none" stroke="' + Z.BL + '" stroke-width="1.5" stroke-linecap="round"/>' +
    /* silver brow ridge running down from the crest, and the silver mouth guard */
    fkP('M46 17L54 17L56 31L50 35L44 31Z', Z.S, Z.SD, 1.6) +
    fkP('M40 43L60 43L58 50L50 57.5L42 50Z', Z.S, Z.SD, 1.7) +
    '<path d="M50 44V56M44 45L47 51M56 45L53 51" stroke="' + Z.SM + '" stroke-width="1" stroke-linecap="round"/>' +
    /* the flame visor across the eyes, flaring up and out like wings */
    fkP('M50 39L45 44.5L38.5 43L34 33L38.5 35.5L37.5 28.5L42 33.5L43 27.5L46.4 34.4L50 36L53.6 34.4L57 27.5L58 33.5L62.5 28.5L61.5 35.5L66 33L61.5 43L55 44.5Z', Z.O, Z.RD, 1.6) +
    '<path d="M50 38L45.4 42.4L40.2 41.2L37.6 35.6L40.8 37.4L41 32.4L43.6 36.4L46.6 36.8L50 38.2L53.4 36.8L56.4 36.4L59 32.4L59.2 37.4L62.4 35.6L59.8 41.2L54.6 42.4Z" fill="' + Z.F + '"/>' +
    /* glowing eye slits inside the visor */
    '<path d="M40.5 39L47 40.4M59.5 39L53 40.4" stroke="' + Z.FL + '" stroke-width="1.8" stroke-linecap="round"/>');
}
function fkBack(c){
  var Z = FK;
  /* blue legs with a gold band and chunky gold boots */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + fkLine('M' + x1 + ' 86L' + x2 + ' 95', 5.4, Z.B, Z.BD) +
      '<rect x="' + (x2 - 5.4) + '" y="90.4" width="10.8" height="4" rx="1.4" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.4"/>' +
      fkP('M' + (fx - 7) + ' 104L' + (fx - 6.4) + ' 95.5Q' + fx + ' 93.5 ' + (fx + 4) + ' 95.5L' + (fx + 5) + ' 98.5Q' + (fx + 10.5) + ' 99.5 ' + (fx + 10.5) + ' 104Z', Z.Y, Z.YD, 1.8) +
      '<path d="M' + (fx - 5) + ' 97.5Q' + (fx - 1) + ' 96 ' + (fx + 2.5) + ' 97.5" fill="none" stroke="' + Z.YL + '" stroke-width="1.1" stroke-linecap="round"/></g>';
  }
  /* back arm stretched out behind him, gold bands, pointing with one finger */
  var hand = fkP('M20 61.5Q14 60.5 12.6 62L6 62.6Q3.6 63.6 6 65L12 65.4Q12 68.6 16 69.4L20 68.6Z', Z.K, Z.KD, 1.6) +
    '<path d="M12.6 62.2L13 65.3M9 63.2H12" stroke="' + Z.KD + '" stroke-width=".9" stroke-linecap="round"/><path d="M7 63.4H10.6" stroke="' + Z.KL + '" stroke-width=".9" stroke-linecap="round"/>';
  var back = fkLine('M38 62L20 65', 4.4, Z.B, Z.BD) + fkBand(26, 64, -10) + fkBand(31, 63.2, -10) + hand;
  var front = fkLine('M62 62L83 63', 4.4, Z.B, Z.BD) + fkBand(70, 62.4, 4) + fkBand(75, 62.6, 4);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 45, 43, 40) + leg('lgR', 55, 57, 60) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function fkFront(c){
  var Z = FK;
  /* belt, front tab and hip plates sit in this front layer so the legs go under them */
  var belt = fkP('M37 84L46 84L45 88L36.6 87.4Z', Z.B, Z.BD, 1.4) + fkP('M63 84L54 84L55 88L63.4 87.4Z', Z.B, Z.BD, 1.4) +
    '<path d="M37.6 86.6L45 87.4M62.4 86.6L55 87.4" stroke="' + Z.S + '" stroke-width="1.2" stroke-linecap="round"/>' +
    fkP('M36 79Q50 81 64 79L64 84Q50 86 36 84Z', Z.L, Z.LD, 1.6) +
    fkP('M37.5 79.4L42.5 79.8L42.5 84.6L37.5 84.2Z', Z.Y, Z.YD, 1.2) + fkP('M62.5 79.4L57.5 79.8L57.5 84.6L62.5 84.2Z', Z.Y, Z.YD, 1.2) +
    fkP('M46 84.4L54 84.4L53.6 89L50 93.4L46.4 89Z', Z.Y, Z.YD, 1.3) + '<path d="M47.6 85.6L52.4 85.6L52.1 88.4L50 91L47.9 88.4Z" fill="' + Z.L + '"/>' +
    '<rect x="45.6" y="78.8" width="8.8" height="6.4" rx="1.2" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.3"/><rect x="47.8" y="80.6" width="4.4" height="2.8" rx=".6" fill="' + Z.L + '"/>';
  /* the flame sword held upright: wooden grip, gold pommel, silver crossguard, and a blade that is a living flame */
  var sword = '<circle cx="86.4" cy="73" r="2.6" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.3"/>' +
    fkLine('M86.4 70.4L86.2 53', 2.6, Z.L, Z.LD) +
    fkP('M86 4L84.6 13.6L82.2 13L83 21.4L79.6 20.4L81 29L77.6 28.4L80 36.4L76.8 36.4L80.6 44L78.4 45.4L81.6 51.6L91 51.6L93.4 45L91.4 44.4L94.6 37.8L91.6 37.4L94 29.6L90.8 30.4L92.6 22L89.6 22.8L90.2 14.6L87.8 15.4Z', Z.R, Z.RD, 1.6) +
    '<path d="M86 12L84.8 19.6L83.4 19.4L83.8 26.4L82.4 26.2L83.2 34L81.6 34.2L83.6 42L82.8 50.6L89.8 50.6L90.6 43.8L91.4 36.4L89.6 36.6L91 28.8L89.2 29.4L89.8 21.4L88 22L87.6 15.6Z" fill="' + Z.O + '"/>' +
    '<path d="M86.2 21L85.4 29.6L85.6 38L85 50.4L88.4 50.4L88.6 41L88.2 31.4L87.6 24.6Z" fill="' + Z.F + '"/>' +
    '<path d="M86.6 28V48" stroke="' + Z.FL + '" stroke-width="1.1" stroke-linecap="round"/>' +
    fkP('M77 52.4Q75.6 50.6 77 49.6L82 51.2H91L96 49.6Q97.4 50.6 96 52.4L91 55H82Z', Z.S, Z.SD, 1.5) +
    '<path d="M78 51.2L82 52.4H91" fill="none" stroke="' + Z.SL + '" stroke-width="1" stroke-linecap="round"/>';
  /* the gauntlet wrapped round the grip */
  var fist = fkP('M82.4 57.6Q86.6 56.4 90.6 57.8Q91.8 62 90.6 66.4Q86.6 67.6 82.4 66.4Q81.4 62 82.4 57.6Z', Z.K, Z.KD, 1.7) +
    '<path d="M86 59.4H90.4M86 62H90.8M86 64.6H90.4" stroke="' + Z.KD + '" stroke-width=".9" stroke-linecap="round"/><path d="M83.4 59.4Q83 62 83.4 64.6" stroke="' + Z.KL + '" stroke-width="1" stroke-linecap="round" fill="none"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + belt +
    '<g><g class="pump pR"><g class="wpn">' + sword + fist + '</g></g></g></svg>';
}
