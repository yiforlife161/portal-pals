/* Gem dragon (Gem Dragon): the owner's own drawing: a small blue dragon with big swept-back ear-horns with pale fluff, a pink gem
   on his forehead, teal eyes with a stern look, a pale belly, dark blue feathered wings spread wide and a feathered tail, white claws.
   He shoots a little rainbow he holds over his claw (Air, ranged, Normal). */
var GM = { B: '#6f8fe0', BD: '#1c2a6a', BL: '#a9bff2', W: '#2f4ea8', WD: '#121e52', WL: '#4f6fc6', P: '#eef2ff', PD: '#8a9acc', G: '#ff4fb0', GD: '#7a1050', GL: '#ffc4e6', E: '#2ec4d6' };
function gmArt(){
  var G = GM, O = '#0c1030';
  return wrapSvg(
    /* body with a pale belly */
    outlined('<path d="M37 62Q50 56 63 62Q67 76 61 89Q50 94 39 89Q33 76 37 62Z"/>', G.B, G.BD) +
    '<path d="M43.5 65Q50 62 56.5 65Q59 76 55.5 87Q50 89 44.5 87Q41 76 43.5 65Z" fill="' + G.P + '"/>' +
    '<path d="M43 71Q50 73 57 71M42.5 77Q50 79 57.5 77M43.5 83Q50 85 56.5 83" fill="none" stroke="' + G.PD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    outlined('<path d="M43.5 51L56.5 51L58 65Q50 68 42 65Z"/>', G.B, G.BD, 2.4) +
    /* big swept-back ear-horns with pale fluff */
    outlined('<path d="M35 32Q20 24 12 6Q30 12 42 24Z"/><path d="M65 32Q80 24 88 6Q70 12 58 24Z"/>', G.W, G.WD, 2) +
    '<path d="M33 27Q24 20 18 12M67 27Q76 20 82 12" fill="none" stroke="' + G.WL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    outlined('<path d="M33 34L22 30L28 36L20 38L30 40L26 44L34 42Z"/><path d="M67 34L78 30L72 36L80 38L70 40L74 44L66 42Z"/>', G.P, G.PD, 1.6) +
    /* round head */
    outlined('<path d="M50 18C63 18 71 27 71 38C71 48 63 55 50 55C37 55 29 48 29 38C29 27 37 18 50 18Z"/>', G.B, G.BD) +
    '<path d="M35 26Q41 21 47 21" fill="none" stroke="' + G.BL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* fluffy pale cheeks */
    outlined('<path d="M30 42L24 46L31 47L27 52L34 50Z"/><path d="M70 42L76 46L69 47L73 52L66 50Z"/>', G.P, G.PD, 1.4) +
    /* small snout */
    outlined('<path d="M50 42C56 42 60 45 60 49C60 53.5 55.5 56 50 56C44.5 56 40 53.5 40 49C40 45 44 42 50 42Z"/>', G.B, G.BD, 2.2) +
    '<path d="M46.5 47.6L48 48.6M53.5 47.6L52 48.6" stroke="' + G.BD + '" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M45 53Q50 54.6 55 53" fill="none" stroke="' + G.BD + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* the pink gem on his forehead */
    outlined('<path d="M50 19L55 26L50 33L45 26Z"/>', G.G, G.GD, 1.8) + '<path d="M50 19L51.8 26L50 33L48.2 26Z" fill="' + G.GL + '" fill-opacity=".7"/><circle cx="48.2" cy="23.8" r="1" fill="#fff"/>' +
    /* teal eyes with a stern brow */
    '<ellipse cx="41" cy="37" rx="5.4" ry="6" fill="#fff" stroke="' + O + '" stroke-width="1.7"/><ellipse cx="41.8" cy="37.6" rx="3.6" ry="4.4" fill="' + G.E + '"/><circle cx="42.2" cy="38" r="2.4" fill="' + O + '"/><circle cx="43.4" cy="35.6" r="1.2" fill="#fff"/>' +
    '<ellipse cx="59" cy="37" rx="5.4" ry="6" fill="#fff" stroke="' + O + '" stroke-width="1.7"/><ellipse cx="58.2" cy="37.6" rx="3.6" ry="4.4" fill="' + G.E + '"/><circle cx="57.8" cy="38" r="2.4" fill="' + O + '"/><circle cx="59" cy="35.6" r="1.2" fill="#fff"/>' +
    '<path d="M34.5 30L46.5 33.4M65.5 30L53.5 33.4" stroke="' + G.BD + '" stroke-width="2.6" stroke-linecap="round"/>');
}
function gmBack(c){
  var G = GM;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 85L' + x2 + ' 96" stroke="' + G.BD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 85L' + x2 + ' 96" stroke="' + G.B + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 7) + ' 103Q' + (fx - 7) + ' 95 ' + fx + ' 95Q' + (fx + 7) + ' 95 ' + (fx + 7) + ' 103Z" fill="' + G.B + '" stroke="' + G.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 4.5) + ' 103V100M' + fx + ' 103V99.5M' + (fx + 4.5) + ' 103V100" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + G.BD + '" stroke-width="8.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + G.B + '" stroke-width="4.6" stroke-linecap="round"/>';
  }
  /* dark blue feathered wings spread wide */
  function wing(m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    return '<path d="M' + X(38) + ' 62Q' + X(18) + ' 38 ' + X(-6) + ' 24Q' + X(-4) + ' 34 ' + X(-12) + ' 38Q' + X(-5) + ' 44 ' + X(-11) + ' 49Q' + X(-2) + ' 53 ' + X(-6) + ' 58Q' + X(4) + ' 61 ' + X(2) + ' 66Q' + X(12) + ' 66 ' + X(12) + ' 71Q' + X(22) + ' 69 ' + X(25) + ' 74Q' + X(32) + ' 67 ' + X(38) + ' 62Z" fill="' + G.W + '" stroke="' + G.WD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + X(30) + ' 60Q' + X(14) + ' 48 ' + X(-4) + ' 38M' + X(30) + ' 63Q' + X(14) + ' 57 ' + X(-2) + ' 51M' + X(31) + ' 65Q' + X(18) + ' 64 ' + X(6) + ' 62M' + X(32) + ' 67Q' + X(26) + ' 68 ' + X(18) + ' 69" fill="none" stroke="' + G.WL + '" stroke-width="1.6" stroke-linecap="round"/>';
  }
  /* feathered tail out to the left */
  var tp = 'M39 88Q27 95 17 90';
  var tail = '<path d="' + tp + '" fill="none" stroke="' + G.BD + '" stroke-width="8.4" stroke-linecap="round"/><path d="' + tp + '" fill="none" stroke="' + G.B + '" stroke-width="4.6" stroke-linecap="round"/>' +
    '<path d="M19 91Q8 92 2 84Q8 84 8 80Q3 76 4 70Q11 74 14 72Q14 78 22 86Z" fill="' + G.W + '" stroke="' + G.WD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M18 88Q10 84 6 76M17 89Q10 89 5 84" fill="none" stroke="' + G.WL + '" stroke-width="1.4" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wing(-1) + wing(1) + tail + leg('lgL', 43, 41, 38) + leg('lgR', 57, 59, 62) +
    '<g><g class="pump pL">' + arm(38, 69, 21, 73) + '<circle cx="19" cy="73.5" r="4.4" fill="' + G.B + '" stroke="' + G.BD + '" stroke-width="1.8"/><path d="M15.5 76.5L14.5 78.5M19 77.5V79.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g></g>' +
    '<g><g class="pump pR">' + arm(62, 69, 81, 66) + '</g></g></svg>';
}
function gmRainbow(cx, cy, s){      /* a little rainbow: seven bands and two small clouds at its feet */
  var cols = ['#ff4a4a', '#ff9a2e', '#ffd84a', '#5ad86a', '#3ab0ff', '#5a6aff', '#b45aff'], out = '<circle cx="' + cx + '" cy="' + (cy - 2 * s) + '" r="' + (12 * s) + '" fill="#fff" fill-opacity=".25"/>';
  out += '<path d="M' + (cx - 11 * s) + ' ' + cy + 'A' + (11 * s) + ' ' + (11 * s) + ' 0 0 1 ' + (cx + 11 * s) + ' ' + cy + '" fill="none" stroke="#1c2a6a" stroke-width="' + (9 * s) + '" stroke-linecap="round"/>';
  cols.forEach(function(c, i){ var r = (10 - i * 1.15) * s; out += '<path d="M' + (cx - r).toFixed(1) + ' ' + cy + 'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + (cx + r).toFixed(1) + ' ' + cy + '" fill="none" stroke="' + c + '" stroke-width="' + (1.25 * s).toFixed(2) + '"/>'; });
  function cloud(x){ return '<path d="M' + (x - 5 * s) + ' ' + (cy + 2.5 * s) + 'a' + (2.6 * s) + ' ' + (2.6 * s) + ' 0 0 1 ' + (2.4 * s) + ' ' + (-3.4 * s) + 'a' + (3 * s) + ' ' + (3 * s) + ' 0 0 1 ' + (5.2 * s) + ' ' + (0.4 * s) + 'a' + (2.4 * s) + ' ' + (2.4 * s) + ' 0 0 1 ' + (2.4 * s) + ' ' + (3 * s) + 'Z" fill="#fff" stroke="#1c2a6a" stroke-width="1.3" stroke-linejoin="round"/>'; }
  return out + cloud(cx - 10 * s) + cloud(cx + 10 * s) + '<path d="M' + (cx + 13 * s) + ' ' + (cy - 12 * s) + 'l' + s + ' ' + (-2 * s) + 'l' + s + ' ' + (2 * s) + 'l' + (-s) + ' ' + (2 * s) + 'Z" fill="#fff"/>';
}
function gmFront(c){
  /* a little rainbow floating over his claw; it sits in the weapon group so it jolts when he shoots */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + gmRainbow(95, 54, 1.15) + '</g>' +
    '<circle cx="84" cy="65.5" r="4.4" fill="' + GM.B + '" stroke="' + GM.BD + '" stroke-width="1.8"/><path d="M86.5 69L87.5 71M83.5 70V72" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g></g></g></svg>';
}
