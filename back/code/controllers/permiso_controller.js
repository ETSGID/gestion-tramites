//comprobamos que solo pueden acceder profesores y alumnos.
exports.comprobarRolYPas = function (req, res, next) {
    let role = req.session.user.employeetype;
    if (role && typeof role === "string" && (role.includes("F") || role.includes("L"))) {
        if ((process.env.PRUEBAS == 'true' || process.env.DEV == 'true') || 
            req.session.user.mail === "elena.garcia.leal@upm.es" || req.session.user.mail === "andres.cosano@upm.es"){
            req.session.portal = 'pas'
            next();
        }else{
            res.render('noPermitido'); 
        }
    }
    else {
        res.render('noPermitido');
    } 
};

exports.comprobarRolYAlumno = function (req,res,next){
    let role = req.session.user.employeetype;
    if (role && typeof role === "string" && (role.includes("A") || role.includes("E") || role.includes("I")|| role.includes("N"))) {
        req.session.portal = 'estudiantes'
        next();
    } else {
        res.render('noPermitido');
    }
}