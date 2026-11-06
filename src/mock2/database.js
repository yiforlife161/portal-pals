export function getDatabase(){ return {}; }
export function ref(_db, path){ return { path }; }
export async function set(r, v){ await window.__rt('set', r.path, JSON.parse(JSON.stringify(v))); }
export async function remove(r){ await window.__rt('remove', r.path); }
export function onValue(r, cb){
  let stop = false, last = null;
  const tick = async () => { if (stop) return; try { const v = await window.__rt('get', r.path); const j = JSON.stringify(v); if (j !== last){ last = j; cb({ val: () => v }); } } catch (e) {} setTimeout(tick, 8); };      /* close to a real push socket */
  tick(); return () => { stop = true; };
}
