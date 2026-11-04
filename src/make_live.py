# builds the public GitHub Pages copy: its own save slots (one per signed-in player) plus Firebase cloud saves
import sys, time
src = open('portal-pals-play.html', encoding='utf-8').read()
a = "var KEY2 = 'portalPals.v2', KEY1 = 'portalPals.v1';"
assert src.count(a) == 1
out = src.replace(a, "var KEY2 = (function(){ var b = 'portalPals.live'; try { var u = localStorage.getItem('portalPals.live.user'); return u ? b + '.u.' + u : b; } catch (e) { return b; } })(), KEY1 = 'portalPals.live.none';\nwindow.PP_SAVE_KEY = KEY2;")
g = "if (!state.island.gift1){ state.island.gift1 = true; state.island.gold = (state.island.gold || 0) + 500000; save(); }     /* one-time 500,000 gold for testing: delete this line when done */\n"
assert out.count(g) == 1
out = out.replace(g, '')
cloud = open('cloud.js', encoding='utf-8').read()
out = out.rstrip()
assert out.endswith('</script>')
out += '\n<script type="module">\n' + cloud + '\n</script>\n'
if not out.lstrip().lower().startswith('<!doctype'):
    out = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Portal Pals</title></head><body>\n' + out + '\n</body></html>\n'
fav = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%22.5%22%20cy%3D%22.5%22%20r%3D%22.5%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23fff6c0%22/%3E%3Cstop%20offset%3D%22.35%22%20stop-color%3D%22%23c48bff%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%235b2aa8%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2229%22%20fill%3D%22%232b1a55%22/%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2225%22%20fill%3D%22url%28%23g%29%22/%3E%3Cpath%20d%3D%22M32%2014a18%2018%200%200%201%2018%2018M50%2032a18%2018%200%200%201-18%2018M32%2050a18%2018%200%200%201-18-18M14%2032a18%2018%200%200%201%2018-18%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.55%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20transform%3D%22rotate%2820%2032%2032%29%20scale%28.86%29%20translate%285.2%205.2%29%22/%3E%3Cpath%20d%3D%22M32%2021l3.2%206.6%207.2%201-5.2%205%201.3%207.1L32%2037.3l-6.5%203.4%201.3-7.1-5.2-5%207.2-1z%22%20fill%3D%22%23ffd23e%22%20stroke%3D%22%238a5e00%22%20stroke-width%3D%221.6%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E">'
assert out.count('<title>Portal Pals</title></head>') == 1
p32 = 'data:image/png;base64,' + __import__('base64').b64encode(open('fav32.png', 'rb').read()).decode()
p192 = 'data:image/png;base64,' + __import__('base64').b64encode(open('fav192.png', 'rb').read()).decode()
fav = '<link rel="icon" type="image/png" sizes="32x32" href="' + p32 + '"><link rel="icon" type="image/png" sizes="192x192" href="' + p192 + '"><link rel="apple-touch-icon" href="' + p192 + '"><meta name="theme-color" content="#2b1a55">' + fav
out = out.replace('<title>Portal Pals</title></head>', '<title>Portal Pals</title>' + fav + '</head>')
open('index.html', 'w', encoding='utf-8').write(out)
print('live build', len(out))
