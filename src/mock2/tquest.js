// Island Quest co-op: Ana hosts, Boris joins; both run the bot. Shared monsters/locks/chests, own rewards, shared finish
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8'), bot=fs.readFileSync(path.join(__dirname,'qbot.js'),'utf8');
const N=+(process.argv[2]||2), LV=+(process.argv[3]||1);
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1000,height:680}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;I.lvWon=Object.assign({},I.lvWon,{quest:3});I.ach=I.ach||{};['q_first','q_hard','q_clean','q_chests','q_gold1','q_gold6','q_goldall','q_sun','q_kills'].forEach(k=>I.ach[k]=1);I.items.push({id:'qg1',type:'questgate',x:150,y:40,flip:false,sc:1,s:0});window.__st.chars[0].level=15;});await pg.waitForTimeout(500);
  await pg.addScriptTag({content:bot});
  return pg;
}
const names=['Ana','Boris','Cara','Dino'];
(async()=>{
const b=await chromium.launch();
const P=[];for(let i=0;i<N;i++)P.push(await player(b,'uid'+'ABCD'[i],names[i]));
const A=P[0];
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
for(let i=1;i<N;i++){ const c=await codeOf(P[i]); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await P[i].waitForTimeout(900);await P[i].click('[data-fr-acc]');await P[i].waitForTimeout(1200);await A.evaluate(()=>document.getElementById('btn-friends').click());await P[i].evaluate(()=>document.getElementById('btn-friends').click()); }
const g0=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.gold)));
await A.evaluate(()=>window.__quOpen());await A.waitForTimeout(400);
await A.click('[data-action=coop-list]');await A.waitForTimeout(250);
await A.click('#coop-list .coop-fr:nth-child(1) [data-lv="'+LV+'"]');await A.waitForTimeout(1200);
console.log('B pop:',await P[1].evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
for(let i=2;i<N;i++){ await A.click('#pt-more');await A.waitForTimeout(200);await A.click('[data-pt-inv]');await A.waitForTimeout(1000); }
for(let i=1;i<N;i++){ await P[i].click('#pv-acc');await P[i].waitForTimeout(1500); }
await A.waitForTimeout(4000);
const st=pg=>pg.evaluate(()=>{const q=window.__qu,C=q.coop;window.__sn=q.surv?q.surv.n:0;if(!q.hero)return {open:q.open,ph:q.phase,coop:!!C,pop:(document.querySelector('.pv-pop')||{}).innerText};return {ph:q.phase,role:C&&C.role,slot:C&&C.slot,lv:q.lv,isl:q.L.N,me:[Math.round(q.hero.x),Math.round(q.hero.y)],mates:q.P.filter(p=>p.mate).map(p=>p.name+'@'+Math.round(p.x)),foes:q.L.foes.length,open:q.L.br.filter(b=>b.lock&&b.st).length+'/'+q.L.br.filter(b=>b.lock).length,ch:q.L.chests.map(c=>c.op).join(''),kills:q.kills,coins:q.coins,sn:q.surv?q.surv.n:0,kos:q.kos,hp:Math.round(q.hero.hp)+'/'+q.hero.maxhp+(q.hero.ko>0?'KO':''),at:window.__quIslAt(q.hero.x,q.hero.y)};});
for(const p of P) console.log(JSON.stringify(await st(p)));
console.log('same level:',new Set(await Promise.all(P.map(p=>p.evaluate(()=>JSON.stringify(window.__qu.L.isl.map(i=>[Math.round(i.x),Math.round(i.y)])))))).size===1);
if(process.env.ALLDOWN){
  await A.evaluate(()=>{const q=window.__qu,b=q.P.find(p=>p.mate);window.__quHurt(b,b.maxhp+5);});await A.waitForTimeout(1500);
  console.log('one down: host',await A.evaluate(()=>window.__qu.phase),'| guest ko',await P[1].evaluate(()=>window.__qu.hero.ko.toFixed(1)));
  await A.waitForTimeout(8500);console.log('after 8 s guest back up:',await P[1].evaluate(()=>!(window.__qu.hero.ko>0)&&window.__qu.hero.hp===window.__qu.hero.maxhp));
  await A.evaluate(()=>{window.__qu.P.forEach(p=>window.__quHurt(p,p.maxhp+5));});await A.waitForTimeout(5000);
  for(const p of P) console.log('all down:',await p.evaluate(()=>{const pn=document.getElementById('qu-panel');return window.__qu.phase+' | '+(pn.hidden?'':pn.querySelector('h2').innerText+' | '+pn.querySelector('p').innerText);}));
  await b.close();return;
}
await Promise.all(P.map(p=>p.evaluate(()=>window.__qbot())));
await P[1].evaluate(()=>{window.__warnSeen=0;window.__fbSeen=0;window.__foodSeen={};setInterval(()=>{const q=window.__qu;if(q.L.foes.some(f=>f.wind>0))window.__warnSeen++;if((q.esh||[]).length)window.__fbSeen++;q.L.items.forEach(i=>{if(i.k==='food')window.__foodSeen[i.fk]=1;});},100);});
for(let t=0;t<(+process.env.SECS||240);t+=10){ await A.waitForTimeout(10000); const s=await Promise.all(P.map(st)); console.log(t+10,s.map(x=>'L'+x.sn+' '+x.ph+' '+x.open+' ch'+x.ch+' k'+x.kills+' foes'+x.foes+' me'+x.me+' ko'+x.kos+' hp'+x.hp+' isl'+x.at).join(' | ')); if(s.every(x=>x.ph==='end')) break; }
await A.screenshot({path:path.join(__dirname,'qco1.png')});await P[1].screenshot({path:path.join(__dirname,'qco2.png')});
if(process.env.CLAIM){ await A.click('#qu-claim'); await A.waitForTimeout(7000); for(const p of P) console.log('after host claims:',await p.evaluate(()=>{const q=window.__qu,pn=document.getElementById('qu-panel');return q.phase+' | '+(pn.hidden?'':pn.querySelector('h2').innerText+' | '+pn.querySelector('p').innerText);})); }
const g1=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.gold)));
console.log('gold gained',g1.map((g,i)=>g-g0[i]).join(' '),'wins',(await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.questWins)))).join(' '),'found',(await Promise.all(P.map(p=>p.evaluate(()=>window.__qu.found.join(','))))).join(' | '));
await A.waitForTimeout(5000);
console.log('guest saw warnings',await P[1].evaluate(()=>window.__warnSeen),'fireballs',await P[1].evaluate(()=>window.__fbSeen),'food',await P[1].evaluate(()=>Object.keys(window.__foodSeen).join(',')));
console.log('links closed:',(await Promise.all(P.map(p=>p.evaluate(()=>!window.__qu.coop)))).join(' '));
await b.close();})();
