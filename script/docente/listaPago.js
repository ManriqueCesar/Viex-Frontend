
$(document).ready(function () {
  setNombre();
  var idUser = decodificarBase64(localStorage.getItem('id'));
  var usuario = decodificarBase64(localStorage.getItem('usuario'));
  obtenerPlanUsuario(idUser);
  ruta = 'https://viex-app.herokuapp.com';
  $('#tbl-resultado').DataTable({
    "colReorder": true,
    "responsive": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "searching": true,
    "language": {
      "sSearch": "Buscar:",
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando exámenes del _START_ al _END_ , de un total de _TOTAL_ exámenes",
      "infoEmpty": "Mostrando exámenes del 0 al 0, de un total de 0 exámenes",
      "infoFiltered": "(Filtrando de un total de _MAX_ registros)",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Ultimo",
        "sNext": "Siguiente",
        "sPrevious": "Anterior",
      }
    },


    ajax: {
      url: ruta + '/pagos/buscar/' + idUser,
      dataSrc: '',
      async: false,
      cache: true,
      error: function (jqXHR, textStatus, errorThrown) {
        $('#tbl-examenes').DataTable().clear().draw();
      }
    },
    columns: [
      {
        data: 'fechaPago',
        render: function (data, type, row) {
          return moment(data).format('DD/MM/YYYY');
        }
      },
      {
        data: 'fechaFin',
        render: function (data, type, row) {
          return moment(data).format('DD/MM/YYYY');
        }
      },
      {
        data: 'montoTotal'
      },
      {
        data: 'ecommerce'
      },
      {
        data: null,
        render: function (data, type, row) {
          // console.log(data);
          return '<button title="DETALLE" class="btn btn-primary" id="btn-listar">DETALLE</button>';
        }

      }
    ],
    dom: 'Bfrtip',
    buttons: [{
        'extend': 'excelHtml5',
        'autoFilter': true,
        "text": '<img src="../../../dist/img/icons/excel.png" alt="Descargar Excel" height = "30px" width="40px">',
        customize: function (xlsx) {
          var sheet = xlsx.xl.worksheets['sheet1.xml'];
          $('c[r=A1] t', sheet).text('VIEX |' + ' Lista de Exámenes | ' + usuario);
        },
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
      },
      {
        'extend': 'pdfHtml5',
        'autoFilter': true,
        "text": '<img src="../../../dist/img/icons/pdf.png" alt="Descargar PDF" height = "30px" width="30px">',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }

      },


    ]
  });


});

$('#btn-close').click(function () {
  deleteCookie();
});