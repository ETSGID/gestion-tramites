'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Plans', [
      {
        id: '09AN',
        nombre: 'MASTER UNIVERSITARIO EN INGENIERIA DE SISTEMAS ELECTRONICOS',
        acronimo: ''
      }, 
      {
        id: '09AQ',
        nombre: 'MASTER UNIVERSITARIO EN INGENIERIA DE TELECOMUNICACION',
        acronimo: ''
      },
      {
        id: '09AR',
        nombre: 'MASTER UNIV. EN TRATAMIENTO ESTADISTICO-COMPUTACIONAL DE LA INFORMACION',
        acronimo: ''
      }, 
      {
        id: '09AS',
        nombre: 'MASTER UNIVERSITARIO EN INGENIERIA DE REDES Y SERVICIOS TELEMATICOS',
        acronimo: ''
      }, 
      {
        id: '09AT',
        nombre: 'MASTER UNIVERSITARIO EN TEORIA DE LA SEÑAL Y COMUNICACIONES',
        acronimo: ''
      },
      {
        id: '09AU',
        nombre: 'MASTER UNIVERSITARIO EN INGENIERIA BIOMEDICA',
        acronimo: ''
      },
      {
        id: '09AV',
        nombre: 'EIT DIGITAL TRACK ON SOFTWARE AND SERVICES ARCHITECTURE',
        acronimo: ''
      }, 
      {
        id: '09AW',
        nombre: 'MASTER UNIVERSITARIO EN CIBERSEGURIDAD',
        acronimo: ''
      },
      {
        id: '09AX',
        nombre: 'MASTER UNIVERSITARIO EN ENERGIA SOLAR FOTOVOLTAICA',
        acronimo: ''
      },
      {
        id: '09AZ',
        nombre: 'MASTER UNIVERSITARIO EN INGENIERIA DE SISTEMAS ELECTRONICOS',
        acronimo: ''
      }, 
      {
        id: '09BA',
        nombre: 'MASTER UNIVERSITARIO EN INGENIERÍA DE REDES Y SERVICIOS TELEMÁTICOS',
        acronimo: ''
      },
      {
        id: '09BB',
        nombre: 'DOBLE MASTER INGENIERIA TELECOMUNICACION Y EN REDES Y SERVICIOS TELEMATICOS',
        acronimo: ''
      },
      {
        id: '09BC',
        nombre: 'DOBLE MASTER UNIV. ING. TELECOMUNICACION Y EN ING. DE SISTEMAS ELECTRONICOS',
        acronimo: ''
      }, 
      {
        id: '09BD',
        nombre: 'DOBLE MASTER ING.TELECOMUNICACION Y TEORIA DE LA SEÑAL Y COMUNICACIONES',
        acronimo: ''
      },
      {
        id: '09BM',
        nombre: 'GRADO EN INGENIERIA BIOMEDICA',
        acronimo: ''
      },
      {
        id: '09IB',
        nombre: 'GRADO EN INGENIERIA BIOMEDICA',
        acronimo: ''
      },
      {
        id: '09ID',
        nombre: 'GRADO EN INGENIERIA Y SISTEMAS DE DATOS',
        acronimo: ''
      },
      {
        id: '09TT',
        nombre: 'GRADO EN INGENIERIA DE TECNOLOGIAS Y SERVICIOS DE TELECOMUNICACION',
        acronimo: ''
      },
      {
        id: 'GX09',
        nombre: 'VISITANTES GRADO CENTRO 9',
        acronimo: ''
      },
      {
        id: 'MV09',
        nombre: 'MOVILIDAD CENTRO 09',
        acronimo: ''
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Plans', null, {});
  }
};