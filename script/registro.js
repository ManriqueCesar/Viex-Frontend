

$('#btn-registro').click(function () {
  $("#btn-registro").attr('disabled', 'disabled');
  if (document.querySelector('#txt-password').value != document.querySelector('#txt-repeatPassword').value) {
    Toast.fire({
      icon: 'warning',
      title: 'Las contraseñas deben coincidir'
    })
  } else {
    var usuario = {
      nombres: document.querySelector('#txt-email').value,
      apellidos: document.querySelector('#txt-password').value,
      correo: document.querySelector('#txt-nombres').value,
      dni: document.querySelector('#txt-dni').value,
      contraseña: document.querySelector('#txt-apellidos').value
    }

    registro(usuario);
  }

});

function registro(user) {
  var ruta = 'https://viex-app.herokuapp.com';
  // var ruta = 'http://localhost:9090';
  
  request = {};
  request.email = user.correo;
  request.password = user.contraseña;
  request.nombre = user.nombres;
  request.apellido = user.apellidos;
  request.dni = user.dni;

  $.ajax({
    url: ruta + '/usuarios/register',
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
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      icon: 'success',
      title: 'Usuario creado correctamente. Redirecionando ...'
    });

    $("#btn-registro").removeAttr('disabled');

    document.location.href = "../pages/alumno/examenesPendientes.html";
  }).fail(function (jqXHR, textStatus, errorThrown) {
    $("#btn-registro").removeAttr('disabled');
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