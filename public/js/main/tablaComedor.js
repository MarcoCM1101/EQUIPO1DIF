/*global fetch localStorage*/
document.addEventListener("DOMContentLoaded", function () {
    fetch('/comedoresVentaDonativo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tabla = document.getElementById("TablaComedoresMain");

            if (tabla) {
                const tbody = tabla.querySelector("tbody");

                // Limpia el tbody actual por si tiene datos anteriores
                tbody.innerHTML = '';

                data.forEach((comedor) => {
                    // Crear una fila y agregarla al tbody
                    const fila = document.createElement('tr');
                    fila.id = comedor.idComedor;
                    
                    fila.onclick = function() {
                        window.location.href = "infoComedores.html"; 
                        localStorage.setItem('idComedor', this.id); // Guarda el id de la fila en localStorage
                    };
                    
                    // Añade las celdas con los datos del comedor a la fila
                    fila.innerHTML = `
                        <td>${comedor.nombre}</td>
                        <td>${comedor.normal}</td>
                        <td>${comedor.donativo}</td>
                    `;

                    // Aplicar estilos basados en condiciones
                    const ventas = comedor.normal;
                    const donaciones = comedor.donativo;
                    const estatus = comedor.estatus;

                    if (estatus === "Inactivo") {
                        fila.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
                    } else if ((ventas + donaciones) < 50) {
                        fila.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
                    } else if ((ventas + donaciones) >= 50 && (ventas + donaciones) <= 100) {
                        fila.style.backgroundColor = "rgba(255, 165, 0, 0.7)";
                    } else if ((ventas + donaciones) > 100) {
                        fila.style.backgroundColor = "rgba(152, 251, 152, 0.7)";
                    }

                    // Agrega la fila al tbody
                    tbody.appendChild(fila);
                });
            } else {
                console.error("La tabla con ID 'TablaComedoresMain' no se encontró en el documento.");
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error.message);
        });
});
