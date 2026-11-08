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
const A=await player(b,'uidA','Ana');A.on('pageerror',e=>console.log('PAGEERR',e.message));
await A.click('button.dbtn[data-tab=pals]');await A.waitForTimeout(400);
await A.click('button.btn.primary[data-action=new] >> visible=true');await A.waitForTimeout(300);
await A.click('[data-action=lk-open]');await A.waitForTimeout(400);
await A.fill('#lk-name','Star Gremlin');await A.selectOption('#lk-el','magic');
for(const [k,v] of [['head','bean'],['body','egg'],['pat','none'],['eyes','cute'],['mouth','tongue'],['top','bunny'],['back','butterfly'],['arms','gloves'],['legs','boots'],['wpn','lantern']])
  await A.click('#bd-ctrl [data-k='+k+'][data-v='+v+']');
await A.click('[data-action=st-tab][data-t=st]');await A.waitForTimeout(200);
// a yellow star on the belly, dragged a bit, then a mirrored copy; a heart on the left leg; a gear on the lantern
await A.evaluate(()=>{const i=document.getElementById('st-newc');i.value='#ffd23a';i.dispatchEvent(new Event('input'));});
await A.click('[data-action=st-add][data-s=star]');await A.waitForTimeout(150);
const ov=await A.$('#st-ov');const box=await ov.boundingBox();
const sx=await A.evaluate(()=>{const s=window.__lkB?null:null;return null;});
// drag the new star from where it is to the left side of the belly
const st=await A.evaluate(()=>{const ov=document.getElementById('st-ov');const c=ov.querySelector('circle');return c?[+c.getAttribute('cx'),+c.getAttribute('cy')]:null;});
await A.mouse.move(box.x+st[0]/100*box.width,box.y+st[1]/100*box.height);await A.mouse.down();
await A.mouse.move(box.x+51.5/100*box.width,box.y+66/100*box.height,{steps:6});
await A.screenshot({path:OUT+'/snap.png'});
console.log('snapped to middle while dragging:',JSON.stringify(await A.evaluate(()=>{const c=document.querySelector('#st-ov circle');const l=document.querySelector('#st-ov path');return [c&&c.getAttribute('cx'),!!l,l&&l.getAttribute('stroke')];})));
await A.mouse.up();
console.log('line hidden after drop:',await A.evaluate(()=>!document.querySelector('#st-ov path')));
await A.mouse.move(box.x+st[0]/100*box.width,box.y+st[1]/100*box.height);
await A.fill('#st-size','0.6').catch(()=>{});await A.evaluate(()=>{const r=document.getElementById('st-size');r.value='0.7';r.dispatchEvent(new Event('input'));const t=document.getElementById('st-rot');t.value='20';t.dispatchEvent(new Event('input'));});
await A.click('[data-action=st-mirror]');await A.waitForTimeout(150);
await A.selectOption('#st-newL','legL');await A.evaluate(()=>{const i=document.getElementById('st-newc');i.value='#ff5a7a';i.dispatchEvent(new Event('input'));});
await A.click('[data-action=st-add][data-s=heart]');await A.waitForTimeout(150);
await A.evaluate(()=>{const r=document.getElementById('st-size');r.value='0.45';r.dispatchEvent(new Event('input'));});
await A.waitForTimeout(200);
const mk=await A.$('#lk-make');await mk.screenshot({path:OUT+'/stickers.png'});
const stinfo=await A.evaluate(()=>document.querySelector('[data-action=st-tab][data-t=st]').textContent);
console.log('sticker tab:',stinfo);
await A.click('[data-action=lk-anim][data-a=walking]');await A.waitForTimeout(260);
const pv=await A.$('#lk-prev');await pv.screenshot({path:OUT+'/walk2.png'});
// random sheet with all the new parts
await A.click('[data-action=st-tab][data-t=parts]');await A.waitForTimeout(150);
await A.evaluate(()=>{let h='';for(let i=0;i<24;i++){document.querySelector('[data-action=bd-random]').click();const p=document.querySelector('#lk-pb');h+='<div style="width:120px;height:120px;position:relative;display:inline-block;margin:6px"><span class="pbody">'+p.innerHTML+'</span></div>';}
  const d=document.createElement('div');d.id='bdsheet';d.style.cssText='position:fixed;left:0;top:0;width:820px;background:#cfe8c8;z-index:99999;padding:8px';d.innerHTML=h;document.body.appendChild(d);});
await A.waitForTimeout(300);const sh=await A.$('#bdsheet');await sh.screenshot({path:OUT+'/random2.png'});await A.evaluate(()=>document.getElementById('bdsheet').remove());
await A.click('[data-action=lk-save]');await A.waitForTimeout(2000);
const id=await A.evaluate(()=>{const r=document.querySelector('input[name=pbody]:checked');return r&&r.value;});
const keys=Object.keys(db.DB).filter(k=>k.startsWith('codes/L_'));
console.log('saved',id,'stickers saved:',keys.map(k=>(db.DB[k].b.st||[]).length),'bytes',keys.map(k=>JSON.stringify(db.DB[k]).length));
const B=await player(b,'uidB','Boris');await B.waitForTimeout(2500);
console.log('B sees it:',await B.evaluate(id=>!!(document.querySelector('input[name=pbody][value="'+id+'"]')),id));
await b.close();process.exit(0);})();
