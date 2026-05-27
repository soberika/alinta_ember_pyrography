// Pre-paint theme init (avoid flash)
(function(){
  try {
    var t = localStorage.getItem('alita-theme');
    if (t === 'dark' || (!t && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches)){
      document.documentElement.classList.add('dark');
    }
  } catch(e){}
})();

// Tailwind config shared by all pages
window.tailwind && (tailwind.config = {
  theme: {
    extend: {
      colors: {
        wood:  { 50:'#fbf3e3', 100:'#f5e8c7', 200:'#f4e9d8', 300:'#ecd9b3', 400:'#d9b483', 500:'#b88a55' },
        ember: { 300:'#ffc46b', 400:'#ffb84d', 500:'#ff9f1c', 600:'#f57e0f', 700:'#e85d04', 800:'#b9420a' },
        char:  { 900:'#2a1d14', 800:'#3d2b1f', 700:'#5a3f2c' }
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"','ui-sans-serif','system-ui','sans-serif'],
        display: ['"Bricolage Grotesque"','"Plus Jakarta Sans"','serif'],
      },
      boxShadow: {
        'ember-glow':    '0 0 24px 0 rgba(255,159,28,.55), 0 0 64px 0 rgba(232,93,4,.35)',
        'ember-glow-lg': '0 0 36px 4px rgba(255,159,28,.7),  0 0 90px 10px rgba(232,93,4,.45)',
        'card':          '0 10px 30px -10px rgba(61,43,31,.35), 0 4px 10px -4px rgba(61,43,31,.25)',
        'card-hot':      '0 22px 50px -10px rgba(232,93,4,.55), 0 0 0 1px rgba(232,93,4,.35)',
      }
    }
  }
});
