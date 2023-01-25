'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Attendances";
    return queryInterface.bulkInsert(options, [
      {
        status: "waitlist",
      },
      {
        status: "pending",
      },
      {
        status: "member",
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Attendances";
    return queryInterface.bulkDelete(options, null, {});
  }
};