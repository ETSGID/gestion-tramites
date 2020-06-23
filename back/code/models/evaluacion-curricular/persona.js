'use strict';
module.exports = (sequelize, DataTypes) => {
  const persona = sequelize.define('persona', {
    dni: {
      type: DataTypes.STRING(15),
      primaryKey: true
    },
    dniupm: DataTypes.STRING(15),
    nombre: DataTypes.STRING(32),
    apellido1: DataTypes.STRING(32),
    apellido2: DataTypes.STRING(32),
    sexo: DataTypes.CHAR(1),
    estado_civil: DataTypes.DECIMAL(1, 0),
    letra_nif: DataTypes.CHAR(1),
    fecha_nacimiento: DataTypes.DATE,
    pais_nacimiento: DataTypes.STRING(3),
    provincia_nacimiento: DataTypes.DECIMAL(2, 0),
    municipio_nacimiento: DataTypes.DECIMAL(3, 0),
    telefono: DataTypes.STRING(20),
    fax: DataTypes.STRING(20),
    email: DataTypes.STRING(100)
  }, {
    indexes: [
      {
        name: 'AK_persona',
        unique: true,
        fields: 'dni_upm'
      },
      {
        name: 'PK_persona',
        unique: true,
        fields: 'dni'
      }
    ],
    freezeTableName: true,
    timestamps: false,
  });
  return persona;
};