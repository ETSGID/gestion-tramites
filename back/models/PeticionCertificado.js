// Definicion del modelo PeticionCertificado:

module.exports = function (sequelize, DataTypes) {
    let PeticionCertificado = sequelize.define('PeticionCertificado',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement: true
            },
            edupersonuniqueid: {
                type: DataTypes.STRING
            },
            planCodigo: {
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
            tipoCertificado:{
                type: DataTypes.INTEGER
            },
            nombreCertificadoOtro:{
                type: DataTypes.STRING
            },
            descripcion: {
                type: DataTypes.TEXT
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
