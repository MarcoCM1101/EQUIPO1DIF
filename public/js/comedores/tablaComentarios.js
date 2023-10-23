/*global localStorage */

// Función que se ejecutará al cargar la página
function comentarioComedor() {
    const idComedor = localStorage.getItem('idComedor');
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);

            // Suponiendo que la respuesta es una lista de objetos con las claves 'nombre', 'ventas' y 'donativos'
            // Ejemplo: [{"nombre":"Comedor 1", "ventas":100, "donativos":50}, ...]
            updateComentario(body);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/encuestasComedor/'+ encodeURIComponent(idComedor)); // Cambia la URL según tu configuración
    xhr.send();
}

function updateComentario(body) {
    const tbody = document.getElementById('TBodyComentario');
    let htmlContent = ''; // Iniciar una cadena vacía para construir el contenido

    body.forEach(comentario => {
        htmlContent += `
            <tr id="${comentario.idEncuesta}">
                <td>${comentario.comentario}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent; // Asignar la cadena construida al innerHTML del tbody
}


// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", function() {
    // Llamamos a la función una vez inmediatamente
    comentarioComedor();

    // Establecemos un intervalo para llamar a la función cada 2 segundos
    setInterval(comentarioComedor, 2000);
});