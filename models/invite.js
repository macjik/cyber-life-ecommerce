'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invite.init(
    {
      inviteCode: DataTypes.INTEGER,
      discountPercentage: DataTypes.INTEGER,
      invitee: DataTypes.STRING,
      status: DataTypes.ENUM('pending', 'used', 'expired', 'unused'),
    },
    {
      sequelize,
      modelName: 'Invite',
    },
  );
  return Invite;
};
