/*global fetch location*/
document.addEventListener("DOMContentLoaded", () => {
    setupTablaInteractiva();
    anuncios();
});

function setupTablaInteractiva() {
    const filasTablaAnuncios = document.querySelectorAll(".TablaAnuncios tbody tr");
    const botonEditarTableAnuncios = document.getElementById("botonEditarTableAnuncios");
    const btnCancelarEditAnuncio = document.getElementById("btnCancelarEditAnuncio");
    const btnSubmitEditAnuncio = document.getElementById("btnSubmitEditAnuncio");

    botonEditarTableAnuncios.addEventListener("click", () => {
        filasTablaAnuncios.forEach((fila) => {
            fila.querySelector("td:nth-child(1)").contentEditable = true;
            fila.querySelector("td:nth-child(2)").contentEditable = true;
            fila.querySelector(".option_status").disabled = false;
        });

        btnCancelarEditAnuncio.style.display = "inline-block";
        btnSubmitEditAnuncio.style.display = "inline-block";
    });

    btnCancelarEditAnuncio.addEventListener("click", () => {
        filasTablaAnuncios.forEach((fila) => {
            fila.querySelector("td:nth-child(1)").contentEditable = false;
            fila.querySelector("td:nth-child(2)").contentEditable = false;
            fila.querySelector(".option_status").disabled = true;
        });

        btnCancelarEditAnuncio.style.display = "none";
        btnSubmitEditAnuncio.style.display = "none";
    });

    btnSubmitEditAnuncio.addEventListener("click", () => {
        let huboCambios = false;
        filasTablaAnuncios.forEach((fila) => {
            const idAnuncio = fila.id;
            const celdaTitulo = fila.querySelector("td:nth-child(1)");
            const celdaDescripcion = fila.querySelector("td:nth-child(2)");
            const selectEstado = fila.querySelector(".option_status");

            const datos = {
                nuevoTitulo: celdaTitulo.textContent.trim(),
                nuevaDescripcion: celdaDescripcion.textContent.trim(),
                nuevoEstatus: selectEstado.options[selectEstado.selectedIndex].value
            };

            if (datos.nuevoTitulo !== celdaTitulo.getAttribute('data-original') || 
                datos.nuevaDescripcion !== celdaDescripcion.getAttribute('data-original') || 
                datos.nuevoEstatus !== selectEstado.getAttribute('data-original')) {

                huboCambios = true;

                if(datos.nuevoEstatus === "Eliminar") {
                    if(confirm("¿Estás seguro que deseas eliminar este anuncio?")) {
                        eliminarAnuncio(idAnuncio);
                    }
                } else {
                    actualizarAnuncio(idAnuncio, datos);
                }
            }

            celdaTitulo.contentEditable = false;
            celdaDescripcion.contentEditable = false;
            selectEstado.disabled = true;
        });

        btnCancelarEditAnuncio.style.display = "none";
        btnSubmitEditAnuncio.style.display = "none";
        
        if (huboCambios) {
            alert('Se realizaron cambios en los anuncios.');
            location.reload();
        }
    });
}

function actualizarAnuncio(idAnuncio, {nuevoTitulo, nuevaDescripcion, nuevoEstatus}) {
    fetch(`/actualizarAnuncio/${idAnuncio}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nuevoTitulo, nuevaDescripcion, nuevoEstatus })
    })
    .then(response => response.json())
    .then(data => alert(data.message || `Error: ${data.error}`))
    .catch(error => alert('Error al actualizar el anuncio. Por favor intenta de nuevo.'));
}

function eliminarAnuncio(idAnuncio) {
    fetch(`/eliminarAnuncio/${idAnuncio}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || `Error: ${data.error}`);
        anuncios(); // Actualizar la tabla después de la eliminación
    })
}

function anuncios() {
    fetch('/anuncios/')
    .then(response => response.json())
    .then(updateAnuncios)
    .catch(() => alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.'));
}

function updateAnuncios(anuncios) {
    const tbody = document.getElementById('tablaAnuncio');
    tbody.innerHTML = '';
    anuncios.forEach(anuncio => {
        const row = document.createElement('tr');
        row.id = anuncio.idAnuncio;

        const tituloCell = document.createElement('td');
        tituloCell.textContent = anuncio.titulo;
        tituloCell.setAttribute('data-original', anuncio.titulo);
        row.appendChild(tituloCell);

        const descripcionCell = document.createElement('td');
        descripcionCell.textContent = anuncio.descripcion;
        descripcionCell.setAttribute('data-original', anuncio.descripcion);
        row.appendChild(descripcionCell);

        const selectCell = document.createElement('td');
        selectCell.innerHTML = `
            <select class="option_status" disabled data-original="${anuncio.estado}">
                <option value="Activo" ${anuncio.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                <option value="Inactivo" ${anuncio.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                <option value="Eliminar" ${anuncio.estado === 'Eliminar' ? 'selected' : ''}>Eliminar</option>
            </select>
        `;
        row.appendChild(selectCell);

        tbody.appendChild(row);
    });

    setupTablaInteractiva(); // Asegurarse de que la nueva tabla es interactiva
}
