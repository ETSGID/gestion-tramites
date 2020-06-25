'use strict';

const path = require('path');
const Sequelize = require('sequelize');


// Cargar ORM
let sequelizeExterna;
const DB_NAME = 'evalcurricular';
const DB_USERNAME = 'root';
const DB_PASSWORD = 'root';
const DB_HOST = 'localhost';

sequelizeExterna = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});

// Comprobar conexion
sequelizeExterna.authenticate()
  .then(() => {
    console.log('Conectado')
  })
  .catch(err => {
    console.log('No se conectó')
  })

// Importar modelos
const asignatura_plan = sequelizeExterna.import(path.join(__dirname, 'asignatura_plan'));
const asignatura = sequelizeExterna.import(path.join(__dirname, 'asignatura'));
const tipo_asignatura = sequelizeExterna.import(path.join(__dirname, 'tipo_asignatura'));
const plan_estudio = sequelizeExterna.import(path.join(__dirname, 'plan_estudio'));
const persona = sequelizeExterna.import(path.join(__dirname, 'persona'));
const linea_acta = sequelizeExterna.import(path.join(__dirname, 'linea_acta'));

// crear tablas pendientes
sequelizeExterna.sync();

 // exportar modelos
exports.linea_acta = linea_acta;
exports.asignatura_plan = asignatura_plan;
exports.asignatura = asignatura;
exports.tipo_asignatura = tipo_asignatura;
exports.plan_estudio = plan_estudio;
exports.persona = persona;
exports.sequelizeExterna = sequelizeExterna;