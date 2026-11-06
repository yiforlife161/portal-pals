// Sky Cannon co-op: host + guests, each with their own cannon; aim bots shoot; compare the sky, waves, kills and rewards
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
const N=+(process.argv[2]||2), LV=+(process.argv[3]||1), SIZES=[[1000,680],[412,860],[800,600],[1300,800]];
async function player(b,uid,name,i){
  const ctx=await b.newContext({viewport:{width:SIZES[i][0],height:SIZES[i][1]}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;I.lvWon=Object.assign({},I.lvWon,{cannon:3});I.ach=I.ach||{};['c_first','c_hard','c_sharp','c_tight','c_100','c_500','c_tough'].forEach(k=>I.ach[k]=1);I.items.push({id:'cn1',type:'cannon',x:150,y:40,flip:false,sc:1,s:0});});await pg.waitForTimeout(500);
  return pg;
}
const names=['Ana','Boris','Cara','Dino'];
const bot=()=>{ if(window.__bot)return; window.__bot=setInterval(()=>{const c=window.__cn;if(!c.open)return;let best=null,bd=1e9;c.ships.forEach(s=>{if(s.out||s.x<0||s.x>c.W)return;const d=Math.abs(s.x-c.W/2)+s.y*0.3;if(d<bd){bd=d;best=s;}});if(best){c.aim.x=best.x+best.vx*0.3;c.aim.y=best.y;c.hold=true;}else c.hold=false;},90); };
(async()=>{
const b=await chromium.launch();
const P=[];for(let i=0;i<N;i++)P.push(await player(b,'uid'+'ABCD'[i],names[i],i));
const A=P[0];
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
for(let i=1;i<N;i++){ const c=await codeOf(P[i]); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await P[i].waitForTimeout(900);await P[i].click('[data-fr-acc]');await P[i].waitForTimeout(1200);await A.evaluate(()=>document.getElementById('btn-friends').click());await P[i].evaluate(()=>document.getElementById('btn-friends').click()); }
const g0=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.gold)));
const w0=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.cannonWins||0)));
await A.evaluate(()=>window.__cnOpen());await A.waitForTimeout(500);
await A.click('#cn-panel [data-action=coop-list]');await A.waitForTimeout(300);
await A.click('#coop-list .coop-fr:nth-child(1) [data-lv="'+LV+'"]');await A.waitForTimeout(1200);
console.log('B pop:',await P[1].evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
for(let i=2;i<N;i++){ await A.click('#pt-more');await A.waitForTimeout(200);await A.click('[data-pt-inv]');await A.waitForTimeout(1000); }
for(let i=1;i<N;i++){ await P[i].click('#pv-acc');await P[i].waitForTimeout(1500); }
await A.waitForTimeout(3000);
const st=pg=>pg.evaluate(()=>{const c=window.__cn;return {ph:c.phase,wave:c.wave,dn:c.downed,need:c.need,es:c.escaped,sp:c.spare,ships:c.ships.length,ids:c.ships.map(s=>s.id).sort((a,b)=>a-b).join(','),mine:c.myDown||0,mates:document.querySelectorAll('.cn-mate').length,role:c.coop?c.coop.role:'-'};});
for(const p of P) console.log(JSON.stringify(await st(p)));
await Promise.all(P.map((p,i)=>(i===0&&process.env.HOSTIDLE)?null:p.evaluate(bot)));
let t=0, shot=false;
for(;t<(+process.env.SECS||150);t+=5){
  await A.waitForTimeout(5000);
  if(process.env.STOP && t+5>=+process.env.STOP) await Promise.all(P.map(p=>p.evaluate(()=>{clearInterval(window.__bot);window.__cn.hold=false;})));
  const s=await Promise.all(P.map(st));
  console.log(t+5,s.map(x=>x.role+' '+x.ph+' w'+x.wave+' '+x.dn+'/'+x.need+' esc'+x.es+'/'+x.sp+' ships'+x.ships+' mine'+x.mine).join(' | '));
  if(!shot && s[0].ships>=3){ shot=true; for(let i=0;i<N;i++) await P[i].screenshot({path:path.join(__dirname,'cn'+i+'.png')}); console.log('same ship ids host/guest:',s.map(x=>x.ids).every(v=>v===s[0].ids)); }
  if(s.every(x=>x.ph==='victory'||x.ph==='lost')) break;
}
await A.waitForTimeout(2000);
const g1=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.gold)));
const w1=await Promise.all(P.map(p=>p.evaluate(()=>window.__st.island.cannonWins||0)));
console.log('survival best',(await Promise.all(P.map(p=>p.evaluate(()=>JSON.stringify((window.__st.island.surv||{}).cannon||0))))).join(' '));
console.log('gold gained',g1.map((g,i)=>g-g0[i]).join(' '),'| wins gained',w1.map((w,i)=>w-w0[i]).join(' '));
for(const p of P) console.log('panel:',await p.evaluate(()=>{const pn=document.getElementById('cn-panel');return pn.hidden?'(none)':pn.querySelector('h2').innerText+' | '+pn.querySelector('.cn-stats').innerText.replace(/\n/g,' ');}),'| coop',await p.evaluate(()=>!!window.__cn.coop));
await A.waitForTimeout(5000);
console.log('links closed:',(await Promise.all(P.map(p=>p.evaluate(()=>!window.__cn.coop)))).join(' '));
console.log('RATE',JSON.stringify(rt.rate()));await b.close();})();
