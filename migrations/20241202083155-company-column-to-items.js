'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('items', 'companyId', {
      type: Sequelize.INTEGER,
      references: { model: 'Companies', key: 'id' },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('items', 'companyId');
  },
};
