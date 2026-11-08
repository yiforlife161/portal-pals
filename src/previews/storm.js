/* Nimbus (placeholder name): an original purple storm dragon pal (preview only).
   Round snout, cloud puffs for hair, small cloud wings, a lightning-bolt tail, and a little thundercloud he throws (Air, ranged). */
var STORM = { P: '#7b4fd0', PD: '#3a2470', PL: '#c9b4f2', C: '#f2f5ff', CD: '#5a6488', CB: '#b9c6ea', Y: '#ffd23a', YD: '#8a5a00' };
function stormPuff(cx, cy, r){ return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
function stormArt(){
  var S = STORM, O = '#1e1636';
  return wrapSvg(
    /* round body with a pale belly and a lightning mark */
    outlined('<path d="M32 66Q50 56 68 66Q74 80 66 90Q50 96 34 90Q26 80 32 66Z"/>', S.P, S.PD) +
    '<path d="M40 70Q50 66 60 70Q63 80 58 88Q50 91 42 88Q37 80 40 70Z" fill="' + S.PL + '"/>' +
    '<path d="M41 75Q50 77 59 75M40 81Q50 83 60 81M42 87Q50 88.5 58 87" fill="none" stroke="#a88fdc" stroke-width="1.3"/>' +
    '<path d="M52 71L46 80H51L47 88L56 77H51L54 71Z" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    /* two short curved horns */
    outlined('<path d="M33 27Q24 18 24 6Q31 14 40 22Z"/><path d="M67 27Q76 18 76 6Q69 14 60 22Z"/>', '#4a2d8f', '#24154a', 2.2) +
    '<path d="M27 12Q29 18 33 21M73 12Q71 18 67 21" fill="none" stroke="#8f6fe0" stroke-width="1.5" stroke-linecap="round"/>' +
    /* cloud puffs on top of the head, like hair */
    outlined(stormPuff(38, 18, 7) + stormPuff(50, 13, 8.5) + stormPuff(62, 18, 7) + stormPuff(44, 22, 6) + stormPuff(56, 22, 6), S.C, S.CD, 2.2) +
    /* head: wide and round */
    outlined('<path d="M50 19C68 19 79 30 79 44C79 56 68 64 50 64C32 64 21 56 21 44C21 30 32 19 50 19Z"/>', S.P, S.PD) +
    '<path d="M30 28Q38 22 48 22" fill="none" stroke="#a585ea" stroke-width="3" stroke-linecap="round" stroke-opacity=".8"/>' +
    /* pointed fin ears */
    outlined('<path d="M23 34L5 30L13 38L4 44L22 46Z"/><path d="M77 34L95 30L87 38L96 44L78 46Z"/>', S.PL, S.PD, 2.2) +
    '<path d="M21 38L11 37M79 38L89 37" stroke="#a585ea" stroke-width="1.4" stroke-linecap="round"/>' +
    /* big round snout */
    outlined('<ellipse cx="50" cy="53" rx="15" ry="9.5"/>', S.PL, S.PD, 2.4) +
    '<path d="M44 49.5L46.5 51.5M56 49.5L53.5 51.5" stroke="' + S.PD + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M39 56Q50 59 61 55" fill="none" stroke="' + S.PD + '" stroke-width="1.9" stroke-linecap="round"/>' +
    '<path d="M55.5 56.6L57 60.5L58.6 56Z" fill="#fff" stroke="' + S.PD + '" stroke-width="1" stroke-linejoin="round"/>' +
    /* yellow storm eyes */
    '<ellipse cx="39" cy="40" rx="6.4" ry="7" fill="' + S.Y + '" stroke="' + O + '" stroke-width="2"/><ellipse cx="40" cy="41" rx="2.6" ry="4" fill="' + O + '"/><circle cx="41.4" cy="38.6" r="1.3" fill="#fff"/>' +
    '<ellipse cx="61" cy="40" rx="6.4" ry="7" fill="' + S.Y + '" stroke="' + O + '" stroke-width="2"/><ellipse cx="60" cy="41" rx="2.6" ry="4" fill="' + O + '"/><circle cx="61.4" cy="38.6" r="1.3" fill="#fff"/>' +
    '<path d="M32 31.5Q38 30 44 33M68 31.5Q62 30 56 33" fill="none" stroke="' + S.PD + '" stroke-width="2.6" stroke-linecap="round"/>');
}
function stormBack(c){
  var S = STORM;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 96" stroke="' + S.PD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 96" stroke="' + S.P + '" stroke-width="6.6" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 8) + ' 103Q' + (fx - 8) + ' 95 ' + fx + ' 95Q' + (fx + 8) + ' 95 ' + (fx + 8) + ' 103Z" fill="' + S.P + '" stroke="' + S.PD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 4.5) + ' 103V100.5M' + fx + ' 103V100M' + (fx + 4.5) + ' 103V100.5" stroke="' + S.C + '" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.PD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + S.P + '" stroke-width="5.8" stroke-linecap="round"/>';
  }
  /* small cloud wings behind the shoulders */
  function wing(m){      /* m = 1 right, -1 left */
    function X(x){ return 50 + (x - 50) * m; }
    var bone = 'M' + X(36) + ' 66Q' + X(18) + ' 50 ' + X(-2) + ' 40';
    return '<path d="' + bone + 'Q' + X(4) + ' 50 ' + X(0) + ' 58Q' + X(10) + ' 56 ' + X(12) + ' 64Q' + X(20) + ' 61 ' + X(24) + ' 68Q' + X(30) + ' 65 ' + X(36) + ' 66Z" fill="' + S.CB + '" stroke="' + S.CD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="' + bone + '" fill="none" stroke="' + S.PD + '" stroke-width="5.4" stroke-linecap="round"/>' +
      '<path d="' + bone + '" fill="none" stroke="' + S.P + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M' + X(10) + ' 46L' + X(5) + ' 55M' + X(19) + ' 53L' + X(15) + ' 61" stroke="' + S.CD + '" stroke-width="1.6" stroke-linecap="round"/>' +
      outlined(stormPuff(X(-2), 39, 4.8) + stormPuff(X(3), 36, 3.6), S.C, S.CD, 1.8);
  }
  var wings = wing(-1) + wing(1);
  /* tail sweeping out to the left, ending in a lightning bolt */
  var tail = '<path d="M36 88Q22 96 13 88" fill="none" stroke="' + S.PD + '" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M36 88Q22 96 13 88" fill="none" stroke="' + S.P + '" stroke-width="5.8" stroke-linecap="round"/>' +
    '<path d="M14 89L3 78L9 77L2 66L16 79L10 80Z" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="1.8" stroke-linejoin="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wings + tail + leg('lgL', 41, 39, 36) + leg('lgR', 59, 61, 64) +
    '<g><g class="pump pL">' + arm(33, 70, 20, 73) + '<circle cx="19" cy="73.5" r="4.6" fill="' + S.P + '" stroke="' + S.PD + '" stroke-width="2"/></g></g>' +
    '<g><g class="pump pR">' + arm(67, 69, 82, 66) + '</g></g></svg>';
}
function stormFront(c){
  var S = STORM;
  /* a little thundercloud floating over his hand, sparking; it sits in the weapon group so it jolts when he attacks */
  var cloud = '<g transform="rotate(-18 86 64)">' +
    outlined(stormPuff(88, 50, 6) + stormPuff(96, 49, 7) + stormPuff(103, 52, 5.5) + stormPuff(92, 55, 5.5) + stormPuff(100, 56, 5), '#8a93b8', '#3a4266', 2) +
    '<path d="M91 48Q95 45 99 47" fill="none" stroke="#d6dcf2" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M97 58L93 64H97L94 70L101 62H97L99 58Z" fill="' + S.Y + '" stroke="' + S.YD + '" stroke-width="1.2" stroke-linejoin="round"/></g>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + cloud + '<circle cx="84" cy="65.5" r="4.8" fill="' + S.P + '" stroke="' + S.PD + '" stroke-width="2"/></g></g></g></svg>';
}
