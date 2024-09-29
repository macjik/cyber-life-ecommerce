'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }) {
      Payment.belongsTo(Order);
    }
  }
  Payment.init(
    {
      status: { type: DataTypes.ENUM('pending', 'successful', 'failed'), defaultValue: 'pending' },
      statusCode: DataTypes.INTEGER,
      region: DataTypes.STRING,
      cardType: DataTypes.STRING,
      cardNumbers: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Payment',
    },
  );
  return Payment;
};
