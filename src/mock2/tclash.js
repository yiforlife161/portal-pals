// Element Clash: Ana challenges Boris, stake rules, play to the end, cards move; then a forfeit by leaving
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:900,height:760}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();window.__st.island.tut=99;});await pg.waitForTimeout(500);
  return {pg,ctx};
}
const o=(pg)=>pg.evaluate(()=>JSON.stringify(window.__st.island.cards.o));
const head=(pg)=>pg.evaluate(()=>{const k=document.querySelector('.kc-view');return k&&!k.hidden?k.innerText.replace(/\s+/g,' ').slice(0,190):'(closed)';});
const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const b=await chromium.launch();
const {pg:A}=await player(b,'uidA','Ana'), {pg:B,ctx:Bctx}=await player(b,'uidB','Boris');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const c=await codeOf(B); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await W(900);await B.click('[data-fr-acc]');await W(1500);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
// Ana: 3x card#1 normal (common) + 1 legendary? ; Boris: 2x card#10 normal
await A.evaluate(()=>{const C=window.__st.island.cards;C.o={'3':3,'6':2};});
await B.evaluate(()=>{const C=window.__st.island.cards;C.o={'30':2,'33':3};});
await W(1500);
await A.click('[data-action=cards-open]');await W(300);
await A.click('[data-action=kc-start]');await W(300);
console.log('A chooser:',await head(A));
await A.click('[data-action=kc-inv]');await W(1200);
console.log('A:',await head(A));
console.log('B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
await B.click('#pv-acc');await W(1500);
console.log('B:',await head(B));
// A stakes 2, B stakes 1 -> invalid
await A.click('[data-action=kc-add]');await A.click('[data-action=kc-give][data-k="3"]');await W(200);await A.click('[data-action=kc-give][data-k="3"]');await A.click('[data-action=kc-pdone]');
await B.click('[data-action=kc-add]');await B.click('[data-action=kc-give][data-k="30"]');await B.click('[data-action=kc-pdone]');
await W(1500);
console.log('A note:',await A.evaluate(()=>(document.querySelector('.kc-view .kt-note')||{}).innerText),'| ready disabled',await A.evaluate(()=>document.querySelector('[data-action=kc-ready]').disabled));
await B.click('[data-action=kc-add]');await B.click('[data-action=kc-give][data-k="33"]');await B.click('[data-action=kc-pdone]');await W(1500);
console.log('B:',await head(B));
await A.click('[data-action=kc-ready]');await W(900);await B.click('[data-action=kc-ready]');await W(2500);
console.log('A play:',await head(A));
console.log('A cards (2 staked)',await o(A),'| B',await o(B));
// play rounds: A picks wheel order, B picks reversed
const WH=['water','fire','life','earth','air','tech','magic','undead'];
for(let r=0;r<8;r++){
  const st=await A.evaluate(()=>{const d=window.__kd.KC.d;return d&&d.st;});
  if(st!=='play'||await A.evaluate(()=>!!window.__kd.KC.res))break;
  await A.evaluate(e=>window.__kd.kcPick(e),WH[r]);await W(300);
  await B.evaluate(e=>window.__kd.kcPick(e),WH[(r+3)%8]);await W(2200);
  console.log('round',r+1,'A:',await head(A));
}
await W(1500);
console.log('END A:',await head(A));console.log('END B:',await head(B));
console.log('A cards',await o(A),'| B cards',await o(B),'| A cl',await A.evaluate(()=>JSON.stringify(window.__st.island.cards.cl)));
await A.screenshot({path:'/tmp/kc_end.png'});
// 2) forfeit: new clash, B closes the game mid-match
await A.click('[data-action=kc-close]');await B.click('[data-action=kc-close]');await W(300);
await A.evaluate(()=>{window.__st.island.cards.o['6']=2;});
await A.click('[data-action=kc-start]');await W(300);await A.click('[data-action=kc-inv]');await W(1200);await B.click('#pv-acc');await W(1500);
await A.click('[data-action=kc-add]');await A.click('[data-action=kc-give][data-k="6"]');await A.click('[data-action=kc-pdone]');
const bk=await B.evaluate(()=>Object.keys(window.__st.island.cards.o)[0]);
await B.click('[data-action=kc-add]');await B.click('[data-action=kc-give][data-k="'+bk+'"]');await B.click('[data-action=kc-pdone]');await W(1500);
console.log('B stake view:',await head(B));
await A.click('[data-action=kc-ready]');await W(800);await B.click('[data-action=kc-ready]');await W(2500);
await A.evaluate(()=>window.__kd.kcPick('fire'));await W(1500);
console.log('A mid:',await head(A));
const Bo=await o(B), Bcl=await B.evaluate(()=>JSON.stringify(window.__st.island.cards.cl));
console.log('B before close',Bo,Bcl);
await B.evaluate(()=>window.__save&&window.__save());await W(500);
await Bctx.close();
await W(70000);
console.log('A after B gone:',await head(A));
console.log('A cards',await o(A));
await b.close();process.exit(0);})();
