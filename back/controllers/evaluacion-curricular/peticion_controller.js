let models = require('../../models');
let mail = require('./mail');
const estadosEvaluacionCurricular = require('../../enums').estadosEvaluacionCurricular;
var Busboy = require('busboy');
const axios = require('axios');
const base64 = require('../../lib/base64');
const dni = require('../../lib/dni');
var inspect = require('util').inspect;
var queriesController = require('./queries_controller');
let planController = require('../plan_controller');
let Sequelize = require('sequelize');
const Op = Sequelize.Op;

//devuelve todas las peticiones de un alumno
const getAllPeticionAlumno = async function (edupersonuniqueid) { // en realiudad solo una peticion por alumno posible
    try {
        let peticiones = await models.PeticionEvaluacionCurricular.findAll({
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
const getPeticionAlumno = async function (edupersonuniqueid, asignaturaCodigo) { //plan, asignatura, o nada??
    try {
        let peticion = await models.PeticionEvaluacionCurricular.findOne({
            where: {
                edupersonuniqueid: edupersonuniqueid,
                asignaturaCodigo: asignaturaCodigo
            }
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

const updatePeticionAlumno = async function (edupersonuniqueid, asignaturaCodigo, paramsToUpdate) {
    try {
        let peticion = await models.PeticionEvaluacionCurricular.update(paramsToUpdate, {
            where: {
                edupersonuniqueid: edupersonuniqueid,
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

const createPeticionAlumno = async function (edupersonuniqueid, mail, nombre, apellido, planCodigo, planNombre, asignaturaNombre, asignaturaCodigo, tipo, justificacion) {
    try {
        let respuesta = {};
        let peticion = await models.PeticionEvaluacionCurricular.findOne({
            where: {
                edupersonuniqueid: edupersonuniqueid,
                planCodigo: planCodigo,
                tipo: tipo,
                asignaturaCodigo: asignaturaCodigo
            }
        });
        if (peticion === null) {
            respuesta = await models.PeticionEvaluacionCurricular.create({
                edupersonuniqueid: edupersonuniqueid,
                email: mail,
                nombre: nombre,
                apellido: apellido,
                planCodigo: planCodigo,
                planNombre: planNombre,
                estadoPeticion: estadosEvaluacionCurricular.SOLICITUD_PENDIENTE,
                asignaturaNombre: asignaturaNombre,
                asignaturaCodigo: asignaturaCodigo,
                tipo: tipo,
                justificacion: justificacion,
                fecha: new Date()
            })
        } else {
            respuesta = null;
        }
        return respuesta
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
            if (filters.edupersonuniqueid) {
                whereAnd.push({
                    edupersonuniqueid: {
                        [Op.iLike]: `%${filters.edupersonuniqueid}%`
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
                    estadoPeticion: estadosEvaluacionCurricular[filters.estadoPeticionTexto]
                })
            }

            if (filters.tipo) {
                whereAnd.push({
                    tipo: filters.tipo
                })
            }

            if (filters.asignaturaNombre) {
                whereAnd.push({
                    asignaturaCodigo: filters.asignaturaNombre
                })
            }
        }
        if (whereAnd.length > 0) {
            where[Op.and] = whereAnd
        }
        let { count, rows } = await models.PeticionEvaluacionCurricular.findAndCountAll({
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

        let asignaturas = await queriesController.getAsignaturasDePlan(plans);
        return { numberPeticiones: count, peticiones: rows, asignaturas: asignaturas, plans: plans };
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const getEstadoTramite = async function () {
    try {
        let estados = await models.EstadoEvaluacionCurricular.findAll();
        return estados || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const updateEstadoTramite = async function (paramsToUpdate) {
    try {
        let estados = models.EstadoEvaluacionCurricular.update(paramsToUpdate, {
            where: {
                id: '1'
            },
            returning: true,
        });
        return estados || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

exports.getInfoAllAlumno = async function (req, res, next) {
    try {
        respuesta = await getAllPeticionAlumno(req.session.user.edupersonuniqueid)
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
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
            peticion.estadoPeticion = estadosEvaluacionCurricular.NO_PEDIDO,
                req.body.peticion = {
                    idTabla: id,
                    estadoPeticionTexto: "NO_PEDIDO"
                }
        } else { // modifica una peticion ya creada, cambio de estado
            if (!req.body.peticion.edupersonuniqueid) req.body.peticion.edupersonuniqueid = null;
            peticion = await getPeticionAlumno(req.body.peticion.edupersonuniqueid, req.body.peticion.asignaturaCodigo)
        }
        let paramsToUpdate = {};
        let estadoNuevo;
        let textoAdicional;
        // si cancelado
        if (req.body.cancel) {
            estadoNuevo = req.body.paramsToUpdate.cancelNewState === -1 ? estadosEvaluacionCurricular.SOLICITUD_CANCELADA : estadosEvaluacionCurricular.EVALUACION_DENEGADA;
            paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel
            textoAdicional = estadoNuevo === estadosEvaluacionCurricular.EVALUACION_DENEGADA ? "Nombre: " + req.body.peticion.nombre + "\nApellido:" + req.body.peticion.apellido + "\nAsignatura: " + req.body.peticion.asignaturaNombre + " (" + req.body.peticion.asignaturaCodigo + ")\nTitulación: " + req.body.peticion.planNombre + " (" + req.body.peticion.planCodigo + ")\nFecha reunión comisión: " + req.body.paramsToUpdate.fecha + "\nMotivo:" + req.body.paramsToUpdate.motivo : req.body.paramsToUpdate.textCancel
        } else {// si crear o actualizar peticion
            // console.log("db peticion:",peticion)
            // console.log("body peticion:",req.body.peticion);
            if (peticion.estadoPeticion !== estadosEvaluacionCurricular[req.body.peticion.estadoPeticionTexto]) throw "Intenta cambiar un estado que no puede";
            switch (peticion.estadoPeticion) {
                case estadosEvaluacionCurricular.NO_PEDIDO:
                case estadosEvaluacionCurricular.SOLICITUD_CANCELADA:
                    estadoNuevo = estadosEvaluacionCurricular.SOLICITUD_PENDIENTE;
                    paramsToUpdate.textCancel = null;
                    break;
                case estadosEvaluacionCurricular.SOLICITUD_PENDIENTE:
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_PENDIENTE;
                    break;
                case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_APROBADA;
                    textoAdicional = "Nombre: " + req.body.peticion.nombre + "\nApellido:" + req.body.peticion.apellido + "\nAsignatura: " + req.body.peticion.asignaturaNombre + " (" + req.body.peticion.asignaturaCodigo + ")\nTitulación: " + req.body.peticion.planNombre + " (" + req.body.peticion.planCodigo + ")\nFecha reunión comisión: " + req.body.paramsToUpdate.fecha + "\nMotivo:" + req.body.paramsToUpdate.motivo;
                    break;
                case estadosEvaluacionCurricular.EVALUACION_APROBADA:
                case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_FINALIZADA;
                    break;
                default:
                    throw "Intenta cambiar un estado que no puede";
            }
        }
        paramsToUpdate.estadoPeticion = estadoNuevo;

        let respuesta;
        let asignaturaNombre;
        if (estadoNuevo === estadosEvaluacionCurricular.SOLICITUD_PENDIENTE && peticion.estadoPeticion !== estadosEvaluacionCurricular.PETICION_CANCELADA) {
            asignaturaNombre = await queriesController.getNombreAsignatura(req.body.paramsToUpdate.asignaturaCodigo);
            respuesta = await createPeticionAlumno(req.session.user.edupersonuniqueid, mainMail, req.session.user.givenname, req.session.user.sn, req.body.paramsToUpdate.planCodigo, req.body.paramsToUpdate.planNombre, asignaturaNombre, req.body.paramsToUpdate.asignaturaCodigo, req.body.paramsToUpdate.tipo, req.body.paramsToUpdate.justificacion)
        } else {
            asignaturaNombre = req.body.peticion.asignaturaNombre;
            respuesta = await updatePeticionAlumno(req.body.peticion.edupersonuniqueid, req.body.peticion.asignaturaCodigo, paramsToUpdate)
        }

        let toAlumno = peticion.email || mainMail; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = process.env.EMAIL_PRUEBAS; //siempre se le manda el email al que hace la prueba
            toPAS = process.env.EMAIL_PRUEBAS;
        }
        let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, asignaturaNombre, textoAdicional, req.filesBuffer, req.session)
        //solo se envia cuando el alumno tiene algo que enviar
        if (req.filesBuffer) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, asignaturaNombre, textoAdicional, req.filesBuffer, req.session)
        }
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.getEstadoTramite = async function (req, res, next) {
    try {
        respuesta = await getEstadoTramite();
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.updateEstadoTramite = async function (req, res, next) {
    try {
        let paramsToUpdate = {};
        paramsToUpdate.estadoTitulacion = req.body.paramsToUpdate.estadoTitulacion;
        paramsToUpdate.estadoCurso = req.body.paramsToUpdate.estadoCurso;
        respuesta = await updateEstadoTramite(paramsToUpdate);
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

