/* Goblin Archer (key 'ga', Fire, ranged, normal): the owner's drawing: a little green goblin with big pointy ears, a messy blue mop of hair
   tied up in a spiky topknot with an orange band, stern black eyes, a dark brown vest with an orange sash across it, a belt
   with a gold buckle, a ragged orange tunic, dark trousers, brown cuffed boots, orange-and-brown bracers, and a quiver of
   arrows on his back. He really holds his bow: the front hand grips it in the middle with a flaming arrow nocked on the string, and his shots fly as fire arrows (shot 'firearrow').
   Faces right like every pal. */
var GA = { G: '#5fd650', GD: '#1d5a16', GL: '#a6f08e', H: '#3a6ee8', HD: '#142c78', HL: '#7aa4ff', O: '#f0a050', OD: '#7a3e10', OL: '#ffd29a',
  V: '#5a3a2e', VD: '#24150f', P: '#4a3428', B: '#a0643a', BD: '#3e2410', BL: '#d0945e', Y: '#f2c24e', YD: '#6e4a0a', W: '#8a5530', WD: '#3a200c', K: '#151010' };
/* a stroke drawn twice: dark outline, then the fill colour on top */
function gaLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a green mitten hand at (x, y); m = 1 fingers to the right */
function gaHand(x, y, m){
  var Z = GA; function X(v){ return x + v * m; }
  return '<path d="M' + X(-4) + ' ' + (y - 4) + 'Q' + X(5) + ' ' + (y - 6) + ' ' + X(7) + ' ' + (y - 1) + 'Q' + X(7) + ' ' + (y + 4) + ' ' + X(1) + ' ' + (y + 4.5) + 'Q' + X(-5) + ' ' + (y + 4) + ' ' + X(-4) + ' ' + (y - 4) + 'Z" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.8" stroke-linejoin="round"/>';
}
/* an orange-and-brown banded bracer along an arm, centred at (x, y) */
function gaBracer(x, y, rot){
  var Z = GA;
  return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')">' +
    '<rect x="' + (x - 6) + '" y="' + (y - 3.8) + '" width="4" height="7.6" rx="1.2" fill="' + Z.V + '" stroke="' + Z.VD + '" stroke-width="1.3"/>' +
    '<rect x="' + (x - 2) + '" y="' + (y - 4) + '" width="4" height="8" rx="1.2" fill="' + Z.O + '" stroke="' + Z.OD + '" stroke-width="1.3"/>' +
    '<rect x="' + (x + 2) + '" y="' + (y - 3.8) + '" width="4" height="7.6" rx="1.2" fill="' + Z.V + '" stroke="' + Z.VD + '" stroke-width="1.3"/></g>';
}
function gaArt(){
  var Z = GA;
  /* the quiver on his back, over the shoulder away from where he faces, with three fletched arrows */
  var quiver = '<g transform="rotate(-28 34 58)">' +
    '<path d="M30.5 40L31.5 34M34.5 40L35 33M38 40L39 34.5" stroke="' + Z.WD + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M31.5 34L28.5 30L30 27L32.5 31ZM35 33L33 28.5L35 26L36.5 30ZM39 34.5L37.5 30L39.5 27.5L40.5 31.5Z" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.1" stroke-linejoin="round"/>' +
    '<rect x="28" y="39" width="13" height="30" rx="3" fill="' + Z.W + '" stroke="' + Z.WD + '" stroke-width="1.8"/>' +
    '<rect x="27.4" y="39" width="14.2" height="4" rx="1.6" fill="' + Z.B + '" stroke="' + Z.WD + '" stroke-width="1.4"/>' +
    '<path d="M31 46V64" stroke="' + Z.BL + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".6"/></g>';
  return wrapSvg(
    quiver +
    /* the spiky topknot, tied with an orange band */
    '<path d="M44 16Q38 12 40 6Q43 9 45 8Q44 2 49 0Q50 4 53 4Q56 0 60 3Q57 6 59 8Q63 7 64 11Q59 12 56 16Z" fill="' + Z.H + '" stroke="' + Z.HD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M48 5Q50 9 49 13M54 6Q55 10 53 14" fill="none" stroke="' + Z.HL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    '<rect x="45" y="14" width="10" height="6" rx="2" fill="' + Z.O + '" stroke="' + Z.OD + '" stroke-width="1.5"/>' +
    '<path d="M46.5 16H53.5" stroke="' + Z.OL + '" stroke-width="1" stroke-linecap="round"/>' +
    /* torso: dark vest, orange sash crossing from the shoulder, belt with a gold buckle */
    '<path d="M38 58Q50 54 62 58L63 80H37Z" fill="' + Z.V + '" stroke="' + Z.VD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M50 56L46 62L50 66L54 62Z" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M37 57L42 55L64 74L62 79Z" fill="' + Z.O + '" stroke="' + Z.OD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M63 57L58 55L36 73L37 78Z" fill="' + Z.O + '" stroke="' + Z.OD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M41 57.5L60 73.5" stroke="' + Z.OL + '" stroke-width="1" stroke-linecap="round"/>' +
    /* big pointy ears */
    '<path d="M35 34L14 22L22 40Q28 46 36 44Z" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M65 34L86 22L78 40Q72 46 64 44Z" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M31 36L20 27L25 38ZM69 36L80 27L75 38Z" fill="' + Z.GL + '" fill-opacity=".7"/>' +
    /* the head: a soft square face coming down to a pointed chin */
    '<path d="M34 30Q34 22 50 22Q66 22 66 30L65 44Q60 54 50 57Q40 54 35 44Z" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="2" stroke-linejoin="round"/>' +
    /* the blue mop of hair with a fringe over the brow */
    '<path d="M32 36Q30 22 40 18Q50 15 60 18Q70 22 68 36Q66 30 62 31L60 27Q57 32 52 30L50 26Q46 32 41 30L39 27Q36 31 32 36Z" fill="' + Z.H + '" stroke="' + Z.HD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M40 21Q48 18 57 20" fill="none" stroke="' + Z.HL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    /* stern eyes: white with black pupils and slanted brows */
    '<path d="M38.5 38.5Q42.5 36.5 46.5 39.5L45.5 43Q41.5 44 39 41.5Z" fill="#fff" stroke="' + Z.K + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M61.5 38.5Q57.5 36.5 53.5 39.5L54.5 43Q58.5 44 61 41.5Z" fill="#fff" stroke="' + Z.K + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<ellipse cx="43.4" cy="40.6" rx="1.5" ry="2.1" fill="' + Z.K + '"/><ellipse cx="56.6" cy="40.6" rx="1.5" ry="2.1" fill="' + Z.K + '"/>' +
    '<path d="M38 35.5L46.5 38M62 35.5L53.5 38" stroke="' + Z.K + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* a small determined mouth */
    '<path d="M47 49Q50 48 53 49" fill="none" stroke="' + Z.GD + '" stroke-width="1.4" stroke-linecap="round"/>');
}
function gaBack(c){
  var Z = GA;
  /* dark trousers and brown boots with a turned-down cuff */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + gaLine('M' + x1 + ' 86L' + x2 + ' 95', 5, Z.P, Z.VD) +
      '<path d="M' + (fx - 7) + ' 104L' + (fx - 6) + ' 95H' + (fx + 4) + 'L' + (fx + 5) + ' 98.5Q' + (fx + 10) + ' 99.5 ' + (fx + 10) + ' 104Z" fill="' + Z.BL + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<rect x="' + (fx - 7.4) + '" y="92.6" width="12.4" height="4.6" rx="1.4" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.6"/></g>';
  }
  /* the back arm stretched out to the left with a bracer and an open hand */
  var back = gaLine('M38 62L19 67', 4, Z.G, Z.GD) + gaBracer(24, 66, -15) + gaHand(15, 68, -1);
  /* the front arm reaching out to hold the bow (the hand and bow are in the front layer) */
  var front = gaLine('M62 62L84 64', 4, Z.G, Z.GD) + gaBracer(77, 63.4, 5);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 45, 43, 40) + leg('lgR', 55, 57, 60) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function gaFront(c){
  var Z = GA;
  /* the bow: a recurve held by its grip, tips curling forward, string at the back with an arrow nocked across the grip */
  var bow = '<path d="M80 34L80 94" stroke="#efe6d0" stroke-width="1" />' +
    '<path d="M80 64H99" stroke="' + Z.WD + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* the arrowhead is on fire: a flame wrapped round the tip, licking back along the shaft */
    '<path d="M104 64Q101 57 96 59Q98 55.5 94 54Q95 58 92 60Q90 62 91 64Q90 66 92 68Q95 70 94 74Q98 72.5 96 69Q101 71 104 64Z" fill="#ff7a1a" stroke="#a8300a" stroke-width="1" stroke-linejoin="round"/>' +
    '<path d="M103 64Q100.5 60 97 61.5Q97.5 59 95.5 58.5Q95.6 61 94 62.5Q93.4 64 94 65.5Q95.6 67 95.5 69.5Q97.5 69 97 66.5Q100.5 68 103 64Z" fill="#ffd23a"/>' +
    '<path d="M99 61.6L103 64L99 66.4Z" fill="#fff2b0" stroke="#a8300a" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M80 64L77 61.4L82.5 61.6ZM80 64L77 66.6L82.5 66.4Z" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width=".8" stroke-linejoin="round"/>' +
    gaLine('M80 34Q86 36 89 44Q92 54 88 64Q92 74 89 84Q86 92 80 94', 3.2, Z.W, Z.WD) +
    '<path d="M80 34Q77 33 76 30M80 94Q77 95 76 98" fill="none" stroke="' + Z.YD + '" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M80 34Q77 33 76 30M80 94Q77 95 76 98" fill="none" stroke="' + Z.Y + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M84.6 39Q87 41 88 44" fill="none" stroke="' + Z.BL + '" stroke-width="1" stroke-linecap="round"/>';
  /* the hand wrapped round the grip: fingers in front of the bow */
  var grip = '<rect x="85.2" y="58.5" width="5.6" height="11" rx="1.6" fill="' + Z.O + '" stroke="' + Z.OD + '" stroke-width="1.3"/>' +
    '<path d="M83 59.5Q90 58 92 61.5Q92.8 64 92 66.5Q90 70 83 68.5Q81 64 83 59.5Z" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M86 61.6Q89.5 61.2 91.5 62.6M86 64.2Q89.5 63.8 91.8 65M86 66.6Q89 66.4 91 67.4" fill="none" stroke="' + Z.GD + '" stroke-width="1" stroke-linecap="round"/>';
  /* the ragged tunic and belt sit in this front layer so the legs show under it, not over it */
  var tunic =
  /* ragged orange tunic below the belt, with a darker flap in front */
    '<path d="M37 79L63 79L65 88L61 85.5L58 89.5L54 86L50 91L46 86L42 89.5L39 85.5L35 88Z" fill="' + Z.O + '" stroke="' + Z.OD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M47 80L54 80L54.6 88L51 92L47.6 88Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M36 77Q50 80 64 77L64 82Q50 85 36 82Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<rect x="46" y="76.6" width="8" height="6.4" rx="1.2" fill="' + Z.Y + '" stroke="' + Z.YD + '" stroke-width="1.3"/><rect x="48.4" y="78.6" width="3.2" height="2.4" rx=".6" fill="' + Z.B + '"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + tunic +
    '<g><g class="pump pR"><g class="wpn">' + bow + grip + '</g></g></g></svg>';
}
