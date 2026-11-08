/* Tiger-shark sumo brawler (no name yet): an original pal: an orange tiger shark with dark stripes, a white belly and jaw, a big
   toothy grin, a dorsal fin rising from his back, a navy sumo belt with white tassels, and fists wrapped in white tape (melee).
   (preview only) */
var SU = { O: '#f08a3a', OD: '#6a2e08', OL: '#ffc08a', ST: '#5a2a10', W: '#fbf4e8', WD: '#8a7a64', N: '#1e2c66', ND: '#0a1030', T: '#f6f2ea', TD: '#9a9080' };
function suFist(x, y, m){      /* a round fist wrapped in white tape; m = 1 knuckles right, -1 left */
  var S = SU; function X(v){ return x + v * m; }
  return '<path d="M' + X(-8) + ' ' + y + 'Q' + X(-8) + ' ' + (y - 8) + ' ' + X(0) + ' ' + (y - 8) + 'Q' + X(9) + ' ' + (y - 8) + ' ' + X(9) + ' ' + y + 'Q' + X(9) + ' ' + (y + 8) + ' ' + X(0) + ' ' + (y + 8) + 'Q' + X(-8) + ' ' + (y + 8) + ' ' + X(-8) + ' ' + y + 'Z" fill="' + S.T + '" stroke="' + S.TD + '" stroke-width="2"/>' +
    '<path d="M' + X(-7) + ' ' + (y - 4) + 'L' + X(8) + ' ' + (y - 1) + 'M' + X(-7.5) + ' ' + (y + 1) + 'L' + X(8.5) + ' ' + (y + 4) + 'M' + X(3) + ' ' + (y - 7.5) + 'Q' + X(5) + ' ' + y + ' ' + X(3) + ' ' + (y + 7.5) + '" fill="none" stroke="' + S.TD + '" stroke-width="1.2" stroke-linecap="round"/>';
}
function suArt(){
  var S = SU, O = '#1a0e06';
  return wrapSvg(
    /* round orange body with a white belly and tiger stripes on the sides */
    outlined('<path d="M28 60Q50 51 72 60Q78 74 70 86Q50 93 30 86Q22 74 28 60Z"/>', S.O, S.OD) +
    '<path d="M38 62Q50 58 62 62Q67 74 61 84Q50 88 39 84Q33 74 38 62Z" fill="' + S.W + '"/>' +
    '<path d="M29 66L35 68M27 72L34 73M28 78L34 78M71 66L65 68M73 72L66 73M72 78L66 78" stroke="' + S.ST + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* navy sumo belt with white tassels */
    outlined('<path d="M28 80Q50 87 72 80L71 88Q50 94 29 88Z"/>', S.N, S.ND, 2) +
    '<path d="M45 87V95M50 88V96M55 87V95" stroke="' + S.T + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* wide shark head: orange top with stripes, white lower jaw, a big grin */
    outlined('<path d="M50 16C67 16 76 28 76 40C76 52 66 60 50 60C34 60 24 52 24 40C24 28 33 16 50 16Z"/>', S.O, S.OD) +
    '<path d="M38 19L41 25M50 16.5V23M62 19L59 25M30 26L35 30M70 26L65 30" stroke="' + S.ST + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M33 24Q40 19 47 18.5" fill="none" stroke="' + S.OL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M27 43Q50 39 73 43Q71 56 50 59Q29 56 27 43Z" fill="' + S.W + '" stroke="' + S.WD + '" stroke-width="1.4"/>' +
    /* gill slits */
    '<path d="M27 47L29.5 52M29.5 46L32 51M73 47L70.5 52M70.5 46L68 51" stroke="' + S.OD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* small determined eyes with heavy brows */
    '<circle cx="38" cy="33" r="3.6" fill="#fff" stroke="' + O + '" stroke-width="1.4"/><circle cx="38.8" cy="33.4" r="2.1" fill="' + O + '"/>' +
    '<circle cx="62" cy="33" r="3.6" fill="#fff" stroke="' + O + '" stroke-width="1.4"/><circle cx="61.2" cy="33.4" r="2.1" fill="' + O + '"/>' +
    '<path d="M32 28L43 30.5M68 28L57 30.5" stroke="' + O + '" stroke-width="2.6" stroke-linecap="round"/>' +
    /* big toothy grin */
    '<path d="M33 43Q50 49 67 43Q64 53 50 55Q36 53 33 43Z" fill="#5a1414" stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M35 44L37 47.6L39.5 44.8L42 48.6L44.5 45.6L47 49.2L49.5 46L52 49.2L54.5 45.6L57 48.6L59.5 44.8L62 47.6L65 44" fill="#fff" stroke="' + O + '" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="M40 52L42 49.4L44.5 53M47 54L49.5 50.6L52 54M55 53L57.5 49.4L60 52" fill="#fff" stroke="' + O + '" stroke-width=".8" stroke-linejoin="round"/>');
}
function suBack(c){
  var S = SU;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 87L' + x2 + ' 95" stroke="' + S.OD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 87L' + x2 + ' 95" stroke="' + S.O + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 9) + ' 103Q' + (fx - 9) + ' 95 ' + fx + ' 95Q' + (fx + 9) + ' 95 ' + (fx + 9) + ' 103Z" fill="' + S.O + '" stroke="' + S.OD + '" stroke-width="2.2" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.OD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.O + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + ((x1 + x2) / 2 - 1) + ' ' + ((y1 + y2) / 2 - 3.5) + 'L' + ((x1 + x2) / 2 + 1) + ' ' + ((y1 + y2) / 2 + 3.5) + '" stroke="' + S.ST + '" stroke-width="2" stroke-linecap="round"/>';
  }
  /* dorsal fin rising from his back behind the head, and a tail swinging out to the left */
  var fin = outlined('<path d="M60 22Q70 2 84 -2Q76 12 76 34Z"/>', S.O, S.OD, 2.2) + '<path d="M66 16Q72 8 80 3" fill="none" stroke="' + S.OL + '" stroke-width="1.6" stroke-linecap="round"/>';
  var tail = outlined('<path d="M30 82Q18 88 12 80L4 72L8 86L2 96L14 90Q24 92 32 86Z"/>', S.O, S.OD, 2) + '<path d="M18 86L22 83" stroke="' + S.ST + '" stroke-width="2" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + fin + tail + leg('lgL', 40, 37, 34) + leg('lgR', 60, 63, 66) +
    '<g><g class="pump pL">' + arm(28, 63, 15, 68) + suFist(11, 71, -1) + '</g></g>' +
    '<g><g class="pump pR">' + arm(72, 63, 83, 65) + '</g></g></svg>';
}
function suFront(c){
  /* the front fist sits in the weapon group so it punches when he hits */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + suFist(89, 66, 1) + '</g></g></g></g></svg>';
}
