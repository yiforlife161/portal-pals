/* Log Smasher (key 'ls', Life, melee, normal): the owner's drawing: a walking tree trunk with no neck, a mossy flat top, angry yellow eyes
   cut into the bark, a carved brow, a round knot of a nose and a darker heart-shaped chest, long arms that end in two big sawn logs used as
   hammers (mossy on the sides, bright orange cut faces with growth rings on the ends), and long root legs that split into
   spreading root toes, with moss patches here and there. Faces right like every pal: the front log hammer is his weapon. */
var LS = { W: '#b97a4a', WD: '#2a170a', WL: '#d9a070', WM: '#8f5a32', M: '#86c43a', MD: '#3e6e14', ML: '#b6e66a', C: '#ff9620', CD: '#7a3a06', CL: '#ffc46a', E: '#ffe43a' };
function lsP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
/* bark grain: thin dark streaks */
function lsGrain(d){ return '<path d="' + d + '" fill="none" stroke="' + LS.WM + '" stroke-width="1.1" stroke-linecap="round"/>'; }
/* a ragged moss patch: a zig-zag blob centred at (x, y), w wide, h tall */
function lsMoss(x, y, w, h){
  var Z = LS, a = w / 2, b = h / 2;
  return lsP('M' + (x - a) + ' ' + (y - b * 0.4) + 'L' + (x - a * 0.5) + ' ' + (y - b) + 'L' + (x - a * 0.1) + ' ' + (y - b * 0.5) + 'L' + (x + a * 0.35) + ' ' + (y - b) + 'L' + (x + a) + ' ' + (y - b * 0.3) +
    'L' + (x + a * 0.6) + ' ' + (y + b * 0.2) + 'L' + (x + a * 0.8) + ' ' + (y + b) + 'L' + (x + a * 0.1) + ' ' + (y + b * 0.5) + 'L' + (x - a * 0.4) + ' ' + (y + b) + 'L' + (x - a * 0.7) + ' ' + (y + b * 0.3) + 'Z', Z.M, Z.MD, 1.2);
}
/* a sawn log hammer at (x, y): mossy bark sleeve and an orange cut face on the outer end; m = 1 face to the right */
function lsHammer(x, y, m){
  var Z = LS; function X(v){ return x + v * m; }
  return lsP('M' + X(-8) + ' ' + (y - 9) + 'L' + X(5) + ' ' + (y - 11) + 'L' + X(5) + ' ' + (y + 11) + 'L' + X(-8) + ' ' + (y + 9) + 'Q' + X(-10) + ' ' + y + ' ' + X(-8) + ' ' + (y - 9) + 'Z', Z.M, Z.MD, 1.9) +
    lsP('M' + X(-8) + ' ' + (y - 9) + 'L' + X(-3) + ' ' + (y - 9.6) + 'L' + X(-5) + ' ' + (y - 4) + 'L' + X(-2.6) + ' ' + y + 'L' + X(-5.4) + ' ' + (y + 4) + 'L' + X(-3) + ' ' + (y + 9.4) + 'L' + X(-8) + ' ' + (y + 9) + 'Q' + X(-10) + ' ' + y + ' ' + X(-8) + ' ' + (y - 9) + 'Z', Z.W, Z.WD, 1.3) +
    '<path d="M' + X(-1) + ' ' + (y - 8) + 'L' + X(1) + ' ' + (y - 4) + 'M' + X(0) + ' ' + (y + 3) + 'L' + X(2) + ' ' + (y + 8) + '" stroke="' + Z.MD + '" stroke-width="1" stroke-linecap="round"/>' +
    '<path d="M' + X(-6) + ' ' + (y - 7.6) + 'L' + X(3) + ' ' + (y - 9.2) + '" stroke="' + Z.ML + '" stroke-width="1.1" stroke-linecap="round"/>' +
    /* the cut face, seen a little from the side */
    '<ellipse cx="' + X(5.4) + '" cy="' + y + '" rx="4.4" ry="11.2" fill="' + Z.CL + '" stroke="' + Z.WD + '" stroke-width="1.9"/>' +
    '<ellipse cx="' + X(5.6) + '" cy="' + y + '" rx="3" ry="9" fill="' + Z.C + '" stroke="' + Z.CD + '" stroke-width=".7" stroke-opacity=".6"/>' +
    '<ellipse cx="' + X(5.8) + '" cy="' + y + '" rx="1.6" ry="5" fill="none" stroke="' + Z.CD + '" stroke-width=".7" stroke-opacity=".6"/>';
}
function lsArt(){
  var Z = LS;
  return wrapSvg(
    /* the trunk: wide shoulders, tapering to a point at the hips */
    lsP('M37 24L39 12Q50 9 61 12L63 24L64 42Q66 56 60 66L50 74L40 66Q34 56 36 42Z', Z.W, Z.WD, 2.1) +
    lsGrain('M42 14L44 22M57 14L55 21M39 46L42 56M61 46L58 56M44 62L47 68M56 62L53 68') +
    /* a darker heart-shaped chest of bark below the face */
    lsP('M40 48L46 44L50 50L54 44L60 48Q61 58 55 64L50 70L45 64Q39 58 40 48Z', Z.WM, Z.WD, 1.2) +
    lsGrain('M45 54L50 60L55 54') +
    /* mossy flat top, ragged where it runs down the bark */
    lsP('M39 12Q50 9 61 12L62 17L59 15.6L57 19L54 15.6L51 18.6L48 15.4L45 19L42.6 15.6L38.4 17Z', Z.M, Z.MD, 1.4) +
    '<path d="M42 11.6Q50 10 58 11.6" fill="none" stroke="' + Z.ML + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* carved brow that dips into a beak between the eyes */
    lsP('M38 26L48 31L50 32L52 31L62 26L62 30L54 34L50 35.4L46 34L38 30Z', Z.WL, Z.WD, 1.4) +
    /* a round knot of a nose */
    '<circle cx="50" cy="40.6" r="3.4" fill="' + Z.WL + '" stroke="' + Z.WD + '" stroke-width="1.5"/><circle cx="50" cy="40.6" r="1.5" fill="none" stroke="' + Z.WM + '" stroke-width=".9"/><path d="M48.4 38.8Q49.4 38 50.6 38.2" fill="none" stroke="#f0c89a" stroke-width=".9" stroke-linecap="round"/>' +
    /* angry yellow eyes cut into the bark */
    lsP('M40 30.5L47.4 33.6Q47.6 38.6 43.6 38.6Q39.6 38.4 40 30.5Z', Z.E, Z.WD, 1.6) +
    lsP('M60 30.5L52.6 33.6Q52.4 38.6 56.4 38.6Q60.4 38.4 60 30.5Z', Z.E, Z.WD, 1.6) +
    '<circle cx="44.4" cy="35.4" r="1.1" fill="' + Z.WD + '"/><circle cx="55.6" cy="35.4" r="1.1" fill="' + Z.WD + '"/>' +
    /* shoulder stubs where the arms grow out */
    lsMoss(38.6, 27, 5, 4) + lsMoss(61.4, 27, 5, 4));
}
function lsBack(c){
  var Z = LS;
  /* a long root leg that splits into three spreading root toes */
  function leg(cls, x1, x2, m){
    function X(v){ return x2 + v * m; }
    return '<g class="lg ' + cls + '">' +
      lsP('M' + (x1 - 5) + ' 66L' + (x1 + 5) + ' 66L' + X(4.6) + ' 92L' + X(-4.6) + ' 92Z', Z.W, Z.WD, 1.8) +
      lsGrain('M' + x1 + ' 70L' + (x1 + (x2 - x1) * 0.6) + ' 84') +
      lsMoss(x1 + (x2 - x1) * 0.35, 75, 6, 6) +
      lsP('M' + X(-4) + ' 90L' + X(-12) + ' 101L' + X(-8) + ' 102L' + X(-2) + ' 96L' + X(-2) + ' 104L' + X(2) + ' 104L' + X(3) + ' 96L' + X(10) + ' 102L' + X(12) + ' 99L' + X(4) + ' 90Z', Z.W, Z.WD, 1.8) +
      lsMoss(x2, 95, 7, 4) + '</g>';
  }
  /* back arm: a long branch out to the left with a moss patch, ending in a log hammer */
  var arm = lsP('M38 25L19 52L25 57L39 34Z', Z.W, Z.WD, 1.9) + lsGrain('M34 33L25 46M36 36L28 49') + lsMoss(31, 38, 6, 5) + lsHammer(14, 58, -1);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 34, -1) + leg('lgR', 56, 66, 1) +
    '<g><g class="pump pL">' + arm + '</g></g>' +
    /* the front branch arm grows out from under the body */
    '<g><g class="pump pR">' + lsP('M62 25L81 52L75 57L61 34Z', Z.W, Z.WD, 1.9) + lsGrain('M66 33L75 46M64 36L72 49') + lsMoss(69, 38, 6, 5) + '</g></g></svg>';
}
function lsFront(c){
  var Z = LS;
  /* the front log hammer is his weapon (the branch arm holding it is in the back layer) */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + lsHammer(85, 61, 1) + '</g></g></g></svg>';
}
