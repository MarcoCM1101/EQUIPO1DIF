/*global localStorage fetch location*/
// Obtener referencias a los elementos
const btnEditar = document.getElementById("btnEdit");
const btnCancelar = document.getElementById("btnCancelar");
const btnEnviar = document.getElementById("btnEnviar");
const containerInfoCom = document.getElementById("containerInfoCom");

// Agregar un event listener al botón "Editar"
btnEditar.addEventListener("click", function () {
    // Habilitar la edición del input
    document.getElementById("inputComedor").removeAttribute('readonly');
    document.getElementById("inputDireccion").removeAttribute('readonly');
    document.getElementById("inputTelefono").removeAttribute('readonly');
    document.getElementById("estatusComedor").disabled = false;

    // Mostrar los botones "Cancelar" y "Enviar"
    containerInfoCom.style.height = "100%";
    btnCancelar.style.display = "inline-block";
    btnEnviar.style.display = "inline-block";

    // Enfocar el input para que el usuario pueda editarlo
    document.getElementById("inputComedor").focus();
    document.getElementById("inputDireccion").focus();
    document.getElementById("inputTelefono").focus();
});

// Agregar un event listener al botón "Cancelar"
btnCancelar.addEventListener("click", function () {
    // Deshabilitar la edición del input
    document.getElementById("inputComedor").setAttribute('readonly', 'readonly');
    document.getElementById("inputDireccion").setAttribute('readonly', 'readonly');
    document.getElementById("inputTelefono").setAttribute('readonly', 'readonly');
    document.getElementById("estatusComedor").disabled = true;

    // Ocultar los botones "Cancelar" y "Enviar"
    containerInfoCom.style.height = "400px";
    btnCancelar.style.display = "none";
    btnEnviar.style.display = "none";
});

// Agregar un event listener al botón "Enviar"
btnEnviar.addEventListener("click", async function () {
    try {
        // Obtener los datos del formulario
        let estatus = document.getElementById("estatusComedor").value;

        // Convertir el valor de estatus si es necesario
        if (estatus === "Abierto") {
            estatus = "Activo";
        } else if (estatus === "Cerrado") {
            estatus = "Inactivo";
        }

        const datosComedor = {
            nombre: document.getElementById("inputComedor").value,
            direccion: document.getElementById("inputDireccion").value,
            telefono: document.getElementById("inputTelefono").value,
            estatus: estatus
        };

        // Obtener idComedor de localStorage
        const idComedor = localStorage.getItem('idComedor');

        // Enviar datos al servidor
        const response = await fetch(`/actualizarComedor/${idComedor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosComedor)
        });

        const result = await response.json();

        // Si todo va bien, mostrar un mensaje de éxito
        if (response.ok) {
            alert(result.message || "Cambios guardados exitosamente");
        } else {
            alert(result.error || "Ocurrió un error al guardar los cambios");
        }

        // Deshabilitar la edición del input
        document.getElementById("inputComedor").setAttribute('readonly', 'readonly');
        document.getElementById("inputDireccion").setAttribute('readonly', 'readonly');
        document.getElementById("inputTelefono").setAttribute('readonly', 'readonly');
        document.getElementById("estatusComedor").disabled = true;

        // Ocultar los botones "Cancelar" y "Enviar"
        containerInfoCom.style.height = "400px";
        btnCancelar.style.display = "none";
        btnEnviar.style.display = "none";

    } catch (error) {
        // Manejar errores de red, etc.
        console.error("Error al enviar los datos:", error);
        alert("Ocurrió un error al conectar con el servidor");
    }
    
    location.reload()
});

