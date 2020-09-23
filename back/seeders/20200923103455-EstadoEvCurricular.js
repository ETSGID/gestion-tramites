'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('EstadoEvaluacionCurriculars', [{
        id: 1,
        estadoCurso: 'DESACTIVADO',
        estadoTitulacion: 'DESACTIVADO'
      }]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('EstadoEvaluacionCurriculars', null, {});
  }
};
