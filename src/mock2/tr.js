const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();
await ctx.route(/fonts\.g|gstatic/,r=>r.abort());
await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('https://pp.test/');await pg.waitForTimeout(800);
// make a save with fossils + lvWon
await pg.evaluate(()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.fossils={ammonite:1,fern:1};o.island.ach=Object.assign(o.island.ach||{},{t_first:1,t_half:1,c_first:1});o.island.st={th_fossils:12,th_digs:200,gp_kills:5};o.island.lvWon={cannon:2};delete o.island.thReset;localStorage.setItem(k,JSON.stringify(o));});
await pg.reload();await pg.waitForTimeout(1000);
console.log(await pg.evaluate(()=>{const o=JSON.parse(localStorage.getItem(window.PP_SAVE_KEY)).island;return {f:o.fossils,ach:o.ach,st:o.st,lv:o.lvWon,r:o.thReset};}));
// set fossil again & reload: must persist now
await pg.evaluate(()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.fossils={ammonite:1};localStorage.setItem(k,JSON.stringify(o));});
await pg.reload();await pg.waitForTimeout(800);
console.log(await pg.evaluate(()=>JSON.parse(localStorage.getItem(window.PP_SAVE_KEY)).island.fossils));
await b.close();})();
