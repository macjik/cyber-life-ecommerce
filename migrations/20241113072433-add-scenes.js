'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'scenes', {
      type: Sequelize.JSONB,
      defaultValue: {},
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'scenes');
  },
};
