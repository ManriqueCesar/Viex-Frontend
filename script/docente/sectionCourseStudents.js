$(document).ready(function () {
    setNombre();
    var idUser = localStorage.getItem('id');
    cargarCantidadExamenes(idUser);
    cargarCantidadCursos(idUser);
    var course_id = localStorage.getItem('course_id');
    var course_name = localStorage.getItem('course_name');
    console.log(course_id);
    console.log(course_name);
    $('.nombre-curso-activo').each(function (index) {
        console.log(index + ": " + $(this).text());
        $(this).text(course_name);
    });
});

$(document).on('click', '#tab-lista-alumnos-tab', function (event) {
    var id = localStorage.getItem('course_id');
    console.log(id)
    ruta = 'https://viex-app.herokuapp.com';
    var x = 0;
    $('#tbl-lista-alumnos').DataTable({
        "destroy": true,
        "lengthChange": false,
        "searching": false,
        "autoWidth": false,
        "responsive": true,
        "language": {
            "sSearch": "Buscar:",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando alumnos del _START_ al _END_ , de un total de _TOTAL_ alumnos",
            "infoEmpty": "Mostrando alumnos del 0 al 0, de un total de 0 alumnos",
            "infoFiltered": "(Filtrando de un total de _MAX_ alumnos)",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Ultimo",
                "sNext": "Siguiente",
                "sPrevious": "Anterior",
            }
        },
        initComplete: function () {
            this.api().columns().every(function () {
                var column = this;

            });

            $(".cboselect").select2({ closeOnSelect: false });
        },

        ajax: {
            url: ruta + '/detallecurso/curso/alumnos/' + id,
            dataSrc: '',
            async: false,
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {
                $('#tbl-lista-alumnos').DataTable().clear().draw();
            }
        },
        columns: [
            { data: null },
            { data: 'nombre' },
            { data: 'apellido' },
            { data: null },
            { data: null },
            { data: null },
            { data: null },
            {
                data: null,
                render: function (data, type, row) {
                    return '<img src="../../dist/img/icons/icon_delete.png"  id="btn-eliminar-alumno" title="ELIMINAR" width=30px;  height=30px; type="button"></button>' + ' | ' +
                        '<img src="../../dist/img/icons/icon_view.png"  id="btn-listExamsAlumn" title="Ver exámenes" width=30px;  height=30px; type="button">'
                        ;

                }
            }]
    });

});

$(document).on('click', '#btn-agregar-alumno', function (event) {
    var ruta = 'https://viex-app.herokuapp.com';

    //algoritmo para asignar los alumnos en un array
    var alumnos = $('#txt-alumnos').val();
    listaAlumnos = alumnos.split('\n');
    arregloAlumnos = [];
    arregloAlumnos = arregloAlumnos.concat(listaAlumnos);
    console.log(arregloAlumnos);
    //fin algoritmo

    var curso = {};
    var request = {};
    var id = localStorage.getItem('id');

    curso.centroEstudios = $('#cbo-centro').val().toUpperCase();
    curso.curso = $('#txt-curso').val();
    curso.eap = $('#cbo-eap').val().toUpperCase();
    curso.periodo = $('#cbo-periodo').val();
    curso.idCurso = null;
    request.curso = curso;
    request.idUsuario = id;
    request.emailAlumnos = arregloAlumnos;
    request.idDetalleCurso = null;
    $.ajax({
        url: ruta + '/detallecurso/',
        type: 'POST',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(request)
    }).done(function () {

        Swal.fire({
            icon: 'success',
            title: '¡Alumno agregado!',
            text: 'Podrás verlo en Parámetros'
        })
        $('#tbl-resultado').DataTable().ajax.reload(null, false);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: jqXHR.responseJSON.mensaje
        })
    })
});


$(document).on('click', '#btn-eliminar-alumno', function (event) {
    var id_curso = localStorage.getItem('course_id');
    ruta = 'https://viex-app.herokuapp.com';
    var currentRow = $(this).closest("tr");
    var data = $('#tbl-lista-alumnos').DataTable().row(currentRow).data();
    var id_alumno = data.idUsuario;
    $.ajax({
        url: ruta + '/detallecurso/curso/alumnos/' + id_curso + '/' + id_alumno,
        type: 'DELETE',
        dataType: 'json'
    }).done(function (data) {
        $(currentRow).closest('tr').fadeOut(1500, function () {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Curso eliminado',
                showConfirmButton: false,
                timer: 1500
            })
            $('#tbl-lista-alumnos').DataTable().ajax.reload(null, false);
        });

    }).fail(function (jqXHR, textStatus, errorThrown) {

    })
});


$(document).on('click', '#btn-listExamsAlumn', function (event) {
    $('#modal-examenes_alumno').modal('toggle');
    var currentRow = $(this).closest("tr");
    var data = $('#tbl-lista-alumnos').DataTable().row(currentRow).data();
    var id = data.idUsuario;
    var nombre_alumno = data.apellido + ', ' + data.nombre;
    $('#modal-examenes_alumno #modal-title').text('Lista de exámenes: '+nombre_alumno);
    console.log(id);
    console.log(nombre_alumno);
    ruta = 'https://viex-app.herokuapp.com';
    var x = 0;  
});