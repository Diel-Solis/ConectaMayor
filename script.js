// Mensaje al enviar formulario

const form = document.getElementById("formulario");

form.addEventListener("submit", function(e) {

    e.preventDefault();

    alert("Gracias por contactarnos. Pronto nos comunicaremos contigo.");

    form.reset();

});
