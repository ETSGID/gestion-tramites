'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Permisos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING
      },
      tramite: {
        type: Sequelize.STRING
      },
      /* rol: {
        type: DataTypes.STRING
      },
      plan: {
        type: DataTypes.STRING
      },
      */
    },
      {
        timestamps: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Permisos')
  }
};
