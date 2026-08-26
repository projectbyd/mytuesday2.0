// ======================================================================
// PENJAGA LOGIN
// ------------------------------------------------
// Dipasang di index.html, tepat SEBELUM script utama aplikasi.
// Tugasnya:
//   1. Mengambil daftar email dari allowed-emails.csv.
//   2. Mengecek apakah pengguna sudah login (tersimpan di localStorage)
//      dan emailnya ada di daftar itu.
//   3. Kalau valid → memberi sinyal ke script utama untuk mulai
//      menampilkan aplikasi (lewat event 'mt-auth-ready').
//   4. Kalau tidak valid → melempar ke login.html.
//
// CATATAN: karena file ini mengambil allowed-emails.csv lewat fetch(),
// sistem ini HARUS diakses lewat GitHub Pages (https://...), bukan
// dengan membuka file index.html langsung dari komputer (file://).
// ======================================================================

(function () {
  const AUTH_KEY = 'mt_auth';
  const LOGIN_PAGE = 'login.html';
  const CSV_PATH = 'allowed-emails.csv';

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  async function loadAllowedEmails() {
    try {
      const res = await fetch(CSV_PATH, { cache: 'no-store' });
      const text = await res.text();
      return text
        .split(/\r?\n/)
        .map(line => line.split(',')[0].trim())
        .filter(Boolean)
        .filter(e => e.toLowerCase() !== 'email'); // lewati baris header
    } catch (e) {
      console.error('Gagal memuat allowed-emails.csv', e);
      return [];
    }
  }

  async function isAllowed(email) {
    email = (email || '').trim().toLowerCase();
    if (!email) return false;
    const emails = await loadAllowedEmails();
    return emails.some(e => e.toLowerCase() === email);
  }

  // Dipanggil dari tombol "Keluar" di halaman utama.
  window.logout = function () {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = LOGIN_PAGE;
  };

  (async function check() {
    const auth = getAuth();
    if (!auth || !(await isAllowed(auth.email))) {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = LOGIN_PAGE;
      return;
    }
    // Nama pengguna yang sedang login, kalau mau ditampilkan di aplikasi.
    window.currentUserName = auth.name;
    // Kasih sinyal ke script utama (di bawahnya) bahwa boleh mulai render.
    window.dispatchEvent(new Event('mt-auth-ready'));
  })();
})();
