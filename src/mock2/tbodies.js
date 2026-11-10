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
// special pals: make each one in the New pal form, check the locks, then play with it
(async()=>{const b=await chromium.launch();const P=await player(b,'u1','Ana');const OUT=process.argv[2]||'.';
await P.click('button.dbtn[data-tab=pals]');await P.waitForTimeout(500);
const made=[];
for(const [k,name] of [['eagle','Talon'],['wyrm','Gloom'],['knight','Rattles'],['mecha','Bolt'],['cyc','Glare'],['rogue','Wren'],['md','Rex'],['sh','Spore'],['tk','Rivet'],['ar','Ember'],['sn','Aegis'],['go','Boulder'],['dv','Finn'],['ti','Tok'],['gm','Prism'],['lv','Magma'],['zs','Thunder'],['br','Bruno'],['fd','Blaze'],['ss','Chomp'],['tr','Oakley'],['ms','Fizzle'],['ik','Frost'],['mr','Cinder']]){
  await P.click('button.btn.primary[data-action=new] >> visible=true');await P.waitForTimeout(300);
  await P.evaluate(k=>{const r=document.querySelector('input[name=pbody][value='+k+']');r.scrollIntoView({block:'center'});},k);await P.waitForTimeout(150);await P.click('input[name=pbody][value='+k+']',{force:true});await P.waitForTimeout(200);
  const lock=await P.evaluate(()=>({el:[...document.querySelectorAll('input[name=element]')].filter(r=>!r.disabled).map(r=>r.value+(r.checked?'*':'')),st:[...document.querySelectorAll('input[name=pstyle]')].filter(r=>!r.disabled).map(r=>r.value),size:[...document.querySelectorAll('input[name=psize]')].filter(r=>!r.disabled).map(r=>r.value),imgHidden:document.getElementById('f-img-field').offsetParent===null,sub:document.querySelector('.pv-sub').textContent}));
  await P.screenshot({path:OUT+'/form_'+k+'.png'});
  await P.fill('#f-name',name);await P.click('#form-submit');await P.waitForTimeout(300);
  made.push([k,lock]);
}
const chars=await P.evaluate(()=>window.__st.chars.map(c=>[c.name,c.body||'',c.element,c.style,c.giant?'giant':'normal']));
console.log('locks',JSON.stringify(made));console.log('chars',JSON.stringify(chars));
// try to cheat: change element of a special pal through the save cleaner
const cl=await P.evaluate(()=>{const c=window.__st.chars.find(c=>c.body==='eagle');return [c.element,c.style];});
console.log('eagle saved as',cl);
await P.screenshot({path:OUT+'/grid.png'});
await P.evaluate(()=>{const c=window.__st.chars.find(c=>c.body==='eagle');c.giant=true;});await P.click('button.dbtn[data-tab=pals]').catch(()=>{});await P.waitForTimeout(1500);await P.reload();await P.waitForTimeout(1500);await P.click('#pp-signin').catch(()=>{});await P.waitForTimeout(3500);
await P.evaluate(()=>{const b=document.querySelector('[data-action=menu-play]');b&&b.click();});await P.waitForTimeout(800);
console.log('after reload',JSON.stringify(await P.evaluate(()=>window.__st.chars.map(c=>[c.name,c.body||'',c.element,c.style,c.giant?'giant':'normal']))));
for(const k of ['eagle','wyrm','knight','mecha','cyc','rogue','md','sh','tk','ar','sn','go','dv','ti','gm','lv','zs','br','fd','ss','tr','ms','ik','mr']){
  await P.evaluate(k=>{const S=window.__st;const c=S.chars.find(c=>c.body===k);S.island.heroId=c.id;S.island.hero=c.id;window.__syncHero();window.__renderSide();},k);
  await P.waitForTimeout(600);await P.screenshot({path:OUT+'/isl_'+k+'.png'});
}
await P.evaluate((SHOT)=>{const S=window.__st;const c=S.chars.find(c=>c.body===SHOT);S.island.heroId=c.id;window.__syncHero();const I=S.island;I.lvWon=Object.assign({},I.lvWon,{arena:3,quest:3});},process.env.SHOT||'wyrm');
await P.evaluate(()=>window.__dfOpen('arena'));await P.waitForTimeout(400);await P.click('[data-action=df-start][data-lv="1"]');
for(let i=0;i<30&&await P.evaluate(()=>window.__df.foes.filter(f=>!f.dead).length<1);i++) await P.waitForTimeout(300);
await P.evaluate(()=>{const df=window.__df,H=df.hero;const f=df.foes.find(f=>!f.dead);f.x=H.x+150;f.y=H.y;f.spd=0;f.T=Object.assign({},f.T,{spd:0});f.hp=f.max=9999;df.aim={x:f.x,y:f.y-22};H.cool=0;window.__dfAim(H);window.__zapNow=df.shots.map(s=>s.p.c.body||'');});
console.log('shot right after firing:',JSON.stringify(await P.evaluate(()=>window.__zapNow)));
await P.waitForTimeout(90);await P.screenshot({path:OUT+'/arena_'+(process.env.SHOT||'wyrm')+'.png'});
console.log('arena shots zap',JSON.stringify(await P.evaluate(()=>[window.__df.hero&&window.__df.hero.c.body,window.__df.phase,window.__df.foes.length,window.__df.shots.map(s=>s.p.c.body||'')])));
await P.evaluate(()=>{window.__df.phase='end';});
await b.close();process.exit(0);})();
