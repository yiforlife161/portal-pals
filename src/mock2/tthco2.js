const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
async function player(b,uid,name,setup){
  const ctx=await b.newContext({viewport:{width:1000,height:680}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  if(setup){ await pg.evaluate(setup); await pg.evaluate(()=>{window.ppNoSave=true;}); await pg.reload(); await pg.waitForTimeout(3500); }
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();window.__st.island.tut=99;});await pg.waitForTimeout(800);
  return pg;
}
const giveArena=()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.items.push({id:'ar1',type:'digsite',x:150,y:40,flip:false,sc:1,s:0});o.chars[0].level=10;o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));};
const lvl=()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.chars[0].level=10;o.chars[0].style='ranged';o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));};
const bot=()=>{window.__bot=setInterval(()=>{const D=window.__df,H=D.hero;if(!H||H.ko||!D.open)return;const f=window.__dfNearest(H.x,H.y,2000);if(f){D.aim={x:f.x,y:f.y-10};if(H.cool<=0)window.__dfAim(H);H.mv={x:f.x-(f.x>H.x?(H.ranged?110:40):-(H.ranged?110:40)),y:f.y};}},250);};
const gold=pg=>pg.evaluate(()=>window.__st.island.gold);
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana',giveArena), B=await player(b,'uidB','Boris',lvl);
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const cb=await codeOf(B); await codeOf(A);
await A.fill('#fr-add',cb);await A.click('#fr-send');await B.waitForTimeout(900);
await B.click('[data-fr-acc]');await B.waitForTimeout(1200);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
const g0=[await gold(A),await gold(B)];
// A opens the arena, picks Fire Pit, invites B for level 1
await A.evaluate(()=>window.__thOpen());await A.waitForTimeout(400);
await A.evaluate(()=>document.querySelector('#th-panel [data-action=coop-list]').click());await A.waitForTimeout(300);
console.log('coop list:',await A.evaluate(()=>document.getElementById('coop-list').innerText.replace(/\n/g,' | ')));
await A.evaluate(()=>document.querySelector('#coop-list [data-action=coop-inv]').click());await A.waitForTimeout(1500);
console.log('B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
await B.evaluate(()=>document.getElementById('pv-acc').click());await B.waitForTimeout(4000);
const st=pg=>pg.evaluate(()=>{const T=window.__th;return {open:T.open,role:T.coop&&T.coop.role,ph:T.phase,land:T.land&&T.land.name,spots:T.spots.length,first:T.spots[0]&&[Math.round(T.spots[0].x),Math.round(T.spots[0].y)],digs:T.digs,dug:T.spots.filter(s=>s.dug).map(s=>s.res).join(','),mate:T.coop&&[Math.round(T.coop.x),Math.round(T.coop.y)]};});
console.log('A',JSON.stringify(await st(A)));console.log('B',JSON.stringify(await st(B)));
const useAll=pg=>pg.evaluate(()=>{const T=window.__th;for(let i=0;i<25&&T.digs>0;i++){if(!T.spots[i].dug)window.__thResolve(i);}});
for(let round=1;round<=2;round++){
  await useAll(A);await A.waitForTimeout(2500);
  console.log('round',round,'A after its digs:',JSON.stringify(await st(A)),'| panel shown:',await A.evaluate(()=>!document.getElementById('th-panel').hidden));
  await useAll(B);await B.waitForTimeout(4500);
  console.log('  A:',await A.evaluate(()=>window.__th.phase+' | '+document.getElementById('th-panel').innerText.split('\n')[0]),' B:',await B.evaluate(()=>window.__th.phase+' | '+document.getElementById('th-panel').innerText.split('\n')[0]));
  await A.waitForTimeout(1000);
  await A.evaluate(()=>document.querySelector('#th-panel [data-action=coop-list]').click());await A.waitForTimeout(300);
  await A.evaluate(()=>document.querySelector('#coop-list [data-action=coop-inv]').click());await A.waitForTimeout(2500);
  console.log('  B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ').slice(0,60)));
  await B.evaluate(()=>document.getElementById('pv-acc').click());await B.waitForTimeout(4000);
  console.log('  A',JSON.stringify(await st(A)));console.log('  B',JSON.stringify(await st(B)));
}
console.log('runs A/B',await A.evaluate(()=>window.__st.island.thRuns),await B.evaluate(()=>window.__st.island.thRuns));
await b.close();})();
