'use strict';
const { UniqueConstraintError } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.bulkInsert('Permisos', [
        {
          email: process.env.EMAIL_ADMIN || 'secretario.etsit@upm.es',
          tramite: 'admin'
        }
      ]);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        console.warn('Los permisos ya existen');
      } else {
        console.error(error);
      }
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permisos', null, {});
  }
};
