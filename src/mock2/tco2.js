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
const giveArena=()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.items.push({id:'ar1',type:'arena',x:150,y:40,flip:false,sc:1,s:0});o.chars[0].level=10;o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));};
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
await A.evaluate(()=>window.__dfOpen('arena'));await A.waitForTimeout(400);
await A.click('[data-action=df-amode][data-m=fire]');
await A.click('[data-action=coop-list]');await A.waitForTimeout(200);
console.log('coop list:',await A.evaluate(()=>document.getElementById('coop-list').innerText.replace(/\n/g,' | ')));
await A.click('[data-action=coop-inv][data-lv="1"]');await A.waitForTimeout(1200);
console.log('A pop:',await A.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
console.log('B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
await B.click('#pv-acc');await B.waitForTimeout(3000);
const st=pg=>pg.evaluate(()=>{const D=window.__df;return {open:D.open,role:D.coop&&D.coop.role,ph:D.phase,wave:D.wave,foes:D.foes.length,kills:D.kills,team:D.team.map(p=>Math.round(p.x)+','+Math.round(p.y)+' hp'+Math.round(p.hp)),am:D.amode};});
console.log('A',JSON.stringify(await st(A)));console.log('B',JSON.stringify(await st(B)));
await A.evaluate(bot);await B.evaluate(bot);
await A.waitForTimeout(5000);
await B.click('#df-leave');await B.click('#df-leave');await B.waitForTimeout(500);
console.log('B after leaving:',await B.evaluate(()=>[window.__df.open, !!window.__df.coop]));
await A.waitForTimeout(12000);
const s2=await A.evaluate(()=>{const D=window.__df;return {ph:D.phase,gone:D.coop&&D.coop.gone,kills:D.kills,banner:document.getElementById('df-banner').innerText};});
console.log('A after B left:',JSON.stringify(s2));
await b.close();
})();
