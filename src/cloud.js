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
  friendsUi();
}
function friendsStop(){
  F.unsub.forEach(u => u()); F.unsub = [];
  Object.keys(F.funsub).forEach(id => F.funsub[id]()); F.funsub = {};
  Object.keys(CH.sub).forEach(id => CH.sub[id]()); CH.sub = {}; CH.last = {}; chatClose();
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
  if ((PV.mid && PV.started && !PV.ended) || (CO.key && G().coopRole()) || (PT.on && !PT.started)) return;      /* already playing or waiting in a co-op lobby (a finished co-op game does not count) */
  PV.inv = inv;
  const AM = { classic: 'Classic', fire: 'Fire Pit', blades: 'Blade Ring' };
  if (inv.game === 'arena' && inv.md === 'dig') pvShow('<b><span data-notr>' + esc(inv.name || 'A friend') + '</span> invites you to a Treasure Hunt!</b><small>' + (inv.lv === 4 ? 'Co-op survival · island after island, stop when you like.' : 'Co-op · more X marks, your own digs each.') + '</small>' +
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
  if (G().busy && G().busy() && !(inv.game === 'arena' && G().arenaOpen && G().arenaOpen())){ G().flash('Finish your game first.'); return; }
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
  ptWatchdog();
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

/* ---------- Battle Arena co-op over the Realtime Database ---------- */
let rt = null, rdb = null;
const CO = { key: '', role: '', unsub: [], timer: 0, idle: 0 };
async function rtReady(){
  if (rdb) return true;
  try { rt = await import(SDK + 'firebase-database.js'); rdb = rt.getDatabase(fbApp, RTDB_URL); return true; }
  catch (e){ console.warn('realtime db', e); return false; }
}
function onlineFriends(){
  return Object.keys(F.friends).filter(id => online(F.prof[id])).map(id => ({ uid: id, name: friendName(id) }));
}
/* a co-op party: the host invites up to 3 friends (one match document per pair, as before),
   everyone who says yes joins, and the game starts once nobody is left to answer (or the host starts early) */
const PT = { on: false, host: false, md: 'arena', lv: 1, am: '', mem: [], waitT: 0, gen: 0, hostId: '', hostName: '', mid: '', unsub: null, started: false, more: false };
const PT_MAX = 3;
const PT_TITLE = { arena: 'Battle Arena with friends', defense: 'Guard Post with friends', raid: 'Boss Raid with friends', dig: 'Treasure Hunt with friends' };
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
  let h = '<b>' + (PT_TITLE[PT.md] || PT_TITLE.arena) + '</b><small>Friends have 60 seconds to answer. You can invite up to 3.</small><div class="pt-list">' +
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
  md = md === 'defense' || md === 'raid' || md === 'dig' ? md : 'arena';
  const B = { arena: ['arena', 'Build a Battle Arena on your island to invite friends.'], defense: ['guard', 'Build a Guard Post on your island to invite friends.'], raid: ['raid', 'Build a Boss Raid on your island to invite friends.'], dig: ['digsite', 'Build a Dig Site on your island to invite friends.'] }[md];
  if (G().hasBuilding && !G().hasBuilding(B[0])){ G().flash(B[1]); return; }
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
  if (CO.key && CO.role === 'host' && rt){ const k = CO.key; setTimeout(() => rt.remove(rt.ref(rdb, 'coop/' + k)).catch(() => {}), 3000); }
  CO.key = ''; CO.role = '';
  if (CO.gen && PT.gen === CO.gen && PT.started) ptReset();      /* only end the party this co-op belonged to, never a fresh invite */
  CO.gen = 0;
  if (F.lastInv) setTimeout(() => pvInvites(F.lastInv), 0);      /* an invite that came in during the last game shows now */
}
/* the realtime channel: the host writes /h, the guests write /g, /g2, /g3 */
function coSlotPath(n){ return n === 0 ? 'h' : n === 1 ? 'g' : 'g' + n; }
async function coopLink(key, role, slot, roster){
  if (!(await rtReady())){ G().flash('Co-op is not set up yet.'); ptReset(); return; }
  const mates = roster.filter(r => r && +r.slot !== slot).map(r => ({ slot: +r.slot || 0, name: r.name || 'Friend', partner: r.char }));
  if (!mates.length){ ptReset(); return; }
  const ok = G().coopStart({ role: role, slot: slot, mates: mates, name: mates[0].name, partner: mates[0].partner, lv: PT.lv, am: PT.am, md: PT.md });
  if (!ok){ if (role === 'guest') ptLeave(); else ptReset(); return; }
  const gen = PT.gen;
  coopStop(); PT.started = true;
  CO.key = key; CO.role = role; CO.idle = 0; CO.gen = gen;
  const base = 'coop/' + key;
  if (role === 'host'){
    mates.forEach(m => CO.unsub.push(rt.onValue(rt.ref(rdb, base + '/' + coSlotPath(m.slot)), sn => { const v = sn.val(); if (v) G().coopInput(v, m.slot); })));
    CO.timer = setInterval(() => {
      if (!G().coopRole()){ if (++CO.idle > 30) coopStop(); return; }
      const snap = G().coopSnap(); if (snap) rt.set(rt.ref(rdb, base + '/h'), snap).catch(e => console.warn(e));
    }, 50);      /* 20 pictures a second for the friends */
  } else {
    CO.unsub.push(rt.onValue(rt.ref(rdb, base + '/h'), sn => { const v = sn.val(); if (v) G().coopApply(v, 0); }));
    if (PT.md === 'dig') mates.filter(m => m.slot !== 0).forEach(m => CO.unsub.push(rt.onValue(rt.ref(rdb, base + '/' + coSlotPath(m.slot)), sn => { const v = sn.val(); if (v) G().coopApply(v, m.slot); })));      /* treasure hunters hear from everyone */
    CO.timer = setInterval(() => {
      if (!G().coopRole()){ if (++CO.idle > 10) coopStop(); return; }
      const o = G().coopOut(); if (o) rt.set(rt.ref(rdb, base + '/' + coSlotPath(slot)), o).catch(e => console.warn(e));
    }, 66);
  }
}
window.ppCoop = {
  ready(){ return !!(me && F.code); },
  friends(){ return onlineFriends(); },
  invite(uid, lv, am, md){ coopInvite(uid, lv, am, md); },
  left(){ setTimeout(() => { if (!G().coopRole()) coopStop(); }, 50); }
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
    else G().flash('💬 ' + friendName(id) + ': ' + String(L.text || '').slice(0, 60));
  }
  friendsUi();
}
function chTime(t){ const d = new Date(t || 0), n = new Date(); const hm = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); return d.toDateString() === n.toDateString() ? hm : d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ' ' + hm; }
function chatOpen(id){
  if (!me || !F.friends[id]) return;
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
  if (c.kind === 'surv') return (v || 0) + (c.k === 's_dig' ? ' islands' : c.k === 's_raid' ? ' bosses' : ' waves');
  if (c.kind === 'hunts') return (v || 0).toLocaleString() + ' hunts';
  if (c.kind === 'wins') return (v || 0).toLocaleString() + ' wins';
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
    grp('Survival best', cats.filter(x => x.kind === 'surv')) +
    '<p class="lvpick-t">' + esc(c ? c.label : '') + (c && c.kind === 'surv' ? ' · Survival' : c && (c.kind === 'wins' || c.kind === 'hunts') ? ' · Wins' : '') + '</p>';
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
