const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
await pg.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));await pg.route(/gstatic|fonts/,r=>r.abort());
pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('https://pp.test/');await pg.waitForTimeout(1500);
const r=await pg.evaluate(()=>{const out={};for(const n of [2,3,4]){const T=window.__th;T.coop={mates:new Array(n-1).fill({})};let min=999,land={};for(let s=1;s<300;s++){window.__thGen(s*7919);min=Math.min(min,T.spots.length);land[T.land.name]=Math.min(land[T.land.name]||999,T.spots.length);}out[n]={min,land};}window.__th.coop=null;return out;});
console.log(JSON.stringify(r));await b.close();})();
