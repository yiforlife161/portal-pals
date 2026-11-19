/* Tuskmouth (preview, key 'tm'): the owner's drawing: a round blue critter that is nearly all mouth: a ball-shaped head-body,
   big black eyes in bright green rings, two little nostrils, a huge open jaw (dark purple inside, red tongue) with two big ivory
   tusks curving up from the corners of the lower jaw, a light blue belly, yellow spikes down his back, skinny arms with
   three-fingered hands and short legs on three-toed feet. Faces right like every pal, so the back spikes are on the left. */
var TM = { B: '#1e9ff0', BD: '#0b2a4a', BL: '#6cc6ff', BM: '#1580d0', P: '#34ccff', E: '#7ed63a', ED: '#2a5a10', K: '#111018',
  M: '#2e1450', T: '#ee2a3a', TD: '#7a0c1a', I: '#fbf6ea', ID: '#3a3020', Y: '#ffcc2a', YD: '#7a5000' };
function tmP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"/>';
}
/* a stroke drawn twice: dark outline, then the fill colour on top */
function tmLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a three-fingered hand at (x, y); m = 1 fingers to the right */
function tmHand(x, y, m){
  var Z = TM; function X(v){ return x + v * m; }
  return tmP('M' + X(-4) + ' ' + (y - 3) + 'Q' + X(1) + ' ' + (y - 5) + ' ' + X(3) + ' ' + (y - 7) + 'Q' + X(6) + ' ' + (y - 8.4) + ' ' + X(6.4) + ' ' + (y - 5.4) + 'Q' + X(5) + ' ' + (y - 3) + ' ' + X(5) + ' ' + (y - 2) +
    'L' + X(9) + ' ' + (y - 2.4) + 'Q' + X(11) + ' ' + y + ' ' + X(9) + ' ' + (y + 1.8) + 'L' + X(5) + ' ' + (y + 1.6) + 'Q' + X(6.4) + ' ' + (y + 4) + ' ' + X(5) + ' ' + (y + 6) + 'Q' + X(2.6) + ' ' + (y + 6.6) + ' ' + X(1) + ' ' + (y + 3) +
    'Q' + X(-2) + ' ' + (y + 4) + ' ' + X(-4) + ' ' + (y + 3) + 'Z', Z.B, Z.BD, 1.7);
}
function tmArt(){
  var Z = TM;
  return wrapSvg(
    /* yellow spikes down his back, behind the body */
    tmP('M24 26L13 21L20 34Z', Z.Y, Z.YD, 1.6) + tmP('M19 40L7 39L17 51Z', Z.Y, Z.YD, 1.6) + tmP('M18 56L6 58L18 66Z', Z.Y, Z.YD, 1.6) + tmP('M21 70L12 76L25 79Z', Z.Y, Z.YD, 1.6) +
    /* the round head-body */
    tmP('M50 10Q82 10 83 44Q84 70 75 80Q65 89 50 89Q35 89 25 80Q16 70 17 44Q18 10 50 10Z', Z.B, Z.BD, 2.3) +
    '<path d="M25 28Q29 16 42 13" fill="none" stroke="' + Z.BL + '" stroke-width="2.2" stroke-linecap="round"/>' +
    /* light blue belly below the jaw */
    tmP('M36 69Q50 66 64 69Q62 82 50 86Q38 82 36 69Z', Z.P, Z.BM, 1.2) +
    /* big eyes in green rings */
    '<circle cx="37" cy="26" r="8.2" fill="' + Z.E + '" stroke="' + Z.ED + '" stroke-width="1.4"/><circle cx="63" cy="26" r="8.2" fill="' + Z.E + '" stroke="' + Z.ED + '" stroke-width="1.4"/>' +
    '<circle cx="37.4" cy="26.4" r="5.6" fill="' + Z.K + '"/><circle cx="62.6" cy="26.4" r="5.6" fill="' + Z.K + '"/>' +
    '<circle cx="39.2" cy="24.2" r="1.5" fill="#fff"/><circle cx="64.4" cy="24.2" r="1.5" fill="#fff"/>' +
    '<ellipse cx="47.4" cy="33.6" rx="1" ry=".8" fill="' + Z.BD + '"/><ellipse cx="52.6" cy="33.6" rx="1" ry=".8" fill="' + Z.BD + '"/>' +
    /* the huge open mouth: dark inside, a red tongue */
    tmP('M21 42Q36 43 43 39Q50 36 57 39Q64 43 79 42Q78 54 72 58H28Q22 54 21 42Z', Z.M, Z.BD, 2) +
    tmP('M32 58Q35 47 50 46.6Q65 47 68 58Z', Z.T, Z.TD, 1.4) +
    '<path d="M42 50Q50 47.6 58 50" fill="none" stroke="#ff6a74" stroke-width="1.2" stroke-linecap="round"/>' +
    /* the lower jaw: a blue lip curving under the mouth */
    tmP('M19 52Q36 60 50 60Q64 60 81 52Q80 63 75 67Q63 71 50 71Q37 71 25 67Q20 63 19 52Z', Z.B, Z.BD, 2) +
    '<path d="M25 65Q50 72 75 65" fill="none" stroke="' + Z.BM + '" stroke-width="1.4" stroke-linecap="round"/>' +
    /* two big ivory tusks curving up from the corners of the jaw */
    tmP('M22 57Q15 46 18 32Q20 30 21.6 32L33 58Z', Z.I, Z.ID, 1.8) + tmP('M78 57Q85 46 82 32Q80 30 78.4 32L67 58Z', Z.I, Z.ID, 1.8) +
    '<path d="M19.4 35Q19 44 22.4 51M80.6 35Q81 44 77.6 51" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>');
}
function tmBack(c){
  var Z = TM;
  /* short legs on three-toed feet */
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '">' + tmLine('M' + x1 + ' 80L' + x2 + ' 95', 5.6, Z.B, Z.BD) +
      tmP('M' + (fx - 8) + ' 103Q' + (fx - 7) + ' 96 ' + fx + ' 95Q' + (fx + 7) + ' 96 ' + (fx + 8.4) + ' 103L' + (fx + 4) + ' 102L' + (fx + 1.6) + ' 104L' + (fx - 1.6) + ' 102L' + (fx - 4) + ' 104Z', Z.B, Z.BD, 1.8) + '</g>';
  }
  /* skinny arms reaching out; the back one ends in an open hand, the front one's hand is in the front layer */
  var back = tmLine('M24 62L14 64', 4, Z.B, Z.BD) + tmHand(11, 64.6, -1);
  var front = tmLine('M76 62L83 63', 4, Z.B, Z.BD);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 43, 41, 38) + leg('lgR', 57, 59, 62) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function tmFront(c){
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + tmHand(86, 64, 1) + '</g></g></g></svg>';
}
