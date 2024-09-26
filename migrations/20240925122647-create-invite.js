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
      inviter: Sequelize.STRING,
      inviteCode: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      discountPercentage: Sequelize.INTEGER,
      invitee: Sequelize.STRING,
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
