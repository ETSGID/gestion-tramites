'use strict';
module.exports = (sequelize, DataTypes) => {
  const linea_acta = sequelize.define('linea_acta', {
    idplan: {
      type: DataTypes.STRING(4),
     // primaryKey: true
    },
    dni: {
      type: DataTypes.STRING(15),
      // primaryKey: true
    },
    curso_academico: {
      type: DataTypes.STRING(7),
      //primaryKey: true
    },
    asignatura: {
      type: DataTypes.DECIMAL(9, 0),
      //primaryKey: true
    },
    convocatoria: {
      type: DataTypes.STRING(3),
      //primaryKey: true
    },
    calificacion_alfa: DataTypes.STRING(2),
    calificacion_num: DataTypes.DECIMAL(6, 3)
  }, {
    indexes: [
      {
        name: 'PK_linea_acta',
        unique: true,
        fields: ['idplan', 'dni', 'curso_academico', 'asignatura', 'convocatoria']
      }
    ],
    freezeTableName: true,
    timestamps: false,
  });
  return linea_acta;
};