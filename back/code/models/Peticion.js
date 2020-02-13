// Definicion del modelo Peticion:

module.exports = function (sequelize, DataTypes) {
    let Peticion = sequelize.define('Peticion',
        {
            irispersonaluniqueid: {
                type: DataTypes.STRING,
                primaryKey : true
            },
            planCodigo: {
                type: DataTypes.STRING,
                primaryKey : true
            },
            planNombre: {
                type: DataTypes.STRING,
                primaryKey: true,
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
            descuento:{
                type : DataTypes.INTEGER
            },
            formaPago:{
                type : DataTypes.INTEGER
            },
            estadoPeticion: {
                type : DataTypes.INTEGER
            },
            fecha: {
                type: DataTypes.DATEONLY
            },
            //si no lo recoge el titular
            receptor: {
                type: DataTypes.TEXT
            },
            localizacionFisica:{
                type: DataTypes.STRING 
            },
            textCancel:{
                type: DataTypes.TEXT
            }
            
        },
        {
            timestamps: false
        });
    return Peticion;
};
