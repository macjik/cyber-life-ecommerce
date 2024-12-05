'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
      description: DataTypes.STRING,
      slogan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Company',
    },
  );
  return Company;
};
