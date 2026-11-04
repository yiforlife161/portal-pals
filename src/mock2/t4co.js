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
if(MODE==='dig'){ await A.evaluate(()=>window.__thOpen()); } else { await A.evaluate(m=>window.__dfOpen(m),MODE); }
await A.waitForTimeout(400);
await A.click('[data-action=coop-list]');await A.waitForTimeout(300);
console.log('coop list:',await A.evaluate(()=>document.getElementById('coop-list').innerText.replace(/\n/g,' | ')));
await A.click('#coop-list .coop-fr:nth-child(1) [data-action=coop-inv]');await A.waitForTimeout(1200);
console.log('A pop1:',await pop(A));
await A.click('#pt-more');await A.waitForTimeout(200);
console.log('A more:',await pop(A));
await A.click('[data-pt-inv]');await A.waitForTimeout(1000);
await A.click('#pt-more');await A.waitForTimeout(200);
await A.click('[data-pt-inv]');await A.waitForTimeout(1000);
console.log('A pop3:',await pop(A));await A.locator('.pv-pop').screenshot({path:'/tmp/claude-0/-home-claude/68f86e07-1ade-5c68-9370-7559d7ff417e/scratchpad/lobby.png'});
for(const [n,P] of [['B',B],['C',C],['D',D]]) console.log(n,'pop:',await pop(P));
await B.click('#pv-acc');await B.waitForTimeout(1500);
console.log('B after accept:',await pop(B));console.log('A:',await pop(A));
await C.click('#pv-acc');await C.waitForTimeout(1500);
console.log('A:',await pop(A));
await D.click('#pv-acc');await D.waitForTimeout(4000);
console.log('A after all:',await pop(A));
if(MODE==='dig'){
  const st=pg=>pg.evaluate(()=>{const T=window.__th;return {open:T.open,ph:T.phase,role:T.coop&&T.coop.role,slot:T.coop&&T.coop.slot,spots:T.spots.length,dug:T.spots.filter(s=>s.dug).length,digs:T.digs,me:Math.round(T.hero.x)+','+Math.round(T.hero.y),mates:T.coop?T.coop.mates.map(m=>m.name+'@'+m.slot+':'+Math.round(m.x)+(m.done?' done':'')):[]};});
  for(const [n,P] of [['A',A],['B',B],['C',C],['D',D]]) console.log(n,JSON.stringify(await st(P)));
  // everyone digs all their digs on random spots
  for(let r=0;r<14;r++){ for(const P of [A,B,C,D]) await P.evaluate(()=>{const T=window.__th;if(T.phase!=='play'||T.digs<=0)return;const free=T.spots.map((s,i)=>i).filter(i=>!T.spots[i].dug);if(!free.length)return;const i=free[Math.floor(Math.random()*free.length)];T.digs--;T.spots[i].dug=true;window.__thResolve(i);}); await A.waitForTimeout(500); }
  await A.waitForTimeout(4000);
  for(const [n,P] of [['A',A],['B',B],['C',C],['D',D]]) console.log(n,JSON.stringify(await st(P)));
  await A.screenshot({path:path.join(__dirname,'p4th.png')});
} else {
  const st=pg=>pg.evaluate(()=>{const D=window.__df;return {open:D.open,role:D.coop&&D.coop.role,slot:D.coop&&D.coop.slot,ph:D.phase,wave:D.wave,foes:D.foes.length,kills:D.kills,team:D.team.map(p=>(p.mname||'me')+'#'+p.slot+' '+Math.round(p.x)+','+Math.round(p.y)+' hp'+Math.round(p.hp))};});
  for(const [n,P] of [['A',A],['B',B],['C',C],['D',D]]) console.log(n,JSON.stringify(await st(P)));
  for(const P of [A,B,C,D]) await P.evaluate(bot);
  await A.waitForTimeout(25000);
  for(const [n,P] of [['A',A],['B',B],['C',C],['D',D]]) console.log(n,JSON.stringify(await st(P)));
  await A.screenshot({path:path.join(__dirname,'p4a.png')});await C.screenshot({path:path.join(__dirname,'p4c.png')});
  await A.evaluate(()=>{clearInterval(window.__bot)});await A.evaluate(()=>window.__dfFinish(true));
  for(let w=0;w<6;w++){ await A.waitForTimeout(2500); console.log('t',w, await A.evaluate(()=>window.__df.phase+' endOut:'+!!(window.__df.coop&&window.__df.coop.endOut)), await B.evaluate(()=>window.__df.phase+' coop:'+!!window.__df.coop+' done:'+!!(window.__df.coop&&window.__df.coop.done)+' since:'+(window.__df.coop?Date.now()-window.__df.coop.lastIn:-1))); }
  for(const [n,P] of [['A',A],['B',B],['C',C],['D',D]]) console.log(n,'end',await P.evaluate(()=>window.__df.phase+' | '+document.getElementById('df-panel').innerText.split('\n').slice(0,2).join(' | ')));
  const g1=[];for(const P of [A,B,C,D]) g1.push(await P.evaluate(()=>window.__st.island.gold));
  console.log('gold gained',g1.map((g,i)=>g-g0[i]).join(','));
}
console.log('rt stats',JSON.stringify(rt.stats()));
await b.close();
})();
