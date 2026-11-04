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
const giveArena=()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.items.push({id:'ar1',type:'guard',x:150,y:40,flip:false,sc:1,s:0});o.chars[0].level=10;o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));};
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
await A.evaluate(()=>window.__dfOpen('defense'));await A.waitForTimeout(400);
await A.click('[data-action=coop-list]');await A.waitForTimeout(200);
console.log('coop list:',await A.evaluate(()=>document.getElementById('coop-list').innerText.replace(/\n/g,' | ')));
await A.click('[data-action=coop-inv][data-lv="1"]');await A.waitForTimeout(1200);
console.log('A pop:',await A.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
console.log('B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
await B.click('#pv-acc');await B.waitForTimeout(3000);
const st=pg=>pg.evaluate(()=>{const D=window.__df;return {mode:D.mode,gems:D.gems,lost:D.lost,rk:(D.rockets||[]).length,stun:D.hero&&D.hero.stunN,stuns:D.runStuns,carry:D.foes.filter(f=>f.carry).length,open:D.open,role:D.coop&&D.coop.role,ph:D.phase,wave:D.wave,foes:D.foes.length,kills:D.kills,team:D.team.map(p=>Math.round(p.x)+','+Math.round(p.y)+' hp'+Math.round(p.hp)),am:D.amode};});
console.log('A',JSON.stringify(await st(A)));console.log('B',JSON.stringify(await st(B)));
await A.evaluate(bot);await B.evaluate(bot);
for(let i=0;i<24;i++){await A.waitForTimeout(500);const q=await st(B);if(q.stun>0){console.log('B got stunned',JSON.stringify(q));break;}}
await A.waitForTimeout(4000);
console.log('A',JSON.stringify(await st(A)));console.log('B',JSON.stringify(await st(B)));
await A.screenshot({path:path.join(__dirname,'co1.png')});await B.screenshot({path:path.join(__dirname,'co2.png')});
const bKills0=await A.evaluate(()=>window.__df.kills);
// stop A's bot: only B attacks for 8s -> kills must still rise on the host
await A.evaluate(()=>clearInterval(window.__bot));
await A.waitForTimeout(8000);
console.log('kills while only B attacks:',bKills0,'->',await A.evaluate(()=>window.__df.kills));
await A.evaluate(bot);
for(let i=0;i<20;i++){ await A.waitForTimeout(5000); const a=await st(A); if(a.ph==='end'||a.ph==='ending') break; }
await A.waitForTimeout(4000);
console.log('A end',JSON.stringify(await st(A)), await A.evaluate(()=>document.getElementById('df-panel').innerText.split('\n').slice(0,6).join(' | ')));
console.log('B end',JSON.stringify(await st(B)), await B.evaluate(()=>document.getElementById('df-panel').innerText.split('\n').slice(0,6).join(' | ')));
console.log('gold gained A',(await gold(A))-g0[0],'B',(await gold(B))-g0[1]);
console.log('xp A',await A.evaluate(()=>window.__st.chars[0].xp),'B',await B.evaluate(()=>window.__st.chars[0].xp));
console.log('rt stats',JSON.stringify(rt.stats()));
await b.close();
})();
