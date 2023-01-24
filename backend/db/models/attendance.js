"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Event.belongsToMany(models.User, {
        through: "attendances",
        as: "attendees",
        foreignKey: "eventId",
      });
      models.User.belongsToMany(models.Event, {
        through: "attendances",
        as: "events",
        foreignKey: "userId",
      });
    }
  }
  Attendance.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Event",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.ENUM,
        values: ["member", "waitlist", "pending"],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
