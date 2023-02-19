"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 1,
          name: "demo-group-1",
          about: "This is the first demo group",
          type: "online",
          isPrivate: false,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 2,
          name: "demo-group-2",
          about: "This is the second demo group",
          type: "online",
          isPrivate: true,
          city: "Los Angeles",
          state: "CA",
        },
        {
          organizerId: 3,
          name: "demo-group-3",
          about: "This is the first demo group",
          type: "online",
          isPrivate: false,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 1,
          name: "demo-group-4",
          about: "This is the second demo group",
          type: "online",
          isPrivate: true,
          city: "Los Angeles",
          state: "CA",
        },
        {
          organizerId: 1,
          name: "demo-group-5",
          about: "This is the first demo group",
          type: "online",
          isPrivate: false,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 1,
          name: "demo-group-6",
          about: "This is the second demo group",
          type: "online",
          isPrivate: true,
          city: "Los Angeles",
          state: "CA",
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["demo-group-1", "demo-group-2"] },
      },
      {}
    );
  },
};
