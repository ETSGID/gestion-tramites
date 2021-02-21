// Definicion del modelo Peticion:

module.exports = function (sequelize, DataTypes) {
    let PeticionEvaluacionCurricular = sequelize.define('PeticionEvaluacionCurricular',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            dni: {
                type: DataTypes.STRING,
                allowNull: false
            },
            edupersonuniqueid: {
                type: DataTypes.STRING,
                allowNull: false
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
            estadoPeticion: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            fecha: {
                type: DataTypes.DATEONLY
            },
            textCancel: {
                type: DataTypes.TEXT
            },
            asignaturaNombre: {
                type: DataTypes.STRING
            },
            asignaturaCodigo: {
                type: DataTypes.STRING,
            },
            tipo: {
                type: DataTypes.STRING
            },
            justificacion: {
                type: DataTypes.TEXT
            },
            mostrar:{
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            timestamps: false
        });
    return PeticionEvaluacionCurricular;
};
