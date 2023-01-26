'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static getOrganizedGroups(id) {
      return Group.findAll({
        where: {
          organizerId: id
        }
      });
    }

    static associate(models) {
      // define association here
      // Group to user through membership
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        as: 'membership'
      });
      Group.belongsToMany(models.User, {
        through: 'Membership',
        foreignKey: 'groupId',
        otherKey: 'userId'
      });      
      //Group to user association
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50]
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['in person', 'online'],
      allowNull: false,
      validate: {
        isIn: [['in person', 'online']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: true
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};