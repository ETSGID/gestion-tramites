let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/evaluacion-curricular/peticion_controller');
let planController = require('../../controllers/plan_controller');

router.get('/', function (req, res) {
  res.locals.barraInicioText = "SOLICITUD DE EVALUACIÓN CURRICULAR"
  res.render('index');
});

router.get('/api/:plan/asingaturas', peticionController.getAsignaturasPlan)
router.get('/api/peticiones', peticionController.getInfoAllAlumno)
router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)
router.get('/api/estadoTramite', peticionController.getEstadoTramite)

module.exports = router;