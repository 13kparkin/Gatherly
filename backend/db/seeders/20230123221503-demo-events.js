"use strict";
const moment = require("moment");

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
          name: "Spring Music Festival",
          description: "Join us for a weekend of live music and fun!",
          type: "in person",
          capacity: 1000,
          price: 75.0,
          startDate: moment().add(2, 'months').startOf('day').hour(17).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(2, 'months').startOf('day').add(2, 'days').hour(23).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Tech Conference 2023",
          description: "The must-attend conference for tech enthusiasts",
          type: "in person",
          capacity: 500,
          price: 250.0,
          startDate: moment().add(3, 'months').startOf('day').hour(9).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(3, 'months').startOf('day').add(3, 'days').hour(17).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 3,
          name: "Virtual Art Exhibition",
          description: "Experience art from around the world from the comfort of your own home",
          type: "online",
          capacity: 1000,
          price: 20.0,
          startDate: moment().add(1, 'month').startOf('day').hour(10).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(1, 'month').startOf('day').add(1, 'week').hour(18).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 3,
          name: "Wine Tasting and Pairing",
          description: "Learn about different wines and food pairings with our expert sommeliers",
          type: "in person",
          capacity: 50,
          price: 150.0,
          startDate: moment().add(4, 'months').startOf('day').hour(19).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(4, 'months').startOf('day').add(1, 'days').hour(22).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Entrepreneurship Summit",
          description: "Connect with other entrepreneurs and learn about the latest trends and strategies",
          type: "in person",
          capacity: 500,
          price: 100.0,
          startDate: moment().add(5, 'months').startOf('day').hour(8).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(5, 'months').startOf('day').add(2, 'days').hour(18).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 1,
          name: "Spring Music Festival",
          description: "Join us for a weekend of live music and fun!",
          type: "in person",
          capacity: 1000,
          price: 75.0,
          startDate: moment().add(2, 'months').startOf('day').hour(17).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(2, 'months').startOf('day').add(2, 'days').hour(23).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Tech Conference 2023",
          description: "The must-attend conference for tech enthusiasts",
          type: "in person",
          capacity: 500,
          price: 250.0,
          startDate: moment().add(3, 'months').startOf('day').hour(9).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(3, 'months').startOf('day').add(3, 'days').hour(17).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 3,
          name: "Virtual Art Exhibition",
          description: "Experience art from around the world from the comfort of your own home",
          type: "online",
          capacity: 1000,
          price: 20.0,
          startDate: moment().add(1, 'month').startOf('day').hour(10).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(1, 'month').startOf('day').add(1, 'week').hour(18).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 3,
          name: "Wine Tasting and Pairing",
          description: "Learn about different wines and food pairings with our expert sommeliers",
          type: "in person",
          capacity: 50,
          price: 150.0,
          startDate: moment().add(4, 'months').startOf('day').hour(19).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(4, 'months').startOf('day').add(1, 'days').hour(22).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Entrepreneurship Summit",
          description: "Connect with other entrepreneurs and learn about the latest trends and strategies",
          type: "in person",
          capacity: 500,
          price: 100.0,
          startDate: moment().add(5, 'months').startOf('day').hour(8).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(5, 'months').startOf('day').add(2, 'days').hour(18).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
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
