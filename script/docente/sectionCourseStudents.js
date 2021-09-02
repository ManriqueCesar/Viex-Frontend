$(document).ready(function () {
    setNombre();
    var idUser = decodificarBase64(localStorage.getItem('id'));
    cargarCantidadExamenes(idUser);
    cargarCantidadCursos(idUser);
    obtenerPlanUsuario(idUser);
    var course_id = decodificarBase64(localStorage.getItem('course_id'));
    var course_name = decodificarBase64(localStorage.getItem('course_name'));
    $('.nombre-curso-activo').each(function (index) {
        console.log(index + ": " + $(this).text());
        $(this).text(course_name);
    });
    cargar_resumen();
    var curso_id = decodificarBase64(localStorage.getItem('course_id'));
    ruta = 'https://viex-app.herokuapp.com';
    var x = 0;
    var data_result = [];
    var table = $('#tbl-lista-alumnos').DataTable({
        "destroy": false,
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
        "order": [[ 1, 'asc' ]],
        initComplete: function () {
            this.api().columns().every(function () {
                var column = this;
            });
            $(".cboselect").select2({ closeOnSelect: false });
        },
        ajax: {
            url: ruta + '/cursos/alumnos/' + curso_id,
            dataSrc: 'alumnos',
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
            { data: 'promedio' },
            { data: 'cantExamAprob' },
            { data: 'cantExamRepro' },
            { data: 'cantExamAusen' },
            {
                data: null,
                render: function (data, type, row) {
                    return '<img src="../../dist/img/icons/icon_delete.png"  id="btn-eliminar-alumno" title="ELIMINAR" width=30px;  height=30px; type="button"></button>' + ' | ' +
                        '<img src="../../dist/img/icons/icon_view.png"  id="btn-listExamsAlumn" title="Ver exámenes" width=30px;  height=30px; type="button">'
                        ;
                }
            }]
    });
    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
});


$(document).on('click', '#custom-tabs-one-home-tab', function (event) {
    cargar_resumen();    
});

$(document).on('click', '#tab-lista-alumnos-tab', function (event) {
    $('#tbl-lista-alumnos').DataTable().ajax.reload();
});


$(document).on('click', '#btn-agregar-alumno', function (event) {
    $('#btn-agregar-alumno').attr('disabled', true);
    var ruta = 'https://viex-app.herokuapp.com';
    var course_id = decodificarBase64(localStorage.getItem('course_id'));
    //algoritmo para asignar los alumnos en un array
    var alumnos = $('#txt-alumnos').val();
    listaAlumnos = alumnos.split('\n');
    arregloAlumnos = [];
    arreglo_idAlumnos = [];
    arreglo_AlumnosError = [];
    arregloAlumnos = arregloAlumnos.concat(listaAlumnos);
    //fin algoritmo
    // consultar cada email para obtener el id
    arregloAlumnos.forEach(element => {
        if(element != ""){
            $.ajax({
                url: ruta + '/usuarios/email/' + element,
                async: false,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).done(function (data) {
                arreglo_idAlumnos.push({'email': element, 'idUsuario': data.idUsuario});
            }).fail(function (jqXHR, textStatus, errorThrown) {
                arreglo_AlumnosError.push({'email':element, 'error':jqXHR.responseJSON.mensaje});
            });
        }
    });
    // fin consulta    
    let cantidad_creados = 0;    
    arreglo_idAlumnos.forEach(element =>{
        var request = {};
        request.idCurso = course_id;
        request.idAlumno = element.idUsuario;
        $.ajax({
            url: ruta + '/detallecurso/alumno',
            async: false,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(request)
        }).done(function () {
            cantidad_creados++;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            arreglo_AlumnosError.push({'email':element.email, 'error':jqXHR.responseJSON.mensaje});
        })
    });   
    var modals_swal = []
    if(cantidad_creados > 0){
        modals_swal.push({
            icon: 'success',
            title: '¡Alumno(s) agregado(s)!',
            text: 'Podrás verlo(s) en la tabla',
            showCloseButton: false,
            showConfirmButton: true
        });
        $('#tbl-lista-alumnos').DataTable().ajax.reload(null, false);
    }
    if (arreglo_AlumnosError.length > 0){
        var text_error = "";
        let i = 1;
        arreglo_AlumnosError.forEach(element =>{
            text_error += "<br>("+i+") alumno: '"+element.email+"' - error: '"+element.error+"'";
            i++;
        });
        modals_swal.push({
            icon: 'error',
            title: '¡Error!',
            html: 'No se pudo registrar los siguientes alumnos:\n'+text_error,
            showCloseButton: false,
            showConfirmButton: true
        });
    }
    if (modals_swal.length == 1){
        Swal.fire(modals_swal[0]);
    }else if(modals_swal.length == 2){
        Swal.fire(modals_swal[0]).then((result)=>{
            if(result.value){
                Swal.fire(modals_swal[1]);
            }
        });
    }    
    $('#txt-alumnos').val("");
    $('#btn-agregar-alumno').attr('disabled', false);
});


$(document).on('click', '#btn-eliminar-alumno', function (event) {
    var course_id = decodificarBase64(localStorage.getItem('course_id'));
    ruta = 'https://viex-app.herokuapp.com';
    var currentRow = $(this).closest("tr");
    var data = $('#tbl-lista-alumnos').DataTable().row(currentRow).data();
    var nombre_alumno = data.nombre+" "+data.apellido;
    var id_alumno = data.idAlumno;
    var request = {};
    request.idCurso = course_id;
    request.idAlumno = id_alumno;
    Swal.fire({
        title: '¿Está seguro?',
        text: "Se eliminará a "+nombre_alumno,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, borrar!'
    }).then((result)=>{
        if (result.value){
            $.ajax({
                url: ruta + '/detallecurso/alumno',
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(request)
            }).done(function (data) {
                $(currentRow).closest('tr').fadeOut(300, function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Alumno eliminado',
                        showConfirmButton: false,
                        timer: 1150
                    });
                    $('#tbl-lista-alumnos').DataTable().ajax.reload(null, false);
                });
        
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    html: 'No se pudo eliminar:',
                    showCloseButton: false,
                    showConfirmButton: true
                });
            });
        }
    });    
});


$(document).on('click', '#btn-listExamsAlumn', function (event) {
    $('#modal-examenes_alumno').modal('toggle');
    var currentRow = $(this).closest("tr");
    var id_curso = decodificarBase64(localStorage.getItem('course_id'));
    var data = $('#tbl-lista-alumnos').DataTable().row(currentRow).data();
    var id_usuario_alumno = data.idAlumno;
    var nombre_alumno = data.apellido + ', ' + data.nombre;
    $('#modal-examenes_alumno #modal-title').text('Lista de exámenes: '+nombre_alumno);
    console.log(id_usuario_alumno);
    console.log(nombre_alumno);
    ruta = 'https://viex-app.herokuapp.com';
    var x = 0;  
    var table = $('#tbl-lista-examen_alumno').DataTable({
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
        "order": [[ 1, 'asc' ]],
        initComplete: function () {
            this.api().columns().every(function () {
                var column = this;
            });
            $(".cboselect").select2({ closeOnSelect: false });
        },
        ajax: {
            url: ruta + '/examenes/curso/'+ id_curso +'/alumno/' + id_usuario_alumno,
            dataSrc: 'examenes',
            async: false,
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {
                $('#tbl-lista-examen_alumno').DataTable().clear().draw();
            }
        },
        columns: [
            { data: null },
            { data: 'titulo' },
            { data: 'fecha_inicio' },
            { data: 'tiempo_duracion' },
            { data: 'estado' },
            { data: 'fecha_envio' },
            { data: 'tiempo_plagio' },            
            { data: 'nota' }]
    });
    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
});

function cargar_resumen(){
    var course_id = decodificarBase64(localStorage.getItem('course_id'));
    ruta = 'https://viex-app.herokuapp.com';
    $.ajax({
        url: ruta + '/cursos/detalle/' + course_id,
        async: false,
        type: 'GET',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).done(function (data) {
        console.log(data);
        $('#total_alumnos').html(data.cantAlumnos);
        $('#id_promedio_general h3').html(data.promCurso.toFixed(2));
        $('#id_desviacion_estandar h3').html(data.desvCurso.toFixed(2));
        $('#id_alumnos_aprobados h3').html(data.cantAprob);
        $('#id_alumnos_desaprobados h3').html(data.cantDesap);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON.mensaje);
    });
    cargar_grafico_promedioGeneralCurso();
}

function cargar_grafico_promedioGeneralCurso() {
    var array_title = [];
    var array_value_promedio_general = [];
    var array_value_promedido_fr = [];
    // cargar datos
    var course_id = decodificarBase64(localStorage.getItem('course_id'));
    ruta = 'https://viex-app.herokuapp.com';
    $.ajax({
        url: ruta + '/examenes/promedio/curso/' + course_id,
        async: false,
        type: 'GET',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).done(function (data) {
        data.examenes.forEach(function (element){
            array_title.push(element.titulo);
            array_value_promedio_general.push(element.promedio.toFixed(2));
            array_value_promedido_fr.push(element.promFR.toFixed(2));
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON.mensaje);
    });

    var ticksStyle = {
      fontColor: '#495057',
      fontStyle: 'bold'
    };
    var mode = 'index';
    var intersect = true;
    var $visitorsChart = $('#visitors-chart');
    // eslint-disable-next-line no-unused-vars
    var visitorsChart = new Chart($visitorsChart, {
      data: {
        labels: array_title,
        datasets: [{
          type: 'line',
          label: 'Promedio más frecuente',
          data: array_value_promedido_fr,
          backgroundColor: '#18ADC4',
          borderColor: 'rgba(60,141,188,0.8)',
          pointBorderColor: '#17a2b8',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          fill: true
          // pointHoverBackgroundColor: '#007bff',
          // pointHoverBorderColor    : '#007bff'
        },
        {
          type: 'line',
          label: 'Promedio general',
          data: array_value_promedio_general,
          backgroundColor: 'rgba(210, 214, 222, 1)',
          borderColor: '#B9BFCC',
          pointBorderColor: '#B9BFCC',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          fill: true
          // pointHoverBackgroundColor: '#ced4da',
          // pointHoverBorderColor    : '#ced4da'
        }]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          mode: mode,
          intersect: intersect
        },
        hover: {
          mode: mode,
          intersect: intersect
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            // display: false,
            gridLines: {
              display: true,
              lineWidth: '4px',
              color: 'rgba(0, 0, 0, .2)',
              zeroLineColor: 'transparent'
            },
            ticks: $.extend({
              beginAtZero: true,
              suggestedMax: 20
            }, ticksStyle)
          }],
          xAxes: [{
            display: true,
            gridLines: {
              display: false
            },
            ticks: ticksStyle
          }]
        }
      }
    });    
    $('#visitors-chart').height(200);
  }