const mail = require('../mail');
const estadosTitulo = require('../../enums').estadosTitulo


//email que recibe el alumno
exports.sendEmailToAlumno = async function (estadoActual, from, to, planCodigo, planNombre, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosTitulo).find(k => estadosTitulo[k] === estadoActual);
    let subject = `Solicitud de título ${planCodigo}. Estado actual: ${estadoActualText}`
    let text = `Su solicitud de título del plan ${planNombre} (${planCodigo}) ha cambiado de estado. \n\n\n  ===== Resumen =====\n\nAcaba de pasar al estado ${estadoActualText}. \n\n`;
    let filesname = [];
    switch (estadoActual) {
        case estadosTitulo.PEDIDO:
            send = true;
            text += `Su petición acaba de registrarse. En breve se le mandará la información de pago del mismo.`
            break;
        case estadosTitulo.ESPERA_PAGO:
            send = true;
            text += `Debe abonar el pago del título. Puede encontrar la información en el gestor de recibos de la politécnica virtual: Desde Politécnica Virtual > Mis datos > 04. Precios públicos > Gestión de recibos > Acceder > Automatrícula > Introducir cuenta UPM > Entrar en gestión de recibos (Pinchar sobre la opción deseada, pago de recibos de matrícula u otros pagos). Para poder realizar el pago online, no pinchar en número de referencia, ir directamente a formas de pago, clicar directamente en el símbolo $, pinchar en pago con tarjeta on-line. Si se abre por referencia, ya no se puede pagar por tarjeta on-line y se tendría que pagar por banco (recibo bancario).`
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
            if (!textoAdicional){
                text += `Se adjunta un resguardo del título solicitado. Hasta que no llegue el título sirve como documento oficial de que usted ha completado los estudios del título ${planNombre} (${planCodigo}).  `
            }
            text+= `Se le avisará cuando su título esté disponible para recoger, recuerde que puede tardar hasta un año en llegar. \n${textoAdicional || ""}`

            filesname.push(`resguardo_titulo.pdf`);
            break;
        case estadosTitulo.TITULO_DISPONIBLE:
            send = true;
            text += `Su título ya está disponible, puede pasarse por secretaría para recogerlo. La recogida del título es de forma presencial por el interesado, acreditando su identidad mediante la presentación del DNI o pasaporte en vigor o mediante poder notarial a un tercero autorizado. Conforme la legislación vigente (https://www.boe.es/buscar/doc.php?id=BOE-A-1988-17542). \n ${textoAdicional || ""}`
            break;
        case estadosTitulo.TITULO_RECOGIDO:
            send = true;
            if(!textoAdicional){
                text += `Su título ha sido recogido, si se trata de un error comuníquese con Secretaría.`
            }else{
                text += `${textoAdicional}`
            }
            break;
        case estadosTitulo.PETICION_CANCELADA:
            send = true;
            text += `Su petición de título ha sido cancelada por el siguiente motivo.\n${textoAdicional} `
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
exports.sendEmailToPas = async function (estadoActual, from, to, planCodigo, planNombre, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosTitulo).find(k => estadosTitulo[k] === estadoActual);
    let subject = `Solicitud de título ${planCodigo}. Estado actual: ${estadoActualText}. Alumno: ${session.user.cn} ${session.user.sn}`
    let text;
    let filesname = [];
    switch (estadoActual) {
        case estadosTitulo.PEDIDO:
            send = true;
            text = `Se adjunta el dni y la infromación de descuentos aplicables (en el caso de que haya alguno) de ${session.user.cn} ${session.user.sn} (${session.user.irispersonaluniqueid}). La dirección de contacto del alumno es ${session.user.mail}.`
            filesname.push(`dni_alumno.pdf`);
            filesname.push(`informacion_descuentos.pdf`);
            break;
        case estadosTitulo.PAGO_REALIZADO:
            send = true;
            text = `El alumno ${session.user.cn} ${session.user.sn} (${session.user.irispersonaluniqueid}) informa de que ha realizado el pago del título. Se adjunta la carta de pago en caso de que no se haya pagado online. La dirección de contacto del alumno es ${session.user.mail}.`
            filesname.push(`carta_pago.pdf`)
            break;
        default:
            send = false;
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

