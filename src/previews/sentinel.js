/* Winged warrior (no name yet): the owner's armoured warrior in yellow and black: a knight helmet with two curved yellow horns and a black visor and white eye
   slits, a black crest, a yellow breastplate with a black chevron, black shoulder guards, a big silver blade-wing hanging down behind each shoulder, solid armour
   plates (no stripes), and yellow gauntlets with blue gems and one big blade sticking out of each (Air, melee, Giant). (preview only) */
var SN = { Y: '#f2b81e', YD: '#7a5400', YL: '#ffd968', K: '#2a2830', KD: '#0c0b10', KL: '#4a4652', BL: '#2f9be8', BLD: '#0e3f6a', W: '#d9dee8', WD: '#4a5060', ST: '#8fa8d0', STD: '#1e2c4a' };
function snClaw(x, y, m){      /* a yellow gauntlet with one big blade sticking out past the knuckles; m = 1 blades right, -1 left */
  var S = SN; function X(v){ return x + v * m; }
  /* one big, broad blade out of the knuckles, slightly curved, with a bright edge */
  var big = '<path d="M' + X(4) + ' ' + (y - 6) + 'Q' + X(18) + ' ' + (y - 7) + ' ' + X(30) + ' ' + (y - 2) + 'Q' + X(18) + ' ' + (y + 3) + ' ' + X(4) + ' ' + (y + 5) + 'Z" fill="' + S.ST + '" stroke="' + S.STD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M' + X(6) + ' ' + (y - 4.6) + 'Q' + X(18) + ' ' + (y - 5.4) + ' ' + X(27) + ' ' + (y - 2.2) + '" fill="none" stroke="#eef4ff" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M' + X(6) + ' ' + (y + 0.5) + 'Q' + X(16) + ' ' + (y - 0.5) + ' ' + X(24) + ' ' + (y - 1.8) + '" fill="none" stroke="' + S.STD + '" stroke-width="1" stroke-linecap="round" stroke-opacity=".5"/>';
  return big +
    '<path d="M' + X(-8) + ' ' + (y - 4) + 'Q' + X(-7) + ' ' + (y - 11) + ' ' + X(1) + ' ' + (y - 10) + 'Q' + X(8) + ' ' + (y - 9) + ' ' + X(8) + ' ' + (y - 2) + 'Q' + X(8) + ' ' + (y + 5) + ' ' + X(1) + ' ' + (y + 6) + 'Q' + X(-7) + ' ' + (y + 5) + ' ' + X(-8) + ' ' + (y - 4) + 'Z" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M' + X(4) + ' ' + (y - 8) + 'V' + (y + 4) + '" stroke="' + S.K + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<ellipse cx="' + X(-3) + '" cy="' + (y - 3) + '" rx="2.8" ry="2.2" fill="' + S.BL + '" stroke="' + S.BLD + '" stroke-width="1.2"/>';
}
function snArt(){
  var S = SN;
  return wrapSvg(
    /* yellow breastplate with a black chevron, a black waist and a yellow plate belt */
    outlined('<path d="M31 56Q50 49 69 56L67 78Q50 84 33 78Z"/>', S.Y, S.YD) +
    '<path d="M38 60L50 71L62 60L62 65L50 76L38 65Z" fill="' + S.K + '" stroke="' + S.KD + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="M36 58Q42 56 46 57" fill="none" stroke="' + S.YL + '" stroke-width="2" stroke-linecap="round"/>' +
    outlined('<path d="M35 77Q50 82 65 77L64 84Q50 89 36 84Z"/>', S.K, S.KD, 2) +
    outlined('<path d="M37 83Q50 87 63 83L60 91Q50 94 40 91Z"/>', S.Y, S.YD, 2) +
    /* black round shoulder guards */
    outlined('<path d="M19 54Q20 44 32 46L35 58Q26 61 20 59Z"/><path d="M81 54Q80 44 68 46L65 58Q74 61 80 59Z"/>', S.K, S.KD, 2.4) +
    '<path d="M22 51Q25 47 31 48M78 51Q75 47 69 48" fill="none" stroke="' + S.KL + '" stroke-width="2" stroke-linecap="round"/>' +
    /* knight helmet: yellow dome, black crest, black visor with white eye slits */
    outlined('<path d="M47 14Q50 4 53 14L53 24H47Z"/>', S.K, S.KD, 2) +
    outlined('<path d="M50 13C63 13 70 23 70 35L69 47Q65 54 58 55L42 55Q35 54 31 47L30 35C30 23 37 13 50 13Z"/>', S.Y, S.YD) +
    '<path d="M36 20Q42 16 48 15.5" fill="none" stroke="' + S.YL + '" stroke-width="2.6" stroke-linecap="round"/>' +
    /* two curved yellow horns on the sides of the helmet */
    outlined('<path d="M33 27Q22 22 20 6Q28 14 37 20Z"/><path d="M67 27Q78 22 80 6Q72 14 63 20Z"/>', S.Y, S.YD, 2.2) +
    '<path d="M24 12Q27 19 33 22M76 12Q73 19 67 22" fill="none" stroke="' + S.YL + '" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M32 33Q50 27 68 33L67 43Q60 40 50 41Q40 40 33 43Z" fill="' + S.K + '" stroke="' + S.KD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M36 36.5L45 38.5L44 40.5Q39 40.5 36 38.8Z M64 36.5L55 38.5L56 40.5Q61 40.5 64 38.8Z" fill="#fff"/>' +
    '<path d="M50 41V53" stroke="' + S.YD + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M42 48H47M53 48H58M43 51H47M53 51H57" stroke="' + S.K + '" stroke-width="1.6" stroke-linecap="round"/>');
}
function snBack(c){
  var S = SN;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + S.KD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + S.K + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="' + (x1 + (x2 - x1) * 0.4) + '" cy="89.5" r="3.4" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="1.4"/>' +
      '<path d="M' + (fx - 8) + ' 104L' + (fx - 7) + ' 94H' + (fx + 6) + 'L' + (fx + 7) + ' 98Q' + (fx + 12) + ' 100 ' + (fx + 12) + ' 104Z" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 7) + ' 98H' + (fx + 6) + '" stroke="' + S.K + '" stroke-width="2.2" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.YD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.Y + '" stroke-width="6.4" stroke-linecap="round"/>';
  }
  /* wings: one big silver blade on each side, hanging down behind him from the shoulders */
  function wing(m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    return '<path d="M' + X(36) + ' 47Q' + X(16) + ' 52 ' + X(8) + ' 70Q' + X(4) + ' 82 ' + X(10) + ' 96Q' + X(16) + ' 80 ' + X(24) + ' 70Q' + X(31) + ' 62 ' + X(36) + ' 60Z" fill="' + S.W + '" stroke="' + S.WD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + X(32) + ' 50Q' + X(16) + ' 57 ' + X(10) + ' 74Q' + X(8) + ' 83 ' + X(10) + ' 91" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".85"/>' +
      '<path d="M' + X(33) + ' 57Q' + X(24) + ' 63 ' + X(18) + ' 74" fill="none" stroke="' + S.WD + '" stroke-width="1.1" stroke-linecap="round" stroke-opacity=".5"/>' +
      '<path d="M' + X(37) + ' 46L' + X(29) + ' 46L' + X(27) + ' 61L' + X(37) + ' 61Z" fill="' + S.K + '" stroke="' + S.KD + '" stroke-width="1.8" stroke-linejoin="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wing(-1) + wing(1) + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(30, 60, 17, 67) + snClaw(12, 72, -1) + '</g></g>' +
    '<g><g class="pump pR">' + arm(70, 60, 82, 64) + '</g></g></svg>';
}
function snFront(c){
  /* the front gauntlet and its blade sit in the weapon group so they slash when he hits */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + snClaw(88, 66, 1) + '</g></g></g></g></svg>';
}
