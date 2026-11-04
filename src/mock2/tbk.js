const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1000,height:760}});
await ctx.route(/fonts\.g|gstatic/,r=>r.abort());
await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('https://pp.test/');await pg.waitForTimeout(800);
await pg.evaluate(()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.gold=77777;localStorage.setItem(k,JSON.stringify(o));localStorage.removeItem(k+'.bk');window.ppNoSave=true;});
await pg.reload();await pg.waitForTimeout(800);
// now "lose" the world
await pg.evaluate(()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.gold=5;localStorage.setItem(k,JSON.stringify(o));window.ppNoSave=true;});
await pg.reload();await pg.waitForTimeout(800);
await pg.click('[data-action=menu-settings]');await pg.click('[data-action=menu-bk]');await pg.waitForTimeout(200);
console.log(await pg.evaluate(()=>[...document.querySelectorAll('.mm-bkrow')].map(e=>e.innerText.replace(/\n/g,' | '))));
await pg.screenshot({path:path.join(__dirname,'bk1.png')});
await pg.click('.mm-bkrow:last-child [data-action=menu-bk-use]');await pg.click('.mm-bkrow:last-child [data-action=menu-bk-use]');await pg.waitForTimeout(1200);
console.log('gold after restore',await pg.evaluate(()=>JSON.parse(localStorage.getItem(window.PP_SAVE_KEY)).island.gold), await pg.evaluate(()=>document.querySelector('.hud').innerText.replace(/\n/g,' ')));
await b.close();})();
