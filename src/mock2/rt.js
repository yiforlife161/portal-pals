const RT={}; let bytes=0, writes=0;
module.exports=async function(op,path,v){ if(op==='set'){ RT[path]=v; writes++; bytes+=JSON.stringify(v).length; return true;} if(op==='remove'){ Object.keys(RT).forEach(k=>{ if(k.startsWith(path)) delete RT[k]; }); return true;} if(op==='get') return RT[path]===undefined?null:RT[path]; };
module.exports.stats=()=>({writes,bytes});
