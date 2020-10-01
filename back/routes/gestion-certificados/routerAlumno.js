let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/gestion-certificados/peticion_controller');
let planController = require('../../controllers/plan_controller');

router.get('/', function (req, res) {
  res.locals.barraInicioText = "SOLICITUD DE CERTIFICADOS ACADÉMICOS"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAlumno)
router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)

module.exports = router;