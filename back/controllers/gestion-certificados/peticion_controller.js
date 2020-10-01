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
const getAllPeticionAlumno = async function (edupersonuniqueid) {
    try {
        let peticiones = await models.PeticionCertificado.findAll({
            where: {
                edupersonuniqueid: edupersonuniqueid
            }
        });
        return peticiones || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}


//devuelve todas las peticiones de un alumno
const getPeticionAlumno = async function (edupersonuniqueid,planCodigo,tipoCertificado) {
    try {
        let peticion = await models.PeticionCertificado.findOne({
            where: {
                edupersonuniqueid: edupersonuniqueid,
                planCodigo: planCodigo,
                tipoCertificado: tipoCertificado
            }
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

const updatePeticionAlumno = async function (edupersonuniqueid,planCodigo,tipoCertificado, paramsToUpdate) {
    try {
        let peticion = await models.PeticionCertificado.update(paramsToUpdate, {
            where: {
                edupersonuniqueid: edupersonuniqueid,
                planCodigo: planCodigo,
                tipoCertificado: tipoCertificado
            },
            returning: true,
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const createPeticionAlumno = async function (edupersonuniqueid, mail, nombre, apellido, planCodigo, descuento, tipoCertificado) {
    try {
        let respuesta = {};
        let peticion = await models.PeticionCertificado.findOne({
            where: {
                edupersonuniqueid: edupersonuniqueid,
                planCodigo: planCodigo,
                tipoCertificado: tipoCertificado
            }
        });
        if (!peticion){
            respuesta = await models.PeticionCertificado.create({
                edupersonuniqueid: edupersonuniqueid,
                email: mail,
                nombre: nombre,
                apellido: apellido,
                planCodigo: planCodigo,
                estadoPeticion: estadosCertificado.PEDIDO,
                descuento: descuento,
                fecha: new Date(),
                tipoCertificado: tipoCertificado
            })
        } else {
            return respuesta;
        }
         
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}


//devuelve toda las peticiones de todos los alumnos
const getAllPeticionPas = async function () {
    try {
        let peticiones = await models.PeticionCertificado.findAll();
        return peticiones || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const getPlanesAlumno = async function (edupersonuniqueid) {
    try {
        let planes = [
            {
                idplan: '09IB',
                nombre: 'GRADO EN INGENIERIA BIOMEDICA'
            },
            {
                idplan: '09TT',
                nombre: 'GRADO EN INGENIERIA DE TECNOLOGIAS Y SERVICIOS DE TELECOMUNICACION'
            }
        ];
        return planes || [];
    } catch (error) {
        console.log(error);
    }
}


//devuelve toda la info del alumno que se acaba de conectar
exports.getInfoAlumno = async function (req, res, next) {
    try {
        let respuesta = {};
        respuesta.peticiones = await getAllPeticionAlumno(req.session.user.edupersonuniqueid);
        respuesta.planes = await getPlanesAlumno(req.session.edupersonuniqueid);
        res.json(respuesta)
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
        var mainMail = req.session.user.mailPrincipal;
        //console.log("body: ",req.body);
        let peticion = {};
        // si peticion vacia, es que se tiene que crear
        if (Object.keys(req.body.peticion).length === 0) {
            //console.log("Nueva peticion");
            var id = (req.body.paramsToUpdate.contadorPeticiones > 0 ? req.body.paramsToUpdate.contadorPeticiones - 1 : null);
            peticion.estadoPeticion = estadosCertificado.NO_PEDIDO,
                req.body.peticion = {
                    idTabla: id,
                    estadoPeticionTexto: "NO_PEDIDO"
                }
        } else { // modifica una peticion ya creada, cambio de estado
            if (!req.body.peticion.edupersonuniqueid) req.body.peticion.edupersonuniqueid = null;
            peticion = await getPeticionAlumno(req.body.peticion.edupersonuniqueid, req.body.peticion.planCodigo, req.body.peticion.tipoCertificado)
        }
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
                    paramsToUpdate.tipoCertificado = req.body.paramsToUpdate.tipo
                    paramsToUpdate.planCodigo = req.body.paramsToUpdate.plan;
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
                default:
                    throw "Intenta cambiar un estado que no puede";
            }
        }
        paramsToUpdate.estadoPeticion = estadoNuevo;
        let toAlumno = peticion.email || req.session.user.mailPrincipal; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = process.env.EMAIL_PRUEBAS; //siempre se le manda el email al que hace la prueba
            toPAS = process.env.EMAIL_PRUEBAS;
        }
       /* let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.planCodigo, textoAdicional, req.filesBuffer, req.session)
        //solo se envia cuando el alumno tiene algo que enviar
        if (req.filesBuffer) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.planCodigo, textoAdicional, req.filesBuffer, req.session)
        }*/
        let respuesta;
        if (estadoNuevo === estadosCertificado.PEDIDO && peticion.estadoPeticion !== estadosCertificado.PETICION_CANCELADA) {
            respuesta = await createPeticionAlumno(req.session.user.edupersonuniqueid, req.session.user.mailPrincipal, req.session.user.givenname, req.session.user.sn, req.body.paramsToUpdate.plan, req.body.paramsToUpdate.descuento, req.body.paramsToUpdate.tipo)
        } else {
            respuesta = await updatePeticionAlumno(req.body.peticion.edupersonuniqueid, req.body.peticion.planCodigo, req.body.peticion.tipoCertificado, paramsToUpdate)
        }
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}





