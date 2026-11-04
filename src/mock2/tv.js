const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
async function player(b,uid,name,setup){
  const ctx=await b.newContext({viewport:{width:1100,height:760}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn/.test(m.type()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1500);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await pg.waitForTimeout(1500);
  return pg;
}
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana'), B=await player(b,'uidB','Boris');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const ca=await codeOf(A), cb=await codeOf(B);
// stranger read before friendship
try{ await db('get','uidB',[{path:'islands/uidA'}]); console.log('READ LEAK'); }catch(e){ console.log('stranger blocked:',e.message); }
await A.fill('#fr-add',cb);await A.click('#fr-send');await B.waitForTimeout(900);
await B.click('[data-fr-acc]');await B.waitForTimeout(1500);
const homeA=await A.evaluate(()=>localStorage.getItem(window.PP_SAVE_KEY));
const before=await B.evaluate(()=>document.querySelectorAll('#layer .item, .item').length);
await B.click('[data-fr-visit]');await B.waitForTimeout(1500);
console.log('B visiting:',await B.evaluate(()=>[window.ppGame.visiting(),document.getElementById('visitbar')&&document.getElementById('visitbar').innerText,document.getElementById('ribbon').textContent]));
await B.screenshot({path:path.join(__dirname,'v1.png')});
// try build & save blocked
const saveBefore=await B.evaluate(()=>localStorage.getItem(window.PP_SAVE_KEY));
await B.click('[data-mode=build]').catch(()=>{});await B.waitForTimeout(300);
console.log('hint',await B.textContent('#hint'));
await B.waitForTimeout(13000);
console.log('B save unchanged during visit:',saveBefore===await B.evaluate(()=>localStorage.getItem(window.PP_SAVE_KEY)));
console.log('B island doc still his own:', JSON.parse((await db('get','uidB',[{path:'islands/uidB'}])).d).items.length, 'A items', JSON.parse((await db('get','uidA',[{path:'islands/uidA'}])).d).items.length);
await B.click('[data-action=visit-home]');await B.waitForTimeout(800);
console.log('home:',await B.evaluate(()=>[window.ppGame.visiting(),document.getElementById('ribbon').textContent]));
await B.screenshot({path:path.join(__dirname,'v2.png')});
await B.evaluate(()=>document.getElementById('btn-friends').click());await B.waitForTimeout(300);
await B.screenshot({path:path.join(__dirname,'v3.png')});
await b.close();})();
