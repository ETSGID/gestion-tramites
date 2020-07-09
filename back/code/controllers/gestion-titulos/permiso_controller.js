//permisos específicos de la app
exports.comprobarRolYPas = function (req, res, next) {
    if ((process.env.PRUEBAS == 'true' || process.env.DEV == 'true') ||
        req.session.user.mailPrincipal === "elena.garcia.leal@upm.es" || req.session.user.mailPrincipal === "andres.cosano@upm.es" ||
        req.session.user.mailPrincipal === "mariaantonia.barquero@upm.es" || req.session.user.mailPrincipal === "cristina.perezdeazpillaga@upm.es" ||
        req.session.user.mailPrincipal === "pilar.horcajada@upm.es" || req.session.user.mailPrincipal === "esther.fuentes@upm.es" ||
        req.session.user.mailPrincipal === "mercedes.obispo@upm.es" || req.session.user.mailPrincipal === "isabel.poza@upm.es") {
        next();
    } else {
        res.render('noPermitido');
    }
};