'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Order, Category, Item_Attribute, Company }) {
      item.belongsToMany(User, { through: Order, foreignKey: 'itemId' });
      item.belongsTo(Category, { foreignKey: 'categoryId', as: 'itemCategory' });
      item.hasMany(Item_Attribute, { foreignKey: 'itemId', as: 'itemAttributes' });
      item.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    }
  }

  item.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      image: DataTypes.ARRAY(DataTypes.STRING),
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('available', 'out of stock', 'discontinued'),
        defaultValue: 'available',
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      ikpu: DataTypes.STRING,
      packageCode: DataTypes.STRING,
      // shop: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'item',
      timestamps: true,
    },
  );
  return item;
};
