// Skill challenges, solo: every game with a bot. Prints points per minute, waves cleared, xp, and screenshots.
// node mock2/tsg.js [outdir] [game,game] [secs]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8'), bot=fs.readFileSync(path.join(__dirname,'chefbot.js'),'utf8');
const out=process.argv[2]||'/tmp/sg'; fs.mkdirSync(out,{recursive:true});
const lvs=(process.argv[3]||'1,2,3').split(',').map(Number);
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
const P=await player(b,'u1','Ana',process.env.PHONE?{width:390,height:780}:undefined);
const el=process.env.EL||'fire';const BODY=process.env.BODY||'';
for(const lv of lvs){
  await P.evaluate(([el,process_body])=>{const I=window.__st.island;I.lvWon=I.lvWon||{};I.lvWon.chef=3;const h=window.__st.chars.find(c=>c.id===I.heroId)||window.__st.chars[0];h.element=el;h.body=process_body;h.level=30;},[el,BODY]);
  const g0=await P.evaluate(()=>[window.__st.island.gold,window.__winCount('chef')]);
  await P.evaluate(()=>window.__sgOpen('chef'));
  await P.waitForTimeout(400);
  await P.screenshot({path:out+'/chef_intro.png'});
  await P.evaluate(lv=>window.__sgBegin(lv),lv);
  await P.evaluate(()=>window.__chefBot());
  if(process.env.THR){const cdp=await P.context().newCDPSession(P);await cdp.send('Emulation.setCPUThrottlingRate',{rate:+process.env.THR});await P.waitForTimeout(3000);const f=await P.evaluate(()=>new Promise(r=>{let n=0,t0=performance.now();function k(){n++;if(performance.now()-t0<5000)requestAnimationFrame(k);else r(n/5);}requestAnimationFrame(k);}));console.log('fps at',process.env.THR+'x slower CPU:',f);
    if(process.env.PROF){await cdp.send('Profiler.enable');await cdp.send('Profiler.start');await P.waitForTimeout(5000);const {profile}=await cdp.send('Profiler.stop');const self={};const byId={};profile.nodes.forEach(n=>byId[n.id]=n);const dt={};(profile.samples||[]).forEach((id,i)=>{const n=byId[id];const k=n.callFrame.functionName||'(anon)';const u=n.callFrame.url.split('/').pop().slice(0,12);dt[k+' '+u+':'+n.callFrame.lineNumber]=(dt[k+' '+u+':'+n.callFrame.lineNumber]||0)+(profile.timeDeltas[i]||0);});const tot=Object.values(dt).reduce((a,b)=>a+b,0);Object.entries(dt).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([k,v])=>console.log((v/tot*100).toFixed(1)+'%',k));}}
  const t0=Date.now(); let shot=0;
  while(Date.now()-t0<secs*1000){
    await P.waitForTimeout(1000);
    const st=await P.evaluate(()=>({ph:window.__sg.phase,w:window.__sg.w,sc:window.__sg.sc,need:window.__sg.need,tl:Math.round(window.__sg.tl),last:window.__chefBotLast,cr:window.__sg.hero.cr,msg:window.__chefBotMsg,err:window.__chefBotErr,pk:window.__chefBotPick,ords:window.__sg.E.filter(e=>e.k==='ord').map(o=>o.s+':'+Math.round(o.a)).join(' ')}));
    if(process.env.V) console.log(JSON.stringify(st));
    if(!shot&&Date.now()-t0>(+process.env.SHOT||20000)){shot=1;await P.screenshot({path:out+'/chef'+lv+'_play.png'});}
    if(st.ph==='end')break;
  }
  const r=await P.evaluate(()=>{const s=window.__sg;return {ph:s.phase,w:s.w,sc:s.sc,need:s.need,done:s.done,rs:s.rs,g:s.lastG,x:s.lastX,t:Math.round(s.t),hp:Math.round(s.hero.hp/s.hero.maxhp*100),panel:(document.querySelector('#sg-panel h2')||{}).textContent}});
  const g1=await P.evaluate(()=>[window.__st.island.gold,window.__winCount('chef')]);
  console.log('lv',lv,JSON.stringify(r),'gold',g1[0]-g0[0],'wins',g1[1]);
  await P.screenshot({path:out+'/chef'+lv+'_end.png'});
  await P.evaluate(()=>{clearInterval(window.__chefBotT);window.__sgClose();});
  await P.waitForTimeout(300);
}
await b.close();process.exit(0);})();
