// Definicion del modelo PeticionCertificado:

module.exports = function (sequelize, DataTypes) {
    let PeticionCertificado = sequelize.define('PeticionCertificado',
        {
            edupersonuniqueid: {
                type: DataTypes.STRING,
                primaryKey : true
            },
            planCodigo: {
                type: DataTypes.STRING,
                primaryKey: true
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
            tipoCertificado:{
                type: DataTypes.STRING,
                primaryKey: true
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
            textCancel:{
                type: DataTypes.TEXT
            }
            
        },
        {
            timestamps: false
        });
    return PeticionCertificado;
};
