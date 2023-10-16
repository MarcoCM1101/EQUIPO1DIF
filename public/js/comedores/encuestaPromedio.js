/*global fetch localStorage*/
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el idComedor (por ahora usaré un valor estático, pero deberías obtener este valor de alguna manera, quizá de la URL o algún lugar en tu aplicación)
    const idComedor = localStorage.getItem('idComedor'); // <-- Cambiar esto según tu lógica de negocio

    function fetchAndUpdate() {
        fetch(`/promedios/${idComedor}`)
            .then(response => response.json())
            .then(data => {
                // Mostrar la cantidad de encuestas respondidas
                const cantidadEncuestas = data.cantidadEncuestas || 0;
                document.querySelector(".TotalEncuestasRespondidas").textContent = cantidadEncuestas;

                // Modificar la barra de progreso de Higiene
                const promedioHigiene = data.PromedioHigiene || 0;
                const fillHigiene = document.querySelector(".fill-higiene");
                fillHigiene.style.width = `${promedioHigiene}%`;
                document.querySelector(".text-higiene").textContent = `${promedioHigiene}%`;

                // Modificar la barra de progreso de Atención
                const promedioAtencion = data.PromedioAtencion || 0;
                const fillAtencion = document.querySelector(".fill-atencion");
                fillAtencion.style.width = `${promedioAtencion}%`;
                document.querySelector(".text-atencion").textContent = `${promedioAtencion}%`;

                // Modificar la barra de progreso de Comida
                const promedioComida = data.PromedioComida || 0;
                const fillComida = document.querySelector(".fill-comida");
                fillComida.style.width = `${promedioComida}%`;
                document.querySelector(".text-comida").textContent = `${promedioComida}%`;
            })
            .catch(error => {
                console.error("Error obteniendo los promedios:", error);
            });
    }

    // Llamar la función inicialmente
    fetchAndUpdate();
    // Establecer un intervalo para que se llame cada 5 segundos
    setInterval(fetchAndUpdate, 5000);
});
