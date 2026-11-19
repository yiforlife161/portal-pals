// Boss Gallery check: every boss fights for a while (hero can't die, takes small hits so it passes the 2/3 and 1/3 marks),
// screenshots mid-fight, then is finished off. Prints errors, attacks seen, pay, and the save afterwards.
// usage: node mock2/trbgal.js [outdir] [bosses comma list] [lv]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
const OUT=process.argv[2]||'/tmp/rb', LIST=(process.argv[3]||'earth,fire,water,life,tech,air,magic,undead').split(','), LV=+(process.argv[4]||3);
fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1100,height:700}});
await ctx.route(/fonts\.g/,r=>r.abort());await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
await ctx.addInitScript(()=>{localStorage.setItem('mock.want',JSON.stringify({uid:'urb',displayName:'Ana'}));});
const P=await ctx.newPage();const errs=[];P.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.message);});
await P.goto('https://pp.test/');await P.waitForTimeout(1200);await P.click('#pp-signin');await P.waitForTimeout(3500);
await P.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;I.rbw={earth:3,fire:3,water:3,life:3,tech:3,air:3,magic:3,undead:3};});
await P.evaluate(()=>window.__dfOpen('raid'));await P.waitForTimeout(600);
await P.screenshot({path:OUT+'/picker.png'});
for(const k of LIST){
  await P.evaluate(k=>{window.__st.island.raidBoss=k;},k);
  if(!await P.evaluate(()=>!!document.querySelector('[data-action=df-start][data-lv]'))){ await P.evaluate(()=>{window.__df.phase='end';}); }
  await P.evaluate(()=>{const t=document.querySelector('[data-action=rb-pick]');t&&t.click();});
  await P.evaluate(k=>{const t=document.querySelector('[data-action=rb-pick][data-k='+k+']');t&&t.click();},k);await P.waitForTimeout(200);
  const g0=await P.evaluate(()=>window.__st.island.gold);
  await P.click('[data-action=df-start][data-lv="'+LV+'"]');
  await P.evaluate(()=>{window.__seen={};window.__k=setInterval(()=>{const df=window.__df;if(df.hero){df.hero.hp=Math.max(df.hero.hp,df.hero.maxhp*0.6||50); if(Math.random()<0.07){df.hero.x=250+Math.random()*500;df.hero.y=230+Math.random()*230;df.hero.mv=null;}}
    (df.foes||[]).forEach(f=>{if(f.dead)return;if(f.k==='boss'){if(f.atkType)window.__seen[f.atkType+(f.rain?':'+f.rain:'')]=1; if(f.hp>f.max*0.2) window.__dfHurt(f,f.max*0.012,df.hero,false);} else if(Math.random()<0.05) window.__dfHurt(f,1e6,df.hero,false);});},150);});
  await P.waitForTimeout(9000);
  await P.screenshot({path:OUT+'/fight_'+k+'.png'});
  await P.waitForTimeout(9000);
  await P.screenshot({path:OUT+'/fight2_'+k+'.png'});
  await P.evaluate(()=>{clearInterval(window.__k);window.__k=setInterval(()=>{const df=window.__df;if(df.hero)df.hero.hp=df.hero.maxhp||100;(df.foes||[]).forEach(f=>{if(!f.dead)window.__dfHurt(f,1e6,df.hero,false);});},150);});
  for(let i=0;i<40;i++){await P.waitForTimeout(500);if(await P.evaluate(()=>window.__df.phase==='end'))break;}
  await P.evaluate(()=>clearInterval(window.__k));
  const r=await P.evaluate(()=>({h:(document.querySelector('#df-panel h2')||{}).innerText, seen:Object.keys(window.__seen).sort().join(' '), gold:window.__st.island.gold, rbw:JSON.stringify(window.__st.island.rbw)}));
  console.log(k,'| seen:',r.seen,'|',r.h,'| gold +'+(r.gold-g0));
  await P.screenshot({path:OUT+'/end_'+k+'.png'});
}
console.log('ach',JSON.stringify(Object.keys(await P.evaluate(()=>window.__st.island.ach||{})).filter(x=>/^r_/.test(x))));
console.log('errors',errs.length);
await b.close();process.exit(0);})();
