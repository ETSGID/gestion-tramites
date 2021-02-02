
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const t = await queryInterface.sequelize.transaction();

    try {
      // Alter commands 

      // Anadir columna
      await queryInterface.addColumn(
        'HistoricoEvaluacionCurriculars',
        'resolucion',
        Sequelize.INTEGER,
        { transaction: t }
      )

      await t.commit();
    } catch (error) {
      console.error(error);
      if (t) {
        await t.rollback();
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
      const t = await queryInterface.sequelize.transaction();

    try {
      // Reverting commands
      await queryInterface.removeColumn('HistoricoEvaluacionCurriculars', 'resolucion', { transaction: t });

      await t.commit();
    } catch (error) {

      console.log(error);
      if (t) {
        await t.rollback();
      }
    }
  }
}
