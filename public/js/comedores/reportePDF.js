/*global jsPDF*/

// Obtén una referencia al botón y agrega un manejador de eventos
const btnGenerarPDF = document.getElementById("reportePDF");
var count = count;

btnGenerarPDF.addEventListener("click", () => {
  // Crea un nuevo documento PDF
  const pdf = new jsPDF();

  // Agrega contenido al PDF
  pdf.text("Informe PDF generado con jsPDF", 10, 10);

  // Genera el archivo PDF (puedes personalizar el nombre del archivo)
  pdf.save("informe"+count+".pdf");
  count++;
});
