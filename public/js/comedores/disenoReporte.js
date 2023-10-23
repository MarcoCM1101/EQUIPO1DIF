/*global localStorage, fetch*/

// Obtener el IdComedor de localStorage
const idComedorStored = localStorage.getItem("idComedor");

// Elemento del DOM donde se mostrará el nombre del comedor
const nombreComedorElement = document.getElementById("nombreComedor");

// Elemento del DOM donde se mostrará la fecha actual
const fechaElement = document.getElementById("fechaActual");

// Elemento del DOM donde se mostrarán las ventas totales
const ingresosTotalesElement = document.getElementById("ingresosTotales");

// Elemento del DOM donde se mostrarán los ingresos promedio por día
const ingresosPromedioDiaElement = document.getElementById("ingresosPromedioDia");

// Elemento del DOM donde se mostrarán los platillos vendidos y donados
const totalPlatillosVendidosElement = document.getElementById("totalPlatillosVendidos");
const totalPlatillosDonadosElement = document.getElementById("totalPlatillosDonados");

// Elemento del DOM donde se mostrará el total de usuarios que han asistido
const usuariosAsistidosElement = document.getElementById("usuariosAsistidos");

// Elemento del DOM donde se mostrará el promedio de usuarios que han asistido por día
const usuariosAsistidosPromedioElement = document.getElementById("usuariosAsistidosPromedio");

// Función para obtener el nombre del comedor del endpoint
function getNombreComedor(idComedor) {
    fetch('/comedor/' + idComedor)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el comedor");
            }
            return response.json();
        })
        .then(data => {
            if (data && data.nombre) {
                nombreComedorElement.textContent = data.nombre;
            } else {
                console.error("Comedor no encontrado.");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Función para obtener las ventas totales del comedor
function getVentasTotales(idComedor) {
    fetch(`/comedorUsuariosVentas/${idComedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las ventas totales");
            }
            return response.json();
        })
        .then(data => {
            if (data && data.ventasTotales) {
                ingresosTotalesElement.textContent = data.ventasTotales;
            } else {
                console.error("Ventas totales no encontradas.");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Función para obtener el promedio de ventas por usuario de un comedor específico
function obtenerPromedioVentasPorUsuario(idComedor) {
    fetch(`/comedorUsuariosPromedio/${idComedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el promedio de ventas por usuario');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.ResultadoPromedioVentasPorUsuario !== undefined) {
                ingresosPromedioDiaElement.textContent = data.ResultadoPromedioVentasPorUsuario;
            } else {
                console.error('Error: No se pudo obtener el promedio de ventas por usuario.');
            }
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
}

// Función para obtener las ventas normales y donativos de un comedor
function obtenerVentasYDonativos(idComedor) {
    fetch(`/totalVentasDonativos/${idComedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las ventas y donativos');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                totalPlatillosVendidosElement.textContent = data.VentasNormales;
                totalPlatillosDonadosElement.textContent = data.Donativos;
            } else {
                console.error("Error al obtener los datos de ventas y donativos.");
            }
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
}

// Función para obtener el inventario por comedor y llenar la tabla
function obtenerInventarioPorComedor(idComedor) {
    fetch(`/inventarioByComedor/${idComedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el inventario por comedor');
            }
            return response.json();
        })
        .then(data => {
            const tabla = document.getElementById('tableInventarioReport').getElementsByTagName('tbody')[0];
            // Limpiar las filas existentes
            tabla.innerHTML = '';
            
            // Agregar nuevas filas con los datos
            for (let item of data) {
                let fila = tabla.insertRow();
                
                fila.insertCell(0).textContent = item.producto;
                fila.insertCell(1).textContent = item.cantidad;
                fila.insertCell(2).textContent = item.unidadmedida;
            }
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
}

// Función para obtener el total de usuarios que han asistido a un comedor
function obtenerUsuariosAsistentes(idComedor) {
    fetch(`/usuariosAsistentes/${idComedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios asistentes');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.UsuariosAsistentes !== undefined) {
                usuariosAsistidosElement.textContent = data.UsuariosAsistentes;
            } else {
                console.error("Error al obtener los datos de usuarios asistentes.");
            }
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
}

// Función para obtener el promedio de usuarios que han asistido por día a un comedor
function obtenerPromedioUsuariosPorDia(idComedor) {
    fetch(`/promedioUsuariosDia/${idComedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el promedio de usuarios por día');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.PromedioUsuariosPorDia !== undefined) {
                usuariosAsistidosPromedioElement.textContent = data.PromedioUsuariosPorDia;
            } else {
                console.error("Error al obtener el promedio de usuarios por día.");
            }
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
}

// Función para mostrar la fecha del día de hoy
function mostrarFechaActual() {
    // Obtener la fecha actual
    const fecha = new Date();

    // Formatear la fecha en el formato deseado (día, mes y año)
    const fechaFormateada = `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`;

    // Asignar la fecha formateada al elemento del DOM
    fechaElement.textContent = fechaFormateada;
}

// Evento cuando el contenido del DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    getNombreComedor(idComedorStored);
    getVentasTotales(idComedorStored);
    obtenerPromedioVentasPorUsuario(idComedorStored);
    obtenerInventarioPorComedor(idComedorStored); 
    obtenerVentasYDonativos(idComedorStored); 
    obtenerUsuariosAsistentes(idComedorStored);
    obtenerPromedioUsuariosPorDia(idComedorStored);
    mostrarFechaActual();
});
