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
// Pal Builder: build a look from parts, check every option draws, save + share, a second player sees it
(async()=>{const b=await chromium.launch();const OUT=process.argv[2]||'.';
const A=await player(b,'uidA','Ana');
await A.click('button.dbtn[data-tab=pals]');await A.waitForTimeout(400);
await A.click('button.btn.primary[data-action=new] >> visible=true');await A.waitForTimeout(300);
await A.click('[data-action=lk-open]');await A.waitForTimeout(400);
// pick some parts
await A.fill('#lk-name','Sprout Knight');await A.selectOption('#lk-el','life');
for(const [k,v] of [['head','wide'],['body','broad'],['pat','armor'],['eyes','angry'],['mouth','grin'],['top','horns'],['back','cape'],['arms','thick'],['legs','normal'],['wpn','sword']])
  await A.click('#bd-ctrl [data-k='+k+'][data-v='+v+']');
await A.evaluate(()=>{const i=document.querySelector('#bd-ctrl input[data-bdc=c1]');i.value='#4a9a5a';i.dispatchEvent(new Event('input'));});
await A.waitForTimeout(300);
const mk=await A.$('#lk-make');await mk.screenshot({path:OUT+'/builder.png'});
await A.click('[data-action=lk-anim][data-a=walking]');await A.waitForTimeout(250);
const pv=await A.$('#lk-prev');await pv.screenshot({path:OUT+'/walk.png'});
// every option of every part draws without errors: render 24 random looks into a sheet
const sheet=await A.evaluate(()=>{let h='';for(let i=0;i<24;i++){document.querySelector('[data-action=bd-random]').click();const p=document.querySelector('#lk-prev .pbody');h+='<div style="width:120px;height:120px;position:relative;display:inline-block;margin:6px">'+p.outerHTML+'</div>';}
  const d=document.createElement('div');d.id='bdsheet';d.style.cssText='position:fixed;left:0;top:0;width:820px;background:#cfe8c8;z-index:99999;padding:8px';d.innerHTML=h;document.body.appendChild(d);return 1;});
await A.waitForTimeout(300);const sh=await A.$('#bdsheet');await sh.screenshot({path:OUT+'/random.png'});await A.evaluate(()=>document.getElementById('bdsheet').remove());
// back to the knight and save
for(const [k,v] of [['head','wide'],['body','broad'],['pat','armor'],['eyes','angry'],['mouth','grin'],['top','horns'],['back','cape'],['arms','thick'],['legs','normal'],['wpn','sword']])
  await A.click('#bd-ctrl [data-k='+k+'][data-v='+v+']');
await A.click('[data-action=lk-save]');await A.waitForTimeout(2000);
const id=await A.evaluate(()=>{const r=document.querySelector('input[name=pbody]:checked');return r&&r.value;});
const keys=Object.keys(db.DB).filter(k=>k.startsWith('codes/L_'));
console.log('saved',id,'| shared docs',keys.length,'size bytes',keys.map(k=>JSON.stringify(db.DB[k]).length));
await A.fill('#f-name','Sprig Two');await A.click('#form-submit');await A.waitForTimeout(400);
await A.evaluate(id=>{const S=window.__st;const c=S.chars.find(c=>c.body===id);S.island.heroId=c.id;window.__syncHero();const I=S.island;I.lvWon=Object.assign({},I.lvWon,{arena:3});},id);
await A.evaluate(()=>window.__dfOpen('arena'));await A.waitForTimeout(400);await A.click('[data-action=df-start][data-lv="1"]');await A.waitForTimeout(3000);
await A.screenshot({path:OUT+'/arena.png'});
const B=await player(b,'uidB','Boris');await B.waitForTimeout(2500);
console.log('B sees it:',await B.evaluate(id=>!!(document.querySelector('input[name=pbody][value="'+id+'"]')),id));
await b.close();process.exit(0);})();
