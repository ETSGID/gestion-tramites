let path = require('path');



// Cargar ORM
let Sequelize = require('sequelize');

//    DATABASE_URL = postgres://user:passwd@host:port/database
let logs = process.env.DEV === 'true' ? false : false
let sequelize;
if (process.env.DOCKER === 'true') {
    sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':5432/' + process.env.POSTGRES_DB, { logging: logs });
}
else {
    sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':5432/' + process.env.POSTGRES_DB, { logging: logs });
}



// Importar la definicion de las tablas 

let Peticion = sequelize.import(path.join(__dirname, 'Peticion'));
let Permiso = sequelize.import(path.join(__dirname, 'Permiso'));






sequelize.sync();

//Exportamos modelos

exports.Peticion = Peticion;
exports.Permiso = Permiso;
exports.sequelize = sequelize;
