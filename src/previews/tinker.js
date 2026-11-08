/* Technician girl (no name yet): the owner's own drawing of a red-haired mechanic in blue armour with gold trim and a gold gear
   emblem, a brown suit underneath, blue bracers and boots with gold bands, and a big silver wrench (Tech, melee). (preview only) */
var TK = { S: '#f3c49a', SD: '#8a5a3c', H: '#e0362a', HD: '#6a120c', HL: '#ff6a52', B: '#2f62d8', BD: '#122c72', BL: '#6b92f2', Y: '#f2b81e', YD: '#7a5400', N: '#6a4024', ND: '#2e1a0c', M: '#c9ced8', MD: '#4a5060' };
function tkGear(cx, cy, r){
  var T = TK, d = '', i;
  for (i = 0; i < 8; i++){ var a = i * Math.PI / 4; d += '<rect x="' + (cx - r * 0.22).toFixed(1) + '" y="' + (cy - r * 1.18).toFixed(1) + '" width="' + (r * 0.44).toFixed(1) + '" height="' + (r * 0.5).toFixed(1) + '" rx="' + (r * 0.1).toFixed(1) + '" fill="' + T.Y + '" stroke="' + T.YD + '" stroke-width=".9" transform="rotate(' + (i * 45) + ' ' + cx + ' ' + cy + ')"/>'; }
  return d + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + T.Y + '" stroke="' + T.YD + '" stroke-width="1.2"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.42) + '" fill="' + T.B + '" stroke="' + T.YD + '" stroke-width=".9"/>';
}
function tkArt(){
  var T = TK, O = '#1e1410';
  return wrapSvg(
    /* hair at the back */
    outlined('<path d="M29 34C27 18 37 11 50 11C63 11 73 18 71 34L72 47Q73 52 76 53Q70 56 66 51L64 44L36 44L34 51Q30 56 24 53Q27 52 28 47Z"/>', T.H, T.HD, 2.4) +
    /* brown suit, blue armour vest with a gold gear emblem, a gold belt and blue tassets */
    outlined('<path d="M37 60Q50 55 63 60L64 84Q50 88 36 84Z"/>', T.N, T.ND) +
    outlined('<path d="M38 60Q50 55 62 60L61 78Q50 81 39 78Z"/>', T.B, T.BD, 2.2) +
    '<path d="M42 62Q46 70 44 76" fill="none" stroke="' + T.BL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    tkGear(50, 67, 4.2) +
    outlined('<path d="M36 76Q50 80 64 76L64 81Q50 85 36 81Z"/>', T.Y, T.YD, 1.8) + tkGear(50, 80, 3.2) +
    outlined('<path d="M36 81L44 83L42 92L33 89Z"/><path d="M64 81L56 83L58 92L67 89Z"/>', T.B, T.BD, 2) +
    /* gold shoulder caps */
    outlined('<path d="M33 58Q36 53 42 55L41 61Q36 62 33 60Z"/><path d="M67 58Q64 53 58 55L59 61Q64 62 67 60Z"/>', T.Y, T.YD, 1.8) +
    /* neck and head */
    '<rect x="46" y="52" width="8" height="8" fill="' + T.S + '" stroke="' + T.SD + '" stroke-width="1.6"/>' +
    outlined('<path d="M50 20C61 20 68 28 68 38C68 48 61 56 50 56C39 56 32 48 32 38C32 28 39 20 50 20Z"/>', T.S, T.SD) +
    /* red fringe */
    outlined('<path d="M31 38C30 24 39 16 51 16C63 16 71 24 69 37Q65 30 58 28Q52 34 42 31Q36 32 31 38Z"/>', T.H, T.HD, 2.2) +
    '<path d="M40 21Q47 18 54 18.5" fill="none" stroke="' + T.HL + '" stroke-width="1.8" stroke-linecap="round"/>' +
    /* blue eyes, brows, a confident grin */
    '<ellipse cx="42" cy="39.5" rx="3.8" ry="4.4" fill="#fff" stroke="' + O + '" stroke-width="1.3"/><circle cx="42.6" cy="40" r="2.4" fill="#2f6fd6"/><circle cx="42.8" cy="40.2" r="1.2" fill="' + O + '"/><circle cx="43.5" cy="38.9" r="0.7" fill="#fff"/>' +
    '<ellipse cx="58" cy="39.5" rx="3.8" ry="4.4" fill="#fff" stroke="' + O + '" stroke-width="1.3"/><circle cx="57.4" cy="40" r="2.4" fill="#2f6fd6"/><circle cx="57.2" cy="40.2" r="1.2" fill="' + O + '"/><circle cx="58.1" cy="38.9" r="0.7" fill="#fff"/>' +
    '<path d="M37.5 33.6L46 35M62.5 33.6L54 35" stroke="' + T.HD + '" stroke-width="1.9" stroke-linecap="round"/>' +
    '<path d="M44 47.5Q50 52 57 47" fill="#fff" stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<circle cx="38" cy="45" r="2" fill="#ff8a7a" fill-opacity=".45"/><circle cx="62" cy="45" r="2" fill="#ff8a7a" fill-opacity=".45"/>');
}
function tkBack(c){
  var T = TK;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 94" stroke="' + T.ND + '" stroke-width="7.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 94" stroke="' + T.N + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 6) + ' 104L' + (fx - 5.5) + ' 91H' + (fx + 5) + 'L' + (fx + 5.5) + ' 97Q' + (fx + 10) + ' 98 ' + (fx + 10) + ' 104Z" fill="' + T.B + '" stroke="' + T.BD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 5.5) + ' 95.5H' + (fx + 5) + '" stroke="' + T.Y + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 6) + ' 103.6H' + (fx + 10) + '" stroke="#3a3a46" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.ND + '" stroke-width="6.6" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.N + '" stroke-width="3.6" stroke-linecap="round"/>';
  }
  function bracer(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.BD + '" stroke-width="8.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + T.B + '" stroke-width="5.6" stroke-linecap="round"/>';
  }
  /* back arm: a fist in a blue bracer with gold bands */
  var back = bracer(24, 66, 16, 68) + '<path d="M24 64L23.5 68.5M18 65.5L17.8 70" stroke="' + T.Y + '" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="13" cy="69" r="3.8" fill="' + T.S + '" stroke="' + T.SD + '" stroke-width="1.6"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 42, 39) + leg('lgR', 56, 58, 61) +
    '<g><g class="pump pL">' + arm(37, 62, 22, 67) + back + '</g></g>' +
    '<g><g class="pump pR">' + arm(63, 62, 78, 64) + bracer(76, 63.5, 83, 64.5) + '<path d="M77 61.5L77 66" stroke="' + T.Y + '" stroke-width="2" stroke-linecap="round"/></g></g></svg>';
}
function tkFront(c){
  var T = TK;
  /* the big silver wrench, held up in the weapon group so it swings when she hits */
  function head(cx, cy, r, ang){      /* an open-end wrench head: a round jaw with the slot facing away from the handle */
    var w = r * 0.42, h = Math.sqrt(r * r - w * w);
    return '<path d="M' + (cx - w) + ' ' + (cy - h) + 'A' + r + ' ' + r + ' 0 1 0 ' + (cx + w) + ' ' + (cy - h) + 'L' + (cx + w) + ' ' + (cy - r * 0.05) + 'L' + (cx - w) + ' ' + (cy - r * 0.05) + 'Z" fill="' + T.M + '" stroke="' + T.MD + '" stroke-width="2" stroke-linejoin="round" transform="rotate(' + ang + ' ' + cx + ' ' + cy + ')"/>';
  }
  var wrench = '<path d="M80 80L96 22" stroke="' + T.MD + '" stroke-width="9.6" stroke-linecap="round"/><path d="M80 80L96 22" stroke="' + T.M + '" stroke-width="6.4" stroke-linecap="round"/>' +
    '<path d="M83 66L93 30" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".7"/>' +
    head(97.5, 17, 10, 15) + head(78.5, 85, 7.5, 195) +
    '<path d="M93 12Q96 9 100 10" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".8"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + wrench + '<circle cx="86" cy="64" r="3.9" fill="' + T.S + '" stroke="' + T.SD + '" stroke-width="1.6"/></g></g></g></svg>';
}
