"use strict";

const { EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(
      [
        {
          eventId: 1,
          url: "image url 1",
          preview: true,
        },
        {
          eventId: 2,
          url: "image url 2",
          preview: true,
        },
        {
          eventId: 3,
          url: "image url 3",
          preview: false,
        },
        {
          eventId: 4,
          url: "image url 4",
          preview: false,
        },
        {
          eventId: 5,
          url: "image url 5",
          preview: false,
        },
      ], options,
      { validate: true }
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.substring]: "image url",
      },
    });
  },
};
