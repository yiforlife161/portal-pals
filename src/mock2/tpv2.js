const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const db=require('./server.js');
const html=fs.readFileSync(path.join(__dirname,'ssx.html'),'utf8');
async function player(b,uid,name){
  const ctx=await b.newContext({viewport:{width:1000,height:720}});
  await ctx.route(/fonts\.g/,r=>r.abort());
  await ctx.route('https://pp.test/**',r=>r.fulfill({body:html,contentType:'text/html'}));
  await ctx.route('https://www.gstatic.com/**',r=>{const f=r.request().url().split('/').pop().replace('firebase-','').replace('firestore','fs');return r.fulfill({body:fs.readFileSync(path.join(__dirname,f),'utf8'),contentType:'application/javascript'});});
  await ctx.exposeFunction('__db',(op,u,a)=>db(op,u,a));
  await ctx.exposeFunction('__rt',async()=>null);
  await ctx.addInitScript(([uid,name])=>{localStorage.setItem('mock.want',JSON.stringify({uid,displayName:name}));},[uid,name]);
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log(name,'ERR',e.message));
  pg.on('console',m=>{if(/warn|error/.test(m.type())&&!/Failed to load/.test(m.text()))console.log(name,m.type(),m.text().slice(0,200))});
  await pg.goto('https://pp.test/');await pg.waitForTimeout(1200);
  await pg.click('#pp-signin');await pg.waitForTimeout(4000);
  await pg.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await pg.waitForTimeout(1000);
  return pg;
}
const gold=pg=>pg.evaluate(()=>(document.querySelector('.hud').innerText.match(/[0-9][0-9,]*/g)||[]).join('/'));
async function playMatch(A,B,label){
  await A.evaluate(()=>{window.__ssClose();window.__ssOpen();});await A.waitForTimeout(300);
  await A.click('[data-action=ss-flist]');await A.waitForTimeout(200);
  await A.click('[data-action=ss-fch]');await A.waitForTimeout(800);
  console.log(label,'A hint:',await A.textContent('#hint'));console.log(label,'A pop:',await A.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
  await B.waitForTimeout(800);
  console.log(label,'B pop:',await B.evaluate(()=>document.querySelector('.pv-pop').innerText.replace(/\n/g,' | ')));
  if(label==='decline'){ await B.click('#pv-dec');await A.waitForTimeout(1200);console.log('A hint',await A.textContent('#hint'),'pop hidden',await A.evaluate(()=>document.querySelector('.pv-pop').hidden));return; }
  await B.click('#pv-acc');await B.waitForTimeout(1500);await A.waitForTimeout(300);
  const info=async pg=>pg.evaluate(()=>document.getElementById('ss-info').innerText.replace(/\n/g,' | '));
  console.log(label,'A info',await info(A),'|| B info',await info(B));
  if(label==='m1'){ await A.screenshot({path:path.join(__dirname,'pv1.png')}); }
  console.log('B hand html', (await B.evaluate(()=>document.getElementById('ss-me').innerHTML)).slice(0,200), await B.evaluate(()=>getComputedStyle(document.getElementById('stones')).display));
  // play until end: whoever's turn picks first stone, first empty cell
  for(let k=0;k<12;k++){
    for(const P of [A,B]){
      const my=await P.evaluate(()=>/Your turn/.test(document.getElementById('ss-info').innerText)&&document.querySelectorAll('#ss-me [data-action=ss-pick]').length>0&&document.querySelectorAll('#ss-board [data-action=ss-cell]').length>0);
      if(my){ const n=await P.evaluate(()=>document.querySelectorAll('#ss-me [data-action=ss-pick]').length); if(!n){console.log('no stones in hand for', P===A?'A':'B', await P.evaluate(()=>document.getElementById('ss-info').innerText+' | '+document.getElementById('ss-me').innerHTML.slice(0,100))); break;} await P.click('#ss-me [data-action=ss-pick]');await P.click('#ss-board [data-action=ss-cell]');await P.waitForTimeout(700); }
    }
    const done=await A.evaluate(()=>!document.getElementById('ss-panel').hidden && /win|lose|draw/i.test(document.getElementById('ss-panel').innerText));
    if(done) break;
  }
  await A.waitForTimeout(1500);
  const res=async pg=>pg.evaluate(()=>{const p=document.getElementById('ss-panel');return p.hidden?'(no panel) '+document.getElementById('ss-info').innerText:p.innerText.split('\n').slice(0,3).join(' | ');});
  console.log(label,'A result:',await res(A));console.log(label,'B result:',await res(B));
  console.log(label,'boards equal:',await A.evaluate(()=>[...document.querySelectorAll('#ss-board .ss-cell')].map(c=>c.querySelector('.own-me')?'A':c.querySelector('.own-ai')?'B':'.').join('')),
    await B.evaluate(()=>[...document.querySelectorAll('#ss-board .ss-cell')].map(c=>c.querySelector('.own-me')?'B':c.querySelector('.own-ai')?'A':'.').join('')));
  if(label==='m1') await B.screenshot({path:path.join(__dirname,'pv2.png')});
}
(async()=>{
const b=await chromium.launch();
const A=await player(b,'uidA','Ana'), B=await player(b,'uidB','Boris');
const codeOf=pg=>pg.evaluate(()=>{document.getElementById('btn-friends').click();return new Promise(r=>setTimeout(()=>r(document.querySelector('.fr-code b').textContent),400));});
const cb=await codeOf(B); await codeOf(A);
await A.fill('#fr-add',cb);await A.click('#fr-send');await B.waitForTimeout(900);
await B.click('[data-fr-acc]');await B.waitForTimeout(1200);
await A.evaluate(()=>document.getElementById('btn-friends').click());await B.evaluate(()=>document.getElementById('btn-friends').click());
console.log('gold before',await gold(A),await gold(B));
console.log('friends list has no challenge button:', await A.evaluate(()=>{document.getElementById('btn-friends').click();return document.querySelectorAll('[data-fr-ch]').length===0;}));await A.evaluate(()=>document.getElementById('btn-friends').click());
await A.evaluate(()=>{const k=window.PP_SAVE_KEY;const o=JSON.parse(localStorage.getItem(k));o.island.items.push({id:'st1',type:'stonetable',x:150,y:40,flip:false,sc:1,s:0});o.t=Date.now();localStorage.setItem(k,JSON.stringify(o));window.ppNoSave=true;});
await A.reload();await A.waitForTimeout(3500);await A.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await A.waitForTimeout(800);
await playMatch(A,B,'decline');
await playMatch(A,B,'m1');
console.log('gold after m1',await gold(A),await gold(B), 'match n', db.DB['matches/uidA_uidB'].n, 'first', db.DB['matches/uidA_uidB'].first);
await A.click('[data-action=ss-leave]');await B.click('[data-action=ss-leave]');await A.waitForTimeout(500);
await playMatch(A,B,'m2');
console.log('match n', db.DB['matches/uidA_uidB'].n, 'first', db.DB['matches/uidA_uidB'].first, 'st',db.DB['matches/uidA_uidB'].st);
// m3: B leaves mid-match -> A wins
await A.click('[data-action=ss-leave]');await B.click('[data-action=ss-leave]');await A.waitForTimeout(500);
await A.evaluate(()=>{window.__ssClose();window.__ssOpen();});await A.waitForTimeout(300);await A.click('[data-action=ss-flist]');await A.click('[data-action=ss-fch]');await B.waitForTimeout(1200);await B.click('#pv-acc');await B.waitForTimeout(1500);
await B.click('[data-action=ss-leave]');await B.click('[data-action=ss-leave]');await A.waitForTimeout(1500);
console.log('m3 A after B left:',await A.evaluate(()=>document.getElementById('ss-panel').innerText.split('\n').slice(0,3).join(' | ')), await gold(A));
// abuse: stranger C writes into match
try{ await db('write','uidC',[{op:'update',path:'matches/uidA_uidB',v:{st:'done'}}]); console.log('ABUSE'); }catch(e){ console.log('stranger blocked:',e.message); }
await b.close();})();
