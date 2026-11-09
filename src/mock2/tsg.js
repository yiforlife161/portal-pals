// Skill challenges, solo: every game with a bot. Prints points per minute, waves cleared, xp, and screenshots.
// node mock2/tsg.js [outdir] [game,game] [secs]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8'), bot=fs.readFileSync(path.join(__dirname,'sgbot.js'),'utf8');
const out=process.argv[2]||'/tmp/sg'; fs.mkdirSync(out,{recursive:true});
const games=(process.argv[3]||'mine,fish,forest,potion,cook,smith,fire,grave').split(',');
const secs=+(process.argv[4]||60);
const EL={mine:'earth',fish:'water',forest:'life',potion:'magic',cook:'air',smith:'tech',fire:'fire',grave:'undead'};
async function player(b,uid,name,vp){
  const ctx=await b.newContext({viewport:vp||{width:1000,height:680}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message,e.stack&&e.stack.split('\n')[1]));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(3500);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;});
  await pg.addScriptTag({content:bot});
  return pg;
}
(async()=>{const b=await chromium.launch();
const P=await player(b,'u1','Ana');
for(const g of games){
  await P.evaluate(([g,el])=>{const I=window.__st.island,A=window.__AREAS[g];const s=window.__skillOf(A.skill);s.xp=101333;s.lv=50;const h=window.__st.chars.find(c=>c.id===I.heroId)||window.__st.chars[0];h.element=el;h.body='';h.level=30;},[g,EL[g]]);
  const ok=await P.evaluate(g=>window.__sgOpen(g),g);
  await P.waitForTimeout(300);
  await P.screenshot({path:out+'/'+g+'_intro.png'});
  await P.click('[data-action=sg-start]');
  await P.evaluate(()=>window.__sgBot());
  const t0=Date.now(); let snapAt=12000, shot=0;
  let wavesSeen=0;
  while(Date.now()-t0<secs*1000){
    await P.waitForTimeout(1000);
    const st=await P.evaluate(()=>({ph:window.__sg.phase,w:window.__sg.w,sc:window.__sg.sc,need:window.__sg.need,hp:Math.round(window.__sg.hero.hp/window.__sg.hero.maxhp*100),pts:window.__sg.runPts,done:window.__sg.done,tl:Math.round(window.__sg.tl)}));
    if(!shot&&Date.now()-t0>snapAt){shot=1;await P.screenshot({path:out+'/'+g+'_play.png'});}
    if(st.ph==='end')break;
  }
  const r=await P.evaluate(()=>{const s=window.__sg;return {ph:s.phase,w:s.w,sc:s.sc,need:s.need,done:s.done,pts:s.runPts,xp:s.lastXp,t:Math.round(s.t),hp:Math.round(s.hero.hp/s.hero.maxhp*100),panel:(document.querySelector('#sg-panel h2')||{}).textContent||''};});
  const el=(Date.now()-t0)/1000;
  // points per minute: from the runPts (if the run is still going) plus the paid xp
  const ptsTotal=r.ph==='end'? Math.round(r.xp/58) : r.pts;
  console.log(g.padEnd(7),'phase',r.ph,'wave',r.w,'done',r.done,'score',r.sc+'/'+r.need,'pts',ptsTotal,'per min',Math.round(ptsTotal/el*60),'xp',r.xp,'hp%',r.hp,'|',r.panel);
  if(!shot) await P.screenshot({path:out+'/'+g+'_play.png'});
  await P.evaluate(()=>{clearInterval(window.__sgBotT);window.__sgClose();});
  await P.waitForTimeout(300);
}
await b.close();process.exit(0);})();
