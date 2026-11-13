// Element Clash: B reloads mid-match and rejoins (pick made before reload is still sent), ties, sudden death; phone screenshots
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
async function player(b,uid,name,phone){
  const ctx=await b.newContext({viewport:phone?{width:390,height:800}:{width:900,height:760}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));pg.on('console',m=>{if(m.text().includes('KCAUTO'))console.log(name,m.text());});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();window.__st.island.tut=99;});await pg.waitForTimeout(500);
  return pg;
}
const o=(pg)=>pg.evaluate(()=>JSON.stringify(window.__st.island.cards.o));
const head=(pg)=>pg.evaluate(()=>{const k=document.querySelector('.kc-view');return k&&!k.hidden?k.innerText.replace(/\s+/g,' ').slice(0,150):'(closed)';});
const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana'); let B=await player(b,'uidB','Boris',true);
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const c=await codeOf(B); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await W(900);await B.click('[data-fr-acc]');await W(1500);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
await A.evaluate(()=>{window.__st.island.cards.o={'3':3};});
await B.evaluate(()=>{window.__st.island.cards.o={'30':3};});await W(1500);
await A.click('[data-action=cards-open]');await A.click('[data-action=kc-start]');await W(300);await A.click('[data-action=kc-inv]');await W(1200);await B.click('#pv-acc');await W(1500);
for(const [P,k] of [[A,3],[B,30]]){await P.click('[data-action=kc-add]');for(let i=0;i<3;i++){await P.click('[data-action=kc-give][data-k="'+k+'"]');await W(150);}await P.click('[data-action=kc-pdone]');}
await W(1500);await B.screenshot({path:'/tmp/kc_stake.png'});
await A.click('[data-action=kc-ready]');await W(800);await B.click('[data-action=kc-ready]');await W(2500);
// tie rounds: same element each round
const WH=['water','fire','life','earth','air','tech','magic','undead'];
for(let r=0;r<2;r++){await A.evaluate(e=>window.__kd.kcPick(e),WH[r]);await B.evaluate(e=>window.__kd.kcPick(e),WH[r]);await W(2200);}
console.log('after 2 ties:',await head(A));
await B.evaluate(e=>window.__kd.kcPick(e),'life');await W(1200);
await B.screenshot({path:'/tmp/kc_play.png'});
console.log('A timer',await A.evaluate(()=>[window.__kd.KC.rIdx,Date.now()-window.__kd.KC.rT0,window.__kd.kcBoard().rows.length,window.__kd.kcBoard().wait]));console.log('B saved pick, reloading:',await B.evaluate(()=>JSON.stringify(window.__st.island.cards.cl.pick&&window.__st.island.cards.cl.pick.el)));
await B.evaluate(()=>window.__save&&window.__save());await W(400);
await B.reload();await W(1200);await B.click('#pp-signin').catch(()=>{});await W(4500);
await B.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await W(4000);
console.log('B after reload:',await head(B));console.log('docB',await B.evaluate(()=>JSON.stringify({rA:window.__kd.KC.d.rA.map(x=>x.split(':')[0]),rB:window.__kd.KC.d.rB.map(x=>x.split(':')[0]),cl:window.__st.island.cards.cl})));
await A.evaluate(e=>window.__kd.kcPick(e),'life');await W(2500);
console.log('A round3:',await head(A));console.log('doc',await A.evaluate(()=>JSON.stringify({rA:window.__kd.KC.d.rA.map(x=>x.split(':')[0]),rB:window.__kd.KC.d.rB.map(x=>x.split(':')[0])})));
for(let r=3;r<8;r++){
  if(await A.evaluate(()=>!!window.__kd.KC.res))break;
  await A.evaluate(e=>window.__kd.kcPick(e),WH[r]);await B.evaluate(e=>window.__kd.kcPick(e),WH[r]);await W(2300);
  console.log('round',r+1,await head(A));
}
await W(1500);
console.log('END A:',await head(A));console.log('END B:',await head(B));
console.log('A',await o(A),'B',await o(B));
await B.screenshot({path:'/tmp/kc_end2.png'});
await b.close();process.exit(0);})();
