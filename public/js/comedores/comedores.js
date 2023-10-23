/* global localStorage*/

function comedores() {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);

            // Suponiendo que la respuesta es una lista de objetos con las claves 'nombre', 'ventas' y 'donativos'
            // Ejemplo: [{"nombre":"Comedor 1", "ventas":100, "donativos":50}, ...]
            updateComedores(body);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/comedores'); // Cambia la URL según tu configuración
    xhr.send();
}

function updateComedores(body) {
    const tbody = document.getElementById('listaComedores');
    tbody.innerHTML = ''; // Limpiamos el contenido existente

    body.forEach(comedor => {
        const row = document.createElement('tr');
        row.id = comedor.idComedor;
        
        row.onclick = function() {
            window.location.href = "infoComedores.html"; 
            localStorage.setItem('idComedor', this.id); // Guarda el id de la fila en localStorage
        };
    
        const nombreCell = document.createElement('td');
        nombreCell.textContent = comedor.nombre;
        row.appendChild(nombreCell);
    
        const direccionCell = document.createElement('td');
        direccionCell.textContent = comedor.direccion;
        row.appendChild(direccionCell);
    
        const telefonoCell = document.createElement('td');
        telefonoCell.textContent = comedor.telefono;
        row.appendChild(telefonoCell);
    
        const estatusCell = document.createElement('td');
        
        // Cambia el estatus si es 'Activo' o 'Inactivo'
        if (comedor.estatus === 'Activo') {
            estatusCell.textContent = 'Abierto';
        } else if (comedor.estatus === 'Inactivo') {
            estatusCell.textContent = 'Cerrado';
        } else {
            estatusCell.textContent = comedor.estatus; // Si hay otros estados, los deja sin cambiar
        }
        
        row.appendChild(estatusCell);
    
        tbody.appendChild(row);
    });
}


// Llama a la función cuando se cargue el documento
document.addEventListener("DOMContentLoaded", comedores());
