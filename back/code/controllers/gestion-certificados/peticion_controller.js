var inspect = require('util').inspect;
var Busboy = require('busboy');

const axios = require('axios');

let models = require('../../models');
let Sequelize = require('sequelize');
let Op = Sequelize.Op
let mail = require('./mail');
let planController = require('../plan_controller');

const estadosCertificado = require('../../enums').estadosCertificado;
const base64 = require('../../lib/base64');
const dni = require('../../lib/dni');


//devuelve todas las peticiones de un alumno
const getAllPeticionAlumno = async function (eduPersonUniqueId) {
    try {
        let peticiones = await models.Peticion_Certificado.findAll({
            where: {
                eduPersonUniqueId : eduPersonUniqueId
            }
        });
        return peticiones || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}


//devuelve todas las peticiones de un alumno
const getPeticionAlumno = async function (eduPersonUniqueId) {
    try {
        let peticion = await models.Peticion_Certificado.findOne({
            where: {
                eduPersonUniqueId: eduPersonUniqueId,
            }
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

const updatePeticionAlumno = async function (eduPersonUniqueId, paramsToUpdate) {
    try {
        let peticion = await models.Peticion_Certificado.update(paramsToUpdate, {
            where: {
                eduPersonUniqueId: eduPersonUniqueId,
            },
            returning: true,
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const createPeticionAlumno = async function (eduPersonUniqueId, mail, nombre, apellido, planCodigo, descuento) {
    try {
        let peticion = await models.Peticion_Certificado.create({
            eduPersonUniqueId: eduPersonUniqueId,
            email: mail,
            nombre: nombre,
            apellido: apellido,
            planCodigo: planCodigo,
            estadoPeticion: estadosCertificado.PEDIDO,
            descuento: descuento,
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
        let peticiones = await models.Peticion_Certificado.findAll();
        return peticiones || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}


//devuelve toda la info del alumno que se acaba de conectar
exports.getInfoAlumno = async function (req, res, next) {
    try {
        let peticiones = await getAllPeticionAlumno(req.session.user.eduPersonUniqueId)
        let certificadosAlumno;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            certificadosAlumno = [{ "idPerson": "12345678A" }, { "idPerson": "12345678B" }, { "idPerson": "12345678C" },  { "idPerson": "12345678D" },  { "idPerson": "12345678E" }]
        } else {
            let firstCall = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?dni=" + req.session.user.eduPersonUniqueId);
            let secondCall = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?token=" + base64.Base64EncodeUrl(firstCall.data.token))
            certificadosAlumno = secondCall.data
            if (!Array.isArray(certificadosAlumno) && typeof req.session.user.eduPersonUniqueId === 'string' ) {
                let firstCall2 = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?dni=" + dni.sanetizeDni(req.session.user.eduPersonUniqueId));
                let secondCall2 = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?token=" + base64.Base64EncodeUrl(firstCall2.data.token))
                certificadosAlumno = secondCall2.data
            }
        }
        if (!Array.isArray(certificadosAlumno)){
            certificadosAlumno = [];
            console.log(req.session.user.eduPersonUniqueId)
        } 
        
        //merge certificados pedidos y los que puede repetir
        certificadosAlumno.forEach(person => { return !peticiones.find(id => id.eduPersonUniqueId === person.idPerson) ? peticiones.push({ eduPersonUniqueId: person.idPerson, estadoPeticion: estadosCertificado.NOPEDIDO }) : null })
        res.json(peticiones)
    } catch (error) {
        console.log(error)
        res.json({ error: error.message });
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
    req.filesBuffer = [];
    error = false;
    var busboy = new Busboy({
        headers: req.headers,
        limits: {
            files: 2, //limite 2 files
            fileSize: 1024 * 1000 //limite 1MB
        }
    });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        //se mete en un buffer para pasarlo al correo
        let chunks = []
        if (mimetype !== 'application/pdf') {
            file.resume()
            error = "Sólo se adminten ficheros formato pdf.";
        } else {
            file.on('data', function (data) {
                chunks.push(data);
            });
            file.on('end', function () {
                //comprueba si supero el tamaño el archivo
                if (file.truncated) {
                    error = "Como máximo archivos de 1MB.";
                } else {
                    req.filesBuffer.push(Buffer.concat(chunks));
                    //console.log(req.filesBuffer)
                    //si no se mandó fichero no entra aqui
                }
            });
        }

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
        if (!req.body.peticion.eduPersonUniqueId) req.body.peticion.eduPersonUniqueId = null;
        let peticion = await getPeticionAlumno(req.body.peticion.eduPersonUniqueId, req.body.peticion.planCodigo)
        if (!peticion) peticion = { estadoPeticion: estadosCertificado.NO_PEDIDO }
        let paramsToUpdate = {};
        let estadoNuevo;
        let textoAdicional;
        if (req.body.cancel) {
            estadoNuevo = estadosCertificado.PETICION_CANCELADA;
            paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel
            textoAdicional = req.body.paramsToUpdate.textCancel
            paramsToUpdate.formaPago = null;
            paramsToUpdate.descuento = null;
            paramsToUpdate.receptor = null;
            paramsToUpdate.localizacionFisica = null;
        } else {
            if (peticion.estadoPeticion !== estadosCertificado[req.body.peticion.estadoPeticionTexto]) throw "Intenta cambiar un estado que no puede";
            switch (peticion.estadoPeticion) {
                case estadosCertificado.NO_PEDIDO:
                case estadosCertificado.PETICION_CANCELADA:
                    estadoNuevo = estadosCertificado.PEDIDO;
                    paramsToUpdate.descuento = req.body.paramsToUpdate.descuento
                    paramsToUpdate.textCancel = null;
                    break;
                case estadosCertificado.PEDIDO:
                    estadoNuevo = estadosCertificado.ESPERA_PAGO;
                    break;
                case estadosCertificado.ESPERA_PAGO:
                    estadoNuevo = estadosCertificado.PAGO_REALIZADO;
                    paramsToUpdate.formaPago = req.body.paramsToUpdate.formaPago
                    break;
                case estadosCertificado.PAGO_REALIZADO:
                    estadoNuevo = estadosCertificado.PAGO_CONFIRMADO;
                    break;
                case estadosCertificado.PAGO_CONFIRMADO:
                    estadoNuevo = estadosCertificado.CERTIFICADO_DISPONIBLE;
                    break;
                case estadosCertificado.CERTIFICADO_DISPONIBLE:
                    estadoNuevo = estadosCertificado.CERTIFICADO_RECOGIDO;
                    paramsToUpdate.receptor = req.body.paramsToUpdate.receptor;
                    paramsToUpdate.localizacionFisica = req.body.paramsToUpdate.localizacionFisica;
                    break;
            }
        }
        paramsToUpdate.estadoPeticion = estadoNuevo;
        let toAlumno = peticion.email || req.session.user.mail; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = req.session.user.mail; //siempre se le manda el email al que hace la prueba
            toPAS = req.session.user.mail;
        }
        let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.planCodigo, textoAdicional, req.filesBuffer, req.session)
        //solo se envia cuando el alumno tiene algo que enviar
        if (req.filesBuffer) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.planCodigo, textoAdicional, req.filesBuffer, req.session)
        }
        let respuesta;
        if (estadoNuevo === estadosCertificado.PEDIDO && peticion.estadoPeticion !== estadosCertificado.PETICION_CANCELADA) {
            respuesta = await createPeticionAlumno(req.session.user.eduPersonUniqueId, req.session.user.mail, req.session.user.cn, req.session.user.sn, req.body.peticion.planCodigo, req.body.paramsToUpdate.descuento)
        } else {
            respuesta = await updatePeticionAlumno(req.body.peticion.eduPersonUniqueId, req.body.peticion.planCodigo, paramsToUpdate)
        }
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}





