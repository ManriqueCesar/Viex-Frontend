$(document).ready(function () {
  setNombre();
  var idUser = decodificarBase64(localStorage.getItem('id'));
  cargarFoto(decodificarBase64(localStorage.getItem('apellido')));
  cargarCantidadExamenesPendientes(idUser);
  cargarCantidadCursos(idUser);
  cargarCantidadExamenes(idUser);
  cargar_resumen();
  var idUser = decodificarBase64(localStorage.getItem('id'));
  ruta = 'https://viex-app.herokuapp.com';
  var x = 0;
  $('#tbl-misCursos').DataTable({    
    "searching": false,
    "responsive": true,
    "ordering": true,
    "autoWidth": false,
    "language": {
      "sSearch": "Buscar:",
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando cursos del _START_ al _END_ , de un total de _TOTAL_ cursos",
      "infoEmpty": "Mostrando cursos del 0 al 0, de un total de 0 cursos",
      "infoFiltered": "(Filtrando de un total de _MAX_ cursos)",
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
        x++;
        var select = $('<select class="cboselect" id="columna' + x + '" multiple="multiple" style="width: 100%; color:blue;"><option value=""></option></select>')
          .appendTo($(column.header()).empty())
          //.appendTo($(column.footer()).empty())
          .on('change', function () {
            var vals = $('option:selected', this).map(function (index, element) {
              return $.fn.dataTable.util.escapeRegex($(element).val());
            }).toArray().join('|');

            column
              .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
              .draw();
          });

        column.data().unique().sort().each(function (d, j) {
          select.append('<option value="' + d + '">' + d + '</option>')
        });
      });

      $(".cboselect").select2({
        closeOnSelect: false,
        theme: "classic"
      });
    },

    ajax: {
      url: ruta + '/detallecurso/usuario/promedio/' + idUser,
      dataSrc: '',
      async: false,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        $('#tbl-misCursos').DataTable().clear().draw();
      }
    },
    columns: [
      { data: 'periodo' },
      { data: 'nombre' },
      { data: 'profesor' },
      { data: 'promedio' },
      {
        data: null,
        render: function (data, type, row) {
          return '<button title="LISTA" class="btn btn-primary" id="btn-listar">LISTA</button>';
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return '<img src="../../dist/img/icons/icon_view.png"  id="btn-viewListExamns" title="Ver Curso" width=30px;  height=30px; type="button">';
        }
      }]
  });
});


$(document).on('click', '#custom-tabs-one-home-tab', function (event) {
  cargar_resumen();
});

$(document).on('click', '#tab-lista-alumnos-tab', function (event) {
  $('#tbl-misCursos').DataTable().ajax.reload();
});

$(document).on('click', '#btn-listar', function (event) {
  $('#modal-alumnos').modal('toggle');
  var currentRow = $(this).closest("tr");
  var data = $('#tbl-misCursos').DataTable().row(currentRow).data();
  var idCurso = data.idCurso;
  ruta = 'https://viex-app.herokuapp.com';
  var x = 0;
  $('#tbl-listado').DataTable({
    "destroy": true,
    "lengthChange": false,
    "searching": false,
    "autoWidth": false,
    "responsive": true,
    initComplete: function () {
      this.api().columns().every(function () {
        var column = this;

      });

      $(".cboselect").select2({
        closeOnSelect: false
      });
    },

    ajax: {
      url: ruta + '/detallecurso/curso/alumnos/' + idCurso,
      dataSrc: '',
      async: false,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        $('#tbl-listado').DataTable().clear().draw();
      }
    },
    columns: [{
      data: null,
      render: function (data, type, row) {
        return data.apellido + ' ' + data.nombre
      }
    },
    {
      data: 'email'
    }

    ]
  });
});


$('#btn-close').click(function () {
  deleteCookie();

});

$(document).on('change', '#id_select_periodos', function (event) {
  var value_select_period = $(this).val();
  console.log(value_select_period);
  $("#id_title_periodo h3").html("<i class='fas fa-th mr-1'></i> SEGUIMIENTO DE PERIODO " + value_select_period);
  cargar_grafico_promedioPeriodo(value_select_period);
});

$(document).on('click', '#btn-viewListExamns', function (event) {
  $('#modal-examenCurso').modal('toggle');
  var id_usuario_alumno = decodificarBase64(localStorage.getItem('id'));
  var currentRow = $(this).closest("tr");
  var data = $('#tbl-misCursos').DataTable().row(currentRow).data();
  var id_curso = data.idCurso;
  var nombre_curso = data.nombre;
  $('#modal-examenCurso #modal-title').text('Lista de exámenes: ' + nombre_curso);
  ruta = 'https://viex-app.herokuapp.com';
  var x = 0;
  var table = $('#tbl-listadoExamen').DataTable({
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
    "order": [[1, 'asc']],
    initComplete: function () {
      this.api().columns().every(function () {
        var column = this;
      });
      $(".cboselect").select2({ closeOnSelect: false });
    },
    ajax: {
      url: ruta + '/examenes/curso/' + id_curso + '/alumno/' + id_usuario_alumno,
      dataSrc: 'examenes',
      async: false,
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        $('#tbl-listadoExamen').DataTable().clear().draw();
      }
    },
    columns: [
      { data: null },
      { data: 'titulo' },
      { data: 'fecha_inicio' },
      { data: 'tiempo_duracion' },
      { data: 'fecha_envio' },
      { data: 'estado' },
      { data: 'tiempo_plagio' },
      { data: 'nota' }]
  });
  table.on('order.dt search.dt', function () {
    table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
      cell.innerHTML = i + 1;
    });
  }).draw();
});

function cargar_resumen() {
  cargar_grafico_promedioGeneralPeriodos();
  $('#visitors-chart').height(200);
}

function cargar_grafico_promedioGeneralPeriodos() {
  var array_title_periodo = [];
  var array_value_promedio_general = [];
  let html_option_periodo = "";
  // cargar datos  
  var idUser = decodificarBase64(localStorage.getItem('id'));
  ruta = 'https://viex-app.herokuapp.com';
  // cantidad de cursos usuario
  $.ajax({
    url: ruta + '/cursos/cantidad/' + idUser,
    async: false,
    type: 'GET',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function (data) {
    $("#id_total_cursos").html(data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseJSON.mensaje);
  });
  // data resumen seguimiento promedio todos los periodos
  $.ajax({
    url: ruta + '/cursos/periodo/promedios/' + idUser,
    async: false,
    type: 'GET',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function (data) {
    i = 1;
    data.lista.forEach(function (element) {
      array_title_periodo.push(element.periodo);
      array_value_promedio_general.push(element.promedio.toFixed(2));
      if(data.lista.length === i){
        html_option_periodo += "<option selected='true' value=" + element.periodo + ">" + element.periodo + "</option>";
      }else{
        html_option_periodo += "<option value=" + element.periodo + ">" + element.periodo + "</option>";
      }
      i++;
    });
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseJSON.mensaje);
  });
  $("#id_select_periodos").html(html_option_periodo);

  var ticksStyle = {
    fontColor: '#495057',
    fontStyle: 'bold'
  }
  var mode = 'index'
  var intersect = true

  var $visitorsChart = $('#visitors-chart');
  // eslint-disable-next-line no-unused-vars
  var visitorsChart = new Chart($visitorsChart, {
    data: {
      labels: array_title_periodo,
      datasets: [
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
  cargar_grafico_promedioPeriodo(array_title_periodo[array_title_periodo.length - 1]);
}

function cargar_grafico_promedioPeriodo(periodo) {
  if (periodo) {
    $("#id_title_periodo h3").html("<i class='fas fa-th mr-1'></i> SEGUIMIENTO DE PERIODO " + periodo);
    var array_title = [];
    var array_data = [];
    // cargar data 
    var idUser = decodificarBase64(localStorage.getItem('id'));
    ruta = 'https://viex-app.herokuapp.com';
    // cantidad de cursos usuario
    $.ajax({
      url: ruta + '/cursos/periodo/' + idUser + '/' + periodo,
      async: false,
      type: 'GET',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).done(function (data) {
      data.lista.forEach(function (element) {
        array_title.push(element.nombre);
        array_data.push(element.promedio.toFixed(2));
      });
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseJSON.mensaje);
    });
    // Sales graph chart
    var salesGraphChartCanvas = $('#line-chart').get(0).getContext('2d');
    // $('#revenue-chart').get(0).getContext('2d');

    var salesGraphChartData = {
      labels: array_title,
      datasets: [
        {
          label: 'Promedio general',
          fill: false,
          borderWidth: 4,
          lineTension: 0,
          spanGaps: true,
          borderColor: '#efefef',
          pointRadius: 3,
          pointHoverRadius: 7,
          pointColor: '#efefef',
          pointBackgroundColor: '#efefef',
          data: array_data
        }
      ]
    };

    var salesGraphChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#efefef'
          },
          gridLines: {
            display: false,
            color: '#efefef',
            drawBorder: false
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 20,
            fontColor: '#efefef'
          },
          gridLines: {
            display: true,
            color: '#efefef',
            drawBorder: false
          }
        }]
      }
    };

    // This will get the first returned node in the jQuery collection.
    // eslint-disable-next-line no-unused-vars
    var salesGraphChart = new Chart(salesGraphChartCanvas, {
      type: 'line',
      data: salesGraphChartData,
      options: salesGraphChartOptions
    });
  }
}






