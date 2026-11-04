const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
async function player(b,uid,name,setup){
  const ctx=await b.newContext({viewport:{width:1000,height:720}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));await ctx.exposeFunction('__rt',async()=>null);
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  if(setup){ await pg.evaluate(setup); await pg.reload(); await pg.waitForTimeout(3500); }
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await pg.waitForTimeout(800);
  return pg;
}
const mk=(xp,cw,sv)=>new Function(`const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.tut=99;o.island.skills=o.island.skills||{};o.island.skills.mining={xp:${xp},t:1};o.island.cannonWins=${cw};o.island.surv={arena:${sv}};o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));window.ppNoSave=true;`);
(async()=>{const b=await chromium.launch();
const A=await player(b,'uidA','Ana',mk(50000,12,7)), B=await player(b,'uidB','Boris',mk(1200,30,0)), C=await player(b,'uidC','Ceca',mk(250000,0,15));
await A.evaluate(()=>document.getElementById('btn-friends').click());await A.waitForTimeout(500);
await A.click('#fr-lb');await A.waitForTimeout(1500);
const rows=()=>A.evaluate(()=>[...document.querySelectorAll('.lb-row')].map(r=>r.innerText.replace(/\n/g,' ')).join(' / ')+' || '+((document.querySelector('.lb-mine')||{}).innerText||''));
console.log('total lv:',await rows());
await A.click('[data-lb=sk_mining]');await A.waitForTimeout(1200);console.log('mining:',await rows());
await A.screenshot({path:path.join(__dirname,'lb1.png')});
await A.click('[data-lb=w_cannon]');await A.waitForTimeout(1200);console.log('cannon wins:',await rows());
await A.click('[data-lb=s_arena]');await A.waitForTimeout(1200);console.log('arena surv:',await rows());
await b.close();})();
