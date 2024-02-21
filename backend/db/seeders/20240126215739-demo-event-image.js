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
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708493612/Chiklist/image_D1g5KQVy_1708492785515_raw_wlmkw3.jpg",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708493611/Chiklist/image_SFGzf7cw_1708492793607_raw_qucdvy.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708493610/Chiklist/image_79XL99vD_1708492292628_raw_pjpo10.jpg",
          preview: false,
        },
        {
          eventId: 4,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708494120/Chiklist/image_F_fAqhmk_1708493805539_raw_a7t5za.jpg",
          preview: false,
        },
        {
          eventId: 5,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491780/Chiklist/openart-image_e-p0Zvx3_1708491571039_raw_bsbvne.jpg",
          preview: false,
        },
      ],
      options,
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
