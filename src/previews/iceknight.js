/* Ice Knightess: the owner's own drawing: a knight in silver armour trimmed with ice, a crested helmet with a dark
   visor and glowing blue eyes, ice-crystal wings behind her, blue scale mail under the plates, a snowflake ice shield and a
   double-bladed ice crystal sword (Water, ranged, Normal). */
var IK = { S: '#d6dce6', SD: '#2a3446', SL: '#ffffff', SM: '#a4aec0', I: '#7ad0ff', ID: '#0e4a8a', IL: '#dff6ff', B: '#2a5ab8', BD: '#0c1e52', BL: '#4a7ad8', V: '#0c1428', E: '#9ae8ff' };
function ikShard(d, glow){ var I = IK; return '<path d="' + d + '" fill="' + I.I + '" fill-opacity="' + (glow ? '.9' : '1') + '" stroke="' + I.ID + '" stroke-width="1.4" stroke-linejoin="round"/>'; }
function ikArt(){
  var I = IK, O = '#0a1020';
  return wrapSvg(
    /* blue scale mail body under a silver breastplate */
    outlined('<path d="M34 60Q50 54 66 60Q70 76 63 90Q50 94 37 90Q30 76 34 60Z"/>', I.B, I.BD) +
    '<path d="M38 70Q41 72 44 70M44 70Q47 72 50 70M50 70Q53 72 56 70M56 70Q59 72 62 70M37 78Q40 80 43 78M43 78Q46 80 49 78M51 78Q54 80 57 78M57 78Q60 80 63 78" fill="none" stroke="' + I.BL + '" stroke-width="1.1"/>' +
    outlined('<path d="M37 60Q50 55 63 60L61 74Q50 80 39 74Z"/>', I.S, I.SD, 2) +
    '<path d="M44 63Q50 66 56 63L50 72Z" fill="' + I.I + '" stroke="' + I.ID + '" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="M40 61Q45 58 49 58" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
    /* silver tassets (hip plates) with an ice gem */
    outlined('<path d="M36 80L50 84L64 80L62 90L50 92L38 90Z"/>', I.S, I.SD, 1.8) + '<path d="M48 84L50 81L52 84L50 88Z" fill="' + I.I + '" stroke="' + I.ID + '" stroke-width="1"/>' +
    /* ice shoulder spikes */
    ikShard('M32 58L22 50L30 52L28 44L36 54Z') + ikShard('M68 58L78 50L70 52L72 44L64 54Z') +
    /* the crested helmet with ice fins */
    ikShard('M34 30L26 14L32 18L32 8L38 24Z') + ikShard('M66 30L74 14L68 18L68 8L62 24Z') +
    outlined('<path d="M50 14C63 14 70 23 70 35C70 47 62 56 50 58C38 56 30 47 30 35C30 23 37 14 50 14Z"/>', I.S, I.SD) +
    '<path d="M36 22Q42 17 48 16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>' +
    ikShard('M50 12L54 18L52 30L50 34L48 30L46 18Z') +
    /* dark visor with glowing eyes */
    '<path d="M34 34Q50 30 66 34L63 43Q56 41 50 46Q44 41 37 43Z" fill="' + I.V + '" stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M38 37L46 39L45 41.4L39 40Z M62 37L54 39L55 41.4L61 40Z" fill="' + I.E + '"/>' +
    '<circle cx="42" cy="39" r="4.4" fill="' + I.E + '" fill-opacity=".25"/><circle cx="58" cy="39" r="4.4" fill="' + I.E + '" fill-opacity=".25"/>' +
    /* the helmet's pointed faceplate */
    '<path d="M38 45Q44 44 50 50Q56 44 62 45L56 54L50 57L44 54Z" fill="' + I.SM + '" stroke="' + I.SD + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M44 48Q47 49 50 52" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>');
}
function ikBack(c){
  var I = IK;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 88L' + x2 + ' 96" stroke="' + I.BD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 88L' + x2 + ' 96" stroke="' + I.B + '" stroke-width="5.4" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 7) + ' 104L' + (fx - 6) + ' 94H' + (fx + 6) + 'L' + (fx + 7) + ' 98Q' + (fx + 11) + ' 100 ' + (fx + 11) + ' 104Z" fill="' + I.S + '" stroke="' + I.SD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 2) + ' 94L' + fx + ' 90L' + (fx + 2) + ' 94Z" fill="' + I.I + '" stroke="' + I.ID + '" stroke-width="1"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + I.SD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + I.S + '" stroke-width="5.6" stroke-linecap="round"/>';
  }
  /* ice-crystal wings fanning out behind her */
  function wing(m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    return ikShard('M' + X(40) + ' 56L' + X(14) + ' 18L' + X(22) + ' 34L' + X(16) + ' 30L' + X(26) + ' 46L' + X(18) + ' 46L' + X(36) + ' 60Z') +
      '<path d="M' + X(36) + ' 54L' + X(18) + ' 24" stroke="' + I.IL + '" stroke-width="1.2" stroke-linecap="round"/>';
  }
  /* the snowflake ice shield on her back arm */
  var shield = '<path d="M14 54Q24 58 24 72Q22 84 14 90Q6 84 4 72Q4 58 14 54Z" fill="' + I.I + '" stroke="' + I.ID + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M14 58Q21 61 21 72Q19.6 81 14 86Q8.4 81 7 72Q7 61 14 58Z" fill="' + I.IL + '" fill-opacity=".35"/>' +
    '<path d="M14 63V81M6.8 67L21.2 77M21.2 67L6.8 77M14 63L12 65.4M14 63L16 65.4M14 81L12 78.6M14 81L16 78.6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wing(1) + wing(-1) + leg('lgL', 43, 41, 39) + leg('lgR', 57, 59, 61) +
    '<g><g class="pump pL">' + arm(35, 64, 21, 69) + shield + '</g></g>' +
    '<g><g class="pump pR">' + arm(65, 64, 81, 66) + '</g></g></svg>';
}
function ikFront(c){
  var I = IK;
  /* a double-bladed ice sword: one blade above her hand and one below; it sits in the weapon group so it jolts when she casts */
  function blade(m){      /* m = 1 up, -1 down, mirrored around the grip at y 66 */
    function Y(y){ return (66 + (y - 66) * m).toFixed(1); }
    return '<path d="M84 ' + Y(62) + 'L89 ' + Y(24) + 'L92 ' + Y(18) + 'L95 ' + Y(24) + 'L94 ' + Y(62) + 'Z" fill="' + I.I + '" stroke="' + I.ID + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M91.4 ' + Y(26) + 'L89 ' + Y(58) + '" stroke="' + I.IL + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M79 ' + Y(61) + 'Q89 ' + Y(57) + ' 99 ' + Y(61) + 'L97 ' + Y(64) + 'Q89 ' + Y(60.6) + ' 81 ' + Y(64) + 'Z" fill="' + I.I + '" stroke="' + I.ID + '" stroke-width="1.3" stroke-linejoin="round"/>';
  }
  var sword = blade(1) + blade(-1) + '<rect x="85.4" y="62.6" width="7.2" height="6.8" rx="1.6" fill="' + I.SM + '" stroke="' + I.SD + '" stroke-width="1.2"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + sword + '</g>' +
    '<circle cx="86" cy="66" r="4.4" fill="' + I.S + '" stroke="' + I.SD + '" stroke-width="1.8"/></g></g></g></svg>';
}
