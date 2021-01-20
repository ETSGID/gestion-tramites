let models = require('../models');
const enums = require('../enums');
let Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAllPermisos = async function (req, res, next) {
    try {
        let permisos = await models.Permiso.findAll({
            where: {
                tramite: {[Op.not]: 'admin'}
            },
            order: [
                ['email', 'ASC']
            ]
        }
        );
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
                email: req.body.email_1,
                tramite: req.body.tramite
            }
        });
        if (!permiso) {
            let permiso = await models.Permiso.create({
                email: req.body.email_1,
                tramite: req.body.tramite
            });
            return true;
        } else {
            return false;
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
                email: req.body.email,
                tramite: req.body.tramite
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.updateAdmin = async function (req, res, next) {
    try {
        let permiso = await models.Permiso.update({
            email: req.body.email_2
        },
            {
                where: {
                    tramite: 'admin'
                },
                returning: true,
            });
        return permiso.email;
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.getAdmin = async function (req, res, next) {
    try {
        let permiso = await models.Permiso.findOne({
            where: {
                tramite: 'admin'
            }
        });
        return permiso.email;
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
