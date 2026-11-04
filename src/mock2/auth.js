let cb=null;
export function getAuth(){ return {}; }
export class GoogleAuthProvider{}
export async function signInWithPopup(){ const u=JSON.parse(localStorage.getItem('mock.want')); localStorage.setItem('mock.user',JSON.stringify(u)); cb&&cb(u); }
export async function signInWithRedirect(){}
export async function getRedirectResult(){ return null; }
export function onAuthStateChanged(a,f){ cb=f; const u=localStorage.getItem('mock.user'); setTimeout(()=>f(u?JSON.parse(u):null),50); }
export async function signOut(){ localStorage.removeItem('mock.user'); }
