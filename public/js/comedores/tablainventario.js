/*global localStorage */

// Función que se ejecutará al cargar la página
function inventarioComedor() {
    const idComedor = localStorage.getItem('idComedor');
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);
            updateInventario(body);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/inventarioByComedor/' + encodeURIComponent(idComedor)); 
    xhr.send();
}

function updateInventario(body) {
    const tbody = document.getElementById('TBodyInventario');
    let htmlContent = '';

    body.forEach(inventario => {
        htmlContent += `
            <tr id="${inventario.idProducto}">
                <td>${inventario.producto}</td>
                <td>${inventario.cantidad}</td>
                <td>${inventario.unidadmedida}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent; 
}

// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", function() {
    // Llamamos a la función una vez inmediatamente
    inventarioComedor();

    // Establecemos un intervalo para llamar a la función cada 2 segundos
    setInterval(inventarioComedor, 2000);
});
