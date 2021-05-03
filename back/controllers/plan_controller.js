const axios = require('axios');
const models = require('../models');

async function createOrUpdatePlans() {
    try {
        const promises = [];
        const plans = (await getPlansApiUpm()).data || [];
        for (plan of plans) {
            try {
                const planEtsit = (await getPlansApiEtsitUpm(plan.codigo)).data || {};
                promises.push(
                    models.Plan.upsert({
                        id: plan.codigo,
                        nombre: plan.nombre,
                        compuesto: planEtsit.compuesto || false,
                        compuestoPor: planEtsit.compuestoPor || null
                    })
                )
            }
            catch (error) {
                console.log('Error:', error);
            }

        }
        await Promise.all(promises);
    } catch (error) {
        // no haces un next(error) pq quieres que siga funcionando aunque api upm falle en este punto
        console.log('Error:', error);
    }
};

async function getPlansApiUpm() {
    try {
        return await axios.get(
            'https://www.upm.es/wapi_upm/academico/comun/index.upm/v2/centro.json/9/planes/PSC'
        );
    } catch (error) {
        // no se propaga el error porque puede haber fallos en api upm y esta no es critica
        console.log(error);
        return { data: [] };
    }
};

async function getPlansApiEtsitUpm(idPlan) {
    const url = process.env.API_ETSIT_UPM_URL || "https://api.etsit.upm.es/upm/public"
    try {
        return await axios.get(
            `${url}/plan/${idPlan}`
        );
    } catch (error) {
        throw error
    }
};

async function findAllPlans() {
    try {
        return await models.Plan.findAll({
            order: [
                ['nombre', 'ASC'],
            ],
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getName(id) {
    try {
        let nombrePlan = await models.Plan.findOne({
            attributes: ['nombre'],
            where: {
                id: id
            }
        });
        return nombrePlan.nombre;
    } catch (error) {
        console.log(error);
        return [];
    }
}

exports.createOrUpdatePlans = createOrUpdatePlans;
exports.findAllPlans = findAllPlans;
exports.getName = getName;