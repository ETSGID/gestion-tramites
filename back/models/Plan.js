// Definicion del modelo Plan:

module.exports = function(sequelize, DataTypes) {
    const Plan = sequelize.define(
      'Plan',
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        nombre: {
          type: DataTypes.STRING
        },
        acronimo: {
          type: DataTypes.STRING
        },
        compuesto:{
          type: DataTypes.BOOLEAN
        },
        compuestoPor:{
          type: DataTypes.JSONB
        }
      },
      {
        timestamps: false
      }
    );
    return Plan;
  };
  