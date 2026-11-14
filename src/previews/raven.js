/* Night Raven (preview, key 'rv'): the owner's drawing: a chibi black-and-blue owl-raven with a spiky black crest,
   blue horn-like ear tufts and face mask, big angry lime-green eyes, an open yellow beak with a red tongue, a fluffy
   black body with a blue chest ruff, a silver belt, wings for arms with silver cuffs, black legs with silver ankle bands,
   dark blue clawed feet with grey talons and a blue-tipped tail. Faces right like every pal (the face looks at you). */
var RV = { K: '#1d1f2a', KD: '#05060a', KL: '#3a3e52', B: '#2a4ea8', BD: '#0e1e4a', BL: '#4a78d8', G: '#b8ec3a', GD: '#3a5a08',
  Y: '#f6c43a', YD: '#8a5a00', S: '#b8bec8', SD: '#4a505c', SL: '#eef1f5', R: '#e0485a', T: '#8a8e98' };
/* a wing for an arm: black upper arm with a silver cuff, a fan of blue feathers below; dir 1 = points right */
function rvWing(x, y, dir, s){
  var Z = RV;
  var fan = 'M0 -6Q16 -11 34 -7L39 -2L31 1L37 6L28 7L32 13L23 12L25 18L16 14L15 20L8 13Q1 9 0 4Z';
  var arm = 'M0 -6Q16 -11 31 -8L34 -4Q19 -1 3 4Z';
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (dir * s) + ' ' + s + ')">' +
    '<path d="' + fan + '" fill="' + Z.B + '" stroke="' + Z.KD + '" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M12 4L22 9M14 7L18 15M20 2L30 4" stroke="' + Z.BL + '" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="' + arm + '" fill="' + Z.K + '" stroke="' + Z.KD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M6 -4Q16 -7 26 -6" stroke="' + Z.KL + '" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    /* silver cuff */
    '<path d="M13 -9.6L18 -10L19 -1.6L14 0Z" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M15 -8.6L15.8 -1.2" stroke="' + Z.SL + '" stroke-width="1" stroke-linecap="round"/></g>';
}
function rvArt(){
  var Z = RV;
  /* spiky outline around the head: the black crest feathers and cheek tufts */
  var crest = 'M50 1L55 12L62 5L63 16L72 12L69 22L78 22L72 29L28 29L22 22L31 22L28 12L37 16L38 5L45 12Z';
  return wrapSvg(
    /* tail: three blue feathers fanning out behind to the left from a black base */
    [[74, -8], [82, 0], [90, 8]].map(function(f){ var y = f[0]; return '<path d="M38 85Q24 ' + (y - 5) + ' 6 ' + y + 'Q22 ' + (y + 5) + ' 38 87Z" fill="' + Z.B + '" stroke="' + Z.KD + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M34 86Q22 ' + y + ' 10 ' + y + '" stroke="' + Z.BL + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'; }).join('') +
    '<path d="M40 80Q28 80 22 86Q28 92 40 90Z" fill="' + Z.K + '" stroke="' + Z.KD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    /* fluffy black body with a jagged edge, blue chest ruff */
    outlined('<path d="M33 64Q50 56 67 64L69 72L66 74L70 80L66 84Q50 92 34 84L30 80L34 74L31 72Z"/>', Z.K, Z.KD, 2.6) +
    '<path d="M38 64Q50 70 62 64L58 72L55 69L52 78L50 72L48 78L45 69L42 72Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M38 77Q42 75 44 79M56 79Q58 75 62 77" fill="none" stroke="' + Z.KL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* silver belt */
    outlined('<path d="M32 81Q50 87 68 81L68.5 85.5Q50 92 31.5 85.5Z"/>', Z.S, Z.SD, 1.6) +
    '<path d="M36 83.4Q50 88 64 83.4" fill="none" stroke="' + Z.SL + '" stroke-width="1" stroke-linecap="round"/>' +
    /* blue feather tuft hanging between the legs */
    '<path d="M44 88L50 98L56 88Z" fill="' + Z.B + '" stroke="' + Z.KD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    /* head: crest behind, then the round black head */
    outlined('<path d="' + crest + '"/>', Z.K, Z.KD, 2.2) +
    '<path d="M50 4L52 14M62 8L60 18M38 8L40 18" stroke="' + Z.B + '" stroke-width="2.2" stroke-linecap="round"/>' +
    outlined('<path d="M50 17C67 17 77 28 77 42C77 56 66 64 50 64C34 64 23 56 23 42C23 28 33 17 50 17Z"/>', Z.K, Z.KD, 2.6) +
    /* blue ear tufts like little horns */
    outlined('<path d="M30 28Q20 18 12 12Q22 14 34 22Z"/>', Z.B, Z.KD, 2) +
    outlined('<path d="M70 28Q80 18 88 12Q78 14 66 22Z"/>', Z.B, Z.KD, 2) +
    /* blue face mask: a heart-ish disc that peaks between the eyes into angry brows */
    '<path d="M50 34Q41 25 30 29Q24 40 30 52Q38 61 50 61Q62 61 70 52Q76 40 70 29Q59 25 50 34Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M34 32Q30 40 33 48M66 32Q70 40 67 48" fill="none" stroke="' + Z.BL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* big lime eyes under angry brows */
    '<ellipse cx="40" cy="42" rx="7" ry="7.4" fill="' + Z.G + '" stroke="' + Z.KD + '" stroke-width="2"/><circle cx="41.5" cy="43" r="4.2" fill="' + Z.KD + '"/><circle cx="43" cy="41.2" r="1.4" fill="#fff"/>' +
    '<ellipse cx="60" cy="42" rx="7" ry="7.4" fill="' + Z.G + '" stroke="' + Z.KD + '" stroke-width="2"/><circle cx="58.5" cy="43" r="4.2" fill="' + Z.KD + '"/><circle cx="60" cy="41.2" r="1.4" fill="#fff"/>' +
    '<path d="M31 33L46 38.5M69 33L54 38.5" stroke="' + Z.KD + '" stroke-width="3.6" stroke-linecap="round"/>' +
    /* open yellow beak with a red tongue */
    outlined('<path d="M43 49Q50 45 57 49L53 55Q50 53 47 55Z"/>', Z.Y, Z.YD, 2) +
    outlined('<path d="M46 55.6Q50 54 54 55.6L51.6 59Q50 60.4 48.4 59Z"/>', Z.Y, Z.YD, 1.8) +
    '<path d="M47.4 55.4Q50 54.2 52.6 55.4L50 57.6Z" fill="' + Z.R + '"/>' +
    '<path d="M45.5 50Q50 48 54.5 50" fill="none" stroke="#fff3c0" stroke-width="1.2" stroke-linecap="round"/>');
}
function rvBack(c){
  var Z = RV;
  /* black legs with silver ankle bands, dark blue feet with grey talons */
  function leg(cls, x1, x2){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + Z.KD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 95" stroke="' + Z.K + '" stroke-width="7.4" stroke-linecap="round"/>' +
      '<rect x="' + (x2 - 5.6) + '" y="91" width="11.2" height="4.4" rx="1.6" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="1.4"/>' +
      '<path d="M' + (x2 - 8) + ' 101Q' + (x2 - 8) + ' 95 ' + x2 + ' 95Q' + (x2 + 8) + ' 95 ' + (x2 + 8) + ' 101Z" fill="' + Z.BD + '" stroke="' + Z.KD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M' + (x2 - 7) + ' 100l-2 4M' + x2 + ' 101l0 4M' + (x2 + 7) + ' 100l2 4" stroke="' + Z.T + '" stroke-width="2.6" stroke-linecap="round"/></g>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 42, 39) + leg('lgR', 58, 61) +
    '<g><g class="pump pL">' + rvWing(35, 67, -1, 1.02) + '</g></g></svg>';
}
function rvFront(c){
  /* the front wing sits in the weapon group so it flaps when he attacks (he throws feather darts) */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + rvWing(65, 67, 1, 1.02) + '</g></g></g></svg>';
}
