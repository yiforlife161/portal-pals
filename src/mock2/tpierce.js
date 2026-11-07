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
const P=await player(b,'u1','Ana');
await P.evaluate(()=>{const I=window.__st.island;I.lvWon=Object.assign({},I.lvWon,{arena:3,quest:3});const h=window.__st.chars.find(c=>c.id===I.hero)||window.__st.chars[0];h.style='ranged';});
await P.evaluate(()=>window.__dfOpen('arena'));await P.waitForTimeout(400);
await P.click('[data-action=df-start][data-lv="3"]');await P.waitForTimeout(2500);
for(let i=0;i<30&&await P.evaluate(()=>window.__df.foes.filter(f=>!f.dead).length<4);i++){await P.evaluate(()=>{window.__df.hero.hp=window.__df.hero.maxhp;});await P.waitForTimeout(500);}
const r=await P.evaluate(async()=>{const df=window.__df,H=df.hero;
  const fs=df.foes.filter(f=>!f.dead).slice(0,4);if(fs.length<4)return 'only '+fs.length+' foes';
  fs.forEach((f,i)=>{f.x=H.x+40+i*30;f.y=H.y;f.spd=0;f.T=Object.assign({},f.T,{spd:0});f.hp=f.max=1000;});
  df.aim={x:H.x+400,y:H.y-22};H.cool=0;window.__dfAim(H);
  await new Promise(r=>setTimeout(r,600));return 'ranged hero dmg '+H.dmg.toFixed(1)+', 4 monsters in a line took: '+fs.map(f=>Math.round(1000-f.hp)).join(', ');});
console.log('arena:',r);
await P.evaluate(()=>{window.__df.phase='end';});
await P.context().close();
const Q=await player(b,'u2','Ana');
await Q.evaluate(()=>{const I=window.__st.island;I.lvWon=Object.assign({},I.lvWon,{quest:3});const h=window.__st.chars.find(c=>c.id===I.hero)||window.__st.chars[0];h.style='ranged';});
await Q.evaluate(()=>window.__quOpen());await Q.waitForTimeout(400);await Q.click('[data-action=qu-start][data-lv="1"]');await Q.waitForTimeout(1500);
const r2=await Q.evaluate(async()=>{const q=window.__qu,p=q.P.find(x=>!x.mate);const L=q.L;let fs=L.foes.slice(0,4);
  if(fs.length<4)return 'only '+fs.length;
  fs.forEach((f,i)=>{f.x=p.x+40+i*30;f.y=p.y+4;f.hp=f.max=1000;f.spd=0;});
  p.cool=0;window.__quTry&&0;q.bolts.push({x:p.x,y:p.y-22,ox:p.x,oy:p.y-22,vx:600,vy:0,max:p.range+10,life:2,p:p,col:'#fff'});
  await new Promise(r=>setTimeout(r,600));return 'ranged hero dmg '+p.dmg.toFixed(1)+', 4 monsters in a line took: '+fs.map(f=>Math.round(1000-f.hp)).join(', ');});
console.log('quest:',r2);
await b.close();process.exit(0);})();
