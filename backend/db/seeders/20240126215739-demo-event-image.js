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
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502037/Chiklist/openart-image_p8xgn8_d_1708501039364_raw_rlumvp.jpg",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631687/Chiklist/openart-image_gSfu69Ab_1708590123283_raw_satuub.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502036/Chiklist/openart-image_OgVO8miI_1708500698972_raw_qss1qi.jpg",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631695/Chiklist/openart-image_TYzYKcLH_1708586170077_raw_maxuen.jpg",
          preview: true,
        },
        {
          eventId: 5,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502033/Chiklist/openart-image_frl2T-6Y_1708501199579_raw_uz1jl2.jpg",
          preview: true,
        },
        {
          eventId: 6,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708494848/Chiklist/image_7qitamDh_1708494764520_raw_g9ei5d.jpg",
          preview: true,
        },
        {
          eventId: 7,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631688/Chiklist/openart-image_JoH0OaFN_1708627756371_raw_k8kmwu.jpg",
          preview: true,
        },
        {
          eventId: 8,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708493612/Chiklist/image_D1g5KQVy_1708492785515_raw_wlmkw3.jpg",
          preview: true,
        },
        {
          eventId: 9,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502027/Chiklist/openart-image_0l9xc_Eq_1708501369479_raw_plqrxu.jpg",
          preview: true,
        },
        {
          eventId: 10,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631696/Chiklist/openart-image_UaoNsWAB_1708588355064_raw_ch0ejo.jpg",
          preview: true,
        },
        {
          eventId: 11,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708531771/Chiklist/openart-image_v_lO4FXl_1708502726169_raw_ruyola.jpg",
          preview: true,
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
