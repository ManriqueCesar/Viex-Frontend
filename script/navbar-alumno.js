function cargarCantidadExamenes(idUsuario) {
  var ruta = 'https://viex-app.herokuapp.com';
  console.log('-----cargarCantidadExamenes--------');
  $.ajax({
    async: false,
    cache: true,
    url: ruta + '/examenes/usuario/' + idUsuario,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function (res) {
    console.log(res);
    console.log(res.length);
    $('#cantExamenesPendientes').text(res.length);
    
    
  });
}

function cargarCantidadExamenesPendientes(idUsuario) {
    var ruta = 'https://viex-app.herokuapp.com';
    console.log('-----cargarCantidadExamenesPendientes--------');
    $.ajax({
      async: false,
      cache: true,
      url: ruta + '/examenes/pendientes/' + idUsuario,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).done(function (data) {
      console.log(data);
      console.log(data.length);
      $('#cantPendientes').text(data.length);
      
      
    });
  }

  function cargarCantidadCursos(idUsuario) {
    console.log('-------cargarCantidadCursos-----------');
    console.log("idUser: "+idUsuario);
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
        if(!isNaN(data)){
            $('#cantCursos').text(data);
        } 
    });
  }

  function cargarFoto(apellido) {
    document.getElementById('imgUser').src = "../../dist/js/labeled_images/" + apellido + "/1.jpg";
  }


  

  
  