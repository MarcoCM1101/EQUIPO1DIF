/*global fetch*/

// Obtén las referencias a los elementos que necesitas
const btnEditEncargados = document.getElementById("btnEditEncargados");
const containerEncargados = document.getElementById("containerEncargados");
const btnCancelarEncargados = document.getElementById("btnCancelarEncargados");
const btnEnviarEncargados = document.getElementById("btnEnviarEncargados");
const sectionInfo = document.getElementById("SectionInfo");
const cellsToEdit = document.querySelectorAll("#tablaEncargadosBody td");
const btnAddEncargados = document.getElementById("btnAddEncargados");

btnEditEncargados.addEventListener("click", () => {
    
    // Habilita la edición de las celdas y guarda los valores originales
    document.querySelectorAll("#tablaEncargadosBody td").forEach((cell) => {
        cell.setAttribute("contenteditable", "true");
        cell.dataset.original = cell.textContent;
    });
    
    // Cambiar el ancho del contenedor
    containerEncargados.style.width = "100%";
    containerEncargados.style.height = "500px";
    sectionInfo.style.display = "block";

    // Mostrar los botones "Cancelar" y "Enviar"
    btnAddEncargados.style.display = "block";
    btnCancelarEncargados.style.display = "inline-block";
    btnEnviarEncargados.style.display = "inline-block";

    // Deshabilitar el botón "Editar Encargados"
    btnEditEncargados.style.display = "none";
});

btnCancelarEncargados.addEventListener("click", () => {
    
    // Restaurar los valores originales de las celdas y deshabilitar la edición
    cellsToEdit.forEach((cell) => {
        cell.textContent = cell.dataset.original;
        cell.removeAttribute("contenteditable");
    });
    
    // Restaurar el ancho del contenedor
    if (window.innerWidth < 900) {
        containerEncargados.style.width = "100%";
        containerEncargados.style.height = "100%";
        sectionInfo.style.display = "block";
    } else {
        containerEncargados.style.width = "600px";
        containerEncargados.style.height = "400px";
        sectionInfo.style.display = "flex";   
    }

    // Ocultar los botones "Cancelar" y "Enviar"
    btnAddEncargados.style.display = "none";
    btnCancelarEncargados.style.display = "none";
    btnEnviarEncargados.style.display = "none";

    // Habilitar el botón "Editar Encargados"
    btnEditEncargados.style.display = "inline-block";
});

btnEnviarEncargados.addEventListener("click", () => {
    const datosActualizados = [];
    
    // Recolectar los datos actualizados de los td's editables
    document.querySelectorAll("#tablaEncargadosBody td").forEach((cell) => {
        const row = cell.closest('tr');
        const idEncargado = row.id;
        const columns = row.querySelectorAll("td");
        
        const nuevoNombre = columns[0].textContent;
        const nuevoTelefono = columns[1].textContent;

        datosActualizados.push({
            idEncargado,
            nuevoNombre,
            nuevoTelefono
        });
        
        cell.removeAttribute("contenteditable");
    });

    const promises = datosActualizados.map(data => 
        fetch(`/actualizarEncargado/${data.idEncargado}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nuevoNombre: data.nuevoNombre,
                nuevoTelefono: data.nuevoTelefono
            })
        })
        .then(response => response.json())
    );

    Promise.all(promises)
    .then(responses => {
        const uniqueMessages = [...new Set(responses.map(resp => resp.message || resp.error))];
        alert(uniqueMessages.join('\n'));
        // Restaurar el ancho del contenedor
        if (window.innerWidth < 900) {
            containerEncargados.style.width = "100%";
            containerEncargados.style.height = "100%";
            sectionInfo.style.display = "block";
        } else {
            containerEncargados.style.width = "600px";
            containerEncargados.style.height = "400px";
            sectionInfo.style.display = "flex";   
        }
    
        // Ocultar los botones "Cancelar" y "Enviar"
        btnAddEncargados.style.display = "none";
        btnCancelarEncargados.style.display = "none";
        btnEnviarEncargados.style.display = "none";
        btnEditEncargados.style.display = "inline-block";
    })
    .catch(error => {
        console.error('Hubo un problema con la petición Fetch:', error.message);
    });
});
