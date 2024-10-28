'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Item_Attributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: {
        type: Sequelize.STRING,
      },
      type: Sequelize.ENUM('select', 'checkbox'),
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      value: Sequelize.STRING,
      itemId: {
        type: Sequelize.INTEGER,
        references: { model: 'items', key: 'id' },
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Item_Attributes');
  },
};
