/*global localStorage */

// Función que se ejecutará al cargar la página
function fetchAdminInfo() {
  // Obtenemos el ID del administrador de localStorage
  const idAdministrador = localStorage.getItem('idAdministrador');
  
  // Verificamos si el ID del administrador existe
  if (!idAdministrador) {
    window.location.href = '/index.html'; // Redirigir a la página de inicio de sesión si el ID no está disponible
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    let body = JSON.parse(xhr.responseText);
    // Suponiendo que el servidor devuelve un campo 'success' en la respuesta
      // Modificamos el span con la información obtenida. Por ejemplo, el nombre del administrador.
    document.getElementById('adminName').textContent = body.nombre + ' ' + body.apellido;
    document.getElementById('adminMail').textContent = body.correo;

  };

  xhr.onerror = () => {
    alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
  }

  // Aquí suponemos que tienes una ruta de API que devuelve la información del administrador basada en su ID.
  xhr.open('GET', '/administrador/' + encodeURIComponent(idAdministrador));
  xhr.send();
}

// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", fetchAdminInfo);
