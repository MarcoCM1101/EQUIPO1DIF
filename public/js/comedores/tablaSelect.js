/* SCRIPT PARA SELECCIONAR UNA FILA DE LA TABLA DE COMEDORES */

// Obtener todas las filas de la tabla
const filas = document.querySelectorAll("table.tablaComedores tbody tr");

// Agregar un evento de clic a cada fila
filas.forEach((fila) => {
    fila.addEventListener("click", () => {
        // Obtener el valor del atributo data-href que contiene la URL de destino
        const destino = fila.getAttribute("data-href");

        // Redirigir al usuario a la página de destino
        if (destino) {
            window.location.href = destino;
        }
    });
});