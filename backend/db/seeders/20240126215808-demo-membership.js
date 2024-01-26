"use strict";

const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "attending",
        },
        {
          userId: 2,
          groupId: 3,
          status: "waitlist",
        },
        {
          userId: 3,
          groupId: 2,
          status: "pending",
        },
        {
          userId: 4,
          groupId: 5,
          status: "waitlist",
        },
        {
          userId: 5,
          groupId: 4,
          status: "attending",
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
        [Op.in]: ["attending", "waitlist", "pending"],
      },
    });
  },
};
