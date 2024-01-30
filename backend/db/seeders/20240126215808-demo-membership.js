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
          status: "co-host",
        },
        {
          userId: 2,
          groupId: 3,
          status: "organizer",
        },
        {
          userId: 3,
          groupId: 2,
          status: "member",
        },
        {
          userId: 4,
          groupId: 5,
          status: "pending",
        },
        {
          userId: 5,
          groupId: 4,
          status: "organizer",
        },
      ],
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