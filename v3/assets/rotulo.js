/* NOCHE DE TIGRE · rotulación propia
   Alfabeto de capitulares dibujado para la noche siguiendo el método de Chachánika
   (Studio A, Mundo Chachapoyas): geometría de cantería de Kuélap, chaflanes a 45°,
   contraformas en rombo y cortes de esténcil. No reproduce sus glifos.

   Uso: <h2 data-rotulo>Programa</h2> → el texto se dibuja en SVG y se mantiene
   para lectores de pantalla. Grosor con data-peso="fino" | "regular" | "negro"
   (en el elemento o en cada [data-linea]). Altura de mayúscula = 100 unidades. */
(function () {
  'use strict';

  var PESOS = { fino: 8, regular: 16, negro: 27 };
  var HUECO = 6;
  var RAIZ2 = Math.SQRT2;

  var n = function (v) { return Math.round(v * 10) / 10; };
  var R = function (x, y, w, h) { return 'M' + n(x) + ' ' + n(y) + 'h' + n(w) + 'v' + n(h) + 'h' + n(-w) + 'Z'; };
  var P = function (pts) { return 'M' + pts.map(function (p) { return n(p[0]) + ' ' + n(p[1]); }).join('L') + 'Z'; };

  // Devuelve los glifos para un grosor de trazo s: { letra: [anchura, [trazados]] }
  var alfabeto = function (s) {
    var d = s - 16;
    var g = HUECO;
    var c = 20 + d * 0.5;              // chaflán exterior
    var k = c + s * RAIZ2 - s;         // chaflán interior equivalente
    var G = {};

    var w = 72 + d;
    var t = 10 + d * 0.45;
    G.A = [w, [P([[0, 100], [s, 100], [w / 2, 22 + s * 0.4], [w - s, 100], [w, 100], [w / 2 + t, 0], [w / 2 - t, 0]]),
      P([[w / 2, 66 - s * 0.35], [w / 2 + s * 0.42, 74], [w / 2, 82 + s * 0.35], [w / 2 - s * 0.42, 74]])]];

    w = 64 + d;
    G.C = [w, [P([[c, 0], [w, 0], [w, s], [k, s], [s, k], [s, 100 - k], [k, 100 - s], [w, 100 - s], [w, 100], [c, 100], [0, 100 - c], [0, c]])]];

    w = 68 + d;
    G.D = [w, [R(0, 0, s, 100), P([[s + g, 0], [w - c, 0], [w, c], [w, 100 - c], [w - c, 100], [s + g, 100], [s + g, 100 - s], [w - k, 100 - s], [w - s, 100 - k], [w - s, k], [w - k, s], [s + g, s]])]];

    w = 56 + d;
    G.E = [w, [R(0, 0, s, 100), R(s + g, 0, w - s - g, s), R(s + g, 50 - s / 2, (w - s - g) * 0.78, s), R(s + g, 100 - s, w - s - g, s)]];

    w = 68 + d;
    var bx = w * 0.5;
    var by = Math.min(48, 100 - 2 * s - 6);   // la barra sube cuando el trazo engorda
    G.G = [w, [P([[c, 0], [w, 0], [w, s], [k, s], [s, k], [s, 100 - k], [k, 100 - s], [w - s, 100 - s], [w - s, by + s], [bx, by + s], [bx, by], [w, by], [w, 100], [c, 100], [0, 100 - c], [0, c]])]];

    w = 64 + d;
    G.H = [w, [R(0, 0, s, 100), R(w - s, 0, s, 100), R(s + g, 50 - s / 2, w - 2 * s - 2 * g, s)]];

    G.I = [s, [R(0, 0, s, 100)]];

    w = 56 + d;
    G.L = [w, [R(0, 0, s, 100 - s - g), R(0, 100 - s, w, s)]];

    w = 88 + d * 1.5;
    var v = 18 + d * 0.4;
    G.M = [w, [R(0, 0, s, 100), R(w - s, 0, s, 100), P([[s, 0], [s + v, 0], [w / 2, 38], [w - s - v, 0], [w - s, 0], [w / 2 + v / 2, 72], [w / 2 - v / 2, 72]])]];

    w = 72 + d;
    var dn = 19 + d * 0.55;
    G.N = [w, [R(0, 0, s, 100), R(w - s, 0, s, 100), P([[s, 0], [s + dn, 0], [w - s, 100], [w - s - dn, 100]])]];

    w = 72 + d;
    G.O = [w, [P([[c, 0], [w - c, 0], [w, c], [w, 100 - c], [w - c, 100], [c, 100], [0, 100 - c], [0, c]]) + ' ' +
      P([[w / 2, s], [s, 50], [w / 2, 100 - s], [w - s, 50]])]];

    var cuenco = function (w, hb) {
      var c2 = 18 + d * 0.4;
      var k2 = Math.min(c2 + s * RAIZ2 - s, hb / 2);   // la contraforma nunca se invierte
      return P([[s + g, 0], [w - c2, 0], [w, c2], [w, hb - c2], [w - c2, hb], [s + g, hb], [s + g, hb - s], [w - k2, hb - s], [w - s, hb - k2], [w - s, k2], [w - k2, s], [s + g, s]]);
    };
    w = 62 + d;
    G.P = [w, [R(0, 0, s, 100), cuenco(w, 60 + d * 0.8)]];

    w = 64 + d;
    var hb = 58 + d * 0.7;
    var px = s + g + (w - s - g) * 0.25;
    G.R = [w, [R(0, 0, s, 100), cuenco(w, hb), P([[px, hb + g], [px + s, hb + g], [w, 100], [w - s, 100]])]];

    w = 64 + d;
    G.T = [w, [R(0, 0, w, s), R(w / 2 - s / 2, s + g, s, 100 - s - g)]];

    w = 64 + d;
    G.U = [w, [P([[0, 0], [s, 0], [s, 100 - k], [k, 100 - s], [w - k, 100 - s], [w - s, 100 - k], [w - s, 0], [w, 0], [w, 100 - c], [w - c, 100], [c, 100], [0, 100 - c]])]];

    return G;
  };

  var cache = {};
  var dibujar = function (texto, peso) {
    var s = PESOS[peso] || PESOS.regular;
    var G = cache[s] || (cache[s] = alfabeto(s));
    var track = 10 + s * 0.15;
    var espacio = 30 + s * 0.5;
    var x = 0;
    var i = 0;
    var cuerpos = [];
    texto.toUpperCase().split('').forEach(function (ch) {
      if (ch === ' ') { x += espacio; return; }
      var gl = G[ch];
      if (!gl) { return; }
      cuerpos.push('<g class="glifo" style="--g:' + (i++) + '" transform="translate(' + n(x) + ' 0)"><path d="' + gl[1].join(' ') + '" fill-rule="evenodd"/></g>');
      x += gl[0] + track;
    });
    var ancho = n(Math.max(x - track, 1));
    return '<svg class="rotulo__svg" viewBox="0 0 ' + ancho + ' 100" data-ancho="' + ancho + '" aria-hidden="true" focusable="false">' + cuerpos.join('') + '</svg>';
  };

  var pintar = function (el, pesoPadre) {
    var texto = el.textContent.replace(/\s+/g, ' ').trim();
    var peso = el.getAttribute('data-peso') || pesoPadre;
    var dibujo = dibujar(texto + (el.hasAttribute('data-espacio') ? ' ' : ''), peso);
    var oculto = document.createElement('span');
    oculto.className = 'visualmente-oculto';
    oculto.textContent = texto;
    el.innerHTML = dibujo;
    el.appendChild(oculto);
  };

  Array.prototype.slice.call(document.querySelectorAll('[data-rotulo]')).forEach(function (el) {
    var lineas = el.querySelectorAll('[data-linea]');
    var peso = el.getAttribute('data-peso');
    if (lineas.length) {
      Array.prototype.slice.call(lineas).forEach(function (l) { pintar(l, peso); });
    } else {
      pintar(el, peso);
    }
    el.classList.add('rotulo');
  });

  /* Bloques [data-bloque]: cada [data-fila] se ajusta para que todas las letras del bloque
     tengan la misma altura y la fila más larga ocupe el 100 % del ancho. */
  Array.prototype.slice.call(document.querySelectorAll('[data-bloque]')).forEach(function (bloque) {
    var filas = Array.prototype.slice.call(bloque.querySelectorAll('[data-fila]'));
    var sumas = filas.map(function (f) {
      return Array.prototype.slice.call(f.querySelectorAll('svg[data-ancho]')).reduce(function (t, svg) { return t + Number(svg.getAttribute('data-ancho')); }, 0);
    });
    var max = Math.max.apply(null, sumas);
    filas.forEach(function (f, i) {
      f.style.width = (sumas[i] / max * 100) + '%';
      Array.prototype.slice.call(f.querySelectorAll('[data-linea]')).forEach(function (l) {
        var svg = l.querySelector('svg[data-ancho]');
        if (svg) { l.style.flex = svg.getAttribute('data-ancho') + ' 1 0'; }
      });
    });
  });

  window.NOCHE_ROTULO = dibujar;
})();
