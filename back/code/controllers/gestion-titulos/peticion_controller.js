var inspect = require('util').inspect;
var Busboy = require('busboy');
const axios = require('axios');
let models = require('../../models');
let Sequelize = require('sequelize');
let Op = Sequelize.Op
let mail = require('./mail');
let planController = require('../plan_controller');
const estadosTitulo = require('../../enums').estadosTitulo;
const base64 = require('../../lib/base64');
const dni = require('../../lib/dni');


//devuelve todas las peticiones de un alumno
const getAllPeticionAlumno = async function (irispersonaluniqueid) {
    try {
        let peticiones = await models.Peticion.findAll({
            where: {
                irispersonaluniqueid: irispersonaluniqueid
            }
        });
        return peticiones;
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

//devuelve todas las peticiones de un alumno
const getPeticionAlumno = async function (irispersonaluniqueid, planCodigo) {
    try {
        let peticion = await models.Peticion.findOne({
            where: {
                irispersonaluniqueid: irispersonaluniqueid,
                planCodigo: planCodigo
            }
        });
        let plan = await models.Plan.findOne({
            attributes: ['nombre'],
            where: {
                id: planCodigo
            }
        })
        if (peticion) {
            peticion.planNombre = '';
        }
        if (peticion && plan) {
            peticion.planNombre = plan.nombre || '';
        }
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

const updatePeticionAlumno = async function (irispersonaluniqueid, planCodigo, paramsToUpdate) {
    try {
        let peticion = await models.Peticion.update(paramsToUpdate, {
            where: {
                irispersonaluniqueid: irispersonaluniqueid,
                planCodigo: planCodigo
            },
            returning: true,
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const createPeticionAlumno = async function (irispersonaluniqueid, mail, nombre, apellido, planCodigo, descuento) {
    try {
        let peticion = await models.Peticion.create({
            irispersonaluniqueid: irispersonaluniqueid,
            email: mail,
            nombre: nombre,
            apellido: apellido,
            planCodigo: planCodigo,
            estadoPeticion: estadosTitulo.PEDIDO,
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
const getAllPeticionPas = async function (page, sizePerPage, filters) {
    try {
        const offset = 0 + (page - 1) * sizePerPage;
        const where = {}
        const whereAnd = []
        if (filters) {
            if (filters.irispersonaluniqueid) {
                whereAnd.push({
                    irispersonaluniqueid: {
                        [Op.iLike]: `%${filters.irispersonaluniqueid}%`
                    }
                })
            }
            if (filters.nombre) {
                whereAnd.push(Sequelize.where(
                    Sequelize.fn('unaccent', Sequelize.col('nombre')), {
                    [Op.iLike]: Sequelize.fn('unaccent', `%${filters.nombre}%`)
                }))
            }
            if (filters.apellido) {
                whereAnd.push(Sequelize.where(
                    Sequelize.fn('unaccent', Sequelize.col('apellido')), {
                    [Op.iLike]: Sequelize.fn('unaccent', `%${filters.apellido}%`)
                }))
            }
            if (filters.planNombre) {
                //aunque sea planNombre en realidad la clave es el codigo del plan
                //ya que procede de un select
                whereAnd.push({
                    planCodigo: filters.planNombre
                })
            }
            if (filters.estadoPeticionTexto) {
                whereAnd.push({
                    estadoPeticion: estadosTitulo[filters.estadoPeticionTexto]
                })
            }
        }
        if (whereAnd.length > 0) {
            where[Op.and] = whereAnd
        }
        let { count, rows } = await models.Peticion.findAndCountAll({
            where,
            offset,
            limit: sizePerPage,
            order: [
                ['fecha', 'DESC']
            ]
        });

        let plans = await planController.findAllPlans();
        plans.forEach(plan => {
            if (!plan.nombre) {
                plan.nombre = plan.id;
            }
        })
        rows.forEach(peticion => {
            const plan = plans.find(p => p.id === peticion.planCodigo);
            peticion.planNombre = '';
            if (plan) {
                peticion.planNombre = plan.nombre || '';
            }
        })
        return { numberPeticiones: count, peticiones: rows, plans };
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}


//devuelve toda la info del alumno que se acaba de conectar
exports.getInfoAlumno = async function (req, res, next) {
    try {
        let peticiones = await getAllPeticionAlumno(req.session.user.irispersonaluniqueid)
        let titulosAlumno;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            titulosAlumno = [{ "idplan": "09TT" }, { "idplan": "09TT" }, { "idplan": "09AQ" }]
        } else {
            let firstCall = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?dni=" + req.session.user.irispersonaluniqueid);
            let secondCall = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?token=" + base64.Base64EncodeUrl(firstCall.data.token))
            titulosAlumno = secondCall.data
            if (!Array.isArray(titulosAlumno) && typeof req.session.user.irispersonaluniqueid === 'string') {
                let firstCall2 = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?dni=" + dni.sanetizeDni(req.session.user.irispersonaluniqueid));
                let secondCall2 = await axios.get("https://peron.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?token=" + base64.Base64EncodeUrl(firstCall2.data.token))
                titulosAlumno = secondCall2.data
            }
        }
        if (!Array.isArray(titulosAlumno)) {
            titulosAlumno = [];
            console.log(req.session.user.irispersonaluniqueid)
        }

        //merge titulos pedidos y los que devuelve api peron. Solo se meten entradas nuevas
        titulosAlumno.forEach(plan => { return !peticiones.find(p => p.planCodigo === plan.idplan) ? peticiones.push({ planCodigo: plan.idplan, estadoPeticion: estadosTitulo.NOPEDIDO }) : null })
        let plans = await planController.findAllPlans();
        peticiones.forEach(peticion => {
            const plan = plans.find(p => p.id === peticion.planCodigo);
            peticion.planNombre = '';
            if (plan) {
                peticion.planNombre = plan.nombre || '';
            }
        })
        res.json(peticiones)
    } catch (error) {
        console.log(error)
        res.json({ error: error.message });
    }

}

//devuelve todas peticiones de los alumnos
exports.getInfoAllPas = async function (req, res, next) {
    try {
        respuesta = await getAllPeticionPas(
            req.query.page,
            req.query.sizePerPage,
            JSON.parse(req.query.filters)
        )
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

//update or create estado peticion interaccion de un alumno
exports.updateOrCreatePeticionFromAlumno = async function (req, res, next) {
    try {
        if (!req.body.peticion.irispersonaluniqueid) req.body.peticion.irispersonaluniqueid = null;
        let peticion = await getPeticionAlumno(req.body.peticion.irispersonaluniqueid, req.body.peticion.planCodigo)
        if (!peticion) peticion = { estadoPeticion: estadosTitulo.NO_PEDIDO }
        let paramsToUpdate = {};
        let estadoNuevo;
        let textoAdicional;

        if (peticion.estadoPeticion !== estadosTitulo[req.body.peticion.estadoPeticionTexto]) throw "Intenta cambiar un estado que no puede";

        switch (peticion.estadoPeticion) {
            case estadosTitulo.NO_PEDIDO:
            case estadosTitulo.PETICION_CANCELADA:
                estadoNuevo = estadosTitulo.PEDIDO;
                paramsToUpdate.descuento = req.body.paramsToUpdate.descuento;
                paramsToUpdate.textCancel = null;
                break;
            case estadosTitulo.ESPERA_PAGO:
                estadoNuevo = estadosTitulo.PAGO_REALIZADO;
                paramsToUpdate.formaPago = req.body.paramsToUpdate.formaPago
                break;
            default:
                throw "Intenta cambiar un estado que no puede";
        }

        paramsToUpdate.estadoPeticion = estadoNuevo;
        let toAlumno = peticion.email || req.session.user.mail; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = req.session.user.mail; //siempre se le manda el email al que hace la prueba
            toPAS = req.session.user.mail;
        }
        let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.planCodigo, req.body.peticion.planNombre, textoAdicional, req.filesBuffer, req.session)
        //solo se envia cuando el alumno tiene algo que enviar. Y no siempre, depende del estado
        if (req.filesBuffer) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.planCodigo, req.body.peticion.planNombre, textoAdicional, req.filesBuffer, req.session)
        }
        let respuesta;
        if (estadoNuevo === estadosTitulo.PEDIDO && peticion.estadoPeticion !== estadosTitulo.PETICION_CANCELADA) {
            respuesta = await createPeticionAlumno(req.session.user.irispersonaluniqueid, req.session.user.mail, req.session.user.cn, req.session.user.sn, req.body.peticion.planCodigo, req.body.paramsToUpdate.descuento)
        } else {
            respuesta = await updatePeticionAlumno(req.body.peticion.irispersonaluniqueid, req.body.peticion.planCodigo, paramsToUpdate)
        }
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

//update estado peticion interaccion de pas
exports.updatePeticionFromPas = async function (req, res, next) {
    try {
        if (!req.body.peticion.irispersonaluniqueid) req.body.peticion.irispersonaluniqueid = null;
        let peticion = await getPeticionAlumno(req.body.peticion.irispersonaluniqueid, req.body.peticion.planCodigo)
        if (!peticion) peticion = { estadoPeticion: estadosTitulo.NO_PEDIDO }
        let paramsToUpdate = {};
        let estadoNuevo;
        let textoAdicional;

        if (req.body.cancel) {
            if (peticion.estadoPeticion !== estadosTitulo.PEDIDO
                && peticion.estadoPeticion !== estadosTitulo.ESPERA_PAGO
                && peticion.estadoPeticion !== estadosTitulo.PAGO_REALIZADO
                && peticion.estadoPeticion !== estadosTitulo.TITULO_RECOGIDO) {
                throw "Intenta cambiar un estado que no puede";
            }
            estadoNuevo = req.body.paramsToUpdate.cancelNewState || estadosTitulo.PETICION_CANCELADA;
            paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel
            textoAdicional = req.body.paramsToUpdate.textCancel
            paramsToUpdate.formaPago = null;
            paramsToUpdate.descuento = null;
            paramsToUpdate.receptor = null;
            paramsToUpdate.localizacionFisica = null;

        } else {
            if (peticion.estadoPeticion !== estadosTitulo[req.body.peticion.estadoPeticionTexto]) throw "Intenta cambiar un estado que no puede";

            switch (peticion.estadoPeticion) {
                case estadosTitulo.PEDIDO:
                    estadoNuevo = estadosTitulo.ESPERA_PAGO;
                    break;
                case estadosTitulo.PAGO_REALIZADO:
                    estadoNuevo = estadosTitulo.PAGO_CONFIRMADO;
                    break;
                case estadosTitulo.PAGO_CONFIRMADO:
                    estadoNuevo = estadosTitulo.ESPERA_TITULO;
                    paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel;
                    textoAdicional = req.body.paramsToUpdate.textCancel;
                    break;
                case estadosTitulo.ESPERA_TITULO:
                    estadoNuevo = estadosTitulo.TITULO_DISPONIBLE;
                    paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel;
                    textoAdicional = req.body.paramsToUpdate.textCancel;
                    break;
                case estadosTitulo.TITULO_DISPONIBLE:
                    estadoNuevo = estadosTitulo.TITULO_RECOGIDO;
                    paramsToUpdate.receptor = req.body.paramsToUpdate.receptor;
                    paramsToUpdate.localizacionFisica = req.body.paramsToUpdate.localizacionFisica;
                    paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel
                    textoAdicional = req.body.paramsToUpdate.textCancel
                    break;
                default:
                    throw "Intenta cambiar un estado que no puede";
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
        let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.planCodigo, req.body.peticion.planNombre, textoAdicional, req.filesBuffer, req.session)
        //solo se envia cuando el alumno tiene algo que enviar. Y no siempre, depende del estado
        if (req.filesBuffer) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.planCodigo, req.body.peticion.planNombre, textoAdicional, req.filesBuffer, req.session)
        }
        let respuesta;
        respuesta = await updatePeticionAlumno(req.body.peticion.irispersonaluniqueid, req.body.peticion.planCodigo, paramsToUpdate)
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}





