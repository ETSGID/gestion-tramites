//permisos específicos de la app
exports.comprobarRolYPas = function (req, res, next) {
    if ((process.env.PRUEBAS == 'true' || process.env.DEV == 'true') ||
        req.session.user.mailPrincipal === "elena.garcia.leal@upm.es" || req.session.user.mailPrincipal === "andres.cosano@upm.es") {
        next();
    } else {
        res.render('noPermitido');
    }
};