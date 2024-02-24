"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Montgomery",
          lastName: "Jenkins",
          email: "usera1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          firstName: "Larry",
          lastName: "Bird",
          email: "userb2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Guacialata",
          lastName: "Smith",
          email: "userc3@user.io",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Terry",
          lastName: "Spinelli",
          email: "userd4@user.io",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Constance",
          lastName: "Flitkin",
          email: "usere5@user.io",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password5"),
        }
      ],
      options,
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: [
          "FakeUser1",
          "FakeUser2",
          "FakeUser3",
          "FakeUser4",
          "FakeUser5",
        ],
      },
    });
  },
};
