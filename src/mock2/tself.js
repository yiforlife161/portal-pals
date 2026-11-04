const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'newx.html'),'utf8');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();
await ctx.route(/fonts\.g/,r=>r.abort());
await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
await ctx.addInitScript(()=>{localStorage.setItem('mock.want',JSON.stringify({uid:'uidA',displayName:'Ana'}));});
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);await pg.click('#pp-signin');await pg.waitForTimeout(9000);
let loads=0;pg.on('load',()=>loads++);
// 1) this device's own save looks "newer" than what it remembers (a lost confirmation)
const m=db.DB['saves/uidA'];console.log('meta dev tag:',!!m.dev);db.DB['saves/uidA']=Object.assign({},m,{t:m.t+60000});
await pg.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await pg.waitForTimeout(3000);
console.log('reloads after seeing its own save:',loads);
// 2) the game opened a second time in the same browser
const pg2=await ctx.newPage();await pg2.goto('https://pp.test/');await pg2.waitForTimeout(4000);
console.log('first tab paused:',await pg.evaluate(()=>!![...document.querySelectorAll('.fview')].find(e=>/Paused/.test(e.innerText))),'| second tab paused:',await pg2.evaluate(()=>!![...document.querySelectorAll('.fview')].find(e=>/Paused/.test(e.innerText))));
await b.close();})();
