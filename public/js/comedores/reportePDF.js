// Obtén una referencia al botón y agrega un manejador de eventos
const btnGenerarPDF = document.getElementById("reportePDF");

btnGenerarPDF.addEventListener("click", () => {
    // Abre la página deseada en una nueva pestaña
    window.open("disenoReporte.html", "_blank");
});