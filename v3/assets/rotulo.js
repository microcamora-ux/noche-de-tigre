/* NOCHE DE TIGRE · rotulación propia
   Alfabeto de capitulares dibujado para la noche siguiendo el método de Chachánika
   (Studio A, Mundo Chachapoyas): geometría de cantería de Kuélap, chaflanes a 45°,
   contraformas en rombo y cortes de esténcil. No reproduce sus glifos.

   Uso: <h2 data-rotulo>Programa</h2> → el texto se dibuja en SVG y se mantiene
   para lectores de pantalla. Altura de mayúscula = 100 unidades; trazo = 16. */
(function () {
  'use strict';

  var R = function (x, y, w, h) { return 'M' + x + ' ' + y + 'h' + w + 'v' + h + 'h' + (-w) + 'Z'; };
  var P = function (pts) { return 'M' + pts.join('L') + 'Z'; };

  // Cada glifo: [anchura, [trazados]]
  var G = {
    A: [72, [P(['0 100', '16 100', '36 24', '56 100', '72 100', '45 0', '27 0']), P(['36 56', '43 70', '36 84', '29 70'])]],
    C: [64, [P(['20 0', '64 0', '64 16', '26.6 16', '16 26.6', '16 73.4', '26.6 84', '64 84', '64 100', '20 100', '0 80', '0 20'])]],
    D: [68, [R(0, 0, 16, 100), P(['22 0', '48 0', '68 20', '68 80', '48 100', '22 100', '22 84', '41.4 84', '52 73.4', '52 26.6', '41.4 16', '22 16'])]],
    E: [56, [R(0, 0, 16, 100), R(22, 0, 34, 16), R(22, 42, 26, 16), R(22, 84, 34, 16)]],
    G: [68, [P(['20 0', '68 0', '68 16', '26.6 16', '16 26.6', '16 73.4', '26.6 84', '52 84', '52 64', '36 64', '36 48', '68 48', '68 100', '20 100', '0 80', '0 20'])]],
    H: [64, [R(0, 0, 16, 100), R(48, 0, 16, 100), R(22, 42, 20, 16)]],
    I: [16, [R(0, 0, 16, 100)]],
    L: [56, [R(0, 0, 16, 78), R(0, 84, 56, 16)]],
    M: [88, [R(0, 0, 16, 100), R(72, 0, 16, 100), P(['16 0', '34 0', '44 38', '54 0', '72 0', '53 72', '35 72'])]],
    N: [72, [R(0, 0, 16, 100), R(56, 0, 16, 100), P(['16 0', '35 0', '56 100', '37 100'])]],
    O: [72, ['M20 0L52 0L72 20L72 80L52 100L20 100L0 80L0 20Z M36 16L16 50L36 84L56 50Z']],
    P: [62, [R(0, 0, 16, 100), P(['22 0', '44 0', '62 18', '62 42', '44 60', '22 60', '22 44', '37.4 44', '46 35.4', '46 24.6', '37.4 16', '22 16'])]],
    R: [64, [R(0, 0, 16, 100), P(['22 0', '44 0', '62 18', '62 40', '44 58', '22 58', '22 42', '37.4 42', '46 33.4', '46 24.6', '37.4 16', '22 16']), P(['30 64', '46 64', '64 100', '48 100'])]],
    T: [64, [R(0, 0, 64, 16), R(24, 22, 16, 78)]],
    U: [64, [P(['0 0', '16 0', '16 73.4', '26.6 84', '37.4 84', '48 73.4', '48 0', '64 0', '64 80', '44 100', '20 100', '0 80'])]]
  };
  var ESPACIO = 34;
  var TRACK = 12;

  var dibujar = function (texto) {
    var x = 0;
    var cuerpos = [];
    var n = 0;
    texto.toUpperCase().split('').forEach(function (c) {
      if (c === ' ') { x += ESPACIO; return; }
      var g = G[c];
      if (!g) { return; }
      cuerpos.push('<g class="glifo" style="--g:' + (n++) + '" transform="translate(' + x + ' 0)"><path d="' + g[1].join(' ') + '" fill-rule="evenodd"/></g>');
      x += g[0] + TRACK;
    });
    var ancho = Math.max(x - TRACK, 1);
    return '<svg class="rotulo__svg" viewBox="0 -2 ' + ancho + ' 104" style="--ancho:' + ancho + '" aria-hidden="true" focusable="false">' + cuerpos.join('') + '</svg>';
  };

  Array.prototype.slice.call(document.querySelectorAll('[data-rotulo]')).forEach(function (el) {
    el.querySelectorAll('[data-linea]').length
      ? Array.prototype.slice.call(el.querySelectorAll('[data-linea]')).forEach(function (linea) { pintar(linea); })
      : pintar(el);
  });

  function pintar(el) {
    var texto = el.textContent.replace(/\s+/g, ' ').trim();
    var oculto = document.createElement('span');
    oculto.className = 'visualmente-oculto';
    oculto.textContent = texto;
    el.innerHTML = dibujar(texto);
    el.appendChild(oculto);
    el.classList.add('rotulo');
  }

  window.NOCHE_ROTULO = dibujar;
})();
