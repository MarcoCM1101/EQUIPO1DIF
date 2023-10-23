/* global Chart*/

// Definimos una función que obtendrá los datos de la API
function fetchDataAndUpdateChart() {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        try {
            const data = JSON.parse(xhr.responseText);

            if (data.hasOwnProperty('normal') && data.hasOwnProperty('donativo')) {
                updateChartData(myChart, data.normal || 0, data.donativo || 0);
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
    xhr.open('GET', '/ventaDonativos');
    xhr.send();
}

// Definimos una función para actualizar el gráfico con los nuevos datos
function updateChartData(chart, normal, donativo) {
    chart.data.datasets[0].data = [normal, donativo];
    chart.update();
}

// Creamos el gráfico inicialmente con datos por defecto
var ctx = document.getElementById('pieChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Total de Ventas', 'Total de Donaciones'],
        datasets: [{
            data: [0, 0],  // Valores iniciales (0,0) hasta que se carguen los datos reales
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)'
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
document.addEventListener("DOMContentLoaded", fetchDataAndUpdateChart);
