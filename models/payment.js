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
      Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
    }
  }
  Payment.init(
    {
      status: { type: DataTypes.ENUM('pending', 'successful', 'failed'), defaultValue: 'pending' },
      statusCode: DataTypes.INTEGER,
      service: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      weChatInvoice: DataTypes.STRING,
      for: DataTypes.STRING,
      from: DataTypes.STRING,
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
