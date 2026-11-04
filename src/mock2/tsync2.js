const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'newx.html'),'utf8');
async function dev(b,name,skew){const ctx=await b.newContext();
if(skew)await ctx.addInitScript((sk)=>{const D=Date.now;Date.now=()=>D()+sk;},skew);
await ctx.route(/fonts\.g/,r=>r.abort());
await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
await ctx.addInitScript(()=>{localStorage.setItem('mock.want',JSON.stringify({uid:'uidA',displayName:'Ana'}));});
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log(name,'ERR',e.message));
await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);await pg.click('#pp-signin');await pg.waitForTimeout(5000);return pg;}
const pm=pg=>pg.evaluate(()=>Math.round((window.__st.island.playMs||0)/3600000*10)/10);
const cloudH=()=>Math.round(JSON.parse(db.DB['saves/uidA/parts/p0'].d).island.playMs/3600000*10)/10;
(async()=>{const b=await chromium.launch();
const PC=await dev(b,'PC',600000);      // the PC tab opens first and stays open
await PC.evaluate(()=>{window.__st.island.playMs=5*3600000;});
const PH=await dev(b,'PHONE');
await PH.waitForTimeout(1000);
// the phone plays to 9 hours and saves to the cloud
await PH.evaluate(()=>{const k=window.PP_SAVE_KEY,o=JSON.parse(localStorage.getItem(k));o.island.playMs=9*3600000;o.island.gold=777;o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));window.dispatchEvent(new Event('pp-saved'));});
await PH.evaluate(()=>{document.querySelector('[data-action=menu-play]')&&document.querySelector('[data-action=menu-play]').click();});
await PH.waitForTimeout(16000);
console.log('cloud after phone saved:',cloudH(),'h');
// the PC (clock 10 min ahead) had saved 5 h locally; now it is opened again
await PC.evaluate(()=>{window.ppNoSave=true;const k=window.PP_SAVE_KEY,o=JSON.parse(localStorage.getItem(k));o.island.playMs=5*3600000;o.island.gold=5;o.t=Date.now()-60000;localStorage.setItem(k,JSON.stringify(o));});
await PC.reload();await PC.waitForTimeout(9000);
console.log('cloud after PC reopened:',cloudH(),'h');
console.log('PC now shows:',await pm(PC),'h, gold',await PC.evaluate(()=>window.__st.island.gold));
await b.close();})();
