const mail = require('../mail');
const estadosEvaluacionCurricular = require('../../enums').estadosEvaluacionCurricular;


//email que recibe el alumno
exports.sendEmailToAlumno = async function (estadoActual, from, to, asignaturaNombre, textoAdicional, filesContentBuffer, session) {
    let send = false;
    let estadoActualText = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === estadoActual);
    let subject = `Solicitud de evaluación curricular. Estado actual: ${estadoActualText}`
    let text = `Su solicitud de evaluación curricular de la asignatura ${asignaturaNombre} ha cambiado de estado. \n\n\n  ===== Resumen =====\n\nAcaba de pasar al estado ${estadoActualText}. \n\n`;
    let filesname = [];
    switch (estadoActual) {
        case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
            send = true;
            text += `Se ha enviado su solicitud de evaluación curricular. El personal procederá a comprobar si usted cumple los requisitos para solicitar dicha evaluación. Puede consultar el estado de su solicitud en la aplicación.`
            break;
        case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
            send = true;
            text += `Usted cumple los requisitos. El tribunal correspondiente procederá a analizar su caso. Puede consultar el estado de su solicitud en la aplicación.`
            break;
        case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
            send = true;
            text += `El tribunal ha concluido que se ha DENEGADO su solicitud de evaluación curricular, con los siguientes datos:\n\n`+ textoAdicional +' \n\nSi usted considera que ha habido un error, utilice el servicio de CAU de secretaría en el siguiente enlace: https://appsrv.etsit.upm.es/cau/secretaria/';
            break;
        case estadosEvaluacionCurricular.EVALUACION_APROBADA:
            send = true;
            text += `El tribunal ha concluido que se ha APROBADO su solicitud de evaluación curricular, con los siguientes datos:\n\n`+ textoAdicional+'\n\nSi usted considera que ha habido un error, utilice el servicio de CAU de secretaría en el siguiente enlace: https://appsrv.etsit.upm.es/cau/secretaria/ \n\nEn un plazo aproximado de 5 días hábiles, se actualizará la nota en Politécnica Virtual. Se le notificará este cambio de estado por email.';
            break;
        case estadosEvaluacionCurricular.NOTA_INTRODUCIDA:
            send = true;
            text += 'Usted ya puede consultar su nota actualizada en Politécnica Virtual: https://www.upm.es/politecnica_virtual/';
            break;
        case estadosEvaluacionCurricular.NO_CUMPLE_REQUISITOS:
            send = true;
            text += `Su solicitud de evaluación curricular ha sido cancelada por el siguiente motivo:\n\n`+ textoAdicional;
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
    let subject = `Solicitud de evaluación curricular. Estado actual: ${estadoActualText}. Alumno: ${session.user.cn}`
    let text;
    let filesname = [];
    switch (estadoActual) {
        case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
            send = true;
            text = `El alumno ${session.user.cn} ha solicitado la evaluación curricular de la asignatura ${asignaturaNombre}. Debe comprobar que cumple los requisitos y aceptar o denegar dicha solicitud para pasar al siguiente estado.`
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

