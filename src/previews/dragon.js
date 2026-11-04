/* Puddle the baby dragon: an original chubby purple dragon pal (preview only) */
var DRG = { b: '#8a5bd6', bd: '#3a1f6e', belly: '#ffe3b8', bellyd: '#c99a5a', horn: '#f5c43a', hornd: '#8a5e00', wing: '#3fc6b8', wingd: '#16645c' };
function dragonArt(){
  var K = DRG;
  return wrapSvg(
    /* wings and tail behind the body */
    outlined('<path d="M30 52C18 40 8 40 3 46C10 48 12 52 12 56C16 53 20 54 22 58C24 55 28 56 31 60Z"/>', K.wing, K.wingd, 2.6) +
    outlined('<path d="M70 52C82 40 92 40 97 46C90 48 88 52 88 56C84 53 80 54 78 58C76 55 72 56 69 60Z"/>', K.wing, K.wingd, 2.6) +
    '<path d="M10 47C16 48 22 51 27 55M90 47C84 48 78 51 73 55" fill="none" stroke="' + K.wingd + '" stroke-width="1.6" stroke-linecap="round" stroke-opacity=".6"/>' +
    outlined('<path d="M62 84C74 88 84 84 86 74C88 70 92 70 93 74C94 86 80 96 62 92Z"/>', K.b, K.bd, 2.8) +
    outlined('<path d="M90 75C88 68 92 64 97 64C96 68 98 72 94 77Z"/>', K.wing, K.wingd, 2.2) +
    /* body */
    outlined('<path d="M50 50C66 50 74 64 74 77C74 88 63 93 50 93C37 93 26 88 26 77C26 64 34 50 50 50Z"/>', K.b, K.bd) +
    '<path d="M50 58C59 58 64 67 64 77C64 85 58 89 50 89C42 89 36 85 36 77C36 67 41 58 50 58Z" fill="' + K.belly + '"/>' +
    '<path d="M39 68H61M37.5 75H62.5M38 82H62" fill="none" stroke="' + K.bellyd + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* horns */
    outlined('<path d="M33 22C30 14 32 7 37 4C37 10 39 14 42 18Z"/>', K.horn, K.hornd, 2.4) +
    outlined('<path d="M67 22C70 14 68 7 63 4C63 10 61 14 58 18Z"/>', K.horn, K.hornd, 2.4) +
    /* head */
    outlined('<path d="M50 13C69 13 81 24 81 38C81 47 76 53 69 56C64 59 58 60 50 60C42 60 36 59 31 56C24 53 19 47 19 38C19 24 31 13 50 13Z"/>', K.b, K.bd) +
    '<path d="M27 26C30 20 36 16 43 15" fill="none" stroke="#c9a8ff" stroke-width="3.6" stroke-linecap="round" stroke-opacity=".75"/>' +
    /* little head spikes */
    '<path d="M46 13.5L50 7L54 13.5Z" fill="' + K.wing + '" stroke="' + K.wingd + '" stroke-width="2" stroke-linejoin="round"/>' +
    /* snout */
    '<ellipse cx="50" cy="47" rx="15" ry="9" fill="#a47ae6"/>' +
    '<circle cx="45" cy="45" r="1.8" fill="' + K.bd + '"/><circle cx="55" cy="45" r="1.8" fill="' + K.bd + '"/>' +
    '<path d="M42 50.5Q50 56 58 50.5" fill="none" stroke="' + K.bd + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M54.5 52.5L56 56L58 52" fill="#fff" stroke="' + K.bd + '" stroke-width="1" stroke-linejoin="round"/>' +
    /* eyes */
    '<g class="eye"><ellipse cx="37" cy="33" rx="7.5" ry="8.5" fill="#fff" stroke="' + K.bd + '" stroke-width="2"/><ellipse cx="38" cy="34" rx="4.6" ry="5.6" fill="#ff9a2e"/><circle cx="38.5" cy="34.5" r="2.6" fill="#2a1244"/><circle cx="36.5" cy="31.5" r="1.6" fill="#fff"/></g>' +
    '<g class="eye"><ellipse cx="63" cy="33" rx="7.5" ry="8.5" fill="#fff" stroke="' + K.bd + '" stroke-width="2"/><ellipse cx="62" cy="34" rx="4.6" ry="5.6" fill="#ff9a2e"/><circle cx="61.5" cy="34.5" r="2.6" fill="#2a1244"/><circle cx="60.5" cy="31.5" r="1.6" fill="#fff"/></g>' +
    /* cheek freckles */
    '<circle cx="27" cy="43" r="1.3" fill="#d6b8ff"/><circle cx="30" cy="45" r="1.3" fill="#d6b8ff"/><circle cx="73" cy="43" r="1.3" fill="#d6b8ff"/><circle cx="70" cy="45" r="1.3" fill="#d6b8ff"/>');
}
function dragonBack(c){
  var o = DRG.bd, f = DRG.b;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 97" stroke="' + o + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 97" stroke="' + f + '" stroke-width="8" stroke-linecap="round"/>' +
      '<ellipse cx="' + fx + '" cy="101" rx="8" ry="4.5" fill="' + f + '" stroke="' + o + '" stroke-width="2.2"/>' +
      '<path d="M' + (fx - 4) + ' 104V102M' + fx + ' 105V103M' + (fx + 4) + ' 104V102" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + o + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + f + '" stroke-width="5.5" stroke-linecap="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true">' + leg('lgL', 41, 39, 37) + leg('lgR', 59, 61, 63) +
    '<g><g class="pump pL">' + arm(31, 70, 17, 73) + '</g></g><g><g class="pump pR">' + arm(69, 69, 84, 66) + '</g></g></svg>';
}
function dragonFront(c){
  var o = DRG.bd, f = DRG.b, spark = c.style === 'ranged' ? '<g class="wpn"><circle cx="90" cy="58" r="5.5" fill="' + DRG.wing + '" opacity=".35"/><polygon class="tip" points="' + starPts(90, 58, 6.5, 3) + '" fill="#bff7ef" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></g>' : '';
  function paw(x, y){ return '<circle cx="' + x + '" cy="' + y + '" r="5.4" fill="' + f + '" stroke="' + o + '" stroke-width="2.4"/><path d="M' + (x - 2.5) + ' ' + (y + 4) + 'V' + (y + 6) + 'M' + (x + 2.5) + ' ' + (y + 4) + 'V' + (y + 6) + '" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>'; }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true">' +
    '<g><g class="pump pR">' + spark + paw(84, 66) + '</g></g><g><g class="pump pL">' + paw(17, 73) + '</g></g></svg>';
}
