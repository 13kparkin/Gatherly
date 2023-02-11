"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.bulkInsert(
      options,
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Demo-Event-1",
          description: "This is the first demo event",
          type: "in person",
          capacity: 100,
          price: 50.00,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-20 22:00:00"
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Demo-Event-2",
          description: "This is the second demo event",
          type: "in person",
          capacity: 50,
          price: 25.00,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-20 22:00:00"
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Demo-Event-3",
          description: "This is the third demo event",
          type: "online",
          capacity: 200,
          price: 20.00,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-20 22:00:00"
        },
        {
          venueId: 4,
          groupId: 4,
          name: "Demo-Event-4",
          description: "This is the forth demo event",
          type: "in person",
          capacity: 100,
          price: 50.00,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-20 22:00:00"
        },
        {
          venueId: 5,
          groupId: 5,
          name: "Demo-Event-5",
          description: "This is the fith demo event",
          type: "in person",
          capacity: 50,
          price: 25.00,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-20 22:00:00"
        },
        {
          venueId: 6,
          groupId: 6,
          name: "Demo-Event-6",
          description: "This is the sixth demo event",
          type: "online",
          capacity: 200,
          price: 20.00,
          startDate: "2021-11-19 20:00:00",
          endDate: "2021-11-20 22:00:00"
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Demo-Event-1", "Demo-Event-2", "Demo-Event-3"] },
      },
      {}
    );
  },
};
