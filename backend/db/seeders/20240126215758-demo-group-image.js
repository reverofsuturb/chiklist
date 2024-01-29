"use strict";

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "image url 6",
          preview: true,
        },
        {
          groupId: 2,
          url: "image url 7",
          preview: true,
        },
        {
          groupId: 3,
          url: "image url 8",
          preview: false,
        },
        {
          groupId: 4,
          url: "image url 9",
          preview: false,
        },
        {
          groupId: 5,
          url: "image url 10",
          preview: false,
        },
      ],
      { validate: true }
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.substring]: "image url",
      },
    });
  },
};
