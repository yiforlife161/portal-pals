// shared in-memory Firestore with the security rules from the setup guide
const DB={};
function canRead(uid,path){
  const p=path.split('/');
  if(!uid) return false;
  if(p[0]==='saves') return p[1]===uid;
  if(p[0]==='codes') return true;
  if(p[0]==='matches'){ const pr=p[1].split('_'); return pr.includes(uid); }
  if(p[0]==='chats'){ return p[1].split('_').includes(uid); }
  if(p[0]==='islands') return p[1]===uid || DB['users/'+p[1]+'/friends/'+uid]!==undefined;
  if(p[0]==='users'){ if(p.length<=2) return true; if(p[2]==='requests'||p[2]==='friends'||p[2]==='invites') return p[1]===uid; }
  return false;
}
function canWrite(uid,op,path,v,pre){
  const p=path.split('/'), exists=x=>pre[x]!==undefined;
  if(!uid) return false;
  if(p[0]==='saves') return p[1]===uid;
  if(p[0]==='islands') return p[1]===uid;
  if(p[0]==='matches'){ const pr=p[1].split('_'); if(!pr.includes(uid)) return false; const other=pr[0]===uid?pr[1]:pr[0]; return exists('users/'+uid+'/friends/'+other); }
  if(p[0]==='chats'){ const pr=p[1].split('_'); if(!pr.includes(uid)||op==='delete') return false; const other=pr[0]===uid?pr[1]:pr[0]; if(!exists('users/'+uid+'/friends/'+other)) return false;
    if(p.length===2) return v&&v.last&&v.last.from===uid; if(op!=='create') return false; return v&&v.from===uid&&typeof v.text==='string'&&v.text.length<=300; }
  if(p[0]==='codes'){ if(op==='delete') return false; if(exists(path)) return false; return v&&v.uid===uid; }
  if(p[0]==='users'){
    if(p.length===2) return p[1]===uid;
    const owner=p[1], other=p[3];
    if(p[2]==='invites'){ if(op==='delete') return uid===owner||uid===other; return uid===other; }
    if(p[2]==='requests'){ if(op==='delete') return uid===owner||uid===other; return uid===other; }
    if(p[2]==='friends'){
      if(op==='delete') return uid===owner||uid===other;
      if(op==='update') return uid===owner;
      return uid===owner || (uid===other && exists('users/'+other+'/requests/'+owner));
    }
  }
  return false;
}
function fillSv(v){ if(v&&typeof v==='object'){ if(v['.sv']==='ts') return Date.now(); if(Array.isArray(v)) return v.map(fillSv); const o={}; for(const k in v) o[k]=fillSv(v[k]); return o; } return v; }
function getF(d,f){ return f.split('.').reduce((o,k)=>o==null?undefined:o[k], d); }
module.exports=async function(op,uid,args){
  if(op==='query'){ const q=args[0]; if(!canRead(uid,q.coll+'/x')) throw new Error('denied query'); const n=q.coll.split('/').length+1;
    let list=Object.keys(DB).filter(k=>k.startsWith(q.coll+'/')&&k.split('/').length===n).map(k=>[k,DB[k]]);
    q.parts.forEach(p=>{ if(p.t==='wh'){ list=list.filter(([k,d])=>{ const v=getF(d,p.f); return v!==undefined && (p.op==='>'?v>p.v:p.op==='=='?v===p.v:true); }); }
      if(p.t==='ob'){ list=list.filter(([k,d])=>getF(d,p.f)!==undefined); list.sort((a,b)=>(getF(b[1],p.f)-getF(a[1],p.f))*(p.dir==='desc'?1:-1)); }
      if(p.t==='lim') list=list.slice(0,p.n); });
    return list; }
  if(op==='get'){ const a=args[0]; if(!canRead(uid,a.path)) throw new Error('denied read '+a.path); return DB[a.path]===undefined?null:DB[a.path]; }
  if(op==='list'){ const c=args[0].coll; if(!canRead(uid,c+'/x')) throw new Error('denied list '+c); const n=c.split('/').length+1; return Object.keys(DB).filter(k=>k.startsWith(c+'/')&&k.split('/').length===n).map(k=>[k,DB[k]]); }
  if(op==='write'){
    const pre=Object.assign({},DB);
    for(const w of args){
      const ex=pre[w.path]!==undefined, eff=w.op==='set'&&ex?'update':w.op==='set'?'create':w.op;
      if(w.op==='update'&&!ex) throw new Error('no doc '+w.path);
      if(!canWrite(uid,eff,w.path,w.v,pre)) throw new Error('denied '+eff+' '+w.path+' by '+uid);
    }
    for(const w of args){ if(w.v) w.v=fillSv(w.v); if(w.op==='delete') delete DB[w.path]; else if(w.op==='set'&&!w.merge) DB[w.path]=w.v; else DB[w.path]=Object.assign({},DB[w.path]||{},w.v); }
    return true;
  }
};
module.exports.DB=DB;
