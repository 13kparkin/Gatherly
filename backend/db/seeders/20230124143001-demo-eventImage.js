'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "EventImages";
    return queryInterface.bulkInsert(options,[
      {
        eventId: 1,
        url: 'https://example.com/event1/image1.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://example.com/event1/image2.jpg',
        preview: false
      },
      {
        eventId: 2,
        url: 'https://example.com/event2/image1.jpg',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "EventImages";
    return queryInterface.bulkDelete(options, null, {});
  }
};
