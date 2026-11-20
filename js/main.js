(function () {
  'use strict';

  var WHATSAPP = '50672431311';
  var calma = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      if (img.complete && img.naturalWidth > 0) f.hidden = false;
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

  // ---- Movimiento (solo si la persona no pidió menos movimiento)
  if (!calma && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('anim');

    // Números que cuentan hasta su valor
    var contar = function (el) {
      var fin = parseInt(el.getAttribute('data-final'), 10);
      var pref = el.getAttribute('data-prefijo') || '';
      var t0 = performance.now(), dur = 1600;
      (function paso(t) {
        var p = Math.min(1, (t - t0) / dur);
        var v = Math.round(fin * (1 - Math.pow(1 - p, 3)));
        el.textContent = pref + v;
        if (p < 1) requestAnimationFrame(paso);
      })(t0);
    };

    // Aparición al llegar a cada parte; se escalonan los hermanos
    var objetivos = document.querySelectorAll('.pilares li, .objetivos li, .servicios li, .datos > div, .vias li, .cifras > div, .videos li, .cita, .form');
    objetivos.forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentElement.children, function (x) { return x.tagName === el.tagName; });
      el.style.setProperty('--i', String(Math.max(0, hermanos.indexOf(el))));
    });
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('visto');
        io.unobserve(en.target);
        var num = en.target.querySelector('strong[data-final]');
        if (num) contar(num);
      });
    }, { threshold: 0.15 });
    objetivos.forEach(function (el) { io.observe(el); });

    // Los títulos se observan por su contenedor (recortados no cuentan como visibles)
    var ioTitulos = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.querySelectorAll(':scope > .titulo').forEach(function (t) { t.classList.add('visto'); });
        ioTitulos.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.titulo').forEach(function (t) { ioTitulos.observe(t.parentElement); });

    // Chispas de forja subiendo en la portada
    var cont = document.querySelector('.chispas');
    if (cont) {
      for (var n = 0; n < 22; n++) {
        var s = document.createElement('span');
        s.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
        s.style.setProperty('--s', (3 + Math.random() * 5).toFixed(1) + 'px');
        s.style.setProperty('--d', (5 + Math.random() * 6).toFixed(1) + 's');
        s.style.setProperty('--r', (-Math.random() * 10).toFixed(1) + 's');
        s.style.setProperty('--dx', ((Math.random() - 0.5) * 160).toFixed(0) + 'px');
        cont.appendChild(s);
      }
    }

    // La foto de portada se inclina siguiendo el puntero
    var hero = document.querySelector('.hero');
    var fotoHero = document.querySelector('.foto-hero');
    if (hero && fotoHero) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        fotoHero.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
      });
      hero.addEventListener('pointerleave', function () { fotoHero.style.transform = ''; });
    }
  }

  // ---- Videos de las tarjetas: se reproducen mudos solo mientras se ven
  var tarjetas = document.querySelectorAll('video[data-auto]');
  if (!calma && 'IntersectionObserver' in window) {
    var ioVideo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.6 });
    tarjetas.forEach(function (v) { ioVideo.observe(v); });
  }

  // ---- Visor para ampliar fotos y ver videos con sonido
  var visor = document.getElementById('visor');
  if (visor && typeof visor.showModal === 'function') {
    var medio = visor.querySelector('.visor-medio');
    var lista = [];
    var pos = 0;
    var vaciar = function () {
      var v = medio.querySelector('video');
      if (v) v.pause();
      medio.textContent = '';
    };
    var mostrar = function (i) {
      pos = (i + lista.length) % lista.length;
      var el = lista[pos];
      vaciar();
      if (el.getAttribute('data-visor') === 'video') {
        var vid = document.createElement('video');
        vid.src = el.getAttribute('data-src');
        vid.controls = true;
        vid.autoplay = true;
        vid.loop = true;
        vid.playsInline = true;
        medio.appendChild(vid);
      } else {
        var img = document.createElement('img');
        img.src = el.getAttribute('data-src');
        img.alt = el.getAttribute('data-alt') || '';
        medio.appendChild(img);
      }
    };
    var botones = document.querySelectorAll('[data-visor]');
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        var tipo = b.getAttribute('data-visor');
        lista = Array.prototype.filter.call(botones, function (x) { return x.getAttribute('data-visor') === tipo; });
        // las fotos ocultas por no cargar no se incluyen
        lista = lista.filter(function (x) { return !x.closest('[hidden]'); });
        visor.showModal();
        mostrar(lista.indexOf(b));
      });
    });
    visor.querySelector('.visor-ant').addEventListener('click', function () { mostrar(pos - 1); });
    visor.querySelector('.visor-sig').addEventListener('click', function () { mostrar(pos + 1); });
    visor.querySelector('.visor-cerrar').addEventListener('click', function () { visor.close(); });
    visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener('close', vaciar);
    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') mostrar(pos - 1);
      if (e.key === 'ArrowRight') mostrar(pos + 1);
    });
  }

  // ---- Barra de avance de lectura
  var barra = document.querySelector('.progreso');
  if (barra) {
    var pintar = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(3) : '0');
    };
    window.addEventListener('scroll', pintar, { passive: true });
    pintar();
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
