/* Lava golem (Lava Golem): the owner's own drawing: a body of dark red rock plates split by glowing lava cracks, a spiky rock
   crown with a flame burning on top, angry yellow eyes, a huge toothy grin, rock spikes on the shoulders and knees, and big
   clawed rock fists wrapped in fire that he throws fireballs from (Fire, ranged, Giant). */
var LV = { R: '#a8381e', RD: '#2a0c06', RL: '#d2603a', RM: '#7a2412', K: '#4a1e1a', KL: '#7a3a30', L: '#ffb21e', LL: '#fff07a', F: '#ff5a1e', FL: '#ffd23e', E: '#ffe23a' };
function lvCracks(d){ return '<path d="' + d + '" fill="none" stroke="' + LV.F + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="' + LV.LL + '" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>'; }
function lvFlame(cx, cy, s){      /* a flame licking upwards */
  function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<path d="M' + P(-10, 6) + 'C' + P(-14, -4) + ' ' + P(-6, -8) + ' ' + P(-8, -16) + 'C' + P(-2, -12) + ' ' + P(-2, -8) + ' ' + P(0, -6) + 'C' + P(0, -14) + ' ' + P(4, -18) + ' ' + P(2, -26) + 'C' + P(10, -18) + ' ' + P(8, -10) + ' ' + P(10, -8) + 'C' + P(12, -12) + ' ' + P(14, -12) + ' ' + P(14, -14) + 'C' + P(18, -4) + ' ' + P(14, 4) + ' ' + P(10, 6) + 'Z" fill="' + LV.F + '" stroke="#8a1a00" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M' + P(-6, 6) + 'C' + P(-8, -2) + ' ' + P(-2, -4) + ' ' + P(0, -2) + 'C' + P(2, -10) + ' ' + P(4, -12) + ' ' + P(4, -16) + 'C' + P(10, -8) + ' ' + P(10, 0) + ' ' + P(6, 6) + 'Z" fill="' + LV.FL + '"/>';
}
function lvFist(x, y, m, fire){      /* a big rock fist with dark claws, wrapped in fire; m = 1 claws right, -1 left */
  var L = LV; function X(v){ return x + v * m; }
  var claw = function(px, py, a){ return '<path d="M' + X(px - 2.4) + ' ' + (py + 1) + 'Q' + X(px + 3 * Math.cos(a)) + ' ' + (py - 9) + ' ' + X(px + 7) + ' ' + (py - 10) + 'Q' + X(px + 4) + ' ' + (py - 3) + ' ' + X(px + 2.6) + ' ' + (py + 1.4) + 'Z" fill="' + L.K + '" stroke="' + L.RD + '" stroke-width="1.3" stroke-linejoin="round"/>'; };
  return (fire ? lvFlame(x, y - 2, 1.05) : '') +
    '<path d="M' + X(-10) + ' ' + y + 'Q' + X(-10) + ' ' + (y - 10) + ' ' + X(0) + ' ' + (y - 10) + 'Q' + X(11) + ' ' + (y - 10) + ' ' + X(11) + ' ' + y + 'Q' + X(11) + ' ' + (y + 10) + ' ' + X(0) + ' ' + (y + 10) + 'Q' + X(-10) + ' ' + (y + 10) + ' ' + X(-10) + ' ' + y + 'Z" fill="' + L.R + '" stroke="' + L.RD + '" stroke-width="2.2"/>' +
    lvCracks('M' + X(-8) + ' ' + (y - 3) + 'L' + X(-2) + ' ' + (y - 1) + 'L' + X(3) + ' ' + (y - 6) + 'M' + X(-2) + ' ' + (y - 1) + 'L' + X(0) + ' ' + (y + 6) + 'L' + X(7) + ' ' + (y + 5)) +
    claw(-4, y - 8, 0.4) + claw(2, y - 9, 0.2) + claw(8, y - 6, 0);
}
function lvArt(){
  var L = LV, O = '#1a0604';
  return wrapSvg(
    /* rock body with lava cracks */
    outlined('<path d="M33 60Q50 54 67 60Q72 76 64 90Q50 95 36 90Q28 76 33 60Z"/>', L.R, L.RD) +
    lvCracks('M38 64L44 70L52 66L58 72L64 68M44 70L42 80L50 84L57 79L58 72M50 84L48 91M36 78L42 80M57 79L64 82') +
    '<path d="M38 61Q44 58 50 58" fill="none" stroke="' + L.RL + '" stroke-width="2" stroke-linecap="round"/>' +
    /* spiky rock shoulders */
    outlined('<path d="M22 60L26 48L32 52L36 46L40 58Q32 64 22 60Z"/><path d="M78 60L74 48L68 52L64 46L60 58Q68 64 78 60Z"/>', L.RM, L.RD, 2) +
    /* the flame burning on top of his head */
    lvFlame(50, 14, 1.15) +
    /* rock head: a spiky crown, angry yellow eyes, a huge toothy grin */
    outlined('<path d="M30 30L34 20L40 22L44 12L50 17L56 12L60 22L66 20L70 30Q72 42 68 50Q60 58 50 58Q40 58 32 50Q28 42 30 30Z"/>', L.R, L.RD) +
    lvCracks('M33 28L38 30M67 28L62 30M44 18L46 24M56 18L54 24') +
    '<path d="M36 24Q42 20 48 19" fill="none" stroke="' + L.RL + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M48 36Q50 40 52 36L50 33Z" fill="' + L.RM + '" stroke="' + L.RD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<ellipse cx="41" cy="33" rx="5" ry="4.6" fill="' + L.E + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="42" cy="33.6" r="2.3" fill="' + O + '"/><circle cx="43" cy="32.4" r=".9" fill="#fff"/>' +
    '<ellipse cx="59" cy="33" rx="5" ry="4.6" fill="' + L.E + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="58" cy="33.6" r="2.3" fill="' + O + '"/><circle cx="59" cy="32.4" r=".9" fill="#fff"/>' +
    '<path d="M34 26L47 31M66 26L53 31" stroke="' + L.RD + '" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M33 41Q50 46 67 41Q64 54 50 56Q36 54 33 41Z" fill="#2a0806" stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M35 42L37.5 47L40 43.2L42.5 48.4L45 44L47.5 49L50 44.4L52.5 49L55 44L57.5 48.4L60 43.2L62.5 47L65 42" fill="#fff" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>' +
    '<path d="M40 53L42.5 49.4L45 54M47.5 54.8L50 50.6L52.5 54.8M55 54L57.5 49.4L60 53" fill="#fff" stroke="' + O + '" stroke-width=".9" stroke-linejoin="round"/>');
}
function lvBack(c){
  var L = LV;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + L.RD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + L.R + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + (x1 + (x1 < 50 ? -6 : 6)) + ' 92L' + (x1 + (x1 < 50 ? -3 : 3)) + ' 82L' + (x1 + (x1 < 50 ? 2 : -2)) + ' 90Z" fill="' + L.RM + '" stroke="' + L.RD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 10) + ' 104Q' + (fx - 10) + ' 95 ' + fx + ' 95Q' + (fx + 10) + ' 95 ' + (fx + 10) + ' 104Z" fill="' + L.R + '" stroke="' + L.RD + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 8) + ' 104L' + (fx - 11) + ' 99L' + (fx - 5) + ' 101ZM' + (fx + 8) + ' 104L' + (fx + 11) + ' 99L' + (fx + 5) + ' 101Z" fill="' + L.K + '" stroke="' + L.RD + '" stroke-width="1.2" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + L.RD + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + L.R + '" stroke-width="8" stroke-linecap="round"/>' +
      lvCracks('M' + ((x1 + x2) / 2 - 2) + ' ' + ((y1 + y2) / 2 - 3.5) + 'L' + ((x1 + x2) / 2 + 2) + ' ' + ((y1 + y2) / 2 + 3.5));
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 40, 37, 34) + leg('lgR', 60, 63, 66) +
    '<g><g class="pump pL">' + arm(28, 62, 15, 67) + lvFist(12, 71, -1, true) + '</g></g>' +
    '<g><g class="pump pR">' + arm(72, 62, 83, 65) + '</g></g></svg>';
}
function lvFront(c){
  /* the front fist, clawed and on fire; it sits in the weapon group so it jolts when he throws a fireball */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + lvFist(89, 66, 1, true) + '</g></g></g></g></svg>';
}
