const nodemailer = require('nodemailer');
const estadosTitulo = require('../enums').estadosTitulo

const smtpConfig = {
    host: process.env.EMAIL_PORT,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

sendEmailHelper =  async function (from, to, subject, text) {
    try{
        let transporter = nodemailer.createTransport(smtpConfig)
        let info = await transporter.sendMail({
            from: "noreply@etsit.upm.es", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        });
        return info
    
    }catch(error){
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

exports.sendEmail = async function (estadoActual, from, to){
    let send = false;
    let texto;
    let subject = "Solicitud de título. Estado actual: " 
    switch (estadoActual){
        case estadosTitulo.PEDIDO:
            send = true;
            subject += "TITULO_SOLICITADO";
            text = `Su solicitud ha cambiado de estado \n
            ===== Resumen ===== \n
            Acaba de pasar al estado TITULO_SOLICITADO.
            Su petición acaba de registrarse. En breve se le mandará la carta de pago del mismo.`
            break;
        case estadosTitulo.NOPAGADO:
            send = true;
            subject += "EXPEDICION_CARTADEPAGO";
            text = `Su solicitud ha cambiado de estado \n
            ===== Resumen ===== \n
            Acaba de pasar al estado EXPEDICION_CARTADEPAGO.
            Debe abonar la cantidad indicada en la carta de pago y traer la misma a secretaría`
            break;
        case estadosTitulo.PAGADO:
            send = true;
            subject += "ESPERA_TITULO";
            text = `Su solicitud ha cambiado de estado \n
            ===== Resumen ===== \n
            Acaba de pasar al estado ESPERA_TITULO.
            El título pedido aun no está disponible. Recuerde que tardan varios meses en estar disponibles.Puede pasar por secretaría a por el resguardo de título`
            break;
        case estadosTitulo.LLEGADO:
            send = true;
            subject += "TITULO_DIPONIBLE";
            text = `Su solicitud ha cambiado de estado \n
            ===== Resumen ===== \n
            Acaba de pasar al estado TITULO_DIPONIBLE.
            Su título ya está disponible, puede pasarse por secretaría para recogerlo. La recogida del título es de forma presencial por el interesado, acreditando identidad mediante la presentación del DNI o pasaporte en vigor o mediante poder notarial a un tercero autorizado `
            break;
        case estadosTitulo.RECOGIDO:
            send = true;
            subject += "TITULO_RECOGIDO";
            text = `Su solicitud ha cambiado de estado \n
            ===== Resumen ===== \n
            Acaba de pasar al estado TITULO_RECOGIDO. Su título ya ha sido recogido entregado `
            break;
    }
    if(send){
        try{
            let info = await sendEmailHelper(from, to, subject, text)
            return info
        }catch(error){
            //se propaga el error, se captura en el middleware
            throw error;
        }  
    }else{
        return null
    }
} 


