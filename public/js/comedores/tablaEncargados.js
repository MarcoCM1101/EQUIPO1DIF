/*global localStorage */

// Función que se ejecutará al cargar la página
function encargadosComedor() {
    const idComedor = localStorage.getItem('idComedor');
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);

            // Suponiendo que la respuesta es una lista de objetos con las claves 'nombre', 'ventas' y 'donativos'
            // Ejemplo: [{"nombre":"Comedor 1", "ventas":100, "donativos":50}, ...]
            updateEncargados(body);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/encargados/'+ encodeURIComponent(idComedor)); // Cambia la URL según tu configuración
    xhr.send();
}

function updateEncargados(body) {
    const tbody = document.getElementById('tablaEncargadosBody');
    let htmlContent = ''; // Iniciar una cadena vacía para construir el contenido

    body.forEach(encargado => {
        htmlContent += `
            <tr id="${encargado.idEncargado}">
                <td>${encargado.Nombre}</td>
                <td>${encargado.telefono}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent; // Asignar la cadena construida al innerHTML del tbody
}


// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", encargadosComedor());