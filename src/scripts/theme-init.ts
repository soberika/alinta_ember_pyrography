// Runs before paint to avoid FOUC
(function () {
  try {
    const t = localStorage.getItem('alita-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (_) {}
})();
