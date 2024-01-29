"use strict";

const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: null,
          groupId: 1,
          name: "AVinterestingevent",
          description:
            "welcome to a beautiful mystery theatre where we are hosting this wonderful mystery event",
          type: "Online",
          capacity: 50,
          price: 18.7,
          startDate: "2024-02-07 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: null,
          groupId: 3,
          name: "BXinterestingevent",
          description:
            "welcome to a beautiful mystery theatre where we are hosting this wonderful mystery event",
          type: "In person",
          capacity: 42,
          price: 12.23,
          startDate: "2024-02-07 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: null,
          groupId: 2,
          name: "CDinterestingevent",
          description:
            "welcome to a beautiful mystery theatre where we are hosting this wonderful mystery event",
          type: "In person",
          capacity: 30,
          price: 16.7,
          startDate: "2024-02-07 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: null,
          groupId: 5,
          name: "EFinterestingevent",
          description:
            "welcome to a beautiful mystery theatre where we are hosting this wonderful mystery event",
          type: "Online",
          capacity: 230,
          price: 1.7,
          startDate: "2024-02-07 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: null,
          groupId: 4,
          name: "GHinterestingevent",
          description:
            "welcome to a beautiful mystery theatre where we are hosting this wonderful mystery event",
          type: "Online",
          capacity: 55,
          price: 18.75,
          startDate: "2024-02-07 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
      ],
      { validate: true }
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.substring]: "interestingevent",
      },
    });
  },
};
