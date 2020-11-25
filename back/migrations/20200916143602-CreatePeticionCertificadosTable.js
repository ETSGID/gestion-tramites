'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PeticionCertificados', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      edupersonuniqueid: {
        type: Sequelize.STRING
      },
      planCodigo: {
        type: Sequelize.STRING
      },
      planNombre: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      tipoCertificado:{
        type: Sequelize.INTEGER
      },
      nombreCertificadoOtro:{
        type: Sequelize.STRING
      },
      descuento: {
        type: Sequelize.INTEGER
      },
      formaPago: {
        type: Sequelize.INTEGER
      },
      estadoPeticion: {
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATEONLY
      },
      textCancel: {
        type: Sequelize.TEXT
      }
    },
      {
        timestamps: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PeticionCertificados')
  }
};
