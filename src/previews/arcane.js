/* Arcane dragon (no name yet): an original deep-violet magic dragon. Fiery orange crystal horns and tail crystal, glowing dark gold runes on
   his cheeks, amber eyes, starry-night wings, a pale lavender belly, and a magic fireball he throws (Magic, ranged). (preview only) */
var AR = { P: '#4e2f8e', PD: '#1e1040', PL: '#b9a3e6', C: '#ff7a1e', CD: '#8a2a00', CL: '#ffd84a', N: '#1b1846', ND: '#0a0820', A: '#ffb21e', G: '#c9961a', GD: '#5e4200' };
function arFireball(cx, cy, s){
  function P(x, y){ return (cx + x * s).toFixed(1) + ' ' + (cy + y * s).toFixed(1); }
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (10 * s) + '" fill="#ff9a2e" fill-opacity=".25"/>' +
    '<path d="M' + P(0, 8) + 'C' + P(-7, 8) + ' ' + P(-8, 0) + ' ' + P(-4, -4) + 'C' + P(-4, -1) + ' ' + P(-2, 0) + ' ' + P(-1, -2) + 'C' + P(-2, -7) + ' ' + P(1, -11) + ' ' + P(4, -12) + 'C' + P(3, -7) + ' ' + P(8, -4) + ' ' + P(7, 2) + 'C' + P(7, 6) + ' ' + P(4, 8) + ' ' + P(0, 8) + 'Z" fill="#ff7a1e" stroke="#8a2a00" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M' + P(0, 5.5) + 'C' + P(-4, 5.5) + ' ' + P(-4, 1) + ' ' + P(-1, -2) + 'C' + P(0, 0) + ' ' + P(1, 0) + ' ' + P(2, -3) + 'C' + P(5, 0) + ' ' + P(4, 5.5) + ' ' + P(0, 5.5) + 'Z" fill="#ffd84a"/>' +
    /* violet magic sparkles around it */
    '<path d="M' + P(-9, -6) + 'l' + (1.4 * s) + ' ' + (-2.6 * s) + 'l' + (1.4 * s) + ' ' + (2.6 * s) + 'l' + (-1.4 * s) + ' ' + (2.6 * s) + 'Z M' + P(8, -9) + 'l' + (1 * s) + ' ' + (-2 * s) + 'l' + (1 * s) + ' ' + (2 * s) + 'l' + (-1 * s) + ' ' + (2 * s) + 'Z" fill="#c9961a" stroke="#5e4200" stroke-width=".8"/>';
}
function arArt(){
  var A = AR, O = '#120a20';
  return wrapSvg(
    /* body with a pale lavender belly and a teal rune */
    outlined('<path d="M37 62Q50 56 63 62Q67 76 61 89Q50 94 39 89Q33 76 37 62Z"/>', A.P, A.PD) +
    '<path d="M43.5 65Q50 62 56.5 65Q59 76 55.5 87Q50 89 44.5 87Q41 76 43.5 65Z" fill="' + A.PL + '"/>' +
    '<path d="M43 71Q50 73 57 71M42.5 77Q50 79 57.5 77M43.5 83Q50 85 56.5 83" fill="none" stroke="#9a84cc" stroke-width="1.3" stroke-linecap="round"/>' +
    /* neck */
    outlined('<path d="M43.5 51L56.5 51L58 65Q50 68 42 65Z"/>', A.P, A.PD, 2.4) +
    /* fiery orange crystal horns with yellow glints, like his fireball */
    outlined('<path d="M36 27L28 9L42 22Z"/><path d="M64 27L72 9L58 22Z"/><path d="M47 20L50 9L53 20Z"/>', A.C, A.CD, 1.8) +
    '<path d="M31 13L37 23M69 13L63 23" stroke="' + A.CL + '" stroke-width="1.3" stroke-linecap="round"/>' +
    /* round head with a short snout */
    outlined('<path d="M50 18C63 18 71 27 71 38C71 48 63 55 50 55C37 55 29 48 29 38C29 27 37 18 50 18Z"/>', A.P, A.PD) +
    '<path d="M35 25Q41 20 48 20" fill="none" stroke="#7a5ac0" stroke-width="2.4" stroke-linecap="round"/>' +
    outlined('<path d="M50 41C57 41 61 44.5 61 49C61 54 56 58 50 58C44 58 39 54 39 49C39 44.5 43 41 50 41Z"/>', A.PL, A.PD, 2.2) +
    '<path d="M45.6 46.2L47.6 48M54.4 46.2L52.4 48" stroke="' + A.PD + '" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M43 53Q50 56 57 53" fill="none" stroke="' + A.PD + '" stroke-width="1.7" stroke-linecap="round"/>' +
    /* dark gold runes on the cheeks */
    '<path d="M32 40L35 37L35 42L38 39M68 40L65 37L65 42L62 39" fill="none" stroke="' + A.G + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    /* amber eyes with slit pupils */
    '<ellipse cx="41" cy="35.5" rx="5" ry="5.8" fill="' + A.A + '" stroke="' + O + '" stroke-width="1.7"/><ellipse cx="41.6" cy="36" rx="1.4" ry="4" fill="' + O + '"/><circle cx="42.8" cy="33.6" r="1.1" fill="#fff"/>' +
    '<ellipse cx="59" cy="35.5" rx="5" ry="5.8" fill="' + A.A + '" stroke="' + O + '" stroke-width="1.7"/><ellipse cx="58.4" cy="36" rx="1.4" ry="4" fill="' + O + '"/><circle cx="59.6" cy="33.6" r="1.1" fill="#fff"/>' +
    '<path d="M34.5 28.5L46 31.5M65.5 28.5L54 31.5" stroke="' + A.PD + '" stroke-width="2.4" stroke-linecap="round"/>');
}
function arBack(c){
  var A = AR;
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 85L' + x2 + ' 96" stroke="' + A.PD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 85L' + x2 + ' 96" stroke="' + A.P + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 7) + ' 103Q' + (fx - 7) + ' 95 ' + fx + ' 95Q' + (fx + 7) + ' 95 ' + (fx + 7) + ' 103Z" fill="' + A.P + '" stroke="' + A.PD + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + (fx - 4.5) + ' 103V100.5M' + fx + ' 103V100M' + (fx + 4.5) + ' 103V100.5" stroke="' + A.G + '" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + A.PD + '" stroke-width="8.4" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + A.P + '" stroke-width="4.6" stroke-linecap="round"/>';
  }
  /* starry-night wings with a purple frame */
  function wing(m){
    function X(x){ return (50 + (x - 50) * m).toFixed(1); }
    var bone = 'M' + X(38) + ' 64Q' + X(20) + ' 48 ' + X(0) + ' 30';
    return '<path d="' + bone + 'Q' + X(6) + ' 44 ' + X(2) + ' 50Q' + X(12) + ' 50 ' + X(13) + ' 58Q' + X(21) + ' 56 ' + X(24) + ' 64Q' + X(31) + ' 61 ' + X(38) + ' 64Z" fill="' + A.N + '" stroke="' + A.ND + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="' + X(12) + '" cy="44" r=".9" fill="#fff"/><circle cx="' + X(19) + '" cy="52" r=".7" fill="#fff"/><circle cx="' + X(8) + '" cy="48" r=".6" fill="#cfc6ff"/><circle cx="' + X(25) + '" cy="58" r=".7" fill="#fff"/><circle cx="' + X(15) + '" cy="56" r=".5" fill="#cfc6ff"/>' +
      '<path d="M' + X(17) + ' 47.5l.8 -1.6l.8 1.6l-.8 1.6Z" fill="' + A.G + '"/>' +
      '<path d="' + bone + '" fill="none" stroke="' + A.PD + '" stroke-width="5.4" stroke-linecap="round"/>' +
      '<path d="' + bone + '" fill="none" stroke="' + A.P + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M' + X(0) + ' 30L' + X(-3) + ' 25L' + X(3) + ' 27Z" fill="' + A.G + '" stroke="' + A.GD + '" stroke-width="1.2" stroke-linejoin="round"/>';
  }
  /* tail out to the left, with a fiery crystal at the tip */
  var tp = 'M39 88Q25 97 13 90';
  var tail = '<path d="' + tp + '" fill="none" stroke="' + A.PD + '" stroke-width="8.4" stroke-linecap="round"/><path d="' + tp + '" fill="none" stroke="' + A.P + '" stroke-width="4.6" stroke-linecap="round"/>' +
    '<path d="M14 90L4 82L9 80L8 72L16 83Z" fill="' + A.C + '" stroke="' + A.CD + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 80L13 85" stroke="' + A.CL + '" stroke-width="1.2" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + wing(-1) + wing(1) + tail + leg('lgL', 43, 41, 38) + leg('lgR', 57, 59, 62) +
    '<g><g class="pump pL">' + arm(38, 69, 21, 73) + '<circle cx="19" cy="73.5" r="4.2" fill="' + A.P + '" stroke="' + A.PD + '" stroke-width="1.8"/></g></g>' +
    '<g><g class="pump pR">' + arm(62, 69, 81, 66) + '</g></g></svg>';
}
function arFront(c){
  /* a magic fireball floating over his claw; it sits in the weapon group so it jolts when he throws */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn"><g transform="rotate(-18 86 64)">' + arFireball(95, 50, 1.25) + '</g>' +
    '<circle cx="84" cy="65.5" r="4.2" fill="' + AR.P + '" stroke="' + AR.PD + '" stroke-width="1.8"/></g></g></g></svg>';
}
