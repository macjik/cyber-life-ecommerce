'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, item, Payment, Invite, Item_Attribute }) {
      Order.belongsTo(User, { foreignKey: 'userId' });
      Order.belongsTo(item, { foreignKey: 'itemId' });
      Order.belongsTo(Item_Attribute, { foreignKey: 'item_attribute_id' });
      // Order.belongsToMany(Invite, { through: 'OrderInvites', foreignKey: 'orderId' });
      Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
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
