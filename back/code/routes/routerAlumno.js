let express = require('express');
let router = express.Router();
let peticionController = require('../controllers/peticion_controller');
let permisoController = require('../controllers/permiso_controller');

//Se comprueba que sea alumno
router.all('*', permisoController.comprobarRolYAlumno);
//router.all('*', peticionController.getInfoAlumno);
router.get('/', function (req, res) {
    res.render('index');
  });

module.exports = router;