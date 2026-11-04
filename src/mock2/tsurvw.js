const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
const MODE=process.argv[2]||'arena';
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
const giveAll=()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));['arena','guard','raid','digsite'].forEach((t,i)=>o.island.items.push({id:'b'+i,type:t,x:150+i*90,y:40,flip:false,sc:1,s:0}));o.chars[0].level=10;o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));};
const lvl=()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.chars[0].level=10;o.chars[0].style='ranged';o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));};
const bot=()=>{window.__bot=setInterval(()=>{const D=window.__df,H=D.hero;if(!H||H.ko||!D.open)return;const f=window.__dfNearest(H.x,H.y,2000);if(f){D.aim={x:f.x,y:f.y-10};if(H.cool<=0)window.__dfAim(H);H.mv={x:f.x-(f.x>H.x?(H.ranged?110:40):-(H.ranged?110:40)),y:f.y};}},250);};
const pop=pg=>pg.evaluate(()=>{const p=document.querySelector('.pv-pop');return p.hidden?'(hidden)':p.innerText.replace(/\n/g,' | ');});
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana',giveAll), B=await player(b,'uidB','Boris',lvl), C=await player(b,'uidC','Cara',lvl), D=await player(b,'uidD','Dino',null);
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
await codeOf(A);
for(const P of [B,C,D]){const c=await codeOf(P);await A.fill('#fr-add',c);await A.click('#fr-send');await P.waitForTimeout(1000);await P.click('[data-fr-acc]');await P.waitForTimeout(1000);await P.evaluate(()=>document.getElementById('btn-friends').click());}
await A.evaluate(()=>document.getElementById('btn-friends').click());await A.waitForTimeout(500);
const g0=[];for(const P of [A,B,C,D]) g0.push(await P.evaluate(()=>window.__st.island.gold));
await A.evaluate(m=>window.__dfOpen(m),MODE);await A.waitForTimeout(400);
const w0=[await A.evaluate(()=>window.__st.island.raidWins||0),await B.evaluate(()=>window.__st.island.raidWins||0)];
await A.evaluate(()=>window.ppCoop.invite('uidB',4,'classic','raid'));await B.waitForTimeout(1500);
await B.click('#pv-acc');await B.waitForTimeout(4000);
await A.evaluate(()=>{window.__k=setInterval(()=>{const D=window.__df;if(D.phase==='play'){D.queue=[];D.foes.forEach(f=>f.dead=true);} else if(D.phase==='between'&&D.phT>0.5)D.phT=0.5;},300);});
for(let i=0;i<5;i++){ await A.waitForTimeout(2000); console.log('wave A',await A.evaluate(()=>window.__df.wave+' '+window.__df.phase+' wins '+window.__st.island.raidWins+' | '+document.getElementById('df-banner').innerText.replace(/\n/g,' / ')),'B',await B.evaluate(()=>window.__df.wave+' wins '+window.__st.island.raidWins)); }
console.log('start wins',w0);
await b.close();
})();
