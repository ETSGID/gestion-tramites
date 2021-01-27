let express = require('express');
let router = express.Router();
const enums = require('../enums');
let permisoController = require('../controllers/permiso_controller');
const routerGestionTitulos = require('./gestion-titulos/routerPas');
const routerGestionCertificados = require('./gestion-certificados/routerPas');
const routerEvaluacionCurricular = require('./evaluacion-curricular/routerPas');
const admin = process.env.EMAIL_ADMIN || 'secretario.etsit@upm.es';

router.get(`/`, async function (req, res, next) {
    req.session.tramite = null;
    // let permisos = await permisoController.getAllPermisos();
    // if (permisos.length === 0) { // vacio, crea permiso admin
    //     req.body.email_1 = admin;
    //     req.body.tramite = 'admin';
    //     await permisoController.crearPermiso(req, res, next);
    // }
    res.render("pagina-principal", {
        barraInicioText: "LISTA DE TRÁMITES DISPONIBLES ONLINE",
        tramites: enums.tramites
    })
});

router.post('/updateAdmin', async function (req, res, next) {
    let admin = await permisoController.updateAdmin(req, res, next);
    res.render("permisos", {
        barraInicioText: "GESTOR DE PERMISOS",
        tramites: enums.tramites,
        showConfirmacion: true,
        mensaje: 'El administrador ha sido actualizado correctamente.',
        admin: admin
    });
});

router.post('/createPermiso', async function (req, res, next) {
    let success = false;
    success = await permisoController.crearPermiso(req, res, next);
    let mensaje = success ? "El permiso se ha creado correctamente." : "El permiso que intenta crear ya existe."
    let admin = await permisoController.getAdmin(req, res, next);
    res.render("permisos", {
        barraInicioText: "GESTOR DE PERMISOS",
        tramites: enums.tramites,
        showConfirmacion: true,
        mensaje: mensaje,
        admin: admin
    });
});

router.post('/deletePermiso', async function (req, res, next) {
    await permisoController.eliminarPermiso(req, res, next);
    let admin = await permisoController.getAdmin(req, res, next);
    res.render("permisos", {
        barraInicioText: "GESTOR DE PERMISOS",
        tramites: enums.tramites,
        showConfirmacion: true,
        mensaje: "El permiso se ha eliminado correctamente.",
        admin: admin
    });
});

router.get('/permisos', async function (req, res, next) {
    let permisos = await permisoController.getAllPermisos();
    let emailUser = req.session.user.mailPrincipal;
    req.session.permisos = permisos;
    let tienePermiso = false;
    let admin = await permisoController.getAdmin(req, res, next);
    if (emailUser === admin) {
        tienePermiso = true;
    } else {
        for (var i = 0; i < permisos.length; i++) {
            if (emailUser === permisos[i].email) {
                tienePermiso = true;
                break;
            }
        }
    }
    if (tienePermiso) {

        res.render("permisos", {
            barraInicioText: "GESTOR DE PERMISOS",
            tramites: enums.tramites,
            showConfirmacion: false,
            mensaje: '',
            admin: admin
        })
    } else {
        res.render("noPermiso", {
            barraInicioText: "GESTOR DE PERMISOS"
        })
    }
});

router.use(`/${enums.tramites.gestionTitulos[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionTitulos[0];
    next();
}, routerGestionTitulos);

router.use(`/${enums.tramites.gestionCertificados[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionCertificados[0];
    next();
}, routerGestionCertificados);

router.use(`/${enums.tramites.evaluacionCurricular[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.evaluacionCurricular[0];
    next();
}, routerEvaluacionCurricular);

module.exports = router;
