const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1100,height:760}});
  await ctx.route(/fonts\.g/,r=>r.abort());await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.addInitScript(([uid,name])=>{if(uid==='uidA')localStorage.setItem('portalPals.lang','sr');localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn|error/.test(m.type()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1500);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await pg.waitForTimeout(1500);
  console.log(name,await pg.evaluate(()=>[location.href,!!window.ppGame,!!document.getElementById('btn-friends'),document.getElementById('mm-acct').innerText.slice(0,60),document.body.innerHTML.length]));
  return pg;
}
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana Test'), B=await player(b,'uidB','Boris Test');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b')&&document.querySelector('.fr-code b').textContent),300));});
const ca=await codeOf(A), cb=await codeOf(B);
console.log('codes',ca,cb);
await A.fill('#fr-add',cb.toLowerCase());await A.click('#fr-send');await A.waitForTimeout(800);
console.log('A hint',await A.textContent('#hint'));
await B.waitForTimeout(800);
console.log('B badge',await B.textContent('#btn-friends'));
await B.screenshot({path:path.join(__dirname,'f1.png')});
await B.click('[data-fr-acc]');await B.waitForTimeout(1200);await A.waitForTimeout(600);
console.log('B hint',await B.textContent('#hint'));
console.log('A list',await A.evaluate(()=>[...document.querySelectorAll('.fr-item')].map(e=>e.innerText.replace(/\n/g,' | '))));
console.log('B list',await B.evaluate(()=>[...document.querySelectorAll('.fr-item')].map(e=>e.innerText.replace(/\n/g,' | '))));
await A.screenshot({path:path.join(__dirname,'f2.png')});
// rename
await A.fill('#fr-name','Anica');await A.click('#fr-savename');await B.waitForTimeout(1000);
console.log('B sees',await B.evaluate(()=>[...document.querySelectorAll('.fr-item b')].map(e=>e.textContent)));
// remove
await A.click('[data-fr-rem]');await A.click('[data-fr-rem]');await A.waitForTimeout(1000);await B.waitForTimeout(500);
console.log('after remove',await A.evaluate(()=>document.querySelectorAll('.fr-item').length),await B.evaluate(()=>document.querySelectorAll('.fr-item').length));
// abuse: B tries to add himself to A's friends without request
try{ await db('write','uidB',[{op:'set',path:'users/uidA/friends/uidB',v:{}}]); console.log('ABUSE ALLOWED'); }catch(e){ console.log('abuse blocked:',e.message); }
// bad code
await A.fill('#fr-add','PAL-ZZZZZZ');await A.click('#fr-send');await A.waitForTimeout(500);console.log('bad',await A.textContent('#hint'));
console.log(Object.keys(db.DB));
await b.close();})();
