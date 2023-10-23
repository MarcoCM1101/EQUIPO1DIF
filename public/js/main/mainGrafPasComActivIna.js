/* global Chart*/

// Definimos una función que obtendrá los datos de la API
function fetchDataAndUpdateChart2() {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const data = JSON.parse(xhr.responseText);

            if (data.hasOwnProperty('activo') && data.hasOwnProperty('inactivo')) {
                updateChartData2(myChart2, data.activo || 0, data.inactivo || 0);
            } else {
                console.error('La respuesta no contiene las claves esperadas: normal y donativo.');
                console.log(data);
            }

        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }
    };

    xhr.onerror = () => {
        alert('Hubo un error al intentar conectarse al servidor. Por favor intenta más tarde.');
    };

    // Suponiendo que la API que proporciona los datos tiene la URL '/dataForPieChart'
    xhr.open('GET', '/comedoresActivosInactivos');
    xhr.send();
}

// Definimos una función para actualizar el gráfico con los nuevos datos
function updateChartData2(chart, activo, inactivo) {
    chart.data.datasets[0].data = [activo, inactivo];
    chart.update();
}

// Creamos el gráfico inicialmente con datos por defecto
var ctx2 = document.getElementById('pieChart-2').getContext('2d');
var myChart2 = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['Comedores Activos', 'Comedores Inactivos'],
        datasets: [{
            data: [0, 0],  // Valores iniciales (0,0) hasta que se carguen los datos reales
            backgroundColor: [
                'rgba(144, 238, 144, 0.7)', // Verde claro
                'rgba(88, 153, 219, 0.7)'
            ]
        }]
    },
    options: {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    pointStyle: 'circle'
                }
            }
        }
    }
});

// Una vez que se haya cargado el DOM, obtenemos los datos y actualizamos el gráfico
document.addEventListener("DOMContentLoaded", fetchDataAndUpdateChart2);
