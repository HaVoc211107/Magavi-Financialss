// Basic auth helper for the demo app.
// This uses localStorage only and is not secure.

(function () {
  const LOGIN_KEY = "magaviLoggedIn";
  const USER_KEY = "magaviUser";

  function isLoggedIn() {
    return Boolean(localStorage.getItem(USER_KEY));
  }

  function requireLogin() {
    if (!isLoggedIn()) {
      window.location.href = "index.html";
    }
  }

  function checkAuth() {
    const email = localStorage.getItem(USER_KEY);
    if (!email) {
      window.location.href = "index.html";
      return;
    }

    const welcome = document.getElementById("welcomeUser");
    if (welcome) {
      welcome.textContent = `Welcome, ${email}`;
    }
  }

  function logout() {
    localStorage.removeItem(LOGIN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "index.html";
  }

  // Expose helpers for other scripts.
  window.MagaviAuth = { isLoggedIn, requireLogin, checkAuth, logout };

  // Login form handling (index.html only).
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value.trim();

      localStorage.setItem(LOGIN_KEY, "true");
      localStorage.setItem(USER_KEY, email);
      window.location.href = "dashboard.html";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("welcomeUser")) {
      checkAuth();
    }
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
})();
