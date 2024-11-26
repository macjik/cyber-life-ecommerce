'use strict';
const { Model } = require('sequelize');
const { validate: uuidValidate, version: uuidVersion } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Order }) {
      Invite.belongsTo(User, { foreignKey: 'inviter', as: 'Inviter' });
      Invite.belongsTo(User, { foreignKey: 'invitee', as: 'Invitee' });
      Invite.hasMany(Order, { foreignKey: 'inviteId' });
    }
  }
  Invite.init(
    {
      inviteCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isUUIDv4(value) {
            if (!uuidValidate(value) || uuidVersion(value) !== 4) {
              throw new Error('Invalid UUIDv4 format for inviteCode');
            }
          },
        },
      },
      discountPercentage: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM('pending', 'used', 'expired', 'unused'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Invite',
    },
  );
  return Invite;
};
