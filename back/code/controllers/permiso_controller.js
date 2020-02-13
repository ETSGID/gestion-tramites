//comprobamos que solo pueden acceder profesores y alumnos.


exports.comprobarRolYPas = function (req, res, next) {
    if(req.session.user.employeetype && typeof req.session.user.employeetype === "string" ){
        req.session.user.employeetype = req.session.user.employeetype.split("")
    }
    let role = req.session.user.employeetype;
    if (role && Array.isArray(role) && (role.includes("F") || role.includes("L")
        || process.env.PRUEBAS == 'true' || process.env.DEV == 'true')) {
        req.session.portal = 'pas'
        next();
    }
    else {
        res.render('noPermitido');
    }
};

exports.comprobarRolYAlumno = function (req, res, next) {
    if(req.session.user.employeetype && typeof req.session.user.employeetype === "string" ){
        req.session.user.employeetype = req.session.user.employeetype.split("")
    }
    let role = req.session.user.employeetype;
    if (role && Array.isArray(role)
        && (role.includes("A") || role.includes("E") ||
            role.includes("I") || role.includes("N") || process.env.PRUEBAS == 'true' || process.env.DEV == 'true')) {
        req.session.portal = 'estudiantes'
        next();
    } else {
        res.render('noPermitido');
    }
}