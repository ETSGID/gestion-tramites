'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Alter commands 

      const t = await queryInterface.sequelize.transaction();
      // Cambiar nombre tabla
      await queryInterface.renameTable('Peticions', 'PeticionTitulos', { transaction: t })

      // Cambiar nombre columna
      await queryInterface.renameColumn('PeticionTitulos', 'irispersonaluniqueid', 'edupersonuniqueid', { transaction: t })

      // Anadir columna
      await queryInterface.addColumn(
        'PeticionTitulos',
        'irispersonaluniqueid',
        Sequelize.STRING,
        { transaction: t }
      )

      // Copiar datos de una columna a otra
      await queryInterface.sequelize.query(
        'UPDATE "PeticionTitulos" SET irispersonaluniqueid = edupersonuniqueid;',
        { transaction: t }
      );

      await t.commit();
    } catch (error) {
      console.error(error);
      if (t) {
        await t.rollback();
      }
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const t = await queryInterface.sequelize.transaction();
      // Reverting commands
      await queryInterface.removeColumn('PeticionTitulos', 'irispersonaluniqueid', { transaction: t });
      await queryInterface.renameColumn('PeticionTitulos', 'edupersonuniqueid', 'irispersonaluniqueid', { transaction: t })
      await queryInterface.renameTable('PeticionTitulos', 'Peticions', { transaction: t });

      await t.commit();
    } catch (error) {

      console.log(error);
      if (t) {
        await t.rollback();
      }
      throw error;
    }
  }
}
