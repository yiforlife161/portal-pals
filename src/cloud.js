/* Portal Pals cloud saves: sign in with Google, and your world is kept in Firebase so it follows you to every device.
   Without signing in the game still works and saves in this browser only. */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA7mi9PZ5I5IdWYWJP_EFQlAjc-kzlreqw",
  authDomain: "portal-pals-55ad4.firebaseapp.com",
  projectId: "portal-pals-55ad4",
  storageBucket: "portal-pals-55ad4.firebasestorage.app",
  messagingSenderId: "957787437435",
  appId: "1:957787437435:web:3586c17d63187a143f65de"
};
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
/* Realtime Database (fast updates for Battle Arena co-op). Created in the Firebase console, location Belgium (europe-west1) */
const RTDB_URL = 'https://portal-pals-55ad4-default-rtdb.europe-west1.firebasedatabase.app';
let fbApp = null;
const USER_KEY = 'portalPals.live.user';
const SAVE_KEY = window.PP_SAVE_KEY;
const CHUNK = 700000;
const box = document.getElementById('mm-acct');
let auth = null, db = null, fs = null, au = null, me = null, ready = false, timer = 0, busy = false, lastUp = 0, status = '';

/* device clocks can be minutes apart: times shared between players use the server's clock */
let skew = 0;
function nowS(){ return Date.now() + skew; }
function toMs(v){ return v && typeof v.toMillis === 'function' ? v.toMillis() : typeof v === 'number' ? v : 0; }
function lsGet(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v){ try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function lsDel(k){ try { localStorage.removeItem(k); } catch (e) {} }
function keepLocal(why){ try { if (window.ppBackup) window.ppBackup(lsGet(SAVE_KEY), why); } catch (e) {} }
function localStamp(){ try { const r = lsGet(SAVE_KEY); return r ? (JSON.parse(r).t || 0) : 0; } catch (e) { return 0; } }
function esc(t){ const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

function render(){
  if (!box) return;
  box.hidden = false;
  if (!auth){ box.innerHTML = status ? '<span class="bad">' + esc(status) + '</span><span>Your world is saved in this browser only.</span>' : '<span>Connecting to cloud saves…</span>'; return; }
  if (me){
    box.innerHTML = '<span>Signed in as <b>' + esc(me.displayName || me.email || 'player') + '</b></span>' +
      '<span class="' + (status === 'error' ? 'bad' : 'ok') + '">' + (status === 'error' ? 'Cloud save failed, will retry' : status === 'saving' ? 'Saving to the cloud…' : ready ? 'Cloud save is on' : 'Loading your world…') + '</span>' +
      '<button class="lnk" type="button" id="pp-signout">Sign out</button>';
    document.getElementById('pp-signout').onclick = doSignOut;
  } else {
    box.innerHTML = '<button class="g-btn" type="button" id="pp-signin"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.2 7-17.6z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>Sign in with Google</button>' +
      '<span>Sign in to keep your world in the cloud and play it on any device.</span>' + (status ? '<span class="bad">' + esc(status) + '</span>' : '');
    document.getElementById('pp-signin').onclick = doSignIn;
  }
}

async function doSignIn(){
  status = '';
  const provider = new au.GoogleAuthProvider();
  try { await au.signInWithPopup(auth, provider); }
  catch (e){
    if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')){ try { await au.signInWithRedirect(auth, provider); return; } catch (e2) { e = e2; } }
    if (e && e.code === 'auth/popup-closed-by-user') return;
    status = 'Sign-in failed (' + ((e && e.code) || 'error') + ').'; render();
  }
}
async function doSignOut(){
  await upload(true).catch(() => {});
  lsDel(USER_KEY);
  await au.signOut(auth).catch(() => {});
  location.reload();
}

async function download(uid){
  const meta = await fs.getDoc(fs.doc(db, 'saves', uid));
  if (!meta.exists()) return null;
  const m = meta.data(), parts = [];
  for (let i = 0; i < (m.n || 0); i++){
    const p = await fs.getDoc(fs.doc(db, 'saves', uid, 'parts', 'p' + i));
    parts.push(p.exists() ? p.data().d : '');
  }
  return { t: m.t || 0, data: parts.join('') };
}
/* the cloud's stamp: if another device saved after our last sync, its world is newer and must not be overwritten */
/* every browser tags its own saves, so it never mistakes its own upload for one from another device */
const DEV = (function(){ let d = lsGet('pp.dev'); if (!d){ d = Math.random().toString(36).slice(2, 10); lsSet('pp.dev', d); } return d; })();
async function cloudMeta(){ const m = await fs.getDoc(fs.doc(db, 'saves', me.uid)); return m.exists() ? m.data() : {}; }
async function cloudStamp(){ const d = await cloudMeta(); if (d.dev === DEV && (d.t || 0) > lastUp) lastUp = d.t; return d.dev === DEV ? 0 : (d.t || 0); }
let pulling = false;
async function pullNewer(){
  if (pulling) return true;
  pulling = true;
  try {
    const cloud = await download(me.uid);
    if (!cloud || !cloud.data){ pulling = false; return false; }
    keepLocal('before cloud');      /* this device's world stays in Settings > Backups */
    window.ppNoSave = true; lsSet(SAVE_KEY, cloud.data); lsSet('pp.syncT.' + me.uid, String(cloud.t));
    sessionStorage.setItem('pp.pulled', String(cloud.t));
    G().flash('Loading your newer world from your other device…');
    setTimeout(() => location.reload(), 1200);
    return true;
  } catch (e){ console.warn(e); pulling = false; return false; }
}
async function checkNewer(){
  if (!me || !ready || busy || pulling || paused) return false;
  try { const ct = await cloudStamp(); if (ct > lastUp + 500) return await pullNewer(); } catch (e){}
  return false;
}
async function upload(force){
  if (!me || !ready || busy || pulling || paused) return;
  const raw = lsGet(SAVE_KEY); if (!raw) return;
  const t = localStamp();
  if (!force && t <= lastUp) return;
  busy = true; status = 'saving'; render();
  try {
    const ct = await cloudStamp();
    if (ct > lastUp + 500 && ct !== t){ busy = false; status = ''; render(); await pullNewer(); return; }
    const batch = fs.writeBatch(db), n = Math.max(1, Math.ceil(raw.length / CHUNK));
    for (let i = 0; i < n; i++) batch.set(fs.doc(db, 'saves', me.uid, 'parts', 'p' + i), { d: raw.slice(i * CHUNK, (i + 1) * CHUNK) });
    batch.set(fs.doc(db, 'saves', me.uid), { t: t, n: n, size: raw.length, at: fs.serverTimestamp(), dev: DEV });
    await batch.commit();
    lastUp = t; status = ''; lsSet('pp.syncT.' + me.uid, String(t));
    shareIsland();
  } catch (e){ status = 'error'; console.warn('cloud save failed', e); }
  busy = false; render();
}
function schedule(){ if (!me || !ready) return; clearTimeout(timer); timer = setTimeout(() => upload(false), 12000); }

async function onUser(user){
  me = user;
  if (!user){ if (lsGet(USER_KEY)){ lsDel(USER_KEY); location.reload(); return; } render(); friendsUi(); return; }
  if (lsGet(USER_KEY) !== user.uid){
    /* first time this player signs in on this device: boot again with their own save slot and take the cloud world */
    lsSet('pp.needPull', user.uid);
    if (!lsGet(USER_KEY)) lsSet('pp.guestCarry', '1');
    lsSet(USER_KEY, user.uid); location.reload(); return;
  }
  render();
  try {
    const cloud = await download(user.uid), localT = localStamp(), syncT = +(lsGet('pp.syncT.' + user.uid) || 0);
    if (lsGet('pp.needPull') === user.uid){
      lsDel('pp.needPull');
      const carry = lsGet('pp.guestCarry'); lsDel('pp.guestCarry');
      if (cloud && cloud.data){ keepLocal('before cloud'); window.ppNoSave = true; lsSet(SAVE_KEY, cloud.data); lsSet('pp.syncT.' + user.uid, String(cloud.t)); location.reload(); return; }
      const guest = lsGet('portalPals.live');
      if (carry && guest){ window.ppNoSave = true; lsSet(SAVE_KEY, guest); location.reload(); return; }      /* a world played before signing in moves into the account */
    } else if (cloud && cloud.data && (syncT ? cloud.t !== syncT : cloud.t > localT + 500) && cloud.t !== localT && sessionStorage.getItem('pp.pulled') !== String(cloud.t)){
      sessionStorage.setItem('pp.pulled', String(cloud.t));
      keepLocal('before cloud'); window.ppNoSave = true; lsSet(SAVE_KEY, cloud.data); lsSet('pp.syncT.' + user.uid, String(cloud.t)); location.reload(); return;      /* another device saved since this one last synced */
    }
    ready = true; lastUp = cloud ? cloud.t : 0;
    if (cloud && localStamp() === cloud.t) lsSet('pp.syncT.' + user.uid, String(cloud.t));
    if (!cloud || localStamp() !== cloud.t) await upload(true);
  } catch (e){ status = 'error'; console.warn('cloud load failed', e); ready = true; }
  render();
  friendsStart(user);
}

let paused = false;
try {
  const tabs = new BroadcastChannel('pp-tabs'), myTab = Math.random().toString(36).slice(2);
  tabs.onmessage = ev => {
    const m = ev.data || {};
    if (m.hello && m.id !== myTab && !paused){
      paused = true; window.ppNoSave = true; clearInterval(timer);
      const ov = document.createElement('div'); ov.className = 'fview'; ov.style.zIndex = 20000;
      ov.innerHTML = '<div class="fv-card" style="text-align:center"><h2>Paused</h2><p>Portal Pals was opened again in another tab or window, so this one has stopped saving to keep your world safe.</p><div class="row" style="justify-content:center"><button class="btn primary" type="button" id="pp-here">Play here instead</button></div></div>';
      document.body.appendChild(ov);
      ov.querySelector('#pp-here').onclick = () => location.reload();
    }
  };
  tabs.postMessage({ hello: 1, id: myTab });
} catch (e) {}
(async () => {
  render();
  try {
    const app = await import(SDK + 'firebase-app.js');
    au = await import(SDK + 'firebase-auth.js');
    fs = await import(SDK + 'firebase-firestore.js');
    const fb = app.initializeApp(FIREBASE_CONFIG); fbApp = fb;
    auth = au.getAuth(fb); db = fs.getFirestore(fb);
    au.getRedirectResult(auth).catch(() => {});
    au.onAuthStateChanged(auth, onUser);
    window.addEventListener('pp-saved', schedule);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') upload(false); else checkNewer(); });
    window.addEventListener('pagehide', () => upload(false));
    setInterval(() => upload(false), 60000);
  } catch (e){
    status = 'Cloud saves are not available right now.'; console.warn(e); render();
  }
})();

/* ---------- friends: friend codes, requests and who is online ---------- */
const CODE_ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CH = { sub: {}, last: {}, box: null, with: '', unsub: null, msgs: [], seenK: '' };
const F = { me: null, code: '', name: '', reqs: [], friends: {}, prof: {}, unsub: [], funsub: {}, beat: 0, open: false, sure: '' };
const fbtn = document.createElement('button'), fwin = document.createElement('aside'), fcss = document.createElement('style');
fcss.textContent = `
.fr-badge{display:inline-grid;place-items:center;min-width:17px;height:17px;padding:0 4px;margin-left:5px;border-radius:9px;background:#e0342a;color:#fff;font-size:11px;line-height:1}
#win-f{z-index:6960}
#win-f h2{margin:0;font-size:20px}
.fr-sec{display:grid;gap:8px}
.fr-sec h3{margin:4px 0 0;font-size:14px;opacity:.8;text-transform:uppercase;letter-spacing:.04em}
.fr-code{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.fr-code b{font:800 20px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.06em;padding:8px 10px;border-radius:10px;background:var(--surface-2);border:2px dashed var(--line)}
.fr-row{display:flex;gap:8px;align-items:center}
.fr-row input{flex:1;min-width:0;padding:9px 10px;border-radius:10px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:700 15px/1.2 inherit}
.fr-list{display:grid;gap:6px}
.fr-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:14px;background:var(--surface-2);border:2px solid var(--line)}
.fr-item .fr-ic{position:relative;flex:none;width:34px;height:34px;display:grid;place-items:center}
.fr-dot{position:absolute;right:-2px;bottom:-2px;width:11px;height:11px;border-radius:50%;background:#9a98a8;border:2px solid var(--surface-2)}
.fr-dot.on{background:#3fbf5a}
.fr-who{flex:1;min-width:0;display:grid;gap:1px}
.fr-who b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fr-who small{opacity:.75;font-size:12px}
.fr-empty{opacity:.7;font-size:13px;margin:0}
.fr-x.sure{background:#b8322a;color:#fff}
.fr-lb{justify-self:start;background:#ffd23e!important;color:#3a2600!important;border-color:#c99a10!important}
.lb-tabs{display:flex;flex-wrap:wrap;gap:6px}
.lb-tabs button{border:2px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:99px;padding:5px 11px;font:700 12px/1.2 inherit;cursor:pointer}
.lb-tabs button[aria-pressed="true"]{background:#ffd23e;color:#3a2600;border-color:#ffd23e}
.lb-grp{font-size:12px;opacity:.7;margin:4px 0 0;text-transform:uppercase;letter-spacing:.05em}
.lb-list{display:grid;gap:5px}
.lb-row{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:8px;padding:7px 10px;border-radius:12px;background:rgba(255,255,255,.06)}
.lb-row.me{background:rgba(255,210,62,.18);outline:2px solid #ffd23e}
.lb-row .rk{font-weight:900;text-align:center;color:#ffd23e}
.lb-row .rk.r1{color:#ffd23e;font-size:18px}.lb-row .rk.r2{color:#d8dde8;font-size:17px}.lb-row .rk.r3{color:#e0a060;font-size:16px}
.lb-row b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lb-row small{opacity:.7;display:block;font-size:11px}
.lb-row .vl{font-weight:800;text-align:right}
.lb-mine{font-weight:700;color:#ffd23e;margin:2px 0 0}
.fr-acts{display:flex;flex-direction:column;gap:5px;flex:none}
.fr-acts .btn{min-width:86px}
.fr-ch{background:#7a3fd0!important;color:#fff!important;border-color:#7a3fd0!important}
.fr-chat{background:#2b8fd6!important;color:#fff!important;border-color:#2b8fd6!important}
.fview.chat{place-items:start center}
.chn-stack{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:9000;display:flex;flex-direction:column;gap:8px;width:min(92vw,340px);pointer-events:none}
.chn{pointer-events:auto;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:9px 8px 9px 10px;border-radius:16px;background:var(--surface,#fff);color:var(--ink,#222);border:2px solid #2b8fd6;box-shadow:0 8px 24px rgba(0,0,0,.28);cursor:pointer;font:inherit;text-align:left;animation:chnIn .28s ease-out}
.chn.out{animation:chnOut .25s ease-in forwards}
.chn:hover{border-color:#1a6fb0}
.chn-ic{position:relative;width:36px;height:36px;display:grid;place-items:center;border-radius:50%;background:#e4f1fc}
.chn-ic>i{position:absolute;right:-4px;bottom:-4px;font-style:normal;font-size:14px;line-height:1}
.chn-tx{min-width:0}
.chn-tx b{display:block;font-size:14px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chn-tx span{display:block;font-size:13px;line-height:1.3;opacity:.85;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word}
.chn-tx small{display:block;font-size:11px;font-weight:700;color:#2b8fd6;margin-top:2px}
.chn-x{width:28px;height:28px;border:0;border-radius:50%;background:transparent;color:inherit;font-size:18px;line-height:1;cursor:pointer;opacity:.6}
.chn-x:hover{opacity:1;background:rgba(0,0,0,.08)}
@keyframes chnIn{from{opacity:0;transform:translateY(-14px) scale(.96)}to{opacity:1;transform:none}}
@keyframes chnOut{to{opacity:0;transform:translateY(-10px) scale(.96)}}
@media (prefers-reduced-motion:reduce){.chn,.chn.out{animation:none}}
.ch-card{display:grid;grid-template-rows:auto 1fr auto;gap:8px;width:min(94vw,460px);height:min(86vh,520px);padding:14px;border-radius:20px;background:var(--surface,#fff);color:var(--ink,#222);border:3px solid var(--line,#ccc);box-shadow:0 8px 0 rgba(0,0,0,.25);position:relative}
.ch-card h2{margin:0;font-size:18px;padding-right:36px}
.ch-card h2 small{display:block;font-size:12px;font-weight:600;opacity:.7}
.ch-list{overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:4px 2px;min-height:0}
.ch-m{max-width:80%;padding:7px 11px;border-radius:14px;background:var(--surface-2,#eee);align-self:flex-start;white-space:pre-wrap;word-break:break-word;font-size:15px;line-height:1.3}
.ch-m.me{align-self:flex-end;background:#2b8fd6;color:#fff}
.ch-m small{display:block;font-size:10px;opacity:.65;margin-top:2px}
.ch-row{display:flex;gap:8px}
.ch-row input{flex:1;min-width:0;padding:10px 12px;border-radius:12px;border:2px solid var(--line,#ccc);background:var(--surface,#fff);color:var(--ink,#222);font:600 15px/1.2 inherit}
.ch-empty{opacity:.65;text-align:center;margin:auto;font-size:14px}
.pv-pop{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translateX(-50%);z-index:12500;width:min(92vw,400px);display:grid;gap:10px;padding:14px 16px;border-radius:18px;background:rgba(24,14,48,.96);color:#fff;border:3px solid #b98cff;box-shadow:0 0 28px -6px #b98cff,0 6px 0 rgba(0,0,0,.35);text-align:center}
.pv-pop[hidden]{display:none}
.pv-pop b{font-size:17px}.pv-pop small{opacity:.8}
.pv-pop .row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.pt-list{display:grid;gap:5px}.pt-m{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;border-radius:10px;background:rgba(255,255,255,.07);text-align:left}.pt-m b{font-size:15px}.pt-m span{font-size:13px;font-weight:800;opacity:.85}.pt-m.in span{color:#7affc4}.pt-m.no{opacity:.55}
`;
document.head.appendChild(fcss);
fbtn.className = 'dbtn'; fbtn.type = 'button'; fbtn.id = 'btn-friends'; fbtn.setAttribute('aria-pressed', 'false');
fwin.className = 'win'; fwin.id = 'win-f'; fwin.hidden = true;
function mountFriends(){
  const dock = document.getElementById('dock-r');
  if (!dock || document.getElementById('btn-friends')) return;
  const before = dock.querySelector('[data-panel="help"]');
  dock.insertBefore(fbtn, before);
  document.body.appendChild(fwin);
  fbtn.onclick = () => friendsToggle();
  dock.addEventListener('click', ev => { const b = ev.target.closest('[data-panel],[data-tab],[data-action="menu-open"]'); if (b && b !== fbtn && F.open) friendsToggle(false); });
  friendsUi();
}
if (window.ppGame) mountFriends(); else window.addEventListener('pp-game-ready', mountFriends);
function G(){ return window.ppGame || { profile: () => ({}), palIcon: () => '', elName: () => '', flash: () => {}, closeRight: () => {} }; }
function friendsToggle(v){
  F.open = v === undefined ? !F.open : v;
  if (F.open) G().closeRight();
  fwin.hidden = !F.open; fbtn.setAttribute('aria-pressed', String(F.open));
  if (F.open) friendsUi();
}
function fmtCode(c){ return c ? 'PAL-' + c : ''; }
function cleanCode(t){ return String(t || '').toUpperCase().replace(/^PAL-?/, '').replace(/[^A-Z0-9]/g, ''); }
function online(p){ return p && p.last && Math.abs(nowS() - p.last) < 150000; }
function seen(p){
  if (!p || !p.last) return 'Offline';
  if (online(p)) return 'Online now';
  const m = Math.max(1, Math.round((nowS() - p.last) / 60000));
  return m < 60 ? 'Seen ' + m + ' min ago' : m < 1440 ? 'Seen ' + Math.round(m / 60) + ' h ago' : 'Seen ' + Math.round(m / 1440) + ' days ago';
}
function playedText(ms){ const m = Math.floor(ms / 60000), h = Math.floor(m / 60); return 'Played ' + (h ? h + ' h ' + (m % 60) + ' min' : m + ' min'); }
function palLine(p){
  if (!p || !p.pal) return 'No pal yet';
  return esc(p.pal.name || 'Pal') + ' · ' + esc(G().elName(p.pal.element) || '') + ' · Lv ' + (p.pal.level || 1);
}
function friendsUi(){
  const n = F.reqs.length + chUnreadAll();
  fbtn.innerHTML = 'Friends' + (n ? '<span class="fr-badge">' + n + '</span>' : '');
  if (!F.open) return;
  let h = '<button class="win-x" type="button" id="fr-close" aria-label="Close panel">&times;</button><h2>Friends</h2>' + (me && F.code ? '<button class="btn sm fr-lb" type="button" id="fr-lb">Leaderboards</button>' : '');
  if (!me){
    h += '<p class="fr-empty">Sign in with Google from the main menu to get your friend code and add friends.</p>';
  } else if (!F.code){
    h += '<p class="fr-empty">' + (F.err ? 'Friends are not available right now. Try again later.' : 'Getting your friend code…') + '</p>';
  } else {
    h += '<div class="fr-sec"><h3>Your friend code</h3><div class="fr-code"><b data-notr>' + fmtCode(F.code) + '</b><button class="btn sm" type="button" id="fr-copy">Copy</button></div>' +
      '<small class="fr-empty">Send this code to a friend so they can add you.</small></div>' +
      '<div class="fr-sec"><h3>Your name</h3><div class="fr-row"><input id="fr-name" maxlength="20" value="' + esc(F.name) + '" placeholder="Your name" data-notr><button class="btn sm" type="button" id="fr-savename">Save</button></div></div>' +
      '<div class="fr-sec"><h3>Add a friend</h3><div class="fr-row"><input id="fr-add" maxlength="12" placeholder="PAL-XXXXXX" autocapitalize="characters" autocomplete="off" spellcheck="false"><button class="btn sm primary" type="button" id="fr-send">Send</button></div></div>';
    if (F.reqs.length){
      h += '<div class="fr-sec"><h3>Friend requests</h3><div class="fr-list">' + F.reqs.map(r =>
        '<div class="fr-item"><div class="fr-who"><b data-notr>' + esc(r.name || 'Player') + '</b><small data-notr>' + fmtCode(r.code) + '</small></div>' +
        '<button class="btn sm primary" type="button" data-fr-acc="' + r.id + '">Accept</button><button class="btn sm" type="button" data-fr-dec="' + r.id + '">Decline</button></div>').join('') + '</div></div>';
    }
    const ids = Object.keys(F.friends).sort((a, b) => (online(F.prof[b]) - online(F.prof[a])) || String((F.prof[a] || {}).name || '').localeCompare(String((F.prof[b] || {}).name || '')));
    h += '<div class="fr-sec"><h3>Friends (' + ids.length + ')</h3><div class="fr-list">' + (ids.length ? ids.map(id => {
      const p = F.prof[id] || {}, el = p.pal && p.pal.element;
      return '<div class="fr-item"><div class="fr-ic">' + (el ? G().palIcon(el, 32) : '') + '<i class="fr-dot' + (online(p) ? ' on' : '') + '"></i></div>' +
        '<div class="fr-who"><b data-notr>' + esc(p.name || F.friends[id].name || 'Player') + '</b><small>' + palLine(p) + '</small><small>' + seen(p) + '</small>' + (p.playMs >= 60000 ? '<small>' + playedText(p.playMs) + '</small>' : '') + '</div>' +
        '<div class="fr-acts"><button class="btn sm primary" type="button" data-fr-visit="' + id + '">Visit</button>' +
        (online(p) ? '<button class="btn sm" type="button" data-fr-trade="' + id + '">Trade</button><button class="btn sm" type="button" data-fr-clash="' + id + '">Clash</button>' : '') +
        '<button class="btn sm fr-chat" type="button" data-fr-chat="' + id + '">Chat' + (chUnread(id) ? '<span class="fr-badge">' + chUnread(id) + '</span>' : '') + '</button>' +
        '<button class="btn sm fr-x' + (F.sure === id ? ' sure' : '') + '" type="button" data-fr-rem="' + id + '">' + (F.sure === id ? 'Tap again' : 'Remove') + '</button></div></div>';
    }).join('') : '<p class="fr-empty">No friends yet. Share your code or add a friend\'s code above.</p>') + '</div></div>';
  }
  const keep = document.activeElement && document.activeElement.id, addv = (document.getElementById('fr-add') || {}).value, namev = (document.getElementById('fr-name') || {}).value;
  fwin.innerHTML = h;
  if (addv) document.getElementById('fr-add').value = addv;
  if (namev !== undefined && keep === 'fr-name') document.getElementById('fr-name').value = namev;
  if (keep && document.getElementById(keep)) document.getElementById(keep).focus();
  wire();
}
function wire(){
  const q = id => document.getElementById(id);
  q('fr-close').onclick = () => friendsToggle(false);
  if (q('fr-lb')) q('fr-lb').onclick = () => lbOpen();
  if (q('fr-copy')) q('fr-copy').onclick = async () => {
    try { await navigator.clipboard.writeText(fmtCode(F.code)); G().flash('Friend code copied!'); }
    catch (e) { G().flash('Your friend code is ' + fmtCode(F.code)); }
  };
  if (q('fr-savename')) q('fr-savename').onclick = saveName;
  if (q('fr-name')) q('fr-name').onkeydown = ev => { if (ev.key === 'Enter') saveName(); ev.stopPropagation(); };
  if (q('fr-send')) q('fr-send').onclick = sendReq;
  if (q('fr-add')) q('fr-add').onkeydown = ev => { if (ev.key === 'Enter') sendReq(); ev.stopPropagation(); };
  fwin.querySelectorAll('[data-fr-acc]').forEach(b => b.onclick = () => accept(b.dataset.frAcc));
  fwin.querySelectorAll('[data-fr-dec]').forEach(b => b.onclick = () => decline(b.dataset.frDec));
  fwin.querySelectorAll('[data-fr-rem]').forEach(b => b.onclick = () => removeFriend(b.dataset.frRem));
  fwin.querySelectorAll('[data-fr-visit]').forEach(b => b.onclick = () => visitFriend(b.dataset.frVisit, b));
  fwin.querySelectorAll('[data-fr-chat]').forEach(b => b.onclick = () => chatOpen(b.dataset.frChat));
  fwin.querySelectorAll('[data-fr-trade]').forEach(b => b.onclick = () => { friendsToggle(false); trInvite(b.dataset.frTrade); });
  fwin.querySelectorAll('[data-fr-clash]').forEach(b => b.onclick = () => { friendsToggle(false); clInvite(b.dataset.frClash); });
}
function uref(...p){ return fs.doc(db, 'users', ...p); }
function profileData(){
  const g = G().profile() || {};
  return { name: F.name, code: F.code, last: nowS(), pal: g.pal || null, world: g.world || '', playMs: g.playMs || 0, lb: lbNow() };
}
async function ensureCode(){
  for (let i = 0; i < 6; i++){
    let c = ''; for (let k = 0; k < 6; k++) c += CODE_ABC[Math.floor(Math.random() * CODE_ABC.length)];
    try { await fs.setDoc(fs.doc(db, 'codes', c), { uid: me.uid }); return c; } catch (e) { /* taken, try another */ }
  }
  throw new Error('no code');
}
async function friendsStart(user){
  if (F.me === user.uid) return;
  friendsStop(); F.me = user.uid;
  try {
    const snap = await fs.getDoc(uref(user.uid)), d = snap.exists() ? snap.data() : {};
    F.name = d.name || String(user.displayName || 'Player').split(' ')[0].slice(0, 20);
    F.code = d.code || await ensureCode();
    const t0 = Date.now();
    await fs.setDoc(uref(user.uid), Object.assign(profileData(), { srv: fs.serverTimestamp() }), { merge: true });
    const t1 = Date.now();
    try { const sv = toMs(((await fs.getDoc(uref(user.uid))).data() || {}).srv); if (sv) skew = sv - (t0 + t1) / 2; } catch (e) {}
    if (Math.abs(skew) > 5000) fs.updateDoc(uref(user.uid), { last: nowS() }).catch(() => {});
    shareIsland(true);
  } catch (e){ console.warn('friends setup failed', e); F.err = true; friendsUi(); return; }
  F.unsub.push(fs.onSnapshot(fs.collection(db, 'users', me.uid, 'requests'), qs => {
    F.reqs = []; qs.forEach(x => F.reqs.push(Object.assign({ id: x.id }, x.data())));
    F.reqs.sort((a, b) => (b.at || 0) - (a.at || 0)); friendsUi();
  }, e => console.warn(e)));
  F.unsub.push(fs.onSnapshot(fs.collection(db, 'users', me.uid, 'friends'), qs => {
    const now = {}; qs.forEach(x => { now[x.id] = x.data(); });
    Object.keys(F.funsub).forEach(id => { if (!now[id]){ F.funsub[id](); delete F.funsub[id]; delete F.prof[id]; } });
    Object.keys(CH.sub).forEach(id => { if (!now[id]){ CH.sub[id](); delete CH.sub[id]; delete CH.last[id]; } });
    Object.keys(now).forEach(id => { if (!CH.sub[id]) CH.sub[id] = fs.onSnapshot(fs.doc(db, 'chats', pairId(id)), s3 => chatSummary(id, s3.exists() ? s3.data() : null), () => {}); });
    Object.keys(now).forEach(id => { if (!F.funsub[id]) F.funsub[id] = fs.onSnapshot(uref(id), s2 => { F.prof[id] = s2.exists() ? s2.data() : {}; friendsUi(); }, e => console.warn(e)); });
    F.friends = now; friendsUi();
  }, e => console.warn(e)));
  const beat = () => { if (me){ const g = G().profile() || {}; fs.updateDoc(uref(me.uid), { last: nowS(), pal: g.pal || null, world: g.world || '', playMs: g.playMs || 0, lb: lbNow() }).catch(() => {}); } };
  F.beat = setInterval(beat, 60000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') beat(); });
  setInterval(() => { if (F.open) friendsUi(); }, 30000);      /* keep "seen 3 min ago" fresh */
  F.unsub.push(fs.onSnapshot(fs.collection(db, 'users', me.uid, 'invites'), qs => {
    const list = []; qs.forEach(x => list.push(Object.assign({ id: x.id }, x.data())));
    F.lastInv = list; pvInvites(list);
  }, e => console.warn(e)));
  setInterval(pvWatchdog, 5000);
  setTimeout(trResume, 3000);
  setTimeout(clResume, 3500);
  setTimeout(lkLoad, 1500);
  friendsUi();
}
function friendsStop(){
  F.unsub.forEach(u => u()); F.unsub = [];
  Object.keys(F.funsub).forEach(id => F.funsub[id]()); F.funsub = {};
  Object.keys(CH.sub).forEach(id => CH.sub[id]()); CH.sub = {}; CH.last = {}; chatClose(); Object.keys(CHN.on).forEach(chnGone);
  clearInterval(F.beat); F.me = null; F.code = ''; F.reqs = []; F.friends = {}; F.prof = {};
}
async function saveName(){
  const v = (document.getElementById('fr-name').value || '').trim().slice(0, 20);
  if (!v){ G().flash('Type a name first.'); return; }
  F.name = v;
  try { await fs.updateDoc(uref(me.uid), { name: v }); G().flash('Name saved!'); } catch (e){ G().flash('Could not save your name. Try again.'); }
  friendsUi();
}
async function sendReq(){
  const inp = document.getElementById('fr-add'), c = cleanCode(inp && inp.value);
  if (c.length !== 6){ G().flash('A friend code looks like PAL-XXXXXX.'); return; }
  if (c === F.code){ G().flash('That is your own code!'); return; }
  try {
    const cs = await fs.getDoc(fs.doc(db, 'codes', c));
    if (!cs.exists()){ G().flash('No player has that code. Check it and try again.'); return; }
    const uid = cs.data().uid;
    if (F.friends[uid]){ G().flash('You are already friends!'); return; }
    if (F.reqs.some(r => r.id === uid)){ await accept(uid); return; }      /* they already asked you */
    await fs.setDoc(uref(uid, 'requests', me.uid), { name: F.name, code: F.code, at: nowS() });
    inp.value = ''; G().flash('Friend request sent!');
  } catch (e){ console.warn(e); G().flash('Could not send the request. Try again.'); }
}
async function accept(uid){
  const r = F.reqs.find(x => x.id === uid) || {};
  try {
    const b = fs.writeBatch(db), t = Date.now();
    b.set(uref(me.uid, 'friends', uid), { name: r.name || '', code: r.code || '', since: t });
    b.set(uref(uid, 'friends', me.uid), { name: F.name, code: F.code, since: t });
    b.delete(uref(me.uid, 'requests', uid));
    b.delete(uref(uid, 'requests', me.uid));
    await b.commit();
    G().flash('You are now friends with ' + (r.name || 'them') + '!');
  } catch (e){ console.warn(e); G().flash('Could not accept. Try again.'); }
}
async function decline(uid){ try { await fs.deleteDoc(uref(me.uid, 'requests', uid)); } catch (e){ console.warn(e); } }
async function removeFriend(uid){
  if (F.sure !== uid){ F.sure = uid; friendsUi(); setTimeout(() => { if (F.sure === uid){ F.sure = ''; friendsUi(); } }, 2500); return; }
  F.sure = '';
  try { const b = fs.writeBatch(db); b.delete(uref(me.uid, 'friends', uid)); b.delete(uref(uid, 'friends', me.uid)); await b.commit(); G().flash('Friend removed.'); }
  catch (e){ console.warn(e); G().flash('Could not remove. Try again.'); }
}

/* ---------- island visits: friends can read a copy of your islands ---------- */
let lastShare = '';
async function shareIsland(force){
  if (!me || !db || !window.ppGame || !window.ppGame.shareIsland) return;
  if (window.ppGame.visiting()) return;      /* never publish a friend's island as your own */
  let d = '';
  try { d = JSON.stringify(window.ppGame.shareIsland()); } catch (e){ return; }
  if (!force && d === lastShare) return;
  try { await fs.setDoc(fs.doc(db, 'islands', me.uid), { t: Date.now(), d: d, name: F.name }); lastShare = d; }
  catch (e){ console.warn('island share failed', e); }
}
async function visitFriend(id, btn){
  const p = F.prof[id] || {}, name = p.name || (F.friends[id] || {}).name || 'Friend';
  if (btn){ btn.disabled = true; btn.textContent = 'Flying…'; }
  try {
    const s2 = await fs.getDoc(fs.doc(db, 'islands', id));
    if (!s2.exists() || !s2.data().d){ G().flash(name + ' has not shared their island yet. They need to open the game once.'); friendsUi(); return; }
    await upload(false).catch(() => {});
    if (G().visit(JSON.parse(s2.data().d), name)) friendsToggle(false);
    else friendsUi();
  } catch (e){ console.warn(e); G().flash('Could not reach that island. Try again.'); friendsUi(); }
}

/* ---------- Starstones with friends: one match document per pair of friends ---------- */
const PV = { mid: '', other: '', otherName: '', role: '', unsub: null, started: false, moves: [], last: 0, inv: null, waitT: 0, ended: false };
const pvBox = document.createElement('div'); pvBox.className = 'pv-pop'; pvBox.hidden = true; document.body.appendChild(pvBox);
function pairId(o){ return [me.uid, o].sort().join('_'); }
function mref(mid){ return fs.doc(db, 'matches', mid); }
function pvShow(html){ pvBox.innerHTML = html; pvBox.hidden = !html; }
function friendName(id){ const p = F.prof[id] || {}; return p.name || (F.friends[id] || {}).name || 'Friend'; }
async function challenge(fid){
  if (!me || !fid) return;
  if (G().hasBuilding && !G().hasBuilding('stonetable')){ G().flash('Build a Starstone Table on your island to challenge friends.'); return; }
  if (G().busy && G().busy()){ G().flash('Finish your game first.'); return; }
  const deck = (G().ssDeck && G().ssDeck()) || [];
  if (deck.length !== 5){ G().flash('Put 5 stones in your Starstones deck first.'); return; }
  if (PV.mid && PV.started && !PV.ended){ G().flash('You are already in a match.'); return; }
  const mid = pairId(fid), name = friendName(fid);
  try {
    const old = await fs.getDoc(mref(mid)), n = old.exists() ? (old.data().n || 0) : 0;
    await fs.setDoc(mref(mid), { game: 'stones', a: me.uid, b: fid, nameA: F.name, nameB: name, st: 'invite', n: n, deckA: deck, deckB: [], first: '', moves: [], winner: '', why: '', at: nowS(), turnAt: 0 });
    await fs.setDoc(uref(fid, 'invites', me.uid), { mid: mid, name: F.name, at: nowS() });
  } catch (e){ console.warn(e); G().flash('Could not send the challenge. Try again.'); return; }
  friendsToggle(false);
  pvWatch(mid, fid, name, 'a');
  PV.waitT = Date.now();
  pvShow('<b>Waiting for <span data-notr>' + esc(name) + '</span>…</b><small>They have 60 seconds to accept your Starstones challenge.</small><div class="row"><button class="btn sm" type="button" id="pv-cancel">Cancel</button></div>');
  document.getElementById('pv-cancel').onclick = () => pvCancel();
}
async function pvCancel(){
  const mid = PV.mid, other = PV.other;
  pvStop(); pvShow('');
  try { await fs.updateDoc(mref(mid), { st: 'cancel' }); await fs.deleteDoc(uref(other, 'invites', me.uid)); } catch (e){}
}
const invDone = {};
function pvInvites(list){
  const now = nowS(), fresh = list.filter(x => !invDone[x.id + ':' + x.at] && now - (x.at || 0) < 65000).sort((a, b) => b.at - a.at);
  list.filter(x => now - (x.at || 0) >= 65000).forEach(x => fs.deleteDoc(uref(me.uid, 'invites', x.id)).catch(() => {}));
  const inv = fresh[0];
  if (!inv){ if (PV.inv){ PV.inv = null; if (!PV.mid) pvShow(''); } return; }
  if (PV.inv && PV.inv.id === inv.id && PV.inv.at === inv.at) return;
  if ((PV.mid && PV.started && !PV.ended) || (CO.key && G().coopRole()) || (PT.on && !PT.started) || (TR.mid && inv.game === 'trade') || (CL.mid && inv.game === 'clash')) return;      /* already playing or waiting in a co-op lobby (a finished co-op game does not count) */
  PV.inv = inv;
  const AM = { classic: 'Classic', fire: 'Fire Pit', blades: 'Blade Ring' };
  if (inv.game === 'clash') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> challenges you to Element Clash!</b><small>You both stake up to 5 cards. Winner takes all.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'trade') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> wants to trade cards!</b><small>You both pick cards to give, then both press Ready to swap.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'cannon') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to the Sky Cannon!</b><small>' + (inv.lv === 4 ? 'Co-op survival · endless waves.' : 'Co-op · Level ' + (inv.lv || 1) + '.') + ' Everyone gets their own cannon.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'quest') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to an Island Quest!</b><small>' + (inv.lv === 4 ? 'Co-op survival · level after level, stop when you like.' : 'Co-op · Level ' + (inv.lv || 1) + '. Carry keys and bombs, open the chests, reach the flag together.') + '</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'td') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to Pal Towers!</b><small>' + (inv.lv === 4 ? 'Co-op survival · endless waves.' : 'Co-op · Level ' + (inv.lv || 1) + '.') + ' You bring the 4 pals of your Pal Towers team.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Join</button><button class="btn sm" type="button" id="pv-dec">No thanks</button></div>');
  else if (inv.game === 'arena' && inv.md === 'chef') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to the Elemental Kitchen!</b><small>' + (inv.lv === 4 ? 'Co-op survival · kitchen after kitchen, stop when you like.' : 'Co-op · Level ' + (inv.lv || 1) + '. Chop, cook and serve the orders together.') + '</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'sg'){
    const I = (G().sgInfo && G().sgInfo(inv.am)) || { name: 'a skill challenge', skill: 'that skill', el: 'the right', lv: 50 };
    pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to ' + esc(I.name) + '!</b><small><span>' + (inv.lv === 4 ? 'Co-op · Survival, endless waves.' : 'Co-op · 3 waves.') + '</span> <span>Needs ' + esc(I.skill) + ' level ' + I.lv + ' and a pal of the ' + esc(I.el) + ' element.</span> <span>You earn ' + esc(I.skill) + ' xp.</span></small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  }
  else if (inv.game === 'arena' && inv.md === 'skill') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to skill together!</b><small>Join their skilling islands. You share the trees and rocks, and you keep everything you gather.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'dig') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to a Treasure Hunt!</b><small>' + (inv.lv === 4 ? 'Co-op survival · island after island, stop when you like.' : 'Co-op · more X marks, your own digs each.') + '</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'raid') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to a Boss Raid!</b><small>Co-op · ' + (inv.lv === 4 ? 'Survival' : 'Level ' + (inv.lv || 1)) + '. Everyone gets the full gold and xp.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena' && inv.md === 'defense') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to the Guard Post!</b><small>Co-op · ' + (inv.lv === 4 ? 'Survival' : 'Level ' + (inv.lv || 1)) + '. Everyone gets the full gold and xp.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else if (inv.game === 'arena') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to the Battle Arena!</b><small>Co-op · ' + (AM[inv.am] || 'Classic') + ' · ' + (inv.lv === 4 ? 'Survival' : 'Level ' + (inv.lv || 1)) + '. Everyone gets the full gold and xp.</small>' +
    '<div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  else pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> challenges you to Starstones!</b><small>Winner gets a small gold prize.</small><div class="row"><button class="btn sm primary" type="button" id="pv-acc">Accept</button><button class="btn sm" type="button" id="pv-dec">Decline</button></div>');
  document.getElementById('pv-acc').onclick = () => pvAccept(inv);
  document.getElementById('pv-dec').onclick = () => pvDecline(inv);
}
async function pvDecline(inv){
  invDone[inv.id + ':' + inv.at] = 1;
  PV.inv = null; pvShow('');
  try { await fs.updateDoc(mref(inv.mid), { st: 'declined' }); } catch (e){}
  fs.deleteDoc(uref(me.uid, 'invites', inv.id)).catch(() => {});
}
async function pvAccept(inv){
  if (inv.game === 'trade') return trAccept(inv);
  if (inv.game === 'clash') return clAccept(inv);
  if (G().busy && G().busy() && !(inv.game === 'arena' && G().arenaOpen && G().arenaOpen())){ G().flash('Finish your game first.'); return; }
  if (inv.game === 'arena' && inv.md === 'sg'){      /* skill challenges: only with the skill at level 50 and a pal of its element (switch pals and accept again) */
    const why = G().sgCanJoin ? G().sgCanJoin(inv.am) : 'Reload the game to play this.';
    if (why){ G().flash(why); return; }
  }
  invDone[inv.id + ':' + inv.at] = 1;
  if (inv.game === 'arena') return coopAccept(inv);
  const deck = (G().ssDeck && G().ssDeck()) || [];
  if (deck.length !== 5){ G().flash('Put 5 stones in your Starstones deck first.'); return; }
  PV.inv = null; pvShow('');
  try {
    const s2 = await fs.getDoc(mref(inv.mid)), m = s2.exists() ? s2.data() : null;
    fs.deleteDoc(uref(me.uid, 'invites', inv.id)).catch(() => {});
    if (!m || m.st !== 'invite' || m.a !== inv.id){ G().flash('That challenge is no longer open.'); return; }
    const n = (m.n || 0) + 1, pair = inv.mid.split('_');
    pvWatch(inv.mid, inv.id, inv.name || m.nameA || 'Friend', 'b');
    await fs.updateDoc(mref(inv.mid), { st: 'play', deckB: deck, n: n, first: pair[n % 2], moves: [], turnAt: Date.now(), nameB: F.name });      /* who starts swaps every match */
  } catch (e){ console.warn(e); G().flash('Could not start the match. Try again.'); pvStop(); }
}
function pvStop(){ if (PV.unsub) PV.unsub(); Object.assign(PV, { mid: '', other: '', role: '', unsub: null, started: false, moves: [], ended: false }); }
function pvWatch(mid, other, name, role){
  pvStop();
  Object.assign(PV, { mid: mid, other: other, otherName: name, role: role, last: Date.now(), gen: (PV.gen || 0) + 1 });
  PV.unsub = fs.onSnapshot(mref(mid), snap => {
    if (!snap.exists() || PV.mid !== mid) return;
    const m = snap.data();
    if (m.st === 'declined' && role === 'a' && !PV.started){ pvShow(''); G().flash(name + ' said no this time.'); pvStop(); return; }
    if (m.st === 'cancel' && !PV.started){ pvShow(''); pvStop(); return; }
    if (m.st === 'play' && !PV.started && m.game === 'arena'){
      PV.started = true; PV.last = Date.now(); pvShow('');
      coopLink(mid + '_' + (m.n || 0), role === 'a' ? 'host' : 'guest', name, role === 'a' ? m.charB : m.charA, m.lv, m.am, m.md);
      return;
    }
    if (m.game === 'arena') return;
    if (m.st === 'play' && !PV.started){
      PV.started = true; PV.moves = []; PV.last = Date.now(); pvShow('');
      const mine = role === 'a' ? m.deckA : m.deckB, theirs = role === 'a' ? m.deckB : m.deckA;
      const ok = G().pvpStart({ uid: other, name: name, myDeck: mine, oppDeck: theirs, iFirst: m.first === me.uid });
      if (!ok){ fs.updateDoc(mref(mid), { st: 'done', winner: other, why: 'left' }).catch(() => {}); PV.ended = true; return; }
    }
    if (!PV.started) return;
    const mv = Array.isArray(m.moves) ? m.moves : [];
    if (mv.length > PV.moves.length){
      const fresh = mv.slice(PV.moves.length);
      PV.moves = mv.slice(); PV.last = Date.now();
      fresh.forEach(x => { if (x.by !== me.uid) G().pvpMove(x); });
    }
    if (m.st === 'done' && !PV.ended){
      PV.ended = true;
      if (m.winner === me.uid && m.why !== 'board' && G().pvpActive()) G().pvpForfeit();
    }
  }, e => console.warn(e));
}
/* if your friend stops answering (closed the game, lost connection) you win after a while */
function pvWatchdog(){
  ptWatchdog(); trWatchdog(); clWatchdog();
  if (!PV.mid){ if (PV.inv && nowS() - PV.inv.at > 65000){ PV.inv = null; pvShow(''); } return; }
  if (!PV.started){ if (PV.role === 'a' && Date.now() - PV.waitT > 60000){ const nm = PV.otherName; pvCancel(); G().flash(nm + ' did not answer.'); } return; }
  if (PV.ended || !G().pvpActive()) return;
  if (!G().pvpMyTurn() && Date.now() - PV.last > 75000){
    fs.updateDoc(mref(PV.mid), { st: 'done', winner: me.uid, why: 'left' }).catch(() => {});
    PV.ended = true; G().pvpForfeit();
  }
}
window.ppPvp = {
  send(m){
    if (!PV.mid || !PV.started) return;
    const mv = PV.moves.concat([{ by: me.uid, c: m.c, h: m.h, t: Date.now() }]);
    PV.moves = mv; PV.last = Date.now();
    fs.updateDoc(mref(PV.mid), { moves: mv, turnAt: Date.now() }).catch(e => console.warn(e));
  },
  resign(){ if (PV.mid && PV.started && !PV.ended){ PV.ended = true; fs.updateDoc(mref(PV.mid), { st: 'done', winner: PV.other, why: 'resign' }).catch(() => {}); } },
  done(result, why){
    if (!PV.mid) return;
    if (why === 'board' && !PV.ended && PV.role === 'a') fs.updateDoc(mref(PV.mid), { st: 'done', winner: result === 'me' ? me.uid : result === 'them' ? PV.other : 'draw', why: 'board' }).catch(() => {});
    PV.ended = true;
  },
  rematch(uid){ challenge(uid || PV.other); },
  challenge(uid){ challenge(uid); }
};


/* ---------- card trades: one match document per pair (game 'trade'), both players edit their own offer.
   An offer change clears both Ready marks; each Ready mark is the exact pair of offers it agreed to, so the swap
   only happens when both marks match the current offers. Each side then swaps its own cards once (td in the save). ---------- */
const TR_PV = 2;      /* trade protocol version: both players need the same one */
const TR = { mid: '', other: '', name: '', role: '', n: 0, tid: '', unsub: null, st: '', my: [], their: [], vMe: 0, okMe: '', okThem: '', key: '', applied: false, waitT: 0, lastThem: 0, hbSeen: 0, uiKey: '' };
/* every change to an offer raises that side's number (vA / vB); Ready means "I agree to offers vA and vB",
   so the Ready mark is a short text like "3:5" that can't come out different on two phones */
function trKey(d){ return (+d.vA || 0) + ':' + (+d.vB || 0); }
function trList(a){ return (Array.isArray(a) ? a : []).filter(x => x && Number.isFinite(+x.k) && +x.n > 0).slice(0, 20).map(x => ({ k: +x.k, n: Math.min(999, +x.n) })); }
function trUi(force){
  const T = { st: TR.st, name: TR.name, mine: TR.my, theirs: TR.their, meOk: !!TR.okMe && TR.okMe === TR.key, themOk: !!TR.okThem && TR.okThem === TR.key };
  const key = JSON.stringify(T);
  if (!force && key === TR.uiKey) return;
  TR.uiKey = key;
  if (G().kdTradeUi) G().kdTradeUi(T);
}
function trStop(){ if (TR.unsub) TR.unsub(); TR.unsub = null; TR.mid = ''; TR.st = ''; }
function trEnd(msg){ trStop(); if (G().kdTradeUi) G().kdTradeUi({ st: 'closed', msg: msg || '' }); }
function trId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
async function trInvite(fid){
  if (!me || !fid) return;
  if (G().visiting && G().visiting()){ G().flash('Go back to your own world to trade cards.'); return; }
  if (TR.mid){ G().flash('You are already trading.'); return; }
  const mid = pairId(fid), name = friendName(fid);
  if (PT.on && !PT.started && PT.mem.some(m => m.uid === fid)){ G().flash('Finish the game invite with ' + name + ' first.'); return; }
  try {
    const old = await fs.getDoc(mref(mid)), n = (old.exists() ? (old.data().n || 0) : 0) + 1, tid = trId();
    Object.assign(TR, { mid: mid, other: fid, name: name, role: 'a', n: n, tid: tid, st: 'wait', my: [], their: [], vMe: 0, okMe: '', okThem: '', key: '0:0', applied: false, waitT: Date.now(), lastThem: Date.now(), uiKey: '' });
    await fs.setDoc(mref(mid), { game: 'trade', pv: TR_PV, tid: tid, a: me.uid, b: fid, nameA: F.name || 'Friend', nameB: name, st: 'invite', n: n, offA: [], offB: [], vA: 0, vB: 0, okA: '', okB: '', hbA: nowS(), hbB: 0, at: nowS() });
    await fs.setDoc(uref(fid, 'invites', me.uid), { mid: mid, name: F.name || 'Friend', at: nowS(), game: 'trade', pv: TR_PV });
    trWatch();
    trUi(true);
  } catch (e){ console.warn(e); trStop(); G().flash('Could not send the trade invite. Try again.'); }
}
async function trAccept(inv){
  invDone[inv.id + ':' + inv.at] = 1;
  PV.inv = null; pvShow('');
  fs.deleteDoc(uref(me.uid, 'invites', inv.id)).catch(() => {});
  if (G().visiting && G().visiting()){ G().flash('Go back to your own world to trade cards.'); fs.updateDoc(mref(inv.mid), { st: 'declined' }).catch(() => {}); return; }
  if (TR.mid) trCancel();
  try {
    const s2 = await fs.getDoc(mref(inv.mid)), m = s2.exists() ? s2.data() : null;
    if (!m || m.game !== 'trade' || m.st !== 'invite' || m.a !== inv.id){ G().flash('That trade is no longer open.'); return; }
    if (m.pv !== TR_PV){ G().flash((inv.name || 'Your friend') + ' has an older version of the game open. Ask them to reload it, then trade again.'); fs.updateDoc(mref(inv.mid), { st: 'cancel', by: me.uid, why: 'version' }).catch(() => {}); return; }
    Object.assign(TR, { mid: inv.mid, other: inv.id, name: inv.name || m.nameA || 'Friend', role: 'b', n: m.n || 0, tid: m.tid || '', st: 'open', my: [], their: [], vMe: 0, okMe: '', okThem: '', key: trKey(m), applied: false, waitT: Date.now(), lastThem: Date.now(), uiKey: '' });
    await fs.updateDoc(mref(inv.mid), { st: 'open', nameB: F.name || 'Friend', hbB: nowS() });
    trWatch();
    trUi(true);
  } catch (e){ console.warn(e); trStop(); G().flash('Could not join the trade. Try again.'); }
}
function trWatch(){
  const mid = TR.mid, n = TR.n, A = TR.role === 'a';
  if (TR.unsub) TR.unsub();
  TR.unsub = fs.onSnapshot(mref(mid), { includeMetadataChanges: true }, snap => {
    if (TR.mid !== mid || TR.n !== n) return;
    const pend = !!(snap.metadata && snap.metadata.hasPendingWrites);      /* our own write not on the server yet */
    const d = snap.exists() ? snap.data() : null;
    if (!d || d.game !== 'trade' || d.n !== n){ if (!TR.applied) trEnd('The trade was called off.'); return; }
    if (d.pv !== TR_PV){ trEnd(TR.name + ' has an older version of the game open. Ask them to reload it, then trade again.'); return; }
    TR.tid = d.tid || TR.tid;
    TR.my = trList(A ? d.offA : d.offB); TR.their = trList(A ? d.offB : d.offA);
    TR.vMe = +(A ? d.vA : d.vB) || 0;
    TR.okMe = (A ? d.okA : d.okB) || ''; TR.okThem = (A ? d.okB : d.okA) || ''; TR.key = trKey(d);
    const hb = A ? d.hbB : d.hbA;
    if (hb && hb !== TR.hbSeen){ TR.hbSeen = hb; TR.lastThem = Date.now(); }
    if (d.st === 'declined'){ trEnd(TR.name + ' said no this time.'); return; }
    if (d.st === 'cancel'){ trEnd(d.by === me.uid ? '' : d.why === 'version' ? TR.name + ' has a different version of the game open. Both of you reload the game, then trade again.' : TR.name + ' called off the trade.'); return; }
    if (d.st === 'open' && TR.st === 'wait'){ TR.st = 'open'; TR.lastThem = Date.now(); }
    const agreed = !!d.okA && d.okA === d.okB && d.okA === TR.key;
    if (!pend && agreed && (d.st === 'open' || d.st === 'done')){ trApply(d); return; }      /* swap only once the server has both Ready marks */
    if (d.st === 'done' && !agreed && !pend){ trEnd('The trade ended without a swap. Nothing was traded.'); return; }
    trUi();
  }, e => console.warn(e));
}
function trApply(d){
  if (TR.applied) return;
  TR.applied = true;
  const A = TR.role === 'a', give = trList(A ? d.offA : d.offB), get = trList(A ? d.offB : d.offA), name = TR.name, mid = TR.mid;
  const ok = G().kdTradeApply ? G().kdTradeApply(give, get, 't' + (d.tid || (mid + ':' + TR.n))) : false;
  fs.updateDoc(mref(mid), { st: 'done' }).catch(() => {});
  trStop();
  if (ok){ if (G().kdTradeUi) G().kdTradeUi({ st: 'done', name: name, mine: give, theirs: get }); }
  else if (G().kdTradeUi) G().kdTradeUi({ st: 'closed', msg: 'This trade was already done earlier, so nothing changed.' });
}
function trCancel(){
  const mid = TR.mid, other = TR.other, applied = TR.applied, st = TR.st;
  trStop();
  if (G().kdPend) G().kdPend(null);
  if (mid && !applied){
    fs.updateDoc(mref(mid), { st: 'cancel', by: me.uid }).catch(() => {});
    if (st === 'wait') fs.deleteDoc(uref(other, 'invites', me.uid)).catch(() => {});
  }
  if (G().kdTradeUi) G().kdTradeUi({ st: 'closed', msg: '' });
}
function trOffer(list){
  if (!TR.mid || TR.st !== 'open') return;
  const A = TR.role === 'a', clean = trList(list), v = TR.vMe + 1, up = { okA: '', okB: '' };
  up[A ? 'offA' : 'offB'] = clean; up[A ? 'vA' : 'vB'] = v;
  TR.my = clean; TR.vMe = v; TR.okMe = ''; TR.okThem = '';
  if (G().kdPend) G().kdPend(null);
  fs.updateDoc(mref(TR.mid), up).catch(e => console.warn(e));
}
function trReady(on){
  if (!TR.mid || TR.st !== 'open') return;
  if (on && !TR.my.length && !TR.their.length){ G().flash('Add some cards first.'); return; }
  if (on && G().kdCanGive && !G().kdCanGive(TR.my)){ G().flash('You no longer have all the cards you offered.'); return; }
  const A = TR.role === 'a', up = {};
  up[A ? 'okA' : 'okB'] = on ? TR.key : '';
  TR.okMe = on ? TR.key : '';
  /* remember the Ready in the save: if the game closes before the swap, it finishes the next time you sign in */
  if (G().kdPend) G().kdPend(on ? { mid: TR.mid, n: TR.n, role: TR.role, sig: TR.key, tid: TR.tid } : null);
  fs.updateDoc(mref(TR.mid), up).catch(e => console.warn(e));
  trUi(true);
}
/* a trade you said Ready to while the game closed: finish it if your friend also said Ready to the same offers */
async function trResume(){
  const p = G().kdPendGet && G().kdPendGet();
  if (!p || !me) return;
  try {
    const s2 = await fs.getDoc(mref(p.mid)), d = s2.exists() ? s2.data() : null;
    if (d && d.game === 'trade' && d.pv === TR_PV && d.n === p.n && (!p.tid || d.tid === p.tid) && d.okA && d.okA === d.okB && d.okA === trKey(d) && d.okA === p.sig){
      const A = p.role === 'a', give = trList(A ? d.offA : d.offB), get = trList(A ? d.offB : d.offA);
      if (G().kdTradeApply && G().kdTradeApply(give, get, 't' + (d.tid || (p.mid + ':' + p.n)))){
        fs.updateDoc(mref(p.mid), { st: 'done' }).catch(() => {});
        if (G().kdTradeUi) G().kdTradeUi({ st: 'done', name: A ? (d.nameB || 'Friend') : (d.nameA || 'Friend'), mine: give, theirs: get });
      }
    } else if (!d || d.n !== p.n || d.st === 'cancel' || d.st === 'done' || d.game !== 'trade') G().kdPend(null);
  } catch (e){ console.warn(e); }
}
function trWatchdog(){
  if (!TR.mid) return;
  const A = TR.role === 'a';
  if (Date.now() - (TR.hbT || 0) > 8000){ TR.hbT = Date.now(); const up = {}; up[A ? 'hbA' : 'hbB'] = nowS(); fs.updateDoc(mref(TR.mid), up).catch(() => {}); }
  if (TR.st === 'wait' && Date.now() - TR.waitT > 60000){ const nm = TR.name; trCancel(); G().flash(nm + ' did not answer.'); return; }
  if (TR.st === 'open' && Date.now() - TR.lastThem > 45000){ const nm = TR.name; trCancel(); G().flash(nm + ' left the trade.'); }
}
/* ---------- player-made looks: each shared look is one doc codes/L_<id> (anyone signed in can read the codes collection, and a
   player can only create docs with their own uid; docs there can't be changed or deleted). Removing a look writes a second doc
   codes/X_<id> by the same player; looks with one are hidden. Loaded once at sign-in, so new looks appear after a reload. ---------- */
const LK_RE = /^u_[a-z0-9]{8,24}$/;
function lkFromDoc(d){ if (!d || d.kind !== 'look' || !LK_RE.test(d.id || '')) return null; return { id: d.id, name: d.name, el: d.el, style: d.style, giant: !!d.giant, by: d.by || '', uid: d.uid || '', t: d.t || 0, p: d.p || {}, b: d.b || null }; }
async function lkLoad(){
  if (!me) return;
  try {
    const off = {}, list = [];
    const qo = await fs.getDocs(fs.query(fs.collection(db, 'codes'), fs.where('kind', '==', 'lookoff'), fs.limit(400)));
    qo.forEach(x => { const d = x.data(); if (d && d.look) off[d.look + '|' + d.uid] = 1; });
    const ql = await fs.getDocs(fs.query(fs.collection(db, 'codes'), fs.where('kind', '==', 'look'), fs.limit(120)));
    ql.forEach(x => { const L = lkFromDoc(x.data()); if (L && !off[L.id + '|' + L.uid]) list.push(L); });
    list.sort((a, b) => a.t - b.t);
    if (G().lookSync) G().lookSync(list);
  } catch (e){ console.warn('looks', e); }
}
window.ppLooks = {
  ready: () => !!me,
  uid: () => (me ? me.uid : ''),
  name: () => F.name || 'Friend',
  share: async L => {
    if (!me) throw new Error('signed out');
    const P = {}; ['body', 'front', 'armB', 'legL', 'legR', 'back'].forEach(k => { if (L.p && L.p[k]) P[k] = L.p[k]; });
    const doc = { kind: 'look', uid: me.uid, id: L.id, name: String(L.name || '').slice(0, 20), el: L.el, style: L.style, giant: !!L.giant, by: F.name || 'Friend', t: Date.now(), p: P };
    if (L.b) doc.b = L.b;      /* a Pal Builder look: just the part choices and colours */
    await fs.setDoc(fs.doc(db, 'codes', 'L_' + L.id), doc);
  },
  retire: async id => { if (me) await fs.setDoc(fs.doc(db, 'codes', 'X_' + id), { kind: 'lookoff', uid: me.uid, look: id }); },
  get: async id => {
    if (!me || !LK_RE.test(id)) return null;
    const off = await fs.getDoc(fs.doc(db, 'codes', 'X_' + id)).catch(() => null);
    const sn = await fs.getDoc(fs.doc(db, 'codes', 'L_' + id));
    const L = sn.exists() ? lkFromDoc(sn.data()) : null;
    if (L && off && off.exists() && off.data().uid === L.uid) return null;
    return L;
  }
};

/* ---------- Element Clash (PvP, cards at stake): one match document per pair (game 'clash').
   cloud.js only moves data: the game (portal-pals-play.html, clash module) runs the rules, checks the stakes, holds the
   staked cards and settles. Each side writes only its own fields (stA/vA/okA, cA/rA, hbA for player a; ...B for b), plus
   st/winner/why/pA/pB when a phase ends. The game gets every server snapshot through G().clashSync. ---------- */
const CL_PV = 1;
const CL = { mid: '', other: '', name: '', role: '', n: 0, cid: '', unsub: null, waitT: 0, lastThem: 0, hbSeen: 0, hbT: 0 };
function clStop(){ if (CL.unsub) CL.unsub(); CL.unsub = null; CL.mid = ''; }
async function clInvite(fid){
  if (!me || !fid) return;
  if (G().visiting && G().visiting()){ G().flash('Go back to your own world to play Element Clash.'); return; }
  if (CL.mid){ G().flash('You are already in an Element Clash.'); return; }
  if (G().clashBusy && G().clashBusy()){ G().flash('Finish your Element Clash first.'); return; }
  if (TR.mid){ G().flash('Finish your trade first.'); return; }
  const mid = pairId(fid), name = friendName(fid);
  try {
    const old = await fs.getDoc(mref(mid)), n = (old.exists() ? (old.data().n || 0) : 0) + 1, cid = trId();
    Object.assign(CL, { mid: mid, other: fid, name: name, role: 'a', n: n, cid: cid, waitT: Date.now(), lastThem: Date.now(), hbSeen: 0 });
    await fs.setDoc(mref(mid), { game: 'clash', pv: CL_PV, cid: cid, a: me.uid, b: fid, nameA: F.name || 'Friend', nameB: name, st: 'invite', n: n,
      stA: [], stB: [], vA: 0, vB: 0, okA: '', okB: '', pA: [], pB: [], cA: [], cB: [], rA: [], rB: [], winner: '', why: '', hbA: nowS(), hbB: 0, at: nowS() });
    await fs.setDoc(uref(fid, 'invites', me.uid), { mid: mid, name: F.name || 'Friend', at: nowS(), game: 'clash', pv: CL_PV });
    clWatch();
  } catch (e){ console.warn(e); clStop(); G().flash('Could not send the challenge. Try again.'); }
}
async function clAccept(inv){
  invDone[inv.id + ':' + inv.at] = 1;
  PV.inv = null; pvShow('');
  fs.deleteDoc(uref(me.uid, 'invites', inv.id)).catch(() => {});
  if ((G().visiting && G().visiting()) || CL.mid || (G().clashBusy && G().clashBusy())){ G().flash(CL.mid ? 'You are already in an Element Clash.' : 'Go back to your own world to play Element Clash.'); fs.updateDoc(mref(inv.mid), { st: 'declined' }).catch(() => {}); return; }
  try {
    const s2 = await fs.getDoc(mref(inv.mid)), m = s2.exists() ? s2.data() : null;
    if (!m || m.game !== 'clash' || m.st !== 'invite' || m.a !== inv.id){ G().flash('That challenge is no longer open.'); return; }
    if (m.pv !== CL_PV){ G().flash((inv.name || 'Your friend') + ' has a different version of the game open. Both of you reload the game, then try again.'); fs.updateDoc(mref(inv.mid), { st: 'cancel', by: me.uid }).catch(() => {}); return; }
    Object.assign(CL, { mid: inv.mid, other: inv.id, name: inv.name || m.nameA || 'Friend', role: 'b', n: m.n || 0, cid: m.cid || '', waitT: Date.now(), lastThem: Date.now(), hbSeen: 0 });
    await fs.updateDoc(mref(inv.mid), { st: 'open', nameB: F.name || 'Friend', hbB: nowS() });
    clWatch();
  } catch (e){ console.warn(e); clStop(); G().flash('Could not join. Try again.'); }
}
function clWatch(){
  const mid = CL.mid, n = CL.n, A = CL.role === 'a';
  if (CL.unsub) CL.unsub();
  CL.unsub = fs.onSnapshot(mref(mid), { includeMetadataChanges: true }, snap => {
    if (CL.mid !== mid || CL.n !== n) return;
    const pend = !!(snap.metadata && snap.metadata.hasPendingWrites);
    const d = snap.exists() ? snap.data() : null;
    if (d && d.game === 'clash' && d.n === n){
      const hb = A ? d.hbB : d.hbA;
      if (hb && hb !== CL.hbSeen){ CL.hbSeen = hb; CL.lastThem = Date.now(); }
    }
    if (G().clashSync) G().clashSync({ d: d && d.game === 'clash' && d.n === n && d.cid === CL.cid ? d : null, pend: pend, role: CL.role, me: me.uid, other: CL.other, name: CL.name, mid: mid, n: n, cid: CL.cid, quiet: Date.now() - CL.lastThem });
  }, e => console.warn(e));
}
function clWatchdog(){
  if (!CL.mid) return;
  const A = CL.role === 'a';
  if (Date.now() - (CL.hbT || 0) > 8000){ CL.hbT = Date.now(); const up = {}; up[A ? 'hbA' : 'hbB'] = nowS(); fs.updateDoc(mref(CL.mid), up).catch(() => {}); }
  if (G().clashTick) G().clashTick({ quiet: Date.now() - CL.lastThem, wait: Date.now() - CL.waitT });
}
/* a clash with your cards at stake that was still going when the game closed: rejoin it (or settle / refund it) */
async function clResume(){
  const p = G().clashPend && G().clashPend();
  if (!p || !me || CL.mid) return;
  try {
    const s2 = await fs.getDoc(mref(p.mid)), d = s2.exists() ? s2.data() : null;
    if (!d || d.game !== 'clash' || d.n !== p.n || d.cid !== p.cid){ if (G().clashSync) G().clashSync({ d: null, gone: true, pend: false, role: p.role, me: me.uid, mid: p.mid, n: p.n, cid: p.cid }); return; }
    const A = p.role === 'a';
    Object.assign(CL, { mid: p.mid, other: A ? d.b : d.a, name: A ? (d.nameB || 'Friend') : (d.nameA || 'Friend'), role: p.role, n: p.n, cid: p.cid, waitT: Date.now(), lastThem: Date.now(), hbSeen: 0 });
    clWatch();
  } catch (e){ console.warn(e); }
}
window.ppClash = {
  ready: () => !!(me && F.code),
  friends: () => onlineFriends(),
  invite: fid => clInvite(fid),
  /* write fields of this match; mine(...) adds this player's A/B suffix */
  up: obj => { if (CL.mid) return fs.updateDoc(mref(CL.mid), obj).catch(e => console.warn(e)); },
  mine: obj => { if (!CL.mid) return; const up = {}, sfx = CL.role === 'a' ? 'A' : 'B'; Object.keys(obj).forEach(k => { up[k + sfx] = obj[k]; }); return fs.updateDoc(mref(CL.mid), up).catch(e => console.warn(e)); },
  cancel: () => { const mid = CL.mid, other = CL.other, A = CL.role === 'a'; clStop(); if (mid){ fs.updateDoc(mref(mid), { st: 'cancel', by: me.uid }).catch(() => {}); if (A) fs.deleteDoc(uref(other, 'invites', me.uid)).catch(() => {}); } },
  stop: () => clStop()
};

window.ppTrade = {
  ready: () => !!(me && F.code),
  active: () => !!TR.mid,
  friends: () => onlineFriends(),
  invite: fid => trInvite(fid),
  offer: list => trOffer(list),
  setReady: on => trReady(on),
  cancel: () => trCancel()
};

/* ---------- Battle Arena co-op over the Realtime Database ---------- */
let rt = null, rdb = null;
const CO = { key: '', role: '', unsub: [], timer: 0, idle: 0, peers: {}, links: [], lastQ: {}, q: 0, recv: null };
async function rtReady(){
  if (rdb) return true;
  try { rt = await import(SDK + 'firebase-database.js'); rdb = rt.getDatabase(fbApp, RTDB_URL); return true; }
  catch (e){ console.warn('realtime db', e); return false; }
}
/* a friend's skill level from their leaderboard numbers (-1 when not known) */
function friendSkillLv(fid, key){ const lb = (F.prof[fid] || {}).lb; if (!lb || typeof lb['sk_' + key] !== 'number') return -1; return G().skillLevel ? G().skillLevel(lb['sk_' + key]) : -1; }
function onlineFriends(){
  return Object.keys(F.friends).filter(id => online(F.prof[id])).map(id => ({ uid: id, name: friendName(id) }));
}
/* a co-op party: the host invites up to 3 friends (one match document per pair, as before),
   everyone who says yes joins, and the game starts once nobody is left to answer (or the host starts early) */
const PT = { on: false, host: false, md: 'arena', lv: 1, am: '', mem: [], waitT: 0, gen: 0, hostId: '', hostName: '', mid: '', unsub: null, started: false, more: false };
const PT_MAX = 3;
const PT_TITLE = { td: 'Pal Towers with friends', chef: 'Elemental Kitchen with friends', sg: 'Skill challenge with friends', cannon: 'Sky Cannon with friends', quest: 'Island Quest with friends', skill: 'Skilling with friends', arena: 'Battle Arena with friends', defense: 'Guard Post with friends', raid: 'Boss Raid with friends', dig: 'Treasure Hunt with friends' };
function ptReset(){
  PT.mem.forEach(m => { if (m.unsub) try { m.unsub(); } catch (e){} });
  if (PT.unsub) try { PT.unsub(); } catch (e){}
  const was = PT.on && !PT.started;
  Object.assign(PT, { on: false, host: false, mem: [], unsub: null, started: false, mid: '', hostId: '', hostName: '', more: false });
  if (was && F.lastInv) setTimeout(() => pvInvites(F.lastInv), 0);      /* an invite that came in while you waited shows now */
}
function ptLobby(){
  if (!PT.on || PT.started) return;
  if (!PT.host){
    pvShow('<b>Waiting for <span data-notr>' + esc(PT.hostName) + '</span>…</b><small>You are in! The game starts once everyone has answered.</small><div class="row"><button class="btn sm" type="button" id="pt-leave">Leave</button></div>');
    document.getElementById('pt-leave').onclick = () => ptLeave();
    return;
  }
  const ST = { wait: 'Waiting…', in: 'Joined!', no: 'Said no' };
  const live = PT.mem.filter(m => m.st !== 'no'), joined = PT.mem.filter(m => m.st === 'in');
  const sgI = PT.md === 'sg' && G().sgInfo ? G().sgInfo(PT.am) : null;
  let h = '<b>' + (sgI ? esc(sgI.name) + ' with friends' : (PT_TITLE[PT.md] || PT_TITLE.arena)) + '</b><small>Friends have 60 seconds to answer. You can invite up to 3.</small><div class="pt-list">' +
    PT.mem.map(m => '<div class="pt-m ' + m.st + '"><b data-notr>' + esc(m.name) + '</b><span>' + ST[m.st] + '</span></div>').join('') + '</div>';
  if (PT.more){
    const fr = onlineFriends().filter(x => !PT.mem.some(m => m.uid === x.uid && m.st !== 'no'));
    h += '<div class="pt-list">' + (fr.length ? fr.map(x => '<div class="pt-m"><b data-notr>' + esc(x.name) + '</b><button class="btn sm primary" type="button" data-pt-inv="' + esc(x.uid) + '">Invite</button></div>').join('') : '<small>None of your other friends are online right now.</small>') + '</div>';
  }
  h += '<div class="row">' + (live.length < PT_MAX ? '<button class="btn sm" type="button" id="pt-more">Invite more</button>' : '') +
    (joined.length ? '<button class="btn sm primary" type="button" id="pt-go">Start now</button>' : '') +
    '<button class="btn sm" type="button" id="pt-cancel">Cancel</button></div>';
  pvShow(h);
  const b1 = document.getElementById('pt-more'); if (b1) b1.onclick = () => { PT.more = !PT.more; ptLobby(); };
  const b2 = document.getElementById('pt-go'); if (b2) b2.onclick = () => ptGo();
  document.getElementById('pt-cancel').onclick = () => ptCancel();
  pvBox.querySelectorAll('[data-pt-inv]').forEach(b => { b.onclick = () => { PT.more = false; coopInvite(b.dataset.ptInv, PT.lv, PT.am, PT.md); }; });
}
/* nobody left to answer: start with whoever joined, or close the lobby if nobody did */
function ptCheck(){
  if (!PT.on || !PT.host || PT.started) return;
  if (PT.mem.some(m => m.st === 'wait')) return;
  if (PT.mem.some(m => m.st === 'in')) ptGo();
  else { ptReset(); pvShow(''); }
}
async function ptGo(){
  if (!PT.on || !PT.host || PT.started) return;
  const joined = PT.mem.filter(m => m.st === 'in'); if (!joined.length) return;
  PT.started = true; pvShow('');
  PT.mem.filter(m => m.st === 'wait').forEach(m => { m.st = 'no'; fs.updateDoc(mref(m.mid), { st: 'cancel' }).catch(() => {}); fs.deleteDoc(uref(m.uid, 'invites', me.uid)).catch(() => {}); });
  const key = 'p_' + [me.uid].concat(joined.map(m => m.uid)).join('_') + '_' + Date.now().toString(36);
  const roster = [{ slot: 0, uid: me.uid, name: F.name, char: G().coopChar() }].concat(joined.map((m, i) => ({ slot: i + 1, uid: m.uid, name: m.name, char: m.char })));
  await Promise.all(joined.map((m, i) => fs.updateDoc(mref(m.mid), { st: 'go', key: key, slot: i + 1, roster: roster }).catch(e => console.warn(e))));
  coopLink(key, 'host', 0, roster);
}
async function ptCancel(){
  const L = PT.mem.filter(m => m.st !== 'no');
  ptReset(); pvShow('');
  L.forEach(m => { fs.updateDoc(mref(m.mid), { st: 'cancel' }).catch(() => {}); fs.deleteDoc(uref(m.uid, 'invites', me.uid)).catch(() => {}); });
}
function ptLeave(){
  const mid = PT.mid;
  ptReset(); pvShow('');
  if (mid) fs.updateDoc(mref(mid), { st: 'left' }).catch(() => {});
}
function ptWatchdog(){
  if (!PT.on || PT.started) return;
  if (!PT.host){ if (Date.now() - PT.waitT > 120000){ ptLeave(); G().flash('The game did not start.'); } return; }
  let changed = false;
  PT.mem.forEach(m => {
    if (m.st !== 'wait' || Date.now() - m.at <= 60000) return;
    m.st = 'no'; changed = true; G().flash(m.name + ' did not answer.');
    fs.updateDoc(mref(m.mid), { st: 'cancel' }).catch(() => {}); fs.deleteDoc(uref(m.uid, 'invites', me.uid)).catch(() => {});
  });
  if (changed){ ptLobby(); ptCheck(); }
}
async function coopInvite(fid, lv, am, md){
  if (!me || !fid) return;
  md = md === 'defense' || md === 'raid' || md === 'dig' || md === 'skill' || md === 'quest' || md === 'cannon' || md === 'sg' || md === 'chef' || md === 'td' ? md : 'arena';
  if (md === 'sg'){      /* a friend whose skill is under level 50 can't be invited */
    const I = G().sgInfo && G().sgInfo(am), lvF = I ? friendSkillLv(fid, I.key) : -1;
    if (I && lvF >= 0 && lvF < I.lv){ G().flash(friendName(fid) + ' needs ' + I.skill + ' level ' + I.lv + '.'); return; }
  }
  const B = { td: ['tdfort', 'Build Pal Towers on your island to invite friends.'], chef: ['chefhall', 'Build an Elemental Kitchen on your island to invite friends.'], arena: ['arena', 'Build a Battle Arena on your island to invite friends.'], defense: ['guard', 'Build a Guard Post on your island to invite friends.'], raid: ['raid', 'Build a Boss Raid on your island to invite friends.'], dig: ['digsite', 'Build a Dig Site on your island to invite friends.'], quest: ['questgate', 'Build a Quest Gate on your island to invite friends.'], cannon: ['cannon', 'Build a Sky Cannon on your island to invite friends.'] }[md];
  if (B && G().hasBuilding && !G().hasBuilding(B[0])){ G().flash(B[1]); return; }
  if (!(await rtReady())){ G().flash('Co-op is not set up yet.'); return; }
  if (PT.on && !PT.host && !PT.started){ G().flash('Leave the game you joined first.'); return; }
  if (PT.on && PT.host && !PT.started){
    if (PT.mem.some(m => m.uid === fid && m.st !== 'no')){ G().flash('You already invited ' + friendName(fid) + '.'); return; }
    if (PT.mem.filter(m => m.st !== 'no').length >= PT_MAX){ G().flash('You can invite up to 3 friends.'); return; }
    PT.mem = PT.mem.filter(m => m.uid !== fid);      /* someone who said no can be asked again */
  } else {
    if (CO.key) coopStop();      /* a finished game's link closes before the new invite */
    ptReset();
    Object.assign(PT, { on: true, host: true, md: md, lv: lv, am: am, waitT: Date.now(), gen: PT.gen + 1, more: false });
  }
  const gen = PT.gen, mid = pairId(fid), name = friendName(fid), m0 = { uid: fid, name: name, st: 'wait', char: null, mid: mid, at: Date.now(), unsub: null };
  PT.mem.push(m0);
  friendsToggle(false);
  ptLobby();
  try {
    const old = await fs.getDoc(mref(mid)), n = old.exists() ? (old.data().n || 0) : 0;
    if (PT.gen !== gen || m0.st !== 'wait') return;
    await fs.setDoc(mref(mid), { game: 'arena', a: me.uid, b: fid, nameA: F.name, nameB: name, st: 'invite', n: n, lv: PT.lv, am: PT.am, md: PT.md, charA: G().coopChar(), charB: null, moves: [], first: '', winner: '', why: '', at: nowS(), turnAt: 0 });
    await fs.setDoc(uref(fid, 'invites', me.uid), { mid: mid, name: F.name, at: nowS(), game: 'arena', lv: PT.lv, am: PT.am, md: PT.md });
  } catch (e){ console.warn(e); G().flash('Could not send the invite. Try again.'); if (PT.gen === gen){ m0.st = 'no'; ptLobby(); ptCheck(); } return; }
  if (PT.gen !== gen) return;
  m0.unsub = fs.onSnapshot(mref(mid), snap => {
    if (PT.gen !== gen || !snap.exists()) return;
    const d = snap.data();
    if (d.a !== me.uid) return;
    if (m0.st === 'wait' && d.st === 'joined'){ m0.st = 'in'; m0.char = d.charB; ptLobby(); ptCheck(); }
    else if (m0.st === 'wait' && d.st === 'declined'){ m0.st = 'no'; G().flash(name + ' said no this time.'); ptLobby(); ptCheck(); }
    else if (m0.st === 'in' && d.st === 'left' && !PT.started){ m0.st = 'no'; ptLobby(); ptCheck(); }
  }, e => console.warn(e));
}
async function coopAccept(inv){
  PV.inv = null; pvShow('');
  if (!(await rtReady())){ G().flash('Co-op is not set up yet.'); return; }
  try {
    const s2 = await fs.getDoc(mref(inv.mid)), m = s2.exists() ? s2.data() : null;
    fs.deleteDoc(uref(me.uid, 'invites', inv.id)).catch(() => {});
    if (!m || m.st !== 'invite' || m.a !== inv.id || m.game !== 'arena'){ G().flash('That invite is no longer open.'); return; }
    if (PT.on && !PT.started){ if (PT.host) await ptCancel(); else ptLeave(); }
    if (CO.key) coopStop();
    ptReset();
    const name = inv.name || m.nameA || 'Friend';
    Object.assign(PT, { on: true, host: false, hostId: inv.id, hostName: name, mid: inv.mid, md: m.md || 'arena', lv: m.lv || 1, am: m.am || '', waitT: Date.now(), gen: PT.gen + 1 });
    const gen = PT.gen;
    PT.unsub = fs.onSnapshot(mref(inv.mid), snap => {
      if (PT.gen !== gen || !snap.exists()) return;
      const d = snap.data();
      if (d.st === 'go' && !PT.started && d.b === me.uid && d.key){ PT.started = true; pvShow(''); coopLink(d.key, 'guest', +d.slot || 1, Array.isArray(d.roster) ? d.roster : []); }
      else if (d.st === 'cancel' && !PT.started){ ptReset(); pvShow(''); G().flash(name + ' called off the game.'); }
    }, e => console.warn(e));
    await fs.updateDoc(mref(inv.mid), { st: 'joined', n: (m.n || 0) + 1, charB: G().coopChar(), nameB: F.name });
    if (PT.gen === gen && !PT.started) ptLobby();
  } catch (e){ console.warn(e); G().flash('Could not join. Try again.'); ptReset(); }
}
function coopStop(){
  CO.unsub.forEach(u => { try { u(); } catch (e) {} }); CO.unsub = [];
  clearInterval(CO.timer); CO.timer = 0;
  Object.keys(CO.peers || {}).forEach(k => rtcClose(CO.peers[k])); CO.peers = {}; CO.links = []; CO.recv = null;
  const nb = document.getElementById('pp-net'); if (nb) nb.hidden = true;
  if (CO.key && CO.role === 'host' && rt){ const k = CO.key; setTimeout(() => rt.remove(rt.ref(rdb, 'coop/' + k)).catch(() => {}), 3000); }
  CO.key = ''; CO.role = '';
  if (CO.gen && PT.gen === CO.gen && PT.started) ptReset();      /* only end the party this co-op belonged to, never a fresh invite */
  CO.gen = 0;
  if (F.lastInv) setTimeout(() => pvInvites(F.lastInv), 0);      /* an invite that came in during the last game shows now */
}
/* the realtime channel: the host writes /h, the guests write /g, /g2, /g3 */
function coSlotPath(n){ return n === 0 ? 'h' : n === 1 ? 'g' : 'g' + n; }

/* ---------- direct connections (WebRTC): game updates go straight between the devices (inside the home Wi-Fi when
   everyone is in the same house), with the Realtime Database as the fallback. The host links to each guest; the
   offer and answer travel in that pair's match document (rtcO / rtcA, tagged with the game key). Every message
   carries a number (_q) per sender, so a copy arriving by the other road, or late, is skipped. A link counts as
   "live" once it has carried data in the last second and the other side confirms it hears us; while any guest is not live, the host also writes to the database. ---------- */
const RTC_ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
function rtcAllowed(){ try { if (localStorage.getItem('pp.noDirect') === '1') return false; } catch (e){} return typeof RTCPeerConnection === 'function'; }
function rtcGather(pc, ms){
  return new Promise(res => {
    if (pc.iceGatheringState === 'complete') return res();
    const t = setTimeout(res, ms);
    pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete'){ clearTimeout(t); res(); } });
  });
}
/* live = data came in over the link lately AND the other side says it is getting ours (a link can break one way only) */
function rtcHear(P){ return !!(P && P.dc && P.dc.readyState === 'open' && Date.now() - P.lastIn < 1000); }
function rtcLive(P){ return rtcHear(P) && Date.now() - P.okT < 1200 && Date.now() - P.openT > 1200 && P.dc.bufferedAmount < 262144; }
function rtcPing(){ CO.links.forEach(s => { const P = CO.peers[s]; if (P && P.dc && P.dc.readyState === 'open' && Date.now() - (P.pingT || 0) > 300){ P.pingT = Date.now(); rtcSend(P, JSON.stringify({ _p: rtcHear(P) ? 1 : 0 })); } }); }
function rtcSend(P, s){ if (P && P.dc && P.dc.readyState === 'open' && P.dc.bufferedAmount < 262144) try { P.dc.send(s); } catch (e){} }
function rtcClose(P){ if (!P) return; P.dead = true; if (P.unsub) try { P.unsub(); } catch (e){} try { if (P.dc) P.dc.close(); } catch (e){} try { P.pc.close(); } catch (e){} }
function rtcWire(P, dc){
  P.dc = dc;
  dc.onopen = () => { P.openT = Date.now(); };
  dc.onmessage = e => { if (P.dead) return; let v; try { v = JSON.parse(e.data); } catch (er){ return; } P.lastIn = Date.now(); if (v && v._p !== undefined){ if (v._p) P.okT = Date.now(); return; } if (CO.recv) CO.recv(v, P.slot, true); };
}
function rtcNew(slot, key){
  const P = { slot: slot, key: key, pc: new RTCPeerConnection({ iceServers: RTC_ICE }), dc: null, openT: 0, lastIn: 0, okT: 0, pingT: 0, dead: false, unsub: null, done: false };
  setTimeout(() => { if (!P.dead && !(P.dc && P.dc.readyState === 'open')){ rtcClose(P); } }, 15000);      /* no direct road: stay on the server */
  return P;
}
async function rtcHost(slot, mid, key){
  const P = rtcNew(slot, key);
  CO.peers[slot] = P;
  try {
    rtcWire(P, P.pc.createDataChannel('pp', { ordered: true }));
    await P.pc.setLocalDescription(await P.pc.createOffer());
    await rtcGather(P.pc, 2500);
    if (P.dead) return;
    await fs.updateDoc(mref(mid), { rtcO: { k: key, sdp: P.pc.localDescription.sdp }, rtcA: null });
    P.unsub = fs.onSnapshot(mref(mid), snap => {
      const d = snap.exists() ? snap.data() : null;
      if (P.dead || P.done || !d || !d.rtcA || d.rtcA.k !== key) return;
      P.done = true;
      P.pc.setRemoteDescription({ type: 'answer', sdp: d.rtcA.sdp }).catch(e => { console.warn(e); rtcClose(P); });
    }, () => {});
  } catch (e){ console.warn('direct link', e); rtcClose(P); }
}
function rtcGuest(mid, key){
  const P = rtcNew(0, key);
  CO.peers[0] = P;
  P.pc.ondatachannel = e => rtcWire(P, e.channel);
  P.unsub = fs.onSnapshot(mref(mid), async snap => {
    const d = snap.exists() ? snap.data() : null;
    if (P.dead || P.done || !d || !d.rtcO || d.rtcO.k !== key) return;
    P.done = true;
    try {
      await P.pc.setRemoteDescription({ type: 'offer', sdp: d.rtcO.sdp });
      await P.pc.setLocalDescription(await P.pc.createAnswer());
      await rtcGather(P.pc, 2500);
      if (P.dead) return;
      await fs.updateDoc(mref(mid), { rtcA: { k: key, sdp: P.pc.localDescription.sdp } });
    } catch (e){ console.warn('direct link', e); rtcClose(P); }
  }, () => {});
}
/* the little "Direct / Server" label at the bottom of the screen during co-op games */
function rtcBadge(){
  let el = document.getElementById('pp-net');
  const on = CO.key && CO.links && CO.links.length && G().coopRole && G().coopRole();
  if (!on){ if (el) el.hidden = true; return; }
  if (!el){
    el = document.createElement('div'); el.id = 'pp-net';
    el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);z-index:9000;pointer-events:none;font:700 11px/1 system-ui,sans-serif;padding:4px 10px;border-radius:999px;color:#fff;opacity:.85;white-space:nowrap';
    document.body.appendChild(el);
  }
  const top = CO.md === 'cannon';      /* the cannons fill the bottom of the screen there */
  el.style.top = top ? '94px' : ''; el.style.bottom = top ? '' : '4px';
  const n = CO.links.length, d = CO.links.filter(s => rtcLive(CO.peers[s])).length;
  const txt = d === n ? '⚡ Direct connection' : d === 0 ? '☁ Server connection' : '⚡ Direct ' + d + '/' + n;
  if (el.dataset.k !== txt){ el.dataset.k = txt; el.textContent = txt; el.style.background = d === n ? 'rgba(25,135,70,.88)' : d ? 'rgba(175,120,20,.88)' : 'rgba(55,65,85,.82)'; }
  el.hidden = false;
}
/* a message from slot s (by either road): use it only if it is newer than the last one from s */
function coFresh(v, s){
  if (!v || typeof v !== 'object') return false;
  const q = +v._q;
  if (!q) return true;      /* an older game version sends no numbers */
  if (q <= (CO.lastQ[s] || 0)) return false;
  CO.lastQ[s] = q; return true;
}
async function coopLink(key, role, slot, roster){
  if (!(await rtReady())){ G().flash('Co-op is not set up yet.'); ptReset(); return; }
  const mates = roster.filter(r => r && +r.slot !== slot).map(r => ({ slot: +r.slot || 0, name: r.name || 'Friend', partner: r.char, uid: r.uid }));
  if (!mates.length){ ptReset(); return; }
  /* each guest's match document, for setting up the direct link */
  const mids = {};
  if (role === 'host') mates.forEach(m => { const pm = PT.mem.find(x => x.uid === m.uid); if (pm) mids[m.slot] = pm.mid; });
  else mids[0] = PT.mid;
  const ok = G().coopStart({ role: role, slot: slot, mates: mates, name: mates[0].name, partner: mates[0].partner, lv: PT.lv, am: PT.am, md: PT.md });
  if (!ok){ if (role === 'guest') ptLeave(); else ptReset(); return; }
  const gen = PT.gen, md = PT.md;
  coopStop(); PT.started = true;
  CO.key = key; CO.role = role; CO.idle = 0; CO.gen = gen; CO.md = md; CO.q = 0; CO.lastQ = {}; CO.peers = {};
  CO.links = role === 'host' ? mates.map(m => m.slot) : [0];
  const base = 'coop/' + key, direct = rtcAllowed();
  if (role === 'host'){
    CO.recv = (v, s) => {
      if (!coFresh(v, s)) return;
      G().coopInput(v, s);
      if (md === 'dig'){ const msg = JSON.stringify({ _r: s, d: v }); CO.links.forEach(o => { if (o !== s) rtcSend(CO.peers[o], msg); }); }      /* treasure hunters hear from everyone */
    };
    mates.forEach(m => CO.unsub.push(rt.onValue(rt.ref(rdb, base + '/' + coSlotPath(m.slot)), sn => { const v = sn.val(); if (v) CO.recv(v, m.slot, false); })));
    if (direct) mates.forEach(m => { if (mids[m.slot]) rtcHost(m.slot, mids[m.slot], key); });
    CO.timer = setInterval(() => {
      rtcBadge(); rtcPing();
      if (!G().coopRole()){ if (++CO.idle > 30) coopStop(); return; }
      const snap = G().coopSnap(); if (!snap) return;
      snap._q = ++CO.q;
      const s = JSON.stringify(snap);
      let server = false;
      CO.links.forEach(o => { const P = CO.peers[o]; rtcSend(P, s); if (!rtcLive(P)) server = true; });
      if (server) rt.set(rt.ref(rdb, base + '/h'), snap).catch(e => console.warn(e));
    }, 40);      /* 25 pictures a second for the friends */
  } else {
    CO.recv = (v, s) => {
      if (v && v._r !== undefined && v.d){ const r = +v._r; if (r !== slot && coFresh(v.d, r)) G().coopApply(v.d, r); return; }
      if (coFresh(v, s)) G().coopApply(v, s);
    };
    CO.unsub.push(rt.onValue(rt.ref(rdb, base + '/h'), sn => { const v = sn.val(); if (v) CO.recv(v, 0, false); }));
    if (md === 'dig') mates.filter(m => m.slot !== 0).forEach(m => CO.unsub.push(rt.onValue(rt.ref(rdb, base + '/' + coSlotPath(m.slot)), sn => { const v = sn.val(); if (v) CO.recv(v, m.slot, false); })));
    if (direct && mids[0]) rtcGuest(mids[0], key);
    CO.timer = setInterval(() => {
      rtcBadge(); rtcPing();
      if (!G().coopRole()){ if (++CO.idle > 10) coopStop(); return; }
      const o = G().coopOut(); if (!o) return;
      o._q = ++CO.q;
      const P = CO.peers[0];
      rtcSend(P, JSON.stringify(o));
      /* treasure hunters also write to the database, so friends without a direct link still hear them */
      if (!rtcLive(P) || md === 'dig') rt.set(rt.ref(rdb, base + '/' + coSlotPath(slot)), o).catch(e => console.warn(e));
    }, 40);      /* 25 a second from each guest */
  }
}
window.ppCoop = {
  ready(){ return !!(me && F.code); },
  friends(){ return onlineFriends(); },
  skillLv(uid, key){ return friendSkillLv(uid, key); },
  lbPush(){ if (me) fs.updateDoc(uref(me.uid), { lb: lbNow() }).catch(() => {}); },
  invite(uid, lv, am, md){ coopInvite(uid, lv, am, md); },
  left(){ setTimeout(() => { if (!G().coopRole()) coopStop(); }, 50); },
  net(){ return (CO.links || []).map(s => rtcLive(CO.peers[s]) ? 1 : 0); }
};

/* ---------- friend chat: one conversation per pair of friends ---------- */
function chSeen(){ try { return JSON.parse(lsGet('portalPals.chatSeen.' + (me ? me.uid : '')) || '{}'); } catch (e){ return {}; } }
function chMark(id, t){ const o = chSeen(); if ((o[id] || 0) < t){ o[id] = t; lsSet('portalPals.chatSeen.' + me.uid, JSON.stringify(o)); } }
function chUnread(id){ const L = CH.last[id]; if (!L || !me || L.from === me.uid) return 0; if (CH.with === id && CH.box && !CH.box.hidden) return 0; return (L.t || 0) > (chSeen()[id] || 0) ? 1 : 0; }
function chUnreadAll(){ return Object.keys(CH.last).reduce((n, id) => n + chUnread(id), 0); }
function chatSummary(id, d){
  const was = CH.last[id], L = d && d.last ? d.last : null;
  CH.last[id] = L;
  if (L && was !== undefined && L.from !== me.uid && (!was || (L.t || 0) > (was.t || 0))){
    if (CH.with === id && CH.box && !CH.box.hidden) chMark(id, L.t || 0);
    else chNotify(id, L);
  } else if (L && was === undefined && L.from !== me.uid && (L.t || 0) > (chSeen()[id] || 0) && !(CH.with === id && CH.box && !CH.box.hidden)) chNotify(id, L, true);
  friendsUi();
}
/* a little popup when a friend sends a message: their pal, their name and the message; click it to open the chat.
   One popup per friend (a newer message updates it), at most 3 at once, each fades after 7 s (paused while hovered). */
const CHN = { box: null, on: {} };
function chNotify(id, L, old){
  if (!CHN.box){ CHN.box = document.createElement('div'); CHN.box.className = 'chn-stack'; CHN.box.setAttribute('aria-live', 'polite'); document.body.appendChild(CHN.box); }
  let n = CHN.on[id];
  if (!n){
    n = { el: document.createElement('div'), t: 0, k: 0 }; CHN.on[id] = n;
    n.el.className = 'chn'; n.el.setAttribute('role', 'button'); n.el.tabIndex = 0;
    n.el.onclick = ev => { if (ev.target.closest('.chn-x')){ chnGone(id); return; } chnGone(id); chatOpen(id); };
    n.el.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); chnGone(id); chatOpen(id); } };
    n.el.onmouseenter = () => clearTimeout(n.t);
    n.el.onmouseleave = () => { clearTimeout(n.t); n.t = setTimeout(() => chnGone(id), 3000); };
    CHN.box.appendChild(n.el);
    const ids = Object.keys(CHN.on); if (ids.length > 3) chnGone(ids[0]);
  }
  n.k++;
  const p = F.prof[id] || {}, el = p.pal && p.pal.element;
  n.el.innerHTML = '<span class="chn-ic">' + (el ? G().palIcon(el, 30) : '') + '<i>💬</i></span>' +
    '<span class="chn-tx"><b data-notr>' + esc(friendName(id)) + '</b><span data-notr>' + esc(String(L.text || '').slice(0, 80)) + '</span>' +
    '<small>' + (n.k > 1 ? 'New messages' : old ? 'Sent while you were away' : 'New message') + ' · tap to reply</small></span>' +
    '<button class="chn-x" type="button" aria-label="Close">×</button>';
  if (!old) G().sfx && G().sfx('msg');
  clearTimeout(n.t); n.t = setTimeout(() => chnGone(id), 7000);
}
function chnGone(id){
  const n = CHN.on[id]; if (!n) return;
  delete CHN.on[id]; clearTimeout(n.t);
  n.el.classList.add('out'); setTimeout(() => n.el.remove(), 260);
}
function chTime(t){ const d = new Date(t || 0), n = new Date(); const hm = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); return d.toDateString() === n.toDateString() ? hm : d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ' ' + hm; }
function chatOpen(id){
  if (!me || !F.friends[id]) return;
  chnGone(id);
  friendsToggle(false);
  if (!CH.box){
    CH.box = document.createElement('div'); CH.box.className = 'fview chat'; CH.box.setAttribute('role', 'dialog');
    CH.box.addEventListener('click', ev => { if (ev.target === CH.box) chatClose(); });
    document.body.appendChild(CH.box);
  }
  if (CH.unsub){ CH.unsub(); CH.unsub = null; }
  CH.with = id; CH.msgs = null;
  CH.box.hidden = false;
  CH.box.innerHTML = '<div class="ch-card"><button class="win-x" type="button" id="ch-x" aria-label="Close panel">&times;</button>' +
    '<h2><span data-notr>' + esc(friendName(id)) + '</span><small>' + seen(F.prof[id]) + '</small></h2><div class="ch-list" id="ch-list"><p class="ch-empty">Loading…</p></div>' +
    '<div class="ch-row"><input id="ch-in" maxlength="300" placeholder="Write a message…" autocomplete="off" enterkeyhint="send"><button class="btn sm primary" type="button" id="ch-send">Send</button></div></div>';
  const inp = CH.box.querySelector('#ch-in');
  CH.box.querySelector('#ch-x').onclick = chatClose;
  CH.box.querySelector('#ch-send').onclick = chatSend;
  inp.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Enter'){ ev.preventDefault(); chatSend(); } if (ev.key === 'Escape') chatClose(); };
  inp.onkeyup = ev => ev.stopPropagation();
  const mid = pairId(id);
  CH.unsub = fs.onSnapshot(fs.query(fs.collection(db, 'chats', mid, 'msgs'), fs.orderBy('t', 'desc'), fs.limit(60)), qs => {
    if (CH.with !== id) return;
    const list = []; qs.forEach(x => list.push(x.data()));
    list.sort((a, b) => (a.t || 0) - (b.t || 0));
    CH.msgs = list.slice(-60); chatRender();
  }, e => { console.warn(e); const l = document.getElementById('ch-list'); if (l) l.innerHTML = '<p class="ch-empty">Chat is not available right now.</p>'; });
  if (CH.last[id]) chMark(id, CH.last[id].t || 0);
  friendsUi();
  if (!matchMedia('(pointer:coarse)').matches) setTimeout(() => inp.focus(), 50);
}
function chatRender(){
  const l = document.getElementById('ch-list'); if (!l) return;
  const list = CH.msgs || [];
  const atEnd = l.scrollHeight - l.scrollTop - l.clientHeight < 40 || !l.dataset.n;
  l.innerHTML = list.length ? list.map(m => '<div class="ch-m' + (m.from === me.uid ? ' me' : '') + '" data-notr>' + esc(m.text || '') + '<small>' + chTime(m.t) + '</small></div>').join('')
    : '<p class="ch-empty">No messages yet. Say hi!</p>';
  l.dataset.n = list.length;
  if (atEnd) l.scrollTop = l.scrollHeight;
  if (list.length) chMark(CH.with, list[list.length - 1].t || 0);
  friendsUi();
}
function chatClose(){
  if (CH.unsub){ CH.unsub(); CH.unsub = null; }
  if (CH.box) CH.box.hidden = true;
  const w = CH.with; CH.with = '';
  if (w && CH.last[w] && me) chMark(w, CH.last[w].t || 0);
  friendsUi();
}
let chBusy = false;
async function chatSend(){
  const inp = document.getElementById('ch-in'); if (!inp || chBusy) return;
  const text = inp.value.replace(/\s+/g, ' ').trim().slice(0, 300);
  if (!text || !CH.with) return;
  const id = CH.with, mid = pairId(id), t = nowS();
  const m = { from: me.uid, text: text, t: t };
  chBusy = true; inp.value = '';
  CH.msgs = (CH.msgs || []).concat([m]); chatRender();
  try {
    const b = fs.writeBatch(db);
    b.set(fs.doc(db, 'chats', mid, 'msgs', t.toString(36) + Math.random().toString(36).slice(2, 7)), m);
    b.set(fs.doc(db, 'chats', mid), { last: { from: me.uid, t: t, text: text.slice(0, 80) } });
    await b.commit();
  } catch (e){ console.warn(e); G().flash('Message not sent. Are you still friends?'); CH.msgs = (CH.msgs || []).filter(x => x !== m); chatRender(); inp.value = text; }
  chBusy = false;
}

/* ---------- leaderboards: every signed-in player, ranked from their profile ---------- */
function lbNow(){ try { return (G().lbStats && G().lbStats()) || {}; } catch (e){ return {}; } }
const LB = { box: null, cat: 'lv' };
function lbFmt(c, v){
  if (c.kind === 'skill') return 'Lv ' + G().skillLevel(v) + '<small>' + Number(v || 0).toLocaleString() + ' xp</small>';
  if (c.kind === 'surv') return (v || 0) + (c.k === 's_dig' ? ' islands' : c.k === 's_raid' ? ' bosses' : c.k === 's_quest' ? ' levels' : ' waves');
  if (c.kind === 'hunts') return (v || 0).toLocaleString() + ' hunts';
  if (c.kind === 'wins' || c.kind === 'sgwins') return (v || 0).toLocaleString() + ' wins';
  if (c.kind === 'cards') return (v || 0).toLocaleString() + ' / 500 cards';
  return (v || 0).toLocaleString();
}
function lbOpen(){
  friendsToggle(false);
  if (!LB.box){
    LB.box = document.createElement('div'); LB.box.className = 'fview'; LB.box.setAttribute('role', 'dialog');
    LB.box.addEventListener('click', ev => { if (ev.target === LB.box) LB.box.hidden = true; });
    document.body.appendChild(LB.box);
  }
  LB.box.hidden = false;
  lbRender();
  /* push your newest numbers first so your own row is fresh */
  if (me) fs.updateDoc(uref(me.uid), { lb: lbNow() }).catch(() => {}).then(() => lbLoad());
}
function lbRender(rows, mine){
  const cats = G().lbCats ? G().lbCats() : [], c = cats.find(x => x.k === LB.cat) || cats[0];
  const grp = (t, list) => '<p class="lb-grp">' + t + '</p><div class="lb-tabs">' + list.map(x => '<button type="button" data-lb="' + x.k + '" aria-pressed="' + (x.k === LB.cat) + '">' + esc(x.label) + '</button>').join('') + '</div>';
  let h = '<div class="fv-card"><button class="win-x" type="button" id="lb-x" aria-label="Close panel">&times;</button><h2>Leaderboards</h2>' +
    grp('Skills', cats.filter(x => x.kind === 'lv' || x.kind === 'skill')) +
    grp('Minigame wins', cats.filter(x => x.kind === 'wins' || x.kind === 'hunts')) +
    grp('Skill challenge wins', cats.filter(x => x.kind === 'sgwins')) +
    grp('Survival best', cats.filter(x => x.kind === 'surv')) +
    grp('Collections', cats.filter(x => x.kind === 'cards')) +
    '<p class="lvpick-t">' + esc(c ? c.label : '') + (c && c.kind === 'surv' ? ' · Survival' : c && (c.kind === 'wins' || c.kind === 'hunts' || c.kind === 'sgwins') ? ' · Wins' : '') + '</p>';
  if (!rows) h += '<p class="small">Loading…</p>';
  else if (!rows.length) h += '<p class="small">Nobody is on this board yet. Play to be the first!</p>';
  else h += '<div class="lb-list">' + rows.map((r, i) => '<div class="lb-row' + (r.id === (me && me.uid) ? ' me' : '') + '"><span class="rk r' + (i + 1) + '">' + (i + 1) + '</span><span><b data-notr>' + esc(r.name || 'Player') + '</b>' + (r.pal ? '<small data-notr>' + esc(r.pal) + '</small>' : '') + '</span><span class="vl">' + lbFmt(c, r.v) + '</span></div>').join('') + '</div>';
  if (mine) h += '<p class="lb-mine">Your rank: #' + mine.rank + ' · ' + lbFmt(c, mine.v).replace(/<small>.*<\/small>/, '') + '</p>';
  h += '</div>';
  LB.box.innerHTML = h;
  LB.box.querySelector('#lb-x').onclick = () => { LB.box.hidden = true; };
  LB.box.querySelectorAll('[data-lb]').forEach(b => b.onclick = () => { LB.cat = b.dataset.lb; lbRender(); lbLoad(); });
}
async function lbLoad(){
  const cat = LB.cat, field = 'lb.' + cat;
  try {
    const qs = await fs.getDocs(fs.query(fs.collection(db, 'users'), fs.orderBy(field, 'desc'), fs.limit(25)));
    const rows = []; qs.forEach(x => { const d = x.data(), v = d.lb && d.lb[cat]; if (v > 0) rows.push({ id: x.id, name: d.name, pal: d.pal ? d.pal.name : '', v: v }); });
    let mine = null;
    const myV = (lbNow() || {})[cat] || 0;
    if (me && myV > 0 && !rows.slice(0, 25).some(r => r.id === me.uid)){
      try { const cnt = await fs.getCountFromServer(fs.query(fs.collection(db, 'users'), fs.where(field, '>', myV))); mine = { rank: cnt.data().count + 1, v: myV }; } catch (e) {}
    }
    if (LB.cat === cat && !LB.box.hidden) lbRender(rows, mine);
  } catch (e){ console.warn('leaderboard', e); if (LB.cat === cat) { LB.box.querySelector('.fv-card').insertAdjacentHTML('beforeend', '<p class="small">Could not load the leaderboard. Try again.</p>'); } }
}
