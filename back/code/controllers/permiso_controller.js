//comprobamos que solo pueden acceder profesores y alumnos.
exports.comprobarRolYPas = function (req, res, next) {
    let role = req.session.user.employeetype;
    if (role && typeof role === "string" && (role.includes("F") || role.includes("L"))) {
        req.session.portal = 'pas'
        next();
    }else if(req.session.user.mail === "javier.conde.diaz@alumnos.upm.es"){
        req.session.portal='pas' 
        next()
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