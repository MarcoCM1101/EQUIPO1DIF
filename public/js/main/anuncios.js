function anunciosPublicados() {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);

            // Suponiendo que la respuesta es una lista de objetos con las claves 'nombre', 'ventas' y 'donativos'
            // Ejemplo: [{"nombre":"Comedor 1", "ventas":100, "donativos":50}, ...]
            updateTableAnuncios(body);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/anuncios'); // Cambia la URL según tu configuración
    xhr.send();
}

function updateTableAnuncios(body) {
    const tbody = document.getElementById('tbodyAnuncios');
    tbody.innerHTML = ''; // Limpiamos el contenido existente

    body.forEach(anuncio => {
        const row = document.createElement('tr');

        const nombreCell = document.createElement('td');
        nombreCell.textContent = anuncio.titulo;
        row.appendChild(nombreCell);

        const ventasCell = document.createElement('td');
        ventasCell.textContent = anuncio.descripcion;
        row.appendChild(ventasCell);

        const donativosCell = document.createElement('td');
        donativosCell.textContent = anuncio.estado;
        row.appendChild(donativosCell);

        tbody.appendChild(row);
    });
}

// Llama a la función cuando se cargue el documento
document.addEventListener("DOMContentLoaded", anunciosPublicados());
