// Cargar ORM
let Sequelize = require('sequelize');
const planController = require('../controllers/plan_controller');

//    DATABASE_URL = postgres://user:passwd@host:port/database
let logs = process.env.DEV === 'true' ? false : false
let sequelize;
const dbHost = process.env.DB_HOST  || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbUsername = process.env.DB_USERNAME || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '1234';
const db = process.env.POSTGRES_DB || 'gestion_tramites';

sequelize = new Sequelize('postgres://' + dbUsername + ':' + dbPassword + '@' + dbHost + ':' + dbPort  + '/' + db, { logging: logs });

// Importar la definicion de las tablas 

let PeticionTitulo = require('./PeticionTitulo')(sequelize, Sequelize);
let PeticionCertificado = require('./PeticionCertificado')(sequelize, Sequelize);
let Permiso = require('./Permiso')(sequelize, Sequelize);
let Plan = require('./Plan')(sequelize, Sequelize);
let PeticionEvaluacionCurricular = require('./PeticionEvaluacionCurricular')(sequelize, Sequelize);
let EstadoEvaluacionCurricular = require('./EstadoEvaluacionCurricular')(sequelize, Sequelize);
let HistoricoEvaluacionCurricular = require('./HistoricoEvaluacionCurricular')(sequelize, Sequelize);

(async () => {
    try {
        // En producción ya no sincronizar, hacer mejor migraciones
        // await sequelize.sync();
        await sequelize.authenticate();
        console.log("Connected to the database")
        // extension unaccent
        try {
            await sequelize.query('CREATE EXTENSION unaccent;')
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error);
    }
})();

//Exportamos modelos

exports.PeticionTitulo = PeticionTitulo;
exports.PeticionCertificado = PeticionCertificado;
exports.Permiso = Permiso;
exports.Plan = Plan;
exports.PeticionEvaluacionCurricular = PeticionEvaluacionCurricular;
exports.EstadoEvaluacionCurricular = EstadoEvaluacionCurricular;
exports.HistoricoEvaluacionCurricular = HistoricoEvaluacionCurricular;

exports.sequelize = sequelize;
