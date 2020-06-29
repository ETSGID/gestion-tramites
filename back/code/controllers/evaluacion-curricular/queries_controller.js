let modelsEvaluacionCurricular = require('../../models/evaluacion-curricular');
let sequelize = require('sequelize');
const Op = sequelize.Op;

// Obtiene curso actual
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
let cursoActual;
if (month <= 7) {
    cursoActual = (year - 1) + '-' + year.toString().substr(2);
} else {
    cursoActual = year + '-' + (year + 1).toString().substr(2);
}

// ESTUDIANTES

// Lista de asignaturas (nombre y plan) suspensas para esa persona, dado dni
const getAsignaturasSuspensas = async function (dni, curso) {
    try {
        var asignaturasCodigo = {};
        // Obtiene codigos de las asignaturas + idplan, dos convocatorias al menos (count>1)
        if (curso === undefined) { // por titulacion
            asignaturasCodigo = await modelsEvaluacionCurricular.linea_acta.findAll({
                attributes: ['asignatura', 'idplan'],
                where: {
                    asignatura: {
                        [Op.notIn]: sequelize.literal('(SELECT asignatura FROM linea_acta WHERE calificacion_num >= 5 AND dni ="' + dni + '")')
                    },
                    dni: dni,
                    idplan: ["09TT", "09IB", "09AQ"],
                    calificacion_num: {
                        [Op.ne]: null
                    }
                },
                group: ['asignatura', 'idplan'],
                having: sequelize.literal('COUNT(*) > 1') //dos convocatorias minimo
            });
        } else { // por curso
            asignaturasCodigo = await modelsEvaluacionCurricular.linea_acta.findAll({
                attributes: ['asignatura', 'idplan'],
                where: {
                    asignatura: {
                        [Op.notIn]: sequelize.literal('(SELECT asignatura FROM linea_acta WHERE calificacion_num >= 5 AND dni ="' + dni + '" AND curso_academico ="' + curso + '")')
                    },
                    dni: dni,
                    idplan: ["09TT", "09IB", "09AQ"],
                    calificacion_num: {
                        [Op.ne]: null
                    },
                    curso_academico: curso
                },
                group: ['asignatura', 'idplan'],
                having: sequelize.literal('COUNT(*) >1') // una convocatoria, la extraordinaria aun no esta en actas??
            });
        }

        var asignaturasSuspensasString = JSON.stringify(asignaturasCodigo);
        var asignaturasSuspensasJSON = JSON.parse(asignaturasSuspensasString);
        // Obtiene nombre de las asignaturas suspensas 
        for (var i = 0; i < asignaturasCodigo.length; i++) {
            let nombreAsignatura = await getNombreAsignatura(asignaturasCodigo[i].asignatura);
            asignaturasSuspensasJSON[i].nombre = nombreAsignatura;
        }
        return asignaturasSuspensasJSON;
    } catch (error) {
        throw error;
    }
}

// Obtiene dni del alumno a partir de su email
const getDni = async function (email) {
    try {
        let dni = await modelsEvaluacionCurricular.persona.findOne({
            attributes: ['dni'],
            where: {
                email: email
            }
        });
        var dniString = JSON.stringify(dni);
        var dniJSON = JSON.parse(dniString);
        return dniJSON;
    } catch (error) {
        throw error;
    }
}

// obtiene planes de estudio en los que el alumno esta matriculado
const getPlanesEstudios = async function (dni) {
    try {
        let planes = await modelsEvaluacionCurricular.linea_acta.findAll({
            attributes: [[sequelize.literal('DISTINCT `idplan`'), 'idplan']],
            where: {
                dni: dni
            }
        });
        var planesString = JSON.stringify(planes);
        var planesJSON = JSON.parse(planesString);
        for (var i = 0; i < planes.length; i++) {
            let nombrePlan = await modelsEvaluacionCurricular.plan_estudio.findOne({
                attributes: ['nombre'],
                where: {
                    codigo: planes[i].idplan
                }
            });
            planesJSON[i].nombre = nombrePlan.nombre;
        }
        return planesJSON;
    } catch (error) {
        throw error;
    }
}

/* const getPlanCurso = async function (dni) {
    try {
        let planCurso = await modelsEvaluacionCurricular.linea_acta.findAll({
            attributes: ['idplan', 'curso_academico'],
            where: {
                dni: dni
            },
            order: [['curso_academico', 'DESC']],
        });
        var planCursoString = JSON.stringify(planCurso);
        var planCursoJSON = JSON.parse(planCursoString);
        let nombrePlan = await getNombrePlan(planCursoJSON[0]['idplan']);
        planCursoJSON[0].nombre = nombrePlan.nombre;
        return planCursoJSON[0];
    } catch (error) {
        throw error;
    }
} */



/* exports.getDni = async function (req, res) {
    try {
        var email = req.session.user.mail;
        respuesta = await getDni(email);
        dni = respuesta['dni'];
    } catch (error) {
        console.log(error)
    }
}
exports.getInfoAlumno = async function (email) {
    try {
        respuesta = await getInfoAlumno(email);
        respuesta = JSON.stringify(respuesta, null, 2);
        console.log("Información del alumno: ", respuesta);
    } catch (error) {
        console.log(error)
    }
} */


// PAS

// Obtiene toda la información personal del alumno dado su email
const getInfoAlumno = async function (email) {
    try {
        let info = await modelsEvaluacionCurricular.persona.findOne({
            where: {
                email: email
            }
        });
        return info;
    } catch (error) {
        throw error;
    }
}
// obtiene fecha de inicio de los estudios en dicho plan
const getInicioEstudios = async function (dni, idplan) {
    //de bbdd viendo la primera acta o preguntar si otra api 
}

// obtiene numero de veces que esa asignatura ha sido suspendida en el curso actual y en el anterior
const getVecesSuspensa = async function (dni, asignatura) {
    //cuenta lo obtenido de getinfoconvocatorias
}

// obtiene notas y fechas de antiguas convocatorias presentadas de dicha asignatura
const getInfoConvocatorias = async function (dni, asignaturaCodigo) {
    try {
        let info = await modelsEvaluacionCurricular.linea_acta.findAll({
            attributes: ['curso_academico', 'convocatoria', 'calificacion_num'],
            where: {
                dni: dni,
                asignatura: asignaturaCodigo
            }
        });
        var infoString = JSON.stringify(info);
        var infoJSON = JSON.parse(infoString);
        for (var i = 0; i < infoJSON.length; i++) {
            if (infoJSON[i].calificacion_num == null) {
                infoJSON[i].calificacion_num = "NP";
            }
        }
        return infoJSON;
    } catch (error) {
        throw error;
    }
}

// Obtiene informacion sobre el TFT de ese alumno
const getInfoTFT = async function (dni) {

}

// Obtiene media para cada tipo de evaluacion curricular
const getMedia = async function (dni) {

}

//Obtiene nombre de asignatura
const getNombreAsignatura = async function (asignaturaCodigo) {
    try {
        let nombreAsignatura = await modelsEvaluacionCurricular.asignatura.findOne({
            attributes: ['nombre'],
            where: {
                codigo: asignaturaCodigo
            }
        });
        return nombreAsignatura.nombre;
    } catch (error) {
        throw error;
    }
}

//Obtiene asignaturas de los planes obtenidos
const getCodigosAsignaturas = async function (planes) {
    try {
        var codigosAsignaturas = [];
        // Obtiene nombre de las asignaturas suspensas 
        for (var i = 0; i < planes.length; i++) {
            let codigo = await modelsEvaluacionCurricular.asignatura_plan.findAll({
                attributes: ['asignatura'],
                where: {
                    idplan: planes[i].id,
                },
            });
            for (var j = 0; j < codigo.length; j++) {
                codigosAsignaturas.push(codigo[j]);
            }
        }
        return codigosAsignaturas;
    } catch (error) {
        throw error;
    }
}
//Obtiene nombre de plan
const getNombrePlan = async function (planCodigo) {
    try {
        let nombrePlan = await modelsEvaluacionCurricular.plan_estudio.findOne({
            attributes: ['nombre'],
            where: {
                codigo: planCodigo
            }
        });
        return nombrePlan.nombre;
    } catch (error) {
        throw error;
    }
}

const sortJSON = async function(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

exports.getNombreAsignatura = async function (asignaturaCodigo) {
    try {
        let respuesta;
        respuesta = await getNombreAsignatura(asignaturaCodigo);
        return respuesta;
    } catch (error) {
        console.log(error);
    }
}

exports.getAsignaturasDePlan = async function (plans) {
    try {
        let respuesta = [];
        respuesta = await getCodigosAsignaturas(plans);
        var respuestaString = JSON.stringify(respuesta);
        var respuestaJSON = JSON.parse(respuestaString);
        for (var i = 0; i < respuesta.length; i++) {
            let n = await getNombreAsignatura(respuestaJSON[i].asignatura);
            respuestaJSON[i].nombre = n;

        }
        var sorted = sortJSON(respuestaJSON, 'nombre','asc');
        return sorted;
    } catch (error) {
        console.log(error);
    }
}


exports.getDatosFormularioTitulacion = async function (req, res) {
    try {
        let respuesta = {};
        respuesta.nombre = req.session.user.cn;
        respuesta.apellidos = req.session.user.sn;
        email = req.session.user.mail;
        respuesta.email = email;
        dniArray = await getDni(email);
        respuesta.dni = dniArray['dni'];
        respuesta.planes = await getPlanesEstudios(dniArray['dni']);
        respuesta.asignaturas = await getAsignaturasSuspensas(dniArray['dni']);
        respuesta.cursoActual = cursoActual;
        res.json(respuesta)
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }
}

exports.getDatosFormularioCurso = async function (req, res) {
    try {
        let respuesta = {};
        respuesta.nombre = req.session.user.cn;
        respuesta.apellidos = req.session.user.sn;
        email = req.session.user.mail;
        respuesta.email = email;
        dniArray = await getDni(email);
        respuesta.dni = dniArray['dni'];
        respuesta.planes = await getPlanesEstudios(dniArray['dni']);
        respuesta.asignaturas = await getAsignaturasSuspensas(dniArray['dni'], "2018-19");
        respuesta.cursoActual = cursoActual;
        res.json(respuesta)
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }
}

exports.getInfoConvocatorias = async function (req, res) {
    try {
        let email = req.session.user.mail;
        let dni = await getDni(email);
        let asignaturaCodigo = req.query.asignatura;
        let planCodigo = req.query.plan;
        let planNombre = await getNombrePlan(planCodigo);
        let asignaturaNombre = await getNombreAsignatura(asignaturaCodigo);
        info = await getInfoConvocatorias(dni['dni'], asignaturaCodigo);
        res.render("confirmacion", {
            title: 'Express',
            asignatura: [asignaturaCodigo, asignaturaNombre],
            dni: dni['dni'],
            info: info,
            plan: [planCodigo, planNombre],
        });
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }
}
