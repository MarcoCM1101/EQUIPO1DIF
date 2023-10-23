/*global localStorage */

// Función que se ejecutará al cargar la página
function fetchComedorInfo() {
  // Obtenemos el ID del administrador de localStorage
  const idComedor = localStorage.getItem('idComedor');
  

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    let body = JSON.parse(xhr.responseText);
    // Suponiendo que el servidor devuelve un campo 'success' en la respuesta
      // Modificamos el span con la información obtenida. Por ejemplo, el nombre del administrador.
    document.getElementById('Comedor').textContent = body.nombre;
    
    document.getElementById('containerEditarComedor').innerHTML = `<input type="text" name="Comedor" class="inputComedor" placeholder="Comedor" id="inputComedor" value="${body.nombre}" readonly />
                                <br />
                                <input type="text" name="Direccion" class="inputDireccion" placeholder="Dirección" id="inputDireccion" value="${body.direccion}" readonly />
                                <br />
                                <input type="tel" name="Teléfono" class="inputTelefono" placeholder="Teléfono" id="inputTelefono" value="${body.telefono}" readonly />
                                <br />
                                <select class="inputEstatusComedor" name="estatusComedor" id="estatusComedor" disabled>
                                  <option value="Abierto" ${body.estatus === 'Activo' ? 'selected' : ''}>Abierto</option>
                                  <option value="Cerrado" ${body.estatus === 'Inactivo' ? 'selected' : ''}>Cerrado</option>
                              </select>`
  };

  xhr.onerror = () => {
    alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
  }

  // Aquí suponemos que tienes una ruta de API que devuelve la información del administrador basada en su ID.
  xhr.open('GET', '/comedor/' + encodeURIComponent(idComedor));
  xhr.send();
}

// Aseguramos que la función se ejecute una vez que se haya cargado el DOM
document.addEventListener("DOMContentLoaded", fetchComedorInfo());