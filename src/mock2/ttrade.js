// Card trading: Ana and Boris are friends; trade, change offers (Ready resets), swap, decline, cancel, reload keeps cards
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1000,height:720}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name,lat,sh])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));localStorage.setItem('mock.fslat',lat);localStorage.setItem('mock.shuffle',sh);},[uid,name,process.env.FS_LAT||'0',process.env.FS_SHUF||'0']);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();window.__st.island.tut=99;});await pg.waitForTimeout(500);
  return pg;
}
const o=(pg)=>pg.evaluate(()=>JSON.stringify(window.__st.island.cards.o));
const head=(pg)=>pg.evaluate(()=>{const k=document.querySelector('.kt-view');return k&&!k.hidden?k.innerText.replace(/\s+/g,' ').slice(0,160):'(closed)';});
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana'), B=await player(b,'uidB','Boris');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const c=await codeOf(B); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await B.waitForTimeout(900);await B.click('[data-fr-acc]');await B.waitForTimeout(1500);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
await A.evaluate(()=>{window.__st.island.cards={o:{'3':3,'4':1},td:{}};});
await B.evaluate(()=>{window.__st.island.cards={o:{'30':2},td:{}};});
await A.waitForTimeout(1500);
// 1) invite from the binder
await A.click('[data-action=cards-open]');await A.waitForTimeout(300);
await A.click('[data-action=kb-trade]');await A.waitForTimeout(300);
console.log('A picker:',await head(A));
await A.click('[data-action=kt-inv]');await A.waitForTimeout(1200);
console.log('A:',await head(A));
console.log('B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
await B.click('#pv-acc');await B.waitForTimeout(1500);
console.log('B:',await head(B));
console.log('A:',await head(A));
// offers
await A.click('[data-action=kt-add]');await A.click('[data-action=kt-give][data-k="3"]');await A.waitForTimeout(150);await A.click('[data-action=kt-give][data-k="3"]');await A.click('[data-action=kt-pdone]');
await B.click('[data-action=kt-add]');await B.click('[data-action=kt-give][data-k="30"]');await B.click('[data-action=kt-pdone]');
await A.waitForTimeout(1500);
console.log('B sees:',await head(B));
await A.click('[data-action=kt-ready]');await A.click('[data-action=kt-ready]').catch(()=>{});await A.waitForTimeout(1500);
console.log('A after a double tap on Ready:',await head(A));
console.log('B after A ready:',await head(B));
// B changes the offer: A's Ready must clear
await B.click('[data-action=kt-add]');await B.click('[data-action=kt-give][data-k="30"]');await B.click('[data-action=kt-pdone]');await A.waitForTimeout(1500);
console.log('A after B changed:',await head(A),'| B sees A ready?',await B.evaluate(()=>!!document.querySelector('.kt-ok')));
await A.click('[data-action=kt-ready]');await A.waitForTimeout(800);await B.click('[data-action=kt-ready]');await A.waitForTimeout(2500);
console.log('A:',await head(A));console.log('B:',await head(B));
console.log('A cards',await o(A),'| B cards',await o(B));
// 2) decline
await A.click('[data-action=kt-close]');await A.waitForTimeout(300);
await A.click('[data-action=kb-trade]');await A.waitForTimeout(300);await A.click('[data-action=kt-inv]');await A.waitForTimeout(1200);
await B.click('[data-action=kt-close]').catch(()=>{});await B.waitForTimeout(300);
await B.click('#pv-dec');await A.waitForTimeout(1500);
console.log('after decline A:',await head(A),'| flash',await A.evaluate(()=>document.getElementById('hint').innerText));
// 3) accept then B cancels
await A.click('[data-action=kt-close]').catch(()=>{});await A.waitForTimeout(300);
await A.evaluate(()=>window.ppTrade.invite('uidB'));await A.waitForTimeout(1500);
await B.click('#pv-acc');await B.waitForTimeout(1500);
await B.click('[data-action=kt-cancel]');await A.waitForTimeout(1500);
console.log('after B cancels A:',await head(A),'| flash',await A.evaluate(()=>document.getElementById('hint').innerText),'| B:',await head(B));
console.log('cards unchanged A',await o(A),'B',await o(B));
// 4) reload keeps cards
await B.evaluate(()=>{window.dispatchEvent(new Event('beforeunload'));});
await B.reload();await B.waitForTimeout(3000);
console.log('B after reload:',await B.evaluate(()=>JSON.stringify((JSON.parse(Object.keys(localStorage).filter(k=>/portalPals/.test(k)).map(k=>localStorage.getItem(k)).find(v=>v&&v.includes('"cards"'))||'{}').island||{}).cards)));
// 5) A says Ready and closes the game; B says Ready; A comes back and the swap finishes
await B.evaluate(()=>{const k=document.querySelector('.kt-view');if(k)k.hidden=true;});
await A.evaluate(()=>{const k=document.querySelector('.kt-view');if(k)k.hidden=true;window.ppTrade.invite('uidB');});await A.waitForTimeout(1500);
await B.click('#pv-acc');await B.waitForTimeout(1500);
await A.click('[data-action=kt-add]');await A.click('[data-action=kt-give][data-k="3"]');await A.click('[data-action=kt-pdone]');await A.waitForTimeout(1200);
await A.click('[data-action=kt-ready]');await A.waitForTimeout(1200);
console.log('A pend saved:',await A.evaluate(()=>!!window.__st.island.cards.pend));
await A.evaluate(()=>{window.ppNoSave=false;});
const Actx=A.context(); await A.goto('about:blank');
await B.click('[data-action=kt-ready]');await B.waitForTimeout(2000);
console.log('B:',await head(B),'| B cards',await o(B));
await A.goto('https://pp.test/');await A.waitForTimeout(1500);if(await A.$('#pp-signin:visible'))await A.click('#pp-signin');await A.waitForTimeout(8000);
console.log('A after coming back:',await head(A),'| A cards',await o(A),'| pend',await A.evaluate(()=>JSON.stringify(window.__st.island.cards.pend)));
await b.close();})();
