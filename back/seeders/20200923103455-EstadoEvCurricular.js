'use strict';
const { UniqueConstraintError } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.bulkInsert('EstadoEvaluacionCurriculars', [{
        id: 1,
        estadoCurso: 'DESACTIVADO',
        estadoTitulacion: 'DESACTIVADO'
      }]);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        console.warn('Los estados de ev.curricular ya existen.');
      } else {
        console.error(error);
      }
    }
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('EstadoEvaluacionCurriculars', null, {});
  }
};
