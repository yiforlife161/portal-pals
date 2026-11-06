const me=()=>{ const u=localStorage.getItem('mock.user'); return u?JSON.parse(u).uid:null; };
export function getFirestore(){ return {}; }
export function doc(_db,...p){ return {path:p.join('/'), id:p[p.length-1]}; }
export function collection(_db,...p){ return {coll:p.join('/')}; }
export function serverTimestamp(){ return { '.sv': 'ts' }; }
const snap=(path,d,pend)=>({id:path.split('/').pop(),exists:()=>d!=null,data:()=>d,metadata:{hasPendingWrites:!!pend}});
export async function getDoc(r){ const d=await window.__db('get',me(),[{path:r.path}]); return snap(r.path,d); }
export async function setDoc(r,v,o){ await window.__db('write',me(),[{op:'set',path:r.path,v,merge:!!(o&&o.merge)}]); }
const SHUF=localStorage.getItem('mock.shuffle')==='1';
function shuf(v){ if(!SHUF||v==null||typeof v!=='object') return v; if(Array.isArray(v)) return v.map(shuf); const ks=Object.keys(v).sort(()=>Math.random()-0.5); const o={}; ks.forEach(k=>o[k]=shuf(v[k])); return o; }
/* like the real SDK: a write shows up at once in this page's listeners (pending), and reaches the server after FS_LAT ms */
const LAT=+(localStorage.getItem('mock.fslat')||0), PEND={}, LIS={};
function localFire(path){ (LIS[path]||[]).forEach(fn=>fn()); }
export async function updateDoc(r,v){
  if(!LAT){ await window.__db('write',me(),[{op:'update',path:r.path,v}]); return; }
  (PEND[r.path]=PEND[r.path]||[]).push(v); localFire(r.path);
  await new Promise(res=>setTimeout(res,LAT));
  try{ await window.__db('write',me(),[{op:'update',path:r.path,v}]); } finally { PEND[r.path].shift(); localFire(r.path); }
}
export async function deleteDoc(r){ await window.__db('write',me(),[{op:'delete',path:r.path}]); }
export function writeBatch(){ const ops=[]; return { set:(r,v,o)=>ops.push({op:'set',path:r.path,v,merge:!!(o&&o.merge)}), update:(r,v)=>ops.push({op:'update',path:r.path,v}), delete:(r)=>ops.push({op:'delete',path:r.path}), commit:()=>window.__db('write',me(),ops) }; }
export function onSnapshot(ref,f,err,e2){
  if(f&&typeof f==='object'&&typeof err==='function'){ f=err; err=e2; }
  let last=null, stop=false;
  const tick=async()=>{ if(stop)return; try{
    if(ref.coll){ const list=await window.__db('list',me(),[{coll:ref.coll}]); const j=JSON.stringify(list); if(j!==last){ last=j; f({forEach:(cb)=>list.forEach(([p,d])=>cb(snap(p,d)))}); } }
    else { let d=shuf(await window.__db('get',me(),[{path:ref.path}])); if(d&&PEND[ref.path]&&PEND[ref.path].length){ d=Object.assign({},d); PEND[ref.path].forEach(v=>Object.assign(d,v)); } const pd=!!(PEND[ref.path]&&PEND[ref.path].length), j=JSON.stringify(d)+pd; if(j!==last){ last=j; f(snap(ref.path,d,pd)); } }
  }catch(e){ err&&err(e); } if(!stop) T=setTimeout(tick,250); };
  let T=null; const now=()=>{ clearTimeout(T); tick(); };
  if(ref.path){ (LIS[ref.path]=LIS[ref.path]||[]).push(now); }
  tick(); return ()=>{stop=true; clearTimeout(T); if(ref.path) LIS[ref.path]=LIS[ref.path].filter(x=>x!==now);};
}
export function query(c, ...parts){ return { coll: c.coll, parts }; }
export function orderBy(f, dir){ return { t: 'ob', f, dir }; }
export function limit(n){ return { t: 'lim', n }; }
export function where(f, op, v){ return { t: 'wh', f, op, v }; }
export async function getDocs(q){ const list = await window.__db('query', me(), [q]); return { forEach: cb => list.forEach(([p, d]) => cb(snap(p, d))) }; }
export async function getCountFromServer(q){ const list = await window.__db('query', me(), [q]); return { data: () => ({ count: list.length }) }; }
