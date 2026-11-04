// two friends skill together in the host's forest: shared trees, separate bags
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js'), rt=require('./rt.js');
const html=fs.readFileSync(path.join(__dirname,'coopx.html'),'utf8');
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
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();const I=window.__st.island;I.tut=99;I.axes={own:{bronze:true},eq:'bronze'};});await pg.waitForTimeout(800);
  return pg;
}
const trees=pg=>pg.evaluate(()=>window.__st.island.items.filter(i=>window.__isNode(i,'forest')).map(i=>i.id).sort().join(','));
const logs=pg=>pg.evaluate(()=>Object.entries(window.__st.island.bag||{}).filter(e=>/^log_/.test(e[0])).reduce((n,e)=>n+e[1],0));
const node=(pg,id)=>pg.evaluate(id=>{const i=window.__st.island.items.find(x=>x.id===id);return i?{s:i.s,exp:i.exp?Math.round((i.exp-Date.now())/1000):0}:null;},id);
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana'), B=await player(b,'uidB','Boris');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const cb=await codeOf(B); await codeOf(A);
await A.fill('#fr-add',cb);await A.click('#fr-send');await B.waitForTimeout(900);
await B.click('[data-fr-acc]');await B.waitForTimeout(1200);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
console.log('trees differ before:',(await trees(A))!==(await trees(B)));
await A.evaluate(()=>window.__enterArea('forest'));await A.waitForTimeout(1500);
console.log('invite button shown:',await A.evaluate(()=>!document.getElementById('skpinv').hidden));
await A.click('#skpinv');await A.waitForTimeout(300);
await A.click('[data-action=skp-inv]');await A.waitForTimeout(1500);
console.log('A pop:',await A.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
console.log('B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
await B.click('#pv-acc');
for(let i=0;i<40;i++){await B.waitForTimeout(250);if(await B.evaluate(()=>!!(window.__skp.coop&&window.__skp.coop.lsig)))break;}
console.log('layout arrived after accept (ms, with lobby):',await B.evaluate(()=>window.__skp.coop?'yes':'no'));await B.waitForTimeout(600);
const st=pg=>pg.evaluate(()=>{const C=window.__skp.coop;return C?{role:C.role,mates:Object.values(C.mates).map(m=>m.name+(m.x!==null?' @'+m.x.toFixed(0)+','+m.y.toFixed(0):' ?')),realm:window.__st.island.realm,mateEls:document.querySelectorAll('.token.mate').length,bar:document.getElementById('skpbar').innerText.replace(/\n/g,' ')}:null;});
console.log('A',JSON.stringify(await st(A)));console.log('B',JSON.stringify(await st(B)));
{const ta=(await trees(A)).split(','),tb=(await trees(B)).split(',');console.log('B took A\'s trees:',ta.join()===tb.join(),'A',ta.length,'B',tb.length,'onlyA',ta.filter(x=>!tb.includes(x)).length,'onlyB',tb.filter(x=>!ta.includes(x)).length);
0&&console.log('onlyA types',await A.evaluate(ids=>window.__st.island.items.filter(i=>ids.includes(i.id)).map(i=>i.type+(window.__ITEMS[i.type].mine?'':'?')).join(' '),ta.filter(x=>!tb.includes(x))));}
// A chops a tree; B should see the same tree's timer start
const t1=await A.evaluate(()=>{const H=window.__st.island;const L=H.items.filter(i=>window.__isNode(i,'forest')&&i.type==='treenormal'||window.__isNode(i,'forest')&&/tree/.test(i.type)).sort((p,q)=>Math.hypot(p.x-H.hx,p.y-H.hy)-Math.hypot(q.x-H.hx,q.y-H.hy));const t=L.find(i=>window.__ITEMS[i.type].mine.lv<=1||!window.__ITEMS[i.type].mine.lv);window.__cmdI(t.id);return t.id;});
const l0=[await logs(A),await logs(B)];
await A.waitForTimeout(3000);
console.log('B sees A with a tool (mid-chop):',await B.evaluate(()=>!!document.querySelector('.token.mate .mbub')));
await A.waitForTimeout(6000);
console.log('A chopping, tree on A',JSON.stringify(await node(A,t1)),'on B',JSON.stringify(await node(B,t1)));
console.log('B sees A with a tool:',await B.evaluate(()=>!!document.querySelector('.token.mate .mbub')));
await A.screenshot({path:path.join(__dirname,'sk1.png')});await B.screenshot({path:path.join(__dirname,'sk2.png')});
// B chops a different fresh tree; A should get its timer from B's hit
const t2=await B.evaluate(t1=>{const H=window.__st.island;const L=H.items.filter(i=>window.__isNode(i,'forest')&&i.id!==t1&&!i.exp&&i.s<window.__ITEMS[i.type].n&&!(window.__ITEMS[i.type].mine.lv>1)).sort((p,q)=>Math.hypot(p.x-H.hx,p.y-H.hy)-Math.hypot(q.x-H.hx,q.y-H.hy));window.__cmdI(L[0].id);return L[0].id;},t1);
await B.waitForTimeout(12000);
console.log('B chopping, tree on B',JSON.stringify(await node(B,t2)),'on A',JSON.stringify(await node(A,t2)));
console.log('logs gained A',(await logs(A))-l0[0],'B',(await logs(B))-l0[1]);
// wait for tree 1 to be used up on the host, check B follows
await A.waitForTimeout(30000);
console.log('tree 1 after its 40s: A',JSON.stringify(await node(A,t1)),'B',JSON.stringify(await node(B,t1)));
// B leaves
await B.click('[data-action=skp-leave]');await B.waitForTimeout(3000);
console.log('after B leaves: A',JSON.stringify(await st(A)),'B',JSON.stringify(await st(B)));
console.log('A flash:',await A.evaluate(()=>{const f=document.querySelector('.flash,#flash');return f?f.innerText:'';}));
await b.close();})();
