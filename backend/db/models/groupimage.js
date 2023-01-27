'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Group.hasMany(models.GroupImage, { foreignKey: 'groupId', as: 'previewImage' });
    }
  }
  GroupImage.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    url: {
     type: DataTypes.STRING,
     allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};