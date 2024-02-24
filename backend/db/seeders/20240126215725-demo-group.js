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
          name: "Sherbert Enthusiasts Club",
          about:
            "We really love sherbert, almost as much as we love Michael Chiklis, please join our group and overindulge on frosty treats at all times.",
          type: "In person",
          private: false,
          city: "Bigcity",
          state: "Demochusetts",
        },
        {
          organizerId: 2,
          name: "Marshmallow Enjoyers",
          about:
            "Good God! Do we love marshmallows, there's nothing like watching an episode of The Shield, get reckless with Chiklis, and wicked fluffy with the 'mallows",
          type: "In person",
          private: true,
          city: "Oldtown",
          state: "Testbama",
        },
        {
          organizerId: 3,
          name: "Lasagna Specialty Crew",
          about:
            "Do you dream of lasagna? Ever dream of eating lasagna with Michael Chiklis? This is your place to be, join us today! Let's get spicy!",
          type: "In person",
          private: true,
          city: "Johnville",
          state: "Fakeansas",
        },
        {
          organizerId: 4,
          name: "Chiklis Equestrians Unite",
          about:
            "Trottin along isn't fun alone, that's why we love horses. If you want to discuss your Chiklis chronicles while coming to our weekly meet ups with our lovely horse friends, please join today!",
          type: "Online",
          private: false,
          city: "Islle",
          state: "Dew York",
        },
        {
          organizerId: 5,
          name: "Vintners Toast",
          about:
            "Explore terroir and toast to Chiklis with us! Our group is renown for hosting weekly tastings as well as thriving discussion regarding the world of wine",
          type: "Online",
          private: false,
          city: "Townsville",
          state: "New Yersey",
        },
        {
          organizerId: 1,
          name: "Chiklis Happiness Society",
          about:
            "Feeling blue? Need a change of pace? We here at the Chiklis Happiness Society are very into being incredibly happy, and we get there with Chiklis",
          type: "Online",
          private: false,
          city: "Yams",
          state: "Tennessea",
        },
        {
          organizerId: 2,
          name: "Team Dragons",
          about:
            "We really, really like dragons.. and Michael Chiklis. So much so that we have created this wonderful group dedicated to that, we are a collection of artists and high fantasy writers, join us today!",
          type: "Online",
          private: false,
          city: "Guancial",
          state: "Texas",
        },
        {
          organizerId: 3,
          name: "People Who Dream of Eating Chili in Space",
          about:
            "Have you ever dreamed of eating Chili in Space? Was it with Michael Chiklis? Well so have we, if you need to be around likeminded people, sign up today!",
          type: "Online",
          private: false,
          city: "Outer",
          state: "Space",
        },
        {
          organizerId: 4,
          name: "Circus, Anger, Chiklis",
          about:
            "Do you listen to black metal? Sludge? Do you wake up to Animosity and sleep to Electric Wizard? Do you also like to dress up as a clown and watch the Ducktales episode where Chiklis plays Zeus? Look no further, join here today",
          type: "Online",
          private: false,
          city: "Allston",
          state: "Massachusetts",
        },
        {
          organizerId: 5,
          name: "Chickpeas? Chicklis!",
          about:
            "Some people call em garbanzo, we say that's missing the 'Chik, if you want to eat some beans and chill with Chiklis get on in!",
          type: "Online",
          private: false,
          city: "Philly",
          state: "Pencilvania",
        },
      ],
      options,
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
