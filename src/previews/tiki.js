/* Tiki shaman (no name yet): the owner's own drawing: a carved wooden tiki mask with a pointed crown and a teal gem, gold brows,
   green eyes and tusks, grey-white feathers at the sides, blue skin, a teal top, a brown belt with a bone buckle, a grass skirt,
   and a carved staff tipped with a white crystal (ranged). (preview only) */
var TI = { W: '#b8642e', WD: '#3a1c0a', WL: '#d88a4a', WK: '#7a3a16', G: '#f2b81e', GD: '#7a5400', T: '#2fb8c4', TD: '#0e4a52', B: '#4fb2f0', BD: '#14507a', F: '#d8d4dc', FD: '#4a4652', S: '#c99a5a', SD: '#5a3a1a', E: '#3ac85a' };
function tiArt(){
  var T = TI, O = '#140c06';
  return wrapSvg(
    /* grey feathers fanning out behind the mask */
    outlined('<path d="M30 40L12 26L18 36L8 36L20 44L12 48L28 50Z"/><path d="M70 40L88 26L82 36L92 36L80 44L88 48L72 50Z"/>', T.F, T.FD, 2) +
    '<path d="M28 42L16 32M72 42L84 32" stroke="' + T.FD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* teal top, brown belt with a bone, grass skirt */
    outlined('<path d="M37 64Q50 60 63 64L63 79Q50 82 37 79Z"/>', T.T, T.TD) +
    outlined('<path d="M35 77Q50 81 65 77L65 82Q50 86 35 82Z"/>', T.W, T.WD, 1.8) +
    outlined('<path d="M44 78.6A2.2 2.2 0 1 1 46 76.6H54A2.2 2.2 0 1 1 56 78.6A2.2 2.2 0 1 1 54 82.4H46A2.2 2.2 0 1 1 44 78.6Z"/>', '#f4ecd8', '#6a5a40', 1.3) +
    outlined('<path d="M35 82L33 94L38 89L41 96L45 90L50 97L55 90L59 96L62 89L67 94L65 82Q50 86 35 82Z"/>', T.S, T.SD, 1.8) +
    '<path d="M40 85L39 92M46 86L46 93M54 86L54 93M60 85L61 92" stroke="' + T.SD + '" stroke-width="1" stroke-linecap="round" stroke-opacity=".6"/>' +
    /* the carved mask: a tall wooden block with a pointed crown and a teal gem */
    outlined('<path d="M32 22L40 18L50 6L60 18L68 22L68 60Q68 66 62 66H38Q32 66 32 60Z"/>', T.W, T.WD, 2.4) +
    '<path d="M38 22L50 10L62 22" fill="none" stroke="' + T.WL + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    outlined('<path d="M50 15L54 22L50 29L46 22Z"/>', T.T, T.TD, 1.6) + '<path d="M48.6 19L50 17L51.4 19" fill="none" stroke="#bff6f8" stroke-width="1"/>' +
    '<path d="M36 26V58M64 26V58" stroke="' + T.WK + '" stroke-width="1.4" stroke-opacity=".7"/>' +
    /* gold brows */
    outlined('<path d="M34 33L47 36L47 40L34 38Z"/><path d="M66 33L53 36L53 40L66 38Z"/>', T.G, T.GD, 1.8) +
    /* green eyes */
    '<circle cx="41.5" cy="44.5" r="5.2" fill="' + T.E + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="42" cy="45" r="2.8" fill="' + O + '"/><circle cx="43.2" cy="43.6" r="1" fill="#fff"/>' +
    '<circle cx="58.5" cy="44.5" r="5.2" fill="' + T.E + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="58" cy="45" r="2.8" fill="' + O + '"/><circle cx="59.2" cy="43.6" r="1" fill="#fff"/>' +
    /* carved nose, a stern mouth and two tusks */
    '<path d="M48 48L50 53L52 48" fill="none" stroke="' + T.WK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    outlined('<path d="M40 56H60L58 62H42Z"/>', T.WK, T.WD, 1.6) +
    outlined('<path d="M37 53L43 55L41 61L36 59Z"/><path d="M63 53L57 55L59 61L64 59Z"/>', '#f4ecd8', '#6a5a40', 1.4));
}
function tiBack(c){
  var T = TI;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 88L' + x2 + ' 96" stroke="' + T.BD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 88L' + x2 + ' 96" stroke="' + T.B + '" stroke-width="5.4" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 8) + ' 103Q' + (fx - 8) + ' 95 ' + fx + ' 95Q' + (fx + 9) + ' 95 ' + (fx + 9) + ' 103Z" fill="' + T.B + '" stroke="' + T.BD + '" stroke-width="2" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.BD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.B + '" stroke-width="5.4" stroke-linecap="round"/>';
  }
  function wrap(x, y){ return '<path d="M' + x + ' ' + (y - 3.8) + 'L' + (x + 0.6) + ' ' + (y + 3.8) + '" stroke="' + T.WD + '" stroke-width="5" stroke-linecap="round"/><path d="M' + x + ' ' + (y - 3.8) + 'L' + (x + 0.6) + ' ' + (y + 3.8) + '" stroke="' + T.W + '" stroke-width="3" stroke-linecap="round"/>'; }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 43, 41, 38) + leg('lgR', 57, 59, 62) +
    '<g><g class="pump pL">' + arm(36, 66, 18, 68) + wrap(25, 67) + '<circle cx="15" cy="68.5" r="4.6" fill="' + T.B + '" stroke="' + T.BD + '" stroke-width="1.8"/></g></g>' +
    '<g><g class="pump pR">' + arm(64, 66, 83, 65) + wrap(75, 65.5) + '</g></g></svg>';
}
function tiFront(c){
  var T = TI;
  /* the carved staff with gold bands, a wooden cup and a white crystal on top, and two green leaves; it sits in the weapon group */
  var staff = '<path d="M84 88L91 22" stroke="' + T.WD + '" stroke-width="5" stroke-linecap="round"/><path d="M84 88L91 22" stroke="' + T.W + '" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M86.6 64.6H91M88.3 48.6H92.7M89.6 36H94" stroke="' + T.G + '" stroke-width="2.6" stroke-linecap="round"/>' +
    outlined('<path d="M84 24Q84 16 88 15L91 20L94 15Q98 16 98 24Q91 28 84 24Z"/>', T.W, T.WD, 1.6) +
    outlined('<path d="M88 16L91 7L95 10L94 17Q91 19 88 16Z"/>', '#ece4e8', '#4a3a40', 1.4) +
    outlined('<path d="M86 30Q78 28 80 34Q84 35 86 32Z"/><path d="M86 33Q80 36 83 40Q87 38 87 34Z"/>', '#3aa84a', '#0e4a1a', 1.2);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + staff + '<circle cx="86" cy="64.5" r="4.6" fill="' + T.B + '" stroke="' + T.BD + '" stroke-width="1.8"/></g></g></g></svg>';
}
