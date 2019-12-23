let express = require('express');
let router = express.Router();
const enums = require('../enums');
let permisoController = require('../controllers/permiso_controller');
const routerGestionTitulos = require('./gestion-titulos/routerAlumno');

router.all('*', permisoController.comprobarRolYAlumno);

router.use(`/${enums.tramites.gestionTitulos}`, function(req,res,next){
    req.session.tramite = enums.tramites.gestionTitulos;
    next();
}, routerGestionTitulos);


module.exports = router;