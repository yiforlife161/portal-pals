/* Anchor Brute (preview, key 'wh'): the owner's drawing: a big sky-blue sea brute with a wide hammer-shaped head and side
   fins, a row of little spikes on top, angry eyes, a huge grin full of sharp teeth around a red mouth, a pale ridged throat
   and belly, muscular arms with cream claws, thick legs with spiky ankle fins and big clawed feet, swinging a grey anchor in
   his front hand. Faces right like every pal (the face looks at you). */
var SHK = { B: '#4ab4dc', BD: '#0c3e5c', BL: '#8ad6f0', P: '#a8e2f2', PD: '#3a8aac', C: '#f2e6c8', CD: '#7a6a48', M: '#5a1424', T: '#c83a52',
  A: '#9aa0aa', AD: '#2e333c', AL: '#dfe3ea', O: '#0a2a3e' };
/* a cream claw pointing in direction (dx, dy) */
function whClaw(x, y, dx, dy, s){
  var Z = SHK, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, px = -uy, py = ux; s = s || 1;
  function P(a, b){ return (x + ux * a * s + px * b * s).toFixed(1) + ' ' + (y + uy * a * s + py * b * s).toFixed(1); }
  /* a little curved cone: wide at the base, a sharp hooked tip */
  return '<path d="M' + P(0, 2.4) + 'Q' + P(3.4, 2.2) + ' ' + P(6.2, -0.6) + 'Q' + P(3, -0.6) + ' ' + P(0, -2.4) + 'Z" fill="' + Z.C + '" stroke="' + Z.CD + '" stroke-width="1" stroke-linejoin="round"/>';
}
function whArt(){
  var Z = SHK, teeth = '', low = '';
  /* upper and lower rows of sharp teeth */
  /* upper row hangs from the top lip (inside the mouth), lower row stands on the bottom lip, smaller, between the gaps */
  for (var i = 0; i < 7; i++){ var x = 36 + i * 4.3, y = 33.4 - 0.4 * Math.cos((i - 3) / 3 * 1.4); teeth += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'L' + (x + 2.15).toFixed(1) + ' ' + (y + 4.6).toFixed(1) + 'L' + (x + 4.3).toFixed(1) + ' ' + y.toFixed(1) + 'Z'; }
  for (i = 0; i < 5; i++){ x = 39.8 + i * 4.1; var b = 46.2 - Math.abs(x + 2.05 - 50) * 0.08; low += 'M' + x.toFixed(1) + ' ' + b.toFixed(1) + 'L' + (x + 2.05).toFixed(1) + ' ' + (b - 3.6).toFixed(1) + 'L' + (x + 4.1).toFixed(1) + ' ' + b.toFixed(1) + 'Z'; }
  return wrapSvg(
    /* body: a broad muscular torso with a pale ridged belly */
    outlined('<path d="M30 46Q50 38 70 46Q74 62 66 78Q50 86 34 78Q26 62 30 46Z"/>', Z.B, Z.BD, 2.6) +
    '<path d="M36 48Q50 44 64 48Q66 62 61 76Q50 81 39 76Q34 62 36 48Z" fill="' + Z.P + '" stroke="' + Z.PD + '" stroke-width="1.6"/>' +
    '<path d="M37 56Q50 60 63 56M37.5 63Q50 67 62.5 63M39 70Q50 74 61 70" fill="none" stroke="' + Z.PD + '" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M31 50Q34 58 33 66M69 50Q66 58 67 66" fill="none" stroke="' + Z.BL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* spikes on top of the head */
    outlined('<path d="M38 18L41 9L45 15L50 6L55 15L59 9L62 18Z"/>', Z.B, Z.BD, 2) +
    /* the wide hammer head with side fins */
    outlined('<path d="M50 14Q66 14 72 22Q84 20 90 26Q86 34 76 36Q74 46 62 49Q50 52 38 49Q26 46 24 36Q14 34 10 26Q16 20 28 22Q34 14 50 14Z"/>', Z.B, Z.BD, 2.6) +
    '<path d="M28 23Q38 17 50 17M74 25Q82 23 87 26" fill="none" stroke="' + Z.BL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* angry eyes near the fin bases, brows pushing down */
    '<ellipse cx="34" cy="27" rx="4.4" ry="3.6" fill="#fff" stroke="' + Z.O + '" stroke-width="1.6"/><circle cx="35.2" cy="27.6" r="2.2" fill="' + Z.O + '"/><circle cx="35.8" cy="26.8" r=".8" fill="#fff"/>' +
    '<ellipse cx="66" cy="27" rx="4.4" ry="3.6" fill="#fff" stroke="' + Z.O + '" stroke-width="1.6"/><circle cx="64.8" cy="27.6" r="2.2" fill="' + Z.O + '"/><circle cx="65.4" cy="26.8" r=".8" fill="#fff"/>' +
    '<path d="M28 22.6L39 26M72 22.6L61 26" stroke="' + Z.O + '" stroke-width="2.8" stroke-linecap="round"/>' +
    '<path d="M47 30L48.5 31M53 30L51.5 31" stroke="' + Z.O + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* the huge grin: red mouth, two rows of sharp teeth */
    '<path d="M34 33Q50 31 68 33Q66 45 50 47Q35 45 34 33Z" fill="' + Z.M + '" stroke="' + Z.O + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M40 43Q50 38.5 60 43Q50 46.5 40 43Z" fill="' + Z.T + '"/>' +
    '<path d="' + low + '" fill="#fff" stroke="' + Z.O + '" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="' + teeth + '" fill="#fff" stroke="' + Z.O + '" stroke-width=".8" stroke-linejoin="round"/>' +
    /* gill lines on the throat */
    '<path d="M38 50Q50 54 62 50" fill="none" stroke="' + Z.PD + '" stroke-width="1.4" stroke-linecap="round"/>');
}
/* an iron chain hanging along a quadratic curve: links turned along the curve, every other one seen edge-on */
function whChain(x0, y0, cx, cy, x1, y1){
  var Z = SHK, out = '', n = 22;
  for (var i = 0; i <= n; i++){
    var t = i / n, u = 1 - t, x = u * u * x0 + 2 * u * t * cx + t * t * x1, y = u * u * y0 + 2 * u * t * cy + t * t * y1;
    var dx = 2 * u * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * u * (cy - y0) + 2 * t * (y1 - cy), a = Math.atan2(dy, dx) * 180 / Math.PI;
    out += i % 2 ? '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="2.6" ry=".9" transform="rotate(' + a.toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')" fill="' + Z.A + '" stroke="' + Z.AD + '" stroke-width=".9"/>'
      : '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="2.6" ry="1.7" transform="rotate(' + a.toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')" fill="none" stroke="' + Z.AD + '" stroke-width="2.2"/>' +
        '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="2.6" ry="1.7" transform="rotate(' + a.toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')" fill="none" stroke="' + Z.A + '" stroke-width="1.1"/>';
  }
  return out;
}
function whBack(c){
  var Z = SHK;
  /* thick legs with a spiky ankle fin and big feet with three cream claws */
  function leg(cls, x1, x2){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 76L' + x2 + ' 92" stroke="' + Z.BD + '" stroke-width="15" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 76L' + x2 + ' 92" stroke="' + Z.B + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + (x2 - 7) + ' 88L' + (x2 - 12) + ' 84L' + (x2 - 8) + ' 92Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M' + (x2 - 10) + ' 101Q' + (x2 - 10) + ' 92 ' + x2 + ' 92Q' + (x2 + 10) + ' 92 ' + (x2 + 10) + ' 101Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
      whClaw(x2 - 7, 100, -0.4, 1, 1) + whClaw(x2, 101, 0, 1, 1) + whClaw(x2 + 7, 100, 0.4, 1, 1) + '</g>';
  }
  /* back arm: a muscled arm reaching out to the left, an open hand with three claws */
  var arm = '<path d="M33 52Q22 50 12 56" fill="none" stroke="' + Z.BD + '" stroke-width="13" stroke-linecap="round"/>' +
    '<path d="M33 52Q22 50 12 56" fill="none" stroke="' + Z.B + '" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M27 49Q22 48 18 50" fill="none" stroke="' + Z.BL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<ellipse cx="9" cy="57" rx="6" ry="5" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2"/>' +
    whClaw(5, 53, -1, -0.6, 0.9) + whClaw(4, 58, -1, 0.1, 0.9) + whClaw(6, 62, -0.8, 0.8, 0.9);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38) + leg('lgR', 59, 62) +
    '<g><g class="pump pL">' + arm + whChain(9, 60, 44, 104, 82, 66) + '</g></g></svg>';
}
function whFront(c){
  var Z = SHK;
  /* the anchor: ring on top, a stock across, a long shank and two curved flukes; in the weapon group so it swings */
  var anchor = '<g transform="rotate(-12 84 62)">' +
    '<circle cx="84" cy="22" r="5" fill="none" stroke="' + Z.AD + '" stroke-width="5.4"/><circle cx="84" cy="22" r="5" fill="none" stroke="' + Z.A + '" stroke-width="2.8"/>' +
    '<rect x="72" y="30" width="24" height="5" rx="2" fill="' + Z.A + '" stroke="' + Z.AD + '" stroke-width="1.8"/>' +
    '<rect x="81.4" y="26" width="5.2" height="52" rx="2" fill="' + Z.A + '" stroke="' + Z.AD + '" stroke-width="1.8"/>' +
    '<path d="M64 72L66 58L73 67Q75 78 84 81Q93 78 95 67L102 58L104 72Q98 87 84 91Q70 87 64 72Z" fill="' + Z.A + '" stroke="' + Z.AD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M83 30V76M74 32H93" stroke="' + Z.AL + '" stroke-width="1.1" stroke-linecap="round"/></g>';
  /* front arm: a muscled arm out to the right, the fist closed around the shank */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><path d="M67 52Q76 54 82 60" fill="none" stroke="' + Z.BD + '" stroke-width="13" stroke-linecap="round"/>' +
    '<path d="M67 52Q76 54 82 60" fill="none" stroke="' + Z.B + '" stroke-width="9" stroke-linecap="round"/>' +
    '<g class="wpn"><g transform="translate(84 62) scale(.78) translate(-84 -62)">' + anchor + '</g>' +
    '<ellipse cx="84" cy="62" rx="6.4" ry="5.6" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="2"/>' +
    whClaw(86, 57.6, 1, 0.1, 0.8) + whClaw(87, 62, 1, 0.2, 0.8) + whClaw(86, 66.4, 1, 0.4, 0.8) + '</g></g></g></svg>';
}
