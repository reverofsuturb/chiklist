"use strict";

const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "organizer",
        },
        {
          userId: 2,
          groupId: 2,
          status: "organizer",
        },
        {
          userId: 3,
          groupId: 3,
          status: "organizer",
        },
        {
          userId: 4,
          groupId: 4,
          status: "organizer",
        },
        {
          userId: 5,
          groupId: 5,
          status: "organizer",
        },
        {
          userId: 1,
          groupId: 6,
          status: "organizer",
        },
        {
          userId: 2,
          groupId: 7,
          status: "organizer",
        },
        {
          userId: 3,
          groupId: 8,
          status: "organizer",
        },
        {
          userId: 4,
          groupId: 9,
          status: "organizer",
        },
        {
          userId: 5,
          groupId: 10,
          status: "organizer",
        },
      ],
      options,
      { validate: true }
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: {
        [Op.in]: ["co-host", "organizer", "member", "pending"],
      },
    });
  },
};
