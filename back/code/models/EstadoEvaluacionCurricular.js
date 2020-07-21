// Definicion del modelo Permiso:

module.exports = function (sequelize, DataTypes) {
    let Permiso = sequelize.define('EstadoEvaluacionCurricular',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            estadoCurso: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'DESACTIVADO' 
            },
            estadoTitulacion: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'DESACTIVADO' 
            }
        },
        {
            timestamps: false
        });
    return Permiso;
};
