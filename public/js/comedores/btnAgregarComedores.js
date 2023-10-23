/*global fetch localStorage location*/
document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencias a los elementos del formulario y al contenedor
    const btnAgregarComedor = document.getElementById("btnAgregarComedor");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnEnviar = document.querySelector(".boton-submit");
    const inputComedor = document.getElementById("inputComedor");
    const inputDireccion = document.getElementById("inputDireccion");
    const inputTelefono = document.getElementById("inputTelefono");
    const containerAgregarComedor = document.querySelector(".containerAgregarComedor");

    // Función para mostrar el contenedor
    function mostrarContenedor() {
        containerAgregarComedor.style.display = "block";
    }

    // Función para ocultar el contenedor y restablecer el formulario
    function ocultarContenedor() {
        containerAgregarComedor.style.display = "none";
        inputComedor.value = "";
        inputDireccion.value = "";
        inputTelefono.value = "";
    }

    // Función para enviar la información del comedor al servidor
    async function enviarComedor() {
        try {
            // Crear un objeto con los datos del comedor
            const comedor = {
                idAdministrador: localStorage.getItem('idAdministrador'),
                nombre: inputComedor.value,
                direccion: inputDireccion.value,
                telefono: inputTelefono.value,
                estatus: "Activo"
            };

            // Validar que todos los campos estén llenos
            if (!comedor.nombre || !comedor.direccion || !comedor.telefono) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Hacer una solicitud POST al servidor
            const response = await fetch('/insertarComedor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comedor)
            });

            // Verificar si la solicitud fue exitosa
            if (response.status === 201) {
                alert('Comedor creado exitosamente!');
                ocultarContenedor();
                location.reload();
            } else {
                const responseData = await response.json();
                alert('Error al crear el comedor:', responseData.message);
            }
        } catch (err) {
            alert('Error al enviar el comedor:', err);
        }
    }

    // Agregar manejadores de eventos a los botones
    btnAgregarComedor.addEventListener("click", mostrarContenedor);
    btnCancelar.addEventListener("click", ocultarContenedor);
    btnEnviar.addEventListener("click", enviarComedor);
});
