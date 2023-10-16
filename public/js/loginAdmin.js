/*global localStorage */

function loginAdmin() {
  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;
  const xhr = new XMLHttpRequest();

xhr.onload = () => {
  let body = JSON.parse(xhr.responseText);
  if (body.login == "TRUE") {
    // Almacenar el ID del usuario en localStorage
    localStorage.setItem('idAdministrador', body.idAdministrador);

    // Luego redirige o realiza otras acciones
    window.location.href = '/main.html';
  } else {
    alert('Correo o contraseña incorrectos');
  }
};

  xhr.onerror = () => {
    alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
  }

  xhr.open('GET', '/loginAdmin/' + encodeURIComponent(correo) + '/' + encodeURIComponent(contraseña));
  xhr.send();
}
