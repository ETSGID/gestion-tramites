// Definicion del modelo PeticionTitulo:

module.exports = function (sequelize, DataTypes) {
    let PeticionTitulo = sequelize.define('PeticionTitulo',
        {
            edupersonuniqueid: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            planCodigo: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            irispersonaluniqueid: {
                type: DataTypes.STRING
            },
            planNombre: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nombre: {
                type: DataTypes.STRING
            },
            apellido: {
                type: DataTypes.STRING
            },
            descuento: {
                type: DataTypes.INTEGER
            },
            formaPago: {
                type: DataTypes.INTEGER
            },
            estadoPeticion: {
                type: DataTypes.INTEGER
            },
            fecha: {
                type: DataTypes.DATEONLY
            },
            //si no lo recoge el titular
            receptor: {
                type: DataTypes.TEXT
            },
            localizacionFisica: {
                type: DataTypes.STRING
            },
            textCancel: {
                type: DataTypes.TEXT
            }

        },
        {
            timestamps: false
        });
    return PeticionTitulo;
};
