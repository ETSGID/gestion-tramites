var inspect = require('util').inspect;
var Busboy = require('busboy');

const axios = require('axios');

let models = require('../../models');
let Sequelize = require('sequelize');
let Op = Sequelize.Op
let mail = require('./mail');
let planController = require('../plan_controller');

const estadosCertificado = require('../../enums').estadosCertificado;
const tiposCertificado = require('../../enums').tiposCertificado;
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
const getPeticionAlumno = async function (edupersonuniqueid, planCodigo, tipoCertificado) {
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

const updatePeticionAlumno = async function (edupersonuniqueid, planCodigo, tipoCertificado, paramsToUpdate) {
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

const createPeticionAlumno = async function (edupersonuniqueid, mail, nombre, apellido, planCodigo, planNombre, descuento, tipoCertificado, nombreCertificadoOtro) {
    try {
        let respuesta = {};
        let peticion = await models.PeticionCertificado.findOne({
            where: {
                edupersonuniqueid: edupersonuniqueid,
                planCodigo: planCodigo,
                tipoCertificado: tipoCertificado
            }
        });
        if (peticion === null) {
            respuesta = await models.PeticionCertificado.create({
                edupersonuniqueid: edupersonuniqueid,
                email: mail,
                nombre: nombre,
                apellido: apellido,
                planCodigo: planCodigo,
                planNombre: planNombre,
                estadoPeticion: estadosCertificado.SOLICITUD_ENVIADA,
                descuento: descuento,
                fecha: new Date(),
                tipoCertificado: tipoCertificado,
                nombreCertificadoOtro: nombreCertificadoOtro
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
const getAllPeticionPas = async function (page, sizePerPage, filters){
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
                    estadoPeticion: estadosCertificado[filters.estadoPeticionTexto]
                })
            }

            if (filters.nombreCertificado) {
                whereAnd.push({
                    tipoCertificado:tiposCertificado[filters.nombreCertificado]
                })
            }
        }
        if (whereAnd.length > 0) {
            where[Op.and] = whereAnd
        }
        let { count, rows } = await models.PeticionCertificado.findAndCountAll({
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

        return { numberPeticiones: count, peticiones: rows, plans: plans };
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
        let planes = await planController.findAllPlans();
        planes.forEach(plan => {
            if (!plan.nombre) {
                plan.nombre = plan.id;
            }
        });
        respuesta.planes = planes;
        res.json(respuesta)
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
        let emailToPas = false;
        let emailToAlumno = false;
        if (req.body.cancel) {
            estadoNuevo = estadosCertificado.PETICION_CANCELADA;
            paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel
            textoAdicional = req.body.paramsToUpdate.textCancel
            paramsToUpdate.formaPago = null;
            paramsToUpdate.descuento = null;
            emailToAlumno = true;
        } else {
            if (peticion.estadoPeticion !== estadosCertificado[req.body.peticion.estadoPeticionTexto]) throw "Intenta cambiar un estado que no puede";
            switch (peticion.estadoPeticion) {
                case estadosCertificado.NO_PEDIDO:
                case estadosCertificado.PETICION_CANCELADA:
                    estadoNuevo = estadosCertificado.SOLICITUD_ENVIADA;
                    paramsToUpdate.descuento = req.body.paramsToUpdate.descuento
                    paramsToUpdate.textCancel = null;
                    paramsToUpdate.tipoCertificado = req.body.paramsToUpdate.tipoCertificado;
                    paramsToUpdate.nombreCertificadoOtro = req.body.paramsToUpdate.nombreCertificadoOtro;
                    paramsToUpdate.planCodigo = req.body.paramsToUpdate.plan;
                    paramsToUpdate.planNombre = await planController.getName(req.body.paramsToUpdate.plan);
                    emailToPas = true;
                    emailToAlumno = true;
                    break;
                case estadosCertificado.SOLICITUD_ENVIADA:
                    estadoNuevo = estadosCertificado.ESPERA_PAGO;
                    emailToAlumno = true;
                    break;
                case estadosCertificado.ESPERA_PAGO:
                    estadoNuevo = estadosCertificado.PAGO_REALIZADO;
                    paramsToUpdate.formaPago = req.body.paramsToUpdate.formaPago
                    emailToPas = true;
                    break;
                case estadosCertificado.PAGO_REALIZADO:
                    estadoNuevo = estadosCertificado.PAGO_CONFIRMADO;
                    emailToAlumno = true;
                    break;
                case estadosCertificado.PAGO_CONFIRMADO:
                    estadoNuevo = estadosCertificado.CERTIFICADO_ENVIADO;
                    emailToAlumno = true;
                    break;
                default:
                    throw "Intenta cambiar un estado que no puede";
            }
        }
        paramsToUpdate.estadoPeticion = estadoNuevo;
        // enviar emails
        let toAlumno = peticion.email || req.session.user.mailPrincipal; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = process.env.EMAIL_PRUEBAS; //siempre se le manda el email al que hace la prueba
            toPAS = process.env.EMAIL_PRUEBAS;
        }
        if(emailToAlumno){
            let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.planCodigo, textoAdicional, req.filesBuffer, req.session)
        }
        if(emailToPas){
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.planCodigo, textoAdicional, req.filesBuffer, req.session, paramsToUpdate.formaPago)
        }
        
        let respuesta;
        if (estadoNuevo === estadosCertificado.SOLICITUD_ENVIADA && peticion.estadoPeticion !== estadosCertificado.PETICION_CANCELADA) {
            respuesta = await createPeticionAlumno(req.session.user.edupersonuniqueid, req.session.user.mailPrincipal, req.session.user.givenname, req.session.user.sn, paramsToUpdate.planCodigo, paramsToUpdate.planNombre, req.body.paramsToUpdate.descuento, paramsToUpdate.tipoCertificado, paramsToUpdate.nombreCertificadoOtro)
        } else {
            respuesta = await updatePeticionAlumno(req.body.peticion.edupersonuniqueid, req.body.peticion.planCodigo, req.body.peticion.tipoCertificado, paramsToUpdate)
        }
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}





