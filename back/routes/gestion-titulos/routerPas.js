let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/gestion-titulos/peticion_controller');
let permisoController = require('../../controllers/gestion-titulos/permiso_controller');

//Comprobaciones adicionales propia del trámite
router.all('*', permisoController.comprobarRolYPas);

router.get('/', function (req, res) {
  res.locals.barraInicioText = "GESTIÓN DE TÍTULOS"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAllPas)

router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updatePeticionFromPas)

module.exports = router;