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
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491780/Chiklist/openart-image_yAn1hnVa_1708491562711_raw_yinsvr.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491665/Chiklist/image_Lvmnovg9_1708489832763_raw_ebqplp.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491664/Chiklist/image_HQXP8bmP_1708489401762_raw_auefzt.jpg",
          preview: false,
        },
        {
          groupId: 4,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491664/Chiklist/image_2OFOW514_1708491437672_raw_dipcni.jpg",
          preview: false,
        },
        {
          groupId: 5,
          url: "https://res.cloudinary.com/drozfc2tz/image/upload/v1708491664/Chiklist/image_qbxaoGBh_1708490183602_raw_blh8q4.jpg",
          preview: false,
        },
      ], options,
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
