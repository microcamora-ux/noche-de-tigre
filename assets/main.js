/* NOCHE DE TIGRE · aplica los campos pendientes definidos en index.html (window.NOCHE_DE_TIGRE).
   Sin JavaScript la página muestra los valores por defecto ("Fecha por confirmar", sin dirección,
   sin mapa y con "Ver programa" como única llamada a la acción). */
(function () {
  'use strict';

  var cfg = window.NOCHE_DE_TIGRE || {};
  var texto = function (v) { return typeof v === 'string' ? v.trim() : ''; };
  var esUrl = function (u) { return /^(https?:\/\/|mailto:)/i.test(u); };
  var todos = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var fecha = texto(cfg.fecha);
  var direccion = texto(cfg.direccion);
  var mapaUrl = texto(cfg.mapaUrl);
  var confirmacionUrl = texto(cfg.confirmacionUrl);

  if (fecha) {
    todos('[data-campo="fecha"]').forEach(function (el) {
      el.textContent = fecha;
      el.classList.add('es-definitivo');
    });
  }

  if (direccion) {
    todos('[data-campo="direccion"]').forEach(function (el) {
      el.textContent = direccion;
      el.hidden = false;
    });
  }

  if (mapaUrl && esUrl(mapaUrl)) {
    todos('[data-campo="mapa"]').forEach(function (el) {
      el.href = mapaUrl;
      el.target = '_blank';
      el.rel = 'noopener';
      el.hidden = false;
    });
  }

  if (confirmacionUrl && esUrl(confirmacionUrl)) {
    todos('[data-campo="confirmacion"]').forEach(function (el) {
      el.href = confirmacionUrl;
      el.hidden = false;
    });
    // Con URL real, "Confirmar asistencia" pasa a ser la llamada principal y "Ver programa" queda como secundaria
    document.body.classList.add('con-confirmacion');
  }

  /* ---- Instagram: convierte en enlace cada nombre cuyo usuario esté configurado ---- */
  var instagram = cfg.instagram || {};
  var urlInstagram = function (valor) {
    var v = texto(valor);
    if (!v) { return ''; }
    if (/^https?:\/\/(www\.)?instagram\.com\//i.test(v)) { return v; }
    v = v.replace(/^@/, '').replace(/\/+$/, '');
    return /^[A-Za-z0-9._]{1,30}$/.test(v) ? 'https://www.instagram.com/' + v + '/' : '';
  };
  var avisoPestana = function () {
    var aviso = document.createElement('span');
    aviso.className = 'visualmente-oculto';
    aviso.textContent = ' (Instagram, se abre en una pestaña nueva)';
    return aviso;
  };

  todos('[data-instagram]').forEach(function (el) {
    var url = urlInstagram(instagram[el.getAttribute('data-instagram')]);
    if (!url) { return; }
    var enlace = document.createElement('a');
    enlace.className = el.className;
    enlace.href = url;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    enlace.textContent = el.textContent;
    enlace.appendChild(avisoPestana());
    el.parentNode.replaceChild(enlace, el);
  });

  todos('[data-instagram-boton]').forEach(function (el) {
    var url = urlInstagram(instagram[el.getAttribute('data-instagram-boton')]);
    if (!url) { return; }
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener';
    el.appendChild(avisoPestana());
    el.hidden = false;
  });

  /* ---- Revelado al hacer scroll ----
     Los estados iniciales solo existen con la clase .js en <html> y sin prefers-reduced-motion,
     así que el contenido es visible aunque este código no llegue a ejecutarse. */
  var objetivos = todos('[data-revelar]');
  var reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mostrar = function (el) { el.classList.add('visto'); };

  if (reducirMovimiento || !('IntersectionObserver' in window)) {
    objetivos.forEach(mostrar);
    return;
  }

  // Los titulares se ocultan con clip-path y el navegador considera que un elemento recortado
  // del todo no interseca nunca, así que para ellos se observa el contenedor padre.
  var vigilados = new Map();
  objetivos.forEach(function (el) {
    var ancla = el.getAttribute('data-revelar') === 'titulo' && el.parentElement ? el.parentElement : el;
    if (!vigilados.has(ancla)) { vigilados.set(ancla, []); }
    vigilados.get(ancla).push(el);
  });

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) { return; }
      (vigilados.get(entrada.target) || []).forEach(mostrar);
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  vigilados.forEach(function (_, ancla) { observador.observe(ancla); });
})();
