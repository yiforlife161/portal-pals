// Pal Towers co-op: host + guests, each with 4 pals and their own energy; bots place towers; compare foes, towers, end and gold
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
const N=+(process.argv[2]||2), LV=+(process.argv[3]||1), SIZES=[[1100,700],[412,860],[800,600],[1300,800]];
const ELS=[['fire','water','earth','tech'],['magic','air','undead','life'],['fire','air','tech','water'],['earth','magic','life','undead']];
async function player(b,uid,name,i){
  const ctx=await b.newContext({viewport:{width:SIZES[i][0],height:SIZES[i][1]}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log(name,'CON',m.text().slice(0,200));});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate((els)=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island,st=window.__st;I.tut=99;I.lvWon=Object.assign({},I.lvWon,{td:3});
    I.ach=I.ach||{};['t_first','t_hard','t_clean','t_mix','t_build','t_boss','t_kill'].forEach(k=>I.ach[k]=1);I.items.push({id:'td1',type:'tdfort',x:150,y:40,flip:false,sc:1,s:0});
    const base=st.chars[0];const keep=base.id;els.forEach((e,i)=>st.chars.push(Object.assign({},base,{id:'q'+i,name:e+'y',element:e,level:6+i*3,body:'',img:''})));I.tdPick=['q0','q1','q2','q3'];},ELS[i]);
  await pg.waitForTimeout(500);
  return pg;
}
const names=['Ana','Boris','Cara','Dino'];
const bot=()=>{ if(window.__bot)return; window.__bot=setInterval(()=>{const K=window.__kd,td=K.td;if(!td.open||td.phase==='end')return;const me=td.coop?td.coop.slot:0,en=td.E[me]||0,L=td.P[me]||[];
  if(td.phase==='build'&&en<55&&(!td.coop||td.coop.role==='host'))K.tdAsk('g',0);
  if(en<75)return; const free=td.slots.map((s,i)=>i).filter(i=>!td.T[i]); if(!free.length)return; const i=free[Math.floor(Math.random()*free.length)]; K.tdAsk('p',i,Math.floor(Math.random()*L.length)); },700); };
(async()=>{
const b=await chromium.launch();
const P=[];for(let i=0;i<N;i++)P.push(await player(b,'uid'+'ABCD'[i],names[i],i));
const A=P[0];
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
for(let i=1;i<N;i++){ const c=await codeOf(P[i]); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await P[i].waitForTimeout(900);await P[i].click('[data-fr-acc]');await P[i].waitForTimeout(1200);await A.evaluate(()=>document.getElementById('btn-friends').click());await P[i].evaluate(()=>document.getElementById('btn-friends').click()); }
const g0=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.gold)));
const w0=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.tdWins||0)));
await A.evaluate(()=>window.__kd.tdOpen());await A.waitForTimeout(500);
await A.click('#td-panel [data-action=coop-list]');await A.waitForTimeout(300);
await A.click('#coop-list .coop-fr:nth-child(1) [data-lv="'+LV+'"]');await A.waitForTimeout(1200);
console.log('B pop:',await P[1].evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
for(let i=2;i<N;i++){ await A.click('#pt-more');await A.waitForTimeout(200);await A.click('[data-pt-inv]');await A.waitForTimeout(1000); }
for(let i=1;i<N;i++){ await P[i].click('#pv-acc');await P[i].waitForTimeout(1500); }
await A.waitForTimeout(4000);
const st=pg=>pg.evaluate(()=>{const td=window.__kd.td;return {role:td.coop?td.coop.role:'-',ph:td.phase,wave:td.wave,li:td.lives,foes:td.foes.length,ids:td.foes.map(f=>f.id).join(','),T:td.T.filter(Boolean).length,E:JSON.stringify(td.E),P:Object.keys(td.P).length,kills:td.kills,my:td.myKills,gold:td.gold};});
for(const p of P) console.log(JSON.stringify(await st(p)));
await Promise.all(P.map(p=>p.evaluate(bot)));
let shot=false;
for(let t=0;t<(+process.env.SECS||420);t+=6){
  await A.waitForTimeout(6000);
  const s=await Promise.all(P.map(st));
  console.log(t+6,s.map(x=>x.role+' '+x.ph+' w'+x.wave+' li'+x.li+' foes'+x.foes+' T'+x.T+' E'+x.E+' k'+x.kills+'/'+x.my).join(' | '));
  if(!shot && s[0].foes>=6 && s[0].T>=6){ shot=true; for(let i=0;i<N;i++) await P[i].screenshot({path:'/tmp/tdco'+i+'.png'}); }
  if(s.every(x=>x.ph==='end')) break;
}
await A.waitForTimeout(2000);
const g1=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.gold)));
const w1=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.tdWins||0)));
console.log('gold gained',g1.map((g,i)=>g-g0[i]).join(' '),'| wins gained',w1.map((w,i)=>w-w0[i]).join(' '));
for(const p of P) console.log('panel:',await p.evaluate(()=>{const pn=document.getElementById('td-panel');return pn.hidden?'(none)':pn.innerText.slice(0,120).replace(/\n/g,' ');}));
await A.waitForTimeout(5000);
console.log('links closed:',(await Promise.all(P.map(p=>p.evaluate(()=>!window.__kd.td.coop)))).join(' '));
console.log('RATE',JSON.stringify(rt.rate()));await b.close();process.exit(0);})();
