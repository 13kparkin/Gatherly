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
        groupId: "1",
        status: "co-host",
      },
      {
        groupId: "1",
        status: "Pending",
      },
      {
        groupId: "2",
        status: "member",
      },
      {
        groupId: "2",
        status: "member",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    return queryInterface.bulkDelete(options, null, {});
  },
};
