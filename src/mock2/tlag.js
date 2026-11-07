// Network smoothness: one pal walks a circle; the other screen records where it draws that pal every frame.
// Prints the delay (how far behind) and the wobble (how uneven the motion is) both ways. Use RT_LAT / RT_JIT to add network delay.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
const MODE=process.argv[2]||'arena';
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1000,height:680}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
  await ctx.addInitScript(([uid,name,nd])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));if(nd)localStorage.setItem('pp.noDirect','1');},[uid,name,process.env.NODIRECT||'']);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;
    ['arena','questgate','cannon','digsite'].forEach((t,i)=>I.items.push({id:'lg'+i,type:t,x:150+i*90,y:40,flip:false,sc:1,s:0}));I.lvWon=Object.assign({},I.lvWon,{quest:3,arena:3,dig:3});});
  await pg.waitForTimeout(500);
  return pg;
}
// what each mode moves and reads: me = my own pal (set), see(slot) = where the other pal is drawn
const HOOKS={
  arena:{ open:"window.__dfOpen('arena')", inv:"[data-action=coop-list]", lvBtn:'[data-action=coop-inv][data-lv="1"]',
    me:"(()=>{const H=window.__df.hero;return H;})()", see:"(slot)=>{const D=window.__df;const m=(D.mates||[]).find(m=>m.slot===slot)||D.team.find(p=>p.mi&&p.mi.slot===slot);return m?[m.x,m.y]:null;}" },
  quest:{ open:"window.__quOpen()", inv:"[data-action=coop-list]", lvBtn:'[data-action=coop-inv][data-lv="1"]',
    me:"window.__qu.hero", see:"(slot)=>{const p=window.__qu.P.find(p=>p.slot===slot);return p?[p.x,p.y]:null;}" }
};
(async()=>{
const b=await chromium.launch({args:['--disable-features=WebRtcHideLocalIpsWithMdns']});
const A=await player(b,'uidA','Ana'), B=await player(b,'uidB','Boris');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const c=await codeOf(B); await codeOf(A); await A.fill('#fr-add',c);await A.click('#fr-send');await B.waitForTimeout(900);await B.click('[data-fr-acc]');await B.waitForTimeout(1200);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
const H=HOOKS[MODE];
await A.evaluate(H.open);await A.waitForTimeout(500);
await A.click(H.inv);await A.waitForTimeout(300);await A.click(H.lvBtn);await A.waitForTimeout(1200);
await B.click('#pv-acc');await B.waitForTimeout(3500);await A.waitForTimeout(2500);
const badge=pg=>pg.evaluate(()=>{const e=document.getElementById('pp-net');return e&&!e.hidden?e.textContent:'(none)';});
console.log('badge A:',await badge(A),'| B:',await badge(B));if(process.env.SHOT)await B.screenshot({path:process.env.SHOT});
// freeze monsters far away so nobody gets hurt, then walk
const prep=MODE==='arena'?"window.__df.foes.forEach(f=>{f.x=-5000;f.y=-5000;});window.__df.spawnT=1e9;":"";
async function run(mover,watcher,slot,label){
  await mover.evaluate(`(()=>{window.__walk=true;const P=${H.me};const cx=P.x,cy=P.y,R=90,T=3200;const t0=performance.now();window.__true=[];
    function f(){if(!window.__walk)return;const P2=${H.me};const a=(performance.now()-t0)/T*6.283;P2.x=cx+Math.cos(a)*R;P2.y=cy+Math.sin(a)*R*0.6;P2.mv=null;if(P2.walkT!==undefined)P2.walkT=0.12;window.__true.push([Date.now(),P2.x,P2.y]);${prep}requestAnimationFrame(f);}requestAnimationFrame(f);})()`);
  await watcher.evaluate(`(()=>{const see=${H.see};window.__seen=[];window.__watch=true;function f(){if(!window.__watch)return;const q=see(${slot});if(q)window.__seen.push([Date.now(),q[0],q[1]]);requestAnimationFrame(f);}requestAnimationFrame(f);})()`);
  await mover.waitForTimeout(7000);
  const tr=await mover.evaluate(()=>{window.__walk=false;return window.__true;});
  await mover.waitForTimeout(1200);
  const se=await watcher.evaluate(()=>{window.__watch=false;return window.__seen;});
  const stopT=tr[tr.length-1][0], fin=tr[tr.length-1];
  const pv=tr[tr.length-4], dl=Math.hypot(fin[1]-pv[1],fin[2]-pv[2])||1, ux=(fin[1]-pv[1])/dl, uy=(fin[2]-pv[2])/dl;
  const over=Math.max(...se.filter(s=>s[0]>stopT).map(s=>(s[1]-fin[1])*ux+(s[2]-fin[2])*uy),0);
  const lastS=se[se.length-1], rest=Math.hypot(lastS[1]-fin[1],lastS[2]-fin[2]);
  const at=(arr,t)=>{let lo=0,hi=arr.length-1;if(t<=arr[0][0])return arr[0];if(t>=arr[hi][0])return arr[hi];while(hi-lo>1){const m=(lo+hi)>>1;if(arr[m][0]<=t)lo=m;else hi=m;}const a=arr[lo],c=arr[hi],k=(t-a[0])/Math.max(1,c[0]-a[0]);return [t,a[1]+(c[1]-a[1])*k,a[2]+(c[2]-a[2])*k];};
  const S=se.filter(s=>s[0]>tr[0][0]+1500&&s[0]<tr[tr.length-1][0]);
  let best=null;for(let L=0;L<=600;L+=5){let e=0;S.forEach(s=>{const q=at(tr,s[0]-L);e+=Math.hypot(s[1]-q[1],s[2]-q[2]);});e/=S.length;if(!best||e<best.e)best={L,e};}
  // wobble: how uneven the drawn speed is, frame to frame
  const sp=[];for(let i=1;i<S.length;i++){const dt=(S[i][0]-S[i-1][0])/1000;if(dt>0)sp.push(Math.hypot(S[i][1]-S[i-1][1],S[i][2]-S[i-1][2])/dt);}
  const mean=sp.reduce((a,b)=>a+b,0)/sp.length, sd=Math.sqrt(sp.reduce((a,b)=>a+(b-mean)*(b-mean),0)/sp.length);
  const still=sp.filter(v=>v<mean*0.25).length/sp.length;
  const T2=tr.filter(s=>s[0]>tr[0][0]+1500);const sp2=[];for(let i=1;i<T2.length;i++){const dt=(T2[i][0]-T2[i-1][0])/1000;if(dt>0)sp2.push(Math.hypot(T2[i][1]-T2[i-1][1],T2[i][2]-T2[i-1][2])/dt);}
  const m2=sp2.reduce((a,b)=>a+b,0)/sp2.length, sd2=Math.sqrt(sp2.reduce((a,b)=>a+(b-m2)*(b-m2),0)/sp2.length);
  console.log(label.padEnd(18),'(own screen wobble '+(sd2/m2*100).toFixed(0)+'%)','behind '+String(best.L).padStart(3)+' ms','| off-path '+best.e.toFixed(1)+' px','| speed wobble '+(sd/mean*100).toFixed(0)+'%','| stalled frames '+(still*100).toFixed(0)+'%','| frames '+S.length,'| slides past the stop by '+over.toFixed(1)+' px, settles at '+rest.toFixed(1)+' px');
}
await A.evaluate(prep);await B.evaluate(prep);
if(process.env.CUT){ // B's direct link stops sending (half-broken), then fully closes later
  await B.evaluate(()=>{window.__realSend=RTCDataChannel.prototype.send;RTCDataChannel.prototype.send=function(){};});await A.waitForTimeout(2600);
  console.log('after B stops sending: A',await badge(A),JSON.stringify(await A.evaluate(()=>window.ppCoop.net())), '| B',await badge(B),JSON.stringify(await B.evaluate(()=>window.ppCoop.net())));
}
const s0=rt.stats(),t0=Date.now();
await run(B,A,1,MODE+' host sees');
await run(A,B,0,MODE+' guest sees');
const s1=rt.stats();console.log('database traffic during the test:',((s1.bytes-s0.bytes)/((Date.now()-t0)/1000)/1024).toFixed(1),'KB/s,',s1.writes-s0.writes,'writes');
await b.close();})();
