const mail = require('../mail');
const estadosCertificado = require('../../enums').estadosCertificado


//email que recibe el alumno
exports.sendEmailToAlumno = async function (estadoActual, from, to, planCodigo, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === estadoActual);
    let subject = `Solicitud de certificado académico. Estado actual: ${estadoActualText}`
    let text = `Su solicitud de certificado académico ha cambiado de estado. \n\n\n  ===== Resumen =====\n\nAcaba de pasar al estado ${estadoActualText}. \n\n`;
    let filesname = [];
    switch (estadoActual) {
        case estadosCertificado.PEDIDO:
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
        case estadosCertificado.PAGO_CONFIRMADO:
            send = true;
            text += `Su pago del certificado académico solicitado ha sido validado por el personal de secretaría.`
            text += ` Le será notificado cuando se encuentre disponible para su recogida.`
            break;
        case estadosCertificado.CERTIFICADO_DISPONIBLE:
            send = true;
            text += `Su certificado académico ya está disponible, puede pasarse por secretaría para recogerlo. La recogida del certificado es de forma presencial por el interesado, acreditando su identidad mediante la presentación del DNI o pasaporte en vigor o mediante poder notarial a un tercero autorizado. Conforme la legislación vigente (https://www.boe.es/buscar/doc.php?id=BOE-A-1988-17542)`
            break;
        case estadosCertificado.CERTIFICADO_RECOGIDO:
            send = true;
            text += `Su certificado ha sido recogido, si se trata de un error comuníquese con Secretaría.`
            break;
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
exports.sendEmailToPas = async function (estadoActual, from, to, planCodigo, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === estadoActual);
    let subject = `Solicitud de certificado académico. Estado actual: ${estadoActualText}. Alumno: ${session.user.cn} ${session.user.sn}`
    let text;
    let filesname = [];
    switch (estadoActual) {
        case estadosCertificado.PEDIDO:
            send = true;
            text = `Se adjunta la infromación de descuentos aplicables de ${session.user.cn} ${session.user.sn} (${session.user.irispersonaluniqueid}). La dirección de contacto del alumno es ${session.user.mail}.`
            filesname.push(`dni_alumno.pdf`);
            filesname.push(`informacion_descuentos.pdf`);
            break;
        case estadosCertificado.PAGO_REALIZADO:
            send = true;
            text = `Se adjunta la carta de pago de ${session.user.cn} ${session.user.sn} (${session.user.irispersonaluniqueid}). La dirección de contacto del alumno es ${session.user.mail}.`
            filesname.push(`carta_pago.pdf`)
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

