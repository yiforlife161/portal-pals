// Island Quest co-op: Ana hosts, Boris joins; both run the bot. Shared monsters/locks/chests, own rewards, shared finish
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8'), bot=fs.readFileSync(path.join(__dirname,'qbot.js'),'utf8');
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1000,height:680}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;I.lvWon=Object.assign({},I.lvWon,{quest:3});I.ach=I.ach||{};['q_first','q_hard','q_clean','q_chests','q_gold1','q_gold6','q_goldall','q_sun','q_kills'].forEach(k=>I.ach[k]=1);I.items.push({id:'qg1',type:'questgate',x:150,y:40,flip:false,sc:1,s:0});window.__st.chars[0].level=15;});await pg.waitForTimeout(500);
  await pg.addScriptTag({content:bot});
  return pg;
}
(async()=>{const b=await chromium.launch();const P=await player(b,'u1','Ana');
await P.evaluate(()=>window.__quOpen());await P.waitForTimeout(400);await P.click('[data-action=qu-start][data-lv="1"]');await P.waitForTimeout(1500);console.log('players',await P.evaluate(()=>window.__qu.P.length));
const r=await P.evaluate(async()=>{const q=window.__qu;const p=q.P.find(x=>!x.mate)||q.P[0];
  q.L.foes.length=0; p.hp=Math.round(p.maxhp*0.5); p.lastHit=q.t; const h0=p.hp;
  await new Promise(r=>setTimeout(r,8000)); return [h0,Math.round(p.hp),p.maxhp,q.open,q.L.foes.length];});
console.log('hp before',r[0],'after 8 s out of the fight',r[1],'(max',r[2]+') open',r[3],'foes',r[4], r[1]<=r[0]?'PASS no regen':'FAIL regen');
await b.close();process.exit(0);})();
