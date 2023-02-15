const eventImage1 = 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg';
const eventImage2 = 'https://images.pexels.com/photos/382297/pexels-photo-382297.jpeg';
const eventImage3 = 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg';
const eventImage4 = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg';
const eventImage5 = 'https://images.pexels.com/photos/787961/pexels-photo-787961.jpeg';
const eventImage6 = 'https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg';

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
        url: eventImage1,
        preview: true
      },
      {
        eventId: 2,
        url: eventImage2,
        preview: true
      },
      {
        eventId: 3,
        url: eventImage3,
        preview: true
      },
      {
        eventId: 4,
        url: eventImage4,
        preview: true
      },
      {
        eventId: 5,
        url: eventImage5,
        preview: true
      },
      {
        eventId: 6,
        url: eventImage6,
        preview: true
      },
      {
        eventId: 7,
        url: eventImage6,
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "EventImages";
    return queryInterface.bulkDelete(options, null, {});
  }
};
