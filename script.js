// ================= CURSOR =================

const cursor = document.getElementById("cursor");

let mx = 0, my = 0;
let cx = 0, cy = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX;
  my = e.clientY;
});

function animarCursor() {

  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;

  cursor.style.left = cx + "px";
  cursor.style.top = cy + "px";

  requestAnimationFrame(animarCursor);
}

animarCursor();


// ================= FORMULARIO =================

const form = document.getElementById("formulario");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Gracias por contactarnos");
    form.reset();
  });
}


// ================= AUDIO =================

let hablando = false;
let botonActual = null;
let intervalo = null;

function leerTexto(id, boton) {

  if (hablando && botonActual === boton) {
    window.speechSynthesis.cancel();
    resetear();
    return;
  }

  if (hablando) {
    window.speechSynthesis.cancel();
    resetear();
  }

  const section = document.getElementById(id);
  if (!section) return;

  const textoSpan = boton.querySelector(".audio-text");
  const barra = boton.querySelector(".audio-progress");

  const copia = section.cloneNode(true);
  copia.querySelectorAll("button").forEach(b => b.remove());

  let texto = copia.innerText
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!texto) return;

  const voz = new SpeechSynthesisUtterance(texto);

  const voces = window.speechSynthesis.getVoices();

  const vozLatina = voces.find(v =>
    v.lang === "es-MX" ||
    v.lang === "es-419" ||
    v.lang === "es-US"
  );

  if (vozLatina) voz.voice = vozLatina;

  voz.lang = "es-MX";
  voz.rate = 1;
  voz.pitch = 0.85;

  hablando = true;
  botonActual = boton;

  boton.classList.add("playing");
  textoSpan.textContent = "Detener";
  barra.style.width = "0%";

  const palabras = texto.split(/\s+/).length;
  const duracion = Math.max((palabras / 160) * 60000, 2500);

  const inicio = Date.now();

  clearInterval(intervalo);

  intervalo = setInterval(() => {

    const t = Date.now() - inicio;
    const p = Math.min((t / duracion) * 100, 100);

    barra.style.width = p + "%";

  }, 100);

  voz.onend = () => resetear();

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(voz);
}


function resetear() {

  hablando = false;

  if (!botonActual) return;

  const textoSpan = botonActual.querySelector(".audio-text");
  const barra = botonActual.querySelector(".audio-progress");

  botonActual.classList.remove("playing");

  textoSpan.textContent = "Escuchar sección";
  barra.style.width = "0%";

  clearInterval(intervalo);

  botonActual = null;
}


// ================= MENSAJE INICIAL =================

const tip = document.getElementById("nav-tip");

function mostrarMensaje() {

  if (!tip) return;

  const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (esMovil) {
    tip.textContent = "Desliza tu dedo para navegar";
  } else {
    tip.textContent = "Mueve el mouse para elegir una sección";
  }

  tip.classList.add("show");

  setTimeout(() => {
    tip.classList.remove("show");
  }, 4000);
}

window.addEventListener("load", mostrarMensaje);


// ================= OVERLAY =================

const overlay = document.getElementById("nav-overlay");
const overlayText = document.getElementById("nav-overlay-text");

function esMovil() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function mostrarOverlay() {

  if (!overlay || !overlayText) return;

  if (esMovil()) {
    overlayText.textContent = "Desliza tu dedo para navegar";
  } else {
    overlayText.textContent = "Mueve el mouse para elegir una sección";
  }

  overlay.classList.add("show");
}

window.addEventListener("load", mostrarOverlay);


function cerrarOverlay() {
  if (overlay) {
    overlay.classList.remove("show");
  }
}

if (overlay) {
  overlay.addEventListener("click", cerrarOverlay);
  overlay.addEventListener("touchstart", cerrarOverlay);
}


// ================= MENÚ HAMBURGUESA =================

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {

  // Abrir / cerrar menú
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  // Cerrar al tocar enlace
  navMenu.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      navMenu.classList.remove("open");

      // Forzar cierre en móvil
      navMenu.style.display = "none";

      setTimeout(() => {
        navMenu.style.display = "";
      }, 50);

    });

  });

}
