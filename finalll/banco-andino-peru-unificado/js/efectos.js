// Efectos comunes: aparición al hacer scroll, transición entre páginas y carrusel de la portada.
const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1) Aparición al hacer scroll
if (!reducir && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('main section h2, main section h3, .card-servicio, .acceso, .tarjeta-contacto, .widget-calificacion, .tabla-comparativa, .footer-inner > div')
    .forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      obs.observe(el);
    });
}

// 2) Transición suave al cambiar de página
if (!reducir) {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto:|tel:|https?:)/.test(href)) return;
    e.preventDefault();
    document.body.classList.add('saliendo');
    setTimeout(() => { window.location.href = href; }, 250);
  });
  window.addEventListener('pageshow', () => document.body.classList.remove('saliendo'));
}

// 3) Carrusel de la portada (cambia de imagen, puntos y botón de pausa)
const carrusel = document.querySelector('.hero-carrusel');
if (carrusel) {
  const img = carrusel.querySelector('img');
  const puntos = [...carrusel.querySelectorAll('.dot')];
  const pausa = carrusel.querySelector('.hero-carrusel-pausa');
  const fotos = ['img/carrucel2.avif', 'img/carrucel3.avif'];
  puntos.forEach((p, i) => { if (i >= fotos.length) p.style.display = 'none'; });
  let actual = 0, enPausa = false;
  const ir = n => {
    actual = (n + fotos.length) % fotos.length;
    img.classList.add('cambiando');
    setTimeout(() => {
      img.src = fotos[actual];
      img.classList.remove('cambiando');
      puntos.forEach((p, i) => p.classList.toggle('is-activo', i === actual));
    }, 400);
  };
  puntos.forEach((p, i) => p.addEventListener('click', () => ir(i)));
  pausa.addEventListener('click', () => { enPausa = !enPausa; pausa.textContent = enPausa ? '▶' : '⏸'; });
  if (!reducir) setInterval(() => { if (!enPausa) ir(actual + 1); }, 4500);
}
