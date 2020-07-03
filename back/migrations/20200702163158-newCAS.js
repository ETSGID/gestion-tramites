'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Alter commands 

      const t = await queryInterface.sequelize.transaction();
      // Cambiar nombre tabla
      await queryInterface.renameTable('Peticions', 'PeticionTitulos', { transaction: t })

      await queryInterface.addColumn(
        'PeticionTitulos',
        'edupersonuniqueid',
        Sequelize.STRING,
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
    try {
      const t = await queryInterface.sequelize.transaction();
      // Reverting commands
      await queryInterface.removeColumn('PeticionTitulos', 'edupersonuniqueid', { transaction: t });
      await queryInterface.renameTable('PeticionTitulos', 'Peticions', { transaction: t });

      await t.commit();
    } catch (error) {

      console.log(error);
      if (t) {
        await t.rollback();
      }
    }
  }
}
