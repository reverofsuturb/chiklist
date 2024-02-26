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
          venueId: 1,
          groupId: 1,
          name: "Sherberfest 9000",
          description:
            "Every flavor in the world and your favorite people to discuss Chiklis with. You gotta be a part of this sign up today.",
          type: "Online",
          capacity: 50,
          price: 18.75,
          startDate: "2024-02-07 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Smores and Snores",
          description:
            "At this Chiklis Movie Marathon event we plan on eating so many smores that we hear some snores and all fall asleep to our most beloved actor",
          type: "In person",
          capacity: 42,
          price: 12.23,
          startDate: "2024-02-06 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Pasta Tuesday",
          description:
            "Who doesn't like pasta? Not us, especially on Tuesday - catch up with us, this tuesday, we're watching the episode of Accused where Chiklis plays Scott Harmon",
          type: "In person",
          capacity: 30,
          price: 16.72,
          startDate: "2024-02-10 20:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: 4,
          groupId: 4,
          name: "Horsin Around",
          description:
            "This months ride features a long indulgent audio pairing with of Chiklis' self played role of himself, Michael Chiklis, in John Bronco Rides Again",
          type: "Online",
          capacity: 230,
          price: 1.72,
          startDate: "2024-02-03 12:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: 5,
          groupId: 5,
          name: "It's Vineyard Friday!",
          description:
            "Raise a glass to the Chik! Let's get wild and have a fun time come to the West Hollow Arboretum and hang out!",
          type: "Online",
          capacity: 55,
          price: 18.75,
          startDate: "2024-02-09 10:00:00",
          endDate: "2024-03-07 02:00:00",
        },
        {
          venueId: null,
          groupId: 6,
          name: "Never Cry Alone",
          description:
            "It's our annual cryfest, you better get sign up today because slots are goin fast! Don't worry, we'll end the night on a happy note with a showing of MFKZ where Chiklis plays Crocodile",
          type: "Online",
          capacity: 45,
          price: 20.75,
          startDate: "2024-03-09 10:00:00",
          endDate: "2024-03-27 02:00:00",
        },
        {
          venueId: null,
          groupId: 7,
          name: "FIREFEST",
          description:
            "Let's get heated, put on your finest scales and lets wag some tails! Also we are going to re-watch Season 1 of The Shield to celebrate Charlie's 50th run through!",
          type: "Online",
          capacity: 90,
          price: 0,
          startDate: "2024-03-19 10:00:00",
          endDate: "2024-03-29 02:00:00",
        },
        {
          venueId: null,
          groupId: 8,
          name: "Quantum Chili Cook-off",
          description:
            "Don your suits, let's get galactic with our annual chili cook-off! Bring one bring all",
          type: "Online",
          capacity: 56,
          price: 23.23,
          startDate: "2024-03-19 10:00:00",
          endDate: "2024-03-29 02:00:00",
        },
        {
          venueId: null,
          groupId: 9,
          name: "Birds of a Feather Concert Meetup",
          description:
            "CAW CAW GET READY! Your favorite Chiklis Crew is assembling to destroy the best rockin Birds of a Feather show this year. Get with it!",
          type: "Online",
          capacity: 56,
          price: 27.23,
          startDate: "2024-03-15 10:00:00",
          endDate: "2024-03-29 02:00:00",
        },
        {
          venueId: null,
          groupId: 10,
          name: "Beans and Jeans",
          description:
            "Let's celebrate denim because why not? We're also making our favorite Chiklis inspired Chikpea Stew!",
          type: "Online",
          capacity: 126,
          price: 22.23,
          startDate: "2024-04-14 10:00:00",
          endDate: "2024-04-29 02:00:00",
        },
        {
          venueId: null,
          groupId: 1,
          name: "Noodles for Streudels",
          description:
            "Noodles, all day, every day, you heard it here, this is a once a year exclusive held by the Sherbert Enthusiasts Club where we veer off and go for the gold, noodle-style",
          type: "Online",
          capacity: 106,
          price: 31.23,
          startDate: "2024-04-24 10:00:00",
          endDate: "2024-04-29 02:00:00",
        },
      ],
      options,
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
