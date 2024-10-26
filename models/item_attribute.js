'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_Attribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ item }) {
      Item_Attribute.belongsTo(item, { foreignKey: 'itemId' });
    }
  }
  Item_Attribute.init(
    {
      value: DataTypes.STRING,
      type: DataTypes.ENUM('select', 'checkbox'),
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Item_Attribute',
    },
  );
  return Item_Attribute;
};
