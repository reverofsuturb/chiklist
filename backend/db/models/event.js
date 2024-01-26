"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.EventImage, { foreignKey: "eventId" });
      Event.belongsToMany(models.Users, {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId",
      });
    }
  }
  Event.init(
    {
      venueId: { type: DataTypes.INTEGER, allowNull: true },
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [5, 60] },
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        validate: {
          isIn: [["Online", "In person"]],
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: { type: DataTypes.INTEGER, allowNull: true },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          is: /\d\d\d\d-\d\d-\d\d\ \d\d:\d\d:\d\d/g,
          isAfter: this.createdAt,
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          is: /\d\d\d\d-\d\d-\d\d\ \d\d:\d\d:\d\d/g,
          isAfter: this.startDate,
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
