'use strict';
const { Model } = require('sequelize');
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
      // Invite.belongsToMany(Order, { through: 'OrderInvites', foreignKey: 'inviteId' });
    }
  }
  Invite.init(
    {
      inviteCode: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
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
