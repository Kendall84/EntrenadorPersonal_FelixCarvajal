(function () {
  'use strict';

  var WHATSAPP = '50672431311';

  // ---- Testimonios: agrega aquí los reales (se muestran solo si hay al menos uno)
  // Ejemplo: { texto: 'Bajé 8 kg en 3 meses.', autor: 'Nombre' }
  var TESTIMONIOS = [];

  // ---- Menú móvil
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', String(abierto));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('abierto');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Calor del título siguiendo al puntero (solo si no hay preferencia de menos movimiento)
  var titulo = document.querySelector('.hero-titulo');
  var calma = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (titulo && !calma) {
    titulo.addEventListener('pointermove', function (e) {
      var r = titulo.getBoundingClientRect();
      titulo.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      titulo.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  // ---- Fotos que aún no existen: respaldo limpio
  function sinImagen(img) {
    return img.complete && img.naturalWidth === 0;
  }
  document.querySelectorAll('.foto img').forEach(function (img) {
    var marcar = function () { img.parentElement.classList.add('sin-foto'); };
    if (sinImagen(img)) marcar();
    img.addEventListener('error', marcar);
  });

  // ---- Galería: muestra solo las fotos que cargan; sin fotos, la sección sigue oculta
  var seccionGaleria = document.getElementById('resultados');
  if (seccionGaleria) {
    var figuras = Array.prototype.slice.call(seccionGaleria.querySelectorAll('figure'));
    var revisar = function () {
      seccionGaleria.hidden = !figuras.some(function (f) { return !f.hidden; });
    };
    figuras.forEach(function (f) {
      var img = f.querySelector('img');
      f.hidden = true;
      var ok = function () { f.hidden = false; revisar(); };
      if (img.complete && img.naturalWidth > 0) f.hidden = false;
      img.addEventListener('load', ok);
    });
    revisar();
  }

  // ---- Testimonios: agrega aquí los reales (se muestran solo si hay al menos uno)
  // Ejemplo: { texto: 'Bajé 8 kg en 3 meses.', autor: 'Nombre' }
  var TESTIMONIOS = [];

  // ---- Menú móvil
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', String(abierto));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('abierto');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Calor del título siguiendo al puntero (solo si no hay preferencia de menos movimiento)
  var titulo = document.querySelector('.hero-titulo');
  var calma = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (titulo && !calma) {
    titulo.addEventListener('pointermove', function (e) {
      var r = titulo.getBoundingClientRect();
      titulo.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      titulo.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  // ---- Fotos que aún no existen: respaldo limpio
  function sinImagen(img) {
    return img.complete && img.naturalWidth === 0;
  }
  document.querySelectorAll('.foto img').forEach(function (img) {
    var marcar = function () { img.parentElement.classList.add('sin-foto'); };
    if (sinImagen(img)) marcar();
    img.addEventListener('error', marcar);
  });

  // ---- Galería: oculta fotos faltantes y la sección entera si no hay ninguna
  var seccionGaleria = document.getElementById('resultados');
  if (seccionGaleria) {
    var figuras = Array.prototype.slice.call(seccionGaleria.querySelectorAll('figure'));
    var revisar = function () {
      var vivas = figuras.filter(function (f) { return !f.hidden; });
      seccionGaleria.hidden = vivas.length === 0;
    };
    figuras.forEach(function (f) {
      var img = f.querySelector('img');
      var quitar = function () { f.hidden = true; revisar(); };
      if (sinImagen(img)) f.hidden = true;
      img.addEventListener('error', quitar);
      img.addEventListener('load', function () { f.hidden = false; revisar(); });
    });
    revisar();
  }

  // ---- Testimonios (se insertan con textContent, sin HTML)
  var seccionTest = document.getElementById('testimonios');
  var lista = document.getElementById('lista-testimonios');
  if (seccionTest && lista && TESTIMONIOS.length) {
    TESTIMONIOS.forEach(function (t) {
      var bq = document.createElement('blockquote');
      var p = document.createElement('p');
      p.textContent = '«' + t.texto + '»';
      var c = document.createElement('cite');
      c.textContent = t.autor;
      bq.appendChild(p);
      bq.appendChild(c);
      lista.appendChild(bq);
    });
    seccionTest.hidden = false;
  }

  // ---- Servicio elegido -> mensaje prellenado
  document.querySelectorAll('[data-servicio]').forEach(function (a) {
    a.addEventListener('click', function () {
      var campo = document.getElementById('mensaje');
      if (campo && !campo.value) campo.value = 'Quiero información sobre: ' + a.getAttribute('data-servicio') + '.';
    });
  });

  // ---- Formulario -> WhatsApp (validado y limpiado)
  function limpiar(texto, max) {
    return String(texto).replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  }
  var form = document.getElementById('form-contacto');
  var estado = document.getElementById('estado');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = limpiar(form.nombre.value, 60);
      var meta = limpiar(form.meta.value, 60);
      var mensaje = limpiar(form.mensaje.value, 400);
      if (nombre.length < 2) {
        estado.textContent = 'Escribe tu nombre para poder responderte.';
        form.nombre.focus();
        return;
      }
      var texto = 'Hola Rair, soy ' + nombre + '. Mi meta principal: ' + meta + '.' + (mensaje ? ' ' + mensaje : '');
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
      estado.textContent = 'Abriendo WhatsApp…';
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
