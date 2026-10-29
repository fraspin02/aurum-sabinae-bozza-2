/* Negozio dimostrativo: carrello nel browser, nessun pagamento reale.
   PREZZI E FORMATI D'ESEMPIO: da confermare con il titolare prima della pubblicazione. */
(function () {
  var PRODUCTS = [
    {
      id: 'primo-raccolto', name: 'Primo Raccolto', line: 'Aurum Sabinae', tag: 'Sabina DOP',
      img: 'primo-raccolto', imgW: 760,
      short: 'Il primo olio della stagione: olive raccolte in anticipo, fruttato medio e leggero.',
      text: "Le prime olive dell'annata, raccolte in anticipo per conservare i profumi più vivi. Leccino al 70% e Carboncella, spremute subito ed estratte a freddo.",
      specs: [['Cultivar', 'Leccino 70%, Carboncella'], ['Raccolta', 'Anticipata'], ['Fruttato', 'Medio / leggero'], ['Denominazione', 'Sabina DOP']],
      award: "Orciolo d'Oro 2012, Distinzione",
      formats: [{ size: '0,5 l', price: 16 }, { size: '0,25 l', price: 9.5 }]
    },
    {
      id: 'aurum-sabinae', name: 'Aurum Sabinae', line: 'Il blend della casa', tag: 'Sabina DOP',
      img: 'aurum-sabinae', imgW: 760,
      short: 'Quattro varietà del territorio raccolte in ottobre: l\'olio che racconta la Sabina.',
      text: "L'olio che racconta la Sabina: Leccino, Carboncella, Frantoio e Salviana raccolte nel mese di ottobre, estratte a freddo.",
      specs: [['Cultivar', 'Leccino, Carboncella, Frantoio, Salviana'], ['Raccolta', 'Ottobre'], ['Estrazione', 'A freddo'], ['Denominazione', 'Sabina DOP']],
      award: "Orciolo d'Oro 2012, Distinzione",
      formats: [{ size: '0,75 l', price: 19 }, { size: '0,5 l', price: 14 }]
    },
    {
      id: 'pepite-carboncella', name: "Pepite d'Aurum Carboncella", line: 'Monocultivar n°1', tag: 'Monocultivar',
      img: 'pepite-carboncella', imgW: 760,
      short: 'Solo olive di Carboncella, varietà rustica tipica della Sabina.',
      text: 'Solo olive di Carboncella, varietà rustica tipica della Sabina, raccolte a inizio novembre ed estratte a freddo.',
      specs: [['Cultivar', 'Carboncella 100%'], ['Raccolta', 'Inizio novembre'], ['Estrazione', 'A freddo']],
      award: "Aipo d'Argento 2014, Gran Menzione",
      formats: [{ size: '0,5 l', price: 18 }]
    },
    {
      id: 'pepite-frantoio', name: "Pepite d'Aurum Frantoio", line: 'Monocultivar n°2', tag: 'Monocultivar',
      img: 'pepite-frantoio', imgW: 640,
      short: 'Solo olive di Frantoio, raccolte a fine ottobre. "Grande Olio" Slow Food.',
      text: 'Solo olive di Frantoio, varietà dal gusto pieno, raccolte a fine ottobre ed estratte a freddo.',
      specs: [['Cultivar', 'Frantoio 100%'], ['Raccolta', 'Fine ottobre'], ['Estrazione', 'A freddo']],
      award: '"Grande Olio" Slow Food 2016',
      formats: [{ size: '0,5 l', price: 18 }]
    },
    {
      id: 'rucolio', name: 'RucOlio', line: 'Olive e rucola selvatica', tag: 'Con erbe selvatiche',
      img: 'rucolio', imgW: 700,
      short: 'Olive frante con la rucola selvatica che cresce sotto i nostri ulivi.',
      text: 'Olive macinate insieme alla rucola selvatica fresca, quella che cresce spontanea sotto i nostri ulivi. Lo facciamo dal 2013.',
      specs: [['Lavorazione', 'Frangitura con rucola fresca'], ['Dal', '2013'], ['Estrazione', 'A freddo']],
      formats: [{ size: '0,25 l', price: 8.5 }]
    }
  ];
  var FREE_SHIPPING = 59; // esempio
  var SHIPPING = 8.9;    // esempio
  var KEY = 'aurum-cart';

  var euro = function (n) { return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }); };
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  var cart = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} update(); }

  function lines() {
    return cart.map(function (l) {
      var p = byId(l.id); if (!p) return null;
      var f = p.formats[l.f] || p.formats[0];
      return { key: l.id + '|' + l.f, p: p, f: f, qty: l.qty, total: f.price * l.qty };
    }).filter(Boolean);
  }
  function totals() {
    var sub = lines().reduce(function (s, l) { return s + l.total; }, 0);
    var ship = sub === 0 || sub >= FREE_SHIPPING ? 0 : SHIPPING;
    return { sub: sub, ship: ship, total: sub + ship, count: cart.reduce(function (s, l) { return s + l.qty; }, 0) };
  }
  function add(id, f, qty) {
    var l = cart.filter(function (x) { return x.id === id && x.f === f; })[0];
    if (l) l.qty = Math.min(99, l.qty + qty); else cart.push({ id: id, f: f, qty: qty });
    save();
  }
  function setQty(key, qty) {
    var k = key.split('|');
    cart = cart.map(function (l) { if (l.id === k[0] && String(l.f) === k[1]) l.qty = qty; return l; })
      .filter(function (l) { return l.qty > 0; });
    save();
  }

  /* --- schede prodotto --- */
  function card(p) {
    var opts = p.formats.length > 1
      ? '<div class="formats" role="radiogroup" aria-label="Formato">' + p.formats.map(function (f, i) {
          return '<label><input type="radio" name="f-' + p.id + '" value="' + i + '"' + (i ? '' : ' checked') + '><span>' + f.size + '</span></label>';
        }).join('') + '</div>'
      : '<p class="format-one">' + p.formats[0].size + '</p>';
    return '<article class="product" data-id="' + p.id + '">' +
      '<a class="product__img" href="prodotto.html?p=' + p.id + '" tabindex="-1" aria-hidden="true">' +
        '<img src="img/' + p.img + '-480.webp" srcset="img/' + p.img + '-480.webp 480w, img/' + p.img + '-' + p.imgW + '.webp ' + p.imgW + 'w" sizes="(min-width: 1000px) 280px, (min-width: 620px) 45vw, 92vw" width="480" height="600" alt="" loading="lazy">' +
        '<span class="tag tag--on-img">' + p.tag + '</span></a>' +
      '<div class="product__body">' +
        '<h3><a href="prodotto.html?p=' + p.id + '">' + esc(p.name) + '</a></h3>' +
        '<p class="product__line">' + esc(p.line) + '</p>' +
        opts +
        '<div class="product__buy"><span class="price" data-price>' + euro(p.formats[0].price) + '</span>' +
        '<button class="btn btn--sm" type="button" data-add>Aggiungi</button></div>' +
      '</div></article>';
  }
  var grid = document.querySelector('[data-shop]');
  if (grid) {
    grid.innerHTML = PRODUCTS.map(card).join('');
    grid.addEventListener('change', function (e) {
      if (!e.target.matches('input[type=radio]')) return;
      var el = e.target.closest('.product');
      el.querySelector('[data-price]').textContent = euro(byId(el.dataset.id).formats[+e.target.value].price);
    });
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-add]'); if (!b) return;
      var el = b.closest('.product'); var r = el.querySelector('input:checked');
      add(el.dataset.id, r ? +r.value : 0, 1);
      openDrawer(b);
    });
  }

  /* --- pagina prodotto --- */
  var pd = document.querySelector('[data-product]');
  if (pd) {
    var p = byId(new URLSearchParams(location.search).get('p')) || PRODUCTS[0];
    document.title = p.name + ' · Aurum Sabinae';
    pd.innerHTML =
      '<div class="pd__media"><img src="img/' + p.img + '-' + p.imgW + '.webp" width="' + p.imgW + '" height="' + Math.round(p.imgW * 1.25) + '" alt="Bottiglia di ' + esc(p.name) + '"></div>' +
      '<div class="pd__info">' +
        '<nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="index.html#shop">Shop</a><span aria-hidden="true">/</span><span>' + esc(p.name) + '</span></nav>' +
        '<span class="tag">' + p.tag + '</span>' +
        '<h1>' + esc(p.name) + '</h1>' +
        '<p class="pd__line">' + esc(p.line) + '</p>' +
        (p.award ? '<p class="award"><svg aria-hidden="true"><use href="#i-award"/></svg>' + esc(p.award) + '</p>' : '') +
        '<p class="pd__price"><span data-price>' + euro(p.formats[0].price) + '</span> <small>IVA inclusa</small></p>' +
        '<p>' + esc(p.text) + '</p>' +
        '<fieldset class="formats formats--lg"><legend>Formato</legend>' + p.formats.map(function (f, i) {
          return '<label><input type="radio" name="fmt" value="' + i + '"' + (i ? '' : ' checked') + '><span>' + f.size + '</span></label>';
        }).join('') + '</fieldset>' +
        '<div class="pd__buy"><div class="qty"><button type="button" data-step="-1" aria-label="Una bottiglia in meno">−</button><output aria-live="polite">1</output><button type="button" data-step="1" aria-label="Una bottiglia in più">+</button></div>' +
        '<button class="btn" type="button" data-add>Aggiungi al carrello</button></div>' +
        '<ul class="perks"><li>Spedizione gratuita sopra ' + euro(FREE_SHIPPING) + '</li><li>Direttamente dal produttore, Montelibretti (RM)</li><li>Conservato al riparo dall\'ossigeno</li></ul>' +
        '<dl class="specs specs--pd">' + p.specs.map(function (s) { return '<dt>' + s[0] + '</dt><dd>' + esc(s[1]) + '</dd>'; }).join('') + '</dl>' +
      '</div>';
    var out = pd.querySelector('output');
    pd.addEventListener('change', function (e) {
      if (e.target.name === 'fmt') pd.querySelector('[data-price]').textContent = euro(p.formats[+e.target.value].price);
    });
    pd.addEventListener('click', function (e) {
      var s = e.target.closest('[data-step]');
      if (s) out.value = Math.max(1, Math.min(99, +out.value + +s.dataset.step));
      var b = e.target.closest('[data-add]');
      if (b) { add(p.id, +pd.querySelector('input[name=fmt]:checked').value, +out.value); openDrawer(b); }
    });
    var others = document.querySelector('[data-others]');
    if (others) others.innerHTML = PRODUCTS.filter(function (x) { return x.id !== p.id; }).slice(0, 4).map(card).join('');
    if (others) others.addEventListener('click', function (e) {
      var b = e.target.closest('[data-add]'); if (!b) return;
      var el = b.closest('.product'); var r = el.querySelector('input:checked');
      add(el.dataset.id, r ? +r.value : 0, 1); openDrawer(b);
    });
  }

  /* --- prenota novello --- */
  document.querySelectorAll('[data-reserve]').forEach(function (b) {
    b.addEventListener('click', function () { toast('Prenotazione registrata: ti avvisiamo quando il novello è pronto (funzione dimostrativa).'); });
  });

  /* --- carrello laterale --- */
  var drawer = document.getElementById('cart');
  var lastFocus = null;
  function lineHtml(l) {
    return '<li class="cart-line" data-key="' + l.key + '">' +
      '<img src="img/' + l.p.img + '-480.webp" width="64" height="80" alt="">' +
      '<div><p class="cart-line__name">' + esc(l.p.name) + '</p><p class="cart-line__meta">' + l.f.size + ' · ' + euro(l.f.price) + '</p>' +
      '<div class="qty qty--sm"><button type="button" data-q="-1" aria-label="Togli una">−</button><output>' + l.qty + '</output><button type="button" data-q="1" aria-label="Aggiungi una">+</button></div></div>' +
      '<span class="cart-line__total">' + euro(l.total) + '</span></li>';
  }
  function update() {
    var t = totals();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = t.count; el.hidden = t.count === 0;
    });
    document.querySelectorAll('.cart-btn').forEach(function (el) {
      el.setAttribute('aria-label', 'Carrello, ' + t.count + (t.count === 1 ? ' articolo' : ' articoli'));
    });
    var ls = lines();
    document.querySelectorAll('[data-cart-lines]').forEach(function (ul) {
      ul.innerHTML = ls.length ? ls.map(lineHtml).join('') : '<li class="cart-empty">Il carrello è vuoto.<br><a href="index.html#shop">Scopri i nostri oli</a></li>';
    });
    var left = FREE_SHIPPING - t.sub;
    document.querySelectorAll('[data-ship-note]').forEach(function (el) {
      el.innerHTML = t.sub === 0 ? 'Spedizione gratuita sopra ' + euro(FREE_SHIPPING)
        : left > 0 ? 'Ti mancano <b>' + euro(left) + '</b> per la spedizione gratuita' : '<b>Spedizione gratuita</b> sul tuo ordine';
      var bar = el.nextElementSibling;
      if (bar && bar.classList.contains('ship-bar')) bar.firstElementChild.style.width = Math.min(100, t.sub / FREE_SHIPPING * 100) + '%';
    });
    document.querySelectorAll('[data-sub]').forEach(function (el) { el.textContent = euro(t.sub); });
    document.querySelectorAll('[data-ship]').forEach(function (el) { el.textContent = t.ship ? euro(t.ship) : 'Gratis'; });
    document.querySelectorAll('[data-total]').forEach(function (el) { el.textContent = euro(t.total); });
    document.querySelectorAll('[data-checkout]').forEach(function (el) { el.classList.toggle('is-disabled', t.count === 0); el.setAttribute('aria-disabled', String(t.count === 0)); });
  }
  function openDrawer(from) {
    if (!drawer) return;
    lastFocus = from || document.activeElement;
    drawer.hidden = false;
    void drawer.offsetWidth; // forza il layout così la transizione parte
    drawer.classList.add('is-open');
    document.body.classList.add('menu-open');
    drawer.querySelector('.cart__close').focus();
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setTimeout(function () { drawer.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('.cart-btn')) { e.preventDefault(); openDrawer(e.target.closest('.cart-btn')); return; }
    if (e.target.closest('.cart__close') || e.target.matches('.cart__backdrop')) closeDrawer();
    var q = e.target.closest('[data-q]');
    if (q) {
      var li = q.closest('[data-key]'); var n = +li.querySelector('output').value + +q.dataset.q;
      setQty(li.dataset.key, Math.max(0, Math.min(99, n)));
    }
    var c = e.target.closest('[data-checkout].is-disabled');
    if (c) e.preventDefault();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* --- cassa --- */
  var form = document.getElementById('checkout');
  if (form) {
    form.addEventListener('change', function (e) {
      if (e.target.name === 'consegna') form.querySelector('[data-address]').hidden = e.target.value !== 'spedizione';
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      toast(totals().count ? 'Questa è una bozza: nel sito vero qui si paga e Leonardo riceve l\'ordine.' : 'Il carrello è vuoto.');
    });
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('is-on'); }, 4200);
  }

  update();
})();
