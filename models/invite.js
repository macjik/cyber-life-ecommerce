'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      Invite.belongsTo(User, { foreignKey: 'inviterId', as: 'Inviter' });
      Invite.belongsTo(User, { foreignKey: 'inviteeId', as: 'Invitee' });
    }
  }
  Invite.init(
    {
      inviteCode: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      discountPercentage: DataTypes.INTEGER,
      status: DataTypes.ENUM('pending', 'used', 'expired', 'unused'),
    },
    {
      sequelize,
      modelName: 'Invite',
    },
  );
  return Invite;
};
