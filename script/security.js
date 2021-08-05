function codificarBase64(cadena){
    console.log("codificando");
    var base64 = btoa(cadena);
    return base64
};

function decodificarBase64(cadena){
    console.log("decodificando");
    return atob(cadena);
};


function cargarUsuario(){
    function preloadFunc() {
        console.log()
      if (decodificarBase64(localStorage.getItem('rol')) != 'ROLE_PROF') {
        document.location.href = "../login.html";
      }
    }
    window.onpaint = preloadFunc();
  }
  