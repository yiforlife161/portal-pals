// Pal Towers solo: a bot builds towers and plays levels fast (tdUpdate called directly). node mock2/ttd.js <lv> [phone]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
const LV=+(process.argv[2]||1), PHONE=process.argv[3]==='phone', ELS=(process.env.ELS||'fire,water,earth,tech').split(','), PLV=+(process.env.PLV||8);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:PHONE?{width:390,height:800}:{width:1200,height:760}});
await ctx.route(/fonts\.g/,r=>r.abort());await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html; charset=utf-8'}));
await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));await ctx.exposeFunction('__rt',(op,p,v)=>rt(op,p,v));
await ctx.addInitScript(()=>{localStorage.setItem('mock.want',JSON.stringify({uid:'u1',displayName:'Ana'}));});
const P=await ctx.newPage();P.on('pageerror',e=>console.log('ERR',e.message));
await P.goto('https://pp.test/');await P.waitForTimeout(1200);await P.click('#pp-signin');await P.waitForTimeout(3500);
await P.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await P.waitForTimeout(400);
await P.evaluate(([ELS,PLV])=>{const I=window.__st.island;I.tut=99;const st=window.__st;
  const base=st.chars[0];st.chars.length=0;
  const BK=(function(){const a=window.__kd.bodies();return [a[3],a[11],a[20],a[30]];})();ELS.forEach((e,i)=>st.chars.push(Object.assign({},base,{id:'p'+i,name:'Pal'+i,element:e,level:PLV,body:BK[i]||'',img:''})));I.heroId='p0';I.tdPick=['p0','p1','p2','p3'];
  window.__kd.tdOpen();},[ELS,PLV]);
await P.waitForTimeout(500);await P.screenshot({path:'/tmp/td_intro.png'});
await P.evaluate(([lv,mid])=>{window.__MID=mid;window.__kd.tdBegin(lv);},[LV,!!process.env.MID]);await P.waitForTimeout(300);
const r=await P.evaluate(async ()=>{const K=window.__kd,td=K.td,out={};
  function bot(){ const me=0,en=td.E[me];const L=td.P[me];
    // upgrade first if rich
    for(let i=0;i<td.slots.length;i++){const t=td.T[i];if(t&&t.tier<2&&en>200){if(K.tdDo('u',i,0,me))return;}}
    // place: spot closest to the first half of the road
    const free=td.slots.map((s,i)=>i).filter(i=>!td.T[i]); if(!free.length) return;
    const p=Math.floor(Math.random()*L.length), c=L[p]; if(en< 70) return;
    free.sort((a,b)=>score(b)-score(a)); K.tdDo('p',free[0],p,me);
  }
  function score(i){const s=td.slots[i];let n=0;for(let d=0;d<td.map.len;d+=20){const q=pos(d);if(Math.hypot(q.x-s.x,q.y-s.y)<160)n++;}return n;}
  function pos(d){let s=td.map.seg[td.map.seg.length-1];for(const g of td.map.seg){if(d<=g.d0+g.l){s=g;break;}}const t=Math.max(0,Math.min(1,(d-s.d0)/s.l));return {x:s.a[0]+(s.b[0]-s.a[0])*t,y:s.a[1]+(s.b[1]-s.a[1])*t};}
  let steps=0, shot=false; const waveLog=[];
  const MAXS=window.__MID?1300:60000;while(td.phase!=='end' && steps<MAXS){ K.tdUpdate(0.05); steps++; if(steps%20===0) bot(); if(td.phase==='build' && td.cd>2) td.cd=2;
    if(td.wave!==waveLog.length){waveLog.push([td.wave,td.lives,Math.floor(td.E[0]),td.T.filter(Boolean).length]);}
    if(steps===1500 && !shot){shot=true; await new Promise(r=>setTimeout(r,300)); window.__shotNow=1; await new Promise(r=>setTimeout(r,900));}
  }
  out.steps=steps;out.phase=td.phase;out.wave=td.wave;out.lives=td.lives;out.kills=td.kills;out.lastG=td.lastG;out.towers=td.T.filter(Boolean).length;out.slots=td.slots.length;out.waves=waveLog;out.wins=K.winCount?0:0;out.tdWins=window.__st.island.tdWins;
  out.panel=document.getElementById('td-panel').innerText.slice(0,160).replace(/\n/g,' ');
  return out;});
console.log(JSON.stringify(r));
await P.screenshot({path:'/tmp/td_end.png'});
await b.close();process.exit(0);})();
