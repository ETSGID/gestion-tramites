'use strict';
module.exports = (sequelize, DataTypes) => {
  const asignatura_plan = sequelize.define('asignatura_plan', {
    asignatura: {
      type: DataTypes.DECIMAL(9, 0),
      primaryKey: true
    },
    idplan: {
      type: DataTypes.STRING(4),
      primaryKey: true
    },
    tipo: DataTypes.CHAR(1),
    curso: DataTypes.DECIMAL(1, 0),
    semestre: DataTypes.CHAR(1),
    ciclo: DataTypes.CHAR(1)
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  return asignatura_plan;
};