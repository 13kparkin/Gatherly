"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    return queryInterface.bulkInsert(options, [
      {
        userId: "1",
        groupId: "1",
        status: "co-host",
      },
      {
        userId: "2",
        groupId: "1",
        status: "pending",
      },
      {
        userId: "3",
        groupId: "2",
        status: "member",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    return queryInterface.bulkDelete(options, null, {});
  },
};
