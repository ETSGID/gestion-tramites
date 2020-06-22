let models = require('../../models');
let mail = require('./mail');
const estadosEvaluacionCurricular = require('../../enums').estadosEvaluacionCurricular;
var Busboy = require('busboy');
const axios = require('axios');
const base64 = require('../../lib/base64');
const dni = require('../../lib/dni');
var inspect = require('util').inspect;
var queriesController = require('./queries_controller');

//devuelve todas las peticiones de un alumno
const getAllPeticionAlumno = async function (irispersonaluniqueid) { // en realiudad solo una peticion por alumno posible
    try {
        let peticiones = await models.Peticion.findAll({
            where: {
                irispersonaluniqueid: irispersonaluniqueid
            }
        });
        return peticiones || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}


//devuelve todas las peticiones de un alumno
const getPeticionAlumno = async function (irispersonaluniqueid,asignaturaCodigo) { //plan, asignatura, o nada??
    try {
        let peticion = await models.Peticion.findOne({
            where: {
                irispersonaluniqueid: irispersonaluniqueid,
                asignaturaCodigo: asignaturaCodigo
            }
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

const updatePeticionAlumno = async function (irispersonaluniqueid, asignaturaCodigo, paramsToUpdate) {
    try {
        let peticion = await models.Peticion.update(paramsToUpdate, {
            where: {
                irispersonaluniqueid: irispersonaluniqueid,
                asignaturaCodigo: asignaturaCodigo
            },
            returning: true,
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const createPeticionAlumno = async function (irispersonaluniqueid, mail, nombre, apellido, planCodigo, asignaturaNombre, asignaturaCodigo, tipo) {
    try {
        let peticion = await models.Peticion.create({
            irispersonaluniqueid: irispersonaluniqueid,
            email: mail,
            nombre: nombre,
            apellido: apellido,
            planCodigo: planCodigo,
            estadoPeticion: estadosEvaluacionCurricular.SOLICITUD_PENDIENTE,
            asignaturaNombre:asignaturaNombre,
            asignaturaCodigo:asignaturaCodigo,
            tipo: tipo,
            fecha: new Date()
        })
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}


//devuelve toda las peticiones de todos los alumnos
const getAllPeticionPas = async function () {
    try {
        let peticiones = await models.Peticion.findAll();
        return peticiones || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

exports.getInfoAllAlumno = async function (req, res, next) {
    try {
        respuesta = await getAllPeticionAlumno(req.session.user.irispersonaluniqueid)
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

//devuelve todas peticiones de los alumnos
exports.getInfoAllPas = async function (req, res, next) {
    try {
        respuesta = await getAllPeticionPas()
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
//gestiona los parametros que llegan del multipart-form data
exports.configureMultiPartFormData = async function (req, res, next) {
    error = false;
    var busboy = new Busboy({
        headers: req.headers,
    });
    //recibe aqui los parametros en en multi-part form data por eso se parsean a body
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        req.body = JSON.parse(val);
    });
    busboy.on('finish', function () {
        if (error) {
            res.status(500).json({ error: error });
        }
        else {
            next()
        }
    });
    req.pipe(busboy);
}

//update or create estado peticion
exports.updateOrCreatePeticion = async function (req, res, next) {
    try {
        console.log("body: ",req.body);
        let peticion = {};
        // si peticion vacia, es que se tiene que crear
        if(Object.keys(req.body.peticion).length === 0){ 
            console.log("Nueva peticion");
            var id = (req.body.paramsToUpdate.contadorPeticiones>0 ? req.body.paramsToUpdate.contadorPeticiones-1 : null);
            peticion.estadoPeticion = estadosEvaluacionCurricular.NO_PEDIDO,
            req.body.peticion = {
                idTabla: id,
                estadoPeticionTexto: "NO_PEDIDO"
             }
        } else { // modifica una peticion ya creada, cambio de estado
        if (!req.body.peticion.irispersonaluniqueid) req.body.peticion.irispersonaluniqueid = null;
        peticion = await getPeticionAlumno(req.body.peticion.irispersonaluniqueid, req.body.peticion.asignaturaCodigo)
        }
        let paramsToUpdate = {};
        let estadoNuevo;
        let textoAdicional;
        // si cancelado
        if (req.body.cancel) {
            estadoNuevo = estadosEvaluacionCurricular.PETICION_CANCELADA;
            paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel
            textoAdicional = req.body.paramsToUpdate.textCancel
            paramsToUpdate.asignaturaNombre = null;
            paramsToUpdate.asignaturaCodigo = null;
        } else {// si crear o actualizar peticion
            console.log("db peticion:",peticion);
            console.log("body peticion:",req.body.peticion);
            if (peticion.estadoPeticion !== estadosEvaluacionCurricular[req.body.peticion.estadoPeticionTexto]) throw "Intenta cambiar un estado que no puede";
            switch (peticion.estadoPeticion) {
                case estadosEvaluacionCurricular.NO_PEDIDO:
                case estadosEvaluacionCurricular.SOLICITUD_CANCELADA:
                    console.log("entra");
                    estadoNuevo = estadosEvaluacionCurricular.SOLICITUD_PENDIENTE;
                    paramsToUpdate.textCancel = null;
                    break;
                case estadosEvaluacionCurricular.SOLICITUD_PENDIENTE:
                    // if aprobada
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_PENDIENTE;
                    // if denegada
                    estadoNuevo = estadosEvaluacionCurricular.SOLICITUD_CANCELADA;
                    break;
                case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                    //if denegada
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_DENEGADA;
                    //if aproabda
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_APROBADA;
                    break;
            }
        }
        paramsToUpdate.estadoPeticion = estadoNuevo;
        /*
        let toAlumno = peticion.email || req.session.user.mail; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = req.session.user.mail; //siempre se le manda el email al que hace la prueba
            toPAS = req.session.user.mail;
        }
        let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.asignaturaNombre, textoAdicional, req.filesBuffer, req.session)
        solo se envia cuando el alumno tiene algo que enviar
        if (req.filesBuffer) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.asignaturaNombre, textoAdicional, req.filesBuffer, req.session)
        }
        */
        let respuesta;
        if (estadoNuevo === estadosEvaluacionCurricular.SOLICITUD_PENDIENTE && peticion.estadoPeticion !== estadosEvaluacionCurricular.PETICION_CANCELADA) {
            let asignaturaNombre = await queriesController.getNombreAsignatura(req.body.paramsToUpdate.asignaturaCodigo);
            respuesta = await createPeticionAlumno(req.session.user.irispersonaluniqueid, req.session.user.mail, req.session.user.cn, req.session.user.sn, req.body.paramsToUpdate.planCodigo, asignaturaNombre, req.body.paramsToUpdate.asignaturaCodigo, req.body.paramsToUpdate.tipo )//VER QUE MAS AÑADIR
        } else {
            respuesta = await updatePeticionAlumno(req.body.peticion.irispersonaluniqueid, req.body.peticion.asignaturaCodigo, paramsToUpdate)
        }
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
