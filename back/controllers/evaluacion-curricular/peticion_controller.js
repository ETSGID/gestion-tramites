let models = require('../../models');
let mail = require('./mail');
const estadosEvaluacionCurricular = require('../../enums').estadosEvaluacionCurricular;
var Busboy = require('busboy');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
let planController = require('../plan_controller');
let Sequelize = require('sequelize');
const { response } = require('express');
const Op = Sequelize.Op;
const helpers = require('../../lib/helpers');
const { parse, Parser } = require('json2csv');
const JSZip = require('jszip');
const { resolve } = require('bluebird');

//devuelve todas las peticiones de un alumno
const getAllPeticionAlumno = async function (edupersonuniqueid) {
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
const getPeticionAlumno = async function (id) {
    try {
        let peticion = await models.PeticionEvaluacionCurricular.findOne({
            where: {
                id: id
            }
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }

}

const updatePeticionAlumno = async function (id, paramsToUpdate) {
    try {
        let peticion = await models.PeticionEvaluacionCurricular.update(paramsToUpdate, {
            where: {
                id: id
            },
            returning: true,
        });
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const createPeticionAlumno = async function (edupersonuniqueid, mail, nombre, apellido, planCodigo, planNombre, asignaturaNombre, asignaturaCodigo, tipo, justificacion, dni) {
    try {
        let respuesta = {};
        let peticion = null;
        // peticion = await models.PeticionEvaluacionCurricular.findOne({
        //     where: {
        //         edupersonuniqueid: edupersonuniqueid,
        //         planCodigo: planCodigo,
        //         tipo: tipo,
        //         asignaturaCodigo: asignaturaCodigo
        //     }
        // });
        if (peticion === null) {
            respuesta = await models.PeticionEvaluacionCurricular.create({
                dni: dni,
                edupersonuniqueid: edupersonuniqueid,
                email: mail,
                nombre: nombre,
                apellido: apellido,
                planCodigo: planCodigo,
                planNombre: planNombre,
                estadoPeticion: estadosEvaluacionCurricular.SOLICITUD_ENVIADA,
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
const getAllPeticionPas = async function (isInforme, page, sizePerPage, filters) {
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
            if (filters.dni) {
                whereAnd.push({
                    dni: {
                        [Op.iLike]: `%${filters.dni}%`
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
                whereAnd.push(Sequelize.where(
                    Sequelize.fn('unaccent', Sequelize.col('asignaturaNombre')), {
                    [Op.iLike]: Sequelize.fn('unaccent', `%${filters.asignaturaNombre}%`)
                }))
            }
            if (filters.asignaturaCodigo) {
                whereAnd.push(Sequelize.where(
                    Sequelize.fn('unaccent', Sequelize.col('asignaturaCodigo')), {
                    [Op.iLike]: Sequelize.fn('unaccent', `%${filters.asignaturaCodigo}%`)
                }))
            }
        }
        if (whereAnd.length > 0) {
            where[Op.and] = whereAnd
        }
        if (isInforme == true) {
            var { count, rows } = await models.PeticionEvaluacionCurricular.findAndCountAll({
                where,
                offset,
                limit: sizePerPage,
                order: [
                    ['plan', 'DESC'],
                    ['dni', 'DESC']
                ]
            });

        } else {
            var { count, rows } = await models.PeticionEvaluacionCurricular.findAndCountAll({
                where,
                offset,
                limit: sizePerPage,
                order: [
                    ['fecha', 'DESC']
                ]
            });
        }

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

const getDataApiUpm = async function (mail, path, options) {
    const curso = helpers.getCursoAnio();
    // En desarrollo en local NO se puede acceder a la apiUPM
    if (process.env.DEV == 'true') {
        let data;
        if (path === '/sapi_upm/academico/alumnos/index.upm/matricula/ultimoanio.json') {
            data = [
                {
                    "codigo_plan": "09TT",
                    "nombre_plan": "GRADO EN INGENIERIA DE TECNOLOGIAS Y SERVICIOS DE TELECOMUNICACION",
                    "anio": curso,
                    "periodo": "1",
                    "anulada": "N",
                    "conceptos": [
                        {
                            "nombre": "Créditos en 1a Matrícula",
                            "suma_resta": "S",
                            "cantidad": "66",
                            "importe_unidad": "45.02",
                            "importe_total": "2971.32"
                        }, {
                            "nombre": "Apertura Expediente",
                            "suma_resta": "S",
                            "cantidad": "1",
                            "importe_unidad": "33.65",
                            "importe_total": "33.65"
                        }, {
                            "nombre": "Seguro Escolar",
                            "suma_resta": "S",
                            "cantidad": "1",
                            "importe_unidad": "1.12",
                            "importe_total": "1.12"
                        }, {
                            "nombre": "Becario MEC",
                            "suma_resta": "R",
                            "cantidad": "",
                            "importe_unidad": "",
                            "importe_total": "2971.32"
                        }
                    ]
                },
                {
                    "codigo_plan": "09AQ",
                    "nombre_plan": "MASTER UNIVERSITARIO EN INGENIERÍA DE TELECOMUNICACIÓN",
                    "anio": curso,
                    "periodo": "1",
                    "anulada": "N"
                    //otros parametros que no importan
                },
                {
                    "codigo_plan": "09TT",
                    "nombre_plan": "GRADO EN INGENIERIA DE TECNOLOGIAS Y SERVICIOS DE TELECOMUNICACION",
                    //ejemplo curso pasado
                    "anio": "2015-16",
                    "periodo": "1",
                    "anulada": "N"
                    //otros parametros que no importan
                }
            ];

        } else if (path.startsWith('/sapi_upm/academico/alumnos/index.upm/matricula.json/')) {

            const asignaturasMatricula = {
                '09TT': {},
                '09AQ': {}
            }
            asignaturasMatricula['09TT'][curso] = [
                {
                    "codigo_asignatura": "95000001",
                    "nombre_asignatura": "ALGEBRA",
                    "duracion": "1S",
                    "curso": "1",
                    "creditos": "6"
                },
                {
                    "codigo_asignatura": "95000013",
                    "nombre_asignatura": "ELECTROMAGNETISMO",
                    "duracion": "1S",
                    "curso": "2",
                    "creditos": "4.5"
                },
                // Opt
                {
                    "codigo_asignatura": "95000191",
                    "nombre_asignatura": "DESARROLLO PERSONAL Y GESTIÓN DE CARRERA",
                    "duracion": "1S-2S",
                    "curso": "4",
                    "creditos": "4.5"
                },
                // Opt
                {
                    "codigo_asignatura": "95000192",
                    "nombre_asignatura": "CREATIVIDAD E INNOVACIÓN",
                    "duracion": "2S",
                    "curso": "3",
                    "creditos": "4.5"
                },
                // TFG
                {
                    "codigo_asignatura": "95000082",
                    "nombre_asignatura": "TRABAJO FIN DE GRADO",
                    "duracion": "1S-2S",
                    "curso": "4",
                    "creditos": "12"
                }
            ]

            asignaturasMatricula['09AQ'][curso] = [
                {
                    "codigo_asignatura": "93000792",
                    "nombre_asignatura": "ANALISIS SEÑAL PARA COMUNICACIONES",
                    "duracion": "1S",
                    "curso": "1",
                    "creditos": "6"
                },
                {
                    "codigo_asignatura": "93000795",
                    "nombre_asignatura": "EQUIPOS Y TERMINALES DE USUARIO",
                    "duracion": "1S",
                    "curso": "1",
                    "creditos": "6"
                }
            ]
            data = asignaturasMatricula[options.plan];
        }
        return data;
    } else if (process.env.PRUEBAS == 'true') {
        try {
            let email_pruebas = process.env.EMAIL_PRUEBAS;
            var key = fs.readFileSync('certificates/es_upm_etsit_mihorario_key.pem');
            var cert = fs.readFileSync('certificates/es_upm_etsit_mihorario_cert.pem');
            var passphrase = process.env.API_PASSPHRASE;
            const httpsAgent = new https.Agent({
                cert: cert,
                key: key,
                passphrase: passphrase,
                secureProtocol: "TLSv1_2_method"
            })
            const headers = {
                'X-UPMUSR': email_pruebas
            }
            const response = await axios.get(path, { headers: headers, httpsAgent: httpsAgent })
            return response.data;
        } catch (error) {
            console.error(error);
            return error;
        }

    } else {
        try {
            var key = fs.readFileSync('certificates/es_upm_etsit_mihorario_key.pem');
            var cert = fs.readFileSync('certificates/es_upm_etsit_mihorario_cert.pem');
            var passphrase = process.env.API_PASSPHRASE;
            const httpsAgent = new https.Agent({
                cert: cert,
                key: key,
                passphrase: passphrase,
                secureProtocol: "TLSv1_2_method"
            })
            const headers = {
                'X-UPMUSR': mail
            }
            const response = await axios.get(path, { headers: headers, httpsAgent: httpsAgent })
            return response.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}


const getInfoMatricula = async function (correo) {
    return new Promise((resolve) => {
        let planesAsignaturas = {};
        let promisesAsignaturasPlanes = [];
        let anio = helpers.getCursoAnio();
        try {
            getDataApiUpm(correo, 'https://www.upm.es/sapi_upm/academico/alumnos/index.upm/matricula/ultimoanio.json', {})
                .then(async (data) => {
                    data.forEach(plan => {
                        if (plan.anio === anio) {
                            planesAsignaturas[plan.codigo_plan] = {
                                codigo: plan.codigo_plan,
                                nombre: plan.nombre_plan,
                                asignaturas: []
                            }
                        }
                    })
                    for (const plan in planesAsignaturas) {
                        promisesAsignaturasPlanes.push(
                            getDataApiUpm(correo, 'https://www.upm.es/sapi_upm/academico/alumnos/index.upm/matricula.json/' + plan + '/asignaturas', { plan })
                        )
                    }
                    const asignaturasPlanes = await Promise.all(promisesAsignaturasPlanes);
                    let index = 0
                    for (plan in planesAsignaturas) {
                        if (asignaturasPlanes[index] && asignaturasPlanes[index][anio] && Array.isArray(asignaturasPlanes[index][anio])) {
                            asignaturasPlanes[index][anio].forEach(asignatura => {
                                let aux = {};
                                aux.asignaturaCodigo = asignatura.codigo_asignatura;
                                aux.asignaturaNombre = asignatura.nombre_asignatura;
                                planesAsignaturas[plan].asignaturas.push(aux);
                            });
                        }
                        index++;
                    }
                    //console.log('result', planesAsignaturas);
                    resolve(planesAsignaturas);
                })
        } catch (error) {
            throw error;
        }
    });
}

const getDatosAlumno = async function (alumno, planCodigo, asignaturaCodigo, cursoAcademico) {
    try {
        let data = {};
        if (process.env.DEV == 'true') {
            data = {
                "report": "EVALUACION_CURRICULAR",
                "plan": "09TT",
                "dni": "48225049",
                "cursoAcademico": "2014-15",
                "asignatura": 95000008,
                "anyoInicio": 2014,
                "cursoAcademicoInicio": "2014-15",
                "cursoUltimaMatricula": "2019-20",
                "numAsigSuspendida2veces": 1,
                "numAsigSuspendida3veces": 0,
                "numAsigMatriculaCursoAnterior": 0,
                "numAsigMatriculaCursoActual": 12,
                "creditosPendientes": 0.0,
                "numVecesSuspensoCursoAnterior": 0,
                "numVecesSuspensoCursoActual": 0,
                "numVecesSuspenso": 1,
                "ultimaConvocatoria": "2016-02-08",
                "notasAnteriores": [
                    {
                        "cursoAcademico": "2014-15",
                        "asignatura": 95000008,
                        "convocatoria": "FEB",
                        "calificacionAlfa": "P"
                    },
                    {
                        "cursoAcademico": "2014-15",
                        "asignatura": 95000008,
                        "convocatoria": "JUL",
                        "calificacionAlfa": "P"
                    }, {
                        "cursoAcademico": "2015-16",
                        "asignatura": 95000008,
                        "convocatoria": "FEB",
                        "calificacion": 3.1,
                        "calificacionAlfa": "S"
                    },
                    {
                        "cursoAcademico": "2015-16",
                        "asignatura": 95000008,
                        "convocatoria": "JUL",
                        "calificacion": 5.0,
                        "calificacionAlfa": "A"
                    }
                ],
                "aprobadoTFT": true,
                "matriculadoTFT": false,
                "notaMediaCurso": 6.61,
                "notaMedia": 6.67
            };
            return data;
        } else if (process.env.PRUEBAS == 'true') {
            let username = process.env.API_USERNAME;
            let password = process.env.API_PWD;
            let data = {};
            data.alumno = '9298dbdc-26bf-4211-8430-3019583bb882@upm.es';
            data.plan = '09TT';
            data.asignatura = 95000008;
            data.cursoAcademico = '2015-16';
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            //console.log('data to api:', data);
            datos = await axios.post("https://api.etsit.upm.es/stats/report/evaluacion_curricular", data, {
                headers: headers,
                auth: {
                    username: username,
                    password: password
                }
            })
            data = datos.data;
            return data;
        } else {
            let username = process.env.API_USERNAME;
            let password = process.env.API_PWD;
            let data = {};
            data.alumno = alumno;
            data.plan = planCodigo;
            data.asignatura = asignaturaCodigo;
            data.cursoAcademico = cursoAcademico;
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            //console.log('data to api:', data);
            datos = await axios.post("https://api.etsit.upm.es/stats/report/evaluacion_curricular", data, {
                headers: headers,
                auth: {
                    username: username,
                    password: password
                }
            })
            data = datos.data;
            return data;
        }
    }
    catch (error) {
        throw error;
    }
}

const getInformes = async function () {
    try {
        var datosTitulacion = [];
        var datosCurso = [];
        const curso = helpers.getCursoAnio();
        let respuesta = await getAllPeticionPas(true, null, null, null);

        datosTitulacion = await Promise.all(respuesta.peticiones.map(async (peticion) => {
            if (peticion.tipo === "titulación") {
                let aux = {};
                aux = await getDatosAlumno(peticion.edupersonuniqueid, peticion.planCodigo, peticion.asignaturaCodigo, curso);
                aux.estadoPeticion = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === peticion.estadoPeticion);
                aux.asignaturaNombre = peticion.asignaturaNombre;
                aux.nombre = peticion.nombre;
                aux.apellido = peticion.apellido;
                return aux;
            }
        }));
        datosCurso = await Promise.all(respuesta.peticiones.map(async (peticion) => {
            if (peticion.tipo === "curso") {
                let aux = {};
                aux = await getDatosAlumno(peticion.edupersonuniqueid, peticion.planCodigo, peticion.asignaturaCodigo, curso);
                aux.estadoPeticion = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === peticion.estadoPeticion);
                aux.asignaturaNombre = peticion.asignaturaNombre;
                aux.nombre = peticion.nombre;
                aux.apellido = peticion.apellido;
                return aux;
            }
        }));
        // borrar los undefined
        datosTitulacionClean = datosTitulacion.filter(Boolean);
        datosCursoClean = datosCurso.filter(Boolean);
        return { datosTitulacion: datosTitulacionClean, datosCurso: datosCursoClean }
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const getHistorico = async function () {
    try {
        let respuesta = await models.HistoricoEvaluacionCurricular.findAll({
            order: [
                ['plan', 'DESC'],
                ['fechaTribunal', 'DESC'],
                ['dni', 'DESC']
            ]
        });
        return respuesta || [];
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const deletePeticiones = async function (tipo) {
    try {
        let borrar = await models.HistoricoEvaluacionCurricular.destroy({
            where: {
                fechaTribunal: {
                    [Op.lte]: Sequelize.literal("current_date - interval '10 years'")
                }
            },
            returning: true,
        });
        let peticion = await models.PeticionEvaluacionCurricular.destroy({
            where: {
                tipo: tipo
            },
            returning: true,
        });
        peticion = await getAllPeticionPas(false, null, null, null);
        return peticion
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

const createHistorico = async function (edupersonuniqueid, dni, nombre, apellido, planCodigo, planNombre, asignaturaNombre, asignaturaCodigo, tipo, fecha) {
    try {
        let respuesta = {};
        respuesta = await models.HistoricoEvaluacionCurricular.create({
            dni: dni,
            edupersonuniqueid: edupersonuniqueid,
            nombre: nombre,
            apellido: apellido,
            planCodigo: planCodigo,
            planNombre: planNombre,
            asignaturaNombre: asignaturaNombre,
            asignaturaCodigo: asignaturaCodigo,
            tipo: tipo,
            fechaTribunal: fecha
        })
        return respuesta
    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}

exports.getInfoAllAlumno = async function (req, res, next) {
    try {
        let respuesta = {};
        respuesta.peticiones = await getAllPeticionAlumno(req.session.user.edupersonuniqueid);
        respuesta.matricula = await getInfoMatricula(req.session.user.mail);
        res.json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

//devuelve todas peticiones de los alumnos
exports.getInfoAllPas = async function (req, res, next) {
    try {
        respuesta = await getAllPeticionPas(
            false,
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
            error = "Sólo se admiten ficheros formato pdf.";
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
        const curso = helpers.getCursoAnio();
        var mainMail = req.session.user.mailPrincipal;
        let peticion = {};
        // si peticion vacia, es que se tiene que crear
        if (Object.keys(req.body.peticion).length === 0) {
            var id = (req.body.paramsToUpdate.contadorPeticiones > 0 ? req.body.paramsToUpdate.contadorPeticiones - 1 : null);
            peticion.estadoPeticion = 0;
            req.body.peticion = {
                idTabla: id,
                asignaturaNombre: req.body.paramsToUpdate.asignaturaNombre
            }
        } else { // modifica una peticion ya creada, cambio de estado
            if (!req.body.peticion.edupersonuniqueid) req.body.peticion.edupersonuniqueid = null;
            peticion = await getPeticionAlumno(req.body.peticion.id);
        }
        let paramsToUpdate = {};
        let estadoNuevo;
        let textoAdicional;
        let emailToPas = false;
        let emailToAlumno = false;
        // si cancelado
        if (req.body.cancel) {
            estadoNuevo = req.body.paramsToUpdate.cancelNewState;
            paramsToUpdate.textCancel = req.body.paramsToUpdate.textCancel;
            textoAdicional = estadoNuevo === estadosEvaluacionCurricular.EVALUACION_DENEGADA ? "Nombre: " + req.body.peticion.nombre + "\nApellido:" + req.body.peticion.apellido + "\nAsignatura: " + req.body.peticion.asignaturaNombre + " (" + req.body.peticion.asignaturaCodigo + ")\nTitulación: " + req.body.peticion.planNombre + " (" + req.body.peticion.planCodigo + ")\nFecha reunión tribunal: " + helpers.formatFecha(req.body.paramsToUpdate.fecha) + "\nMotivo: " + req.body.paramsToUpdate.textCancel : req.body.paramsToUpdate.textCancel
            emailToAlumno = true;
            //si ev denegada : añadir entrada en historico
            if (estadoNuevo === estadosEvaluacionCurricular.EVALUACION_DENEGADA) {
                await createHistorico(req.session.user.edupersonuniqueid, req.body.peticion.dni, req.body.peticion.nombre, req.body.peticion.apellido, req.body.peticion.planCodigo, req.body.peticion.planNombre, req.body.peticion.asignaturaNombre, req.body.peticion.asignaturaCodigo, req.body.peticion.tipo, req.body.paramsToUpdate.fecha);
            }
        } else {// si crear o actualizar peticion
            if (peticion.estadoPeticion !== 0 && (peticion.estadoPeticion !== estadosEvaluacionCurricular[req.body.peticion.estadoPeticionTexto])) throw "Intenta cambiar un estado que no puede";
            switch (peticion.estadoPeticion) {
                case 0:
                case estadosEvaluacionCurricular.SOLICITUD_CANCELADA:
                    estadoNuevo = estadosEvaluacionCurricular.SOLICITUD_ENVIADA;
                    paramsToUpdate.asignaturaNombre = req.body.paramsToUpdate.asignaturaNombre;
                    paramsToUpdate.asignaturaCodigo = req.body.paramsToUpdate.asignaturaCodigo;
                    paramsToUpdate.planCodigo = req.body.paramsToUpdate.planCodigo;
                    paramsToUpdate.planNombre = await planController.getName(req.body.paramsToUpdate.planCodigo);
                    paramsToUpdate.tipo = req.body.paramsToUpdate.tipo;
                    paramsToUpdate.justificacion = req.body.paramsToUpdate.justificacion;
                    paramsToUpdate.textCancel = null;
                    let datosAlumno = {};
                    datosAlumno = await getDatosAlumno(req.body.edupersonuniqueid, req.body.paramsToUpdate.planCodigo, req.body.paramsToUpdate.asignaturaCodigo, curso);
                    paramsToUpdate.dni = datosAlumno.dni;
                    emailToAlumno = true;
                    emailToPas = true;
                    break;
                case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_PENDIENTE;
                    emailToAlumno = true;
                    break;
                case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                    estadoNuevo = estadosEvaluacionCurricular.EVALUACION_APROBADA;
                    textoAdicional = "Nombre: " + req.body.peticion.nombre + "\nApellido: " + req.body.peticion.apellido + "\nAsignatura: " + req.body.peticion.asignaturaNombre + " (" + req.body.peticion.asignaturaCodigo + ")\nTitulación: " + req.body.peticion.planNombre + " (" + req.body.peticion.planCodigo + ")\nFecha reunión tribunal: " + helpers.formatFecha(req.body.paramsToUpdate.fecha) + "\nMotivo: " + req.body.paramsToUpdate.motivo;
                    emailToAlumno = true;
                    //añadir entrada en historico
                    await createHistorico(req.session.user.edupersonuniqueid, req.body.peticion.dni, req.body.peticion.nombre, req.body.peticion.apellido, req.body.peticion.planCodigo, req.body.peticion.planNombre, req.body.peticion.asignaturaNombre, req.body.peticion.asignaturaCodigo, req.body.peticion.tipo, req.body.paramsToUpdate.fecha);
                    break;
                case estadosEvaluacionCurricular.EVALUACION_APROBADA:
                    estadoNuevo = estadosEvaluacionCurricular.NOTA_INTRODUCIDA;
                    emailToAlumno = true;
                    break;
                default:
                    throw "Intenta cambiar un estado que no puede";
            }
        }
        paramsToUpdate.estadoPeticion = estadoNuevo;

        let respuesta;
        if (estadoNuevo === estadosEvaluacionCurricular.SOLICITUD_ENVIADA && peticion.estadoPeticion !== estadosEvaluacionCurricular.PETICION_CANCELADA) {
            respuesta = await createPeticionAlumno(req.session.user.edupersonuniqueid, mainMail, req.session.user.givenname, req.session.user.sn, paramsToUpdate.planCodigo, paramsToUpdate.planNombre, paramsToUpdate.asignaturaNombre, paramsToUpdate.asignaturaCodigo, paramsToUpdate.tipo, paramsToUpdate.justificacion, paramsToUpdate.dni)
        } else {
            respuesta = await updatePeticionAlumno(req.body.peticion.id, paramsToUpdate)

        }

        let toAlumno = peticion.email || mainMail; //si no existe la peticion sera el correo el que se pasa por email
        let toPAS = process.env.EMAIL_SECRETARIA;
        let from = process.env.EMAIL_SENDER;
        if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
            toAlumno = process.env.EMAIL_PRUEBAS; //siempre se le manda el email al que hace la prueba
            toPAS = process.env.EMAIL_PRUEBAS;
        }
        if (emailToAlumno) {
            let mailInfoFromPas = await mail.sendEmailToAlumno(estadoNuevo, from, toAlumno, req.body.peticion.asignaturaNombre, textoAdicional, req.filesBuffer, req.session)
        }
        if (emailToPas) {
            let mailInfoFromAlumno = await mail.sendEmailToPas(estadoNuevo, from, toPAS, req.body.peticion.asignaturaNombre, textoAdicional, req.filesBuffer, req.session)
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

exports.getDatosAlumno = async function (req, res, next) {

    try {
        respuesta = await getDatosAlumno(req.body.edupersonuniqueid, req.body.planCodigo, req.body.asignaturaCodigo, req.body.cursoAcademico);
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.getInformes = async function (req, res, next) {
    try {
        getInformes().then(async (result) => {
            const data_tit = await Promise.all(result.datosTitulacion.map(async (report, index) => {
                return {
                    número: (index + 1),
                    estado_solicitud: report.estadoPeticion,
                    dni: report.dni,
                    nombre: report.nombre,
                    apellidos: report.apellido,
                    plan: report.plan,
                    asignatura: report.asignatura + ' - ' + report.asignaturaNombre,
                    curso_inicio_titulación: report.cursoAcademicoInicio,
                    curso_ultima_matricula: report.cursoUltimaMatricula,
                    numero_asignaturas_suspendidas_2_veces: report.numAsigSuspendida2veces,
                    numero_asignaturas_suspendidas_3_veces: report.numAsigSuspendida3veces,
                    numero_asignaturas_matriculadas_curso_anterior: report.numAsigMatriculaCursoAnterior,
                    numero_asignaturas_matriculadas_curso_actual: report.numAsigMatriculaCursoActual,
                    ECTS_pendientes: report.creditosPendientes,
                    numero_veces_suspenso_asignatura_curso_anterior: report.numVecesSuspensoCursoAnterior,
                    numero_veces_suspenso_asignatura_curso_actual: report.numVecesSuspensoCursoActual,
                    numero_veces_suspenso_asginatura: report.numVecesSuspenso,
                    fecha_ultima_convocatoria_asignatura: helpers.formatFecha(report.ultimaConvocatoria),
                    penultima_calificacion: report.notasAnteriores[report.notasAnteriores.length - 2].calificacion || report.notasAnteriores[report.notasAnteriores.length - 2].calificacionAlfa,
                    penultima_convocatoria: report.notasAnteriores[report.notasAnteriores.length - 2].convocatoria + ' ' + report.notasAnteriores[report.notasAnteriores.length - 2].cursoAcademico,
                    ultima_calificacion: report.notasAnteriores[report.notasAnteriores.length - 1].calificacion || report.notasAnteriores[report.notasAnteriores.length - 1].calificacionAlfa,
                    ultima_convocatoria: report.notasAnteriores[report.notasAnteriores.length - 1].convocatoria + ' ' + report.notasAnteriores[report.notasAnteriores.length - 1].cursoAcademico,
                    TFT_matriculado: report.matriculadoTFT ? 'Sí' : "No",
                    TFT_aprobado: report.aprobadoTFT ? 'Sí' : "No",
                    nota_media_curso: report.notaMediaCurso,
                    nota_media_titulacion: report.notaMedia
                };
            }));
            const data_curso = await Promise.all(result.datosCurso.map(async (report, index) => {
                return {
                    número: (index + 1),
                    estado_solicitud: report.estadoPeticion,
                    dni: report.dni,
                    nombre: report.nombre,
                    apellidos: report.apellido,
                    plan: report.plan,
                    asignatura: report.asignatura + ' - ' + report.asignaturaNombre,
                    curso_inicio_titulación: report.cursoAcademicoInicio,
                    curso_ultima_matricula: report.cursoUltimaMatricula,
                    numero_asignaturas_suspendidas_2_veces: report.numAsigSuspendida2veces,
                    numero_asignaturas_suspendidas_3_veces: report.numAsigSuspendida3veces,
                    numero_asignaturas_matriculadas_curso_anterior: report.numAsigMatriculaCursoAnterior,
                    numero_asignaturas_matriculadas_curso_actual: report.numAsigMatriculaCursoActual,
                    ECTS_pendientes: report.creditosPendientes,
                    numero_veces_suspenso_asignatura_curso_anterior: report.numVecesSuspensoCursoAnterior,
                    numero_veces_suspenso_asignatura_curso_actual: report.numVecesSuspensoCursoActual,
                    numero_veces_suspenso_asginatura: report.numVecesSuspenso,
                    fecha_ultima_convocatoria_asignatura: helpers.formatFecha(report.ultimaConvocatoria),
                    penultima_calificacion: report.notasAnteriores[report.notasAnteriores.length - 2].calificacion || report.notasAnteriores[report.notasAnteriores.length - 2].calificacionAlfa,
                    penultima_convocatoria: report.notasAnteriores[report.notasAnteriores.length - 2].convocatoria + ' ' + report.notasAnteriores[report.notasAnteriores.length - 2].cursoAcademico,
                    ultima_calificacion: report.notasAnteriores[report.notasAnteriores.length - 1].calificacion || report.notasAnteriores[report.notasAnteriores.length - 1].calificacionAlfa,
                    ultima_convocatoria: report.notasAnteriores[report.notasAnteriores.length - 1].convocatoria + ' ' + report.notasAnteriores[report.notasAnteriores.length - 1].cursoAcademico,
                    TFT_matriculado: report.matriculadoTFT ? 'Sí' : "No",
                    TFT_aprobado: report.aprobadoTFT ? 'Sí' : "No",
                    nota_media_curso: report.notaMediaCurso,
                    nota_media_titulacion: report.notaMedia
                };
            }));
            const fields = [
                'número', 'estado_solicitud', 'dni', 'nombre', 'apellidos', 'plan', 'asignatura', 'curso_inicio_titulación', 'curso_ultima_matricula',
                'numero_asignaturas_suspendidas_2_veces', 'numero_asignaturas_suspendidas_3_veces', 'numero_asignaturas_matriculadas_curso_anterior',
                'numero_asignaturas_matriculadas_curso_actual', 'ECTS_pendientes', 'numero_veces_suspenso_asignatura_curso_anterior', 'numero_veces_suspenso_asignatura_curso_actual',
                'numero_veces_suspenso_asginatura', 'fecha_ultima_convocatoria_asignatura', 'penultima_calificacion', 'penultima_convocatoria', 'ultima_calificacion',
                'ultima_convocatoria', 'TFT_matriculado', 'TFT_aprobado', 'nota_media_curso', 'nota_media_titulacion'
            ];
            const opts = { fields };
            const json2csvParser = new Parser(opts);
            const csv_tit = json2csvParser.parse(data_tit);
            const csv_curso = json2csvParser.parse(data_curso);
            var zip = new JSZip();
            zip.file('informe_titulacion.csv', csv_tit);
            zip.file('informe_curso.csv', csv_curso);
            zip.generateAsync({ type: "base64" })
                .then(function (content) {
                    res.json({
                        title: "informes.zip",
                        content: content
                    })
                })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}


exports.getHistorico = async function (req, res, next) {
    try {
        var result = await getHistorico();
        const opts = ['número', 'dni', 'nombre', 'apellidos', 'plan_codigo', 'plan_nombre', 'asignatura_codigo', 'asignatura_nombre',
            'tipo', 'fecha_tribunal'];
        const data = result.map((solicitud, index) => {
            return {
                número: (index + 1),
                //edupersonuniqueid: solicitud.edupersonuniqueid,
                dni: solicitud.dni,
                nombre: solicitud.nombre,
                apellidos: solicitud.apellido,
                plan_codigo: solicitud.planCodigo,
                plan_nombre: solicitud.planNombre,
                asignatura_codigo: solicitud.asignaturaCodigo,
                asignatura_nombre: solicitud.asignaturaNombre,
                tipo: solicitud.tipo,
                fecha_tribunal: helpers.formatFecha(solicitud.fechaTribunal)
            };
        });
        // falta crear pdf
        const json2csvParser = new Parser({ opts });
        const csv = json2csvParser.parse(data);
        var zip = new JSZip();
        zip.file('historico.csv', csv)
        zip.generateAsync({ type: "base64" })
            .then(function (content) {
                res.json({
                    title: "historico.zip",
                    content: content
                })
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}


exports.deletePeticiones = async function (req, res, next) {
    try {
        let tipo = req.query.tipo;
        respuesta = await deletePeticiones(tipo);
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
