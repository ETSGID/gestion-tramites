let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/evaluacion-curricular/peticion_controller');
let permisoController = require('../../controllers/permiso_controller');
let queriesController = require('../../controllers/evaluacion-curricular/queries_controller');

router.get('/', function (req, res) {
  res.locals.barraInicioText = "GESTIÓN DE EVALUACIÓN CURRICULAR"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAllPas)
router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)
router.get('/api/estadoTramite', peticionController.getEstadoTramite)
router.post('/api/updateEstadoTramite', peticionController.configureMultiPartFormData, peticionController.updateEstadoTramite)
router.get('/api/permisos', permisoController.getPermisosTramite)

module.exports = router;