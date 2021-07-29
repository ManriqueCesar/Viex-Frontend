  function registro(user) {
   // var ruta = 'https://viex-app.herokuapp.com';
    var ruta = 'http://localhost:9090';
    request = {};
    request.email = user.correo;
    request.password = user.contraseña;
    request.nombres = user.nombres;
    request.apellidos = user.apellidos;

    $.ajax({
      url: ruta + '/usuarios/registro',
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
      $("#btn-ingresar").removeAttr('disabled');
  
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

  $('#btn-ingresar').click(function () {
    $("#btn-ingresar").attr('disabled', 'disabled');
      if( document.querySelector('#txt-password').value != document.querySelector('#txt-repeatPassword').value){
        Toast.fire({
            icon: 'warning',
            title: 'Las contraseñas deben coincidir'
          })
      } else {

        var usuario = {
            nombres:    document.querySelector('#txt-email').value,
            apellidos:  document.querySelector('#txt-password').value,
            correo:     document.querySelector('#txt-nombres').value,
            contraseña: document.querySelector('#txt-apellidos').value
        }

        registro(usuario);
      }
 
  });
  