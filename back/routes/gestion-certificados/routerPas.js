let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/gestion-certificados/peticion_controller');
let permisoController = require('../../controllers/gestion-certificados/permiso_controller');

//Comprobaciones adicionales propia del trámite
router.all('*', permisoController.comprobarRolYPas);

router.get('/', function (req, res) {
  res.locals.barraInicioText = "GESTIÓN DE CERTIFICADOS ACADÉMICOS"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAllPas)

router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)

module.exports = router;