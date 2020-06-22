const mail = require('../mail');
const estadosEvaluacionCurricular = require('../../enums').estadosEvaluacionCurricular


//email que recibe el alumno
exports.sendEmailToAlumno = async function (estadoActual, from, to, asignaturaNombre, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === estadoActual);
    let subject = `Solicitud de evaluación curricular. Estado actual: ${estadoActualText}`
    let text = `Su solicitud de evaluación curricular de la asignatura ${asignaturaNombre} ha cambiado de estado. \n\n\n  ===== Resumen =====\n\nAcaba de pasar al estado ${estadoActualText}. \n\n`;
    let filesname = [];
    switch (estadoActual) {
        case estadosEvaluacionCurricular.SOLICITUD_PENDIENTE:
            send = true;
            text += `Se ha enviado su solicitud de evaluación curricular. El personal procederá a comprobar si usted cumple los requisitos para solicitar dicha evaluación. Puede consultar el estado de su solicitud en la sección de consulta.`
            break;
        case estadosEvaluacionCurricular.SOLICITUD_DENEGADA:
            send = true;
            text += `Su solicitud de evaluación curricular ha sido rechazada debido a que usted no cumple con los requisitos especificados en la normativa. Consulte los motivos en “consulta de estado de solicitud”. Si usted considera que ha habido algún error mande un CAU. `
            break;
        case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
            send = true;
            text += `Se ha aprobado su solicitud de evaluación curricular. El personal procederá a analizar su caso. Puede consultar el estado de su solicitud en la sección de consulta.`
            break;
        case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
            send = true;
            text += `Se ha denegado su solicitud de evaluación curricular debido a los siguientes motivos:\n${textoAdicional}`
            break;
        case estadosEvaluacionCurricular.EVALUACION_APROBADA:
            send = true;
            text += `Se ha aprobado su solicitud de evaluación curricular. En el portal de consulta de estado tiene acceso al documento generado de su evaluación curricular.`
            filesname.push(`resguardo.pdf`);
            break;
        case estadosEvaluacionCurricular.SOLICITUD_CANCELADA:
            send = true;
            text += `Su petición de evaluación curricular ha sido cancelada por el siguiente motivo.\n${textoAdicional} `
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
exports.sendEmailToPas = async function (estadoActual, from, to, asignaturaNombre, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === estadoActual);
    let subject = `Solicitud de certificado académico. Estado actual: ${estadoActualText}. Alumno: ${session.user.cn} ${session.user.sn}`
    let text;
    let filesname = [];
    switch (estadoActual) {
        case estadosEvaluacionCurricular.SOLICITUD_PENDIENTE:
            send = true;
            text = `El alumno ha solicitado la evaluación curricular de la asignatura ${asignaturaNombre}. Debe comprobar que cumple los requisitos y aceptar, o denegar en caso contrario, dicha solicitud para pasar al siguiente estado.`
            break;
        //pongo algun otro estado para avisar de que falta evaluacion aun???
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

