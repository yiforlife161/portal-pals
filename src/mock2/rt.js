// Realtime Database mock. RT_LAT / RT_JIT (ms) add network delay and jitter to every write; delivery stays in order, like a real socket.
const RT={}, Q={}, LASTAT={}; let bytes=0, writes=0; const BY={}, HF={}; let HN=0; let t0=0, t1=0;
const LAT=+process.env.RT_LAT||0, JIT=+process.env.RT_JIT||0;
module.exports=async function(op,path,v){
  const now=Date.now();
  if(op==='set'){ writes++; const n=JSON.stringify(v).length; bytes+=n; const seg=path.split('/').pop(); BY[seg]=(BY[seg]||0)+n; if(seg==='h'&&v&&typeof v==='object'){ HN++; Object.keys(v).forEach(k=>{ HF[k]=(HF[k]||0)+JSON.stringify(v[k]).length; }); } if(!t0)t0=now; t1=now; let at=now+LAT+Math.random()*JIT; at=Math.max(at,LASTAT[path]||0); LASTAT[path]=at; (Q[path]=Q[path]||[]).push({v,at}); return true; }
  if(op==='remove'){ Object.keys(RT).forEach(k=>{ if(k.startsWith(path)) delete RT[k]; }); Object.keys(Q).forEach(k=>{ if(k.startsWith(path)) delete Q[k]; }); return true; }
  if(op==='get'){ const q=Q[path]; if(q){ while(q.length&&q[0].at<=now) RT[path]=q.shift().v; } return RT[path]===undefined?null:RT[path]; }
};
module.exports.stats=()=>({writes,bytes});
module.exports.rate=()=>{const sec=Math.max(1,(t1-t0)/1000);const o={sec:Math.round(sec)};Object.keys(BY).forEach(k=>o[k+'_Bps']=Math.round(BY[k]/sec));o.hostFieldsPerSnap={};Object.keys(HF).sort((a,b)=>HF[b]-HF[a]).slice(0,8).forEach(k=>o.hostFieldsPerSnap[k]=Math.round(HF[k]/Math.max(1,HN)));return o;};
