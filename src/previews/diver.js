/* Bubble Trooper (no name yet): an original blue fish soldier: a round blue fish face inside a water-filled glass dome helmet,
   a steel deep-sea armour suit with rivets over a navy undersuit, heavy steel boots, and a steel bubble blaster with an air
   tank (Water, ranged). (preview only) */
var DV = { F: '#2f7fe0', FD: '#0e2f6a', FL: '#8cc4ff', FB: '#ffd23a', G: '#bfe8ff', GD: '#3a6a8a', BR: '#9aa6b6', BRD: '#2e3644', BRL: '#dfe6ef', CU: '#6c7888', N: '#1e2c56', ND: '#0a1028' };
function dvRivets(pts){ var D = DV; return pts.map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.1" fill="' + D.BRL + '" stroke="' + D.BRD + '" stroke-width=".7"/>'; }).join(''); }
function dvArt(){
  var D = DV, O = '#0a0e1a';
  return wrapSvg(
    /* navy undersuit, steel chest plate with a darker band, a round air gauge */
    outlined('<path d="M33 60Q50 54 67 60L68 86Q50 92 32 86Z"/>', D.N, D.ND) +
    outlined('<path d="M35 60Q50 55 65 60L64 78Q50 83 36 78Z"/>', D.BR, D.BRD) +
    '<path d="M38 62Q42 59 47 59" fill="none" stroke="' + D.BRL + '" stroke-width="2" stroke-linecap="round"/>' +
    outlined('<path d="M35 76Q50 81 65 76L65 81Q50 86 35 81Z"/>', D.CU, D.BRD, 1.8) +
    '<circle cx="50" cy="68" r="5" fill="#f2efe4" stroke="' + D.BRD + '" stroke-width="1.6"/><path d="M50 68L52.6 65.4" stroke="#c0382a" stroke-width="1.3" stroke-linecap="round"/><circle cx="50" cy="68" r="0.9" fill="' + D.BRD + '"/>' +
    dvRivets([[38, 64], [62, 64], [38, 73], [62, 73]]) +
    /* steel diving collar */
    outlined('<path d="M28 56Q50 46 72 56L70 62Q50 54 30 62Z"/>', D.BR, D.BRD, 2.2) + dvRivets([[33, 56], [42, 52.6], [50, 51.6], [58, 52.6], [67, 56]]) +
    /* glass dome helmet full of water */
    '<circle cx="50" cy="33" r="22" fill="' + D.G + '" fill-opacity=".55" stroke="' + D.GD + '" stroke-width="2.4"/>' +
    /* the round blue fish inside: big eyes, pouty lips, a little top fin and side fins */
    outlined('<path d="M44 16Q50 9 57 15Q53 15 50 19Z"/>', D.F, D.FD, 1.6) +
    outlined('<path d="M30 34Q24 30 23 38Q27 38 30 38Z"/><path d="M70 34Q76 30 77 38Q73 38 70 38Z"/>', D.FL, D.FD, 1.6) +
    outlined('<path d="M50 15C62 15 69 24 69 35C69 46 61 52 50 52C39 52 31 46 31 35C31 24 38 15 50 15Z"/>', D.F, D.FD) +
    '<path d="M36 23Q41 18 48 18" fill="none" stroke="' + D.FL + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M36 40Q50 50 64 40Q62 49 50 50Q38 49 36 40Z" fill="' + D.FL + '" fill-opacity=".55"/>' +
    '<circle cx="41" cy="33" r="6.4" fill="#fff" stroke="' + O + '" stroke-width="1.6"/><circle cx="42" cy="34" r="3.6" fill="' + O + '"/><circle cx="43.4" cy="32.4" r="1.3" fill="#fff"/>' +
    '<circle cx="59" cy="33" r="6.4" fill="#fff" stroke="' + O + '" stroke-width="1.6"/><circle cx="58" cy="34" r="3.6" fill="' + O + '"/><circle cx="59.4" cy="32.4" r="1.3" fill="#fff"/>' +
    '<path d="M35 25.5L46 28M65 25.5L54 28" stroke="' + D.FD + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="44.2" rx="7" ry="3.4" fill="#ff8a7a" stroke="' + D.FD + '" stroke-width="1.4"/><path d="M43.6 44.2H56.4" stroke="' + D.FD + '" stroke-width="1" stroke-linecap="round"/>' +
    /* glass shine and a couple of bubbles inside the helmet */
    '<path d="M34 18Q40 13 47 12.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-opacity=".9"/>' +
    '<circle cx="66" cy="22" r="1.6" fill="none" stroke="#fff" stroke-width="1"/><circle cx="63" cy="17" r="1" fill="none" stroke="#fff" stroke-width=".9"/>');
}
function dvBack(c){
  var D = DV;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + D.ND + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + D.N + '" stroke-width="6.4" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 9) + ' 104L' + (fx - 8) + ' 94H' + (fx + 7) + 'L' + (fx + 8) + ' 98Q' + (fx + 12) + ' 100 ' + (fx + 12) + ' 104Z" fill="' + D.BR + '" stroke="' + D.BRD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 8) + ' 97.5H' + (fx + 7) + '" stroke="' + D.CU + '" stroke-width="2.2" stroke-linecap="round"/>' + dvRivets([[fx - 5, 101], [fx + 5, 101]]) + '</g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + D.ND + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + D.N + '" stroke-width="5.4" stroke-linecap="round"/>';
  }
  function glove(x, y){ return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + D.BR + '" stroke="' + D.BRD + '" stroke-width="1.8"/><path d="M' + (x - 3) + ' ' + (y - 1) + 'H' + (x + 3) + '" stroke="' + D.CU + '" stroke-width="1.4" stroke-linecap="round"/>'; }
  /* steel shoulder pads */
  var pads = outlined('<path d="M24 58Q25 50 35 51L36 61Q29 63 25 61Z"/><path d="M76 58Q75 50 65 51L64 61Q71 63 75 61Z"/>', D.BR, D.BRD, 2) + dvRivets([[29, 56], [71, 56]]);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 42, 39, 36) + leg('lgR', 58, 61, 64) +
    '<g><g class="pump pL">' + arm(33, 63, 18, 68) + glove(15, 69) + '</g></g>' +
    '<g><g class="pump pR">' + arm(67, 63, 83, 65) + '</g></g>' + pads + '</svg>';
}
function dvFront(c){
  var D = DV;
  /* steel bubble blaster: a round air tank on top, a flared bell muzzle, and a bubble ready to go */
  var gun = '<g transform="rotate(-18 86 64)">' +
    '<rect x="78" y="58" width="22" height="9" rx="3" fill="' + D.BR + '" stroke="' + D.BRD + '" stroke-width="2"/>' +
    '<path d="M81 60.5H96" stroke="' + D.BRL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M100 56.5L106 53.5V71.5L100 68.5Z" fill="' + D.CU + '" stroke="' + D.BRD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<rect x="82" y="50" width="11" height="8" rx="4" fill="' + D.FL + '" stroke="' + D.GD + '" stroke-width="1.6"/><path d="M84.5 52.5H89" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>' +
    '<rect x="83" y="66" width="5" height="8" rx="1.4" fill="' + D.CU + '" stroke="' + D.BRD + '" stroke-width="1.4"/>' +
    '<circle cx="110" cy="62" r="3.6" fill="' + D.G + '" fill-opacity=".6" stroke="#fff" stroke-width="1.2"/><circle cx="109" cy="60.8" r="1" fill="#fff"/></g>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + gun + '<circle cx="84.5" cy="66" r="4.6" fill="' + D.BR + '" stroke="' + D.BRD + '" stroke-width="1.8"/></g></g></g></svg>';
}
