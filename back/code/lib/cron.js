/**
 * Periodic activities
 */


const { CronJob } = require('cron');
let planController = require('../controllers/plan_controller')


// ejemplo cada 10 segundos: '*/10 * * * * *'

// cada dia a las 00:00:00: '0 0 0 * * *'
new CronJob(
    '0 0 0 * * *',
    async () => {
        await planController.createOrUpdatePlans();
        // mas funciones programadas
    },
    null,
    true,
    'Europe/Madrid'
);



