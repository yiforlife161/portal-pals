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
// every pet must say which way its picture looks (face), and it must match where its eyes are when that is clear
(async()=>{const b=await chromium.launch();const P=await player(b,'u1','Ana');
const warns=[];P.on('console',m=>{if(/face setting/.test(m.text()))warns.push(m.text());});
const r=await P.evaluate(()=>{const out=[];for(const k in window.__PETS){const p=window.__PETS[k];
  const xs=[...p.art().matchAll(/<circle cx="([\d.]+)"[^>]*fill="#1e1530"/g)].map(m=>+m[1]);const avg=xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:30;
  const eyes=avg<27?'left':avg>33?'right':'?';
  // walking right, the picture must end up looking right: a left picture is mirrored, a right one is not
  const flipR=window.__petFlip(k,1), flipL=window.__petFlip(k,-1);
  const looksR=(p.face==='left'?-1:1)*flipR>0;
  out.push({k,face:p.face||'(missing)',eyes,ok:['left','right','front'].includes(p.face)&&(eyes==='?'||p.face==='front'||eyes===p.face)&&looksR&&flipR===-flipL});}
  return out;});
r.forEach(x=>console.log((x.ok?'ok  ':'BAD ')+x.k.padEnd(8),'face',x.face.padEnd(6),'eyes say',x.eyes));
console.log(r.every(x=>x.ok)&&!warns.length?'PASS all '+r.length+' pets':'FAIL');
await b.close();process.exit(0);})();
