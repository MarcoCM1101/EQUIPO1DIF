/*global localStorage*/

function obtenerParametroUrl(param) {
    
    var url = new URL(window.location.href);
    var paramValue = url.searchParams.get(param);
    
    return paramValue;
}


// Intentando obtener idComedor de la URL
var idComedor = obtenerParametroUrl('idComedor');

if (idComedor) {

    // Almacena el idComedor de la URL en localStorage
    localStorage.setItem('idComedor', idComedor);
} else {
    
    // Tomar idComedor del localStorage
    idComedor = localStorage.getItem('idComedor');
    
    if (idComedor) {
    } else {
    }
}

// Añade una prueba final
