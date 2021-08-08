$(document).ready(function () {
  setNombre();
  var idUser = decodificarBase64(localStorage.getItem('id'));
  cargarFoto(decodificarBase64(localStorage.getItem('apellido')));
  cargarCantidadExamenesPendientes(idUser);
  cargarCantidadCursos(idUser);
  cargarCantidadExamenes(idUser);
  cargar_grafico_promedioGeneralPeriodos();
  cargar_grafico_promedioPeriodo("2020-0");
  ruta = 'https://viex-app.herokuapp.com';
  var x = 0;
  $('#tbl-misCursos').DataTable({
    "responsive": true,
    "ordering": true,
    "info": false,
    "searching": false,
    "autoWidth": false,
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
      $('#columna1').val('2020-I').trigger('change');
      $('#columna2').val('UNMSM').trigger('change');
    },

    ajax: {
      url: ruta + '/detallecurso/usuario/' + idUser,
      dataSrc: '',
      async: false,
      cache: true,
      error: function (jqXHR, textStatus, errorThrown) {
        $('#tbl-misCursos').DataTable().clear().draw();
      }
    },
    columns: [
      { data: 'periodo' },
      { data: 'curso' },
      { data: 'profesor' },
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


$(document).on('click', '#btn-listar', function (event) {
  $('#modal-alumnos').modal('toggle');
  var currentRow = $(this).closest("tr");
  var data = $('#tbl-misCursos').DataTable().row(currentRow).data();
  var idCurso = data.idCurso;
  console.log(idCurso)
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


$(document).on('click', '#btn-viewListExamns', function (event) {
  $('#modal-examenCurso').modal('toggle');
  var id_usuario_alumno = decodificarBase64(localStorage.getItem('id'));
  var currentRow = $(this).closest("tr");
  var data = $('#tbl-misCursos').DataTable().row(currentRow).data();
  var id_curso = data.idCurso;
  var nombre_curso = data.curso;
  $('#modal-examenCurso #modal-title').text('Lista de exámenes: ' + nombre_curso);
  console.log(id_curso);
  console.log(nombre_curso);
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

function cargar_grafico_promedioGeneralPeriodos() {
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
      labels: ['2019-1', '2019-2', '2020-0', '2020-1', '2020-2', '2021-0', '2021-1'],
      datasets: [{
        type: 'line',
        label: 'Promedio menor más frecuente',
        data: [10, 12, 11, 14, 11, 12, 11],
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
        data: [12, 15, 13, 16, 9, 14, 12],
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
}

function cargar_grafico_promedioPeriodo(periodo) {

  // Sales graph chart
  var salesGraphChartCanvas = $('#line-chart').get(0).getContext('2d');
  // $('#revenue-chart').get(0).getContext('2d');

  var salesGraphChartData = {
    labels: ['Curso 1', 'curso 2', 'Curso 3', 'Curso 4'],
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
        data: [8, 16, 14, 15]
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






