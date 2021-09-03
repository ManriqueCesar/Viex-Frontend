$(document).ready(function () {
    setNombre();
    var idUser = decodificarBase64(localStorage.getItem('id'));
    cargarCantidadExamenes(idUser);
    cargarCantidadCursos(idUser);
    obtenerPlanUsuario(idUser);

    ruta = 'https://viex-app.herokuapp.com';
    var table = $('#tbl-ranking').DataTable({
        "aaSorting": [[3, 'desc'], [4, 'asc'], [1, 'asc']],
        "responsive": true,
        "ordering": true,
        "autoWidth": false,
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros",
            "sSearch": "Buscar:",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando alumnos del _START_ al _END_ , de un total de _TOTAL_ alumnos",
            "infoEmpty": "Mostrando cursos del 0 al 0, de un total de 0 cursos",
            "infoFiltered": "(Filtrando de un total de _MAX_ cursos)",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Ultimo",
                "sNext": "Siguiente",
                "sPrevious": "Anterior",
            }
        },

        ajax: {
            url: ruta + '/resultado/promedios',
            dataSrc: '',
            async: false,
            cache: true,
            error: function (jqXHR, textStatus, errorThrown) {
                $('#tbl-ranking').DataTable().clear().draw();
            }
        },
        columns: [
            { data: null, className: "text-center" },
            { data: 'apellido' },
            { data: 'nombre' },
            { data: 'promeido' },
            { data: 'tiempoProm' },
        ]
    });
    table.on('order.dt search.dt', function () {
        table.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
});
