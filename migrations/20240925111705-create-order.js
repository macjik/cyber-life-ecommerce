'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM('pending', 'canceled', 'shipped', 'delivered'),
        defaultValue: 'pending',
      },
      itemId: { type: Sequelize.INTEGER, references: { model: 'items', key: 'id' } },
      userId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' } },
      discount: Sequelize.INTEGER,
      totalAmount: Sequelize.INTEGER,
      totalBuyers: Sequelize.INTEGER,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
