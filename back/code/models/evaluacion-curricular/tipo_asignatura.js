'use strict';
module.exports = (sequelize, DataTypes) => {
  const tipo_asignatura = sequelize.define('tipo_asignatura', {
    codigo: {
      type: DataTypes.CHAR(1),
      primaryKey: true
    },
    descripcion: DataTypes.STRING(75)
  }, {
    indexes: [
      {
        name: 'PK_tipo_asignatura',
        unique: true,
        fields: 'codigo'
      }
    ],
    freezeTableName: true,
    timestamps: false,
  });
  return tipo_asignatura;
};