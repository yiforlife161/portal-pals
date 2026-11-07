// Island Quest co-op: Ana hosts, Boris joins; both run the bot. Shared monsters/locks/chests, own rewards, shared finish
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8'), bot=fs.readFileSync(path.join(__dirname,'qbot.js'),'utf8');
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
(async()=>{const b=await chromium.launch();const P=await player(b,'u1','Ana');
const r=await P.evaluate(()=>{const out={tot:0,bad:0,ex:[]};
  for(let lv=1;lv<=3;lv++) for(let seed=1;seed<=300;seed++){const L=window.__quGen(seed*7777,lv,1,1);if(!L)continue;
    window.__qu.L=L;
    L.br.forEach(B=>{B.st=1;});L.br.forEach((B,bi)=>{out.tot++;const A=L.isl[B.a],C=L.isl[B.b];
      // walk with the game's own movement from A's middle toward B's middle, following the bridge line
      const p={x:A.x,y:A.y};const pts=[[B.x1,B.y1],[B.x2,B.y2],[C.x,C.y]];let ok=true,steps=0;
      for(const [tx,ty] of pts){for(let k=0;k<4000;k++){const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d<4)break;const st=Math.min(4,d);
        if(!window.__quMove(p,dx/d*st,dy/d*st)){ok=false;break;} if(++steps>6000){ok=false;break;}} if(!ok)break;}
      if(!ok){out.bad++; if(out.ex.length<6) out.ex.push({lv,seed,bi,at:[Math.round(p.x),Math.round(p.y)],x1:[Math.round(B.x1),Math.round(B.y1)],x2:[Math.round(B.x2),Math.round(B.y2)],u:[B.ux.toFixed(2),B.uy.toFixed(2)],len:Math.round(B.len)});}
    });}
  return out;});
console.log(JSON.stringify(r));
await b.close();process.exit(0);})();
