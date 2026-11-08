/* Rock golem (no name yet): the owner's own rock warrior: a body of stone blocks, a heavy brow with glowing orange eyes, a wide
   jagged grin, a green crystal glowing in his chest, small crystals at the knees, and big rock fists holding green crystals he
   throws (Earth, ranged). (preview only) */
var GO = { S: '#bdb39a', SD: '#3e382c', SL: '#d8d0b8', SM: '#9a917a', C: '#3fd06a', CD: '#0e5a24', CL: '#b8ffcc', E: '#ffb21e' };
function goStones(list){      /* rounded stone blocks: [x, y, w, h] */
  var G = GO;
  return list.map(function(b){ return '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" rx="' + Math.min(b[2], b[3]) * 0.48 + '" fill="' + G.S + '" stroke="' + G.SD + '" stroke-width="1.8"/>' +
    '<path d="M' + (b[0] + 2) + ' ' + (b[1] + 2.2) + 'H' + (b[0] + b[2] * 0.6) + '" stroke="' + G.SL + '" stroke-width="1.3" stroke-linecap="round"/>'; }).join('');
}
function goCrystal(cx, cy, s, glow){      /* a green crystal pointing up */
  var G = GO; function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return (glow ? '<circle cx="' + cx + '" cy="' + (cy - 3 * s) + '" r="' + (9 * s) + '" fill="' + G.C + '" fill-opacity=".25"/>' : '') +
    '<path d="M' + P(-4, 4) + 'L' + P(-4, -6) + 'L' + P(0, -12) + 'L' + P(4, -6) + 'L' + P(4, 4) + 'Z" fill="' + G.C + '" stroke="' + G.CD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M' + P(0, -12) + 'L' + P(0, 4) + 'M' + P(-4, -6) + 'L' + P(0, -4) + 'L' + P(4, -6) + '" fill="none" stroke="' + G.CD + '" stroke-width=".9" stroke-opacity=".6"/>' +
    '<path d="M' + P(-2.4, -5.6) + 'L' + P(-2.4, 2) + '" stroke="' + G.CL + '" stroke-width="' + (1.2 * s).toFixed(1) + '" stroke-linecap="round"/>';
}
function goFist(x, y, m){      /* a big round rock fist with knuckle stones; m = 1 knuckles right, -1 left */
  var G = GO; function X(v){ return x + v * m; }
  return '<path d="M' + X(-10) + ' ' + y + 'Q' + X(-10) + ' ' + (y - 10) + ' ' + X(0) + ' ' + (y - 10) + 'Q' + X(11) + ' ' + (y - 10) + ' ' + X(11) + ' ' + y + 'Q' + X(11) + ' ' + (y + 10) + ' ' + X(0) + ' ' + (y + 10) + 'Q' + X(-10) + ' ' + (y + 10) + ' ' + X(-10) + ' ' + y + 'Z" fill="' + G.S + '" stroke="' + G.SD + '" stroke-width="2.2"/>' +
    '<path d="M' + X(-3) + ' ' + (y - 9.5) + 'Q' + X(-1) + ' ' + y + ' ' + X(-3) + ' ' + (y + 9.5) + 'M' + X(3.5) + ' ' + (y - 9.5) + 'Q' + X(5.5) + ' ' + y + ' ' + X(3.5) + ' ' + (y + 9.5) + 'M' + X(-10) + ' ' + (y + 1) + 'Q' + X(-4) + ' ' + (y + 4) + ' ' + X(2) + ' ' + (y + 2) + '" fill="none" stroke="' + G.SD + '" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M' + X(-6) + ' ' + (y - 7.5) + 'Q' + X(-2) + ' ' + (y - 9) + ' ' + X(2) + ' ' + (y - 8.5) + '" fill="none" stroke="' + G.SL + '" stroke-width="1.4" stroke-linecap="round"/>';
}
function goArt(){
  var G = GO, O = '#16120c';
  return wrapSvg(
    /* stone body with a glowing chest crystal */
    goStones([[33, 58, 14, 12], [47, 57, 20, 11], [31, 69, 12, 12], [43, 68, 15, 10], [58, 67, 11, 13], [35, 80, 13, 10], [48, 78, 17, 11]]) +
    goCrystal(50, 74, 0.85, true) +
    /* stone shoulders */
    goStones([[22, 52, 14, 11], [64, 52, 14, 11]]) +
    /* rock head: blocky, a heavy brow, glowing orange eyes, a wide jagged grin */
    '<path d="M50 14C64 14 71 24 71 37C71 50 63 57 50 57C37 57 29 50 29 37C29 24 36 14 50 14Z" fill="' + G.S + '" stroke="' + G.SD + '" stroke-width="2.4"/>' +
    '<path d="M36 22Q42 17 49 16.5" fill="none" stroke="' + G.SL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M30 42Q34 44 36 50M70 42Q66 44 64 50M44 16Q46 22 44 27M57 16Q55 22 57 27" fill="none" stroke="' + G.SD + '" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M33 32L49 37L51 37L67 32L66 27Q50 31 34 27Z" fill="' + G.SM + '" stroke="' + G.SD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M38 35.5Q42 34.5 46.5 37Q44 40.5 40 39.8Q37.5 38.6 38 35.5Z M62 35.5Q58 34.5 53.5 37Q56 40.5 60 39.8Q62.5 38.6 62 35.5Z" fill="' + G.E + '" stroke="' + O + '" stroke-width="1.3"/>' +
    '<circle cx="42.4" cy="37.4" r="1.2" fill="#fff3b0"/><circle cx="57.6" cy="37.4" r="1.2" fill="#fff3b0"/>' +
    '<path d="M36 44Q50 41 64 44L62 52Q50 56 38 52Z" fill="#2a1a10" stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M37 44.4L39.5 48L41.5 43.6L44 48L46.5 43L49 48L51.5 43L54 48L56.5 43.6L59 48L61 44L63 44.4" fill="#f2ead2" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M40 52.4L42 49.4L44 53.4L46.5 49.8L49 54L51.5 49.8L54 53.4L56 49.4L58.5 52.6" fill="#f2ead2" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>');
}
function goBack(c){
  var G = GO;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + G.SD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + G.S + '" stroke-width="8" stroke-linecap="round"/>' +
      goCrystal(x1 + (x1 < 50 ? -4 : 4), 90, 0.5, false) +
      goStones([[fx - 9, 95, 18, 9]]) + '<path d="M' + (fx - 3) + ' 96V103M' + (fx + 3) + ' 96V103" stroke="' + G.SD + '" stroke-width="1.3" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + G.SD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + G.S + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + ((x1 + x2) / 2 - 2) + ' ' + ((y1 + y2) / 2 - 4) + 'L' + ((x1 + x2) / 2 + 2) + ' ' + ((y1 + y2) / 2 + 4) + '" stroke="' + G.SD + '" stroke-width="1.4" stroke-linecap="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(28, 60, 15, 66) + goCrystal(11, 58, 1.2, false) + goFist(12, 71, -1) + '</g></g>' +
    '<g><g class="pump pR">' + arm(72, 60, 83, 64) + '</g></g></svg>';
}
function goFront(c){
  /* the front fist holds up a green crystal, ready to throw; it sits in the weapon group so it jerks when he throws */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + goFist(88, 67, 1) + goCrystal(89, 55, 1.45, true) + '</g></g></g></g></svg>';
}
