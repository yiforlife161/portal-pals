/* Bone Rider: the owner's own drawing: a little teal goblin in a red pointed hood-helmet with a gold gem, a brown
   leather vest, dark gloves and red boots, riding a crawling skeleton beast (horned skull with glowing orange eye holes, a
   ribcage, a bony tail and clawed feet); he points ahead and swings a double-bladed axe. Mount faces right like every pal. */
var BN = { B: '#efe2c4', BD: '#3a2c1c', BS: '#cdbb94', E: '#ff8a1e', T: '#3ccfb4', TD: '#0e4a40', H: '#d0342a', HD: '#4a0c08', HL: '#f2765e',
  V: '#7a4a24', VD: '#2e1a0a', VL: '#a8703e', P: '#d8c49a', K: '#2a2a2e', G: '#f2c230', S: '#9aa0ac', SD: '#2a2e38', SL: '#dfe3ea', W: '#7a4e2a' };
function bnBone(x1, y1, x2, y2, w){      /* an outlined bone with knobbly ends */
  var Z = BN; w = w || 6;
  return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + Z.BD + '" stroke-width="' + (w + 3.4) + '" stroke-linecap="round"/>' +
    '<circle cx="' + x1 + '" cy="' + y1 + '" r="' + (w * 0.62 + 1.7) + '" fill="' + Z.BD + '"/><circle cx="' + x2 + '" cy="' + y2 + '" r="' + (w * 0.62 + 1.7) + '" fill="' + Z.BD + '"/>' +
    '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + Z.B + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
    '<circle cx="' + x1 + '" cy="' + y1 + '" r="' + (w * 0.62) + '" fill="' + Z.B + '"/><circle cx="' + x2 + '" cy="' + y2 + '" r="' + (w * 0.62) + '" fill="' + Z.B + '"/>';
}
function bnClaw(x, y){      /* a bony foot with three hooked talons, pointing right */
  var Z = BN;
  return '<path d="M' + (x - 6) + ' ' + y + 'Q' + (x - 2) + ' ' + (y - 5) + ' ' + (x + 5) + ' ' + (y - 2) + 'L' + (x + 7) + ' ' + y + 'Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M' + (x - 5) + ' ' + y + 'q-3 1 -3 5M' + x + ' ' + y + 'q0 2 -1 5M' + (x + 5) + ' ' + y + 'q3 1 3 5" fill="none" stroke="' + Z.BD + '" stroke-width="3.6" stroke-linecap="round"/>' +
    '<path d="M' + (x - 5) + ' ' + y + 'q-3 1 -3 5M' + x + ' ' + y + 'q0 2 -1 5M' + (x + 5) + ' ' + y + 'q3 1 3 5" fill="none" stroke="' + Z.B + '" stroke-width="1.8" stroke-linecap="round"/>';
}
function bnArt(){
  var Z = BN, O = '#1a1410', ribs = '';
  /* the ribcage: curved ribs hanging from the spine */
  [38, 45, 52, 59, 66].forEach(function(x, i){
    var d = 'M' + x + ' 69Q' + (x - 5) + ' ' + (80 + (i % 2)) + ' ' + (x + 1) + ' 87';
    ribs += '<path d="' + d + '" fill="none" stroke="' + Z.BD + '" stroke-width="6.4" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + Z.B + '" stroke-width="3.4" stroke-linecap="round"/>';
  });
  return wrapSvg(
    /* bony tail out to the left */
    bnBone(28, 72, 18, 70, 4.6) + bnBone(18, 70, 9, 72, 3.6) + bnBone(9, 72, 2, 76, 2.6) + '<path d="M2 76L-4 80L1 78Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    ribs +
    '<path d="M38 84Q52 90 68 84" fill="none" stroke="' + Z.BD + '" stroke-width="5" stroke-linecap="round"/><path d="M38 84Q52 90 68 84" fill="none" stroke="' + Z.BS + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* hip and shoulder bones */
    outlined('<ellipse cx="32" cy="72" rx="8" ry="6"/>', Z.B, Z.BD, 2) + outlined('<ellipse cx="72" cy="70" rx="7" ry="7"/>', Z.B, Z.BD, 2) +
    /* the spine with knobbly vertebrae along the top */
    '<path d="M26 69Q50 63 76 66" fill="none" stroke="' + Z.BD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M26 69Q50 63 76 66" fill="none" stroke="' + Z.B + '" stroke-width="4.4" stroke-linecap="round"/>' +
    [30, 36, 42, 60, 66].map(function(x){ var y = 67.2 - Math.sin((x - 26) / 50 * Math.PI) * 3.2; return '<path d="M' + (x - 2.4) + ' ' + y + 'L' + x + ' ' + (y - 5) + 'L' + (x + 2.4) + ' ' + y + 'Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.6" stroke-linejoin="round"/>'; }).join('') +
    /* the rider: tan trousers and red boots astride the spine */
    outlined('<path d="M44 62Q52 56 60 62L58 68H46Z"/>', Z.P, O, 2) +
    outlined('<path d="M42 62L48 62L48 70L40 70Q38 66 42 62Z"/>', Z.H, Z.HD, 2) +
    outlined('<path d="M56 62L62 62Q66 66 64 70L56 70Z"/>', Z.H, Z.HD, 2) +
    /* teal body in a brown leather vest */
    outlined('<path d="M42 44Q52 40 62 44L61 60Q52 63 43 60Z"/>', Z.V, Z.VD, 2.2) +
    '<path d="M47 45Q52 52 57 45L56 58Q52 60 48 58Z" fill="' + Z.T + '" stroke="' + Z.TD + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="M44 55H60" stroke="' + Z.K + '" stroke-width="3"/><rect x="50" y="53.4" width="4.4" height="3.4" rx=".8" fill="' + Z.G + '"/>' +
    '<ellipse cx="42" cy="46" rx="5" ry="4" fill="' + Z.VL + '" stroke="' + Z.VD + '" stroke-width="1.6"/><ellipse cx="62" cy="46" rx="5" ry="4" fill="' + Z.VL + '" stroke="' + Z.VD + '" stroke-width="1.6"/>' +
    /* big pointy ears */
    '<path d="M40 30L24 22L38 38Z" fill="' + Z.T + '" stroke="' + Z.TD + '" stroke-width="2" stroke-linejoin="round"/><path d="M36 29L28 25L37 34Z" fill="#7ae8d4"/>' +
    '<path d="M64 30L80 22L66 38Z" fill="' + Z.T + '" stroke="' + Z.TD + '" stroke-width="2" stroke-linejoin="round"/><path d="M68 29L76 25L67 34Z" fill="#7ae8d4"/>' +
    /* the teal face */
    outlined('<path d="M52 24C61 24 66 30 66 36C66 42 60 46 52 46C44 46 38 42 38 36C38 30 43 24 52 24Z"/>', Z.T, Z.TD, 2) +
    '<ellipse cx="47.6" cy="36" rx="2" ry="2.8" fill="' + O + '"/><ellipse cx="57.4" cy="36" rx="2" ry="2.8" fill="' + O + '"/><circle cx="48.2" cy="35" r=".8" fill="#fff"/><circle cx="58" cy="35" r=".8" fill="#fff"/>' +
    /* the red hood-helmet with a curling point, cheek guards and a gold gem */
    outlined('<path d="M37 34Q36 16 50 12Q58 8 62 2Q66 10 62 16Q68 22 67 34L63 34Q62 27 52 27Q42 27 41 34Z"/>', Z.H, Z.HD, 2) +
    outlined('<path d="M37 33L42 33L41 42L37 40Z M67 33L62 33L63 42L67 40Z"/>', Z.H, Z.HD, 1.6) +
    '<path d="M42 16Q46 12 52 12" fill="none" stroke="' + Z.HL + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M52 16L56 20L52 24L48 20Z" fill="' + Z.G + '" stroke="#7a5a00" stroke-width="1.4" stroke-linejoin="round"/><path d="M52 17.6L53.8 20L52 22.4" fill="none" stroke="#fff2b0" stroke-width=".9"/>' +
    /* the horned skull of the beast, facing right */
    '<path d="M76 62Q74 52 68 48Q76 50 80 60Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M86 60Q88 50 84 44Q92 50 90 62Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    outlined('<path d="M72 66Q74 58 86 58Q98 60 100 70Q100 78 94 82L76 82Q70 76 72 66Z"/>', Z.B, Z.BD, 2) +
    '<circle cx="82" cy="68" r="4.6" fill="' + Z.BD + '"/><circle cx="82" cy="68" r="3.4" fill="' + Z.E + '"/><circle cx="93" cy="68" r="4" fill="' + Z.BD + '"/><circle cx="93" cy="68" r="2.9" fill="' + Z.E + '"/>' +
    '<circle cx="82" cy="68" r="7" fill="' + Z.E + '" fill-opacity=".22"/><circle cx="93" cy="68" r="6" fill="' + Z.E + '" fill-opacity=".22"/>' +
    '<path d="M76 79L80 75L83 79L86 75L89 79L92 75L95 79" fill="none" stroke="' + Z.BD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M98 72L100 74" stroke="' + Z.BD + '" stroke-width="1.4"/><path d="M76 62Q82 59 88 60" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>');
}
function bnBack(c){
  var Z = BN;
  /* four bony legs: each walk group moves one front and one back leg */
  function leg(cls, hx, kx, fx, dark){
    var col = dark ? 'opacity=".8"' : '';
    return '<g class="lg ' + cls + '" ' + col + '>' + bnBone(hx, 72, kx, 86, 5.4) + bnBone(kx, 86, fx, 97, 4.6) + bnClaw(fx, 99) + '</g>';
  }
  /* the goblin's back arm points forward-left; dark gloves */
  var point = '<path d="M44 46L30 42" stroke="' + Z.TD + '" stroke-width="8" stroke-linecap="round"/><path d="M44 46L30 42" stroke="' + Z.T + '" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="28" cy="41.6" r="4.4" fill="' + Z.K + '" stroke="#000" stroke-width="1.4"/><path d="M26 40L19 38.6" stroke="#000" stroke-width="4" stroke-linecap="round"/><path d="M26 40L19 38.6" stroke="' + Z.K + '" stroke-width="2.2" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    leg('lgR', 36, 30, 34, true) + leg('lgL', 74, 80, 74, true) + leg('lgL', 30, 24, 28) + leg('lgR', 70, 74, 70) +
    '<g><g class="pump pL">' + point + '</g></g>' +
    '<g><g class="pump pR"><path d="M60 46L70 48" stroke="' + Z.TD + '" stroke-width="8" stroke-linecap="round"/><path d="M60 46L70 48" stroke="' + Z.T + '" stroke-width="5" stroke-linecap="round"/></g></g></svg>';
}
function bnFront(c){
  var Z = BN;
  /* the double-bladed axe, raised in his front hand; it sits in the weapon group so it chops when he attacks */
  var axe = '<path d="M73 52L80 6" stroke="' + Z.VD + '" stroke-width="6" stroke-linecap="round"/><path d="M73 52L80 6" stroke="' + Z.W + '" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M78 10Q66 4 64 18Q66 30 76 26Z" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M80.4 12Q92 10 92 24Q88 34 78.6 28Z" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M67 14Q66 20 68 24M89 16Q90 22 87 28" fill="none" stroke="' + Z.SL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<rect x="75.6" y="12" width="6" height="16" rx="1.6" transform="rotate(8 78.6 20)" fill="#5a5e6a" stroke="' + Z.SD + '" stroke-width="1.4"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)"><g transform="translate(72 48) scale(1.3) translate(-72 -48)">' + axe + '</g></g>' +
    '<circle cx="72" cy="48" r="4.6" fill="' + Z.K + '" stroke="#000" stroke-width="1.4"/></g></g></g></svg>';
}
