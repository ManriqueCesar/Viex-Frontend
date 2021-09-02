let plan =null;
$(document).ready(function () {
  let idPlan = getUrlVars()["idplan"];  
  
  getPlans().then(async (plans) => {
    console.log('plans',plans);
     plan = plans.find((plan) => {
      return plan.idPlan == idPlan;
    });
    console.log('plan',plan);
    if (plan) { 
      if(idPlan == 1){ 
        await updatePlanId();
        localStorage.setItem ('suscripcion', plan.idPlan);
        localStorage.setItem ('plan', codificarBase64(JSON.stringify(plan)));
        document.location.href = "listaPago.html";
      } else {
        document.getElementById('btnProcess').innerText= `Pagar S/ ${plan.precio}.00`
      }
    } else {
      document.location.href = "listaPago.html";
    }
  }).catch((err) => console.log(err));
});

// Constants
const niubiz = {
  // merchantid: "341198210",
  // merchantid: "522591303",
  merchantid: "123456789",
  channel: "web",
  plan: JSON.parse(decodificarBase64(localStorage.getItem("plan"))),
  email: decodificarBase64(localStorage.getItem("email")) || "antonis162010@gmail.com",
  dni: decodificarBase64(localStorage.getItem("dni")) || "12345678",
  visaPurchase: null,
  ecommerce: null
};

$(".toast").toast({
  delay: 3000,
});
// API
async function updateToken() {
  return await axios({
    url: "https://viex-app.herokuapp.com/compra/numero-compra/actualizar/1",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

async function registerPay(data) {
  return await axios({
    url: "https://viex-app.herokuapp.com/pagos/registrar",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

// NIUBIZ
async function generateToken() {
  return await axios({
    url: "https://apitestenv.vnforapps.com/api.security/v1/security",
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Authorization: `Basic ${btoa(
        "integraciones.visanet@necomplus.com:d5e7nk$M"
      )}`,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

async function generateSession() {
  let token = await generateToken();
  return await axios({
    url:
      "https://apitestenv.vnforapps.com/api.ecommerce/v2/ecommerce/token/session/" +
      niubiz.merchantid,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    data: {
      amount: plan.precio,
      antifraud: {
        // clientIp: "190.236.255.83",
        merchantDefineData: {
          MDD4: niubiz.email,
          MDD21: 0,
          MDD32: niubiz.dni,
          MDD75: "Invitado",
          MDD77: 1,
        },
      },
      channel: niubiz.channel,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

async function generateTransaction(transactionToken) {
  let token = await generateToken();
  return await axios({
    url:
      "https://apitestenv.vnforapps.com/api.authorization/v3/authorization/ecommerce/" +
      niubiz.merchantid,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    data: {
      antifraud: {
        // clientIp: "190.236.255.83",
        merchantDefineData: {
          MDD4: niubiz.email,
          MDD21: 0,
          MDD32: niubiz.dni,
          MDD75: "Invitado",
          MDD77: 1,
        },
      },
      captureType: "manual",
      countable: true,
      channel: niubiz.channel,
      order: {
        amount: plan.precio,
        tokenId: transactionToken,
        purchaseNumber: niubiz.visaPurchase,
        currency: "PEN",
      },
      recurrence: null,
      sponsored: null,
    },
  })
    .then((response) => response.data)
    .catch((err) => {
      console.log(

        Math.floor(100000 + Math.random() * 900000)
    
    );
    console.log('Transaction', err)});
}

var cardNumber = null;
var cardExpiry = null;
var cardCvv = null;

// LOCAL
function closeModal(){
  document.location.href = "listaPago.html";
}

function getUrlVars() { 
  var vars = {}; 
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { 
     vars[key] = value; 
  });
  return vars; 
}

async function getPlans() {
  return await axios({
    url: "https://viex-app.herokuapp.com/plan/todos",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err));
}

async function updatePlanId() {
  return await axios({
    url: "https://viex-app.herokuapp.com/usuarios/actualizar/plan/1/usuario/"+decodificarBase64(localStorage.getItem("id")),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

async function pay() {
  $('#btnProcess').attr('disabled', true);
  let data = {
    name: document.getElementById("nombre").value,
    lastName: document.getElementById("apellido").value,
    email: document.getElementById("email").value,
    alias: "alias",
    currencyConversion: false,
    recurrence: false,
  };

  try {
    console.log(data);
    console.log([cardNumber, cardExpiry, cardCvv]);
    const response = await payform.createToken(
      [cardNumber, cardExpiry, cardCvv],
      data
    );
    console.log(response);

    // await sendPay(response.transactionToken);
    const objSave = {
      idPago: 0,
      ecommerce: niubiz.ecommerce,
      visa: niubiz.visaPurchase,
      //visa: 11131,
      montoTotal: plan.precio,
      fechaPago: moment().format("YYYY-MM-DD"),
      fechaFin: moment().add(plan.duracion, "months").format("YYYY-MM-DD"),
      idPlan: plan.idPlan,
      meses: plan.duracion,
      usuario: {
        idUsuario: Number(decodificarBase64(localStorage.getItem("id"))),
      },
    };

    await registerPay(objSave);
    localStorage.setItem ('suscripcion', plan.idPlan);
    localStorage.setItem ('plan', codificarBase64(JSON.stringify(plan)));
    document.location.href = "listaPago.html";
  } catch (error) {
  $('#btnProcess').attr('disabled', false);
    console.log("error: ", error);
    $(".toast").toast("show");
  }
}

async function sendPay(transactionToken) {
  try {
    const response = await generateTransaction(transactionToken);
  } catch (error) {
    console.log("sendPay: ", error);
  }
}

generateSession()
  .then(async (response) => {
    // document.getElementById('btnProcess').innerText= `Pagar S/ ${niubiz.plan.precio}.00`
    $("#modal-alumnos").modal("toggle");
    let newCodes = await updateToken();
    niubiz.visaPurchase = newCodes.numeroCompra.visa;
    niubiz.ecommerce = newCodes.numeroCompra.ecommerce;
    const configuration = {
      sessionkey: response.sessionKey,
      channel: niubiz.channel,
      merchantid: niubiz.merchantid,
      amount: plan.precio,
      purchasenumber: niubiz.visaPurchase,
      language: "es",
      font: "https://fonts.googleapis.com/css?family=Montserrat:400&display=swap",
    };
    let elementStyles = {
      base: {
        color: "#495057",
        margin: "0",
        // width: '100% !important',
        // fontWeight: 700,
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "12.5px",
        fontSmoothing: "antialiased",
        placeholder: {
          color: "#495057",
        },
        autofill: {
          color: "#e39f48",
        },
      },
      invalid: {
        color: "#E25950",
        "::placeholder": {
          color: "#FFCCA5",
        },
      },
    };
    payform.setConfiguration(configuration);

    cardNumber = payform.createElement(
      "card-number",
      {
        style: elementStyles,
        placeholder: "Número de Tarjeta",
      },
      "txtNumeroTarjeta"
    );

    cardNumber.then((element) => {
      //   element.on("bin", function (data) {
      //     console.log("BIN: ", data);
      //   });
      element.on("change", (data) => {
        // console.log('CHANGE: ', data);
        document.getElementById("msjNroTarjeta").style.display = "none";
        if (data.length != 0) {
          data.forEach((d) => {
            if (d["code"] == "invalid_number") {
              document.getElementById("msjNroTarjeta").style.display = "block";
              document.getElementById("msjNroTarjeta").innerText = d["message"];
            }
          });
        }
      });
    });

    cardExpiry = payform.createElement(
      "card-expiry",
      {
        style: elementStyles,
        placeholder: "MM/AA",
      },
      "txtFechaVencimiento"
    );

    cardExpiry.then((element) =>
      element.on("change", function (data) {
        // console.log('CHANGE F.V: ', data);
        document.getElementById("msjFechaVencimiento").style.display = "none";

        if (data.length != 0) {
          data.forEach((d) => {
            if (d["code"] == "invalid_expiry") {
              document.getElementById("msjFechaVencimiento").style.display =
                "block";
              document.getElementById("msjFechaVencimiento").innerText =
                d["message"];
            }
          });
        }
      })
    );

    cardCvv = payform.createElement(
      "card-cvc",
      {
        style: elementStyles,
        placeholder: "CVV",
      },
      "txtCvv"
    );

    cardCvv.then((element) =>
      element.on("change", function (data) {
        // console.log('CHANGE CVV2: ', data);
        document.getElementById("msjCvv").style.display = "none";

        if (data.length != 0) {
          data.forEach((d) => {
            if (d["code"] == "invalid_cvc") {
              document.getElementById("msjCvv").style.display = "block";
              document.getElementById("msjCvv").innerText = d["message"];
            }
          });
        }
      })
    );
  })
  .catch((err) => console.log(err));
