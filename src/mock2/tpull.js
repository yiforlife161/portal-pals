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
await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);await pg.click('#pp-signin');await pg.waitForTimeout(4500);
// another device uploads a newer world with 999 gold
const meta=db.DB['saves/uidA'], raw=db.DB['saves/uidA/parts/p0'].d, o=JSON.parse(raw); o.island.gold=999; o.t=Date.now()+5000;
const nraw=JSON.stringify(o); db.DB['saves/uidA/parts/p0']={d:nraw}; db.DB['saves/uidA']=Object.assign({},meta,{t:o.t,size:nraw.length});
await pg.reload();await pg.waitForTimeout(6000);
console.log('after pull: state gold',await pg.evaluate(()=>window.__st.island.gold),'stored',await pg.evaluate(()=>JSON.parse(localStorage.getItem(window.PP_SAVE_KEY)).island.gold));
await pg.reload();await pg.waitForTimeout(4000);
console.log('after another reload:',await pg.evaluate(()=>window.__st.island.gold), 'cloud gold', JSON.parse(db.DB['saves/uidA/parts/p0'].d).island.gold);
await b.close();})();
