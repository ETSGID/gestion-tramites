
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const t = await queryInterface.sequelize.transaction();

    try {
      // Alter commands 

      // Anadir columna
      await queryInterface.addColumn(
        'PeticionEvaluacionCurriculars',
        'mostrar',
        Sequelize.BOOLEAN,
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
      await queryInterface.removeColumn('PeticionEvaluacionCurriculars', 'mostrar', { transaction: t });

      await t.commit();
    } catch (error) {

      console.log(error);
      if (t) {
        await t.rollback();
      }
    }
  }
}
