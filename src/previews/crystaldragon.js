/* Crystal Dragon (preview, key 'cd'): the owner's drawing, done as a gem dragon: a pale icy-blue little dragon whose wings,
   crest and tail tip are clusters of cut crystal shards (each shard two-toned like a faceted gem), white glowing eyes, a
   grin with fangs and a purple tongue, a blue belly plate with chevrons, jagged blue cuffs, and purple gem claws on his
   hands and feet. Faces right like every pal (the face looks at you). */
var CRYS = { P: '#d6e6ff', PD: '#1a2a5a', PL: '#ffffff', B: '#5c9cf0', BD: '#1a3e8a', BL: '#a8ccff', F: '#3a78e0', U: '#9a7af0', UD: '#3a1e7a', UL: '#d8c8ff',
  M: '#5a1a48', T: '#a8306a' };
/* one cut crystal shard from (x, y) pointing at angle a (degrees), length l, width w: two facets, a light one and a dark one */
function crysShard(x, y, a, l, w, c1, c2){
  var Z = CRYS, r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), px = -uy, py = ux;
  function P(s, t){ return (x + ux * s + px * t).toFixed(1) + ' ' + (y + uy * s + py * t).toFixed(1); }
  return '<path d="M' + P(0, -w * 0.5) + 'L' + P(l * 0.8, -w * 0.5) + 'L' + P(l, 0) + 'L' + P(0, 0) + 'Z" fill="' + (c1 || Z.BL) + '"/>' +
    '<path d="M' + P(0, 0) + 'L' + P(l, 0) + 'L' + P(l * 0.8, w * 0.5) + 'L' + P(0, w * 0.5) + 'Z" fill="' + (c2 || Z.B) + '"/>' +
    '<path d="M' + P(0, -w * 0.5) + 'L' + P(l * 0.8, -w * 0.5) + 'L' + P(l, 0) + 'L' + P(l * 0.8, w * 0.5) + 'L' + P(0, w * 0.5) + 'Z" fill="none" stroke="' + Z.PD + '" stroke-width="1.6" stroke-linejoin="round"/>';
}
/* a purple gem claw */
function crysClaw(x, y, a, s){
  var Z = CRYS, r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), px = -uy, py = ux; s = s || 1;
  function P(t, u){ return (x + ux * t * s + px * u * s).toFixed(1) + ' ' + (y + uy * t * s + py * u * s).toFixed(1); }
  return '<path d="M' + P(0, -2.6) + 'L' + P(4, -2.2) + 'L' + P(6.6, 0) + 'L' + P(4, 2.2) + 'L' + P(0, 2.6) + 'Z" fill="' + Z.U + '" stroke="' + Z.UD + '" stroke-width="1.1" stroke-linejoin="round"/>' +
    '<path d="M' + P(1, -1.4) + 'L' + P(4.4, -1.2) + '" stroke="' + Z.UL + '" stroke-width=".9" stroke-linecap="round"/>';
}
/* a wing: a fan of shards from the shoulder; m = -1 for the left wing */
function crysWing(x, y, m){
  var out = '', L = [[-108, 30, 10], [-128, 38, 11], [-148, 40, 11], [-166, 36, 10], [-184, 28, 9]];
  if (m > 0) L = L.map(function(s){ return [-180 - s[0], s[1], s[2]]; });
  L.slice().reverse().forEach(function(s, i){ out += crysShard(x, y, s[0], s[1], s[2], i % 2 ? CRYS.BL : '#c4dcff', i % 2 ? CRYS.F : CRYS.B); });
  return out;
}
function crysArt(){
  var Z = CRYS;
  /* the crest: a ring of shards around the head */
  var crest = '';
  [[-90, 13], [-62, 11], [-118, 11], [-36, 9], [-144, 9], [-12, 8], [-168, 8], [14, 7], [166, 7]].forEach(function(s){ crest += crysShard(50 + Math.cos(s[0] * Math.PI / 180) * 10, 30 + Math.sin(s[0] * Math.PI / 180) * 10, s[0], s[1], 6.4); });
  return wrapSvg(
    /* wings behind everything */
    crysWing(41, 50, -1) + crysWing(59, 50, 1) +
    /* tail: curls out to the left and ends in a big shard */
    '<path d="M46 72Q28 94 12 88Q4 84 10 77" fill="none" stroke="' + Z.PD + '" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M46 72Q28 94 12 88Q4 84 10 77" fill="none" stroke="' + Z.P + '" stroke-width="5.6" stroke-linecap="round"/>' +
    '<path d="M38 82Q28 90 17 88" fill="none" stroke="' + Z.B + '" stroke-width="1.8" stroke-linecap="round"/>' +
    crysShard(10, 78, -35, 15, 9) +
    /* body with a blue belly plate */
    outlined('<path d="M41 46Q50 42 59 46Q63 60 58 72Q50 77 42 72Q37 60 41 46Z"/>', Z.P, Z.PD, 2.2) +
    '<path d="M45 47Q50 45 55 47Q57 60 54 71Q50 73.4 46 71Q43 60 45 47Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.4"/>' +
    '<path d="M45.6 52L50 54.4L54.4 52M45 57.6L50 60L55 57.6M45 63.2L50 65.6L55 63.2M46 68.6L50 71L54 68.6" fill="none" stroke="' + Z.BD + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    /* purple shoulder gems */
    crysShard(42, 47, -120, 6, 5, Z.UL, Z.U) + crysShard(58, 47, -60, 6, 5, Z.UL, Z.U) +
    /* head: crest behind, then the face */
    crest +
    crysShard(42, 22, -120, 10, 5, Z.UL, Z.U) + crysShard(58, 22, -60, 10, 5, Z.UL, Z.U) +
    outlined('<path d="M50 19C60 19 65 25 65 31C65 35 63 38 60 40Q58 45 50 45.4Q42 45 40 40C37 38 35 35 35 31C35 25 40 19 50 19Z"/>', Z.P, Z.PD, 2.2) +
    '<path d="M50 20L53 26L50 30L47 26Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.1" stroke-linejoin="round"/>' +
    /* white eyes with a dark rim, a little glow */
    '<path d="M40 30Q44 26 47.4 30.6Q45 34.6 41.6 33.6Q40 32.6 40 30Z" fill="#fff" stroke="' + Z.PD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M60 30Q56 26 52.6 30.6Q55 34.6 58.4 33.6Q60 32.6 60 30Z" fill="#fff" stroke="' + Z.PD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M48.6 34.6L49.4 35.2M51.4 34.6L50.6 35.2" stroke="' + Z.PD + '" stroke-width="1" stroke-linecap="round"/>' +
    /* grin with fangs and a purple tongue */
    '<path d="M43.4 37.4Q50 36.6 56.6 37.4Q55 43.6 50 43.6Q45 43.6 43.4 37.4Z" fill="' + Z.M + '" stroke="' + Z.PD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M46 41.6Q50 39.4 54 41.6Q50 43.6 46 41.6Z" fill="' + Z.T + '"/>' +
    '<path d="M44.6 37.6L46 40L47.4 37.4ZM52.6 37.4L54 40L55.4 37.6Z" fill="#fff" stroke="' + Z.PD + '" stroke-width=".7" stroke-linejoin="round"/>');
}
function crysBack(c){
  var Z = CRYS;
  /* legs with a jagged blue stripe and feet with purple gem claws */
  function leg(cls, x1, x2){
    /* a chunky thigh, a short shin, a wide foot */
    return '<g class="lg ' + cls + '"><ellipse cx="' + x1 + '" cy="78" rx="6.4" ry="7.4" fill="' + Z.P + '" stroke="' + Z.PD + '" stroke-width="2"/>' +
      '<path d="M' + x1 + ' 83L' + x2 + ' 93" stroke="' + Z.PD + '" stroke-width="9" stroke-linecap="round"/><path d="M' + x1 + ' 83L' + x2 + ' 93" stroke="' + Z.P + '" stroke-width="5.8" stroke-linecap="round"/>' +
      '<path d="M' + (x1 - 3) + ' 74L' + (x1 - 1) + ' 77L' + (x1 + 1) + ' 74.6L' + (x1 + 3) + ' 78" fill="none" stroke="' + Z.B + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<ellipse cx="' + x2 + '" cy="96" rx="7" ry="3.8" fill="' + Z.P + '" stroke="' + Z.PD + '" stroke-width="1.8"/>' +
      crysClaw(x2 - 4.6, 98, 115, 0.85) + crysClaw(x2, 99, 90, 0.85) + crysClaw(x2 + 4.6, 98, 65, 0.85) + '</g>';
  }
  /* back arm out to the left, a jagged cuff, a hand with three purple claws */
  var arm = '<path d="M42 52L26 60" stroke="' + Z.PD + '" stroke-width="8" stroke-linecap="round"/><path d="M42 52L26 60" stroke="' + Z.P + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M33 53.4L31 58.6L29 54.6L27 59.4" fill="none" stroke="' + Z.B + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="24" cy="61" r="3.6" fill="' + Z.P + '" stroke="' + Z.PD + '" stroke-width="1.6"/>' +
    crysClaw(22, 59, 200, 0.85) + crysClaw(21, 62, 160, 0.85) + crysClaw(23, 64.4, 125, 0.85);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 41) + leg('lgR', 56, 59) +
    '<g><g class="pump pL">' + arm + '</g></g></svg>';
}
function crysFront(c){
  var Z = CRYS;
  /* front arm: the clawed hand is the weapon group (he shoots shards from it) */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><path d="M58 52L74 60" stroke="' + Z.PD + '" stroke-width="8" stroke-linecap="round"/><path d="M58 52L74 60" stroke="' + Z.P + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M67 53.4L69 58.6L71 54.6L73 59.4" fill="none" stroke="' + Z.B + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<g class="wpn"><circle cx="76" cy="61" r="3.6" fill="' + Z.P + '" stroke="' + Z.PD + '" stroke-width="1.6"/>' +
    crysClaw(78, 59, -20, 0.85) + crysClaw(79, 62, 20, 0.85) + crysClaw(77, 64.4, 55, 0.85) + '</g></g></g></svg>';
}
