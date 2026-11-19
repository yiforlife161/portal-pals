/* Reef Grunt (key 'rg', Water, ranged, normal): the owner's drawing: a stocky teal fish-man with a serrated fin on top of his head, frilly ear
   fins, big round yellow eyes, a wide smile with two little tusks poking up, a brown sash across the chest and a brown belt, brown
   bracers on thick arms, wide three-fingered hands and bent frog legs on webbed feet. The owner swapped the spear on his back for a
   harpoon gun held in the front hand (the weapon), and he shoots harpoons (shot 'harpoon'). Faces right like every pal. */
var RG = { T: '#2aa8a0', TD: '#0c2a2a', TL: '#6ed6cc', TM: '#1e8a84', E: '#ffd23a', K: '#141418', W: '#f4ecd6', L: '#8a5530', LD: '#2e1608', LL: '#b07a4a',
  S: '#8a90a6', SD: '#1e2230', SL: '#c8ccdc', H: '#4a4e5e' };
function rgP(d, fill, stroke, w){
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (w || 1.9) + '" stroke-linejoin="round"/>';
}
function rgLine(d, w, fill, dark){
  return '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="' + (w + 2.8) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* a wide hand with three fingers and a thumb at (x, y); m = 1 fingers to the right */
function rgHand(x, y, m){
  var Z = RG; function X(v){ return x + v * m; }
  return rgP('M' + X(-4) + ' ' + (y - 4) + 'L' + X(2) + ' ' + (y - 4.6) + 'L' + X(4) + ' ' + (y - 8) + 'Q' + X(6) + ' ' + (y - 9) + ' ' + X(6.4) + ' ' + (y - 6.6) + 'L' + X(5.4) + ' ' + (y - 3.6) +
    'L' + X(9.6) + ' ' + (y - 3.4) + 'Q' + X(11) + ' ' + (y - 1.8) + ' ' + X(9.6) + ' ' + (y - 0.6) + 'L' + X(6) + ' ' + (y - 0.4) + 'L' + X(9.4) + ' ' + (y + 2.2) + 'Q' + X(10) + ' ' + (y + 4) + ' ' + X(8.2) + ' ' + (y + 4) +
    'L' + X(4.6) + ' ' + (y + 2.6) + 'L' + X(5) + ' ' + (y + 5.6) + 'Q' + X(4) + ' ' + (y + 7) + ' ' + X(2.6) + ' ' + (y + 5.8) + 'L' + X(1) + ' ' + (y + 3.6) + 'L' + X(-4) + ' ' + (y + 3.6) + 'Z', Z.T, Z.TD, 1.7);
}
/* a brown bracer band on an arm, centred at (x, y) */
function rgBand(x, y, rot){
  var Z = RG;
  return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')"><rect x="' + (x - 2.4) + '" y="' + (y - 5.4) + '" width="4.8" height="10.8" rx="1.4" fill="' + Z.L + '" stroke="' + Z.LD + '" stroke-width="1.4"/>' +
    '<path d="M' + (x - 1) + ' ' + (y - 4) + 'V' + (y + 4) + '" stroke="' + Z.LL + '" stroke-width=".9" stroke-linecap="round"/></g>';
}
function rgArt(){
  var Z = RG;
  return wrapSvg(
    /* the stocky body */
    rgP('M37 50Q50 44 63 50Q67 62 63 74Q56 80 50 80Q44 80 37 74Q33 62 37 50Z', Z.T, Z.TD, 2) +
    '<path d="M42 56Q45 60 48 58M58 56Q55 60 52 58M44 68Q50 71 56 68" fill="none" stroke="' + Z.TM + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* the brown sash across the chest, and the belt */
    rgP('M61 48L65 52L41 74L36 70Z', Z.L, Z.LD, 1.5) + '<path d="M61.4 50.6L40 70.8" stroke="' + Z.LL + '" stroke-width=".9" stroke-linecap="round"/>' +
    rgP('M35 71Q50 75 65 71L65 78Q50 82 35 78Z', Z.L, Z.LD, 1.6) + '<path d="M37 73.4Q50 77 63 73.4" fill="none" stroke="' + Z.LL + '" stroke-width=".9" stroke-linecap="round"/>' +
    /* the serrated fin on top of the head */
    rgP('M44 20Q46 8 54 2Q51 10 56 22Z', Z.T, Z.TD, 1.8) +
    '<path d="M45.6 15L43.4 15.6L45 13L43 12.6L46 10L44.4 9.4L47.6 7" fill="none" stroke="' + Z.TD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M51 8Q49 13 50 20" fill="none" stroke="' + Z.TM + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* frilly ear fins */
    rgP('M32 28L22 22L24 26L19 27L23 30L19 33L25 34L22 38L32 37Z', Z.T, Z.TD, 1.7) + rgP('M68 28L78 22L76 26L81 27L77 30L81 33L75 34L78 38L68 37Z', Z.T, Z.TD, 1.7) +
    /* the wide head */
    rgP('M31 30Q32 18 50 18Q68 18 69 30Q71 42 64 48Q58 52 50 52Q42 52 36 48Q29 42 31 30Z', Z.T, Z.TD, 2.1) +
    '<path d="M36 24Q40 20 46 20" fill="none" stroke="' + Z.TL + '" stroke-width="1.6" stroke-linecap="round"/>' +
    /* big round yellow eyes */
    '<circle cx="40.6" cy="31" r="6" fill="' + Z.E + '" stroke="' + Z.TD + '" stroke-width="1.6"/><circle cx="59.4" cy="31" r="6" fill="' + Z.E + '" stroke="' + Z.TD + '" stroke-width="1.6"/>' +
    '<ellipse cx="41.4" cy="31.6" rx="2.2" ry="3" fill="' + Z.K + '"/><ellipse cx="58.6" cy="31.6" rx="2.2" ry="3" fill="' + Z.K + '"/>' +
    '<circle cx="42.4" cy="30" r=".9" fill="#fff"/><circle cx="59.6" cy="30" r=".9" fill="#fff"/>' +
    /* the wide smile with two little tusks poking up */
    '<path d="M35 40Q37 43 40 42Q50 44 60 42Q63 43 65 40" fill="none" stroke="' + Z.TD + '" stroke-width="1.6" stroke-linecap="round"/>' +
    rgP('M41.4 42.4L43 37.6L44.6 42.8Z', Z.W, Z.TD, 1) + rgP('M55.4 42.8L57 37.6L58.6 42.4Z', Z.W, Z.TD, 1) +
    '<path d="M42 47Q50 49 58 47" fill="none" stroke="' + Z.TM + '" stroke-width="1.1" stroke-linecap="round"/>');
}
function rgBack(c){
  var Z = RG;
  /* bent frog legs on webbed three-toed feet */
  function leg(cls, x1, kx, x2, fx, m){
    return '<g class="lg ' + cls + '">' + rgLine('M' + x1 + ' 78L' + kx + ' 87L' + x2 + ' 95', 5, Z.T, Z.TD) +
      rgP('M' + (fx - 3) + ' 94Q' + fx + ' 92 ' + (fx + 3) + ' 94L' + (fx + 9 * m) + ' 101Q' + (fx + 10 * m) + ' 103 ' + (fx + 8 * m) + ' 103L' + (fx + 3 * m) + ' 101L' + (fx + 2 * m) + ' 104L' + (fx - 2 * m) + ' 104L' + (fx - 3 * m) + ' 101L' + (fx - 8 * m) + ' 103Q' + (fx - 10 * m) + ' 103 ' + (fx - 9 * m) + ' 101Z', Z.T, Z.TD, 1.6) + '</g>';
  }
  var back = rgLine('M38 54L16 61', 6, Z.T, Z.TD) + rgBand(20, 60, -18) + rgHand(13, 62, -1);
  var front = rgLine('M62 54L82 62', 6, Z.T, Z.TD) + rgBand(78, 60.4, 22);
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' + leg('lgL', 44, 37, 41, 38, -1) + leg('lgR', 56, 63, 59, 62, 1) +
    '<g><g class="pump pL">' + back + '</g></g><g><g class="pump pR">' + front + '</g></g></svg>';
}
function rgFront(c){
  var Z = RG;
  /* the harpoon gun, held level (turned back against the weapon group's idle tilt): a wooden stock, a dark metal barrel with brass
     bands, a coil of rope, and a barbed harpoon loaded in the muzzle */
  var gun = '<g transform="rotate(-18 86 64)">' +
    rgP('M71 61L83 59.6L83.6 67.4L74 70.6Q70.6 68 71 61Z', Z.L, Z.LD, 1.6) + '<path d="M73 62.4L81.4 61.4" stroke="' + Z.LL + '" stroke-width="1" stroke-linecap="round"/>' +
    rgP('M84 66L88.6 66L87.4 73.4L83.4 73Z', Z.L, Z.LD, 1.4) +
    '<ellipse cx="92" cy="69.4" rx="3.6" ry="2.2" fill="none" stroke="#c8a46a" stroke-width="1.6"/><ellipse cx="92" cy="69.4" rx="2" ry="1.1" fill="none" stroke="#a8844a" stroke-width="1"/>' +
    rgP('M81 59.4H100.6Q102 62.4 100.6 65.4H81Z', Z.H, Z.SD, 1.6) +
    '<path d="M83 60.6H99" stroke="#7a7e90" stroke-width="1" stroke-linecap="round"/>' +
    rgP('M85 58.6H88V66.2H85Z', '#d8a830', '#5a3e00', 1.1) + rgP('M96 58.6H98.6V66.2H96Z', '#d8a830', '#5a3e00', 1.1) +
    '<path d="M100 62.4H108" stroke="' + Z.SD + '" stroke-width="2.4" stroke-linecap="round"/><path d="M100 62.4H108" stroke="' + Z.SL + '" stroke-width="1" stroke-linecap="round"/>' +
    rgP('M114 62.4L107 59L108.4 62.4L107 65.8Z', Z.S, Z.SD, 1.2) + '</g>';
  /* the fist wrapped round the grip */
  var fist = rgP('M80.6 61.6Q85 59.4 88.6 61.6Q90 65 88.4 68.4Q84.4 70.4 80.6 68.4Q79.4 65 80.6 61.6Z', Z.T, Z.TD, 1.7) +
    '<path d="M84.6 62.6H88.6M84.6 65.2H89M84.6 67.6H88.2" stroke="' + Z.TD + '" stroke-width=".9" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + gun + fist + '</g></g></g></svg>';
}
