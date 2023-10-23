/*global nombre telefono contraseña */

function saveEncargado(){
    const payLoad = JSON.stringify({
        idComedor: 1,
        nombre: nombre.value,
        telefono: telefono.value,
        contraseña: contraseña.value
    });
    
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
        xhr.send(payLoad);
        console.log(payLoad);
    
      } else {
        alert("Las contraseñas no coinciden");
        // Aquí puedes agregar código adicional para mostrar un mensaje de error al usuario
      }
}