/* Magma Brute: the owner's own drawing: a round lava rock golem: a ball-shaped head sunk into a bulky body with no
   neck, red rock split by a honeycomb of glowing lava cracks, a heavy brow over angry yellow eyes, a smug smirk, thick legs with
   glowing toe stones, and big round lava fists he hurls fireballs from (Fire, ranged, Normal). Uses lvCracks from the Lava Golem. */
var MR = { R: '#c8301c', RD: '#2e0804', RL: '#f06040', RM: '#8a1e10', E: '#ffd23a' };
function mrHoney(cx, cy, r){      /* a ball of rock with a honeycomb of lava cracks */
  var M = MR, s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + M.R + '" stroke="' + M.RD + '" stroke-width="2.2"/>', k = r / 10, d = '';
  [[-3.6, -4.4], [3.6, -4.4], [-6, 2.6], [0, 1.6], [6, 2.6]].forEach(function(q){
    var x = cx + q[0] * k, y = cy + q[1] * k, h = 3.3 * k;
    d += 'M' + (x - h) + ' ' + y + 'L' + (x - h / 2) + ' ' + (y - h * 0.86) + 'L' + (x + h / 2) + ' ' + (y - h * 0.86) + 'L' + (x + h) + ' ' + y + 'L' + (x + h / 2) + ' ' + (y + h * 0.86) + 'L' + (x - h / 2) + ' ' + (y + h * 0.86) + 'Z';
  });
  return s + lvCracks(d) + '<path d="M' + (cx - r * 0.6) + ' ' + (cy - r * 0.55) + 'Q' + cx + ' ' + (cy - r * 0.95) + ' ' + (cx + r * 0.4) + ' ' + (cy - r * 0.75) + '" fill="none" stroke="' + M.RL + '" stroke-width="1.6" stroke-linecap="round"/>';
}
function mrArt(){
  var M = MR, O = '#1a0402';
  return wrapSvg(
    /* bulky body, no neck: the head sits right on it */
    outlined('<path d="M28 58Q50 46 72 58Q76 76 66 90Q50 96 34 90Q24 76 28 58Z"/>', M.R, M.RD) +
    lvCracks('M34 64L40 60L46 64L46 72L40 76L34 72Z M54 64L60 60L66 64L66 72L60 76L54 72Z M46 72L54 72M40 76L44 84L50 86L56 84L60 76M44 84L38 88M56 84L62 88M50 86V92') +
    /* round ball head */
    outlined('<path d="M50 14C64 14 74 25 74 38C74 51 64 60 50 60C36 60 26 51 26 38C26 25 36 14 50 14Z"/>', M.R, M.RD) +
    lvCracks('M38 20L44 17L50 21L56 17L62 20M44 17L44 12M50 21L50 26M30 30L36 28L38 22M70 30L64 28L62 22M28 44L32 48M72 44L68 48') +
    '<path d="M36 22Q42 17 49 16.4" fill="none" stroke="' + M.RL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* heavy brow ridge over angry yellow eyes */
    '<path d="M33 37Q36 39.6 41 41Q46 42 48 40Q48 46 42 47Q35 46 33 37Z" fill="' + M.E + '" stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round"/><circle cx="42.4" cy="43" r="2.6" fill="#c84a00"/><circle cx="42.6" cy="43.2" r="1.4" fill="' + O + '"/><circle cx="43.6" cy="42" r=".8" fill="#fff"/>' +
    '<path d="M67 37Q64 39.6 59 41Q54 42 52 40Q52 46 58 47Q65 46 67 37Z" fill="' + M.E + '" stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round"/><circle cx="57.6" cy="43" r="2.6" fill="#c84a00"/><circle cx="57.4" cy="43.2" r="1.4" fill="' + O + '"/><circle cx="58.4" cy="42" r=".8" fill="#fff"/>' +
    '<path d="M30 31Q40 34 50 40Q60 34 70 31L70 36Q60 37 50 43Q40 37 30 36Z" fill="' + M.RM + '" stroke="' + M.RD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    /* a small flat nose and a smug smirk */
    '<path d="M47 48Q50 46.6 53 48" fill="none" stroke="' + M.RD + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M38 51.6Q48 56.4 62 50.4" fill="none" stroke="' + O + '" stroke-width="2.2" stroke-linecap="round"/><path d="M61 48.8L63.4 51.8" stroke="' + O + '" stroke-width="1.8" stroke-linecap="round"/>');
}
function mrBack(c){
  var M = MR;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + M.RD + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + M.R + '" stroke-width="9" stroke-linecap="round"/>' +
      lvCracks('M' + (x1 - 2) + ' 88L' + (x1 + 2) + ' 91L' + (x1 - 1) + ' 94') +
      '<path d="M' + (fx - 10) + ' 104Q' + (fx - 10) + ' 95 ' + fx + ' 95Q' + (fx + 10) + ' 95 ' + (fx + 10) + ' 104Z" fill="' + M.R + '" stroke="' + M.RD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 8) + ' 104L' + (fx - 7) + ' 100H' + (fx - 3) + 'L' + (fx - 2) + ' 104ZM' + (fx + 2) + ' 104L' + (fx + 3) + ' 100H' + (fx + 7) + 'L' + (fx + 8) + ' 104Z" fill="#ffb21e" stroke="#8a3a00" stroke-width="1.1" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.RD + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.R + '" stroke-width="9" stroke-linecap="round"/>' +
      lvCracks('M' + ((x1 + x2) / 2 - 3) + ' ' + ((y1 + y2) / 2 - 2) + 'L' + ((x1 + x2) / 2) + ' ' + ((y1 + y2) / 2 + 1) + 'L' + ((x1 + x2) / 2 + 3) + ' ' + ((y1 + y2) / 2 - 2));
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 40, 37, 34) + leg('lgR', 60, 63, 66) +
    '<g><g class="pump pL">' + arm(29, 60, 16, 67) + mrHoney(12, 71, 10) + '</g></g>' +
    '<g><g class="pump pR">' + arm(71, 60, 83, 65) + '</g></g></svg>';
}
function mrFront(c){
  /* the big round lava fist in front; it sits in the weapon group so it jolts when he hurls a fireball */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + mrHoney(90, 66, 11) + '</g></g></g></g></svg>';
}
