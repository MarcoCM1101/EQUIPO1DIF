function usuariosHoy(){
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        let body = JSON.parse(xhr.responseText);
        document.getElementById('cantidadPersonas').textContent = body.TotalUsuariosHoy;
     };
    
     xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
      }
    
    // Aquí suponemos que tienes una ruta de API que devuelve la información del administrador basada en su ID.
    xhr.open('GET', '/usuariosHoy');
    xhr.send();
}
    
// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", usuariosHoy);