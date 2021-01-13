const mail = require('../mail');
const estadosCertificado = require('../../enums').estadosCertificado
const formaPago = require('../../enums').formaPago;

//email que recibe el alumno
exports.sendEmailToAlumno = async function (estadoActual, from, to, planCodigo, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === estadoActual);
    let subject = `Solicitud de certificado académico. Estado actual: ${estadoActualText}`
    let text = `Su solicitud de certificado académico ha cambiado de estado. \n\n\n  ===== Resumen =====\n\nAcaba de pasar al estado ${estadoActualText}. \n\n`;
    let filesname = [];
    switch (estadoActual) {
        case estadosCertificado.SOLICITUD_ENVIADA:
            send = true;
            text += `Su petición acaba de registrarse. En breve se le mandará la información de pago del mismo.`
            break;
        case estadosCertificado.ESPERA_PAGO:
            send = true;
            text += `Debe abonar el pago del certificado académico. Puede encontrar la información en el gestor de recibos de la politécnica virtual: Desde Politécnica Virtual > Mis datos > 04. Precios públicos > Gestión de recibos > Acceder > Automatrícula > Introducir cuenta UPM > Entrar en gestión de recibos (Pinchar sobre la opción deseada, pago de recibos de matrícula u otros pagos). Para poder realizar el pago online, no pinchar en número de referencia, ir directamente a formas de pago, clicar directamente en el símbolo $, pinchar en pago con tarjeta on-line. Si se abre por referencia, ya no se puede pagar por tarjeta on-line y se tendría que pagar por banco (recibo bancario).`
            break;
        case estadosCertificado.PAGO_REALIZADO:
            send = true;
            text += `Su pago está siendo comprobado por el personal de secretaría, pronto se le informará de los siguientes pasos.`
            break;
        case estadosCertificado.PAGO_VALORADO:
            send = true;
            text += `Ya se ha valorado si su certificado requiere pago o no. Consulta la decisión en la aplicación.`
            break;
        case estadosCertificado.PAGO_CONFIRMADO:
            send = true;
            text += `Su pago del certificado académico solicitado ha sido validado por el personal de secretaría.`
            text += `Se le enviará cuando esté disponible.`
            break;
        case estadosCertificado.CERTIFICADO_ENVIADO:
            send = true;
            text += `Se le adjunta su certificado académico. Si hay algun error, comuníquese con Secretaría.`
            filesname.push(`certificado_academico.pdf`);
            break
        case estadosCertificado.PETICION_CANCELADA:
            send = true;
            text += `Su petición de certificado académico ha sido cancelada por el siguiente motivo.\n${textoAdicional} `
            break;
    }
    if (send) {
        try {
            let info = await mail.sendEmailHelper(from, to, subject, text, filesname, filesContentBuffer)
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
exports.sendEmailToPas = async function (estadoActual, from, to, planCodigo, textoAdicional, filesContentBuffer, session, formaPagoAlumno) {
    let send = false;
    let estadoActualText = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === estadoActual);
    let subject = `Solicitud de certificado académico. Estado actual: ${estadoActualText}. Alumno: ${session.user.givenname} ${session.user.sn}`
    let text;
    let filesname = [];
    switch (estadoActual) {
        case estadosCertificado.SOLICITUD_ENVIADA:
            send = true;
            text = `Se adjunta la información de descuentos aplicables de ${session.user.givenname} ${session.user.sn}. La dirección de contacto del alumno es ${session.user.mailPrincipal}.`
            filesname.push(`dni_alumno.pdf`);
            filesname.push(`informacion_descuentos.pdf`);
            break;
        case estadosCertificado.PAGO_REALIZADO:
            send = true;
            if(formaPagoAlumno == formaPago.ONLINE){
                text = `El alummno ${session.user.givenname} ${session.user.sn} ha pagado vía online a través de politécnica virtual. La dirección de contacto del alumno es ${session.user.mailPrincipal}.`
            } else{
            text = `Se adjunta la carta de pago de ${session.user.givenname} ${session.user.sn}. La dirección de contacto del alumno es ${session.user.mailPrincipal}.`
            filesname.push(`carta_pago.pdf`)
            }
            break;
    }
    if (send) {
        try {
            let info = await mail.sendEmailHelper(from, to, subject, text, filesname, filesContentBuffer)
            return info
        } catch (error) {
            //se propaga el error, se captura en el middleware
            throw error;
        }
    } else {
        return null
    }
}

