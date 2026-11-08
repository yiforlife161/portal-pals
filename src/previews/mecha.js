/* Robot on a wheel (no name yet): the owner's own drawing of a yellow robot with a toothy grin, a chest light, red forearms,
   big yellow fists and one wheel instead of legs. Tech, ranged: the front fist has a little blaster in its knuckles. (preview only) */
var MECHA = { Y: '#f6c12e', YD: '#7a5600', YL: '#ffd95e', R: '#e8402a', RD: '#6e1a10', G: '#b9bfc9', GD: '#4a505c', K: '#26262e' };
function mechaFist(x, y, m, k){      /* a big yellow fist; m = 1 knuckles to the right, -1 to the left; k = size */
  var M = MECHA; k = k || 1;
  function X(v){ return x + v * m * k; }
  var y0 = y; function Y(v){ return y0 + v * k; }
  return '<path d="M' + X(-6) + ' ' + Y(-7) + 'Q' + X(4) + ' ' + Y(-9) + ' ' + X(8) + ' ' + Y(-3) + 'Q' + X(10) + ' ' + Y(4) + ' ' + X(5) + ' ' + Y(8) + 'Q' + X(-4) + ' ' + Y(10) + ' ' + X(-8) + ' ' + Y(4) + 'Q' + X(-10) + ' ' + Y(-4) + ' ' + X(-6) + ' ' + Y(-7) + 'Z" fill="' + M.Y + '" stroke="' + M.YD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M' + X(1) + ' ' + Y(-6) + 'Q' + X(5) + ' ' + Y(-1) + ' ' + X(1) + ' ' + Y(2) + 'M' + X(-4) + ' ' + Y(3) + 'Q' + X(0) + ' ' + Y(6) + ' ' + X(4) + ' ' + Y(4) + '" fill="none" stroke="#c99a1a" stroke-width="1.5" stroke-linecap="round"/>';
}
function mechaArt(){
  var M = MECHA;
  return wrapSvg(
    /* red post down to the wheel (the wheel itself is drawn behind, with the legs) */
    '<rect x="45" y="80" width="10" height="14" rx="3" fill="' + M.R + '" stroke="' + M.RD + '" stroke-width="2"/>' +
    /* body with a lower plate and the chest light */
    outlined('<path d="M33 54L67 54L69 78Q66 86 58 85L42 85Q34 86 31 78Z"/>', M.Y, M.YD) +
    '<path d="M38 74Q50 70 62 74L60 84L40 84Z" fill="' + M.YL + '" stroke="#c99a1a" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<circle cx="50" cy="64" r="7.5" fill="' + M.G + '" stroke="' + M.GD + '" stroke-width="2.2"/><circle cx="50" cy="64" r="4.6" fill="#fff"/><circle cx="50" cy="64" r="9.5" fill="#fff" fill-opacity=".18"/>' +
    /* shoulder pads */
    outlined('<path d="M24 50L36 46L37 57L25 59Z"/><path d="M76 50L64 46L63 57L75 59Z"/>', M.Y, M.YD, 2.2) +
    /* jaw with the big toothy grin */
    outlined('<path d="M32 30L68 30L66 46Q50 54 34 46Z"/>', M.Y, M.YD) +
    '<path d="M35 32L65 32L63 43Q50 49 37 43Z" fill="' + M.K + '"/>' +
    '<path d="M37 32H63V35.5H59V38H55V35.5H52V38.5H48V35.5H45V38H41V35.5H37Z" fill="#fff"/>' +
    '<path d="M39 43.2L41 40.5H44V43.6M47 44.6V41H50V44.8M53 44.6V41H56V44M59 43V40.5H61L62.5 42.5" fill="#fff"/>' +
    /* dome head with a brim */
    outlined('<path d="M30 30C30 15 39 8 50 8C61 8 70 15 70 30Z"/>', M.Y, M.YD) +
    outlined('<path d="M27 28H73Q74 33 70 33H30Q26 33 27 28Z"/>', M.Y, M.YD, 2.2) +
    '<path d="M36 15Q42 11 48 11" fill="none" stroke="#fff3b8" stroke-width="2.6" stroke-linecap="round" stroke-opacity=".8"/>' +
    '<circle cx="42" cy="21" r="2.6" fill="' + M.K + '"/><circle cx="58" cy="21" r="2.6" fill="' + M.K + '"/>');
}
function mechaBack(c){
  var M = MECHA;
  /* one wheel instead of legs: it sits in a leg group so it bobs when he rolls along */
  var wheel = '<g class="lg lgL"><rect x="41.5" y="84" width="17" height="23" rx="8.5" fill="' + M.K + '" stroke="#0e0e12" stroke-width="2.2"/>' +
    '<rect x="38" y="92" width="24" height="7" rx="2.5" fill="' + M.G + '" stroke="' + M.GD + '" stroke-width="1.8"/>' +
    '<path d="M46 87V104" stroke="#4a4a56" stroke-width="1.8" stroke-linecap="round"/></g>';
  function upper(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.GD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.G + '" stroke-width="5" stroke-linecap="round"/>';
  }
  /* back arm: grey upper arm, big red forearm, yellow fist */
  var fore = '<path d="M8 63Q18 59 25 64L24 79Q15 83 7 78Z" fill="' + M.R + '" stroke="' + M.RD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M10 66Q17 63 22 66" fill="none" stroke="#ff8a70" stroke-width="1.8" stroke-linecap="round"/>' + mechaFist(15.5, 85, -1, 1.25);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wheel +
    '<g><g class="pump pL">' + upper(31, 55, 19, 65) + fore + '</g></g>' +
    '<g><g class="pump pR">' + upper(69, 55, 81, 65) + '</g></g></svg>';
}
function mechaFront(c){
  var M = MECHA;
  /* front arm: red forearm and a fist with a glowing blaster port in the knuckles; in the weapon group so it kicks when he fires */
  var arm = '<g transform="rotate(-18 86 64)">' +
    '<path d="M75 63Q85 59 92 64L91 79Q82 83 74 78Z" fill="' + M.R + '" stroke="' + M.RD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M77 66Q84 63 89 66" fill="none" stroke="#ff8a70" stroke-width="1.8" stroke-linecap="round"/>' +
    mechaFist(84, 85, 1, 1.25) +
    '<circle cx="93" cy="84" r="3.8" fill="' + M.GD + '" stroke="#26262e" stroke-width="1.4"/><circle cx="93" cy="84" r="2.1" fill="#7ff3ff"/><circle cx="93" cy="84" r="6" fill="#7ff3ff" fill-opacity=".25"/></g>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + arm + '</g></g></g></svg>';
}
