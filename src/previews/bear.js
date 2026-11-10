/* Blaster Bear: an original round little red bear cub whose head and body are one shape, without a snout: round ears with tan insides, a flat face
   with a small dark nose, bright brown eyes under cocky brows, a cheeky lopsided smile, tan paws with claws, and a chunky steel blaster in each paw (dual-wield; Tech, ranged, Normal). */
var BR = { R: '#c23a2a', RD: '#3a0c08', RL: '#e8664e', T: '#e8c08a', TD: '#7a5430', V: '#7a4a26', VD: '#2e1a0a', VL: '#a8703e', S: '#9aa4b2', SD: '#2c323c', SL: '#d4dbe4', SM: '#6a7480', Y: '#ffc23a', K: '#1a0e0c' };
function brBlaster(x, y, s){      /* a chunky steel blaster with a muzzle flash, pointing right; (x, y) is the grip */
  var B = BR; function P(a, b){ return (x + a * s).toFixed(1) + ' ' + (y + b * s).toFixed(1); }
  return '<path d="M' + P(-3, -1) + 'L' + P(-5, 9) + 'L' + P(1, 10) + 'L' + P(3, 0) + 'Z" fill="' + B.SM + '" stroke="' + B.SD + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M' + P(-6, -8) + 'H' + P(14, -8).split(' ')[0] + 'L' + P(15, -1) + 'H' + P(-6, -1).split(' ')[0] + 'Z" fill="' + B.S + '" stroke="' + B.SD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<rect x="' + (x + 13 * s) + '" y="' + (y - 7 * s) + '" width="' + (6 * s) + '" height="' + (5 * s) + '" rx="' + s + '" fill="' + B.SM + '" stroke="' + B.SD + '" stroke-width="1.5"/>' +
    '<path d="M' + P(-4, -6) + 'H' + P(10, -6).split(' ')[0] + '" stroke="' + B.SL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    '<rect x="' + (x - 2 * s) + '" y="' + (y - 11 * s) + '" width="' + (6 * s) + '" height="' + (3.5 * s) + '" rx="' + s + '" fill="' + B.SM + '" stroke="' + B.SD + '" stroke-width="1.3"/>' +
    '<path d="M' + P(20, -4.5) + 'L' + P(25, -10) + 'L' + P(25, -6) + 'L' + P(30, -7) + 'L' + P(26, -4) + 'L' + P(30, -1) + 'L' + P(25, -2) + 'L' + P(25, 1.5) + 'Z" fill="' + B.Y + '" stroke="#b85a00" stroke-width="1.1" stroke-linejoin="round"/>' +
    '<circle cx="' + (x + 22 * s) + '" cy="' + (y - 4.5 * s) + '" r="' + (1.6 * s) + '" fill="#fff6c0"/>';
}
function brArt(){
  var B = BR, O = '#1a0604';
  return wrapSvg(
    /* round ears with tan insides, behind his head */
    '<circle cx="32" cy="21" r="8.5" fill="' + B.R + '" stroke="' + B.RD + '" stroke-width="2.2"/><circle cx="32.6" cy="21.6" r="4.6" fill="' + B.T + '"/>' +
    '<circle cx="68" cy="21" r="8.5" fill="' + B.R + '" stroke="' + B.RD + '" stroke-width="2.2"/><circle cx="67.4" cy="21.6" r="4.6" fill="' + B.T + '"/>' +
    /* head and body are one round, furry bear shape (no neck), with a tan belly patch and a few fur tufts */
    outlined('<path d="M50 16C64 16 71 25 71 37C71 46 74 56 74 68C74 84 64 93 50 93C36 93 26 84 26 68C26 56 29 46 29 37C29 25 36 16 50 16Z"/>', B.R, B.RD) +
    '<path d="M37 59Q50 52 63 59Q69 74 61 88Q50 92 39 88Q31 74 37 59Z" fill="' + B.T + '"/>' +
    '<path d="M27.6 62L31 63M27 70L30.4 70.4M72.4 62L69 63M73 70L69.6 70.4M43 82Q50 84 57 82" fill="none" stroke="' + B.RD + '" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M36 23Q42 19 49 18.5" fill="none" stroke="' + B.RL + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M46 17L48 21L50 16.5L52 21L54 17" fill="none" stroke="' + B.RD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    /* small determined eyes, cocky brows */
    '<ellipse cx="41" cy="34.5" rx="5.2" ry="5.6" fill="#fff" stroke="' + O + '" stroke-width="1.6"/><circle cx="42" cy="35" r="3.2" fill="#6a3a1a"/><circle cx="42.2" cy="35.2" r="1.8" fill="' + O + '"/><circle cx="43.4" cy="33.6" r="1.1" fill="#fff"/>' +
    '<ellipse cx="59" cy="34.5" rx="5.2" ry="5.6" fill="#fff" stroke="' + O + '" stroke-width="1.6"/><circle cx="58" cy="35" r="3.2" fill="#6a3a1a"/><circle cx="57.8" cy="35.2" r="1.8" fill="' + O + '"/><circle cx="59.2" cy="33.6" r="1.1" fill="#fff"/>' +
    '<path d="M35.5 27.5L45 29.6M64.5 26.6L55 29.6" stroke="' + B.RD + '" stroke-width="2.4" stroke-linecap="round"/>' +
    /* small dark nose right on the face, and a cheeky lopsided smile */
    '<path d="M47.2 41Q50 39.6 52.8 41Q52.2 43.6 50 44.2Q47.8 43.6 47.2 41Z" fill="' + B.K + '"/><circle cx="48.8" cy="40.9" r=".7" fill="#fff" fill-opacity=".8"/>' +
    '<path d="M50 44.2V46M43 46Q49 50 58 45" fill="none" stroke="' + O + '" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M57 45.4L59.4 44" stroke="' + O + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<ellipse cx="35" cy="43" rx="3.6" ry="2.2" fill="#ff8a8a" fill-opacity=".45"/><ellipse cx="65" cy="43" rx="3.6" ry="2.2" fill="#ff8a8a" fill-opacity=".45"/>');
}
function brBack(c){
  var B = BR;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + B.RD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 86L' + x2 + ' 95" stroke="' + B.R + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 8) + ' 103Q' + (fx - 8) + ' 95 ' + fx + ' 95Q' + (fx + 8) + ' 95 ' + (fx + 8) + ' 103Z" fill="' + B.R + '" stroke="' + B.RD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 4.5) + ' 103V100.4M' + fx + ' 103V100M' + (fx + 4.5) + ' 103V100.4" stroke="' + B.T + '" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + B.RD + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + B.R + '" stroke-width="6.4" stroke-linecap="round"/>';
  }
  function paw(x, y){ return '<circle cx="' + x + '" cy="' + y + '" r="4.8" fill="' + B.R + '" stroke="' + B.RD + '" stroke-width="1.8"/><path d="M' + (x - 2.6) + ' ' + (y - 3.4) + 'L' + (x - 3.4) + ' ' + (y - 5.6) + 'M' + x + ' ' + (y - 4) + 'V' + (y - 6.4) + 'M' + (x + 2.6) + ' ' + (y - 3.4) + 'L' + (x + 3.4) + ' ' + (y - 5.6) + '" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>'; }
  /* the back blaster, held out to the other side */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(32, 63, 17, 68) + '<g transform="translate(34 0) scale(-1 1)">' + brBlaster(19, 69, 0.95) + '</g>' + paw(15, 69) + '</g></g>' +
    '<g><g class="pump pR">' + arm(68, 63, 83, 65) + '</g></g></svg>';
}
function brFront(c){
  /* the front blaster; it sits in the weapon group so it kicks back when he fires */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + brBlaster(86, 67, 1.05) +
    '<circle cx="85" cy="66" r="4.8" fill="' + BR.R + '" stroke="' + BR.RD + '" stroke-width="1.8"/><path d="M82.4 62.6L81.6 60.4M85 62V59.6M87.6 62.6L88.4 60.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></g></g></g></g></svg>';
}
