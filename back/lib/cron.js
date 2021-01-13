/**
 * Periodic activities
 */


const { CronJob } = require('cron');
let planController = require('../controllers/plan_controller')
let peticionController = require('../controllers/gestion-certificados/peticion_controller')

// cargar planes al iniciar la app
async () => {
    await planController.createOrUpdatePlans();
}

// ejemplo cada 10 segundos: '*/10 * * * * *'

// cada dia a las 00:00:00: '0 0 0 * * *'
new CronJob(
    '0 0 0 * * *',
    async () => {
        await planController.createOrUpdatePlans();
        await peticionController.deleteAntiguas();
    },
    null,
    true,
    'Europe/Madrid'
);



