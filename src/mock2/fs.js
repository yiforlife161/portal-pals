const me=()=>{ const u=localStorage.getItem('mock.user'); return u?JSON.parse(u).uid:null; };
export function getFirestore(){ return {}; }
export function doc(_db,...p){ return {path:p.join('/'), id:p[p.length-1]}; }
export function collection(_db,...p){ return {coll:p.join('/')}; }
export function serverTimestamp(){ return { '.sv': 'ts' }; }
const snap=(path,d)=>({id:path.split('/').pop(),exists:()=>d!=null,data:()=>d});
export async function getDoc(r){ const d=await window.__db('get',me(),[{path:r.path}]); return snap(r.path,d); }
export async function setDoc(r,v,o){ await window.__db('write',me(),[{op:'set',path:r.path,v,merge:!!(o&&o.merge)}]); }
export async function updateDoc(r,v){ await window.__db('write',me(),[{op:'update',path:r.path,v}]); }
export async function deleteDoc(r){ await window.__db('write',me(),[{op:'delete',path:r.path}]); }
export function writeBatch(){ const ops=[]; return { set:(r,v,o)=>ops.push({op:'set',path:r.path,v,merge:!!(o&&o.merge)}), update:(r,v)=>ops.push({op:'update',path:r.path,v}), delete:(r)=>ops.push({op:'delete',path:r.path}), commit:()=>window.__db('write',me(),ops) }; }
export function onSnapshot(ref,f,err){
  let last=null, stop=false;
  const tick=async()=>{ if(stop)return; try{
    if(ref.coll){ const list=await window.__db('list',me(),[{coll:ref.coll}]); const j=JSON.stringify(list); if(j!==last){ last=j; f({forEach:(cb)=>list.forEach(([p,d])=>cb(snap(p,d)))}); } }
    else { const d=await window.__db('get',me(),[{path:ref.path}]); const j=JSON.stringify(d); if(j!==last){ last=j; f(snap(ref.path,d)); } }
  }catch(e){ err&&err(e); } setTimeout(tick,250); };
  tick(); return ()=>{stop=true;};
}
export function query(c, ...parts){ return { coll: c.coll, parts }; }
export function orderBy(f, dir){ return { t: 'ob', f, dir }; }
export function limit(n){ return { t: 'lim', n }; }
export function where(f, op, v){ return { t: 'wh', f, op, v }; }
export async function getDocs(q){ const list = await window.__db('query', me(), [q]); return { forEach: cb => list.forEach(([p, d]) => cb(snap(p, d))) }; }
export async function getCountFromServer(q){ const list = await window.__db('query', me(), [q]); return { data: () => ({ count: list.length }) }; }
