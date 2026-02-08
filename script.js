// Cursor

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


// Formulario

const form = document.getElementById("formulario");

form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Gracias por contactarnos");
    form.reset();
});


// Audio

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
