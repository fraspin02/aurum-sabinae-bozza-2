(function () {
  var header = document.querySelector('.site-header');
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

  // pagina ordina: quantità e riepilogo (solo dimostrativo)
  var list = document.querySelector('[data-order]');
  if (!list) return;
  var summary = document.getElementById('summary-list');
  var toast = document.getElementById('toast');

  function render() {
    var rows = [];
    list.querySelectorAll('.order-row').forEach(function (row) {
      var n = +row.querySelector('output').value;
      if (n > 0) rows.push('<li><span>' + row.dataset.name + '</span><b>' + n + '</b></li>');
    });
    summary.innerHTML = rows.length ? rows.join('') : '<li class="empty">Nessun prodotto scelto</li>';
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-step]');
    if (!b) return;
    var out = b.parentNode.querySelector('output');
    out.value = Math.max(0, Math.min(99, +out.value + +b.dataset.step));
    render();
  });

  var hash = location.hash.slice(1);
  if (hash) {
    var target = document.getElementById(hash);
    if (target) { target.querySelector('output').value = 1; }
  }
  render();

  document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault();
    toast.textContent = 'Questa è una bozza: nel sito vero la richiesta arriverà a Leonardo su WhatsApp o email.';
    toast.classList.add('is-on');
    setTimeout(function () { toast.classList.remove('is-on'); }, 4200);
  });
})();
