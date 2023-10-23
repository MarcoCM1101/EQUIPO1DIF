/*global localStorage */

// Función que se ejecutará al cargar la página
function usuarioComedor() {
    const idComedor = localStorage.getItem('idComedor');
    
    // Obtener detalles del usuario
    obtenerDatosUsuarios(idComedor);

    // Obtener y establecer la cantidad de usuarios en el span
    obtenerCantidadUsuarios(idComedor);
}

function obtenerDatosUsuarios(idComedor) {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);
            updateUsuarios(body);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/usuarios/' + encodeURIComponent(idComedor)); // Cambia la URL según tu configuración
    xhr.send();
}

function updateUsuarios(body) {
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = ''; // Limpiamos el contenido existente

    body.forEach(usuario => {
        const row = document.createElement('tr');
        row.id = usuario.idUsuario;
    
        const nombreCell = document.createElement('td');
        nombreCell.textContent = usuario.nombre;
        row.appendChild(nombreCell);
    
        const apellidoCell = document.createElement('td');
        apellidoCell.textContent = usuario.apellido;
        row.appendChild(apellidoCell);
        
        const edadCell = document.createElement('td');
        edadCell.textContent = usuario.edad;
        row.appendChild(edadCell);
        
        const generoCell = document.createElement('td');
        generoCell.textContent = usuario.genero;
        row.appendChild(generoCell);
        
        const curpCell = document.createElement('td');
        curpCell.textContent = usuario.curp;
        row.appendChild(curpCell);
    
        tbody.appendChild(row);
    });
}

function obtenerCantidadUsuarios(idComedor) {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const body = JSON.parse(xhr.responseText);
            document.querySelector('.containerTableCliente h1 span').textContent = body.cantidadUsuarios;
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    // Asume que el endpoint para obtener la cantidad de usuarios es '/contarUsuarios/:idComedor'
    xhr.open('GET', '/cantidadUsuarioComedor/' + encodeURIComponent(idComedor)); // Cambia la URL según tu configuración
    xhr.send();
}

// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", usuarioComedor());
