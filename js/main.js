(function () {
  var header = document.querySelector('.hd');
  var btn = document.querySelector('.menu-btn');
  var mnav = document.getElementById('mobile-nav');

  if (btn && mnav) {
    var closeBtn = mnav.querySelector('.menu-close');
    var setMenu = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      mnav.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      (open ? closeBtn : btn).focus();
    };
    btn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    mnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mnav.hidden) setMenu(false);
    });
  }

  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // filtri del blog
  var posts = document.querySelector('[data-posts]');
  document.querySelectorAll('.filter').forEach(function (f, _, all) {
    f.setAttribute('aria-pressed', String(f.classList.contains('is-on')));
    f.addEventListener('click', function () {
      all.forEach(function (x) { x.classList.toggle('is-on', x === f); x.setAttribute('aria-pressed', String(x === f)); });
      posts.querySelectorAll('.post').forEach(function (p) { p.hidden = !!f.dataset.cat && p.dataset.cat !== f.dataset.cat; });
    });
  });

  // comparsa leggera, solo se il browser la supporta
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
