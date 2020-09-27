'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permisos', [
      {
        email: 'secretario.etsit@upm.es',
        tramite: 'admin'
      },
      {
        email: 'elena.garcia.leal@upm.es',
        tramite: 'gestion-certificados'
      }, 
      {
        email: 'andres.cosano@upm.es',
        tramite: 'gestion-certificados'
      },
      {
        email: 'elena.garcia.leal@upm.es',
        tramite: 'gestion-titulos'
      }, 
      {
        email: 'andres.cosano@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'mariaantonia.barquero@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'cristina.perezdeazpillaga@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'pilar.horcajada@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'esther.fuentes@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'mercedes.obispo@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'sabel.poza@upm.es',
        tramite: 'gestion-titulos'
      },
      {
        email: 'elena.garcia.leal@upm.es',
        tramite: 'evaluacion-curricular'
      }, 
      {
        email: 'andres.cosano@upm.es',
        tramite: 'evaluacion-curricular'
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permisos', null, {});
  }
};
