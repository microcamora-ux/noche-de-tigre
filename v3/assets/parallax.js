/* NOCHE DE TIGRE · v3 · paralaje suave al hacer scroll y al mover el ratón en la primera pantalla.
   Solo transform; se desactiva con prefers-reduced-motion. */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  var capas = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!capas.length) { return; }

  var raton = { x: 0, y: 0 };
  var pendiente = false;

  var pintar = function () {
    pendiente = false;
    var y = window.scrollY;
    capas.forEach(function (el) {
      var f = parseFloat(el.getAttribute('data-parallax')) || 0;
      var dx = raton.x * f * 60;
      var dy = y * f + raton.y * f * 60;
      el.style.setProperty('--px', dx.toFixed(1) + 'px');
      el.style.setProperty('--py', dy.toFixed(1) + 'px');
    });
  };
  var pedir = function () { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } };

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') { return; }
    raton.x = e.clientX / window.innerWidth - 0.5;
    raton.y = e.clientY / window.innerHeight - 0.5;
    pedir();
  }, { passive: true });
  pintar();
})();
