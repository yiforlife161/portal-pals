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
// player-made looks: A makes one from 6 layer pictures and shares it, B sees it after loading, makes a pal with it; A removes it
(async()=>{const b=await chromium.launch();const OUT=process.argv[2]||'.';const LT=path.join(__dirname,'looktest');
const A=await player(b,'uidA','Ana');
await A.click('button.dbtn[data-tab=pals]');await A.waitForTimeout(400);
await A.click('button.btn.primary[data-action=new] >> visible=true');await A.waitForTimeout(300);
await A.click('[data-action=lk-open]');await A.waitForTimeout(300);
await A.fill('#lk-name','Moss Buddy');await A.selectOption('#lk-el','earth');await A.selectOption('#lk-style','ranged');
for(const k of ['body','front','armB','legL','legR','back']) await A.setInputFiles('#lk-make input[data-lk='+k+']',path.join(LT,k+'.png'));
await A.waitForTimeout(1500);
console.log('parts loaded:',await A.evaluate(()=>[...document.querySelectorAll('#lk-make .lk-part.have')].map(e=>e.dataset.part).join(',')),'| err:',await A.evaluate(()=>document.getElementById('lk-err').textContent));
const sec=await A.$('#lk-make');await sec.screenshot({path:OUT+'/maker.png'});
const [dl]=await Promise.all([A.waitForEvent('download'),A.click('[data-action=lk-canvas]')]);await dl.saveAs(OUT+'/canvas.png');console.log('canvas downloaded:',dl.suggestedFilename());
await A.click('[data-action=lk-save]');await A.waitForTimeout(2000);
const id=await A.evaluate(()=>{const r=document.querySelector('input[name=pbody]:checked');return r&&r.value;});
console.log('A picked look after save:',id);
const keys=Object.keys(db.DB).filter(k=>k.startsWith('codes/L_'));console.log('shared docs:',keys, 'size KB', keys.map(k=>Math.round(JSON.stringify(db.DB[k]).length/1024)));
await A.fill('#f-name','Mossy');await A.click('#form-submit');await A.waitForTimeout(500);
console.log('A chars:',JSON.stringify(await A.evaluate(()=>window.__st.chars.map(c=>[c.name,c.body||'',c.element,c.style]))));
await A.screenshot({path:OUT+'/grid.png'});
// B joins later and should see the look
const B=await player(b,'uidB','Boris');await B.waitForTimeout(2500);
await B.click('button.dbtn[data-tab=pals]');await B.waitForTimeout(400);
await B.click('button.btn.primary[data-action=new] >> visible=true');await B.waitForTimeout(300);
const seen=await B.evaluate(id=>!!document.querySelector('input[name=pbody][value="'+id+'"]'),id);console.log('B sees the look:',seen);
await B.evaluate(id=>{const r=document.querySelector('input[name=pbody][value="'+id+'"]');r.scrollIntoView({block:'center'});},id);
await B.click('input[name=pbody][value="'+id+'"]',{force:true});await B.waitForTimeout(200);
console.log('B locks:',JSON.stringify(await B.evaluate(()=>({el:[...document.querySelectorAll('input[name=element]')].filter(r=>!r.disabled).map(r=>r.value),st:[...document.querySelectorAll('input[name=pstyle]')].filter(r=>!r.disabled).map(r=>r.value)}))));
await B.fill('#f-name','Boulder Bob');await B.click('#form-submit');await B.waitForTimeout(500);
await B.evaluate(id=>{const S=window.__st;const c=S.chars.find(c=>c.body===id);S.island.heroId=c.id;window.__syncHero();},id);await B.waitForTimeout(400);
await B.click('button.dbtn[data-tab=pals]').catch(()=>{});await B.waitForTimeout(300);
await B.screenshot({path:OUT+'/b_island.png'});
// B reloads: the pal keeps its look
await B.waitForTimeout(1500);await B.reload();await B.waitForTimeout(1500);await B.click('#pp-signin').catch(()=>{});await B.waitForTimeout(4000);
console.log('B after reload:',JSON.stringify(await B.evaluate(id=>[window.__st.chars.filter(c=>c.body===id).map(c=>[c.name,c.element,c.style]),!!document.querySelector('.token .pbody, .token image')],id)));
// A removes the look; a new player C no longer sees it
await A.click('button.dbtn[data-tab=pals]').catch(()=>{});await A.waitForTimeout(300);
await A.click('button.btn.primary[data-action=new] >> visible=true');await A.waitForTimeout(300);await A.click('[data-action=lk-open]');await A.waitForTimeout(300);
await A.click('[data-action=lk-del]');await A.waitForTimeout(1200);
const C=await player(b,'uidC','Cara');await C.waitForTimeout(2500);
console.log('C sees removed look:',await C.evaluate(id=>!!document.querySelector('input[name=pbody][value="'+id+'"]'),id));
await b.close();process.exit(0);})();
