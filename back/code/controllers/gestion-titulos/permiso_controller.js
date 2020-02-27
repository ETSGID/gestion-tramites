//permisos específicos de la app
exports.comprobarRolYPas = function (req, res, next) {
    if ((process.env.PRUEBAS == 'true' || process.env.DEV == 'true') ||
        req.session.user.mail === "elena.garcia.leal@upm.es" || req.session.user.mail === "andres.cosano@upm.es" ||
        req.session.user.mail === "mariaantonia.barquero@upm.es" || req.session.user.mail === "cristina.perezdeazpillaga@upm.es" ||
        req.session.user.mail === "pilar.horcajada@upm.es" || req.session.user.mail === "esther.fuentes@upm.es" ||
        req.session.user.mail === "mercedes.obispo@upm.es" || req.session.user.mail === "isabel.poza@upm.es") {
        next();
    } else {
        res.render('noPermitido');
    }
};