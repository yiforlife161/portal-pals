/* Storm God: the owner's own Zeus-inspired drawing: a muscular blue-skinned storm god with wild red-brown hair and a
   big full beard, angry green eyes, gold bracers, a gold belt with a lightning medallion over a navy loincloth, floating on a cloud
   instead of legs, with yellow lightning crackling around his fists; he throws yellow lightning bolts (Air, ranged, Normal). */
var ZS = { B: '#4a8ae8', BD: '#123a7a', BL: '#8ab8ff', BM: '#3570cc', H: '#b85a26', HD: '#4a1e08', HL: '#d8844a', G: '#f2b81e', GD: '#7a5400', GL: '#ffe27a', N: '#24387a', ND: '#0c1838', C: '#ffffff', CD: '#5a86d0', CS: '#d6e6ff', Y: '#ffd23a', YD: '#a86a00', E: '#3ac84a' };
function zsBolt(x, y, s, flip){      /* a yellow lightning bolt */
  var m = flip ? -1 : 1; function P(a, b){ return (x + a * s * m).toFixed(1) + ' ' + (y + b * s).toFixed(1); }
  return '<path d="M' + P(-2, -14) + 'L' + P(5, -14) + 'L' + P(1, -4) + 'L' + P(7, -4) + 'L' + P(-4, 14) + 'L' + P(-1, 1) + 'L' + P(-6, 1) + 'Z" fill="' + ZS.Y + '" stroke="' + ZS.YD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M' + P(1, -12) + 'L' + P(-1, -6) + '" stroke="#fff7c0" stroke-width="1.2" stroke-linecap="round"/>';
}
function zsCloud(cx, cy, s){      /* a fluffy cloud puff */
  function P(a, b){ return (cx + a * s).toFixed(1) + ' ' + (cy + b * s).toFixed(1); }
  return '<path d="M' + P(-12, 4) + 'Q' + P(-16, 4) + ' ' + P(-15, -1) + 'Q' + P(-15, -6) + ' ' + P(-9, -6) + 'Q' + P(-8, -12) + ' ' + P(-1, -11) + 'Q' + P(4, -15) + ' ' + P(9, -10) + 'Q' + P(16, -10) + ' ' + P(15, -3) + 'Q' + P(18, 2) + ' ' + P(12, 4) + 'Z" fill="' + ZS.C + '" stroke="' + ZS.CD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M' + P(-10, 1) + 'Q' + P(0, 3) + ' ' + P(10, 1) + '" fill="none" stroke="' + ZS.CS + '" stroke-width="2.2" stroke-linecap="round"/>';
}
function zsArt(){
  var Z = ZS, O = '#0a1430';
  return wrapSvg(
    /* muscular blue chest with pecs and abs */
    outlined('<path d="M32 60Q50 53 68 60Q70 72 64 82H36Q30 72 32 60Z"/>', Z.B, Z.BD) +
    '<path d="M50 60V80M38 66Q44 70 50 67M62 66Q56 70 50 67M43 73H49M51 73H57M44 78H49M51 78H56" fill="none" stroke="' + Z.BM + '" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M36 62Q40 59 45 59" fill="none" stroke="' + Z.BL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* navy loincloth with gold trim, and the gold belt with a lightning medallion */
    outlined('<path d="M39 82H61L57 96L50 100L43 96Z"/>', Z.N, Z.ND, 1.8) +
    '<path d="M41 84L44.5 95L50 98L55.5 95L59 84" fill="none" stroke="' + Z.G + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    outlined('<path d="M34 79Q50 83 66 79L66 85Q50 89 34 85Z"/>', Z.G, Z.GD, 1.8) +
    '<circle cx="50" cy="84" r="5.4" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.6"/><path d="M50.8 80.6L47.8 84.4H50.4L49.2 87.6L52.4 83.4H49.8Z" fill="' + Z.GD + '"/>' +
    /* wild red-brown hair behind the head */
    outlined('<path d="M31 46Q22 46 18 40Q24 40 26 36Q16 34 12 26Q20 28 24 26Q16 20 16 12Q24 16 28 16Q26 8 30 2Q34 8 38 10Q40 2 46 -2Q46 6 50 8Q54 0 62 -2Q58 6 60 10Q66 4 74 4Q70 10 70 14Q78 12 86 16Q80 20 76 24Q84 26 88 32Q80 34 76 34Q82 38 84 44Q76 44 70 46Z"/>', Z.H, Z.HD, 2.2) +
    '<path d="M26 22Q32 22 34 16M74 22Q68 22 66 16M22 32Q28 32 31 28M78 32Q72 32 69 28M42 6Q44 10 44 14M58 6Q56 10 56 14" fill="none" stroke="' + Z.HL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* blue face */
    outlined('<path d="M50 14C61 14 67 22 67 32C67 42 61 48 50 48C39 48 33 42 33 32C33 22 39 14 50 14Z"/>', Z.B, Z.BD) +
    /* hair fringe over the forehead */
    outlined('<path d="M35 22Q38 13 50 12Q62 13 65 22Q60 17 56 19Q53 14 49 18Q45 15 41 20Q38 18 35 22Z"/>', Z.H, Z.HD, 1.6) +
    /* angry green eyes, heavy brows, a broad nose */
    '<ellipse cx="42.5" cy="31" rx="4.6" ry="4" fill="#fff" stroke="' + O + '" stroke-width="1.5"/><circle cx="43.2" cy="31.4" r="2.4" fill="' + Z.E + '"/><circle cx="43.4" cy="31.6" r="1.2" fill="' + O + '"/><circle cx="44.2" cy="30.4" r=".7" fill="#fff"/>' +
    '<ellipse cx="57.5" cy="31" rx="4.6" ry="4" fill="#fff" stroke="' + O + '" stroke-width="1.5"/><circle cx="56.8" cy="31.4" r="2.4" fill="' + Z.E + '"/><circle cx="56.6" cy="31.6" r="1.2" fill="' + O + '"/><circle cx="57.4" cy="30.4" r=".7" fill="#fff"/>' +
    '<path d="M36 24.5L48 29M64 24.5L52 29" stroke="' + Z.HD + '" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M48.5 32L47 38Q50 40 53 38L51.5 32" fill="' + Z.BM + '" stroke="' + Z.BD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    /* big full beard and mustache, flowing down onto the chest */
    outlined('<path d="M33 36Q34 46 38 50Q36 58 42 62Q46 66 50 70Q54 66 58 62Q64 58 62 50Q66 46 67 36Q62 42 56 41Q50 44 44 41Q38 42 33 36Z"/>', Z.H, Z.HD, 2) +
    '<path d="M40 48Q44 54 46 60M50 46V64M60 48Q56 54 54 60M38 44Q40 50 42 54M62 44Q60 50 58 54" fill="none" stroke="' + Z.HD + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".7"/>' +
    outlined('<path d="M50 39Q44 37 39 41Q36 44 33 43Q37 47 43 45Q47 44 50 42Q53 44 57 45Q63 47 67 43Q64 44 61 41Q56 37 50 39Z"/>', Z.HL, Z.HD, 1.6) +
    '<path d="M46 45.6Q50 44.2 54 45.6" fill="none" stroke="' + O + '" stroke-width="1.6" stroke-linecap="round"/>');
}
function zsBack(c){
  var Z = ZS;
  /* no legs: he floats on a cloud. The two halves bob as he moves */
  function puff(cls, cx){ return '<g class="lg ' + cls + '">' + zsCloud(cx, 103, 1.3) + '</g>'; }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + Z.BD + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + Z.B + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + (x1 + (x2 - x1) * 0.3) + ' ' + (y1 - 3) + 'Q' + ((x1 + x2) / 2) + ' ' + (y1 - 5) + ' ' + (x1 + (x2 - x1) * 0.7) + ' ' + (y2 - 3) + '" fill="none" stroke="' + Z.BL + '" stroke-width="1.6" stroke-linecap="round"/>';
  }
  function bracer(x, y){ return '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="12" height="12" rx="3" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.8" transform="rotate(-15 ' + x + ' ' + y + ')"/><path d="M' + (x - 4) + ' ' + (y - 3) + 'H' + (x + 3) + '" stroke="' + Z.GL + '" stroke-width="1.4" stroke-linecap="round" transform="rotate(-15 ' + x + ' ' + y + ')"/>'; }
  function fist(x, y){ return '<path d="M' + (x - 7) + ' ' + y + 'Q' + (x - 7) + ' ' + (y - 7) + ' ' + x + ' ' + (y - 7) + 'Q' + (x + 7) + ' ' + (y - 7) + ' ' + (x + 7) + ' ' + y + 'Q' + (x + 7) + ' ' + (y + 7) + ' ' + x + ' ' + (y + 7) + 'Q' + (x - 7) + ' ' + (y + 7) + ' ' + (x - 7) + ' ' + y + 'Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2"/><path d="M' + (x - 6) + ' ' + (y - 2) + 'H' + (x + 1) + 'M' + (x - 6) + ' ' + (y + 2.4) + 'H' + (x + 1) + '" stroke="' + Z.BD + '" stroke-width="1.2" stroke-linecap="round"/>'; }
  /* the main cloud he stands in */
  var cloud = zsCloud(50, 98, 2.2);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + cloud + puff('lgL', 34) + puff('lgR', 66) +
    '<g><g class="pump pL">' + zsBolt(12, 62, 0.85, true) + arm(32, 62, 18, 68) + bracer(20, 67.5) + fist(13, 71) + '</g></g>' +
    '<g><g class="pump pR">' + arm(68, 62, 82, 65) + '</g></g></svg>';
}
function zsFront(c){
  var Z = ZS;
  /* the front fist with a gold bracer, lightning crackling around it; it sits in the weapon group so it jolts when he strikes */
  /* the front of his cloud, so he rises out of it */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + zsCloud(50, 105, 1.75) +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + zsBolt(97, 54, 1, false) +
    '<rect x="78" y="59" width="12" height="12" rx="3" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.8"/><path d="M80 62H87" stroke="' + Z.GL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M86 66Q86 58 93 58Q100 58 100 66Q100 74 93 74Q86 74 86 66Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2"/><path d="M93 59.5Q95 66 93 72.5M96.6 60.5Q98.6 66 96.6 71.5" fill="none" stroke="' + Z.BD + '" stroke-width="1.2" stroke-linecap="round"/>' +
    '</g></g></g></g></svg>';
}
