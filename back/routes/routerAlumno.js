let express = require('express');
let router = express.Router();
const enums = require('../enums');
let permisoController = require('../controllers/permiso_controller');
const routerGestionTitulos = require('./gestion-titulos/routerAlumno');
<<<<<<< HEAD
//const routerGestionCertificados = require('./gestion-certificados/routerAlumno');
//const routerEvaluacionCurricular = require('./evaluacion-curricular/routerAlumno');
=======
const routerGestionCertificados = require('./gestion-certificados/routerAlumno');
>>>>>>> gestion-certificados
const peticionTituloController = require('../controllers/gestion-titulos/peticion_controller');


//TODO quitar updateDatabase cuando ya se haya actualizado la base de datos
router.get(`/`, peticionTituloController.updateDatabase,
    function (req, res, next) {
        req.session.tramite = null;
        res.render("pagina-principal", {
            barraInicioText: "LISTA DE TRÁMITES DISPONIBLES ONLINE",
            tramites: enums.tramites
        })
    });


router.use(`/${enums.tramites.gestionTitulos[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionTitulos[0];
    next();
}, routerGestionTitulos);

/*
router.use(`/${enums.tramites.gestionCertificados[0]}`, function(req,res,next){
    req.session.tramite = enums.tramites.gestionCertificados[0];
    next();
}, routerGestionCertificados);


<<<<<<< HEAD
router.use(`/${enums.tramites.evaluacionCurricular[0]}`, function(req,res,next){
    req.session.tramite = enums.tramites.evaluacionCurricular[0];
    next();
}, routerEvaluacionCurricular);
*/



=======
>>>>>>> gestion-certificados
module.exports = router;