// Realtime Database mock. RT_LAT / RT_JIT (ms) add network delay and jitter to every write; delivery stays in order, like a real socket.
const RT={}, Q={}, LASTAT={}; let bytes=0, writes=0;
const LAT=+process.env.RT_LAT||0, JIT=+process.env.RT_JIT||0;
module.exports=async function(op,path,v){
  const now=Date.now();
  if(op==='set'){ writes++; bytes+=JSON.stringify(v).length; let at=now+LAT+Math.random()*JIT; at=Math.max(at,LASTAT[path]||0); LASTAT[path]=at; (Q[path]=Q[path]||[]).push({v,at}); return true; }
  if(op==='remove'){ Object.keys(RT).forEach(k=>{ if(k.startsWith(path)) delete RT[k]; }); Object.keys(Q).forEach(k=>{ if(k.startsWith(path)) delete Q[k]; }); return true; }
  if(op==='get'){ const q=Q[path]; if(q){ while(q.length&&q[0].at<=now) RT[path]=q.shift().v; } return RT[path]===undefined?null:RT[path]; }
};
module.exports.stats=()=>({writes,bytes});
