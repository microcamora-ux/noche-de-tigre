/* NOCHE DE TIGRE · v3 · movimiento
   1. Divide los textos [data-dividir] en palabras para revelarlas desde una máscara.
   2. Marca la página como lista cuando cargan las fuentes (arranca la entrada de la portada).
   3. Deriva: las piezas se desplazan dentro de su marco al hacer scroll, con inercia.
   4. Visor: en el programa, la pieza de cada momento sigue al cursor y se inclina con la velocidad.
   Solo transform/opacity/clip-path. Sin movimiento con prefers-reduced-motion. */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var todos = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* 1 · División en palabras (conserva <em> y demás etiquetas en línea) */
  var indice;
  var dividir = function (nodo) {
    Array.prototype.slice.call(nodo.childNodes).forEach(function (hijo) {
      if (hijo.nodeType === 3) {
        var trozos = hijo.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        trozos.forEach(function (t) {
          if (!t) { return; }
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          var m = document.createElement('span');
          m.className = 'mascara';
          var p = document.createElement('span');
          p.textContent = t;
          p.style.setProperty('--w', indice++);
          m.appendChild(p);
          frag.appendChild(m);
        });
        nodo.replaceChild(frag, hijo);
      } else if (hijo.nodeType === 1) {
        dividir(hijo);
      }
    });
  };
  todos('[data-dividir]').forEach(function (el) {
    indice = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    dividir(el);
    todos('.mascara', el).forEach(function (m) { m.setAttribute('aria-hidden', 'true'); });
  });

  /* 2 · Entrada de la portada */
  var listo = function () { raiz.classList.add('listo'); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(listo);
    setTimeout(listo, 1500);
  } else {
    listo();
  }

  if (reducir) { return; }

  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* 3 · Deriva dentro del marco */
  var derivas = todos('[data-deriva]').map(function (el) {
    return { el: el, f: el.getAttribute('data-deriva') === 'lento' ? 0.05 : 0.09, y: 0 };
  });

  var deslizantes = todos('[data-desliza]').map(function (el) { return { el: el, x: 0 }; });

  /* 4 · Visor del programa */
  var visor = document.querySelector('.visor');
  var visorImg = visor && visor.querySelector('img');
  var lista = document.querySelector('.programa');
  var punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var v = { x: 0, y: 0, tx: 0, ty: 0, rot: 0, activo: false };

  if (visor && lista && punteroFino) {
    raiz.classList.add('con-visor');
    lista.addEventListener('pointermove', function (e) {
      v.tx = e.clientX;
      v.ty = e.clientY;
      if (!v.activo) { v.x = v.tx; v.y = v.ty; }
      pedir();
    });
    todos('.programa__fila', lista).forEach(function (fila) {
      fila.addEventListener('pointerenter', function () {
        var src = fila.getAttribute('data-objeto');
        if (src && visorImg.getAttribute('src') !== src) {
          visorImg.setAttribute('src', src);
          visor.classList.remove('cambio');
          void visor.offsetWidth;
          visor.classList.add('cambio');
        }
        v.activo = true;
        visor.classList.add('activo');
      });
    });
    lista.addEventListener('pointerleave', function () {
      v.activo = false;
      visor.classList.remove('activo');
    });
  }

  /* Bucle único, solo mientras haya algo que mover */
  var enMarcha = false;
  var pedir = function () { if (!enMarcha) { enMarcha = true; requestAnimationFrame(cuadro); } };

  var cuadro = function () {
    enMarcha = false;
    var seguir = false;
    var alto = window.innerHeight;

    derivas.forEach(function (d) {
      var r = d.el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > alto + 100) { return; }
      var objetivo = ((r.top + r.height / 2) - alto / 2) * -d.f;
      d.y = lerp(d.y, objetivo, 0.09);
      if (Math.abs(d.y - objetivo) > 0.1) { seguir = true; }
      d.el.style.transform = 'translate3d(0,' + d.y.toFixed(2) + 'px,0) scale(1.08)';
    });

    deslizantes.forEach(function (d) {
      var r = d.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > alto) { return; }
      var objetivo = (r.top - alto) * 0.35;
      d.x = lerp(d.x, objetivo, 0.08);
      if (Math.abs(d.x - objetivo) > 0.1) { seguir = true; }
      d.el.style.transform = 'translate3d(' + d.x.toFixed(2) + 'px,0,0)';
    });

    if (visor && punteroFino) {
      var px = v.x;
      v.x = lerp(v.x, v.tx, 0.14);
      v.y = lerp(v.y, v.ty, 0.14);
      var vel = v.x - px;
      v.rot = lerp(v.rot, Math.max(-12, Math.min(12, vel * 0.6)), 0.12);
      visor.style.transform = 'translate3d(' + v.x.toFixed(1) + 'px,' + v.y.toFixed(1) + 'px,0) translate(-50%,-50%) rotate(' + v.rot.toFixed(2) + 'deg)';
      if (Math.abs(v.x - v.tx) > 0.3 || Math.abs(v.y - v.ty) > 0.3 || Math.abs(v.rot) > 0.05) { seguir = true; }
    }

    if (seguir) { pedir(); }
  };

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  pedir();
})();
