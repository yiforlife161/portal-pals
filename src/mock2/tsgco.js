// Skill challenge co-op: Ana hosts, friends join from the challenge menu; everyone runs the bot.
// node mock2/tsgco.js <game> [players=2] [secs=60]   LOWLV=1: the last friend has the skill at 40 (can't be invited / can't join)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8'), bot=fs.readFileSync(path.join(__dirname,'sgbot.js'),'utf8');
const G=process.argv[2]||'mine', N=+(process.argv[3]||2), SECS=+(process.argv[4]||60);
const EL={mine:'earth',fish:'water',forest:'life',potion:'magic',cook:'air',smith:'tech',fire:'fire',grave:'undead'};
const SK={mine:'mining',fish:'fishing',forest:'woodcutting',potion:'potionmaking',cook:'cooking',smith:'smithing',fire:'firemaking',grave:'gravedigging'};
const XP={40:37224,50:101333};
async function player(b,uid,name,lv){
  const ctx=await b.newContext({viewport:{width:1000,height:680}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message,(e.stack||'').split('\n')[1]));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(3500);await pg.waitForFunction(()=>window.ppCoop&&window.ppCoop.ready&&window.ppCoop.ready(),null,{timeout:20000});
  await pg.evaluate(([g,el,xp])=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;const A=window.__AREAS[g];const s=window.__skillOf(A.skill);s.xp=xp;s.lv=window.ppGame.skillLevel(xp);const h=window.__st.chars.find(c=>c.id===I.heroId)||window.__st.chars[0];h.element=el;h.body='';h.level=30;window.ppCoop.lbPush();},[G,EL[G],XP[lv]]);
  await pg.addScriptTag({content:bot});
  return pg;
}
const names=['Ana','Boris','Cara','Dino'];
(async()=>{
const b=await chromium.launch();
const P=[];for(let i=0;i<N;i++)P.push(await player(b,'uid'+'ABCD'[i],names[i],process.env.LOWLV&&i===N-1?40:50));
const A=P[0];
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
for(let i=1;i<N;i++){ const c=await codeOf(P[i]); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await P[i].waitForTimeout(900);await P[i].click('[data-fr-acc]');await P[i].waitForTimeout(1200);await A.evaluate(()=>document.getElementById('btn-friends').click());await P[i].evaluate(()=>document.getElementById('btn-friends').click()); }
await Promise.all(P.map(p=>p.evaluate(()=>window.ppCoop.lbPush())));await A.waitForTimeout(1500);
const xp0=await Promise.all(P.map(p=>p.evaluate(k=>window.__skillOf(k).xp,SK[G])));
await A.evaluate(g=>window.__sgOpen(g),G);await A.waitForTimeout(400);
await A.click('[data-action=coop-list]');await A.waitForTimeout(300);
console.log('invite list:',await A.evaluate(()=>document.querySelector('#coop-list').innerText.replace(/\n/g,' | ')));
await A.click('#coop-list .coop-fr:nth-child(1) [data-lv="1"]');await A.waitForTimeout(1200);
console.log('B pop:',await P[1].evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
for(let i=2;i<N;i++){ await A.click('#pt-more');await A.waitForTimeout(200);const n=await A.$$('[data-pt-inv]');if(!n.length){console.log('no more to invite');break;}await n[0].click();await A.waitForTimeout(1000); }
if(process.env.LOWLV){ // force an invite to the low-level friend straight through the cloud (an old friend list), then they try to accept
  const low=P[N-1]; await A.evaluate(uid=>window.ppCoop.invite(uid,1,'%G%'.replace('%G%',window.__sg.area),'sg'),'uid'+'ABCD'[N-1]); await A.waitForTimeout(1200);
  console.log('low-level friend popup:',await low.evaluate(()=>(document.querySelector('.pv-pop')||{}).innerText||'none'));
}
for(let i=1;i<N;i++){ const has=await P[i].$('#pv-acc'); if(has){ await P[i].click('#pv-acc'); await P[i].waitForTimeout(1500); console.log(names[i],'after accept:',await P[i].evaluate(()=>window.__sg.open+' '+((document.querySelector('.pv-pop')||{}).innerText||'').replace(/\n/g,' | ').slice(0,120))); } }
if(process.env.LOWLV){ const pts=await A.$('#pt-go'); if(pts){ await A.click('#pt-go'); } }
await A.waitForTimeout(4000);
const st=pg=>pg.evaluate(()=>{const s=window.__sg,C=s.coop;if(!s.hero)return {open:s.open,ph:s.phase};return {ph:s.phase,role:C&&C.role,slot:C&&C.slot,w:s.w,sc:s.sc+'/'+s.need,tl:Math.round(s.tl),me:[Math.round(s.hero.x),Math.round(s.hero.y)],mates:s.P.filter(p=>p.mate).map(p=>p.name+'@'+Math.round(p.x)),E:s.E.length,H:s.H.length,pts:s.runPts,hp:Math.round(s.hero.hp/s.hero.maxhp*100)+(s.hero.ko>0?'KO':''),cr:s.hero.cr,mul:s.mul};});
for(const p of P) console.log(JSON.stringify(await st(p)));
await Promise.all(P.map(p=>p.evaluate(()=>window.__sgBot())));
let shot=0;
for(let t=0;t<SECS;t+=10){ await A.waitForTimeout(10000); const s=await Promise.all(P.map(st)); console.log(t+10,s.map(x=>x.ph+' w'+x.w+' '+x.sc+' t'+x.tl+' pts'+x.pts+' hp'+x.hp+' cr'+x.cr+' E'+x.E).join(' | ')); if(!shot){shot=1;await A.screenshot({path:'/tmp/sg/co_'+G+'_A.png'});await P[1].screenshot({path:'/tmp/sg/co_'+G+'_B.png'});} if(s.every(x=>x.ph==='end')) break; }
if(process.env.CLAIM){ await A.evaluate(()=>window.__sgClose()); await A.waitForTimeout(11000); }
for(const p of P) await p.evaluate(()=>{ if (window.__sg.open && window.__sg.phase!=='end') window.__sgClose(); });
await A.waitForTimeout(2500);
const xp1=await Promise.all(P.map(p=>p.evaluate(k=>window.__skillOf(k).xp,SK[G])));
console.log('xp gained',xp1.map((x,i)=>x-xp0[i]).join(' '));
console.log('links closed:',(await Promise.all(P.map(p=>p.evaluate(()=>!window.__sg.coop)))).join(' '));
console.log('RATE',JSON.stringify(rt.rate()));await b.close();process.exit(0);})();
