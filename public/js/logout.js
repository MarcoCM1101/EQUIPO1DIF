/*global localStorage*/
document.addEventListener("DOMContentLoaded", function () {
    // Buscamos el elemento por su ID y le añadimos el evento 'click'
    document.getElementById("logoutLink").addEventListener("click", function(e) {
        e.preventDefault(); // Prevenimos la navegación (en caso que el enlace tuviera un href real)
        
        // Eliminamos todos los datos del localStorage
        localStorage.clear();
        
        // Redireccionamos al usuario a la página de inicio (o login, dependiendo de tu aplicación)
        window.location.href = 'index.html';
    });
});
