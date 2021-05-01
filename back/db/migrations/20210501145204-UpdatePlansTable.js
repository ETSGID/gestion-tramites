
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const t = await queryInterface.sequelize.transaction();

        try {
            // Alter commands 

            // Anadir columna
            await queryInterface.addColumn(
                'Plans',
                'compuesto',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                { transaction: t }
            )

            // Anadir columna
            await queryInterface.addColumn(
                'Plans',
                'compuestoPor',
                {
                    type: Sequelize.JSONB,
                    defaultValue: null,
                },
                { transaction: t }
            )

            await t.commit();
        } catch (error) {
            console.error(error);
            if (t) {
                await t.rollback();
            }
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const t = await queryInterface.sequelize.transaction();

        try {
            // Reverting commands
            await queryInterface.removeColumn('Plans', 'compuesto', { transaction: t });
            await queryInterface.removeColumn('Plans', 'compuestoPor', { transaction: t });
            await t.commit();
        } catch (error) {

            console.log(error);
            if (t) {
                await t.rollback();
            }
            throw error;
        }
    }
}
