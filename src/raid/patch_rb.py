# puts src/raid/bosses.js into the game html between the /* ==RB== */ and /* ==/RB== */ markers (or before dfDrawBoss the first time)
import re, os
H = os.path.join(os.path.dirname(__file__), '..', 'portal-pals-play.html')
s = open(H).read(); code = open(os.path.join(os.path.dirname(__file__), 'bosses.js')).read().rstrip('\n') + '\n'
a = s.find('/* ==RB=='); b = s.find('/* ==/RB== */')
if a >= 0 and b > a:
    s = s[:a] + code + s[b + len('/* ==/RB== */\n'):]
else:
    i = s.index('function dfDrawBoss(g, f){'); s = s[:i] + code + s[i:]
open(H, 'w').write(s); print('rb ok')
