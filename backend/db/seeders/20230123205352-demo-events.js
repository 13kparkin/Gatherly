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
          name: "Demo-Event-1",
          description: "This is the first demo event",
          type: "Conference",
          capacity: 100,
          price: 50.0,
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          name: "Demo-Event-1",
          description: "This is the second demo event",
          type: "Workshop",
          capacity: 50,
          price: 25.0,
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          name: "Demo-Event-3",
          description: "This is the third demo event",
          type: "Conference",
          capacity: 200,
          price: 20.0,
          startDate: new Date(),
          endDate: new Date(),
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
