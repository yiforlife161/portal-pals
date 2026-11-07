s=open('index.html',encoding='utf-8').read()
a="window.dispatchEvent(new Event('pp-game-ready'));"
assert s.count(a)==1
h="window.__st=state;window.__df=df;window.__th=th;window.__thOpen=thOpen;window.__thResolve=thResolve;window.__dfNearest=dfNearest;window.__dfAim=dfAimAttack;window.__dfOpen=dfOpen;window.__dfFinish=dfFinish;window.__dfHurt=dfHurt;window.__thGen=thGen;window.__petOn=petOn;window.__petFor=petFor;window.__ITEMS=ITEMS;window.__skp=SKP;window.__enterArea=enterArea;window.__cmdI=commandInteract;window.__isNode=isNode;window.__qu=qu;window.__quOpen=quOpen;window.__quIslAt=quIslAt;window.__quTry=quTryAttack;window.__quHurt=quHurtPal;window.__quWalk=quWalk;window.__quGen=quGen;window.__quMove=quMove;window.__cn=cn;window.__cnOpen=cnOpen;window.__cnBegin=cnBegin;window.__cnClose=cnClose;"
s=s.replace('const PT_MAX = 3;','const PT_MAX = 3; window.__pt = PT; window.__co = CO; window.__F = F;')
open('mock2/coopx.html','w',encoding='utf-8').write(s.replace(a,h+a))
open('mock2/newx.html','w',encoding='utf-8').write(s.replace(a,h+a))
print('built')

open('mock2/ssx.html','w',encoding='utf-8').write(s.replace(a,h+'window.__ssOpen=ssOpen;window.__ssClose=ssClose;'+a))
