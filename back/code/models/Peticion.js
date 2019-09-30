// Definicion del modelo Peticion:

module.exports = function (sequelize, DataTypes) {
    let Peticion = sequelize.define('Peticion',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            dni: {
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
            planCodigo: {
                type: DataTypes.STRING
            },
            estadoPeticion: {
                type : DataTypes.INTEGER
            },
            fecha: {
                type: DataTypes.DATEONLY
            },
            comentario: {
                type: DataTypes.TEXT
            }
        },
        {
            timestamps: false
        });
    return Peticion;
};
