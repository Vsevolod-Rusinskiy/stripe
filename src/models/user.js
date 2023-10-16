'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Subscription, {
        foreignKey: 'subscriptionId',
        as: 'subscription'
      });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    subscriptionId: DataTypes.INTEGER,
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};