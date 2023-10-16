/*global fetch localStorage location*/
// Declaración de variables
const btnAddEncargados1 = document.getElementById("btnAddEncargados");
const containerAddEncargado = document.getElementById("containerAddEncargado");
const inputNombreEncargado = document.getElementById("inputNombreEncargado");
const inputCorreoEncargado = document.getElementById("inputCorreoEncargado");
const inputContraseñaEncargado = document.getElementById("inputContraseñaEncargado");
const btnCancelarEncargado1 = document.getElementById("btnCancelarEncargado1");
const btnAgregarEncargado1 = document.getElementById("btnAgregarEncargado1");

// Función dar click en Agregar Encargados
btnAddEncargados1.addEventListener("click", () => {
    containerAddEncargado.style.display = "block";
});

// Escuchar click Cancelar en Agregar Encargados
btnCancelarEncargado1.addEventListener("click", () => {
    
    //Ocultar contenedor agregar encargado
    containerAddEncargado.style.display = "none";
    
    // Resetear valores del input
    inputNombreEncargado.value = "";
    inputCorreoEncargado.value = "";
    inputContraseñaEncargado.value = "";
});

btnAgregarEncargado1.addEventListener("click", () => {
    const nombre = document.getElementById("inputNombreEncargado");
    const telefono = document.getElementById("inputCorreoEncargado"); // Asumo que este es el teléfono. Cambia el ID si es necesario.
    const contraseña = document.getElementById("inputContraseñaEncargado");
    const idComedor = localStorage.getItem('idComedor');
    
    const payLoad = JSON.stringify({
        idComedor: idComedor,
        nombre: nombre.value,
        telefono: telefono.value,
        contraseña: contraseña.value
    }); 
    console.log(payLoad)
    
    const objetoPayLoad = JSON.parse(payLoad);
    let todosLlenos = true;
    
    for (let campo in objetoPayLoad) {
        if (!objetoPayLoad[campo] || objetoPayLoad[campo] === '') {
            console.log(`El campo ${campo} está vacío`);
            todosLlenos = false;
            break;
        }
    }
    
    if (todosLlenos) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/InsertEncargado');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        // Agregar un listener para el evento 'load' para manejar la respuesta
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                // El servidor retornó una respuesta exitosa
                console.log(xhr.responseText);
                alert("El encargado ha sido agregado correctamente");
                
                // Ocultar contenedor agregar encargado.
                document.getElementById("containerAddEncargado").style.display = "none";
                
                // Resetear valores.
                inputNombreEncargado.value = "";
                inputCorreoEncargado.value = "";
                inputContraseñaEncargado.value = "";
                location.reload();
            } else {
                // El servidor retornó un error
                console.error("Error del servidor: " + xhr.status);
                alert("Hubo un problema al agregar el encargado.");
            }
        };
    
        // Agregar un listener para el evento 'error' en caso de que no se pueda completar la solicitud
        xhr.onerror = function() {
            console.error("No se pudo completar la solicitud");
            alert("Hubo un problema al comunicarse con el servidor.");
        };
    
        xhr.send(payLoad);
    } else {
        alert("Por favor, llena todos los campos antes de enviar.");
    }

});

