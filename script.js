// ===== Configuración: cambiar cuando Félix dé sus datos =====
const CONFIG = {
  whatsapp: "50600000000" // número con código de país, sin + ni espacios
};

document.documentElement.classList.add("js");

// Año del footer
document.getElementById("year").textContent = new Date().getFullYear();

// WhatsApp flotante
document.getElementById("waFloat").href = "https://wa.me/" + CONFIG.whatsapp;

// Menú móvil y barra al hacer scroll
const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
});
menu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.classList.remove("open");
  })
);
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Aparición de secciones, barras de habilidades y contadores
const animateCount = el => {
  const target = +el.dataset.target;
  const start = performance.now();
  const dur = 1400;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("show");
    const fill = el.querySelector(".fill");
    if (fill) fill.style.width = fill.dataset.width + "%";
    io.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countIO.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll(".num").forEach(el => countIO.observe(el));

// Testimonios
const slides = [...document.querySelectorAll(".slide")];
const dots = document.getElementById("dots");
let current = 0, timer;

slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", "Testimonio " + (i + 1));
  b.addEventListener("click", () => { show(i); restart(); });
  dots.appendChild(b);
});

function show(i) {
  current = i;
  slides.forEach((s, n) => s.classList.toggle("active", n === i));
  [...dots.children].forEach((d, n) => d.classList.toggle("active", n === i));
}
function restart() {
  clearInterval(timer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timer = setInterval(() => show((current + 1) % slides.length), 6000);
  }
}
show(0);
restart();

// Formulario -> WhatsApp
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const meta = document.getElementById("meta").value;
  const msg = document.getElementById("mensaje").value.trim();
  const texto = `Hola Félix, soy ${nombre}. Mi meta: ${meta}. ${msg}`;
  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
});
