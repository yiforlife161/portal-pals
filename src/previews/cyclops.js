/* Undead cyclops (no name yet): an original pal in the owner's black-and-gold colours. A pale skull head with one big blue eye,
   a cracked horn, a black hood and tattered cloak with gold trim, bony hands, and a bone club (Undead, melee). (preview only) */
var CYC = { K: '#26232c', KD: '#0c0b10', KL: '#3d3946', Y: '#f2b81e', YD: '#7a5400', S: '#e3dccb', SD: '#5e5546', E: '#2f5fd8', ED: '#13286a' };
function cycArt(){
  var C = CYC, O = '#120f18';
  return wrapSvg(
    /* tattered black cloak with a gold trim and a gold rope belt */
    outlined('<path d="M30 58Q50 50 70 58L74 88L68 84L63 90L57 85L50 91L43 85L37 90L32 84L26 88Z"/>', C.K, C.KD) +
    '<path d="M36 60Q50 54 64 60L62 66Q50 61 38 66Z" fill="' + C.Y + '" stroke="' + C.YD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M32 77Q50 82 68 77" fill="none" stroke="' + C.YD + '" stroke-width="5" stroke-linecap="round"/><path d="M32 77Q50 82 68 77" fill="none" stroke="' + C.Y + '" stroke-width="2.8" stroke-linecap="round"/>' +
    '<path d="M47 80L45 88M53 80L55 87" stroke="' + C.Y + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M40 68Q42 74 40 80M60 68Q58 74 60 80" fill="none" stroke="' + C.KL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* black hood behind the head, gold edge */
    outlined('<path d="M24 50C22 28 34 12 50 12C66 12 78 28 76 50L70 60L30 60Z"/>', C.K, C.KD) +
    '<path d="M27 50C26 31 37 16 50 16C63 16 74 31 73 50" fill="none" stroke="' + C.Y + '" stroke-width="3" stroke-linecap="round"/>' +
    /* one cracked horn poking out of the hood */
    outlined('<path d="M47 16Q44 5 52 0Q50 8 55 15Z"/>', C.S, C.SD, 2) +
    '<path d="M49 9L51.5 8.5L50.5 11" fill="none" stroke="' + C.SD + '" stroke-width="1.1" stroke-linecap="round"/>' +
    /* pale skull face */
    outlined('<path d="M50 22C62 22 69 31 69 42C69 49 66 54 61 57L60 61Q50 64 40 61L39 57C34 54 31 49 31 42C31 31 38 22 50 22Z"/>', C.S, C.SD) +
    '<path d="M38 26L42 30L40 33" fill="none" stroke="' + C.SD + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* heavy brow and the one big eye */
    '<ellipse cx="50" cy="40" rx="12.5" ry="11" fill="#1c1a24"/>' +
    '<ellipse cx="50" cy="40.5" rx="10.5" ry="9.5" fill="#fbf8f0" stroke="' + O + '" stroke-width="1.8"/>' +
    '<circle cx="50.5" cy="41" r="6" fill="' + C.E + '" stroke="' + C.ED + '" stroke-width="1.6"/><circle cx="50.5" cy="41" r="2.9" fill="' + O + '"/>' +
    '<circle cx="48.2" cy="38.6" r="1.5" fill="#fff"/><circle cx="53.4" cy="43.4" r="0.8" fill="#bcd0ff"/>' +
    '<path d="M36.5 30Q50 25 63.5 30" fill="none" stroke="' + C.SD + '" stroke-width="3.2" stroke-linecap="round"/>' +
    /* nose holes and a row of square teeth */
    '<path d="M48 53L49.3 51L50.6 53Z" fill="' + C.SD + '"/>' +
    '<path d="M41 55.5Q50 58.5 59 55.5L58 60Q50 62.5 42 60Z" fill="#1c1a24"/>' +
    '<path d="M43 56.6V59.8M46.5 57.4V60.8M50 57.7V61.2M53.5 57.4V60.8M57 56.6V59.8" stroke="' + C.S + '" stroke-width="2.1"/>');
}
function cycBack(c){
  var C = CYC;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 84L' + x2 + ' 96" stroke="' + C.KD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 84L' + x2 + ' 96" stroke="' + C.K + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M' + (x1 + (x2 - x1) * 0.5 - 4) + ' 89.5H' + (x1 + (x2 - x1) * 0.5 + 4) + '" stroke="' + C.Y + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 8) + ' 104Q' + (fx - 8) + ' 95 ' + fx + ' 95Q' + (fx + 9) + ' 95 ' + (fx + 9) + ' 104Z" fill="' + C.K + '" stroke="' + C.KD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx + 1) + ' 97Q' + (fx + 7) + ' 98 ' + (fx + 8) + ' 103" fill="none" stroke="' + C.Y + '" stroke-width="2.2" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.KD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + C.K + '" stroke-width="7" stroke-linecap="round"/>';
  }
  /* back arm: black sleeve with a gold band, a bony hand */
  var hand = '<path d="M17 66.5L22 68" stroke="' + C.Y + '" stroke-width="3.2" stroke-linecap="round"/>' +
    '<circle cx="14.5" cy="71" r="4.4" fill="' + C.S + '" stroke="' + C.SD + '" stroke-width="1.8"/>' +
    '<path d="M11 73.5L9 77M14 75L13.5 78.6M17 74L18 77.5" stroke="' + C.S + '" stroke-width="2.2" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(33, 62, 17, 68) + hand + '</g></g>' +
    '<g><g class="pump pR">' + arm(67, 62, 83, 64) + '<path d="M78 61.5L79.5 66.5" stroke="' + C.Y + '" stroke-width="3.2" stroke-linecap="round"/></g></g></svg>';
}
function cycFront(c){
  var C = CYC;
  /* a big bone club with a gold band, held up in the weapon group so it swings when he hits */
  var club = '<path d="M84 62L92 30" stroke="' + C.SD + '" stroke-width="7" stroke-linecap="round"/><path d="M84 62L92 30" stroke="' + C.S + '" stroke-width="4.2" stroke-linecap="round"/>' +
    '<path d="M90.5 18C97 17 101 23 98.5 30C97 35 90 36 87 32C84 27 85 19 90.5 18Z" fill="' + C.S + '" stroke="' + C.SD + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M89 23Q92 21 95 23" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".8"/>' +
    '<path d="M86 41.5L92.5 43.5" stroke="' + C.YD + '" stroke-width="4.4" stroke-linecap="round"/><path d="M86 41.5L92.5 43.5" stroke="' + C.Y + '" stroke-width="2.6" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + club + '<circle cx="86" cy="64" r="4.8" fill="' + C.S + '" stroke="' + C.SD + '" stroke-width="2"/>' +
    '<path d="M83 66.5L82 69.5M86.5 68L86.5 71" stroke="' + C.S + '" stroke-width="2" stroke-linecap="round"/></g></g></g></svg>';
}
