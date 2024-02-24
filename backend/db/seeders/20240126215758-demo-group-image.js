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
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631700/Chiklist/openart-image_znCT4Zod_1708587788108_raw_lpgcjs.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631698/Chiklist/openart-image_T7dzu4D4_1708590152263_raw_o7tead.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502040/Chiklist/openart-image_uYx6rzoD_1708500672244_raw_dpozut.jpg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708631682/Chiklist/openart-image_aFYJ4IrB_1708586196944_raw_xwxq6i.jpg",
          preview: true,
        },
        {
          groupId: 5,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502031/Chiklist/openart-image_D6nMfeQN_1708501225936_raw_jmtjct.jpg",
          preview: true,
        },
        {
          groupId: 6,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708494849/Chiklist/image_KRD2-m0I_1708494791876_raw_ewuwm1.jpg",
          preview: true,
        },
        {
          groupId: 7,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491666/Chiklist/image_kkOBvQ4N_1708489806047_raw_b6q50i.jpg",
          preview: true,
        },
        {
          groupId: 8,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708493611/Chiklist/image_SFGzf7cw_1708492793607_raw_qucdvy.jpg",
          preview: true,
        },
        {
          groupId: 9,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708493610/Chiklist/image_79XL99vD_1708492292628_raw_pjpo10.jpg",
          preview: true
        },
        {
          groupId: 10,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708502037/Chiklist/openart-image_k9QLN0IE_1708500810820_raw_xcx5ii.jpg",
          preview: true
        }
      ],
      options,
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
