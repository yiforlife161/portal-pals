/* Sir Rattlebones: an original skeleton knight pal (preview only) */
function knightArt(){
  var O = '#2a2540';
  return wrapSvg(
    /* breastplate */
    outlined('<path d="M30 64Q50 56 70 64L73 87Q50 95 27 87Z"/>', '#5d7fae', '#22314e') +
    '<path d="M31 66Q50 59 69 66" fill="none" stroke="#e8b83e" stroke-width="3.2" stroke-linecap="round"/>' +
    '<path d="M50 64V91" stroke="#8fb2dc" stroke-width="2.4"/><circle cx="36" cy="75" r="1.8" fill="#e8b83e"/><circle cx="64" cy="75" r="1.8" fill="#e8b83e"/>' +
    /* skull */
    outlined('<path d="M50 17C67 17 77 28 77 43C77 52 72 58 66 61V65C66 68 64 70 61 70H39C36 70 34 68 34 65V61C28 58 23 52 23 43C23 28 33 17 50 17Z"/>', '#f1e8d2', '#3a3550') +
    '<g class="eye"><ellipse cx="40" cy="46" rx="7.5" ry="8.5" fill="' + O + '"/><circle cx="41.5" cy="47.5" r="3" fill="#7ff3ff"/></g>' +
    '<g class="eye"><ellipse cx="60" cy="46" rx="7.5" ry="8.5" fill="' + O + '"/><circle cx="61.5" cy="47.5" r="3" fill="#7ff3ff"/></g>' +
    '<path d="M50 53L46.5 58.5H53.5Z" fill="' + O + '"/>' +
    '<path d="M39 63.5H61M44 60.5V67M50 60.5V67M56 60.5V67" fill="none" stroke="#3a3550" stroke-width="2" stroke-linecap="round"/>' +
    /* helmet with cheek guards */
    outlined('<path d="M21 42C21 22 34 11 50 11C66 11 79 22 79 42L79 51L72 49L71 35C65 30 58 28.5 50 28.5C42 28.5 35 30 29 35L28 49L21 51Z"/>', '#5d7fae', '#22314e') +
    '<path d="M29 35C36 29.5 64 29.5 71 35" fill="none" stroke="#e8b83e" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M31 19C35 15 40 13.5 45 13" fill="none" stroke="#a9c6ea" stroke-width="3" stroke-linecap="round" stroke-opacity=".8"/>' +
    /* plume */
    outlined('<path d="M41 13C39 4 45 1 50 1C55 1 61 4 59 13C56 11 44 11 41 13Z"/>', '#e04a3c', '#6e1a14', 2.6) +
    '<path d="M46 11V4M50 10.5V2.5M54 11V4" stroke="#ff8a6a" stroke-width="1.6" stroke-linecap="round"/>');
}
function knightBack(c){
  var o = '#3a3550', f = '#f1e8d2';
  function leg(cls, x1, x2, fx){
    return '<g class="lg ' + cls + '"><path d="M' + x1 + ' 80L' + x2 + ' 97" stroke="' + o + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' 80L' + x2 + ' 97" stroke="' + f + '" stroke-width="4.6" stroke-linecap="round"/>' +
      '<path d="M' + (fx - 8) + ' 103Q' + (fx - 8) + ' 95 ' + fx + ' 95Q' + (fx + 8) + ' 95 ' + (fx + 8) + ' 103Z" fill="#5d7fae" stroke="#22314e" stroke-width="2.2" stroke-linejoin="round"/></g>';
  }
  function arm(x1, y1, x2, y2){
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + o + '" stroke-width="8.5" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + f + '" stroke-width="4.2" stroke-linecap="round"/>';
  }
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true">' + leg('lgL', 41, 38, 35) + leg('lgR', 59, 62, 65) +
    '<g><g class="pump pL">' + arm(32, 67, 15, 70) + '</g></g><g><g class="pump pR">' + arm(68, 66, 86, 64) + '</g></g></svg>';
}
function knightFront(c){
  var blade = '<path d="M84 58C96 46 99 30 92 15C90 31 86 44 78.5 55Z" fill="#e9f0f8" stroke="#45506a" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M83 53C91 44 94 33 92.5 22" fill="none" stroke="#b3c0d4" stroke-width="1.3"/>' +
    '<rect x="76" y="55" width="17" height="4.5" rx="2" fill="#e8b83e" stroke="#7a5200" stroke-width="1.4" transform="rotate(-18 84.5 57)"/>' +
    '<rect x="84" y="59" width="4" height="10" rx="1.5" fill="#6b3f1d" stroke="#3b2412" stroke-width="1.2"/>' +
    '<circle cx="86" cy="70.5" r="2.5" fill="#e8b83e" stroke="#7a5200" stroke-width="1.2"/>';
  var shield = '<circle cx="15" cy="70" r="15.5" fill="#22314e"/><circle cx="15" cy="70" r="13" fill="#e8b83e"/><circle cx="15" cy="70" r="10" fill="#5d7fae"/>' +
    '<path d="M8 63L22 77M22 63L8 77" stroke="#f1e8d2" stroke-width="3.6" stroke-linecap="round"/><path d="M8 63L22 77M22 63L8 77" stroke="#3a3550" stroke-width="1" stroke-linecap="round" stroke-opacity=".5"/>' +
    '<circle cx="15" cy="70" r="3.2" fill="#e8b83e" stroke="#7a5200" stroke-width="1.2"/>' +
    '<path d="M6 61A13 13 0 0 1 13 57.2" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true">' +
    '<g><g class="pump pR"><g class="wpn">' + blade + '<circle cx="86" cy="64" r="4.8" fill="#5d7fae" stroke="#22314e" stroke-width="2.2"/></g></g></g>' +
    '<g><g class="pump pL">' + shield + '</g></g></svg>';
}
