// Definicion del modelo Permiso:

module.exports = function (sequelize, DataTypes) {
    let Permiso = sequelize.define('Permiso',
        {
            id: {
                type: DataTypes.STRING,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING
            },
            tramite: {
                type: DataTypes.STRING
            },
        },
        {
            timestamps: false
        });
    return Permiso;
};
