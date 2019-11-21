let express = require('express');
let router = express.Router();
let peticionController = require('../controllers/peticion_controller');
let permisoController = require('../controllers/permiso_controller');

//Se comprueba que sea PAS
router.all('*', permisoController.comprobarRolYPas);

router.get('/peticiones', peticionController.getInfoAllPas)

router.post('/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)

module.exports = router;