'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PeticionEvaluacionCurriculars', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      edupersonuniqueid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      planCodigo: {
        type: Sequelize.STRING,
      },
      planNombre: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      estadoPeticion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATEONLY
      },
      textCancel: {
        type: Sequelize.TEXT
      },
      asignaturaNombre: {
        type: Sequelize.STRING
      },
      asignaturaCodigo: {
        type: Sequelize.STRING,
      },
      tipo: {
        type: Sequelize.STRING
      },
      justificacion: {
        type: Sequelize.STRING
      }

    },
      {
        timestamps: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PeticionEvaluacionCurriculars')
  }
};
