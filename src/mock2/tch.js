const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1100,height:760}});
  await ctx.route(/fonts\.g/,r=>r.abort());await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
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
await A.fill('#fr-add',cb.toLowerCase());await A.evaluate(s=>document.querySelector(s).click(),'#fr-send');await A.waitForTimeout(800);
console.log('A hint',await A.textContent('#hint'));
await B.waitForTimeout(800);
console.log('B badge',await B.textContent('#btn-friends'));
await B.screenshot({path:path.join(__dirname,'f1.png')});
await B.evaluate(s=>document.querySelector(s).click(),'[data-fr-acc]');await B.waitForTimeout(1500);await A.waitForTimeout(800);
// A opens chat with B and sends two messages
await A.evaluate(()=>{const f=document.getElementById('win-f');if(f.hidden)document.getElementById('btn-friends').click();});await A.waitForTimeout(300);
await A.evaluate(s=>document.querySelector(s).click(),'[data-fr-chat]');await A.waitForTimeout(800);
await A.fill('#ch-in','Hi sis! Wanna play arena?');await A.press('#ch-in','Enter');await A.waitForTimeout(300);
await A.fill('#ch-in','<b>not bold</b>');await A.evaluate(s=>document.querySelector(s).click(),'#ch-send');await A.waitForTimeout(1500);
console.log('A chat:',await A.evaluate(()=>document.getElementById('ch-list').innerText.replace(/\n/g,' | ')));
await B.evaluate(()=>{const f=document.getElementById('win-f');if(!f.hidden)document.getElementById('btn-friends').click();});
await B.waitForTimeout(1200);
console.log('B badge:',await B.textContent('#btn-friends'),'| hint:',await B.evaluate(()=>(document.getElementById('hint')||{}).textContent));
await B.evaluate(s=>document.querySelector(s).click(),'#btn-friends');await B.waitForTimeout(400);
console.log('B chat btn:',await B.textContent('[data-fr-chat]'));
await B.screenshot({path:path.join(__dirname,'ch0.png')});
await B.evaluate(s=>document.querySelector(s).click(),'[data-fr-chat]');await B.waitForTimeout(1200);
console.log('B chat:',await B.evaluate(()=>document.getElementById('ch-list').innerText.replace(/\n/g,' | ')));
await B.fill('#ch-in','Yes! Invite me');await B.press('#ch-in','Enter');await B.waitForTimeout(1500);
console.log('A chat:',await A.evaluate(()=>document.getElementById('ch-list').innerText.replace(/\n/g,' | ')));
await B.screenshot({path:path.join(__dirname,'ch1.png')});
await B.evaluate(s=>document.querySelector(s).click(),'#ch-x');await B.waitForTimeout(500);
console.log('B badge after read:',await B.textContent('#btn-friends'));
// a stranger cannot write into their chat
console.log('stranger:',await db('write','uidC',[{op:'set',path:'chats/uidA_uidB/msgs/x',v:{from:'uidC',text:'hi',t:1}}]).then(()=>'ALLOWED',e=>'denied'));
console.log('spoof:',await db('write','uidA',[{op:'set',path:'chats/uidA_uidB/msgs/y',v:{from:'uidB',text:'hi',t:1}}]).then(()=>'ALLOWED',e=>'denied'));
// Serbian
await B.evaluate(()=>{localStorage.setItem('portalPals.lang','sr');});
await b.close();})();
