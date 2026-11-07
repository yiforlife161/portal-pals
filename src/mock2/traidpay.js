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
(async()=>{const b=await chromium.launch();
const out=[];
for(const [mode,lv] of [['raid',1],['raid',2],['raid',3],['arena',1],['arena',2],['arena',3]]){
  const P=await player(b,'u'+mode+lv,'Ana');
  await P.evaluate(m=>{const I=window.__st.island;I.arenaMode='classic';I.lvWon=Object.assign({},I.lvWon,{[m]:3,raid:3,arena:3,defense:3});},mode);
  await P.evaluate(m=>window.__dfOpen(m),mode);await P.waitForTimeout(400);
  await P.click('[data-action=df-start][data-lv="'+lv+'"]');
  const g0=await P.evaluate(()=>[window.__st.island.gold]);
  // wipe out every monster as it shows up, until the end panel appears
  await P.evaluate(()=>{window.__k=setInterval(()=>{const df=window.__df;if(df.hero)df.hero.hp=df.hero.max||df.hero.hp;(df.foes||[]).forEach(f=>{if(!f.dead&&f.hp>0)window.__dfHurt(f,1e6,df.hero,false);});},150);});
  for(let i=0;i<120;i++){await P.waitForTimeout(1000);if(await P.evaluate(()=>window.__df.phase==='end'))break;}
  const r=await P.evaluate(()=>{const t=document.querySelector('.cn-stats');return (document.querySelector('#df-panel h2,.df-panel h2,h2')||{}).innerText+' | '+(t?t.innerText.replace(/\n/g,' '):'?');});
  console.log(mode,'level',lv,'->',r);
  await P.context().close();
}
await b.close();process.exit(0);})();
