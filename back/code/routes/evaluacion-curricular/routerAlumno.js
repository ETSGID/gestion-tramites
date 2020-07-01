let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/evaluacion-curricular/peticion_controller');
let queriesController = require('../../controllers/evaluacion-curricular/queries_controller');

router.get('/', function (req, res) {
  res.locals.barraInicioText = "SOLICITUD DE EVALUACIÓN CURRICULAR"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAllAlumno)
router.post('/api/peticionCambioEstado',peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)
router.get('/api/asignaturas/titulacion',queriesController.getDatosFormularioTitulacion)
router.get('/api/asignaturas/curso',queriesController.getDatosFormularioCurso)

module.exports = router;