// Definicion del modelo Historico:

module.exports = function (sequelize, DataTypes) {
    let HistoricoEvaluacionCurricular = sequelize.define('HistoricoEvaluacionCurricular',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            edupersonuniqueid: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dni: {
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
                type: DataTypes.STRING,
            },
            planNombre: {
                type: DataTypes.STRING
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
            fechaTribunal: {
                type: DataTypes.DATEONLY
            },
            resolucion: {
                type: DataTypes.INTEGER
            }
        },
        {
            timestamps: false
        });
    return HistoricoEvaluacionCurricular;
};
