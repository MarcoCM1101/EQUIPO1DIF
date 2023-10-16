/*global $*/

$(document).ready(function() {
    // Carga los comedores en el dropdown
    $.get('/comedores', function(data) {
        const selectComedor = $('#comedor');
        data.forEach(comedor => {
            selectComedor.append(`<option value="${comedor.idComedor}">${comedor.nombre}</option>`);
        });
    }).fail(function() {
        console.error("Error al cargar los comedores");
    });

    // Escucha el evento submit del formulario
    $('form').submit(function(event) {
        event.preventDefault();

        const idComedor = $('#comedor').val();
        const higiene = $('input[name="higiene"]:checked').val();
        const atencion = $('input[name="atencion"]:checked').val();
        const comida = $('input[name="comida"]:checked').val();
        const comentario = $('#comentarios').val() || 'Sin Comentarios';

        const postData = {
            idComedor: idComedor,
            higiene: higiene,
            atencion: atencion,
            comida: comida,
            comentario: comentario
        };

        // Envía las respuestas de la encuesta al endpoint
        $.ajax({
            url: '/insertarEncuesta',
            type: 'POST',
            data: JSON.stringify(postData),
            contentType: 'application/json',
            success: function() {
                alert("Encuesta enviada exitosamente");
                // Resetear los valores del formulario
                $('form')[0].reset();
            },
            error: function() {
                console.error("Error al enviar la encuesta");
            }
        });
    });
});
