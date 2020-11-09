let models = require('../models');
const enums = require('../enums');

exports.getAllPermisos = async function (req, res, next) {
    try {
        let permisos = await models.Permiso.findAll();
        return permisos;
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.getPermisosTramite = async function (req, res, next) {
    try {
        let respuesta = {};
        let email = req.session.user.mailPrincipal;
        let tramite = req.session.tramite;
        respuesta.emailUser = email;
        let permisos = await models.Permiso.findAll({
            where: {
                tramite: tramite
            }
        });
        respuesta.permisos = permisos;
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.crearPermiso = async function (req, res, next) {
    try {
        let permiso = await models.Permiso.findOne({
            where: {
                email: req.params.email,
                tramite: req.params.tramite
            }
        });
        if (!permiso) {
            let permiso = await models.Permiso.create({
                email: req.params.email,
                tramite: req.params.tramite
            });
            if (req.params.tramite === 'admin') {
                return permiso;
            } else {
                res.render("confirmacionPermiso", {
                    barraInicioText: "GESTOR DE PERMISOS",
                    mensaje: 'El permiso indicado se ha creado correctamente.'
                });
            }
        } else {
            res.render("confirmacionPermiso", {
                barraInicioText: "GESTOR DE PERMISOS",
                mensaje: 'El permiso que intenta crear ya existe.'
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.eliminarPermiso = async function (req, res, next) {
    try {
        let permiso = await models.Permiso.destroy({
            where: {
                email: req.params.email,
                tramite: req.params.tramite
            }
        });
        if (permiso) {
            res.render("confirmacionPermiso", {
                barraInicioText: "GESTOR DE PERMISOS",
                mensaje: 'El permiso indicado se ha eliminado correctamente.'
            });
        } else {
            res.render("confirmacionPermiso", {
                barraInicioText: "GESTOR DE PERMISOS",
                mensaje: 'El permiso que intenta eliminar no existe.'
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.updateAdmin = async function (req, res, next) {
    try {
        let permiso = await models.Permiso.update({
            email: req.body.email
        },
            {
                where: {
                    tramite: 'admin'
                },
                returning: true,
            });
        res.render("confirmacionPermiso", {
            barraInicioText: "GESTOR DE PERMISOS",
            mensaje: 'El email del administrador se ha actualizado correctamente.'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
