let express = require('express');
let router = express.Router();
let peticionController = require('../controllers/peticion_controller');
let permisoController = require('../controllers/permiso_controller');

//Se comprueba que sea alumno
router.all('*', permisoController.comprobarRolYAlumno);

router.get('/peticiones', peticionController.getInfoAlumno)

router.post('/crearPeticion', peticionController.createPeticion)

module.exports = router;