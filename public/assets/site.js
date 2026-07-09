// === Alinta Ember — shared scripts ===
(function(){
  // year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // ember particles (only if there is a #embers layer on the page)
  var layer = document.getElementById('embers');
  if (layer){
    var SIZES = ['s','s','m','m','m','l','l','xl'];
    var N = 26;
    for (var i = 0; i < N; i++){
      var e = document.createElement('span');
      var size = SIZES[Math.floor(Math.random()*SIZES.length)];
      e.className = 'ember ' + size;
      e.style.left   = (Math.random()*100) + '%';
      e.style.bottom = (Math.random()*30)  + '%';
      var dur = 5 + Math.random()*6;
      e.style.animationDuration = dur + 's';
      e.style.animationDelay = (-Math.random()*dur) + 's';
      e.style.setProperty('--dx', (Math.random()*80 - 40) + 'px');
      layer.appendChild(e);
    }
  }

  // mobile menu
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobile-menu');
  var icon   = document.getElementById('burger-icon');
  if (burger && menu){
    var open = false;
    function setOpen(v){
      open = v;
      burger.setAttribute('aria-expanded', String(v));
      if (v){
        menu.style.maxHeight = menu.scrollHeight + 'px';
        if (icon) icon.innerHTML = '<path d="M6 6l12 12M18 6L6 18"/>';
      } else {
        menu.style.maxHeight = '0px';
        if (icon) icon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16"/>';
      }
    }
    burger.addEventListener('click', function(){ setOpen(!open); });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setOpen(false); });
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth >= 768) setOpen(false);
    });
  }
})();


// === Dark mode toggle (injected into header) ===
(function(){
  function injectToggle(){
    var header = document.querySelector('header .max-w-6xl');
    if (!header) return;
    if (header.querySelector('.theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle ml-2 md:ml-4';
    btn.setAttribute('aria-label','Farbschema umschalten');
    btn.innerHTML = ''
      + '<svg class="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
      + '<svg class="sun"  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    // insert before burger if present, else append
    var burger = header.querySelector('#burger');
    if (burger) header.insertBefore(btn, burger);
    else header.appendChild(btn);

    btn.addEventListener('click', function(){
      var dark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('alinta-theme', dark ? 'dark' : 'light'); } catch(e){}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();
})();


