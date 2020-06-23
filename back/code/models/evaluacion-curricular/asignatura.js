'use strict';
module.exports = (sequelize, DataTypes) => {
  const asignatura = sequelize.define('asignatura', {
    codigo: {
      type: DataTypes.DECIMAL(9, 0),
      primaryKey: true
    },
    nombre: DataTypes.STRING(100),
    nombre_ingles: DataTypes.CHAR(100),
    creditos_teoria: DataTypes.DECIMAL(5, 2),
    creditos_practicos: DataTypes.DECIMAL(5, 2),
    finaliza_estudios: DataTypes.TINYINT.ZEROFILL
  }, {
    indexes: [
      {
        name: 'PK_asignatura',
        unique: true,
        fields: 'codigo'
      }],
    freezeTableName: true,
    timestamps: false,
  });

  return asignatura;
};