// Definicion del modelo Peticion_Certificado:

module.exports = function (sequelize, DataTypes) {
    let Peticion_Certificado = sequelize.define('Peticion_Certificado',
        {
            eduPersonUniqueId: {
                type: DataTypes.STRING,
                primaryKey : true
            },
            planCodigo: {
                type: DataTypes.STRING,
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
            textCancel:{
                type: DataTypes.TEXT
            }
            
        },
        {
            timestamps: false
        });
    return Peticion_Certificado;
};
