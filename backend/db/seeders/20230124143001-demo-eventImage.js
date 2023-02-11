import eventImage1 from '../../images/eventImages/event1.jpg';
import eventImage2 from '../../images/eventImages/event2.jpg';
import eventImage3 from '../../images/eventImages/event3.jpg';
import eventImage4 from '../../images/eventImages/event4.jpg';
import eventImage5 from '../../images/eventImages/event5.jpg';
import eventImage6 from '../../images/eventImages/event6.jpg';

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
        preview: false
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
        preview: false
      },
      {
        eventId: 6,
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
