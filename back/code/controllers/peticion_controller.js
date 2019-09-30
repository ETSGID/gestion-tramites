let models = require('../models');
let mail = require('./mail')
const estadosTitulo = require('../enums').estadosTitulo

//devuelve todas las peticiones de un alumno
getAllPeticionAlumno = async function (email) {
    try{
        let peticiones = await models.Peticion.findAll({
            where: {
                email: email
            }
        });
        return peticiones
    }catch(error){
        //se propaga el error, se captura en el middleware
        throw error;
    }
    
}

exports.getAllPeticionAlumno = getAllPeticionAlumno 


//devuelve toda las peticiones de todos los alumnos
getAllPeticionPas = async function () {
    try{
        let peticiones = await models.Peticion.findAll();
        return peticiones
    }catch(error){
        //se propaga el error, se captura en el middleware
        throw error;
    }
}
exports.getAllPeticionPas = getAllPeticionPas;

//devuelve toda la info del alumno que se acaba de conectar
exports.getInfoAlumno = async function (req, res, next) {
    try {
        let peticiones = await getAllPeticionAlumno(req.session.user.mail)
        //lamada api
        let ejemplo = ["09TT","09AQ"]
        ejemplo.forEach( plan => {
            !peticiones.find(p => p.planCodigo === plan) ? peticiones.push({planCodigo:plan, estadoPeticion:estadosTitulo.NOPEDIDO}) : null
        })
        res.json(peticiones)
    }catch(error){
        console.log(error)
        res.json({error:error.message});
    }
    
}

//devuelve todas peticiones de los alumnos
exports.getInfoAllPas = async function (req, res, next) {
    try {
        respuesta = await getAllPeticionPas()
        res.json(respuesta)
    }catch(error){
        console.log(error)
        res.status(500).json({error:error.message});
    }
}

//create peticion
exports.createPeticion = async function (req, res, next){
    try{
        let mailInfo = await mail.sendEmail(estadosTitulo.PEDIDO, "javier.conde.diaz@alumnos.upm.es", "javier.conde.diaz@alumnos.upm.es")
        let peticion = await models.Peticion.create({ 
            dni: req.session.user.irispersonaluniqueid, 
            email: req.session.user.mail,
            nombre: req.session.user.cn,
            apellido: req.session.user.sn, 
            planCodigo: req.body.peticion.planCodigo, 
            estadoPeticion: estadosTitulo.PEDIDO, 
            fecha:new Date() 
        })
        res.json(peticion)
    }
    catch(error){
        console.log(error)
        res.status(500).json({error:error.message});
    }
}

//update estado peticion
exports.updatePeticion = async function (req, res, next) {
    try {
        let estadoNuevo = ++ req.body.peticion.estadoPeticion
        let mailInfo = await mail.sendEmail(estadoNuevo, "javier.conde.diaz@alumnos.upm.es", "javier.conde.diaz@alumnos.upm.es")
        let respuesta = await models.Peticion.update({
            estadoPeticion: estadoNuevo,
          }, {
            where: {
              id: req.body.peticion.id
            },
            returning: true,
          });
        res.json(respuesta)
    }catch(error){
        console.log(error)
        res.status(500).json({error:error.message});
    }
}





