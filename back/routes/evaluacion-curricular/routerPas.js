let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/evaluacion-curricular/peticion_controller');
let permisoController = require('../../controllers/permiso_controller');

router.get('/', function (req, res) {
  res.locals.barraInicioText = "GESTIÓN DE EVALUACIÓN CURRICULAR"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAllPas)
router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)
router.get('/api/estadoTramite', peticionController.getEstadoTramite)
router.post('/api/updateEstadoTramite', peticionController.configureMultiPartFormData, peticionController.updateEstadoTramite)
router.get('/api/permisos', permisoController.getPermisosTramite)
router.post('/api/datosAlumno', peticionController.configureMultiPartFormData, peticionController.getDatosAlumno)
router.get('/api/informes', peticionController.getInformes)
router.get('/api/historico', peticionController.getHistorico)
router.delete('/api/delete',peticionController.deletePeticiones);
router.get('/api/recuperar',peticionController.recuperarPeticiones)
module.exports = router;