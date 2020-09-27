let express = require('express');
let router = express.Router();
const enums = require('../enums');
let permisoController = require('../controllers/permiso_controller');
const routerGestionTitulos = require('./gestion-titulos/routerPas');
//const routerGestionCertificados = require('./gestion-certificados/routerPas');
//const routerEvaluacionCurricular = require('./evaluacion-curricular/routerPas');

router.get(`/`, async function (req, res, next) {
    req.session.tramite = null;
    let permisos = await permisoController.getAllPermisos();
    let emailUser = req.session.user.mailPrincipal;
    if (permisos.length === 0) { // vacio, crea permiso admin
        req.params.email = res.locals.admin;
        req.params.tramite = 'admin';
        req.session.permisos = await permisoController.crearPermiso(req, res, next);
    }
    res.render("pagina-principal", {
        barraInicioText: "LISTA DE TRÁMITES DISPONIBLES ONLINE",
        tramites: enums.tramites
    })
});

router.get('/permisos', async function (req, res, next) {
    var queryString = req.originalUrl;
    var queryString = queryString.split("?")[1];
    var accion, email, tramite;
    if (queryString) {
        var queryString = queryString.replace("%40", "@");
        const urlParams = new URLSearchParams(queryString);
        accion = urlParams.get('accion');
        email = urlParams.get('email');
        tramite = urlParams.get('tramite');
    }
    if (accion == 'crear') {
        req.params.email = email;
        req.params.tramite = tramite;
        req.session.permisos = await permisoController.crearPermiso(req, res, next);
    } else if (accion == 'eliminar') {
        req.params.email = email;
        req.params.tramite = tramite;
        req.session.permisos = await permisoController.eliminarPermiso(req, res, next);
    } else {
        let permisos = await permisoController.getAllPermisos();
        let emailUser = req.session.user.mailPrincipal;
        req.session.permisos = permisos;
        let tienePermiso = false;
        for (var i = 0; i < permisos.length; i++) {
            if (emailUser === permisos[i].email) {
                tienePermiso = true;
                break;
            }
        }
        if (tienePermiso) {
            res.render("permisos", {
                barraInicioText: "GESTOR DE PERMISOS",
                tramites: enums.tramites
            })
        } else {
            res.render("noPermiso", {
                barraInicioText: "GESTOR DE PERMISOS"
            })
        }
    }
});

router.use(`/${enums.tramites.gestionTitulos[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionTitulos[0];
    next();
}, routerGestionTitulos);
/*
router.use(`/${enums.tramites.gestionCertificados[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionCertificados[0];
    next();
}, routerGestionCertificados);

router.use(`/${enums.tramites.evaluacionCurricular[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.evaluacionCurricular[0];
    next();
}, routerEvaluacionCurricular);
*/
module.exports = router;