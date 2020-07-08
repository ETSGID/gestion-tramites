let path = require('path');



// Cargar ORM
let Sequelize = require('sequelize');


//    DATABASE_URL = postgres://user:passwd@host:port/database
let logs = process.env.DEV === 'true' ? false : false
let sequelize;

sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':5432/' + process.env.POSTGRES_DB, { logging: logs });

// Importar la definicion de las tablas 

let PeticionTitulo = require('./PeticionTitulo')(sequelize, Sequelize);
let Permiso = require('./Permiso')(sequelize, Sequelize);
let Plan = require('./Plan')(sequelize, Sequelize);


(async () => {
    try {
        // En producción ya no sincronizar, hacer mejor migraciones
        // await sequelize.sync();
        await sequelize.authenticate();
        console.log("Connected to the database")
        await sequelize.query('CREATE EXTENSION unaccent;')
    } catch (error) {
        console.log(error.message);
    }
})();



//Exportamos modelos

exports.PeticionTitulo = PeticionTitulo;
exports.Permiso = Permiso;
exports.Plan = Plan;

exports.sequelize = sequelize;
