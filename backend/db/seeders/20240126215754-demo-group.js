"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Avery interesting group",
          about:
            "Aas indicated by the name this is a very interesting group where we love hosting and going to interesting events can be",
          type: "Online",
          private: true,
          city: "Bigcity",
          state: "Demochusetts",
        },
        {
          organizerId: 2,
          name: "Bvery interesting group",
          about:
            "Bas indicated by the name this is a very interesting group where we love hosting and going to interesting events can be",
          type: "In person",
          private: true,
          city: "Oldtown",
          state: "Testbama",
        },
        {
          organizerId: 3,
          name: "Cvery interesting group",
          about:
            "Cas indicated by the name this is a very interesting group where we love hosting and going to interesting events can be",
          type: "In person",
          private: true,
          city: "Johnville",
          state: "Fakeansas",
        },
        {
          organizerId: 4,
          name: "Dvery interesting group",
          about:
            "Das indicated by the name this is a very interesting group where we love hosting and going to interesting events can be",
          type: "Online",
          private: false,
          city: "Islle",
          state: "Dew York",
        },
        {
          organizerId: 5,
          name: "Every interesting group",
          about:
            "Eas indicated by the name this is a very interesting group where we love hosting and going to interesting events can be",
          type: "Online",
          private: false,
          city: "Townsville",
          state: "New Yersey",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.substring]: ["interesting group"],
      },
    });
  },
};
