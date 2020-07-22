'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EstadoEvaluacionCurriculars', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      estadoTitulacion: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'DESACTIVADO' 
      },
      estadoCurso: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'DESACTIVADO' 
      }
    },
      {
        timestamps: false
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('EstadoEvaluacionCurriculars')
  }
};
