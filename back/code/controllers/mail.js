const nodemailer = require('nodemailer');
const estadosTitulo = require('../enums').estadosTitulo

const smtpConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger:false,
    debug: false
};

sendEmailHelper = async function (from, to, subject, text, filename, contentBuffer) {
    try {
        let config = {
            from: process.env.EMAIL_SENDER,
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        }
        //solo cuando hay algo para enviar se envia
        if (contentBuffer && filename) {
            config.attachments = [{
                filename: filename,
                content: contentBuffer
            }]
        }

        let transporter = nodemailer.createTransport(smtpConfig)
        let info = await transporter.sendMail(config);
        return info

    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

//email que recibe el alumno
exports.sendEmail = async function (estadoActual, from, to, planCodigo, textoAdicional, contentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosTitulo).find(k => estadosTitulo[k] === estadoActual);
    let subject = `Solicitud de título ${planCodigo}. Estado actual: ${estadoActualText}`
    let text = `Su solicitud de título ${planCodigo} ha cambiado de estado. \n\n\n  ===== Resumen =====\n\nAcaba de pasar al estado ${estadoActualText}. \n\n`;
    let filename;
    switch (estadoActual) {
        case estadosTitulo.PEDIDO:
            send = true;
            text += `Su petición acaba de registrarse. En breve se le mandará la información de pago del mismo.`
            break;
        case estadosTitulo.ESPERA_PAGO:
            send = true;
            text += `Debe abonar el pago del título. Puede encontrar la información en el gestor de recibos de la politécnica virtual. Una vez haya realizado el pago debe confirmarlo en la aplicación de gestión de títulos.`
            break;
        case estadosTitulo.PAGO_REALIZADO:
            send = true;
            text += `Su pago está siendo comprobado por el personal de secretaría, pronto se le informará de los siguientes pasos.`
            break;
        case estadosTitulo.PAGO_CONFIRMADO:
            send = true;
            text += `Su pago ha sido validado. Pronto recibirá un correo con el resguardo del título.`
            break;
        case estadosTitulo.ESPERA_TITULO:
            send = true;
            text += `Se adjunta un resguardo del título solicitado. Hasta que no llegue el título sirve como documento oficial de que usted ha completado los estudios del título ${planCodigo}. Se le avisará cuando su título esté disponible para recoger, recuerde que puede tardar hasta un año en llegar.`
            filename = `resguardo_titulo.pdf`
            break;
        case estadosTitulo.TITULO_DISPONIBLE:
            send = true;
            text += `Su título ya está disponible, puede pasarse por secretaría para recogerlo. La recogida del título es de forma presencial por el interesado, acreditando su identidad mediante la presentación del DNI o pasaporte en vigor mediante poder notarial a un tercero autorizado.`
            break;
        case estadosTitulo.TITULO_RECOGIDO:
            send = true;
            text += `Su título ha sido recogido, si se trata de un error comuníquese con Secretaría.`
            break;
        case estadosTitulo.PETICION_CANCELADA:
            send = true;
            text += `Su petición de título ha sido cancelada por el siguiente motivo.\n${textoAdicional} `
            break;
    }
    if (send) {
        try {
            let info = await sendEmailHelper(from, to, subject, text, filename, contentBuffer)
            return info
        } catch (error) {
            //se propaga el error, se captura en el middleware
            throw error;
        }
    } else {
        return null
    }
}

//email que manda el alumno cuando tiene que enviar alguna cosa
exports.sendEmailAlumno = async function (estadoActual, from, to, planCodigo, textoAdicional, contentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosTitulo).find(k => estadosTitulo[k] === estadoActual);
    let subject;
    let text;
    let filename;
    switch (estadoActual) {
        case estadosTitulo.PEDIDO:
            send = true;
            subject = `Información descuentos de ${session.user.cn} ${session.user.sn}`
            text = `Se adjunta la infromación de descuentos aplicables de ${session.user.cn} ${session.user.sn} (${session.user.irispersonaluniqueid}). La dirección de contacto del alumno es ${session.user.mail}`
            filename = `informacion_descuentos.pdf`
            break;
        case estadosTitulo.PAGO_REALIZADO:
            send = true;
            subject = `Carta de pago de ${session.user.cn} ${session.user.sn}`
            text = `Se adjunta la carta de pago de ${session.user.cn} ${session.user.sn} (${session.user.irispersonaluniqueid}). La dirección de contacto del alumno es ${session.user.mail}`
            filename = `carta_pago.pdf`
            break;
    }
    if (send) {
        try {
            let info = await sendEmailHelper(from, to, subject, text, filename, contentBuffer)
            return info
        } catch (error) {
            //se propaga el error, se captura en el middleware
            throw error;
        }
    } else {
        return null
    }
}


