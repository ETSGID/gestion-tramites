let express = require('express');
let router = express.Router();
// let peticionController = require('../../controllers/evaluacion-curricular/peticion_controller');
// let permisoController = require('../../controllers/evaluacion-curricular/permiso_controller');
//let queriesController = require('../../controllers/evaluacion-curricular/queries_controller');

//Comprobaciones adicionales propia del trámite
//router.all('*', permisoController.comprobarRolYPas);

router.get('/', function (req, res) {
  res.locals.barraInicioText = "GESTIÓN DE EVALUACIÓN CURRICULAR"
  res.render('gestion_evaluacion_curricular');
});

// router.get('/api/peticiones', peticionController.getInfoAllPas)

// router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)


/* router.get('/porCurso', function (req, res) {
  //res.locals.tipo = "curso";
  queriesController.getDatosFormularioCurso(req, res);
}); */

module.exports = router;