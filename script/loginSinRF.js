function validar_credenciales(sCorreo, sContrasena) {
  var ruta = 'https://viex-app.herokuapp.com';
  //var ruta = 'http://localhost:9090';
  request = {};
  request.email = sCorreo;
  request.password = sContrasena;
  $.ajax({
    url: ruta + '/usuarios/login',
    processData: false,
    type: 'POST',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: JSON.stringify(request),
  }).done(function (data) {
    console.log(data);
    $("#btn-ingresar").removeAttr('disabled');

    localStorage.setItem ('apellido',codificarBase64(data.apellido))
    localStorage.setItem ('suscripcion',data.plan.idPlan);
    
    if (data.roles[0].nombre == 'ROLE_ALUM') {

      localStorage.setItem ('apellido',codificarBase64(data.apellido));
      localStorage.setItem ('usuario',codificarBase64(data.nombre +' '+ data.apellido));
      localStorage.setItem ('nombre',codificarBase64(data.nombre));
      localStorage.setItem ('id',codificarBase64(data.idUsuario));
      localStorage.setItem ('rol',codificarBase64(data.roles[0].nombre));

    } else if (data.roles[0].nombre == 'ROLE_PROF') {

      localStorage.setItem ('rol',codificarBase64(data.roles[0].nombre));
      localStorage.setItem ('usuario',codificarBase64(data.nombre + ' ' + data.apellido));
      localStorage.setItem ('nombre',codificarBase64(data.nombre));
      localStorage.setItem ('id',codificarBase64(data.idUsuario));
      localStorage.setItem ('plan', codificarBase64(JSON.stringify(data.plan)));

      window.location.href = '../pages/docente/crearExamen.html';
    }

  }).fail(function (jqXHR, textStatus, errorThrown) {
    $("#btn-ingresar").removeAttr('disabled');
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    if (jqXHR.responseJSON.status == 500) {
      Toast.fire({
        icon: 'error',
        title: 'Correo o contraseña incorrectos'
      })
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Error. Por favor intente nuevamente'
      })
    }
  })
}

$(document).ready(function () {
  $('#txt-email').val('cchavez@unmsm.edu.pe');
  $('#txt-password').val('1234');
  setTimeout(function () {
          
          document.location.href = "../pages/alumno/examenesPendientes.html";
  }, 5000);
      


});

$('#btn-ingresar').click(function () {
  $("#btn-ingresar").attr('disabled', 'disabled');
  sCorreo = document.querySelector('#txt-email').value;
  sContrasena = document.querySelector('#txt-password').value;
  validar_credenciales(sCorreo, sContrasena);
});

$('#btn-close').click(function () {
  deleteCookie();
});