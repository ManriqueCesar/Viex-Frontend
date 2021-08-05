

$('#btn-registro').click(function () {
  //$("#btn-registro").attr('disabled', 'disabled');
  nombres = document.querySelector('#txt-email').value;
  apellidos = document.querySelector('#txt-apellidos').value;
  correo = document.querySelector('#txt-nombres').value;
  dni = document.querySelector('#txt-dni').value;
  contrasena = document.querySelector('#txt-password').value;
  repetirContraseña = document.querySelector('#txt-repeatPassword').value

  var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  if (!nombres || !apellidos || !correo || !dni || !contrasena) {
    Toast.fire({
      icon: 'warning',
      title: 'Debe completar todos los campos'
    });

  }
  else if (contrasena != repetirContraseña) {
    Toast.fire({
      icon: 'warning',
      title: 'Las contraseñas deben coincidir'
    });
  } else {
    var usuario = {
      nombres: nombres,
      apellidos: apellidos,
      correo: correo,
      dni: dni,
      contraseña: contrasena
    }
    registro(usuario);
  }
});

function registro(user) {
  var ruta = 'https://viex-app.herokuapp.com';
  // var ruta = 'http://localhost:9090';

  var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });


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

    Toast.fire({
      icon: 'success',
      title: 'Usuario creado correctamente. Redirecionando ...'
    });

    //    $("#btn-registro").removeAttr('disabled');

    // document.location.href = "../pages/alumno/examenesPendientes.html";
  }).fail(function (jqXHR, textStatus, errorThrown) {
  
  })
}