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
const linea_acta = sequelizeExterna.import(path.join(__dirname, 'linea_acta'));
const asignatura_plan = sequelizeExterna.import(path.join(__dirname, 'asignatura_plan'));
const asignatura = sequelizeExterna.import(path.join(__dirname, 'asignatura'));
const tipo_asignatura = sequelizeExterna.import(path.join(__dirname, 'tipo_asignatura'));
const plan_estudio = sequelizeExterna.import(path.join(__dirname, 'plan_estudio'));
const persona = sequelizeExterna.import(path.join(__dirname, 'persona'));

// Relaciones

// 1 a N entre plan_estudio y linea_acta
// linea_acta.belongsTo(plan_estudio, { foreignKey: 'idplan' });
// plan_estudio.hasMany(linea_acta, { foreignKey: 'codigo' });

// 1 a N entre persona y linea_acta
//FK en linea acta
// linea_acta.belongsTo(persona, { foreignKey: 'dni' }); 
// persona.hasMany(linea_acta, { foreignKey: 'dni' }); 

// // 1 a N entre asignatura y linea_acta
// //FK en linea acta
// linea_acta.belongsTo(asignatura, { as: 'asignaturaId', foreignKey: 'asignatura' });
// asignatura.hasMany(linea_acta, { foreignKey: 'asignatura' });

// // 1 a N entre asignatura_plan y linea_acta
// //linea_acta.belongsTo(asignatura_plan, { foreignKey: 'PK_linea_acta_1' });
// // asignatura_plan.hasMany(linea_acta, { foreignKey: 'PK__asignatura_plan__214BF109' });

// // 1 a N entre tipo_asignatura y asignatura_plan
// //FK en asignatura_plan
// asignatura_plan.belongsTo(tipo_asignatura, { foreignKey: 'tipo' });
// tipo_asignatura.hasMany(asignatura_plan, { foreignKey: 'tipo' });

// // 1 a N ente plan_estudios y asignatura_plan
// //FK en asignatura_plan
// asignatura_plan.belongsTo(plan_estudio, { foreignKey: 'idplan' });
// plan_estudio.hasMany(asignatura_plan, { foreignKey: 'idplan' });

// // 1 a N entre asignatura y asignatura_plan
// //FK en asignatura_plan
// asignatura_plan.belongsTo(asignatura, { as:'asignaturaId', foreignKey: 'asignatura' });
// asignatura.hasMany(asignatura_plan, { foreignKey: 'asignatura' });

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