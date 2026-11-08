/* Mech dragon (no name yet): the owner's own drawing of a green dinosaur-dragon in blue-and-gold mech gear: a blue helmet with
   a gold crest and gold bolts, a toothy jaw, mech wings, orange clawed hands and feet (Tech, melee, Normal). (preview only) */
var MD = { G: '#4fae3a', GD: '#1f5a14', GL: '#a8dc6a', B: '#2f62d8', BD: '#122c72', BL: '#5f8cf0', Y: '#f2b81e', YD: '#7a5400', O: '#e07a1e', OD: '#7a3a08', K: '#2a2830' };
function mdBolt(cx, cy, r){
  var M = MD;
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + M.B + '" stroke="' + M.BD + '" stroke-width="1.8"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.62) + '" fill="' + M.Y + '" stroke="' + M.YD + '" stroke-width="1.3"/>' +
    '<path d="M' + (cx - r * 0.32) + ' ' + (cy + r * 0.28) + 'L' + (cx + r * 0.32) + ' ' + (cy - r * 0.28) + '" stroke="' + M.YD + '" stroke-width="1.3" stroke-linecap="round"/>';
}
function mdClaws(x, y, m){      /* an orange hand with three black claws; m = 1 claws point right, -1 left */
  var M = MD; function X(v){ return x + v * m; }
  return '<path d="M' + X(-5) + ' ' + (y - 4) + 'Q' + X(4) + ' ' + (y - 7) + ' ' + X(6) + ' ' + (y - 1) + 'Q' + X(6) + ' ' + (y + 4) + ' ' + X(0) + ' ' + (y + 5) + 'Q' + X(-6) + ' ' + (y + 4) + ' ' + X(-5) + ' ' + (y - 4) + 'Z" fill="' + M.O + '" stroke="' + M.OD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M' + X(4) + ' ' + (y - 4) + 'L' + X(10) + ' ' + (y - 6) + 'L' + X(6) + ' ' + (y - 1) + 'Z M' + X(5) + ' ' + (y + 1) + 'L' + X(11) + ' ' + (y + 1) + 'L' + X(5.5) + ' ' + (y + 4) + 'Z M' + X(1) + ' ' + (y + 4) + 'L' + X(4) + ' ' + (y + 9) + 'L' + X(-1) + ' ' + (y + 5) + 'Z" fill="' + M.K + '" stroke="#0e0d12" stroke-width="1" stroke-linejoin="round"/>';
}
function mdArt(){
  var M = MD, O = '#120f10';
  return wrapSvg(
    /* green body with a pale, plated belly */
    outlined('<path d="M36 62Q50 56 64 62Q68 76 62 89Q50 94 38 89Q32 76 36 62Z"/>', M.G, M.GD) +
    '<path d="M43 64Q50 61 57 64Q60 76 56 87Q50 89 44 87Q40 76 43 64Z" fill="' + M.GL + '"/>' +
    '<path d="M42.5 70Q50 72 57.5 70M42 76Q50 78 58 76M43 82Q50 84 57 82" fill="none" stroke="#6fb84a" stroke-width="1.4" stroke-linecap="round"/>' +
    /* neck */
    outlined('<path d="M43 52L57 52L59 65Q50 68 41 65Z"/>', M.G, M.GD, 2.4) +
    /* head: green snout under the helmet */
    outlined('<path d="M50 20C63 20 71 29 71 40C71 50 64 58 50 58C36 58 29 50 29 40C29 29 37 20 50 20Z"/>', M.G, M.GD) +
    /* open mouth with teeth, and a blue lower jaw plate */
    '<path d="M36 44Q50 41 64 44L62 54Q50 58 38 54Z" fill="#3a1618" stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M38 44.6L40 48.6L42 44.2M45 43.6L47 48L49 43.4M51 43.4L53 48L55 43.6M58 44.2L60 48.6L62 44.6" fill="#fff" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M41 54L43 50.5L45 54.6M55 54.6L57 50.5L59 54" fill="#fff" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>' +
    outlined('<path d="M35 53Q50 59 65 53L63 61Q50 66 37 61Z"/>', M.B, M.BD, 2.2) +
    '<path d="M39 56.5Q50 60.5 61 56.5" fill="none" stroke="' + M.BL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    /* blue mech helmet with a gold crest and gold bolts at the sides */
    outlined('<path d="M47 18Q55 4 70 6Q60 10 56 20Z"/>', M.Y, M.YD, 2) +
    outlined('<path d="M26 40C25 24 36 13 50 13C64 13 75 24 74 40L66 37Q50 32 34 37Z"/>', M.B, M.BD) +
    '<path d="M29 38Q50 30 71 38" fill="none" stroke="' + M.Y + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M36 19Q43 15 50 15" fill="none" stroke="' + M.BL + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M44 16V24M56 16V24" stroke="' + M.BD + '" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".6"/>' +
    mdBolt(26, 40, 6.4) + mdBolt(74, 40, 6.4) +
    /* eyes peeking under the helmet rim */
    '<path d="M37 38.5Q41 36.5 45 38.5L44 41Q41 42 38 41Z" fill="#ffe14a" stroke="' + O + '" stroke-width="1.4" stroke-linejoin="round"/><circle cx="41.4" cy="39.6" r="1.3" fill="' + O + '"/>' +
    '<path d="M63 38.5Q59 36.5 55 38.5L56 41Q59 42 62 41Z" fill="#ffe14a" stroke="' + O + '" stroke-width="1.4" stroke-linejoin="round"/><circle cx="58.6" cy="39.6" r="1.3" fill="' + O + '"/>');
}
function mdBack(c){
  var M = MD;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + M.GD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + M.G + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 7.5) + ' 102Q' + (fx - 7.5) + ' 94 ' + fx + ' 94Q' + (fx + 7.5) + ' 94 ' + (fx + 7.5) + ' 102Z" fill="' + M.O + '" stroke="' + M.OD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 6) + ' 101L' + (fx - 7.5) + ' 106L' + (fx - 3) + ' 102Z M' + (fx - 1.5) + ' 102L' + fx + ' 107L' + (fx + 1.5) + ' 102Z M' + (fx + 3) + ' 102L' + (fx + 7.5) + ' 106L' + (fx + 6) + ' 101Z" fill="' + M.K + '" stroke="#0e0d12" stroke-width=".9" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.GD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.G + '" stroke-width="5" stroke-linecap="round"/>';
  }
  /* mech wings: gold frame, blue panels, a gold bolt at each shoulder */
  function wing(m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    return '<path d="M' + X(38) + ' 60L' + X(14) + ' 34L' + X(-2) + ' 26L' + X(6) + ' 40L' + X(2) + ' 52L' + X(14) + ' 50L' + X(16) + ' 60L' + X(26) + ' 58L' + X(30) + ' 66Z" fill="' + M.B + '" stroke="' + M.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + X(38) + ' 60L' + X(14) + ' 34L' + X(-2) + ' 26M' + X(14) + ' 34L' + X(9) + ' 49M' + X(24) + ' 46L' + X(21) + ' 58" fill="none" stroke="' + M.YD + '" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M' + X(38) + ' 60L' + X(14) + ' 34L' + X(-2) + ' 26M' + X(14) + ' 34L' + X(9) + ' 49M' + X(24) + ' 46L' + X(21) + ' 58" fill="none" stroke="' + M.Y + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M' + X(8) + ' 38L' + X(12) + ' 44" stroke="' + M.BL + '" stroke-width="1.6" stroke-linecap="round"/>' +
      mdBolt(+X(36), 60, 5);
  }
  /* green tail out to the left */
  var tail = '<path d="M38 86Q24 96 10 90Q20 92 28 84Z" fill="' + M.G + '" stroke="' + M.GD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M30 88Q22 92 15 90.5" fill="none" stroke="' + M.GL + '" stroke-width="1.6" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wing(-1) + wing(1) + tail + leg('lgL', 43, 40, 37) + leg('lgR', 57, 60, 63) +
    '<g><g class="pump pL">' + arm(37, 66, 20, 71) + mdClaws(17, 73, -1) + '</g></g>' +
    '<g><g class="pump pR">' + arm(63, 66, 82, 66) + '</g></g></svg>';
}
function mdFront(c){
  /* the front claw sits in the weapon group so it swipes when he attacks */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + mdClaws(88, 66, 1) + '</g></g></g></g></svg>';
}
