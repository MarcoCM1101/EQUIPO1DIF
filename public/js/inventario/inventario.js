/*global $ localStorage fetch*/

$(document).ready(function () {

    function cargarNombreComedor(idComedor) {
        $.get(`/comedor/${idComedor}`, function (data) {
            if (data && data.nombre) {
                $("#nombreComedor").text(data.nombre);
            } else {
                console.error('No se pudo obtener el nombre del comedor.');
            }
        }).fail(function(error) {
            console.error('Error al obtener el nombre del comedor:', error);
        });
    }

    function restarProducto(idProducto) {
        $.ajax({
            url: `/inventario/restar/${idProducto}`,
            type: 'PUT',
            success: function(response) {
                console.log(response.message);
                cargarInventarioPorComedor(localStorage.getItem('idComedor'));
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function sumarProducto(idProducto) {
        $.ajax({
            url: `/inventario/sumar/${idProducto}`,
            type: 'PUT',
            success: function(response) {
                console.log(response.message);
                cargarInventarioPorComedor(localStorage.getItem('idComedor'));
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function eliminarProducto(idProducto) {
        const isUserSure = confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.');
        
        if(isUserSure) {
            $.ajax({
                url: `/inventario/eliminar/${idProducto}`,
                type: 'DELETE',
                success: function(response) {
                    console.log(response.message);
                    cargarInventarioPorComedor(localStorage.getItem('idComedor'));
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        } else {
            console.log('Eliminación cancelada por el usuario.');
        }
    }

    function cargarInventarioPorComedor(idComedor) {
        $.get(`/inventarioByComedor/${idComedor}`, function (data) {
            $("#tablaInventario").empty();
            data.forEach(function (producto) {
                const filaHTML = `
                    <tr>
                        <td>${producto.producto}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.unidadmedida}</td>
                        <td>
                            <button class="col-5 col-lg-3 btn btn-primary btn-sm btn-custom restar" data-id="${producto.idProducto}">-</button>
                            <button class="col-5 col-lg-3 btn btn-primary btn-sm btn-custom sumar" data-id="${producto.idProducto}">+</button>
                            <button class="col-12 col-lg-auto btn btn-primary btn-sm btn-custom eliminar" data-id="${producto.idProducto}">Eliminar</button>
                        </td>
                    </tr>
                `;
                $("#tablaInventario").append(filaHTML);
            });
        });
    }

    $("#tablaInventario").on('click', '.restar', function () {
        const idProducto = $(this).data('id');
        restarProducto(idProducto);
    });

    $("#tablaInventario").on('click', '.sumar', function () {
        const idProducto = $(this).data('id');
        sumarProducto(idProducto);
    });

    $("#tablaInventario").on('click', '.eliminar', function () {
        const idProducto = $(this).data('id');
        eliminarProducto(idProducto);
    });

    const idComedor = localStorage.getItem('idComedor'); 
    cargarInventarioPorComedor(idComedor);
    cargarNombreComedor(idComedor);

    var productoUnidadMap = {
        'ACEITE VEGETAL': 'Lt',
        'ARROZ SUPER EXTRA': 'Kg',
        'ATUN EN AGUA': 'Pieza(s)',
        'AZUCAR ESTANDAR': 'Kg',
        'CAFE MOLIDO': 'Pieza(s)',
        'CHICHAROS Y ZANAHORIAS': 'Pieza(s)',
        'CHILE CHIPOTLE ADOBADO': 'Kg',
        'CHILE GUAJILLO': 'Pieza(s)',
        'CHILE JALAPEÑO EN RAJAS': 'Pieza(s)',
        'CONCENTRADO PARA AGUA DE SABOR': 'Pieza(s)',
        'CONSOME DE POLLO': 'Kg',
        'ELOTE EN LATA': 'Pieza(s)',
        'FRIJOL REFRITO': 'Pieza(s)',
        'GALLETAS SALADAS': 'Paquete(s)',
        'HARINA DE MAIZ': 'Kg',
        'HUEVO': 'Pieza(s)',
        'LECHE SEMIDESCREMADA DESLACTOSADA': 'Lt',
        'LENTEJA': 'Pieza(s)',
        'ADEREZO MAYONESA': 'Kg',
        'PASTA PARA SOPA CORTA': 'Pieza(s)',
        'PASTA TIPO SPAGUETTI': 'Pieza(s)',
        'SAL': 'Kg',
        'SARDINA EN TOMATE': 'Pieza(s)',
        'GARBANZO': 'Pieza(s)',
        'PURE DE TOMATE': 'Kg'
    };

    function establecerUnidadMedida() {
        var productoSeleccionado = document.getElementById("producto").value;
        var unidad = productoUnidadMap[productoSeleccionado];
        document.getElementById("unidadMedida").value = unidad;
    }

    document.getElementById("producto").addEventListener("change", establecerUnidadMedida);

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();

        var idComedor = localStorage.getItem('idComedor');
        var producto = document.getElementById("producto").value;
        var cantidad = document.getElementById("cantidad").value;
        var unidadMedida = document.getElementById("unidadMedida").value;

        var data = {
            idComedor: idComedor,
            producto: producto,
            cantidad: cantidad,
            unidadmedida: unidadMedida
        };

        fetch('/insertarProductoInventario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            cargarInventarioPorComedor(idComedor);
            document.querySelector("form").reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
