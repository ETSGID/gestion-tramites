'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PeticionCertificados', {
      edupersonuniqueid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      planCodigo: {
        type: Sequelize.STRING,
        primaryKey: true
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
        type: Sequelize.STRING,
        primaryKey: true
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
      //si no lo recoge el titular
      receptor: {
        type: Sequelize.TEXT
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
