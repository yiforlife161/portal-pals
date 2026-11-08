/* Talon (placeholder name): an original blue eagle pal with an arm cannon, from the owner's own drawing (preview only).
   Changes from the drawing: a three-feather crest, a glowing core in the cannon, gold cuffs. */
function eagleArt(){
  var O = '#1d2140', B = '#2f6fd6', BD = '#173a7a', W = '#f6f3ee', Y = '#f6c43a', YD = '#8a5a00';
  return wrapSvg(
    /* body: blue suit with a grey belt and a round blue buckle */
    outlined('<path d="M31 66Q50 58 69 66L72 88Q50 96 28 88Z"/>', B, BD) +
    '<path d="M38 66Q50 74 62 66L58 80Q50 84 42 80Z" fill="' + W + '" stroke="' + BD + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    outlined('<path d="M29 80Q50 87 71 80L71.5 86Q50 93 28.5 86Z"/>', '#9aa6bd', '#4a5470', 2) +
    '<circle cx="50" cy="84" r="6.2" fill="#35a8f0" stroke="' + BD + '" stroke-width="2.2"/><circle cx="48" cy="82" r="1.8" fill="#fff" fill-opacity=".7"/>' +
    /* crest: three blue feathers */
    outlined('<path d="M44 20Q38 8 41 2Q47 9 49 18Z"/>', '#4a8cf0', BD, 2.2) +
    outlined('<path d="M47 18Q47 4 52 0Q56 8 53 18Z"/>', B, BD, 2.2) +
    outlined('<path d="M52 19Q57 8 63 5Q62 13 56 21Z"/>', '#4a8cf0', BD, 2.2) +
    /* head */
    outlined('<path d="M50 15C66 15 76 26 76 41C76 55 65 64 50 64C35 64 24 55 24 41C24 26 34 15 50 15Z"/>', B, BD) +
    /* white face feathers flaring out to the sides */
    outlined('<path d="M50 30C43 26 34 24 22 22L29 30L17 32L28 38L19 44L31 46C35 55 42 60 50 60C58 60 65 55 69 46L81 44L72 38L83 32L71 30L78 22C66 24 57 26 50 30Z"/>', W, '#3a3a52', 2.4) +
    /* eyes and cross brows */
    '<ellipse cx="40.5" cy="41" rx="6" ry="6.6" fill="#fff" stroke="' + O + '" stroke-width="2"/><circle cx="42" cy="42" r="3.4" fill="' + O + '"/><circle cx="43.2" cy="40.8" r="1.1" fill="#fff"/>' +
    '<ellipse cx="59.5" cy="41" rx="6" ry="6.6" fill="#fff" stroke="' + O + '" stroke-width="2"/><circle cx="58" cy="42" r="3.4" fill="' + O + '"/><circle cx="59.2" cy="40.8" r="1.1" fill="#fff"/>' +
    '<path d="M32 33L46 37.5M68 33L54 37.5" stroke="' + O + '" stroke-width="3.4" stroke-linecap="round"/>' +
    /* hooked beak */
    outlined('<path d="M42.5 48Q50 44 57.5 48L52.5 57Q50 61 48 57Z"/>', Y, YD, 2.2) +
    '<path d="M44.5 49.5Q50 47.5 55.5 49.5" fill="none" stroke="#fff3c0" stroke-width="1.4" stroke-linecap="round"/>');
}
function eagleBack(c){
  var o = '#173a7a', f = '#2f6fd6', Y = '#f6c43a', YD = '#8a5a00';
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 82L' + x2 + ' 96" stroke="' + o + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 82L' + x2 + ' 96" stroke="#9aa6bd" stroke-width="5.4" stroke-linecap="round"/>' +
      /* yellow talons: three toes */
      '<path d="M' + (fx - 8) + ' 103L' + (fx - 4) + ' 96Q' + fx + ' 93 ' + (fx + 4) + ' 96L' + (fx + 8) + ' 103L' + (fx + 3) + ' 100L' + fx + ' 104L' + (fx - 3) + ' 100Z" fill="' + Y + '" stroke="' + YD + '" stroke-width="1.8" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + o + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + f + '" stroke-width="5.6" stroke-linecap="round"/>';
  }
  /* back arm ends in a yellow claw hand with a gold cuff */
  var claw = '<rect x="12" y="66" width="8" height="5" rx="2" fill="' + Y + '" stroke="' + YD + '" stroke-width="1.4" transform="rotate(10 16 68)"/>' +
    '<path d="M14 72Q6 72 6 80Q10 76 13 78Q10 82 13 86Q15 80 19 80Q21 75 14 72Z" fill="' + Y + '" stroke="' + YD + '" stroke-width="1.8" stroke-linejoin="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(32, 68, 17, 69) + claw + '</g></g><g><g class="pump pR">' + arm(68, 67, 84, 65) + '</g></g></svg>';
}
function eagleFront(c){
  var BD = '#173a7a', Y = '#f6c43a', YD = '#8a5a00';
  /* arm cannon: blue barrel, gold rings, glowing cyan core; it sits in the weapon group so it kicks back when he fires */
  var cannon = '<g transform="rotate(-18 86 64)">' +
    '<rect x="76" y="56" width="24" height="16" rx="5" fill="#2f6fd6" stroke="' + BD + '" stroke-width="2.2"/>' +
    '<rect x="80" y="56.5" width="5" height="15" fill="#9aa6bd" stroke="#4a5470" stroke-width="1.4"/>' +
    '<path d="M79 59H96" stroke="#7fb2ff" stroke-width="2" stroke-linecap="round" stroke-opacity=".8"/>' +
    '<ellipse cx="100" cy="64" rx="5.5" ry="9.5" fill="' + Y + '" stroke="' + YD + '" stroke-width="2"/>' +
    '<ellipse cx="100.5" cy="64" rx="3" ry="5.6" fill="#47d9ff" stroke="#1a6a8a" stroke-width="1.2"/>' +
    '<ellipse cx="101" cy="62.5" rx="1.2" ry="2" fill="#fff" fill-opacity=".85"/></g>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><g class="wpn">' + cannon + '<circle cx="84" cy="65" r="5.2" fill="' + Y + '" stroke="' + YD + '" stroke-width="2"/></g></g></g></svg>';
}
