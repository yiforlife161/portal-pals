/* Potion Bear: an original potion-thrower after the owner's idea: a blue bear cub with round ears, brass goggles
   pushed up on his head, a flat face with a small dark bear nose, bright eyes, a wide open happy mouth, a white lab coat with potion pockets, a stubby tail, and a bubbling purple potion flask in his paw
   (Magic, ranged, Normal). */
var MS = { F: '#3f7ad8', FD: '#0e2456', FL: '#a8c8f4', P: '#2a5aaa', PD: '#0e2456', C: '#f6f4ee', CD: '#7a7468', G: '#d2a03a', GD: '#5a3e0a', GL: '#7ad8ff', V: '#a24ae0', VD: '#3a0e6a', VL: '#e4b8ff', E: '#5a2e14' };
function msFlask(cx, cy, s){      /* a round flask of bubbling purple potion with a cork */
  var M = MS; function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<circle cx="' + cx + '" cy="' + (cy + 2 * s) + '" r="' + (12 * s) + '" fill="' + M.V + '" fill-opacity=".18"/>' +
    '<path d="M' + P(-3, -11) + 'H' + P(3, -11).split(' ')[0] + 'V' + (cy - 5 * s).toFixed(1) + 'Q' + P(9, -3) + ' ' + P(9, 3) + 'Q' + P(9, 10) + ' ' + P(0, 10) + 'Q' + P(-9, 10) + ' ' + P(-9, 3) + 'Q' + P(-9, -3) + ' ' + P(-3, -5) + 'Z" fill="#e8f6ff" fill-opacity=".85" stroke="' + M.VD + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M' + P(-8.4, 1) + 'Q' + P(0, -1) + ' ' + P(8.4, 1) + 'Q' + P(8.6, 9) + ' ' + P(0, 9.4) + 'Q' + P(-8.6, 9) + ' ' + P(-8.4, 1) + 'Z" fill="' + M.V + '"/>' +
    '<rect x="' + (cx - 3.4 * s) + '" y="' + (cy - 15 * s) + '" width="' + (6.8 * s) + '" height="' + (4.4 * s) + '" rx="' + s + '" fill="#a8703e" stroke="' + M.GD + '" stroke-width="1.2"/>' +
    '<path d="M' + P(-5, -1) + 'Q' + P(-6, 4) + ' ' + P(-4, 7) + '" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-opacity=".9"/>' +
    '<circle cx="' + (cx + 2 * s) + '" cy="' + (cy + 3 * s) + '" r="' + (1.2 * s) + '" fill="' + M.VL + '"/><circle cx="' + (cx - 1 * s) + '" cy="' + (cy + 6 * s) + '" r="' + (0.8 * s) + '" fill="' + M.VL + '"/>' +
    '<circle cx="' + (cx + 5 * s) + '" cy="' + (cy - 15 * s) + '" r="' + (1.6 * s) + '" fill="none" stroke="' + M.V + '" stroke-width="1"/><circle cx="' + (cx + 8 * s) + '" cy="' + (cy - 19 * s) + '" r="' + (1 * s) + '" fill="none" stroke="' + M.V + '" stroke-width=".9"/>';
}
function msArt(){
  var M = MS, O = '#1a120c';
  return wrapSvg(
    /* white lab coat over a furry body, with potion pockets */
    outlined('<path d="M38 60Q50 56 62 60Q65 72 61 86Q50 89 39 86Q35 72 38 60Z"/>', M.C, M.CD) +
    '<path d="M50 58V87M45 58L50 66L55 58" fill="none" stroke="' + M.CD + '" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M45.5 59L50 65.5L54.5 59Z" fill="' + M.F + '"/>' +
    '<rect x="40" y="72" width="7.4" height="7" rx="1.4" fill="#e8e4da" stroke="' + M.CD + '" stroke-width="1.1"/><rect x="41.4" y="68.2" width="2.2" height="4.4" rx="1" fill="#5ad86a" stroke="#1e5a24" stroke-width=".8"/><rect x="44.4" y="69" width="2.2" height="3.6" rx="1" fill="#ffb21e" stroke="#7a4a00" stroke-width=".8"/>' +
    '<circle cx="50" cy="71" r="1" fill="' + M.CD + '"/><circle cx="50" cy="78" r="1" fill="' + M.CD + '"/>' +
    /* big round ears with pink insides */
    '<circle cx="32" cy="22" r="7.6" fill="' + M.F + '" stroke="' + M.FD + '" stroke-width="2.2"/><circle cx="32.6" cy="22.6" r="4.2" fill="' + M.FL + '"/>' +
    '<circle cx="68" cy="22" r="7.6" fill="' + M.F + '" stroke="' + M.FD + '" stroke-width="2.2"/><circle cx="67.4" cy="22.6" r="4.2" fill="' + M.FL + '"/>' +
    /* soft mouse head that narrows to the nose, with a pale muzzle */
    outlined('<path d="M50 19C63 19 71 27 71 38C71 49 62 57 50 57C38 57 29 49 29 38C29 27 37 19 50 19Z"/>', M.F, M.FD) +

    '<path d="M37 25Q43 21 49 21" fill="none" stroke="#7aa8f0" stroke-width="2.2" stroke-linecap="round"/>' +
    /* brass goggles pushed up on his head */
    '<path d="M31 27Q50 21 69 27" fill="none" stroke="' + M.GD + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<circle cx="42" cy="25.4" r="5" fill="' + M.GL + '" stroke="' + M.G + '" stroke-width="2.4"/><circle cx="58" cy="25.4" r="5" fill="' + M.GL + '" stroke="' + M.G + '" stroke-width="2.4"/>' +
    '<path d="M40 23.4L42.6 22.6M56 23.4L58.6 22.6" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>' +
    /* bright brown eyes */
    '<ellipse cx="42.5" cy="37" rx="3.4" ry="4" fill="' + O + '"/><circle cx="43.6" cy="35.6" r="1.3" fill="#fff"/>' +
    '<ellipse cx="57.5" cy="37" rx="3.4" ry="4" fill="' + O + '"/><circle cx="58.6" cy="35.6" r="1.3" fill="#fff"/>' +
    /* pink nose, whiskers, a friendly smile with two buck teeth */
    '<path d="M47.6 42.6Q50 41.4 52.4 42.6Q51.8 44.6 50 45Q48.2 44.6 47.6 42.6Z" fill="' + O + '"/><ellipse cx="49" cy="42.5" rx=".8" ry=".5" fill="#fff" fill-opacity=".8"/>' +
    /* a wide open happy mouth with a pink tongue */
    '<path d="M39 46.6Q50 49 61 46.6Q59.6 56 50 56.6Q40.4 56 39 46.6Z" fill="#5a1420" stroke="' + O + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M42.6 53.4Q50 49.4 57.4 53.4Q54.6 56.2 50 56.4Q45.4 56.2 42.6 53.4Z" fill="#ff7a8a"/>' +
    '<path d="M40.4 47.2L42 50L43.6 47.8L45.4 50.4L47.2 48L49 50.6L50.8 48L52.6 50.6L54.4 48L56.2 50.4L58 47.8L59.6 50L60.6 47.2" fill="#fff" stroke="' + O + '" stroke-width=".7" stroke-linejoin="round"/>' +
    '<path d="M44 54.6L45.4 52.6L46.8 54.9M48.6 55.6L50 53.4L51.4 55.6M53.2 54.9L54.6 52.6L56 54.6" fill="#fff" stroke="' + O + '" stroke-width=".7" stroke-linejoin="round"/>' +
    '<ellipse cx="36.5" cy="45" rx="3" ry="1.8" fill="#ff9ab0" fill-opacity=".45"/><ellipse cx="63.5" cy="45" rx="3" ry="1.8" fill="#ff9ab0" fill-opacity=".45"/>');
}
function msBack(c){
  var M = MS;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 88L' + x2 + ' 96" stroke="' + M.FD + '" stroke-width="8.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 88L' + x2 + ' 96" stroke="' + M.F + '" stroke-width="4.8" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 6) + ' 103Q' + (fx - 7) + ' 95.6 ' + fx + ' 95.6Q' + (fx + 8) + ' 95.6 ' + (fx + 8) + ' 103Z" fill="' + M.F + '" stroke="' + M.FD + '" stroke-width="1.8" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.CD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + M.C + '" stroke-width="5.4" stroke-linecap="round"/>';
  }
  /* a long thin tail curling out to the left */
  var tail = '<circle cx="34" cy="87" r="4.4" fill="' + M.F + '" stroke="' + M.FD + '" stroke-width="1.8"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + tail + leg('lgL', 44, 42, 40) + leg('lgR', 56, 58, 60) +
    '<g><g class="pump pL">' + arm(39, 64, 22, 69) + '<circle cx="18.4" cy="70" r="4" fill="' + M.F + '" stroke="' + M.FD + '" stroke-width="1.6"/></g></g>' +
    '<g><g class="pump pR">' + arm(61, 64, 81, 66) + '</g></g></svg>';
}
function msFront(c){
  /* the purple potion flask he throws, held up in his paw; it sits in the weapon group so it jolts when he throws */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + msFlask(92, 56, 1.05) + '</g>' +
    '<circle cx="84" cy="66" r="4" fill="' + MS.F + '" stroke="' + MS.FD + '" stroke-width="1.6"/></g></g></g></svg>';
}
