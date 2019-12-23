let express = require('express');
let router = express.Router();
const enums = require('../enums');
let permisoController = require('../controllers/permiso_controller');
const routerGestionTitulos = require('./gestion-titulos/routerPas');

router.all('*', permisoController.comprobarRolYPas);

router.use(`/${enums.tramites.gestionTitulos}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionTitulos;
    next();
}, routerGestionTitulos);


module.exports = router;