/* Moonblade (preview, key 'mb'): the owner's drawing: a blue-skinned elf swordswoman who floats on a swirling genie tail instead of legs with long pointed ears, a tall red
   ponytail tied with a purple band that falls down behind her, a stern look, purple plate armour with lavender trim (round
   shoulder guards, a V-shaped chest piece, a belt with a square buckle, a split armoured skirt), purple bracers and tall
   purple boots, and a curved sword in each hand. Faces right like every pal (the face looks at you). */
var MOON = { S: '#5a86e8', SD: '#1a2e6a', SL: '#8eb0f6', H: '#e8322a', HD: '#6a0a08', HL: '#ff7a5a', A: '#6a34c0', AD: '#24104a', AL: '#b48cf0',
  K: '#2a2440', G: '#e0b040', GD: '#6a4a10', B: '#d8dce8', BD: '#3a3e52', BL: '#ffffff', E: '#efe8ff', EP: '#5a4a8a' };
/* a curved sword: wrapped grip in the hand at (x, y), gold guard, the blade curving out in direction dir (1 right, -1 left) */
function moonSword(x, y, dir){
  var Z = MOON;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + dir + ' 1)">' +
    '<path d="M-7 1L2 0" stroke="' + Z.K + '" stroke-width="4.6" stroke-linecap="round"/>' +
    '<path d="M-6 .2L-4 1.6M-3.4 .1L-1.4 1.5" stroke="#6a6488" stroke-width="1" stroke-linecap="round"/>' +
    '<ellipse cx="3.4" cy="0" rx="1.6" ry="4.2" fill="' + Z.G + '" stroke="' + Z.GD + '" stroke-width="1.2"/>' +
    '<path d="M5 -1.8Q20 -4 34 -9L36 -8.4Q22 -1.6 5 2Z" fill="' + Z.B + '" stroke="' + Z.BD + '" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M7 -.6Q20 -2.8 33 -7.6" stroke="' + Z.BL + '" stroke-width=".9" stroke-linecap="round" fill="none"/></g>';
}
function moonArt(){
  var Z = MOON;
  return wrapSvg(
    /* the ponytail: up from the crown, then falling down behind her back to the left */
    outlined('<path d="M50 8Q40 0 34 6Q30 14 34 22Q24 30 22 46Q20 60 26 70Q30 64 30 56Q32 44 40 34Q46 24 52 16Z"/>', Z.H, Z.HD, 2.2) +
    '<path d="M36 8Q32 14 35 21M30 30Q24 42 26 60M34 34Q28 46 29 58" fill="none" stroke="' + Z.HL + '" stroke-width="1.5" stroke-linecap="round"/>' +
    /* the genie tail: blue like her skin, narrowing below the skirt and curling into a wisp at the bottom */
    outlined('<path d="M39 72L61 72Q65 84 56 91Q48 95 51 98.6Q56 100.4 63 96Q61 104 50 103.4Q39 101.6 43 93Q47 88 45 84Q41 80 39 72Z"/>', Z.S, Z.SD, 2.2) +
    '<path d="M57 78Q58 86 51 90M47 80Q49 85 46 89M58 99Q54 101.6 49 100.6" fill="none" stroke="' + Z.SL + '" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M42 95Q40 99 44 101.6" fill="none" stroke="' + Z.SD + '" stroke-width="1.2" stroke-linecap="round" stroke-opacity=".5"/>' +
    /* armoured skirt: a front plate between two side panels, lavender trim */
    outlined('<path d="M38 68L62 68L63.6 77L56 79L50 86L44 79L36.4 77Z"/>', Z.A, Z.AD, 2) +
    '<path d="M45 69L46 78L50 84L54 78L55 69" fill="none" stroke="' + Z.AL + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    /* body: purple chest armour with a lavender V */
    outlined('<path d="M40 46Q50 42 60 46L61 58Q60 64 58 68L42 68Q40 64 39 58Z"/>', Z.A, Z.AD, 2.2) +
    '<path d="M42 48L50 58L58 48" fill="none" stroke="' + Z.AL + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M44 60Q50 62 56 60" fill="none" stroke="' + Z.AL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    /* belt with a square buckle */
    '<rect x="39" y="65" width="22" height="5" rx="1.5" fill="' + Z.K + '" stroke="' + Z.AD + '" stroke-width="1.4"/>' +
    '<rect x="47" y="64.4" width="6" height="6" rx="1" fill="none" stroke="' + Z.AL + '" stroke-width="1.6"/>' +
    /* round shoulder guards */
    outlined('<path d="M33 48Q34 42 41 43L42 50Q37 52 33 48Z"/>', Z.A, Z.AD, 1.8) + outlined('<path d="M67 48Q66 42 59 43L58 50Q63 52 67 48Z"/>', Z.A, Z.AD, 1.8) +
    '<path d="M35 46Q37 44 40 44.6M65 46Q63 44 60 44.6" fill="none" stroke="' + Z.AL + '" stroke-width="1.2" stroke-linecap="round"/>' +
    /* neck and head */
    '<rect x="46.5" y="39" width="7" height="6" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="1.4"/>' +
    /* long pointed ears sweeping out and up */
    outlined('<path d="M38 30Q26 26 15 18Q24 30 37 36Z"/>', Z.S, Z.SD, 1.8) + outlined('<path d="M62 30Q74 26 85 18Q76 30 63 36Z"/>', Z.S, Z.SD, 1.8) +
    '<path d="M34 30Q26 26 21 22M66 30Q74 26 79 22" fill="none" stroke="' + Z.SL + '" stroke-width="1.1" stroke-linecap="round"/>' +
    outlined('<path d="M50 17C60 17 65 24 65 31C65 39 58 44 50 44C42 44 35 39 35 31C35 24 40 17 50 17Z"/>', Z.S, Z.SD, 2.2) +
    /* stern eyes: pale with violet irises under straight brows */
    '<path d="M40 30Q43.5 28 47 30.4Q46 33.6 43 33.6Q40.6 33 40 30Z" fill="' + Z.E + '" stroke="' + Z.SD + '" stroke-width="1.2"/><circle cx="44.2" cy="31.2" r="1.6" fill="' + Z.EP + '"/>' +
    '<path d="M60 30Q56.5 28 53 30.4Q54 33.6 57 33.6Q59.4 33 60 30Z" fill="' + Z.E + '" stroke="' + Z.SD + '" stroke-width="1.2"/><circle cx="55.8" cy="31.2" r="1.6" fill="' + Z.EP + '"/>' +
    '<path d="M39.5 27.6L46.8 28.6M60.5 27.6L53.2 28.6" stroke="' + Z.SD + '" stroke-width="1.7" stroke-linecap="round"/>' +
    '<path d="M48 38.6Q50 38 52 38.6" stroke="' + Z.SD + '" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
    /* hair: a red fringe swept to one side, the purple hair band on top */
    outlined('<path d="M35.4 27Q35 15 50 14Q64 14 65.6 25Q60 19.6 52 20.4Q44 21.4 36.4 26.6Z"/>', Z.H, Z.HD, 2) +
    '<path d="M41 22Q46 18 54 18" fill="none" stroke="' + Z.HL + '" stroke-width="1.4" stroke-linecap="round"/>' +
    '<ellipse cx="47" cy="12" rx="4.2" ry="2.6" transform="rotate(-24 47 12)" fill="' + Z.A + '" stroke="' + Z.AD + '" stroke-width="1.4"/>');
}
function moonBack(c){
  var Z = MOON;
  /* back arm out to the left: a purple bracer, blue hand, a sword pointing left */
  var arm = '<path d="M38 50L26 56" stroke="' + Z.SD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M38 50L26 56" stroke="' + Z.S + '" stroke-width="4.6" stroke-linecap="round"/>' +
    '<path d="M33 51.4L27 54.4" stroke="' + Z.AD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M33 51.4L27 54.4" stroke="' + Z.A + '" stroke-width="5" stroke-linecap="round"/>' +
    moonSword(22, 57, -1) + '<circle cx="23" cy="57" r="3.2" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="1.4"/>';
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pL">' + arm + '</g></g></svg>';
}
function moonFront(c){
  var Z = MOON;
  /* front arm out to the right with the other sword; the sword is in the weapon group so it slashes */
  return '<svg class="limbs" viewBox="0 0 100 100" aria-hidden="true" style="overflow:visible">' +
    '<g><g class="pump pR"><path d="M62 50L74 56" stroke="' + Z.SD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M62 50L74 56" stroke="' + Z.S + '" stroke-width="4.6" stroke-linecap="round"/>' +
    '<path d="M67 51.4L73 54.4" stroke="' + Z.AD + '" stroke-width="7.4" stroke-linecap="round"/><path d="M67 51.4L73 54.4" stroke="' + Z.A + '" stroke-width="5" stroke-linecap="round"/>' +
    '<g class="wpn">' + moonSword(78, 57, 1) + '<circle cx="77" cy="57" r="3.2" fill="' + Z.S + '" stroke="' + Z.SD + '" stroke-width="1.4"/></g></g></g></svg>';
}
