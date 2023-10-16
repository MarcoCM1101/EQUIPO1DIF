/*global Chart, XMLHttpRequest localStorage graficaVentasDonaciones*/

// Variable a nivel de módulo para almacenar la instancia del gráfico
let graficaVentasDonaciones;

function obtenerDatosDeAPI() {
    const xhr = new XMLHttpRequest();
    const idComedor = localStorage.getItem('idComedor');

    xhr.onload = () => {
        try {
            const datos = JSON.parse(xhr.responseText);
            mostrarGraficaOTabla(datos);
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    xhr.open('GET', '/donativoNormales/' + encodeURIComponent(idComedor));
    xhr.send();
}

function mostrarGraficaOTabla(datosApi) {
    if (window.innerWidth > 720) {
        crearGraficaDeBarras(datosApi);
    } else {
        crearYMostrarTabla(datosApi);
    }
}

function crearGraficaDeBarras(datosApi) {
    const ctx = document.getElementById("graficaVentasDonaciones").getContext("2d");
    const tablaVentasDonaciones = document.getElementById("tablaVentasDonaciones");

    if (graficaVentasDonaciones) {
        graficaVentasDonaciones.destroy();
    }

    const labels = datosApi.map(item => new Date(item.Dia).toLocaleDateString());
    const ventas = datosApi.map(item => item.TotalNormales);
    const donaciones = datosApi.map(item => item.TotalDonativos);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Ventas",
                backgroundColor: "rgba(0, 128, 0, 1)",
                borderColor: "rgba(0, 128, 0, 1)",
                borderWidth: 1,
                data: ventas,
            },
            {
                label: "Donaciones",
                backgroundColor: "rgba(255, 165, 0, 1)",
                borderColor: "rgba(255, 165, 0, 1)",
                borderWidth: 1,
                data: donaciones,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                display: false,
            },
        },
    };

    graficaVentasDonaciones = new Chart(ctx, {
        type: "bar",
        data: data,
        options: options,
    });

    ctx.canvas.style.display = "block";
    tablaVentasDonaciones.style.display = "none";
}

function crearYMostrarTabla(datosApi) {
    const tablaVentasDonaciones = document.getElementById("tablaVentasDonaciones");
    tablaVentasDonaciones.innerHTML = "";

    const encabezado = document.createElement("tr");
    encabezado.innerHTML = "<th>Día</th><th>Ventas</th><th>Donaciones</th>";
    tablaVentasDonaciones.appendChild(encabezado);

    datosApi.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${new Date(item.Dia).toLocaleDateString()}</td><td>${item.TotalNormales}</td><td>${item.TotalDonativos}</td>`;
        tablaVentasDonaciones.appendChild(fila);
    });

    tablaVentasDonaciones.style.display = "table";
    if (graficaVentasDonaciones) {
        graficaVentasDonaciones.canvas.style.display = "none";
    }
}

// Llamada inicial para cargar los datos desde la API
obtenerDatosDeAPI();

// Añadir el evento resize al objeto window para ajustar la visualización cuando se cambie el tamaño de la ventana
window.addEventListener("resize", () => obtenerDatosDeAPI());
