'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HistoricoEvaluacionCurriculars', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      dni: {
        type: Sequelize.STRING,
        allowNull: false
      },
      edupersonuniqueid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      planCodigo: {
        type: Sequelize.STRING,
      },
      planNombre: {
        type: Sequelize.STRING
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
      fechaTribunal: {
        type: Sequelize.DATEONLY
      },
    },
      {
        timestamps: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HistoricoEvaluacionCurriculars')
  }
};
