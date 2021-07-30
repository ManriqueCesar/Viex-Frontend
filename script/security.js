function codificarBase64(cadena){
    console.log("codificando");
    var base64 = btoa(cadena);
    return base64
};

function decodificarBase64(cadena){
    console.log("decodificando");
    var decrypt = btoa(cadena);
    return atob(decrypt);
};

