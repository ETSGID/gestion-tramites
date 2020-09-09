let express = require('express');
let router = express.Router();
let peticionController = require('../../controllers/gestion-titulos/peticion_controller');

//TODO quitar updateDatabase cuando ya se haya actualizado la base de datos
router.get('/', peticionController.updateDatabase, function (req, res) {
  res.locals.barraInicioText = "SOLICITUD DE TÍTULOS"
  res.render('index');
});

router.get('/api/peticiones', peticionController.getInfoAlumno)

router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticionFromAlumno)

module.exports = router;