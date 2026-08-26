// ======================================================================
// PENJAGA LOGIN
// ------------------------------------------------
// File ini dipasang di halaman utama (index.html), tepat SEBELUM
// script utama aplikasi. Tugasnya:
//   1. Mengecek apakah pengguna sudah login (tersimpan di localStorage).
//   2. Mengecek apakah email login-nya ada di daftar ALLOWED_EMAILS
//      (dari file allowed-emails.js).
//   3. Kalau belum login / email tidak terdaftar → lempar ke login.html.
//
// Jangan diedit kecuali kamu tahu apa yang kamu lakukan — cukup edit
// allowed-emails.js untuk menambah/menghapus email yang boleh masuk.
// ======================================================================

(function () {
  const AUTH_KEY = 'mt_auth';
  const LOGIN_PAGE = 'login.html';

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function isAllowed(email) {
    email = (email || '').trim().toLowerCase();
    if (!email) return false;
    return (window.ALLOWED_EMAILS || []).some(
      e => e.trim().toLowerCase() === email
    );
  }

  const auth = getAuth();

  if (!auth || !isAllowed(auth.email)) {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = LOGIN_PAGE;
  }

  // Dipanggil dari tombol "Keluar" di halaman utama.
  window.logout = function () {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = LOGIN_PAGE;
  };

  // Nama pengguna yang sedang login, kalau mau ditampilkan di aplikasi.
  window.currentUserName = auth ? auth.name : '';
})();
