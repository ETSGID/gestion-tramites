'use strict';
module.exports = (sequelize, DataTypes) => {
  const plan_estudio = sequelize.define('plan_estudio', {
    codigo: {
      type: DataTypes.STRING(4),
      primaryKey: true
    },
    nombre: DataTypes.STRING(75),
    curso_academico_ini: DataTypes.STRING(7),
    anos: DataTypes.SMALLINT
  }, {
    indexes: [
      {
        name: 'PK_plan_estudio',
        unique: true,
        fields: 'codigo'
      }
    ],
    freezeTableName: true,
    timestamps: false,
  });
  return plan_estudio;
};