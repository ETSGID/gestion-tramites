let express = require('express');
let router = express.Router();
const enums = require('../enums');
let permisoController = require('../controllers/permiso_controller');
const routerGestionTitulos = require('./gestion-titulos/routerPas');
const routerGestionCertificados = require('./gestion-certificados/routerPas');

router.all('*', permisoController.comprobarRolYPas);

router.get(`/`, function(req,res,next){
    req.session.tramite = null;
    res.render("pagina-principal",{
        barraInicioText: "LISTA DE TRÁMITES DISPONIBLES ONLINE",
        tramites: enums.tramites
    })


});

router.use(`/${enums.tramites.gestionTitulos[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionTitulos[0];
    next();
}, routerGestionTitulos);

router.use(`/${enums.tramites.gestionCertificados[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionCertificados[0];
    next();
}, routerGestionCertificados);

module.exports = router;