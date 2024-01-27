"use strict";

const { Venue } = require("../../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "145 Memory Lane",
        city: "Oldtown",
        state: "Testbama",
        lat: 91.2345,
        lng: 141.1337,
      },
      {
        groupId: 2,
        address: "245 Memory Lane",
        city: "Bigcity",
        state: "Demochusetts",
        lat: 92.2345,
        lng: 142.1337,
      },
      {
        groupId: 3,
        address: "345 Memory Lane",
        city: "Johnville",
        state: "Fakeansas",
        lat: 93.2345,
        lng: 143.1337,
      },
      {
        groupId: 4,
        address: "445 Memory Lane",
        city: "Islle",
        state: "Dew York",
        lat: 94.2345,
        lng: 144.1337,
      },
      {
        groupId: 5,
        address: "545 Memory Lane",
        city: "Townsville",
        state: "New Yersey",
        lat: 95.2345,
        lng: 145.1337,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: {
        [Op.substring]: "Memory Lane",
      },
    });
  },
};
