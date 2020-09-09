// Definicion del modelo Permiso:

module.exports = function (sequelize, DataTypes) {
    let Permiso = sequelize.define('Permiso',
        {
            id: {
                type: DataTypes.STRING,
                unique: true,
                primaryKey: true,
                allowNull: false
            }
        },
        {
            timestamps: false
        });
    return Permiso;
};
