'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ item, Payment, Invite, Order }) {
      User.belongsToMany(item, { through: Order });
      User.hasMany(Invite, { as: 'InvitationsSent', foreignKey: 'inviter' });
      User.hasMany(Invite, { as: 'InvitationsReceived', foreignKey: 'invitee' });
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING },
      telegramId: { type: DataTypes.BIGINT },
      telegramFirstName: { type: DataTypes.STRING },
      telegramLastName: { type: DataTypes.STRING },
      telegramUserName: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING, allowNull: false, unique: true },
      role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
      address: { type: DataTypes.STRING },
      sub: { type: DataTypes.STRING, unique: true },
      // hash: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
