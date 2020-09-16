let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/gestion-certificados/peticion_controller');
let permisoController = require('../../controllers/permiso_controller');

router.get('/', function (req, res) {
  res.locals.barraInicioText = "GESTIÓN DE CERTIFICADOS ACADÉMICOS"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAllPas)

router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)
router.get('/api/permisos', permisoController.getPermisosTramite)

module.exports = router;