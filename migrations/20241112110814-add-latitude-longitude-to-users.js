'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'lat', {
      type: Sequelize.DECIMAL(9, 6),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'long', {
      type: Sequelize.DECIMAL(9, 6),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'lat');
    await queryInterface.removeColumn('Users', 'long');
  },
};
