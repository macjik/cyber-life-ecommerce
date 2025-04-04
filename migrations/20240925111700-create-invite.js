'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      inviter: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' } },
      invitee: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' } },
      inviteCode: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      discountPercentage: Sequelize.INTEGER,
      status: Sequelize.ENUM('pending', 'used', 'expired', 'unused'),
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
    await queryInterface.dropTable('Invites');
  },
};
