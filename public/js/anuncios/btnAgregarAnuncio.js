/*global fetch location localStorage*/
document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencias a los elementos necesarios
    const btnAgregarAnuncio = document.getElementById("btnAgregarAnuncio");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnSubmit = document.querySelector(".boton-submit");
    const inputTitulo = document.getElementById("inputTitulo");
    const inputDescripcion = document.getElementById("inputDescripcion");
    const inputEstado = document.getElementById("inputEstado");
    const containerAgregarAnuncio = document.getElementById("containerAgregarAnuncio");
    const idAdministrador = localStorage.getItem('idAdministrador');

    // Ocultar el contenedor al principio
    containerAgregarAnuncio.style.display = "none";

    // Función para mostrar el contenedor
    function mostrarContenedor() {
        containerAgregarAnuncio.style.display = "block";
    }

    // Función para ocultar el contenedor
    function ocultarContenedor() {
        containerAgregarAnuncio.style.display = "none";
        inputTitulo.value = "";
        inputDescripcion.value = "";
        inputEstado.value = "SeleccionaOpcion"; // Resetear al placeholder de las opciones
    }

    // Función para enviar el anuncio al servidor
    async function enviarAnuncio() {
        try {
            // Crear un objeto con los datos del anuncio
            const anuncio = {
                idAdministrador: idAdministrador, // Suponiendo que el ID del administrador es 1, ajusta según sea necesario
                titulo: inputTitulo.value,
                descripcion: inputDescripcion.value,
                estado: inputEstado.value
            };

            // Validar que todos los campos estén llenos y estado sea válido
            if (!anuncio.titulo || !anuncio.descripcion || anuncio.estado === "SeleccionaOpcion") {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }

            // Hacer una solicitud POST al servidor
            const response = await fetch('/insertarAnuncio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(anuncio)
            });

            // Verificar si la solicitud fue exitosa
            if (response.status === 201) {
                alert('Anuncio creado exitosamente!');
                ocultarContenedor();
                location.reload();
            } else {
                alert('Error al crear el anuncio:', response.status, response.statusText);
            }
        } catch (err) {
            alert('Error al enviar el anuncio:', err);
        }
    }

    // Agregar manejadores de eventos a los botones
    btnAgregarAnuncio.addEventListener("click", mostrarContenedor);
    btnCancelar.addEventListener("click", ocultarContenedor);
    btnSubmit.addEventListener("click", enviarAnuncio);
});
