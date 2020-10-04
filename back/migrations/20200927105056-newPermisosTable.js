'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
 const t = await queryInterface.sequelize.transaction();    
try {
      // Alter commands 
      

      //borrar columna
      await queryInterface.removeColumn('Permisos', 'id', { transaction: t });
      
      // Anadir columna
      await queryInterface.addColumn(
        'Permisos',
        'id',
        { type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        { transaction: t }
      )
      await queryInterface.addColumn(
        'Permisos',
        'email',
        Sequelize.STRING,
        { transaction: t }
      )

       // Anadir columna
       await queryInterface.addColumn(
        'Permisos',
        'tramite',
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
 const t = await queryInterface.sequelize.transaction();    
try {
      // Reverting commands
      await queryInterface.removeColumn('Permisos', 'email', { transaction: t });
      await queryInterface.removeColumn('Permisos', 'tramite', { transaction: t });
     
      await t.commit();
    } catch (error) {

      console.log(error);
      if (t) {
        await t.rollback();
      }
    }
  }
}
