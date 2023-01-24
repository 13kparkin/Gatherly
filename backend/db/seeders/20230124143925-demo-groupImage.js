'use strict';


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    return queryInterface.bulkInsert(options,[
      {
        groupId: 1,
        url: 'https://example.com/event1/image1.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://example.com/event1/image2.jpg',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://example.com/event2/image1.jpg',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "GroupImages";

  }
};
