function cargarCantidadExamenes(idUsuario) {
  var ruta = 'https://viex-app.herokuapp.com';
  $.ajax({
    async: false,
    cache: true,
    url: ruta + '/examenes/cantidad/' + idUsuario,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function (data) {
    if (!isNaN(data)) {
      $('#cantExamenes').text(data);
      $('#examenesCreados').text(data);
    }
  });
}

function obtenerPlanUsuario(idUsuario) {
  var plan = localStorage.getItem('suscripcion');
  if (plan == 1) {
    var ruta = 'https://viex-app.herokuapp.com';
    $.ajax({
      async: false,
      cache: true,
      url: ruta + '/examenes/cantidad/' + idUsuario,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).done(function (data) {
      $('#planUsuario').text('Gratuito');
      if (!isNaN(data)) {
        var examenesCreados = data;
        console.log('examenes creados: ' + examenesCreados);
        const limiteExamenesFree = 5;
        var examenesRestantes =  limiteExamenesFree - examenesCreados;
        if (examenesRestantes < 0) {
          examenesRestantes = 0;
        }
        $('#examenesRestantes').text(examenesRestantes);
      }
    });
  } else {
    $('#planUsuario').text('Premium');
    $('#examenesRestantes').text('Ilimitado');
  }
}


function cargarCantidadExamenes(idUsuario) {
  var ruta = 'https://viex-app.herokuapp.com';
  $.ajax({
    async: false,
    cache: true,
    url: ruta + '/examenes/cantidad/' + idUsuario,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function (data) {
    if (!isNaN(data)) {
      $('#cantExamenes').text(data);
      $('#examenesCreados').text(data);
    }
  });
}

function cargarCantidadCursos(idUsuario) {
  console.log("----------cargarCantidadCursos---------")
  var ruta = 'https://viex-app.herokuapp.com';
  $.ajax({
    async: false,
    cache: true,
    url: ruta + '/cursos/cantidad/' + idUsuario,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function (data) {
    console.log(data);
    if (!isNaN(data)) {
      $('#cantCursos').text(data);
    }
  });
}





