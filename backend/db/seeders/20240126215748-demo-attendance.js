"use strict";

const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendance.bulkCreate(
      [
        {
          eventId: 1,
          userId: 1,
          status: "attending",
        },
        {
          eventId: 2,
          userId: 3,
          status: "waitlist",
        },
        {
          eventId: 3,
          userId: 2,
          status: "pending",
        },
        {
          eventId: 4,
          userId: 5,
          status: "waitlist",
        },
        {
          eventId: 5,
          userId: 4,
          status: "attending",
        },
      ], options,
      { validate: true }
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: {
        [Op.in]: ["attending", "waitlist", "pending"],
      },
    });
  },
};
