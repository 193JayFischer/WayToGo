// Shared data layer for the Way To Go NJ site. Loads Firebase on demand.
const VERSION = '10.14.1';
const BASE = 'https://www.gstatic.com/firebasejs/' + VERSION + '/';
let ready = null;

export function isConfigured() {
  const c = window.WTG_CONFIG && window.WTG_CONFIG.firebase;
  return !!(c && c.apiKey && c.projectId);
}

export function connect() {
  if (!isConfigured()) return Promise.reject(new Error('NOT_CONFIGURED'));
  if (!ready) {
    ready = Promise.all([
      import(BASE + 'firebase-app.js'),
      import(BASE + 'firebase-firestore.js'),
      import(BASE + 'firebase-auth.js')
    ]).then(([app, fs, auth]) => {
      const a = app.initializeApp(window.WTG_CONFIG.firebase);
      return { db: fs.getFirestore(a), auth: auth.getAuth(a), fs, authLib: auth };
    }).catch((e) => { ready = null; throw new Error('LOAD_FAILED: ' + e.message); });
  }
  return ready;
}

// Save a new application or inquiry. Anyone may create; only the admin may read.
export async function submitLead(data) {
  const { db, fs } = await connect();
  const clean = {};
  Object.keys(data).forEach((k) => {
    const v = data[k];
    if (v === undefined || v === null) return;
    clean[k] = Array.isArray(v) ? v.map(String).slice(0, 20) : String(v).slice(0, 5000);
  });
  clean.status = 'New';
  clean.createdAt = fs.serverTimestamp();
  await fs.addDoc(fs.collection(db, 'applications'), clean);
}

export function friendlyError(err) {
  const m = (err && err.message) || String(err);
  if (m.indexOf('NOT_CONFIGURED') === 0) return 'This is not switched on yet. Please check back shortly.';
  if (m.indexOf('LOAD_FAILED') === 0) return 'Could not reach the server. Check your connection and try again.';
  if (/permission-denied|insufficient permissions/i.test(m)) return 'The server refused the request. Please try again later.';
  return m;
}
