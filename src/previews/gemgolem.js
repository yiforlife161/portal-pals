/* Emerald Warden (preview, key 'gw'): the owner's drawing: a cool grey stone golem made of cut, faceted stone plates (not
   round boulders like the Rock Golem), riveted iron bands on his forearms and shins, a crown of stone spikes with a glowing
   emerald on top, a visor-like stone face with two glowing blue eye slits, a big emerald set in his chest, and a heavy
   iron-banded stone warhammer with its own emerald. Faces right like every pal; the hammer is in his front hand. */
var GW = { S: '#a7abb2', SD: '#2c2f36', SL: '#cfd2d8', SM: '#8a8f98', I: '#6e747e', ID: '#24272d', IL: '#b6bcc6', R: '#d9dde4',
  C: '#5fe03a', CD: '#1e6a10', CL: '#d8ffb8', E: '#5ad8ff', EL: '#e6fbff', H: '#4a4e56', W: '#3a3530' };
/* a cut stone plate: a polygon with a light top edge */
function gwPlate(pts, fill){
  var Z = GW, d = 'M' + pts.map(function(p){ return p[0] + ' ' + p[1]; }).join('L') + 'Z';
  return '<path d="' + d + '" fill="' + (fill || Z.S) + '" stroke="' + Z.SD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M' + (pts[0][0] + 1.2) + ' ' + (pts[0][1] + 1.6) + 'L' + (pts[1][0] - 1.2) + ' ' + (pts[1][1] + 1.6) + '" stroke="' + Z.SL + '" stroke-width="1.2" stroke-linecap="round"/>';
}
/* an emerald diamond with a soft glow */
function gwGem(cx, cy, w, h, glow){
  var Z = GW;
  return (glow ? '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (w * 1.5) + '" ry="' + (h * 1.1) + '" fill="' + Z.C + '" fill-opacity=".28"/>' : '') +
    '<path d="M' + cx + ' ' + (cy - h) + 'L' + (cx + w) + ' ' + cy + 'L' + cx + ' ' + (cy + h) + 'L' + (cx - w) + ' ' + cy + 'Z" fill="' + Z.C + '" stroke="' + Z.CD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M' + cx + ' ' + (cy - h) + 'L' + cx + ' ' + (cy + h) + 'M' + (cx - w) + ' ' + cy + 'L' + (cx + w) + ' ' + cy + '" stroke="' + Z.CD + '" stroke-width=".8" stroke-opacity=".5"/>' +
    '<path d="M' + (cx - w * 0.45) + ' ' + (cy - h * 0.35) + 'L' + cx + ' ' + (cy - h * 0.8) + '" stroke="' + Z.CL + '" stroke-width="1.4" stroke-linecap="round"/>';
}
/* a riveted iron band (a slightly tilted rounded rect) */
function gwBand(x, y, w, h, rot){
  var Z = GW, cx = x + w / 2, cy = y + h / 2;
  return '<g transform="rotate(' + (rot || 0) + ' ' + cx + ' ' + cy + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="' + Z.I + '" stroke="' + Z.ID + '" stroke-width="1.6"/>' +
    '<path d="M' + (x + 1.5) + ' ' + (y + 1.6) + 'H' + (x + w - 1.5) + '" stroke="' + Z.IL + '" stroke-width="1" stroke-linecap="round"/>' +
    '<circle cx="' + (x + 2.6) + '" cy="' + cy + '" r="1" fill="' + Z.R + '"/><circle cx="' + (x + w - 2.6) + '" cy="' + cy + '" r="1" fill="' + Z.R + '"/></g>';
}
/* a blocky stone fist with knuckle plates; m = 1 knuckles to the right */
function gwFist(x, y, m){
  var Z = GW; function X(v){ return x + v * m; }
  return gwPlate([[X(-8), y - 9], [X(8), y - 10], [X(11), y - 3], [X(10), y + 8], [X(-6), y + 9], [X(-9), y + 2]]) +
    /* two knuckle grooves and a thumb plate */
    '<path d="M' + X(4) + ' ' + (y - 9.6) + 'Q' + X(6) + ' ' + (y - 4) + ' ' + X(10.6) + ' ' + (y - 4) + 'M' + X(5) + ' ' + (y + 8.6) + 'Q' + X(6) + ' ' + (y + 3) + ' ' + X(10.4) + ' ' + (y + 2) + '" fill="none" stroke="' + Z.SD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    gwPlate([[X(-6), y + 1], [X(3), y - 1], [X(4), y + 6], [X(-4), y + 7]], Z.SM);
}
function gwArt(){
  var Z = GW;
  return wrapSvg(
    /* hips and belly plates */
    gwPlate([[38, 74], [62, 74], [63, 84], [50, 88], [37, 84]], Z.SM) +
    /* chest: faceted plates around a big emerald */
    gwPlate([[28, 50], [46, 46], [48, 62], [33, 66]]) + gwPlate([[54, 46], [72, 50], [67, 66], [52, 62]]) +
    gwPlate([[33, 66], [48, 62], [50, 77], [38, 76]]) + gwPlate([[52, 62], [67, 66], [62, 76], [50, 77]]) +
    gwPlate([[46, 46], [54, 46], [56, 54], [50, 56], [44, 54]], Z.SM) +
    '<path d="M33 55L37 57L36 60M66 54L63 57L65 59M40 70L43 72M60 70L57 73" fill="none" stroke="' + Z.SD + '" stroke-width="1" stroke-linecap="round" stroke-opacity=".6"/>' +
    gwGem(50, 66, 6, 10, true) +
    /* shoulder plates */
    gwPlate([[18, 50], [30, 44], [36, 52], [28, 58], [19, 57]]) + gwPlate([[70, 44], [82, 50], [81, 57], [72, 58], [64, 52]]) +
    /* crown: stone spikes with the glowing emerald in the middle */
    gwPlate([[32, 26], [30, 14], [38, 20], [40, 26]]) + gwPlate([[68, 26], [70, 14], [62, 20], [60, 26]]) +
    gwPlate([[38, 24], [40, 10], [46, 18], [44, 24]]) + gwPlate([[62, 24], [60, 10], [54, 18], [56, 24]]) +
    gwGem(50, 10, 5.4, 9.5, true) +
    /* the head: an angular stone helm */
    gwPlate([[31, 24], [50, 18], [69, 24], [70, 38], [62, 47], [38, 47], [30, 38]]) +
    /* brow ridge dipping into a V, and a dark visor band below it */
    '<path d="M31 31L50 37L69 31L68 26L50 31L32 26Z" fill="' + Z.SM + '" stroke="' + Z.SD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M34 34L50 39L66 34L64 41L50 44L36 41Z" fill="#30343c" stroke="' + Z.SD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    /* glowing blue eye slits */
    '<ellipse cx="42" cy="38" rx="6" ry="3.6" fill="' + Z.E + '" fill-opacity=".35"/><ellipse cx="58" cy="38" rx="6" ry="3.6" fill="' + Z.E + '" fill-opacity=".35"/>' +
    '<path d="M37.5 36.2L46.5 38.6L45 40.4L38.5 38.8Z M62.5 36.2L53.5 38.6L55 40.4L61.5 38.8Z" fill="' + Z.E + '" stroke="#0c4a6a" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M40 37.6L44 38.6M60 37.6L56 38.6" stroke="' + Z.EL + '" stroke-width="1" stroke-linecap="round"/>' +
    /* jaw plate */
    '<path d="M40 44L60 44L57 48L43 48Z" fill="' + Z.SM + '" stroke="' + Z.SD + '" stroke-width="1.4" stroke-linejoin="round"/>');
}
function gwBack(c){
  var Z = GW;
  /* stone legs with an iron shin band and a big blocky boot */
  function leg(cls, x1, x2){
    return '<g class="lg ' + cls + '">' + gwPlate([[x1 - 7, 82], [x1 + 7, 82], [x2 + 7, 93], [x2 - 7, 93]]) + gwBand(x2 - 8.5, 89, 17, 5) +
      gwPlate([[x2 - 9, 94], [x2 + 6, 94], [x2 + 11, 99], [x2 + 11, 103], [x2 - 10, 103]]) + '</g>';
  }
  /* back arm: a stone forearm with an iron bracer, ending in a big fist out to the left */
  var arm = gwPlate([[30, 54], [22, 52], [14, 58], [18, 64], [28, 62]]) + gwBand(15, 53, 8, 13, -8) + gwFist(8, 61, -1);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38) + leg('lgR', 59, 62) +
    '<g><g class="pump pL">' + arm + '</g></g></svg>';
}
function gwFront(c){
  var Z = GW;
  /* the warhammer: a wrapped handle and a big iron-banded stone head with an emerald; in the weapon group so it swings */
  var hammer = '<path d="M84 74L80 22" stroke="' + Z.ID + '" stroke-width="6.4" stroke-linecap="round"/><path d="M84 74L80 22" stroke="' + Z.H + '" stroke-width="3.8" stroke-linecap="round"/>' +
    '<path d="M80.6 30L83.6 33M81 38L84 41M81.6 46L84.6 49M82.2 54L85 57" stroke="' + Z.ID + '" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M80 74L88 74L87 80L81 80Z" fill="' + Z.I + '" stroke="' + Z.ID + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    gwPlate([[64, 10], [70, 6], [92, 6], [98, 10], [98, 28], [92, 32], [70, 32], [64, 28]], '#7d828c') +
    gwBand(68, 5, 6, 28) + gwBand(88, 5, 6, 28) +
    gwGem(81, 19, 4.4, 7.4, true);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR">' + gwPlate([[70, 54], [80, 52], [86, 58], [82, 64], [72, 62]]) + gwBand(76, 52, 8, 13, 8) +
    '<g class="wpn"><g transform="translate(84 62) scale(.8) translate(-84 -62)">' + hammer + '</g>' + gwFist(84, 63, 1) + '</g></g></g></svg>';
}
