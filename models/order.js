'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, item, Payment }) {
      Order.belongsTo(User, { foreignKey: 'userId' });
      Order.belongsTo(item, { foreignKey: 'itemId' });
      Order.hasOne(Payment);
    }
  }
  Order.init(
    {
      status: {
        type: DataTypes.ENUM('pending', 'canceled', 'shipped', 'delivered'),
        defaultValue: 'pending',
      },
      discount: DataTypes.INTEGER,
      totalAmount: DataTypes.INTEGER,
      totalBuyers: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
